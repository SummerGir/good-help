<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.app.statement.meterialinput.service.AppStatementMeterialInputService" %>
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
    StringBuffer sbMonth = AppStatementMeterialInputService.getYearAndMonthOption(true);
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">单据报表</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
        <link href="/app/statement/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-10">
                        <div class="row">
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">单据编号</div>
                                <div class="my-right-div"><input type="text" class="form-control" name="inputCode" placeholder="请填写单据编号："></div>

                            </div>
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">开始日期</div>
                                <div class="my-right-div"><input type="text" class="form-control" name="beginTime" placeholder="请选择开始日期："></div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">月</div>
                                <div class="my-right-div">
                                    <select class="form-control" name="month">
                                    <%=sbMonth.toString()%>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">结束日期</div>
                                <div class="my-right-div"><input type="text" class="form-control" name="endTime" placeholder="请选择结束日期："></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 my-search-div">
                        <button onclick="search()" type="button" class="btn btn-primary"> 查询</button>
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
            var option = {
                id:"#myTableTest",//需要绑定的Id或class
                url:"/statement/meterialInput/getMainInfo.do",//表格请求的路径
                type:"post",//请求方式
                dataType:"json",//请求的返回格式
                toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                isPage:true,//是否分页
                page:1,//加载数据的初始页
                rows:5,//每页默认条数
                columns:[
                    {name:'inputCode',title:'编号',align:'left'},
                    {name:'money',title:"价格",align:'center',width:'50%'}
                ]
            };
            $(document).ready(function(){
                myTable.ghTable(option);
                myTable.on("table.created", function() {
//                    $.message("创建表格");
                    loading = false;
                });
                //行选中
                myTable.on("table.row.selected", function(event,eventData) {
                    selectedRow = eventData.row;
                });
            });

            function loadTable(){
                selectedRow = null;//刷新列表前，把选中行设置为空
                myTable.ghTable();//刷新列表，可以不传参
            }
            function search() {
                var postData = {};
                $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                    var name = $(this).attr("name");
                     postData[name] = $(this).val();

                });
                $.ajax({
                    url:"/statement/meterialInput/getMainInfo.do",  //请求路径
                    data:postData, //请求参数
                    type:"post", //请求方式
                    async:true,  //是否异步，默认值true
                    dataType:'json',
                    success:function(rs){ ////成功之后回调
                        $.message(rs.msg);
                        if(rs.error == 0){
                            loadTable();
                        }
                    }
                });
            }
        </script>
    </master:Content>
</master:ContentPage>
