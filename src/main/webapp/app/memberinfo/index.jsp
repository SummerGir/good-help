<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.memberInfo.entity.CoreMemberInfoEntity" %>
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
    String menuCode = "xtgl_cygl";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
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
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12" style="text-align: right">
                        <button onclick="search_show('search_form')" type="button" class="btn btn-primary">
                            <i class="glyphicon glyphicon-refresh"></i>刷新
                        </button>
                        <button onclick="$('#search_form').modal()" type="button" class="btn btn-primary">
                            <i class="glyphicon glyphicon-search"></i> 搜索
                        </button>

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

        <div class="row">
            <div class="col-md-12">
                <!--表格-->
                <div id="myTableTest"></div>
            </div>
        </div>

        <!-- 模态框（Modal） -->
        <div id="search_form" class="modal" data-width="40%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">搜索</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="inputId" value=""/>
                <div class="row">
                    <div class="col-xs-12 col-md-12" style="display: flex">
                        <label style="width: 80px;line-height: 36px;">关键字：</label>
                        <input type="text" class="form-control" name="searchKey" placeholder="请填写单据编号：" >
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button onclick="getSearch('search_form')" type="button" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i>搜索</button>
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
                <input type="hidden" name="urlId" value=""/>
                <div class="row">
                    <div class="col-xs-6 col-md-6">
                        <h5>用户名称:</h5>
                        <input type="text" class="form-control" name="memberName" placeholder="请填写用户名称：">
                    </div>
                    <div class="col-xs-6 col-md-6">
                        <h5>是否冻结:</h5>
                        <select name="isFrozen" class="form-control">
                            <option value="true">是</option>
                            <option value="false">否</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 col-md-6">
                        <h5>用户账号:</h5>
                        <input type="text" class="form-control" name="account" placeholder="请填写用户账号：">
                    </div>
                    <div class="col-xs-6 col-md-6">
                        <h5>用户密码:</h5>
                        <input type="text" class="form-control" name="password" placeholder="请填写用户密码：">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 col-md-6">
                        <h5>用户头像:</h5>
                        <input type="text" class="form-control" name="photo" placeholder="请选择用户头像：">
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

        <script src="/app/memberinfo/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
