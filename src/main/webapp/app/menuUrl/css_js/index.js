var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/core/menuUrl/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    isPage:false,//不分页
    columns:[
        {name:'urlTitle',title:"标题",align:'left'},
        {name:'urlCode',title:'编码',align:'left'},
        {name:'urlStr',title:"路径",align:'left',width:'20%'},
        {name:'parameter',title:"参数",align:'left'},
        {name:'sysTime',title:"编制日期",align:'center',width:'20%'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};
$(window).load(function(){
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
                $.post("/core/menuUrl/deleteMain.do", {
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
            $(this).css("border", "1px solid red");
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

//重置
function search_show(form){
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        $(this).val("");
    });

    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    option.data = postData;
    myTable.ghTable(option);
    $('#'+form).modal('hide');
}

//搜索
function getSearch(form){
    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    option.data = postData;
    myTable.ghTable(option);
    $('#'+form).modal('hide');
}

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}