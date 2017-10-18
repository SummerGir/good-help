<%@ taglib prefix="master" uri="util.masterPage" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/18
  Time: 15:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">子页面</master:Content>
    <master:Content contentPlaceHolderId="head">
        <style>
            h4{
                color: blue;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <h4>这里是b.jsp</h4>
    </master:Content>
</master:ContentPage>
