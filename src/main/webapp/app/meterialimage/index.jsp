<%@ page import="eiis.app.dicinfo.service.AppDicInfoService" %>
<%@ page import="eiis.app.meterialinput.service.AppMeterialInputService" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
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

    String menuCode = "meterial_image";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
//            GoodHelper.Loading(GoodHelper.Common.BootstrapFileInput);
        </script>
        <link href="/app/meterialimage/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
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

        <!-- 模态框（Modal） -->
        <div id="search_form" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 55%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            搜索
                        </h4>
                    </div>
                    <div class="modal-body">
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
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- 模态框（Modal） -->
        <div id="my_modal" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 60%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            新增/修改 一条数据
                        </h4>
                    </div>
                    <div class="modal-body" style="padding-bottom: 0px;">
                        <input type="hidden" name="imgId" value=""/>
                        <%--<form action="/app/meterialimage/saveMain.do" enctype="multipart/form-data" method="post">--%>
                            <%--上传文件1：<input type="file" name="file1"><br/>--%>
                            <%--上传文件2：<input type="file" name="file2"><br/>--%>
                            <%--<input type="submit" value="提交">--%>
                        <%--</form>--%>
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <h5>单据编号:</h5>
                                <input type="text" class="form-control need_listen" val_type="double" name="number" placeholder="请填写编号：" required="required" onfocus="sz_border(this)">
                            </div>
                            <div class="col-xs-12 col-md-12">
                                <h5>附件:</h5>
                                <input id="kv-explorer" type="file" multiple>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                        <button type="button" class="btn btn-primary" onclick="save_main()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">

            $(window).load(function() {
//                initFileInput("kv-explorer","/file/save")

            });

        </script>

        <script src="/app/meterialimage/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
