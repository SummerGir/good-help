var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/typeinfo/getMainInfo.do",//表格请求的路径
    isPage: false,
    columns:[
        {name:'typeName',title:"类型名称",align:'left',width:'50%'},
        {name:'typeCode',title:'类型编码',align:'left'}
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
        if(selectedRow != null){
            option_detail.data = {mainId:selectedRow.typeId};
            myDetailTable.ghTable(option_detail);
        }
    });

});

function add_main(){
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        var name = $(this).attr("name");
        $(this).val("");
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
        $(this).val(selectedRow[name]);
    });

    $('#my_modal').modal('show');
}

function save_main(){
    var postData = get_data();

    if(postData){
        $.ajax({
            url:"/app/typeinfo/saveMain.do",  //请求路径
            data:postData, //请求参数
            type:"post", //请求方式
            async:true,  //是否异步，默认值true
            dataType:'json',
            success:function(rs){ ////成功之后回调
                $.message(rs.msg);
                if(rs.error == 0){
                    loadTable();
                    $('#my_modal').modal('hide');
                }
            }
        });
    }
}

function get_data(){
    var flag = true;
    var postData = {};

    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        $(this).css("border", "1px solid #ccc");
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag = false;
            $(this).css("border", "1px solid red");
            var text = "请输入" + $(this).prev().text();
            text = text.replaceAll(":","");
            $.message(text);
            return false;
        }else{
            postData[name] = $(this).val();
        }
    });
    if(!flag) return;

    return postData;
}

function delete_main(){
    if(selectedRow == null){
        $.message("请先选中一行数据！");
        return;
    }

    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除类型："+ selectedRow.typeName + "吗" +"?"
        ,result:function(result){
            if(result == $.message.result.yes){
                $.post("/app/typeinfo/deleteMain.do", {
                    mainId : selectedRow.typeId
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

function sz_border(e){
    $(e).css("border", "1px solid #ccc");
}

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}