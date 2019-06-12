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

    StringBuffer sb = StatementCycleKind.getCycleOption(2);
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
                <div class="col-sm-12" id="detail_main_form">
                    <div class="row">
                        <div class="rowLeft">
                            <div class="row">
                                <div class="col-md-3">
                                    <label class="text-center control-label font-2 col-left">统计周期 :</label>
                                    <div class="col-right">
                                        <select class="eiis-combobox" name="cycleType" style="width: 120px;">
                                            <%=sb.toString()%>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="rowRight">
                            <button class="btn btn-info btn-block" style="margin: 4px 0" onclick="loadTableData()">查 询</button>
                        </div>
                    </div>
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
                        <div id="detailTable" class="tab-content" style="height: 400px"></div>
                    </div>
                </div>
            </div>

        </div>

        <script type="text/javascript">
            var title = "<%=title%>";
        </script>

        <script src="/app/statement/css_js/indexBase.js" type="text/javascript"></script>
        <script src="index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
