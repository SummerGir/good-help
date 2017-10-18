<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <!--子页面标题内容-->
    <title>
        <master:ContentPlaceHolder id="title"/>
    </title>
    <!--子页面head中的内容-->
    <master:ContentPlaceHolder id="head"/>
</head>
<body>
<h1>这里是首页</h1>
<div style="border:1px solid red;width: 100px;height: 100px;">
    <!--子页面中的正文-->
    <master:ContentPlaceHolder id="body"/>
</div>

</body>

</html>
