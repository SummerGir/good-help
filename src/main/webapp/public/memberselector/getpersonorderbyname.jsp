<%@page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@page import="eiis.membership.Dept" %>
<%@page import="eiis.membership.Person" %>
<%@page import="eiis.util.UUIDUtils" %>
<%@page import="eiis.util.jquery.DynatreeChildren" %>
<%@page import="eiis.util.jquery.DynatreeChildrenComparator" %>
<%@page import="eiis.util.json.JsonUtils" %>
<%@page import="org.apache.commons.lang3.StringUtils" %>
<%@page import="java.io.StringWriter" %>
<%@page import="java.util.ArrayList" %>
<%@page import="java.util.Collections" %>
<%@ page import="java.util.List" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%!
    private String toJson(Object obj) {
        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.writeValue(sw, obj);
        } catch (Exception e) {
        }
        String json = sw.toString();
        return json;
    }
%>

<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("json");

    String isDept = request.getParameter("dept");
    String isPost = request.getParameter("post");
    String isPerson = request.getParameter("person");
    String selectRoot = request.getParameter("selectRoot");
    String attr = request.getParameter("attr");
    String freeze = request.getParameter("freeze");

    boolean tmpDept = false;
    if (isDept != null && (isDept.equalsIgnoreCase("true") || isDept.equalsIgnoreCase("1") || isDept.equalsIgnoreCase("yes")))
        tmpDept = true;
    boolean tmpPost = false;
    if (isPost != null && (isPost.equalsIgnoreCase("true") || isPost.equalsIgnoreCase("1") || isPost.equalsIgnoreCase("yes")))
        tmpPost = true;
    boolean tmpPerson = false;
    if (isPerson != null && (isPerson.equalsIgnoreCase("true") || isPerson.equalsIgnoreCase("1") || isPerson.equalsIgnoreCase("yes")))
        tmpPerson = true;
    boolean tmpFreeze = false;
    if (freeze != null && (freeze.equalsIgnoreCase("true") || freeze.equalsIgnoreCase("1") || freeze.equalsIgnoreCase("yes")))
        tmpFreeze = true;
    boolean tmpSelectRoot = false;
    if (selectRoot != null && (selectRoot.equalsIgnoreCase("true") || selectRoot.equalsIgnoreCase("1") || selectRoot.equalsIgnoreCase("yes")))
        tmpSelectRoot = true;

    List<DynatreeChildren> list = new ArrayList<DynatreeChildren>();

    String boundid = request.getParameter("root");
    if (StringUtils.isBlank(boundid)) {
        boundid = Dept.getTopDept().getId().toString();
    }
    for (String id : boundid.split(";")) {
        if (!StringUtils.isBlank(id)) {
            Dept rootDept = Dept.get(UUIDUtils.parse(id));
            for (Person p : rootDept.getDescendantPersons()) {
                //System.out.println(p.getName() + " | " + String.valueOf(p.isFrozen()) + " | " + String.valueOf(tmpFreeze));
                if (tmpFreeze) {
                    DynatreeChildren root = new DynatreeChildren();
                    root.setTitle(p.getName());
                    root.setKey(p.getId().toString());
                    root.setIcon("/theme/current/icons/person.png");
                    if (rootDept.isFrozen()) root.setAddClass("ui-state-disabled");
                    list.add(root);
                } else {
                    if (p.isFrozen()) continue;
                    DynatreeChildren root = new DynatreeChildren();
                    root.setTitle(p.getName());
                    root.setKey(p.getId().toString());
                    root.setIcon("/theme/current/icons/person.png");
                    //if(rootDept.isFrozen()) root.setAddClass("ui-state-disabled");
                    list.add(root);
                }
            }
        }
    }

    Collections.sort(list, new DynatreeChildrenComparator());
    JsonUtils.write(response.getOutputStream(), list);
%>