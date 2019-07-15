<%@ page import="com.google.common.base.Strings" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="eiis.app.netdisk.service.AppNetdiskDocumentService" %>
<%@ page import="eiis.app.netdisk.service.AppNetdiskDirectoryService" %>
<%@ page import="eiis.app.netdisk.service.DirectoryView" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.*" %>
<%--
  Created by IntelliJ IDEA.
  User: wy
  Date: 2015/9/21
  Time: 9:54
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%

  AppNetdiskDocumentService documentService = eiis.util.spring.ApplicationContext.getCurrent().getBean(AppNetdiskDocumentService.class);
  AppNetdiskDirectoryService directoryService = eiis.util.spring.ApplicationContext.getCurrent().getBean(AppNetdiskDirectoryService.class);

  String value = request.getParameter("value");
  String isSource = request.getParameter("isSource");
  String projectId = request.getParameter("projectId");
  String sourceKind = request.getParameter("sourceKind");
  String formCode = request.getParameter("formCode");
  if(!Strings.isNullOrEmpty(value)){
    ObjectMapper mapper = new ObjectMapper();
    Map<String,Object> map = new HashMap<String,Object>();
    List<String> ids = new ArrayList<String>();
    List<Object> items = new ArrayList<Object>();
    map.put("ids",ids);
    map.put("items", items);

    out.clear();
    try {
      List<DirectoryView> entities = new ArrayList<DirectoryView>();
      boolean isSou = "true".equals(isSource);
      String codePath = directoryService.makeCodePath(projectId, sourceKind,isSou);
      entities.addAll(documentService.copyFiles(value, directoryService.getDirIdByCode(codePath),formCode));
      
      for(DirectoryView entity : entities){
        ids.add(entity.getId());
        Map<String,Object> _item = new HashMap<String,Object>();
        _item.put("id", entity.getId());
        _item.put("name", entity.getName());
        _item.put("url",entity.getFilePath());
        items.add(_item);
      }
      out.print(mapper.writeValueAsString(map));
    }catch (Exception e){
      out.print(e.getMessage());
    }
  }else{
    out.clear();
  }
%>