<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    String filePath = request.getParameter("filePath");
    Map<String,Object> outMap = new HashMap<String, Object>();
    try {
        Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
        String displayUri = attachment.getDisplayUri();
        outMap.put("displayUri",displayUri);
        outMap.put("flag",true);
    } catch (Exception e) {
        outMap.put("flag",false);
    }

    JsonUtils.write(out,outMap);

%>
