var myTable = $("#myTableTest");
var myDetailTable = $("#myDetailTable");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var thisDate = $(".search-div *[name='month']").val();
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/meterialBill/getMainInfo.do",//表格请求的路径
    data:{},
    allowSelected:true,//列不允许选中
    rows:50,//每页默认条数
    columns:[
        {name:'inputCode',title:'单据编号',align:'left'},
        {name:'money',title:"单据金额",align:'right',width:'25%'},
        {name:'cy',title:"对账差异",align:'right',width:'25%'},
        {name:'caozuo',title:"是否对账",align:'center',width:'25%'}
    ]
};
var option_detail = {
    id:"#myDetailTable",//需要绑定的Id或class
    url:"/app/meterialBill/getDetailInfo.do",//表格请求的路径
    data:{},
    allowSelected:true,//列不允许选中
    isPage:false,//每页默认条数
    columns:[
        {name:'inputCode',title:'单据编号',align:'left',width:'15%'},
        {name:'money',title:"单据金额",align:'right',width:'15%'},
        {name:'cy',title:"对账差异",align:'right',width:'25%'},
        {name:'dicInfo',title:"材料明细",align:'left'}
    ]
};
$(window).load(function(){

    clone_my_nav("need-nav");
    //初始化日历控件
//                $(".search-div input[name='beginTime'],.search-div input[name='endTime']").datetimepicker({
//                    format: 'yyyy-mm-dd',
//                    minView:2
//                });
    $(".search-div *[name='month']").val(defSel);
    search();
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

function read_main(){
    $('#read_modal').modal('show');
    var postData = {};
    $(".search-div input,.search-div select,.search-div textarea").each(function () {
        var name = $(this).attr("name");
        postData[name] = $(this).val();

    });
    option_detail.data = postData;

    myDetailTable.ghTable(option_detail);//刷新列表，可以不传参
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

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}

function save_main(){
    var postData = get_data();
    if(postData){
        $.ajax({
            url:"/app/meterialinput/saveBillMoney.do",  //请求路径
            data:postData, //请求参数
            type:"post", //请求方式
            async:true,  //是否异步，默认值true
            dataType:'json',
            success:function(rs1){ ////成功之后回调
                if(rs1.error == 0){
                    loadTable();
                    var text = "保存成功";
                    play_pronunciation(text);
                    $('#my_modal').modal('hide');
                }else{
                    $.message(rs1.msg);
                }
            }
        });
    }
}

function get_data(){
    var flag = true;
    var postData = {};

    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        if($(this).parents(".detail-div").length > 0)
            return;
        $(this).css("border", "1px solid #ccc");
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag = false;
            $(this).css("border", "1px solid red");

            var text = "请输入" + $(this).prev().text();
            text = text.replaceAll(":","");
            play_pronunciation(text);
            // $.message(text);
            return false;
        }else{
            postData[name] = $(this).val();
        }
    });
    if(!flag) return;
    return postData;
}

//重置
function search_show(form){
    $(".search-div input,.search-div select,.search-div textarea").each(function(){
        var name = $(this).attr("name");
        if("month" == name){
            return;
        }
        $(this).val("");
    });

    var isHave = false;
    $(".search-div *[name='month']>option").each(function(){
        var v = $(this).attr("value");
        if(v != "" && !isHave){
            $(".search-div *[name='month']").val(v);
            isHave = true;
        }
    });

    search()
}

function search() {
    var postData = {};
    $(".search-div input,.search-div select,.search-div textarea").each(function () {
        var name = $(this).attr("name");
        postData[name] = $(this).val();

    });
    option.data = postData;
    option.page = 1;
    myTable.ghTable(option);//刷新列表，可以不传参
    getMainMoneyInfo();
}

function se_valid(e){
    var mainId = $(e).val();
    var isValid = $(e).is(":checked");

    $.ajax({
        url:"/app/meterialinput/saveIsValid.do",  //请求路径
        data:{mainId:mainId,isValid:isValid}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            if(rs.error == 0){
                // myTable.ghTable(option);//刷新列表，可以不传参
                // getMainMoneyInfo();
            }else{
                $.message(rs.msg);
            }
        }
    });
}

function getMainMoneyInfo(){
    $.ajax({
        url:"/app/meterialBill/getMainMoneyInfo.do",  //请求路径
        data:option.data, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
//                        console.log(rs);
//             $(".count-div div[name='isValid_0']").html(rs.isValid_0);
//             $(".count-div div[name='isValid_1']").html(rs.isValid_1);
            $(".count-div div[name='allMoney']").html(rs.allMoney);
            // $(".count-div div[name='dicInfo']").html(rs.dicInfo);
            $(".count-div div[name='inputNum']").html(rs.inputNum);
            $(".count-div div[name='cyMoney']").html(rs.cyMoney);
            reset_nav();
        }
    });
}