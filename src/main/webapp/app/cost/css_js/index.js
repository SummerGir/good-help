var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var myChart;
var _typeDetailId;
var optionECharts = {
    title:{
        show:true,
        // text:"月经周期变化图"
    },
    tooltip: {
        trigger: 'axits'
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },

    xAxis: {
        name:'消费日期',
        data: []
    },
    yAxis: {
        name:'消费价格',
        type: 'value',
        scale: true
    },
    series: [
        {
            // name:"真实数据",
            type: 'line',
            data: [],
            itemStyle : {
                normal: {
                    label : {
                        show: true,
                        color:"#000",
                        fontSize:15
                    }
                }
            },
            lineStyle: {
                color:"#ffc1d9",
                width:3
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}

                ]
            }

        },

    ]
};
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/cost/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    toolbar:"#main_table_customRibbon",//表格上面的工具栏用哪个容器
    columns:[
        {name:'typeDetailName',title:"消费类型",align:'left',width:'20%'},
        {name:'payMoney',title:"消费金额",align:'right',width:'15%'},
        {name:'costNum',title:"消费数量",align:'right',width:'15%'},
        {name:'costPrice',title:"消费价格",align:'right',width:'15%'},
        {name:'costTime',title:"消费日期",align:'center',width:'15%'},
        {name:'title',title:'备注说明',align:'left'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};
$(window).load(function(){
    clone_my_nav("need-nav");
    myTable.on("table.created", function() {
        loading = false;
    });
    //行选中
    myTable.on("table.row.selected", function(event,eventData) {
        selectedRow = eventData.row;
    });
    require(["/public/ECharts/echarts_1.js",""],function(es){/// aaa 接收aaa模块暴露的方法，没有暴露则可以不写
        myChart = es.init($("#myECharts")[0]);
        $("#types_list .active").click();
    });



});

function click_type(typeDetailId,e){
    // if(loading)return;
    // loading = true;
    $("#types_list li[class='active']").removeClass("active");
    $(e).addClass("active");
    _typeDetailId = typeDetailId;
    option.data.typeDetailId = _typeDetailId;
    myTable.ghTable(option);
    fillSelect();


}

function fillSelect() {
    $.ajax({
        url:"/app/cost/getYearList.do",
        data:{"typeDetailId":_typeDetailId},
        type:"post",
        async:"false",
        dataType:"text",
        success:function (rs) {
            $("#select-year").html(rs);
            selectChange();
        }
    })
}

function loadTable(){
    selectedRow = null;//刷新列表前，把选中行设置为空
    myTable.ghTable();//刷新列表，可以不传参
}

function selectChange() {
    var year = $("#select-year").val();
    getYearInfo(year);
}
function getYearInfo(year) {
    $.ajax({
        url:"/app/cost/getMainInfo.do",
        data:{"myYear":year,"typeDetailId":_typeDetailId},
        type:"post",
        async:"false",
        dataType:"json",
        success:function (rs) {
            optionECharts.xAxis.data = [];
            optionECharts.series[0].data = [];
            for(var i=rs.rows.length-1;i>=0;i--){
                var obj = rs.rows[i];
                optionECharts.xAxis.data.push(obj.costTime);
                optionECharts.series[0].data.push(obj.payMoney);
            }
            myChart.setOption(optionECharts);

        }
    })
}

function add_main(){
    add_type(false);
    $("#my_modal input,#my_modal select").each(function (i,o) {
        var name = $(o).attr("name");
        $(o).val("");

    });
    $("#my_modal select").val(_typeDetailId);
    $('#my_modal').modal('show');
}

function edit_main() {
    if(selectedRow == null){
        $.message("请先选中一行");
        return;
    }
    add_type(false);

    $("#my_modal input,#my_modal select").each(function (i,o) {
        var name = $(o).attr("name");
        $(o).val(selectedRow[name]);
    });
    $("#my_modal input[name='addType']").val(false);
    $('#my_modal').modal('show');

}

function save_main() {
    var flag = true;
    var postData = {};
    $("#my_modal input,#my_modal select").each(function () {
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

    if(!Boolean.parse(postData.addType) && String.isNullOrWhiteSpace(postData.typeDetailId)){
        $("#my_modal .type-select>select").css ("border","1px,solid,red");
        $.message("请选择消费类型");
        return false;
    }else if(Boolean.parse(postData.addType) && String.isNullOrWhiteSpace(postData.typeName)){
        $("#my_modal .type-input>input").css ("border","1px,solid,red");
        $.message("请输入消费类型名称");
        return false;
    }
    postData["menuCode"] = menuCode;
    $.ajax({
        url:"/app/cost/saveMain.do",  //请求路径
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
                $.post("/app/cost/deleteMain.do", {
                    mainId : selectedRow.costId
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

//点击项目名称



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

