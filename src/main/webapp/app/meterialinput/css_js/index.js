var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/meterialinput/getMainInfo.do",//表格请求的路径
    data:{queryData:queryData},//请求的参数
    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
    rows:-1,
    columns:[
        {name:'inputCode',title:"单据编号",align:'left',width:'15%'},
        {name:'dicName',title:'材料名称',align:'left'},
        {name:'money',title:'单据金额',align:'center',width:'18%'},
        {name:'sysTime',title:"录入日期",align:'center',width:'18%'},
        {name:'isValid',title:"是否对账",align:'center',width:'18%'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};

var isLoad = false;
$(document).ready(function(){
    myTable.ghTable(option);
    myTable.on("table.created", function() {
//                    $.message("创建表格");
        loading = false;

        if(!isLoad){
            $("#myTableTest .my-table-left-select").empty().append('<input class="form-control" name="queryData" type="text" readonly="readonly" style="background-color: #fff" placeholder="请选择查询日期：" value="'+ queryData +'" onchange="getSearch2(this)">');

            //初始化日历控件
            $("#myTableTest .my-table-left-select input[name='queryData']").datetimepicker({
                format: 'yyyy-mm-dd',
                minView:2
            });
            isLoad = true;
        }
        getMainMoneyInfo();
    });
    //行选中
    myTable.on("table.row.selected", function(event,eventData) {
        selectedRow = eventData.row;
    });
    myTable.on("table.column.isValid.foramt", function (a, eventData) {
        var row = eventData.row;
        if(row.isValid == "已对账"){
            eventData.ed.html("<span style='color:#5cb85c'>"+ row.isValid +"</span>");
        }else{
            eventData.ed.html("<span style='color:#d9534f'>"+ row.isValid +"</span>");
        }

    });
});

function getMainMoneyInfo(){
    var queryData = $("#myTableTest .my-table-left-select input[name='queryData']").val();
    if(queryData == "" || queryData == null){
        return;
    }
    var beginTime = queryData + " 00:00:00";
    var endTime = queryData + " 23:59:59";
    $.ajax({
        url:"/app/meterialBill/getMainMoneyInfo.do",  //请求路径
        data:{beginTime: beginTime,endTime: endTime}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            console.log(rs);
            $(".count-div div[name='isValid_0']").html(rs.isValid_0);
            $(".count-div div[name='isValid_1']").html(rs.isValid_1);
            $(".count-div div[name='allMoney']").html(rs.allMoney);
            $(".count-div div[name='dicInfo']").html(rs.dicInfo);
        }
    });
}

//重置
function search_show(form){
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        $(this).val("");
    });
    $("#myTableTest .my-table-left-select input[name='queryData']").val(queryData);

    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    postData["queryData"] = queryData;
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
    postData["queryData"] = "";
    option.data = postData;
    myTable.ghTable(option);
    $('#'+form).modal('hide');
}
//搜索
function getSearch2(e){
    option.data = {queryData:$(e).val()};
    myTable.ghTable(option);
}

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

function save_main(type){
    var postData = get_data();

    if(postData){
        var main = postData.main;
        var code = "编号："+ main.year.substr(2) + (main.month > 9 ? main.month : ("0" + main.month)) + "-" + main.number;
        if(main.exception != ''){
            code += "-" + main.exception;
        }
        code += "\n";

        var detail = postData.detail;
        for(var i = 0 ; i < detail.length ; i++){
            code += detail[i].dicName + "：" + detail[i].detailNum + " " + detail[i].unitName + " ," + detail[i].money + " 元\n";
        }
        code += "总金额：<span style='color: red;'>" + main.allMoney + " 元</span>\n";

        var text = "总金额是"+ main.allMoney +"元，请确认";
        play_pronunciation(text);
        $.message({
            button:$.message.button.yesNo
            ,text:"确定要保存此数据?\n\n" + code
            ,result:function(result){
                if(result == $.message.result.yes){
                    $.ajax({
                        url:"/app/meterialinput/saveMain.do",  //请求路径
                        data:{postData: JSON.stringify(postData)}, //请求参数
                        type:"post", //请求方式
                        async:true,  //是否异步，默认值true
                        dataType:'json',
                        success:function(rs){ ////成功之后回调
                            if(type){
                                //继续新增
                                loadTable();
                                add_main();
                            }else{
                                $.message(rs.msg);
                                if(rs.error == 0){
                                    $('#my_modal').modal('hide');
                                    loadTable();
                                }
                            }

                        }
                    });
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

            var text = "请输入" + $(this).prev().text();
            text = text.replaceAll(":","");
            play_pronunciation(text);
            // $.message(text);
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

                var len = $(this).parents("tr").attr("class");
                if(len){
                    len = len.replaceAll("my-row-","");
                }
                var text = "";
                if(name == "detailNum"){
                    text += "请输入第" + len + "行的数量";
                }else if(name == "dicId"){
                    text += "请选择第" + len + "行的材料";
                }
                console.log(text);
                play_pronunciation(text);
                // $.message(text);
                return false;
            }else{
                d[name] = $(this).val();
                if(name = "dicId"){
                    $(this).find("option").each(function(){
                        if($(this).attr("value") == d["dicId"]){
                            d["dicName"] = $(this).text();
                            d["unitName"] = $(this).attr("un");
                        }
                    });
                }
            }
        });
        detail.push(d);
    });
    if(!flag) return;
    var postData = {main:main};
    if(detail.length > 0){
        postData.detail = detail;
    }
    return postData;
}

function delete_main(){
    if(selectedRow == null){
        $.message("请先选中一行数据！");
        return;
    }
    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除单据"+ selectedRow.inputCode +"?"
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
        str += '<td><input type="text" class="form-control" val_type="double" name="detailNum" onfocus="sz_border(this)" onkeyup="sz_NumCol(event,this,'+ len +')" placeholder="请填写数量：" required="required"   onblur="value=value.replace(/[^\\d{1,}\\.\\d{1,}|\\d{1,}]/g,\'\')"></td>';
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

function sz_NumCol(event,e,len){
    check_text(event,e);
    sz_money(len);
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