<%@ page import="eiis.app.labour.service.LabourCheckService" %><%--
  Created by IntelliJ IDEA.
  User: YiHu
  Date: 2018/8/6
  Time: 17:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>劳务对账单初始化</title>
</head>
<body>
<%=LabourCheckService.getInstance().Init_oldData()%>
</body>
</html>
