<%@ page import="eiis.app.simpleremind.service.AppSimpleRemindJobService" %>
<%@ page import="eiis.util.mvc.jsp.BaseHandler" %>
<%--
  Created by IntelliJ IDEA.
  User: xsb
  Date: 2016/9/28
  Time: 10:59
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    AppSimpleRemindJobService service=AppSimpleRemindJobService.getInstance();

    class Action extends BaseHandler {

        public String getRemindById() {
            String mainId = request.getParameter("mainId");
            return service.getRemindById(mainId);
        }

    }
%>
<%
    new Action().action(request, response);
%>