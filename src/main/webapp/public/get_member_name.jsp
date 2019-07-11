<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.*"%>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.membership.Member" %>
<%@ page import="eiis.membership.Person" %>
<%
	out.clear();
	String id=request.getParameter("id");
	String account=request.getParameter("account");
	Member member = null;
	if(StringUtils.isNotBlank(id)){
		member = Member.get(UUID.fromString(id));
	}else if(StringUtils.isNotBlank(account)){
		member = Person.get(account);
	}
	if(member != null){
		out.print("{\"name\":\""+member.getName()+"\"}");
	}else{
		out.print("{}");
	}
%>
