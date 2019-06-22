<%@ page import="eiis.app.meterialbill.AppMeterialBillService" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Created by IntelliJ IDEA.
  User: Jane
  Date: 2019/06/02
  Time: 16:02
  To change this template use File | Settings | File Templates.
--%>

<%
    String menuCode = "meterial_bill";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
    StringBuffer sbMonth = AppMeterialBillService.getYearAndMonthOption(true,true);
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            GoodHelper.Loading(GoodHelper.Common.BootstrapTable);
            GoodHelper.Loading(GoodHelper.Common.BaiduTTS);
//            GoodHelper.Loading(GoodHelper.Common.BootstrapDateTimepicker);
        </script>
        <link href="/app/meterialbill/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <div class="panel panel-default need-nav">
            <div class="panel-body" style="padding-bottom: 0px;">
                <div class="row">
                    <div class="col-md-12 count-div">
                        <div class="row">
                            <div class="col-xs-9 col-sm-9 col-md-9 my-col">
                                <div class="my-left-div">材料统计：</div>
                                <div class="my-right-div" name="dicInfo"></div>
                            </div>
                            <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                                <div class="my-left-div">录入量：</div>
                                <div class="my-right-div" name="inputNum"></div>
                                <div class="money-unit">张</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-9 col-sm-9 col-md-9">
                                <div class="row">
                                    <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                        <div class="my-left-div">已对账：</div>
                                        <div class="my-right-div" name="isValid_1"></div>
                                        <div class="money-unit">￥</div>
                                    </div>
                                    <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                        <div class="my-left-div">未对账：</div>
                                        <div class="my-right-div" name="isValid_0"></div>
                                        <div class="money-unit">￥</div>
                                    </div>
                                    <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                        <div class="my-left-div">总金额：</div>
                                        <div class="my-right-div" name="allMoney"></div>
                                        <div class="money-unit">￥</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-3 col-sm-3 col-md-3 my-search-div">
                                <button onclick="search_show('search_form')" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-refresh"></i>刷新
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row search-div">
                    <div class="col-xs-9 col-sm-9 col-md-9">
                        <div class="row" style="margin-bottom: 10px;">
                            <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                <div class="my-left-div2">单据编号：</div>
                                <div class="my-right-div2"><input type="text" class="form-control" name="inputCode" onkeyup="search()" placeholder="请填写单据编号："></div>

                            </div>
                            <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                <div class="my-left-div2">单据月份：</div>
                                <div class="my-right-div2">
                                    <select class="form-control" name="month" onchange="search()">
                                        <%=sbMonth.toString()%>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                                <div class="my-left-div2">是否对账：</div>
                                <div class="my-right-div2">
                                    <select class="form-control" name="isValid" onchange="search()">
                                        <option value="">全部</option>
                                        <option value="0">未对账</option>
                                        <option value="1">已对账</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                            <%--<div class="row">--%>
                            <%--<div class="col-md-4 my-col">--%>
                            <%--<div class="my-left-div">开始日期：</div>--%>
                            <%--<div class="my-right-div">--%>
                            <%--<input class="form-control" name="beginTime" type="text" value="" readonly="readonly" style="background-color: #fff" placeholder="请选择开始日期：">--%>
                            <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="col-md-4 my-col">--%>
                            <%--<div class="my-left-div">结束日期：</div>--%>
                            <%--<div class="my-right-div">--%>
                            <%--<input class="form-control" name="endTime" type="text" value="" readonly="readonly" style="background-color: #fff" placeholder="请选择结束日期：">--%>
                            <%--</div>--%>
                            <%--</div>--%>
                            <%--</div>--%>
                    </div>
                    <div class="col-xs-3 col-sm-3 col-md-3 my-search-div">
                        <button onclick="edit_main()" type="button" class="btn btn-warning" id="edit_main">
                            <i class="glyphicon glyphicon-edit"></i>差异记录
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
        <div id="my_modal" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 30%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            记录对账金额
                        </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="inputId" value=""/>
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <h5>对账金额:</h5>
                                <input type="text" class="form-control need_listen" val_type="double" name="billMoney" placeholder="请对账金额：" required="required" onfocus="sz_border(this)">
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

        <script src="/app/meterialbill/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
