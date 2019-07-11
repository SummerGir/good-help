<%@ page import="eiis.applicationlibrary.internal.TAppTemplateItem" %>
<%@ page import="java.util.List" %>
<%@ page import="javax.persistence.EntityManager" %>
<%@ page import="eiis.applicationlibrary.Helper" %>
<%@ page import="eiis.util.AppTemItemLR" %>
<%@ page import="eiis.util.spring.ApplicationContext" %><%--
  Created by IntelliJ IDEA.
  User: Yihu
  Date: 2017/12/7
  Time: 11:19
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    AppTemItemLR instance = ApplicationContext.getCurrent().getBean(AppTemItemLR.class);

    instance.createDicLRVal();
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
完成
</body>
</html>
