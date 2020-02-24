
var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var thisYear;
var thisMonth;
var thisDayStr = "";
var thisCycle =  30;

var selectedRow;
var loading = false;//控制项目列表频繁点击
var optionMensCycle = {
    title:{
        show:true,
        text:"月经周期变化图"
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
    legend: {
        // data: ['真实数据', '预期数据']
    },
    xAxis: {
        name:'开始日期',
        data: []
    },
    yAxis: {
        name:'持续天数',
        type: 'value',
        scale: true
    },
    series: [
        {
            name:"真实数据",
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
        {
            name:"预期数据",
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
                color:"#999",
                type: 'dashed'
            }

        }
    ]
};
var optionMensCycleOveCycle = {
    title:{
        show:true,
        text:"排卵日周期变化图"
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
    legend: {
        // data: ['真实数据', '预期数据']
    },
    xAxis: {
        name:'开始日期',
        data: []
    },
    yAxis: {
        name:'持续天数',
        type: 'value',
        scale: true
    },
    series: [
        {
            name:"真实数据",
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
        {
            name:"预期数据",
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
                color:"#999",
                type: 'dashed'
            }

        }
    ]
};
var myChart;
var oveCycleChart;
$(window).load(function(){
    var d = new Date();
    thisYear = d.getFullYear();
    thisMonth = d.getMonth();
    loadCalendar();
    require(["/public/ECharts/echarts_1.js",""],function(es){/// aaa 接收aaa模块暴露的方法，没有暴露则可以不写
        myChart = es.init($("#myTableTest")[0]);
        oveCycleChart = es.init($("#oveCycle")[0]);
        selectChange();
    });
});

function loadCalendar() {
    $(".sr-table>.sr-title>.sr-tr>.sr-td-title>.center-text").html(getTitle());
    $(".sr-table>.sr-thead>.sr-tr").html(getWeeks());
    loadTbody();
}

function loadTbody() {
    var rs = getDayCls();
    var d = new Date();
    d.setFullYear(thisYear);
    d.setMonth(thisMonth);
    d.setDate(1);
    var d2 = new Date();
    var ds = [];
    var thisDayStr = thisDayStr;
    var i = 0;
    while (thisYear == d.getFullYear() && thisMonth == d.getMonth()) {
        if (ds[i] == null) {
            ds[i] = [];
        }
        //第一周需要填充满
        if (i == 0 && ds[i].length == 0 && d.getDay() != 0) {
            for (var a = 0; a < d.getDay(); a++) {
                ds[i].push(null);
            }
        }
        var cls = rs[this.getDateStr(d)];
        if(cls == undefined){
            cls = "";
        }
        var dStr = d.getDate();
        var dateStr = this.getDateStr(d);
        if(d.getFullYear() == d2.getFullYear() && d.getMonth() == d2.getMonth() && d.getDate() == d2.getDate()){
            dStr = "今";
            if (thisDayStr == "")
                thisDayStr = dateStr
        }
        ds[i].push({ year: d.getFullYear(), month: d.getMonth(), day: dStr, dateStr: dateStr, cls: cls});

        if (d.getDay() != 0 && d.getDay() % 6 == 0) {
            i++;
        }
        d.setDate(d.getDate() + 1);
    }

    if (ds[ds.length - 1].length < 7) {
        for (var a = ds[ds.length - 1].length; a < 7; a++) {
            ds[ds.length - 1].push(null);
        }
    }
    var str = '';
    for(var i = 0 ; i < ds.length ; i++){
        str += '<div class="sr-tr">';
        var days = ds[i];
        for(var j = 0 ; j < days.length ; j++){
            str += '<div class="sr-td">';
            var item = days[j];
            if(item != null){
                // console.log("thisDayStr：" + thisDayStr + "    item.dateStr：" + item.dateStr + "   " +thisDayStr == item.dateStr);
                str += '<div class="'+ item.cls +'">';
                str += '<div onclick="dayChecked(this)" data-str="'+ item.dateStr +'">'+ item.day +'</div>';
                str += '</div>';
            }
            str += '</div>';
        }
        str += '</div>';
    }
    $(".sr-table>.sr-tbody").empty().append(str);
}

function getWeeks() {
    var str = "";
    weeks.forEach(function (item,index) {
        if(item){
            str += "<div class='sr-th'>"+item+"</div>";
        }
    });
    return str;
}
function ove() {
    var isError = false;
    var msg = "";
    if(thisDayStr == ""){
        isError = true;
        msg = "请选择一天！";
    }else{
        var l = thisDayStr.split("-");
        var d1 = new Date();
        var d = new Date();
        d.setFullYear(l[0]);
        d.setMonth(l[1] - 1);
        d.setDate(l[2]);
    }
    if (isError) {
        $.message(msg);
    }else{
        $.ajax({
            url:"/app/menstrualinfo/setOveTime.do",  //请求路径
            data:{"oveTime": thisDayStr}, //请求参数
            type:"post", //请求方式
            async:true,  //是否异步，默认值true
            dataType:'json',
            success:function(rs){ ////成功之后回调
                $.message(rs.msg);
                if(rs.error == 0){
                    loadTbody();
                    selectChange();
                }
            }
        });
    }
}


function jqComIng(){
    var isError = false;
    var msg = "";
    if(thisDayStr == ""){
        isError = true;
        msg = "请选择一天！";
    }else{
        var l = thisDayStr.split("-");
        var d1 = new Date();
        var d = new Date();
        d.setFullYear(l[0]);
        d.setMonth(l[1] - 1);
        d.setDate(l[2]);

        if ((d.getFullYear() == d1.getFullYear() && d.getMonth() == d1.getMonth() && d.getDate() > d1.getDate()) || (d.getFullYear() == d1.getFullYear() && d.getMonth() > d1.getMonth()) || d.getFullYear() > d1.getFullYear()) {
            isError = true;
            msg = "不能设置未来日期！";
        }
    }

    if (isError) {
        $.message(msg);
    }else{
        $.ajax({
            url:"/app/menstrualinfo/saveMain.do",  //请求路径
            data:{startTime: thisDayStr}, //请求参数
            type:"post", //请求方式
            async:true,  //是否异步，默认值true
            dataType:'json',
            success:function(rs){ ////成功之后回调
                $.message(rs.msg);
                if(rs.error == 0){
                    loadTbody();
                    selectChange();
                }
            }
        });
    }
}

function delete_last() {
    $.ajax({
        url:"/app/menstrualinfo/deleteMain.do",  //请求路径
        data:{}, //请求参数
        type:"post", //请求方式
        async:false,  //是否异步，默认值true
        dataType:'json',
        success:function(res){ ////成功之后回调
            $.message(res.msg);
            if(res.error==0){
                loadTbody();
                selectChange();
            }
        }
    })
}

function changeMonth(type){
    if(!type){
        thisMonth ++;
        if(thisMonth > 11){
            thisYear++;
            thisMonth = 0;
        }
    }else {
        thisMonth --;
        if(thisMonth<0){
            thisYear--;
            thisMonth = 11;
        }
    }
    loadCalendar();
}


function getDayCls(){
    var r = {};
    $.ajax({
        url:"/app/menstrualinfo/getMainInfo.do",  //请求路径
        data:{"year":thisYear,"month":thisMonth+1}, //请求参数
        type:"post", //请求方式
        async:false,  //是否异步，默认值true
        dataType:'json',
        success:function(res){ ////成功之后回调
            var rows = res.rows;
            for(var i=0;i<rows.length;i++){
                var row = rows[i];
                if(!String.isNullOrWhiteSpace(row.actStartTime)){
                    var d = getStrDate(row.actStartTime);
                    cls = "jq-sj jq-sj-start";//经期开始
                    r[getDateStr(d)] = cls;

                    d.setDate(d.getDate()+1);
                    cls = "jq-sj";//经期中途
                    r[getDateStr(d)] = cls;

                    d.setDate(d.getDate()+1);
                    cls = "jq-sj jq-sj-end";//经期结束
                    r[getDateStr(d)] = cls;
                }else if(!String.isNullOrWhiteSpace(row.planStartTime) ){
                    var d = getStrDate(row.planStartTime);
                    cls = "jq-yc jq-yc-start";//预测经期开始
                    r[getDateStr(d)] = cls;

                    d.setDate(d.getDate()+1);
                    cls = "jq-yc jq-yc-center";//预测经期中途
                    r[getDateStr(d)] = cls;

                    d.setDate(d.getDate()+1);
                    cls = "jq-yc jq-yc-end";//预测经期结束
                    r[getDateStr(d)] = cls;
                }

                if(!String.isNullOrWhiteSpace(row.actOveTime)){
                    var d = getStrDate(row.actOveTime);
                    cls = "jq-plr";//排卵日
                    r[getDateStr(d)] = cls;

                    cls = "jq-plq";//排卵期
                    for(var j=1;j<5;j++){
                        d.setDate(d.getDate()+1);
                        r[getDateStr(d)] = cls;
                    }
                    d.setDate(d.getDate()-4);
                    for(var j=1;j<6;j++){
                        d.setDate(d.getDate()-1);
                        r[getDateStr(d)] = cls;
                    }
                }else if(!String.isNullOrWhiteSpace(row.planOveTime)){
                    var d = getStrDate(row.planOveTime);
                    cls = "jq-plr";//排卵日
                    r[getDateStr(d)] = cls;

                    cls = "jq-plq";//排卵期
                    for(var j=1;j<5;j++){
                        d.setDate(d.getDate()+1);
                        r[getDateStr(d)] = cls;
                    }
                    d.setDate(d.getDate()-4);
                    for(var j=1;j<6;j++){
                        d.setDate(d.getDate()-1);
                        r[getDateStr(d)] = cls;
                    }
                }

            }
        }
    });
    return r;
}

function dayChecked(e) {
    thisDayStr = $(e).attr("data-str");
    $(".sr-tbody .sr-tr .sr-td>div>div").removeClass("day-checked");
    $(e).attr("class","day-checked");
}

function getTitle(){
    var str = thisYear + "年";
    str += thisMonth < 9 ? ("0" + (thisMonth + 1)) : (thisMonth + 1);
    str += "月";
    return str;
}

function getDateStr(d){
    var str = d.getFullYear() + "-";
    str += d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
    str += "-";
    str += d.getDate() < 9 ? ("0" + d.getDate()) : d.getDate();
    return str;
}

function getStrDate(s) {
    var l = s.split("-");
    var d = new Date();
    d.setFullYear(l[0]);
    d.setMonth(l[1] - 1);
    d.setDate(l[2]);
    return d;
}
function selectChange() {
    var year = $("#select-year").val();
    getYearInfo(year);
}


function getYearInfo(year) {
    $.ajax({
        url:"/app/menstrualinfo/getMainInfo.do",
        data:{"year":year},
        type:"post",
        async:false,
        dataType:"json",
        success:function (res) {
            optionMensCycle.xAxis.data = [];
            optionMensCycle.series[0].data = [];
            optionMensCycle.series[1].data = [];
            optionMensCycleOveCycle.xAxis.data = [];
            optionMensCycleOveCycle.series[0].data = [];
            optionMensCycleOveCycle.series[1].data = [];
            for(var i=0;i<res.rows.length;i++){
                var obj = res.rows[i];
                optionMensCycle.xAxis.data.push(createChartsItem(obj.actStartTime));
                optionMensCycle.series[0].data.push(obj.actMensCycle);
                optionMensCycle.series[1].data.push(obj.planMensCycle);

                optionMensCycleOveCycle.xAxis.data.push(createChartsItem(obj.actStartTime));
                optionMensCycleOveCycle.series[0].data.push(obj.actOveCycle);
                optionMensCycleOveCycle.series[1].data.push(obj.planOveCycle);

            }

            myChart.setOption(optionMensCycle);
            oveCycleChart.setOption(optionMensCycleOveCycle);
        }
    })
}


function createChartsItem(value,color,taskTitle,title,align,isShowTitle){
    return {
        value : value,
        itemStyle : {normal : {color : color,borderColor:"#ffffff"}},
        label : {
            normal : {
                show : true,
                position : align,
                formatter : function(e){
                    if(isShowTitle)
                        return title == null ? e.data.taskTitle:title;
                    return "";
                },
                textStyle : {color : '#000000'},
                offset : [0,0]
            }
        },
        taskTitle : taskTitle
    };
}