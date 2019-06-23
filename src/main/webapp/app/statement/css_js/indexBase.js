var real_Path; //excel的下载路径
var mainTable;
var detailCharts;
var myCharts,echarts;
var sizeBase = 4;

var option = {
    title: {
        text: title+'图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    toolbox: {
        show : true,
        itemGap: 20,//图标间隔
        right: 20,//图标最右边的距离
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {type: 'value'},
    series: []
};

//初始化折线图
function loadCharts(){
    if(echarts){
        myCharts=echarts.init(detailCharts[0], {width : "auto",backgroundColor: "#fff"});
    }
}

function getTableWidth(n){
    var len = 0;
    for(var type in jbTypes){
        if(type == undefined)
            continue;
        len++;
    }
    len = len * n + 1;//列数
    var maxW = 100;//总宽度
    var dy = maxW % len;//得到除不尽的宽度，将除不尽的宽度留给第一列
    var wid = parseInt((maxW - dy) / len);//得到每列宽度；

    var lw = [];
    for(var i = 0 ; i < len ; i++){
        lw.push(i == 0 ? (dy + wid) : wid);
    }
    return lw;
}

//得到搜索条件
function getSearchData(){
    var data={};
    $(".search-div select,.search-div input").each(function(i,o){
        var name = $(o).attr("name");
        data[name] = $(o).val();
    });
    return data;
}
