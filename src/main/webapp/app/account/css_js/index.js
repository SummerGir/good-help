var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var js_memberId = "";
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/account/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
    columns:[
        {name:'memberName',title:"用户",align:'left',width:'20%'},
        {name:'accountType',title:"账户类型",align:'left',width:'20%'},
        {name:'accountName',title:"账号",align:'left',width:'20%'},
        {name:'accountPassword',title:"密码",align:'right',width:'20%'},
        {name:'comment',title:"备注",align:'left'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
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

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}

function add_main(){
    add_type(false);
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function (i,o) {
        var name = $(o).attr("name");
        $(o).val("");
    });
    if(js_memberId !=""){
        $("#my_modal select").val(js_memberId);
    }
    $('#my_modal').modal('show');
}

function edit_main() {
    if(selectedRow == null){
        $.message("请先选中一行");
        return;
    }
    add_type(false);

    $("#my_modal input,#my_modal select,#my_modal textarea").each(function (i,o) {
        var name = $(o).attr("name");
        $(o).val(selectedRow[name]);
    });
    $("#my_modal input[name='addType']").val(false);
    $('#my_modal').modal('show');
}

function save_main() {
    var flag = true;
    var postData = {};
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag=false;
            $(this).css ("border","1px,solid,red");
            $.message($(this).prev().text() + "不能为空");
            return false;
        }
        else {
            postData[name] = $(this).val();
        }
    });

    if(!flag)  return;
    $.ajax({
        url:"/app/account/saveMain.do",  //请求路径
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
                $.post("/app/account/deleteMain.do", {
                    accountId : selectedRow.accountId
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

function add_type(type){
    if(Boolean.parse(type)){
        $("#my_modal .type-select").hide();
        $("#my_modal .type-select").val("");
        $("#my_modal .type-input").show();
        $("#my_modal *[name='addType']").val(true);
    }else{
        $("#my_modal .type-select").show();
        $("#my_modal .type-input").hide();
        $("#my_modal .type-input").val("");
        $("#my_modal *[name='addType']").val(false);
    }

}

//重置
function search_show(form){
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        $(this).val("");
    });
    getSearch(form);
}

//搜索
function getSearch(form){
    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    option.data = postData;
    option.page = 1;
    myTable.ghTable(option);
    $('#'+form).modal('hide');
}

function sz_price(e) {
    var val = $(e).val();
    //获取select选中的data-val值
    $(e).find("option").each(function(){
        var opt_val = $(this).attr("value");
        var data_value = $(this).attr("data-val");
        if(val == opt_val){
            //获取价格标签对象
            var lab = $("input[name='costPrice']")
            //为价格标签设值
            lab.val(data_value);
        }
    })
}
function click_type(memberId,s) {
    $("#types_list li[class='active']").removeClass("active");
    $(s).addClass("active");
    if(memberId == "-1"){
        option.data.memberId = "";
        js_memberId = "";
    }else {
        option.data.memberId = memberId;
        js_memberId = memberId;
    }


    myTable.ghTable(option);


}
function search_main() {
    var postData = {};
    $("#search_modal input").each(function () {
        option.data[$(this).attr("name")] = $(this).val();
    });
    myTable.ghTable(option);
    $("#search_modal").modal("hide");
}

