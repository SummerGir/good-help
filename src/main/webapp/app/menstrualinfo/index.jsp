<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="eiis.app.menstrual.service.AppMenstrualInfoService" %>
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

    String menuCode = "menstrual_info";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

    String queryData = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    AppMenstrualInfoService appMenstrualInfoService = AppMenstrualInfoService.getInstance();
    StringBuffer yearList = appMenstrualInfoService.getYearList();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);
        </script>

        <link href="/app/menstrualinfo/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <%--<div class="panel panel-default need-nav">--%>
            <%--<div class="panel-body">--%>
                <%--<div class="row">--%>
                    <%--<div class="col-md-12" style="text-align: right;">--%>
                        <%--<button onclick="add_main()" type="button" class="btn btn-success" id="add_main">--%>
                            <%--<i class="glyphicon glyphicon-plus"></i> 新增--%>
                        <%--</button>--%>
                        <%--<button onclick="edit_main()" type="button" class="btn btn-warning" id="edit_main">--%>
                            <%--<i class="glyphicon glyphicon-edit"></i>修改--%>
                        <%--</button>--%>
                        <%--<button onclick="delete_main()" type="button" class="btn btn-danger" id="delete_main">--%>
                            <%--<i class="glyphicon glyphicon-trash"></i> 删除--%>
                        <%--</button>--%>
                    <%--</div>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>

        <div class="my-row">
            <div class="my-left">
                <div class='sr-table'>
                    <div class='sr-title'>
                        <div class='sr-tr'>
                            <div class='sr-td-title'>
                                <div class="left-button" onclick="changeMonth(true)">
                                    <i class="esg-font icon-zuo"></i>
                                </div>
                                <div class="center-text"></div>
                                <div class="right-button" onclick="changeMonth(false)">
                                    <i class="esg-font icon-you"></i>
                                </div>
                            </div>
                            <div class='sr-td-button'>
                                <div class="delete_last" onclick="delete_last()">删&nbsp;&nbsp;除</div>
                                <div class="ove" onclick="ove()">排&nbsp;&nbsp;卵</div>
                                <div class="comIng" onclick="jqComIng()">来&nbsp;&nbsp;了</div>
                            </div>
                        </div>
                    </div>
                    <div class='sr-thead'>
                        <div class='sr-tr'></div>
                    </div>
                    <div class='sr-tbody'></div>
                </div>

                <div class="msgs-div">
                    <div class="jq-msgs">
                        <div class="jq-msg">
                            <div class='jq-sj jq-sj-start'>1</div>
                            <div class='jq-sj'>2</div>
                            <div class='jq-sj jq-sj-end'>3</div>
                            <div class='jq-txt'>月经期</div>
                        </div>
                        <div class="jq-msg">
                            <div class='jq-yc jq-yc-start'>1</div>
                            <div class='jq-yc jq-yc-center'>2</div>
                            <div class='jq-yc jq-yc-end'>3</div>
                            <div class='jq-txt'>预测期</div>
                        </div>

                    </div>
                    <div class="jq-msgs">
                        <div class="jq-msg">
                            <div class='jq-plq'>1</div>
                            <div class='jq-plq'>2</div>
                            <div class='jq-plq'>3</div>
                            <div class='jq-txt'>排卵期</div>
                        </div>
                        <div class="jq-msg">
                            <div class='jq-plr'>1</div>
                            <div class='jq-plr'>2</div>
                            <div class='jq-plr'>3</div>
                            <div class='jq-txt'>排卵日</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-right">
                <div class="mySelect">
                    <span>年：</span>
                    <select class="form-control" id="select-year" onchange="selectChange()">
                        <%=yearList.toString()%>
                    </select>
                </div>
                <div id="myTableTest" style="width: 100%;height: 400px;"></div>
                <div id="oveCycle" style="width: 100%;height: 400px;"></div>
            </div>
        </div>

        <script type="text/javascript">
            var queryData = "<%=queryData%>";

        </script>

        <script src="/app/menstrualinfo/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
