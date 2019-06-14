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
        </script>
        <link href="/app/meterialbill/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <div class="panel panel-default need-nav">
            <div class="panel-body" style="padding-bottom: 0px;">
                <div class="row">
                    <div class="col-md-12 count-div">
                        <div class="row">
                            <div class="col-md-12 my-col">
                                <div class="my-left-div">材料统计：</div>
                                <div class="my-right-div" name="dicInfo"></div>
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
                            <%--<button onclick="search()" type="button" class="btn btn-primary" style="margin-bottom: 10px;"> <i class="glyphicon glyphicon-search"></i>查询</button>--%>
                        <button onclick="search_show('search_form')" type="button" class="btn btn-primary">
                            <i class="glyphicon glyphicon-refresh"></i>刷新
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
        <script type="text/javascript">
            var myTable = $("#myTableTest");
            var selectedRow;
            var loading = false;//控制项目列表频繁点击
            var thisDate = $(".search-div *[name='month']").val();
            var option = {
                id:"#myTableTest",//需要绑定的Id或class
                url:"/app/meterialBill/getMainInfo.do",//表格请求的路径
                data:{},
                allowSelected:false,//列不允许选中
                rows:50,//每页默认条数
                columns:[
                    {name:'inputCode',title:'单据编号',align:'left'},
                    {name:'money',title:"单据金额",align:'center',width:'30%'},
                    {name:'caozuo',title:"是否对账",align:'center',width:'30%'}
                ]
            };
            $(window).load(function(){
                clone_my_nav("need-nav");
                $(".main-center").css({"margin-top": $(".main-center-nav").height() + "px"});
                //初始化日历控件
                $(".search-div input[name='beginTime'],.search-div input[name='endTime']").datetimepicker({
                    format: 'yyyy-mm-dd',
                    minView:2
                });
                search();
                myTable.on("table.created", function() {
//                    $.message("创建表格");
                    loading = false;
                });
                //行选中
                myTable.on("table.row.selected", function(event,eventData) {
                    selectedRow = eventData.row;
                });
                myTable.on("table.column.caozuo.foramt", function (a, eventData) {
                    var row = eventData.row;
                    eventData.ed.html('<input type="checkbox" name="isValid" onchange="se_valid(this)" value="'+row.inputId+'" '+ (row.isValid ? 'checked="checked"':'') +' />');
                });
                $("#myTableTest .form-inline>.table-toolbar").hide();
            });

            //重置
            function search_show(form){
                $(".search-div input,.search-div select,.search-div textarea").each(function(){
                    var name = $(this).attr("name");
                    if("month" == name){
                        return;
                    }
                    $(this).val("");
                });

                var isHave = false;
                $(".search-div *[name='month']>option").each(function(){
                    var v = $(this).attr("value");
                    if(v != "" && !isHave){
                        $(".search-div *[name='month']").val(v);
                        isHave = true;
                    }
                });

                search()
            }

            function search() {
                var postData = {};
                $(".search-div input,.search-div select,.search-div textarea").each(function () {
                    var name = $(this).attr("name");
                     postData[name] = $(this).val();

                });
                option.data = postData;
                myTable.ghTable(option);//刷新列表，可以不传参
                getMainMoneyInfo();
            }

            function se_valid(e){
                var mainId = $(e).val();
                var isValid = $(e).is(":checked");

                console.log(isValid);
                $.ajax({
                    url:"/app/meterialinput/saveIsValid.do",  //请求路径
                    data:{mainId:mainId,isValid:isValid}, //请求参数
                    type:"post", //请求方式
                    async:true,  //是否异步，默认值true
                    dataType:'json',
                    success:function(rs){ ////成功之后回调
                        if(rs.error == 0){
                            myTable.ghTable(option);//刷新列表，可以不传参
                            getMainMoneyInfo();
                        }else{
                            $.message(rs.msg);
                        }
                    }
                });
            }

            function getMainMoneyInfo(){
                $.ajax({
                    url:"/app/meterialBill/getMainMoneyInfo.do",  //请求路径
                    data:option.data, //请求参数
                    type:"post", //请求方式
                    async:true,  //是否异步，默认值true
                    dataType:'json',
                    success:function(rs){ ////成功之后回调
                        console.log(rs);
                        $(".count-div div[name='isValid_0']").html(rs.isValid_0);
                        $(".count-div div[name='isValid_1']").html(rs.isValid_1);
                        $(".count-div div[name='allMoney']").html(rs.allMoney);
                        $(".count-div div[name='dicInfo']").html(rs.dicInfo);
                    }
                });
            }

        </script>
    </master:Content>
</master:ContentPage>
