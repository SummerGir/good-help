<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.*"%>
<%@ page import="com.cdtskj.util.*"%>
<%@ page import="javax.sql.rowset.CachedRowSet"%>
<%@page import="com.cdtskj.util.Dictionary"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="net.sf.json.JSONArray"%>
<%
String dic_code=request.getParameter("dic_code");
String item_code=request.getParameter("item_code");
String result="";
if (dic_code==null || item_code==null)
  	result="";
else
{
    Delegate dg=new Delegate("");
    String sql="select * from core_dictionary_type where dic_code=?";
	Hashtable<String,String> arg=new Hashtable<String,String>();
	arg.put("0", dic_code);
	CachedRowSet crsD=(CachedRowSet)dg.getCRS(sql, arg);
	JSONObject jsonObject =new JSONObject();
	if (crsD!=null && crsD.next())
	{
	    String type=crsD.getString("Structure_type");
	    String type_id=crsD.getString("type_id");
	     
	     jsonObject.put("type",type );
	     if (type.equals("1"))
	     {
	          sql="select * from core_dictionary_item where type_id=? and del_sign='0' order by format_code";
			  arg.clear();
			  arg.put("0", type_id);
			  CachedRowSet crs = (CachedRowSet)dg.getCRS(sql, arg);
			  List<Map> jsonArray=new ArrayList<Map>();
			  int i=0;
			  while (crs.next()) {			     
			      Map<String,String> item =new HashMap<String,String>();
			      jsonArray.add(i++, item);
			      item.put("item_id", ""+i);			      
			      item.put("item_code", crs.getString("item_code"));
			      item.put("item_name", crs.getString("item_name"));
			      //Debuger.print("item",item);
			  }
			  jsonObject.put("items", jsonArray);
	     }
	     else if (type.equals("2"))
	     {// 树型结构
	         jsonObject.put("item_name",com.cdtskj.util.Dictionary.getInstance().getDicItemName(dic_code,item_code) );
	     }
	}     
    result=jsonObject.toString();
}
 out.print(result);
%>
