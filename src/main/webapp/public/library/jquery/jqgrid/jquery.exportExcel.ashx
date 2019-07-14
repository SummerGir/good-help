<%@ WebHandler Language="C#" Class="jquery_exportExcel" %>

using System;
using System.Web;
using System.Xml.Linq;
using System.Linq;

public class jquery_exportExcel : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        XDocument excelXDocument = XDocument.Load(context.Server.MapPath("jquery.exportExcel.xml"));

        string namespaceName = "urn:schemas-microsoft-com:office:spreadsheet";

        XElement excelXElement = excelXDocument.Root;

        XElement tableXElement = excelXElement.Element(XName.Get("Worksheet", namespaceName)).Element(XName.Get("Table", namespaceName));

        XElement dataXElement = XElement.Parse(context.Request.Form["data"]);

        string[] cols = dataXElement.Descendants("cell").Select(c => c.Attribute("name").Value).ToArray().Distinct().ToArray();

        XElement rowXElement;
        rowXElement = new XElement(XName.Get("Row", namespaceName));
        for (int i = 0, j = cols.Length; i < j; i++)
        {
            rowXElement.Add(new XElement(XName.Get("Cell", namespaceName),
                                new XElement(XName.Get("Data", namespaceName),
                                    new XAttribute(XName.Get("Type", namespaceName), "String"),
                                    new XText(cols[i]))));
        }
        tableXElement.Add(rowXElement);

        foreach (XElement rowData in dataXElement.Elements("row"))
        {
            rowXElement = new XElement(XName.Get("Row", namespaceName));
            for (int i = 0, j = cols.Length; i < j; i++)
            {
                XElement cellData = rowData.Elements("cell").Where(c => c.Attribute("name").Value == cols[i]).FirstOrDefault();
                string type = "string";
                string value = string.Empty;

                if (cellData != null)
                {
                    type = cellData.Attribute("type").Value;
                    value = cellData.Value;
                }

                rowXElement.Add(new XElement(XName.Get("Cell", namespaceName),
                                    new XElement(XName.Get("Data", namespaceName),
                                        new XAttribute(XName.Get("Type", namespaceName), "String"),
                                        new XText(value))));
            }
            tableXElement.Add(rowXElement);
        }

        namespaceName = "urn:schemas-microsoft-com:office:office";

        string tmpUserName = string.Empty;
        try
        {
            tmpUserName = EIIS.User.Current.Name;
        }
        catch { }

        excelXElement.Element(XName.Get("DocumentProperties", namespaceName))
                     .Element(XName.Get("Created", namespaceName)).Value = DateTimeOffset.Now.ToString();
        excelXElement.Element(XName.Get("DocumentProperties", namespaceName))
                     .Element(XName.Get("Author", namespaceName)).Value = tmpUserName;
        excelXElement.Element(XName.Get("DocumentProperties", namespaceName))
                     .Element(XName.Get("LastAuthor", namespaceName)).Value = tmpUserName;

        context.Response.ContentType = "application/vnd.ms-excel";
        context.Response.AppendHeader("Content-Disposition", "attachment; filename=\"exportExcel.xml\"");

        context.Response.Write(excelXDocument.ToString());
        //excelXDocument.Save(context.Response.OutputStream);


    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}