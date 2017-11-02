<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
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
    String typeDetailId = request.getParameter("typeDetailId");
    String typeCode = "note";
    TypeSelectEntity pse = AppTypeDetailService.getInstance().getTypeSelect(typeCode,typeDetailId);
    typeDetailId= StringUtils.isNotBlank(pse.getSelectedTypeId())?pse.getSelectedTypeId():"00000000-00000000-00000000";
    StringBuffer listOp = pse.getListOp();
    StringBuffer finishedProOp = pse.getFinishedProOp();
    StringBuffer doingProOp = pse.getDoingProOp();

%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">随手记</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="row">
            <jsp:include page="/app/type/select.jsp" >
                <jsp:param name="listOp" value="<%=listOp%>"/>
                <jsp:param name="finishedProOp" value="<%=finishedProOp%>"/>
                <jsp:param name="doingProOp" value="<%=doingProOp%>"/>
            </jsp:include>
            <div class="col-md-10">
                <!--表格-->
                <div id="myTableTest"></div>
                <!--表格的工具栏-->
                <div id="main_table_customRibbon" style="display: none;">
                    <button onclick="$('#search_form').modal()" type="button"
                            class="btn btn-info">
                        <i class="glyphicon glyphicon-search"></i> 搜索
                    </button>
                    <button onclick="add_main()" type="button" class="btn btn-success" id="add_main">
                        <i class="glyphicon glyphicon-plus"></i> 新增
                    </button>
                    <button onclick="edit_main()" type="button" class="btn btn-warning" id="edit_main">
                        <i class="glyphicon glyphicon-edit"></i>
                        修改
                    </button>
                    <button onclick="delete_main()" type="button" class="btn btn-danger" id="delete_main">
                        <i class="glyphicon glyphicon-remove"></i> 删除
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary" onclick="save_main()">
                            提交保存
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <script type="text/javascript">
            var myTable = $("#myTableTest");
            var selectedRow;
            var _typeDetailId = "<%=typeDetailId%>";
            var loading = false;//控制项目列表频繁点击
            var option = {
                id:"#myTableTest",//需要绑定的Id或class
                url:"/app/note/info/getMainInfo.do",//表格请求的路径
                type:"post",//请求方式
                data:{typeDetailId:_typeDetailId},//请求的参数
                dataType:"json",//请求的返回格式
                toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                isPage:true,//是否分页
                page:1,//加载数据的初始页
                rows:5,//每页默认条数
                columns:[
                    {name:'title',title:"标题",align:'left'},
                    {name:'content',title:'内容',align:'left'},
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

            //点击项目名称
            function click_type(typeDetailId,e){
                if(loading)return;
                loading = true;
                $("#types_list li[class='active']").removeClass("active");
                $(e).addClass("active");
                _typeDetailId = typeDetailId;
                option.data.typeDetailId = _typeDetailId;
                myTable.ghTable(option);
            }
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
                            $.post("/app/note/info/deleteMain.do", {
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
                postData["typeDetailId"] = _typeDetailId;
                $.ajax({
                    url:"/app/note/info/saveMain.do",  //请求路径
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
