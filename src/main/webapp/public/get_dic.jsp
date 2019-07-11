<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="eiis.core.dictionary.EiisDictionaryItem"%>
<%
	String dic_code = request.getParameter("dic_code");
	EiisDictionaryItem item = new EiisDictionaryItem();
	out.print(item.getJsonItemsByDicCode(dic_code));
%>
