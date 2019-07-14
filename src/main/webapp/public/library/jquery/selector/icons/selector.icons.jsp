<%@ page import="eiis.util.jquery.DynatreeChildren" %>
<%@ page import="eiis.util.jquery.DynatreeChildrenComparator" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.TreeSet" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%

    String rootPath = request.getServletContext().getRealPath(eiis.context.Context.getCurrent().getThemePath() + "icons");
    String key = request.getParameter("Key");
    if (key == null) {
        key = "";
    } else {
        key = StringUtils.removeStart(key, "/theme/current/icons");
    }
    key += "/";
    Set<DynatreeChildren> pathFileSet = new TreeSet<DynatreeChildren>(new DynatreeChildrenComparator());
    Set<DynatreeChildren> pathDirectorySet = new TreeSet<DynatreeChildren>(new DynatreeChildrenComparator());
    for (File f : (new File(rootPath, key)).listFiles()) {
        DynatreeChildren dc = new DynatreeChildren();
        String fKey = "/theme/current/icons" + key + f.getName();
        dc.setTitle(f.getName());
        dc.setTooltip(fKey);
        dc.setKey(fKey);
        if (f.isDirectory()) {
            dc.setIsFolder(true);
            dc.setUnselectable(true);
            dc.setIsLazy(true);
            pathDirectorySet.add(dc);
        } else {
            dc.setIcon(fKey);
            pathFileSet.add(dc);
        }
    }

    List<DynatreeChildren> list = new ArrayList<DynatreeChildren>();
    list.addAll(pathDirectorySet);
    list.addAll(pathFileSet);

//    response.setContentType("json");
//    JsonUtils.write(out, list);

    response.setContentType("json");
    out.clear();
    out = pageContext.pushBody();
    JsonUtils.write(response.getOutputStream(), list);
%>