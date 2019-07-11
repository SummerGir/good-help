<%@ page import="eiis.app.statement.realincome.AppStatementRealIncomeService" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="util.context.Context" %>
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
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);
            EIIS.Common.loadComponent(EIIS.Common.controls.EasyUI);
        </script>
        <link rel="stylesheet" type="text/css" href="/app/statement/css_js/indexBase.css">
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

        <div id="layout_div" style="position: relative;">
            <!-- 上表 开始 -->
            <div id="tab_main" class="table_data">
                <div id="mainTable" ></div>
            </div>
            <!-- 底表 开始 -->
            <div id="tab" class="panel panel-default" style="margin: 0px;background: #ffffff">
                <div class="table_data" style="position: relative;min-width: 960px;padding: 8px 20px;border: 1px solid #FFFFFF;overflow: hidden">
                    <div id="detailCharts" class="tab-content" style="height: 400px"></div>
                </div>
            </div>
        </div>

        <div id="my_modal" class="modal" data-width="50%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">查看详细信息</span>
                </h3>
            </div>
            <div class="panel-body">
                <div id="tab_detail" class="table_data">
                    <div id="detailTable" ></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
            </div>
        </div>

        <script type="text/javascript">
            var title = "<%=title%>";
            var jbTypes = <%=jbTypes%>;
        </script>

        <script src="/app/statement/css_js/indexBase.js" type="text/javascript"></script>
        <script src="index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
