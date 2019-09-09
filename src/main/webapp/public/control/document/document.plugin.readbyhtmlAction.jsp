<%@ page import="eiis.controller.app.changefieltype.cutOutPdf" %>
<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="eiis.io.relevant.RelevantFileFactory" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="java.nio.file.Path" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    String filePath = request.getParameter("filePath");
    Map<String,Object> outMap = new HashMap<String, Object>();
    try {
        Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
        Path htmlPath = RelevantFileFactory.getPreview(attachment.getPath());
        String displayUri = AttachmentUtils.getAttachByPath(htmlPath).getDisplayUri();
        Path pdfPath=null;
        if(attachment.getPath().toString().endsWith("pdf") || attachment.getPath().toString().endsWith("PDF")){
            pdfPath = attachment.getPath();
        }else{
            pdfPath = RelevantFileFactory.getPrint(attachment.getPath());
        }
        pdfPath = cutOutPdf.getNewFile(pdfPath);

        String pdfUri = AttachmentUtils.getAttachByPath(pdfPath).getDisplayUri();
        outMap.put("displayUri",displayUri);
        outMap.put("pdfUri",pdfUri);
        outMap.put("flag",true);
    } catch (Exception e) {
        outMap.put("flag",false);
    }

    JsonUtils.write(out,outMap);

%>
