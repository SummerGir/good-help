<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.app.meterialinput.service.AppMeterialInputService" %>
<%@ page import="eiis.app.dicinfo.service.AppDicInfoService" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="eiis.app.statement.StatementCycleKind" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="eiis.app.statement.realincome.AppStatementRealIncomeService" %>
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
    String menuCode = "statement_realincome";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

    JSONObject jbTypes = AppStatementRealIncomeService.getMainTypes();
    StringBuffer sbMonth = AppStatementRealIncomeService.getYearOption(false,true);
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <link rel="stylesheet" type="text/css" href="/public/jquery-easyui/themes/default/easyui.css">
        <link rel="stylesheet" type="text/css" href="/public/jquery-easyui/themes/icon.css">
        <link rel="stylesheet" type="text/css" href="/app/statement/css_js/indexBase.css">
        <script src="/public/jquery-easyui/jquery.easyui.min.js"></script>
        <script src="/public/jquery-easyui/locale/easyui-lang-zh_CN.js"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default need-nav">
            <div class="panel-body" style="padding-bottom: 0px;">
                <div class="row search-div">
                    <div class="col-xs-4 col-sm-4 col-md-4 my-col">
                        <div class="my-left-div2">年份：</div>
                        <div class="my-right-div2">
                            <select class="form-control" name="year" onchange="loadTableData()">
                                <%=sbMonth.toString()%>
                            </select>
                        </div>
                    </div>
                    <%--<div class="col-xs-3 col-sm-3 col-md-3 my-search-div">--%>
                            <%--&lt;%&ndash;<button onclick="search()" type="button" class="btn btn-primary" style="margin-bottom: 10px;"> <i class="glyphicon glyphicon-search"></i>查询</button>&ndash;%&gt;--%>
                        <%--<button onclick="search_show('search_form')" type="button" class="btn btn-primary">--%>
                            <%--<i class="glyphicon glyphicon-refresh"></i>刷新--%>
                        <%--</button>--%>
                    <%--</div>--%>
                </div>
            </div>
        </div>

        <div style="width: 100%;height: 100%">
            <div id="layout_div" style="position: relative;">
                <!-- 上表 开始 -->
                <div id="tab_main" class="table_data">
                    <div id="mainTable" ></div>
                </div>
                <!-- 底表 开始 -->
                <div id="tab" class="panel panel-default" style="margin: 0 20px;background: #ffffff">
                    <div class="table_data" style="position: relative;min-width: 960px;padding: 8px 20px;border: 1px solid #FFFFFF;overflow: hidden">
                        <div id="detailCharts" class="tab-content" style="height: 400px"></div>
                    </div>
                </div>
            </div>

        </div>

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
                        <div id="tab_detail" class="table_data">
                            <div id="detailTable" ></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">
            var title = "<%=title%>";
            var jbTypes = <%=jbTypes%>;
        </script>

        <script src="/app/statement/css_js/indexBase.js" type="text/javascript"></script>
        <script src="index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
