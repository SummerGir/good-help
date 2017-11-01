<%@ taglib prefix="master" uri="util.masterPage" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/31
  Time: 15:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">随手记</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div id="main_table_customRibbon">
            <button onclick="$('#search_form').modal()" type="button"
                    class="btn btn-info">
                <i class="fa fa-book"></i> 搜索
            </button>
            <button onclick="add_main()" type="button" class="btn btn-success" id="add_main">
                <i class="fa fa-plus"></i> 新增
            </button>
            <button onclick="delete_main()" type="button" class="btn btn-danger" id="delete_main">
                <i class="fa fa-trash-o"></i> 删除
            </button>
        </div>

        <!-- 模态框（Modal） -->
        <div id="addNote" class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            新增/修改 一条数据
                        </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="noteId" value=""/>
                        <input type="hidden" name="typeDetailId" value=""/>
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
        <div id="myTableTest"></div>
        <script type="text/javascript">
            $(document).ready(function(){
                var option = {
                    id:"#myTableTest",//需要绑定的Id或class
                    url:"/app/note/info/getMainInfo.do",//表格请求的路径
                    type:"post",//请求方式
                    data:"",//请求的参数
                    dataType:"json",//请求的返回格式
                    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
                    isPage:true,//是否分页
                    page:1,//加载数据的初始页
                    rows:5,//每页默认条数
                    columns:[
                        {name:'title',title:"标题",align:'left'},
                        {name:'content',title:'内容',align:'left',width:'15%'},
                        {name:'sysTime',title:"编制日期",align:'center',width:'25%'}
                        ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
                };
                $.ghTable.set_div(option);
                $("#myTableTest").on("table.created", function() {
//                    $.message("创建表格");
                });
                $("#myTableTest").on("table.row.selected", function(event,eventData) {
//                    console.log(event);
//                    console.log(eventData);
//                    $.message("选中数据");
                });
            });
            function add_main(){
                console.log( $("#myTableTest").ghTable("getSelected"));
                $('#addNote').modal('show');
            }
            function save_main(){
                var flag = true;
                var postData = {};
                $(".addNote input,.addNote select,.addNote textarea").each(function () {
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
                    url:"/app/note/info/saveMain.do",  //请求路径
                    data:postData, //请求参数
                    type:"post", //请求方式
                    async:true,  //是否异步，默认值true
                    dataType:'json',
                    success:function(rs){ ////成功之后回调
                        $.message(rs.msg);
                        if(rs.error){
                            $('#addNote').modal('hide');
                        }
                    }
                });
            }
            function delete_main(){

            }
        </script>
    </master:Content>
</master:ContentPage>
