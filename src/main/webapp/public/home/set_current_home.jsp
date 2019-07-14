<%@ page language="java" pageEncoding="UTF-8" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ taglib uri="eiis.widgets" prefix="widgets" %>
<%
    String json = "{\"msg\":\"%s!\",\"error\":%s,\"data\":%s}";
    String homeCode = request.getParameter("homeCode");
    if(!Strings.isNullOrEmpty(homeCode)){
        eiis.context.Context.getCurrent().setCurrentHome(homeCode);
    }
    json = String.format(json,"操作成功",0,"null");
    response.setContentType("json");
    response.getWriter().print(json);
    response.getWriter().close();
%>