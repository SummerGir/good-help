var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/meterialinput/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
    columns:[
        {name:'inputCode',title:"单据编号",align:'left'},
        {name:'dicName',title:'材料名称',align:'left'},
        {name:'money',title:'单据金额',align:'center'},
        {name:'sysTime',title:"录入日期",align:'center',width:'20%'},
        {name:'isValid',title:"是否对账",align:'center',width:'20%'},
        {name:'comment',title:"备注说明",align:'left',width:'20%'}
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
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        var name = $(this).attr("name");
        if("year" == name || "month" == name)
            return;
        $(this).val("");
    });

    sz_tbody(null);
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
    
    var mainId = selectedRow["inputId"];
    $.ajax({
        url:"/app/meterialinput/getDetailInfo.do",  //请求路径
        data:{mainId:mainId}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            if(rs != null && rs.length > 0){
                sz_tbody(rs);
            }
            sz_allMoney();
            $('#my_modal').modal('show');
        },error:function(){
            $.message("查询明细错误信息");
            sz_tbody(null);
            $('#my_modal').modal('show');
        }
    });
}

function save_main(){
    var postData = get_data();
    if(postData){
        $.ajax({
            url:"/app/meterialinput/saveMain.do",  //请求路径
            data:{postData: JSON.stringify(postData)}, //请求参数
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
}

function get_data(){
    var flag = true;
    var main = {};
    var detail = [];

    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        if($(this).parents(".detail-div").length > 0)
            return;
        $(this).css("border", "1px solid #ccc");
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag = false;
            $(this).css("border", "1px solid red");
            $.message($(this).prev().text() + " 不能为空!");
            return false;
        }else{
            main[name] = $(this).val();
        }
    });
    if(!flag) return;
    $(".detail-div table tbody tr").each(function(){
        var d = {};
        $(this).find("input,select").each(function () {
            $(this).css("border", "1px solid #ccc");
            var name = $(this).attr("name");
            if ($(this).attr("required") && !$(this).val()) {
                flag = false;
                $(this).css("border", "1px solid red");
                $.message("不能为空!");
                return false;
            }else{
                d[name] = $(this).val();
            }
        });
        detail.push(d);
    });
    if(!flag) return;
    return {main:main,detail:detail};
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
                $.post("/app/meterialinput/deleteMain.do", {
                    mainId : selectedRow.inputId
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
function sz_tbody(vals){
    $(".detail-div table tbody").empty();
    if(vals != null){
        for(var i = 0 ; i < vals.length ; i++){
            sz_rows(null,true,vals[i]);
        }
    }else{
        sz_rows(null,true,null);
    }
}

function sz_rows(e,type,val){
    var str = '';
    var len = $(".detail-div table tbody>tr").length + 1;
    if(type){
        str += '<tr class="my-row-'+ len +'">';
        str += '<td class="caozuo">';
        str += '<div>';
        str += '<div onclick="sz_rows(this,true,null)" title="在下面添加一条">+</div>';
        str += '<div onclick="sz_rows(this,false,null)" title="删除这一条">-</div>';
        str += '</div>';
        str += '</td>';
        str += '<td><select class="form-control" name="dicId" required="required" onfocus="sz_border(this)" onchange="sz_price(this,'+ len +')">'+ _sbDic +'</select></td>';
        str += '<td><input type="text" class="form-control" name="detailNum" onfocus="sz_border(this)" onblur="sz_money('+ len +')" placeholder="请填写数量：" required="required"  onkeyup="value=value.replace(/[^\\d{1,}\\.\\d{1,}|\\d{1,}]/g,\'\')"  onblur="value=value.replace(/[^\\d{1,}\\.\\d{1,}|\\d{1,}]/g,\'\')"></td>';
        str += '<td><input type="text" class="form-control" name="detailPrice" placeholder="自动获取" disabled="disabled"></td>';
        str += '<td><input type="text" class="form-control" name="money" placeholder="自动计算" disabled="disabled"></td>';
        str += '</tr>';
    }

    if(e == null){
        $(".detail-div table tbody").append(str);
    }else{
        if(type){
            $(e).parents("tr").after(str);
        }else{
            $(e).parents("tr").remove();
            sz_allMoney();
        }
    }
    
    if(val != null && val != undefined){
        $(".my-row-" + len).find("*[name='dicId']").val(val.dicId);
        $(".my-row-" + len).find("*[name='detailNum']").val(val.detailNum);
        $(".my-row-" + len).find("*[name='detailPrice']").val(val.detailPrice);
        $(".my-row-" + len).find("*[name='money']").val(val.money);
    }else{
        sz_price($(".my-row-" + len).find("*[name='dicId']"));
    }
}

function sz_price(e,len){
    if(e == null || e == undefined)
        return;
    var detailPrice = "";
    var dicId = $(e).val();
    $(e).find("option").each(function(i,o){
        if($(o).attr("value") == dicId){
            detailPrice = $(o).attr("pr")
        }
    });
    $(e).parents("tr").find("*[name='detailPrice']").val(detailPrice);
    sz_money(len);
}

function sz_money(len){
    var detailNum = $(".my-row-" + len).find("*[name='detailNum']").val();
    var detailPrice = $(".my-row-" + len).find("*[name='detailPrice']").val();

    if(detailNum == "" || detailNum == null || detailNum == undefined){
        detailNum = "0";
    }if(detailPrice == "" || detailPrice == null || detailPrice == undefined){
        detailPrice = "0";
    }
    detailNum = parseFloat(detailNum);
    detailPrice = parseFloat(detailPrice);

    var money = (detailNum * detailPrice).toFixed(2);
    $(".my-row-" + len).find("*[name='money']").val(money);

    sz_allMoney();
}

function sz_allMoney(){
    var allMoney = 0.00;
    $(".detail-div table tbody>tr").each(function(i,o){
        var m = $(o).find("*[name='money']").val();
        if(m == "" || m == null || m == undefined){
            m = "0";
        }
        allMoney += parseFloat(m);
    });
    $("#my_modal input[name='allMoney']").val(allMoney.toFixed(2));
}

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}