<%@page import="org.dom4j.DocumentHelper"%>
<%@page import="org.dom4j.Document"%>
<%@page import="org.dom4j.Element"%>
<%@page import="eiis.membership.Dept"%>
<%@page import="eiis.membership.Helper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
	response.setContentType("text/xml");
	Document doc = DocumentHelper.createDocument(org.dom4j.DocumentHelper.createElement("Root"));
	Element root = doc.getRootElement();
	
	String isDept = request.getParameter("dept");
	String isPost = request.getParameter("post");
	String isPerson = request.getParameter("person");
	
	boolean tmpDept = false;
	if(isDept != null && (isDept.equalsIgnoreCase("true") || isDept.equalsIgnoreCase("1") || isDept.equalsIgnoreCase("yes"))) tmpDept = true;
	boolean tmpPost = false;
	if(isPost != null && (isPost.equalsIgnoreCase("true") || isPost.equalsIgnoreCase("1") || isPost.equalsIgnoreCase("yes"))) tmpPost = true; 
	boolean tmpPerson = false;
	if(isPerson != null && (isPerson.equalsIgnoreCase("true") || isPerson.equalsIgnoreCase("1") || isPerson.equalsIgnoreCase("yes"))) tmpPerson = true; 
	
	if(tmpDept){
		Element element = DocumentHelper.createElement("Dept");
		root.add(element);
	}
	if(tmpPost){
		Element element = DocumentHelper.createElement("Post");
		root.add(element);
	}
	if(tmpPerson){
		Element element = DocumentHelper.createElement("Person");
		root.add(element);
	}

    String xml = root.asXML();
	out.print(xml);
%>