<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
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

    String menuCode = "meterial_input";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

    StringBuffer sbYear = AppMeterialInputService.getYearOption(false);
    StringBuffer sbMonth = AppMeterialInputService.getMonthOption(false);
    StringBuffer sbExc = AppMeterialInputService.getExcOption(true);
    StringBuffer sbDic = AppDicInfoService.getInstance().getDicOption(false);

    String queryData = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
        <link href="/app/meterialinput/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="count-div">
            <div class="row">
                <%--<div class="col-md-4 my-col">--%>
                    <%--<div class="my-left-div">已对账：</div>--%>
                    <%--<div class="my-right-div" name="isValid_1"></div>--%>
                    <%--<div class="money-unit">￥</div>--%>
                <%--</div>--%>
                <%--<div class="col-md-4 my-col">--%>
                    <%--<div class="my-left-div">未对账：</div>--%>
                    <%--<div class="my-right-div" name="isValid_0"></div>--%>
                    <%--<div class="money-unit">￥</div>--%>
                <%--</div>--%>
                <div class="col-md-8 my-col">
                    <div class="my-left-div">材料统计：</div>
                    <div class="my-right-div" name="dicInfo"></div>
                </div>
                <div class="col-md-4 my-col">
                    <div class="my-left-div">总金额：</div>
                    <div class="my-right-div" name="allMoney"></div>
                    <div class="money-unit">￥</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <!--表格-->
                <div id="myTableTest"></div>
                <!--表格的工具栏-->
                <div id="main_table_customRibbon" style="display: none;">
                    <button onclick="search_show('search_form')" type="button" class="btn btn-primary">
                        <i class="glyphicon glyphicon-refresh"></i>刷新
                    </button>
                    <button onclick="$('#search_form').modal()" type="button" class="btn btn-info">
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
                        <button onclick="getSearch('search_form')" type="button" class="btn btn-info"><i class="glyphicon glyphicon-search"></i>搜索</button>
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
                        <input type="hidden" name="inputId" value=""/>
                        <input type="hidden" class="form-control" name="allMoney" placeholder="自动计算单据金额：" disabled="disabled">
                        <div class="row">
                            <div class="col-xs-3 col-md-3">
                                <h5>年份:</h5>
                                <select class="form-control" name="year" required="required" onfocus="sz_border(this)">
                                    <%=sbYear.toString()%>
                                </select>
                            </div>
                            <div class="col-xs-3 col-md-3">
                                <h5>月份:</h5>
                                <select class="form-control" name="month" required="required" onfocus="sz_border(this)">
                                    <%=sbMonth.toString()%>
                                </select>
                            </div>
                            <div class="col-xs-3 col-md-3">
                                <h5>单据编号:</h5>
                                <input type="text" class="form-control need_listen" val_type="double" name="number" placeholder="请填写编号：" required="required" onfocus="sz_border(this)">
                            </div>
                            <div class="col-xs-3 col-md-3">
                                <h5>字母:</h5>
                                <select class="form-control" name="exception">
                                    <%=sbExc.toString()%>
                                </select>
                            </div>
                        </div>
                        <%--<div class="row">--%>
                            <%--<div class="col-xs-9 col-md-9">--%>
                                <%--<h5>备注说明:</h5>--%>
                                <%--<input type="text" class="form-control" name="comment" placeholder="备注说明（可不填写）：">--%>
                            <%--</div>--%>
                            <%--<div class="col-xs-3 col-md-3">--%>
                                <%--<h5>单据金额:</h5>--%>
                                <%--<input type="text" class="form-control" name="allMoney" placeholder="自动计算单据金额：" disabled="disabled">--%>
                            <%--</div>--%>
                        <%--</div>--%>

                        <div class="row detail-div">
                            <div class="col-xs-12 col-md-12">
                                <table class="table table-striped table-bordered table-condensed" style="margin: 0px;">
                                    <thead>
                                    <tr>
                                        <th width="15%">增/减操作</th>
                                        <th>材料</th>
                                        <th width="20%">数量</th>
                                        <th width="20%">价格</th>
                                        <th width="20%">金额</th>
                                    </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot>
                                    <tr>
                                        <td colspan="5"><div onclick="sz_rows(null,true,null)" title="加一项">加一项</div></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                        <%--<button type="button" class="btn btn-primary" onclick="save_main(false)">提交保存</button>--%>
                        <button type="button" class="btn btn-primary" onclick="save_main(true)"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">
            var _sbDic = "<%=sbDic.toString()%>";
            var queryData = "<%=queryData%>";

        </script>

        <script src="/app/meterialinput/css_js/index.js" type="text/javascript"></script>
        <!-- 百度文字转语音-->
        <script type="text/javascript" src="/public/baidu-tts/index.js"></script>
    </master:Content>
</master:ContentPage>
