<%@ page import="eiis.app.daily.DailyService" %>
<%@ page import="eiis.app.attendance.LBSJobs" %><%--
  Created by IntelliJ IDEA.
  User: YiHu
  Date: 2018/4/12
  Time: 13:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
   
    LBSJobs.createWorkTimeJob();
    LBSJobs.calcResultJob();
    LBSJobs.calcKQRemindJob();
%>
<html>
<head>
    <title>Title</title>
    <script src="/public/jquery/jquery-1.11.3.js" type="text/javascript"></script>
    <script src="/public/js/dom-to-image.min.js" type="text/javascript"></script>
    <style>
        :root {
            --color1: #ddd;
            --border1: 1px solid var(--color1);
        }
        .table{width: 350px;border: var(--border1);border-collapse: collapse;text-align: center;}
        .table tr{border-bottom: var(--border1);}
        .table td{border-right: var(--border1);}
        .table tr:last-child{border-bottom: none;}
        .table td:last-child{border-right:none;}
    </style>
</head>
<body>
生成 文档
</body>
</html>
