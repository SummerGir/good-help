<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.app.statement.meterialinput.service.AppStatementMeterialInputService" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
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
    String menuCode = "statment_meterial_input";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
    StringBuffer sbMonth = AppStatementMeterialInputService.getYearAndMonthOption(true,true);
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">单据报表</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
        <link href="/app/statement/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default search-div">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-10">
                        <div class="row">
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">单据编号：</div>
                                <div class="my-right-div"><input type="text" class="form-control" name="inputCode" placeholder="请填写单据编号："></div>

                            </div>
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">单据月份：</div>
                                <div class="my-right-div">
                                    <select class="form-control" name="month">
                                        <%=sbMonth.toString()%>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">是否对账：</div>
                                <div class="my-right-div">
                                    <select class="form-control" name="isValid">
                                        <option value="">全部</option>
                                        <option value="0">未对账</option>
                                        <option value="1">已对账</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">开始日期：</div>
                                <div class="my-right-div">
                                    <input class="form-control" name="beginTime" type="text" value="" readonly="readonly" style="background-color: #fff" placeholder="请选择开始日期：">
                                </div>
                            </div>
                            <div class="col-md-4 my-col">
                                <div class="my-left-div">结束日期</div>
                                <div class="my-right-div">
                                    <input class="form-control" name="endTime" type="text" value="" readonly="readonly" style="background-color: #fff" placeholder="请选择结束日期：">
                                </div>
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
                toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                allowSelected:false,//列不允许选中
                rows:25,//每页默认条数
                columns:[
                    {name:'inputCode',title:'编号',align:'left'},
                    {name:'money',title:"价格",align:'center',width:'30%'},
                    {name:'caozuo',title:"操作",align:'center',width:'30%',format:function(text){
                        return "a"
                    }}
                ]
            };
            $(document).ready(function(){
                //初始化日历控件
                $(".search-div input[name='beginTime'],.search-div input[name='endTime']").datetimepicker({
                    format: 'yyyy-mm-dd',
                    minView:2
                });
                myTable.ghTable(option);
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

            function search() {
                var postData = {};
                $(".search-div input,.search-div select,.search-div textarea").each(function () {
                    var name = $(this).attr("name");
                     postData[name] = $(this).val();

                });
                option.data = postData;
                myTable.ghTable(option);//刷新列表，可以不传参
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
                        }else{
                            $.message(rs.msg);
                        }
                    }
                });
            }

        </script>
    </master:Content>
</master:ContentPage>
