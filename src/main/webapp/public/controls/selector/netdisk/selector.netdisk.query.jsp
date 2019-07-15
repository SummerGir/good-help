<%@ page import="eiis.app.netdisk.service.AppNetdiskDirectoryService" %>
<%@ page import="eiis.app.netdisk.entity.AppNetdiskDirectoryEntity" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.app.netdisk.service.DirectoryView" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Collections" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="eiis.app.netdisk.service.AppNetdiskDocumentService" %>
<%@ page import="eiis.app.netdisk.entity.AppNetdiskFileInfoEntity" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    AppNetdiskDocumentService documentService = eiis.util.spring.ApplicationContext.getCurrent().getBean(AppNetdiskDocumentService.class);

    ObjectMapper objectMapper = new ObjectMapper();

    String[] values = request.getParameterValues("values");
    List<String> valueList = new ArrayList<String>();
    if(values != null) valueList = java.util.Arrays.asList(values);

    List<DirectoryView> files = documentService.getFiles(valueList);

    out.clear();
    out.print(objectMapper.writeValueAsString(files));
//    out.close();
%>