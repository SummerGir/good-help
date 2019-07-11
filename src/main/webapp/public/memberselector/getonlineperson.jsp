<%@page import="eiis.membership.UserSession" %>
<%@page import="eiis.util.jquery.DynatreeChildren" %>
<%@page import="eiis.util.jquery.DynatreeChildrenComparator" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.TreeSet" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("json");

    Set<DynatreeChildren> list = new TreeSet<DynatreeChildren>(new DynatreeChildrenComparator());

    for (UserSession u : UserSession.get(0, UserSession.getMaxSessionAmount())) {
        DynatreeChildren node = new DynatreeChildren();
        node.setTitle(u.getData("Person Name"));
        node.setKey(u.getPersonId().toString());
        node.setIcon("/theme/current/icons/person.png");
        //node.setSelect(true);
        if (!list.contains(node)) {
            list.add(node);
        }
    }
    JsonUtils.write(response.getOutputStream(), list);

%>