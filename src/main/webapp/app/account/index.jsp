<%@ page import="eiis.app.typeinfo.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.typeinfo.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.memberInfo.service.CoreMemberInfoService" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/31
  Time: 15:09
  To change this template use File | Settings | File Templates.
--%>
<%
    String menuCode = "account";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

//    String typeDetailId = request.getParameter("typeDetailId");
//    TypeSelectEntity pse = AppTypeDetailService.getInstance().getTypeSelect(menuCode,typeDetailId);
//    typeDetailId= StringUtils.isNotBlank(pse.getSelectedTypeId())?pse.getSelectedTypeId():"00000000-00000000-00000000";
//    StringBuffer listOp = pse.getListOp();
//    StringBuffer finishedProOp = pse.getFinishedProOp();
//    StringBuffer doingProOp = pse.getDoingProOp();


    CoreMemberInfoService service =  CoreMemberInfoService.getInstance();
    StringBuffer listOp = service.getListMember();

    System.out.println("aa");
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);
        </script>
        <style type="text/css">
            button>i{
                margin-right: 5px;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <!--表头-->
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12" style="text-align: right;">
                        <button onclick="add_main()" type="button" class="btn btn-success" id="add_main">
                            <i class="glyphicon glyphicon-plus"></i> 新增
                        </button>
                        <button onclick="edit_main()" type="button" class="btn btn-warning" id="edit_main">
                            <i class="glyphicon glyphicon-edit"></i>修改
                        </button>
                        <button onclick="delete_main()" type="button" class="btn btn-danger" id="delete_main">
                            <i class="glyphicon glyphicon-trash"></i> 删除
                        </button>
                    </div>
                </div>
            </div>
        </div>



        <!--画表格-->
        <div class="row">
            <div class="col-md-12">
                <!--表格-->
                <div id="myTableTest"></div>
            </div>
        </div>



        <!-- 模态框（Modal） -->
        <div id="my_modal" class="modal" data-width="50%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">新增/修改 一条数据</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="noteId" value=""/>

                <div class="row">
                    <div class="col-xs-12 col-md-12">
                        <h5>用户:</h5>
                        <select class="form-control" name="memberId" required="required">
                            <%=listOp.toString()%>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-6 col-md-6">
                        <h5>账号:</h5>
                        <input type="text" class="form-control" name="accountName" placeholder="请填写账号：" required="required">
                    </div>
                    <div class="col-xs-6 col-md-6">
                        <h5>密码:</h5>
                        <input type="text" class="form-control" name="accountPassword" placeholder="请填写密码：" required="required">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-12">
                        <h5>备注:</h5>
                        <textarea rows="3" class="form-control" name="comment" placeholder="请填写备注：" ></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button type="button" class="btn btn-primary" onclick="save_main()">
                    <i class="glyphicon glyphicon-floppy-save"></i>保存
                </button>
            </div>
        </div>


        <script src="/app/account/css_js/index.js?r=<%=Math.random()%>" type="text/javascript"></script>

    </master:Content>
</master:ContentPage>
