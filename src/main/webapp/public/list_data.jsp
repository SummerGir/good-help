<%@ page contentType="text/xml; charset=utf-8"%>
<%@ page import="javax.sql.RowSet"%>
<%@ page import="eiis.util.Tool"%>
<%
	RowSet crs = (RowSet) request.getAttribute("rowset");
	out.print(Tool.parseCRSToJson(crs));
%>
