<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
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

    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree("menu_url");
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=menuTree.getTitle()%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
        <style type="text/css">
            button>i{
                margin-right: 5px;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="row">
            <div class="col-md-12">
                <!--表格-->
                <div id="myTableTest"></div>
                <!--表格的工具栏-->
                <div id="main_table_customRibbon" style="display: none;">
                    <%--<button onclick="$('#search_form').modal()" type="button" class="btn btn-primary">--%>
                        <%--<i class="glyphicon glyphicon-search"></i> 搜索--%>
                    <%--</button>--%>
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

        <!-- 模态框（Modal） -->
        <div id="my_modal" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" style="width: 450px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            新增/修改 一条数据
                        </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="noteId" value=""/>
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <h5>笔记标题:</h5>
                                <input type="text" class="form-control" name="title" placeholder="请填写标题：">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <h5>笔记内容:</h5>
                                <textarea rows="3" class="form-control" name="content" placeholder="请填写笔记内容：" required="required"></textarea>
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
                url:"/core/menuUrl/getMainInfo.do",//表格请求的路径
                data:{},//请求的参数
                toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                columns:[
                    {name:'title',title:"标题",align:'left'},
                    {name:'code',title:'编码',align:'left'},
                    {name:'url',title:"路径",align:'left',width:'20%'},
                    {name:'parameter',title:"参数",align:'left'},
                    {name:'sysTime',title:"编制日期",align:'center',width:'20%'}
                ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
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

            function add_main(){
                $('#my_modal').modal('show');
            }
            function edit_main(){
                if(selectedRow == null){
                    $.message("请先选中一行数据！");
                    return;
                }
                $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                    var name = $(this).attr("name");
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
                            $.post("/app/note/deleteMain.do", {
                                mainId : selectedRow.noteId
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
                    var name = $(this).attr("name");
                    if ($(this).attr("required") && !$(this).val()) {
                        flag = false;
                        $(this).css("border", "1px solid red")
                        $.message($(this).prev().text() + " 不能为空!");
                        return false;
                    }else{
                        postData[name] = $(this).val();
                    }
                });
                if(!flag) return;
                $.ajax({
                    url:"/core/menuUrl/saveMain.do",  //请求路径
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
