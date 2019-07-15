<%@ page import="eiis.app.netdisk.service.AppNetdiskDirectoryService" %>
<%@ page import="eiis.app.netdisk.entity.AppNetdiskDirectoryEntity" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.app.netdisk.service.DirectoryView" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page import="java.util.ArrayList" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    AppNetdiskDirectoryService directoryService = eiis.util.spring.ApplicationContext.getCurrent().getBean(AppNetdiskDirectoryService.class);

    String random = request.getParameter("random");
    String dirCode = request.getParameter("dirId");
    String order = request.getParameter("order");
    String[] values = request.getParameterValues("values");
    List<String> valueList = new ArrayList<String>();
    if(values != null) valueList = java.util.Arrays.asList(values);

    List<DirectoryView> list = new ArrayList<DirectoryView>();
    if(!Strings.isNullOrEmpty(dirCode)){
        list = directoryService.findFile(dirCode, Context.getCurrent().getId().toString());
    }
    if("1".equals(order)){
        list.addAll(directoryService.findFile(directoryService.findOneByDirectoryCode("001_PRIVATE").getDirectoryId(),Context.getCurrent().getId().toString()));
    }

%>
<%
    for(DirectoryView dir : list){

%>
<div class="row netdisk-item">
    <%
        if("2".equals(dir.getKind())){//2 目录，1 文件
    %>
    <div onclick="fileClick(this)"  class="col-md-12 "  data-dir-id="<%=dir.getId()%>" data-file-kind="<%=dir.getKind()%>">
        <i class="fa fa-folder"></i> &nbsp;<a href="javascript:;"><%=dir.getName()%></a>
    </div>
    <%
        }else{
    %>
    <div onclick="fileClick(this)"  class="col-md-12 <%=valueList.contains(dir.getId()) ? "activated" : ""%>" data-file-path="<%=dir.getFilePath()%>"  data-dir-id="<%=dir.getId()%>" data-file-kind="<%=dir.getKind()%>">
        <span><%=dir.getName()%></span>
        <a href="<%=dir.getFilePath()%>" style="float: right">下 载</a>
    </div>
    <%
        }
    %>

</div>
<%
    }
%>
