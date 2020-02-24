<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page import="eiis.app.typeinfo.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.typeinfo.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.app.cost.service.AppCostInfoService" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %><%--
  Created by IntelliJ IDEA.
  User: Jane
  Date: 2019/5/29
  Time: 14:17
  To change this template use File | Settings | File Templates.
--%>

<%
    String menuCode = "cost";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

    TypeSelectEntity pse = AppTypeDetailService.getInstance().getTypeSelect(menuCode,"");
    StringBuffer listOp = pse.getListOp();
    StringBuffer finishedProOp = pse.getFinishedProOp();
    StringBuffer doingProOp = pse.getDoingProOp();

//    AppCostInfoService service = AppCostInfoService.getInstance();
//    StringBuffer yearList = service.getYearList();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);

        </script>
        <script charset="utf-8" type="text/javascript" src="/public/ECharts/require.js"></script>
        <link href="/app/cost/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12" style="text-align: right;">
                        <button onclick="$('#search_form').modal()" type="button" class="btn btn-primary">
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
        </div>


        <div class="row">
            <jsp:include page="/app/typeinfo/select.jsp" >
                <jsp:param name="listOp" value="<%=listOp%>"/>
                <jsp:param name="finishedProOp" value="<%=finishedProOp%>"/>
                <jsp:param name="doingProOp" value="<%=doingProOp%>"/>
            </jsp:include>
            <!--画表格-->
            <div class="col-md-10">
                <!--表格-->
                <div id="myTableTest"></div>

                <div class="myCensus">
                    <div class="mySelect">
                        <span>年：</span>
                        <select class="form-control" id="select-year" onchange="selectChange()">
                            <%--<%=yearList.toString()%>--%>
                        </select>
                    </div>
                    <div id="myECharts" style="width: 100%;height: 400px;"></div>
                </div>
            </div>
        </div>




        <!-- 模态框（Modal） -->
        <div id="search_form" class="modal" data-width="30%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">搜索</span>
                </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-12 col-md-12" style="display: flex">
                        <label style="width: 110px;line-height: 36px;">消费类型：</label>
                        <select class="form-control" name="typeDetailId" onfocus="sz_border(this)">
                            <%=listOp.toString()%>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button onclick="getSearch('search_form')" type="button" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i>搜索</button>
            </div>
        </div>

        <!--模态框-->
        <div id="my_modal" class="modal" data-width="50%" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">新增/修改一条数据</span>
                </h3>
            </div>
            <div class="panel-body">
                <input type="hidden" name="costId" value=""/>
                <input type="hidden" name="addType" value="false"/>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>消费类型</h5>
                        <div class="type-select">
                            <select class="form-control" name="typeDetailId" onfocus="sz_border(this)"  onchange="sz_price(this)">
                                <%=listOp.toString()%>
                            </select>
                            <button onclick="add_type(true)" type="button" class="btn btn-success">
                                <i class="glyphicon glyphicon-plus"></i>
                            </button>
                        </div>
                        <div class="type-input">
                            <input type="text" class="form-control" name="typeName" placeholder="请填写消费类型名称（必填）">
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>单价</h5>
                        <input type="text" class="form-control" name="costPrice" placeholder="请填写单价（选填）">
                    </div>

                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>消费金额</h5>
                        <input type="text" class="form-control" name="payMoney" placeholder="请填写消费金额（选填）">
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>消费日期</h5>
                        <input type="text" class="eiis-date" name="costTime" placeholder="请填写消费日期（选填）">
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>数量</h5>
                        <input type="text" class="form-control" name="costNum" placeholder="请填写数量（选填）">
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <h5>备注说明:</h5>
                        <input type="text" class="form-control" name="title" placeholder="请填写备注说明：">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                <button type="button" class="btn btn-primary" onclick="save_main()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
            </div>
        </div>

        <!--js-->
        <script type="text/javascript">
            var menuCode = "<%=menuCode%>";
        </script>
        <script src="/app/cost/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
    
