<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %><%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 2020/2/27
  Time: 14:21
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="master" uri="util.masterPage" %>

<%
    String menuCode = "disk";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">

        <link rel="stylesheet" type="text/css" href="/public/jquery-easyui/extend/css/tree.css" />
        <link rel="stylesheet" type="text/css" href="css_js/fileIndex.css"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="row">
            <div class="col-xs-4 col-sm-4 col-md-4">
                <div class="panel panel-default" id="left_div">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-sm-12" style="text-align:right">
                                <%--<button onclick="reset_tree()" type="button" class="btn btn-info">--%>
                                    <%--<i class="glyphicon glyphicon-refresh"></i>--%>
                                <%--</button>--%>
                                <button onclick="move_tree(true)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-arrow-up"></i>上移
                                </button>
                                <button onclick="move_tree(false)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-arrow-down"></i>下移
                                </button>
                                <button onclick="add_main()" type="button" class="btn btn-success">
                                    <i class="glyphicon glyphicon-plus"></i>新增
                                </button>
                                <button onclick="edit_main()" type="button" class="btn btn-warning">
                                    <i class="glyphicon glyphicon-edit"></i>修改
                                </button>
                                <button onclick="delete_main()" type="button" class="btn btn-danger">
                                    <i class="glyphicon glyphicon-trash"></i>删除
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <ul id="disk_tree" class="easyui-tree"></ul>
                    </div>
                </div>
            </div>
            <div class="col-xs-8 col-sm-8 col-md-8">
                <div class="panel panel-default " id="right_div">
                    <div class="panel-heading" style="text-align: right;">
                        <div class="row">
                            <div class="col-sm-12" style="text-align:right">
                                <button onclick="add_file()" type="bfileutton" class="btn btn-success">
                                    <i class="glyphicon glyphicon-plus"></i>新增
                                </button>
                            </div>

                        </div>
                    </div>
                    <div class="panel-body" id="file_Content">

                    </div>
                    <%--<div class="panel-footer" style="text-align: center;">--%>

                    <%--</div>--%>
                </div>
            </div>
        </div>

        <div  name="modal_file" style="display: none">
            <div class="box-div" >
                <div class="box-head">
                    <div class="box-head-left">1号</div>
                    <div class="box-head-right">
                        <i class="delete-i fa fa-trash-o" title="删除" id="delete"></i>
                        <i class="update-i fa fa-pencil" title="编辑" id="edit"></i>
                        <a class="download-i fa fa-download" title="下载" id="download" href=""></a>
                    </div>
                </div>
                <div class="box-body">
                        <img src="" class="pimg" style="display: none">
                </div>
            </div>
        </div>


        <div id="outerdiv">
            <div id="innerdiv">
                <img id="bigimg"  src=""/>
            </div>
        </div>




        <div id="my_modal" class="modal" data-width="30%"  tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">新增/修改节点</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="treeId" value=""/>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                           <input type="text" class="form-control" name="text" placeholder="请填写节点名称（必填）">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button type="button" class="btn btn-primary" onclick="save_main()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
            </div>
        </div>

        <div id="details_modal" class="modal" data-width="30%"  tabindex="-1" aria-hidden="true" data-backdrop="static">
            <%--<form method="post" enctype="multipart/form-data" action="/app/file/saveMain.do" id="saveReportForm" onsubmit="return saveReport();">--%>
            <form method="post" enctype="multipart/form-data" action="/app/file/saveMain.do" id="saveReportForm">
                <div class="panel-heading">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">
                        <span style="font-weight: bold;">详情</span>
                    </h3>
                </div>
                <div class="panel-body">
                    <input type="hidden" name="fileId" value=""/>
                    <input type="hidden" name="fileTreeId" value=""/>
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <h5>文件标题</h5>
                            <input type="text" class="form-control" name="fileName" placeholder="请填写文件标题">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <h5>文件内容</h5>
                            <input type="file" class="form-control" name="filePath" id="fileInput" onchange="filechange(event)" required="required">
                            <img src=""  id="img-change"  width="200px" height="200px" style="margin-top: 10px" hidden>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <h5>创建时间</h5>
                            <input type="text" class="eiis-date"  name="createdTime" required="required" placeholder="请选择创建时间">
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <h5>备注</h5>
                            <textarea class="form-control" name="comment"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>取消</button>
                    <%--<button type="button" class="btn btn-primary" onclick="save_file()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>--%>
                    <button type="button"  class="btn btn-primary" onclick="submitForm()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
                </div>
            </form>



        </div>

        <script type="text/javascript" src="css_js/treeIndex.js"></script>
        <script type="text/javascript" src="css_js/fileIndex.js"></script>
    </master:Content>
</master:ContentPage>
