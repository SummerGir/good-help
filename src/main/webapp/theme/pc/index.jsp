<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/18
  Time: 15:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String menuCode = "index";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <style>
            h4{
                color: blue;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <h4>这里是首页</h4>
    </master:Content>
</master:ContentPage>
