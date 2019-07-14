<%@ page import="eiis.app.typeinfo.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.typeinfo.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.app.meterialinput.service.AppMeterialInputService" %>
<%@ page import="eiis.app.dicinfo.service.AppDicInfoService" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
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

    String menuCode = "type_info";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);
        </script>

        <link href="/app/typeinfo/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="row">
            <div class="col-xs-4 col-sm-4 col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading">
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
                    <div class="panel-body">
                        <div id="myTableTest"></div>
                    </div>
                </div>
            </div>
            <div class="col-xs-8 col-sm-8 col-md-8">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-md-12" style="text-align: right;">
                                <button onclick="move_type_detail(true)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-arrow-up"></i>上移
                                </button>
                                <button onclick="move_type_detail(false)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-arrow-down"></i>下移
                                </button>
                                <button onclick="add_det()" type="button" class="btn btn-success">
                                    <i class="glyphicon glyphicon-plus"></i> 新增
                                </button>
                                <button onclick="edit_det()" type="button" class="btn btn-warning">
                                    <i class="glyphicon glyphicon-edit"></i>修改
                                </button>
                                <button onclick="delete_det()" type="button" class="btn btn-danger">
                                    <i class="glyphicon glyphicon-trash"></i> 删除
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div id="myDetailTable"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模态框（Modal） -->
        <div id="my_modal" class="modal" data-width="30%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">新增/修改 一条数据</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="typeId" value=""/>
                <div class="row">
                    <div class="col-xs-12 col-xs-12 col-md-12">
                        <h5>类型名称:</h5>
                        <input type="text" class="form-control" name="typeName" placeholder="请填写类型名称：" required="required"  onfocus="sz_border(this)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-xs-12 col-md-12">
                        <h5>类型编码:</h5>
                        <input type="text" class="form-control" name="typeCode" placeholder="请填写类型编码：" required="required"  onfocus="sz_border(this)">
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

        <!-- 模态框（Modal） -->
        <div id="my_det_modal" class="modal" data-width="50%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">新增/修改 一条数据</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="typeDetailId" value=""/>
                <input type="hidden" name="typeId" value=""/>
                <div class="row">
                    <div class="col-xs-6 col-xs-6 col-md-6">
                        <h5>类型标题:</h5>
                        <input type="text" class="form-control" name="detailName" placeholder="请填写类型标题：" required="required"  onfocus="sz_border(this)">
                    </div>
                    <div class="col-xs-6 col-xs-6 col-md-6">
                        <h5>类型编码:</h5>
                        <input type="text" class="form-control" name="detailCode" placeholder="请填写类型编码：" required="required"  onfocus="sz_border(this)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6 col-xs-6 col-md-6">
                        <h5>类型值:</h5>
                        <input type="text" class="form-control" name="detailValue" placeholder="请填写类型值：">
                    </div>
                    <div class="col-xs-6 col-xs-6 col-md-6">
                        <h5>是否生效:</h5>
                        <select class="form-control" name="isValid" onfocus="sz_border(this)">
                            <option value="true">生效</option>
                            <option value="false">失效</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h5>备注说明:</h5>
                        <textarea rows="3" class="form-control" name="comment" placeholder="请填写备注说明："></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button type="button" class="btn btn-primary" onclick="save_det()">
                    <i class="glyphicon glyphicon-floppy-save"></i>保存
                </button>
            </div>
        </div>

        <script type="text/javascript">

        </script>

        <script src="/app/typeinfo/css_js/index.js" type="text/javascript"></script>
        <script src="/app/typeinfo/css_js/detail.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
