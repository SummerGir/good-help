<%@ page import="eiis.util.nio.FileName" %>
<%@ page import="java.nio.file.Paths" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    private static final Map<String, String> icons = new HashMap<String, String>();

    static {
        icons.put("doc", "icons/word.ico");
        icons.put("docx", "icons/word.ico");
        icons.put("xls", "icons/excel.ico");
        icons.put("xlsx", "icons/excel.ico");
        icons.put("ppt", "icons/ppt.ico");
        icons.put("pptx", "icons/ppt.ico");
    }

%>
<%
    out.clear();
    //out = pageContext.pushBody();

    String url = request.getParameter("url");
    if (eiis.io.Support.getContentType(url).startsWith("image/")) {
        url = url.replace("/file/download/","");
        request.getRequestDispatcher("/file/display/" + url).forward(request, response);
        return;
    } else {
        String ext = FileName.getExtension(Paths.get(url)).toLowerCase();
        if (icons.containsKey(ext)) {
            response.setContentType(eiis.io.Support.getContentType(icons.get(ext)));
            request.getRequestDispatcher(icons.get(ext)).forward(request, response);
            return;
        }
    }
    response.setContentType(eiis.io.Support.getContentType("icons/document.ico"));
    request.getRequestDispatcher("icons/document.ico").forward(request, response);
    return;
%>