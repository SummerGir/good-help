<%@ page import="java.nio.file.Paths" %>
<%@ page import="java.nio.file.Path" %>
<%@ page import="java.nio.file.Files" %>
<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page import="eiis.io.relevant.RelevantFileFactory" %>
<%--
  Created by IntelliJ IDEA.
  User: wy
  Date: 2015/9/10
  Time: 14:28
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%

  String file = request.getParameter("file");
  if(Strings.isNullOrEmpty(file)){
    response.sendRedirect("/file/download/error");
  }

  Attachment attachment = AttachmentUtils.getAttachByUri(file);

  String _out = "";
  long lastModified = attachment.getPath().toFile().lastModified();
  Path _transformedFile = Paths.get(attachment.getRealPath().replace(attachment.getName(), "") + "\\preview\\" + attachment.getName().replace(".pdf", "") + "_" + lastModified + ".html");
  boolean isDone = false;
  if(!Files.exists(_transformedFile)){
    try {
      _transformedFile = RelevantFileFactory.getPreview(attachment.getPath());
      isDone = true; //document.pdf2Html(Paths.get(attachment.getRealPath()), _transformedFile);
    }catch (Exception e){
      isDone = false;
    }

    if(isDone){
      attachment = eiis.io.AttachmentUtils.getAttachByPath(_transformedFile);
      //response.sendRedirect(attachment.getDisplayUri());
      _out = attachment.getDisplayUri();
    }else{
      //response.sendRedirect(attachment.getDownloadUri());
      _out = attachment.getDownloadUri();
    }
  }else{
    attachment = eiis.io.AttachmentUtils.getAttachByPath(_transformedFile);
    //response.sendRedirect(attachment.getDisplayUri());
    _out = attachment.getDisplayUri();
  }
  out.clear();
  out.print(_out);
  out.close();
%>
<html>
<head>
    <title></title>
</head>
<body>
</body>
</html>
