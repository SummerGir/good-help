var myTable = $("#myTableTest");
var selectedRow;
var _typeDetailId = "<%=typeDetailId%>";
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/note/getMainInfo.do",//表格请求的路径
    data:{typeDetailId:_typeDetailId},//请求的参数
    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
    columns:[
        {name:'title',title:"标题",align:'left'},
        {name:'content',title:'内容',align:'left'},
        {name:'sysTime',title:"编制日期",align:'center',width:'20%'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};
$(window).load(function(){
    clone_my_nav("need-nav");
    // myTable.ghTable(option);
    myTable.on("table.created", function() {
//                    $.message("创建表格");
        loading = false;
    });
    //行选中
    myTable.on("table.row.selected", function(event,eventData) {
        selectedRow = eventData.row;
    });

    $("#types_list .active").click();
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
    postData["typeDetailId"] = _typeDetailId;
    $.ajax({
        url:"/app/note/saveMain.do",  //请求路径
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