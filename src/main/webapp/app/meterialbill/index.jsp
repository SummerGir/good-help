<%@ page import="eiis.app.meterialbill.AppMeterialBillService" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="java.util.Calendar" %>
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

    Calendar c = Calendar.getInstance();
    int y = c.get(Calendar.YEAR);
    int m = c.get(Calendar.MONTH) ;
    String defSel = y + "-" + m;//默认选中上个月
    StringBuffer sbMonth = AppMeterialBillService.getYearAndMonthOption(true,false);
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
                            <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                                <div class="my-left-div">录入量：</div>
                                <div class="my-right-div" name="inputNum"></div>
                                <div class="money-unit">张</div>
                            </div>
                            <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                                <div class="my-left-div">总金额：</div>
                                <div class="my-right-div" name="allMoney"></div>
                                <div class="money-unit">￥</div>
                            </div>
                            <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                                <div class="my-left-div">差钱：</div>
                                <div class="my-right-div" name="cyMoney"></div>
                                <div class="money-unit">￥</div>
                            </div>
                            <div class="col-xs-3 col-sm-3 col-md-3 my-search-div" style="text-align: right;">
                                <%--<button onclick="search_show('search_form')" type="button" class="btn btn-primary">--%>
                                    <%--<i class="glyphicon glyphicon-refresh"></i>刷新--%>
                                <%--</button>--%>
                                <button onclick="read_main()" type="button" class="btn btn-primary" id="read_main">
                                    <i class="glyphicon glyphicon-list-alt"></i>查看差异
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="row search-div">
                    <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                        <div class="my-left-div2">单据编号：</div>
                        <div class="my-right-div2"><input type="text" class="form-control" name="inputCode" onkeyup="search()" placeholder="请填写单据编号："></div>

                    </div>
                    <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                        <div class="my-left-div2">单据月份：</div>
                        <div class="my-right-div2">
                            <select class="form-control" name="month" onchange="search()">
                                <%=sbMonth.toString()%>
                            </select>
                        </div>
                    </div>
                    <div class="col-xs-3 col-sm-3 col-md-3 my-col">
                        <div class="my-left-div2">是否对账：</div>
                        <div class="my-right-div2">
                            <select class="form-control" name="isValid" onchange="search()">
                                <option value="">全部</option>
                                <option value="0">未对账</option>
                                <option value="1">已对账</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-xs-3 col-sm-3 col-md-3 my-search-div" style="text-align: right;">
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
                                <input type="text" class="form-control need_listen" val_type="double" name="billMoney" placeholder="请对账金额：" >
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

        <!-- 模态框（Modal） -->
        <div id="read_modal" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 60%;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            查看差异明细
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <div id="myDetailTable"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">
            var defSel = "<%=defSel%>";
        </script>
        <script src="/app/meterialbill/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
