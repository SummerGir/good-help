<%@ page import="eiis.app.netdisk.service.AppNetdiskDirectoryService" %>
<%@ page import="eiis.app.netdisk.entity.AppNetdiskDirectoryEntity" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.app.netdisk.service.DirectoryView" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Collections" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="eiis.membership.Person" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    .netdisk-item{
        margin: 3px 0px;
        padding: 1px 0px;
    }
    .netdisk-item:hover{
        background-color: #ddd;
        cursor: pointer;
    }
    .netdisk-item .selected{
        background-color: #d9edf7;
    }

    .netdisk-paths {
        list-style-type: none;
        padding-left:5px;
    }
    .netdisk-paths li{
        float: left;
        height: 22px;
        padding: 1px 2px;
        cursor:pointer;
    }
    .netdisk-paths li:hover{
        background-color: #ddd;
    }

</style>
<%
    AppNetdiskDirectoryService directoryService = eiis.util.spring.ApplicationContext.getCurrent().getBean(AppNetdiskDirectoryService.class);
    Person person = Context.getCurrent().getUser().getPerson();
    ObjectMapper objectMapper = new ObjectMapper();

    String random = request.getParameter("random");
    String dirCode = request.getParameter("dirCode");
    String[] values = request.getParameterValues("values");
    String isSource = request.getParameter("isSource");
    String projectId = request.getParameter("projectId");
    List<String> valueList = new ArrayList<String>();
    if(values != null) valueList = java.util.Arrays.asList(values);
    List<DirectoryView> list = new ArrayList<DirectoryView>();
    AppNetdiskDirectoryEntity directoryEntity;
    if(StringUtils.isBlank(isSource)){
        directoryEntity= directoryService.findOneByDirectoryCode(dirCode);
        if(directoryEntity!=null){
            list = directoryService.findFile(directoryEntity.getDirectoryId(), person.getId().toString());
        }
    }else{
        if(StringUtils.isNotBlank(projectId)){
            directoryEntity = directoryService.findOneByDirectoryCode("001_XMB_"+projectId);
            if(directoryEntity!=null){
                list.addAll(directoryService.findFile(directoryEntity.getDirectoryId(), person.getId().toString()));
            }
        }else{
            directoryEntity = directoryService.findDIrById( directoryService.getDirIdByCode("001_PRIVATE") );
        }
        list.addAll(directoryService.findFile(directoryService.getDirIdByCode("001_PRIVATE"), person.getId().toString()));
    }
%>
<script type="text/javascript">
    $(document).ready(function () {
        $(".fa-hover").click(function () {
            $("#eiis-selectorNetdiskModal<%=random%> .fa-hover.activated").removeClass("activated");
            $(this).addClass("activated");
        });
    });

    function dirClick(htmlTag,order){

        var el = $(htmlTag);
        if("1" == el.attr("data-file-kind")) return false;

        var modalBody = $("#eiis-selectorNetdiskModal<%=random%>>.modal-body");
        if(modalBody.length > 0){
            modalBody.empty();
            $.ajax({
                url:"/public/controls/selector/netdisk/selector.netdisk.directory.jsp",
                type:"post",
                data:{dirId: el.attr("data-dir-id"),values:<%=objectMapper.writeValueAsString(valueList)%>,
                    order:order},
                success:function(data){
                    if(data){
                        modalBody.append(data);

                    }
                },
                error:function(data){
                    modalBody.append("目录读取发生错误！");
                }
            });
            //update paths
            if(htmlTag.tagName == "LI"){//alert(htmlTag.tagName)
                var _index = -1;
                $("#eiis-selectorNetdiskPaths<%=random%>").find("li").each(function(i,o){
                    if(el.attr("data-dir-id") == $(o).attr("data-dir-id")){
                        _index = i;
                    }
                    if(i > _index && _index >=0){
                        $(o).remove();
                    }
                });
            }
            if(htmlTag.tagName == "DIV"){//alert(htmlTag.tagName)
                $("#eiis-selectorNetdiskPaths<%=random%>").append('<li onclick="dirClick(this);" data-dir-id="{0}"><i class="fa fa-chevron-right"></i>{1}</li>'.format(el.attr("data-dir-id"),el.text()));
            }
        }
    }

    function fileClick(htmlTag){
        var el = $(htmlTag);
        if("1" == el.attr("data-file-kind")){
            el.toggleClass("selected");
        }else{
            dirClick(htmlTag);
        }
    }

</script>

<div class="modal fade" id="eiis-selectorNetdiskModal<%=random%>" tabindex="-1" role="dialog"
     aria-hidden="true" data-backdrop="static" data-width="90%" data-height="400px">
    <%--<div class="modal-dialog modal-lg">--%>
    <%--<div class="modal-content">--%>
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">网盘选择器</h4>
        <ul id="eiis-selectorNetdiskPaths<%=random%>" class="netdisk-paths">
            <%if(directoryEntity !=null){%>
            <li onclick="dirClick(this,'<%=StringUtils.isNotBlank(projectId)?"1":""%>');" data-dir-id="<%=directoryEntity.getDirectoryId()%>"><i class="fa-chevron-right"></i><%=directoryEntity.getDirectoryName()%></li>
            <%}%>
        </ul>
    </div>
    <div class="modal-body" style="overflow-y: auto;">
        <%--<div class="panel-group" id="netdisk-accordion<%=random%>">--%>
            <%----%>
        <%--</div>--%>

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
            <div onclick="fileClick(this)" class="col-md-12 <%=valueList.contains(dir.getId()) ? "activated" : ""%>" data-file-path="<%=dir.getFilePath()%>"  data-dir-id="<%=dir.getId()%>" data-file-kind="<%=dir.getKind()%>">
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
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary modalOk" id="eiis-selectorNetdiskOkBtn<%=random%>">确 定</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
    </div>
    <%--</div>--%>
    <%--</div>--%>
</div>
