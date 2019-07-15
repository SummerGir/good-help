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

  String value = request.getParameter("upload");
  String dirCode = request.getParameter("code");
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
      if(StringUtils.isBlank(isSource)){
        String tag="";
        if(dirCode.equals("001")) tag = "tmpfile";
        entities = documentService.uploadFile(value,directoryService.getDirIdByCode(dirCode),tag);
      }else{
        if(StringUtils.isNotBlank(sourceKind) || StringUtils.isNotBlank(formCode)){
          /*有code，kind  能算出类型，直接存往目标地址， for 流程*/
          boolean isSou = "true".equals(isSource);
          String codePath = directoryService.makeCodePath(projectId, sourceKind,isSou);
          entities = documentService.uploadFile(value, directoryService.getDirIdByCode(codePath ),formCode);
        }else {
        /*无code 上传到临时路径，保存业务单的时候再去剪切*/
//          entities = documentService.uploadFile(value, directoryService.getDirIdByCode("001_tmp_" + UUID.randomUUID().toString()));
          /*一个文件一个文件夹 所以分开保存*/
          String[] uris = value.split("\\|");
          for(String uri :uris){
            entities.addAll(documentService.uploadFile(uri, directoryService.getDirIdByCode("001_tmp"),UUID.randomUUID().toString()));
          }
        }
      }

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
//    out.close();
  }else{
    out.clear();
//    out.close();
  }
%>