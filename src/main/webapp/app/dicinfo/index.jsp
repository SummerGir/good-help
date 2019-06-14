<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Created by IntelliJ IDEA.
  User: Jane
  Date: 2019/06/01
  Time: 23:33
  To change this template use File | Settings | File Templates.
--%>
<%
    String menuCode = "dic_info";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            GoodHelper.Loading(GoodHelper.Common.BootstrapTable);
        </script>
        <style type="text/css">
            button>i{
                margin-right: 5px;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12" style="text-align: right;">
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
            <div class="col-md-12">
                <!--表格-->
                <div id="myTableTest"></div>
            </div>
        </div>

        <!-- 模态框（Modal） -->
        <div id="my_modal" class="modal fade" tabindex="-1"  aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 40%;height: 50%">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            新增/修改 一条数据
                        </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="dicId" value=""/>

                        <div class="row">
                            <div class="col-xs-6 col-md-6">
                                <h5>字典名称:</h5>
                                <input type="text" class="form-control" name="dicName" placeholder="请填写字典名称：" required="required">
                            </div>
                            <div class="col-xs-6 col-md-6">
                                <h5>字典单位:</h5>
                                <input type="text" class="form-control" name="unitName" placeholder="请填写字典单位：" required="required">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-6 col-md-6">
                                <h5>字典价格:</h5>
                                <input type="text" class="form-control" name="price" placeholder="请填写字典价格：" required="required" onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" onblur="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
                            </div>
                            <div class="col-xs-6 col-md-6">
                                <h5>字典优先级:</h5>
                                <input type="text" class="form-control" name="priorityLevel" placeholder="请填写字典优先级：" required="required" onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <h5>备注说明:</h5>
                                <textarea rows="3" class="form-control" name="comment" placeholder="请填写备注说明：" ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>关闭</button>
                        <button type="button" class="btn btn-primary" onclick="save_main()">
                            <i class="glyphicon glyphicon-floppy-save"></i>保存
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">
            var myTable = $("#myTableTest");
            var selectedRow;
            var loading = false;//控制项目列表频繁点击
            var option = {
                id:"#myTableTest",//需要绑定的Id或class
                url:"/app/dicinfo/getMainInfo.do",//表格请求的路径
                toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                columns:[
                    {name:'dicName',title:"名称",align:'left'},
                    {name:'unitName',title:'单位',align:'left',width:'15%'},
                    {name:'price',title:"价格",align:'center',width:'10%'},
                    {name:'priorityLevel',title:"优先级",align:'center',width:'10%'},
                    {name:'sysTime',title:"编制日期",align:'center',width:'15%'},
                    {name:'comment',title:"备注",align:'left',width:'30%'}
                ]
            };
            $(window).load(function(){
                clone_my_nav("need-nav");
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

            //点击项目名称
            function click_type(typeDetailId,e){
                if(loading)return;
                loading = true;
                $("#types_list li[class='active']").removeClass("active");
                $(e).addClass("active");
                option.data.typeDetailId = _typeDetailId;
                myTable.ghTable(option);
            }
            function add_main(){
                $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                    var name = $(this).attr("name");
                    $(this).css("border", "1px solid #ccc");
                    $(this).val('');
                });
                $('#my_modal').modal('show');
            }
            function edit_main(){
                if(selectedRow == null){
                    $.message("请先选中一行数据！");
                    return;
                }
                $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                    var name = $(this).attr("name");
                    $(this).css("border", "1px solid #ccc");
                    $(this).val(selectedRow[name]);
                });
                $('#my_modal').modal('show');
            }
            function delete_main(){
                if(selectedRow == null){
                    $.message("请先选中一行数据！");
                    return;
                }
                $.message({
                    button:$.message.button.yesNo
                    ,text:"确定要删除此数据?"
                    ,result:function(result){
                        if(result == $.message.result.yes){
                            $.post("/app/dicinfo/deleteMain.do", {
                                dicId : selectedRow.dicId
                            }, function(rs) {
                                $.message(rs.msg);
                                if (rs.error == 0) {
                                    loadTable();
                                }
                            }, "json");
                        }
                    }
                });
            }
            function save_main(){
                var flag = true;
                var postData = {};

                $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                    $(this).css("border", "1px solid #ccc");
                    var name = $(this).attr("name");
                    if ($(this).attr("required") && !$(this).val()) {
                        flag = false;
                        $(this).css("border", "1px solid red");
                        $.message($(this).prev().text() + " 不能为空!");
                        return false;
                    }else{
                        postData[name] = $(this).val();
                    }
                });
                if(!flag) return;
                $.ajax({
                    url:"/app/dicinfo/saveMain.do",  //请求路径
                    data:postData, //请求参数
                    type:"post", //请求方式
                    async:true,  //是否异步，默认值true
                    dataType:'json',
                    success:function(rs){ ////成功之后回调
                        $.message(rs.msg);
                        if(rs.error == 0){
                            $('#my_modal').modal('hide');
                            loadTable();
                        }
                    }
                });
            }

            function loadTable(){
                selectedRow = null;//刷新列表前，把选中行设置为空
                myTable.ghTable();//刷新列表，可以不传参
            }
        </script>
    </master:Content>
</master:ContentPage>
