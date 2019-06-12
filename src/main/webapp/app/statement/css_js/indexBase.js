var real_Path; //excel的下载路径
var mainTable;
var detailTable;
var myCharts,eCharts;
var sizeBase = 4;

var option = {
    title: {
        text: title+'图',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
    },
    toolbox: {
        show : true,
        itemGap: 20,//图标间隔
        right: 20,//图标最右边的距离
        feature : {
            magicType: {type: ['line', 'bar']},//折线图与柱状图切换按钮
            saveAsImage : {}//保存图片按钮
        }
    },
    legend: {
        left: 'left',
        data: []
    },
    xAxis: {
        type: 'category',
        splitLine: {show: false},
        data: []
    },
    yAxis: {type: 'value'},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    series: []
};

//初始化折线图
function loadCharts(){
    if(eCharts){
        myCharts=eCharts.init(detailTable[0], {width : "auto",backgroundColor: "#fff"});
    }
}

function getTableWidth(){
    var len = 4;
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
    $("#detail_main_form select,#detail_main_form input").each(function(i,o){
        var name = $(o).attr("name");
        data[name] = $(o).val();
    });
    return data;
}

//打印方式
function output_type (type){
    commit_output(type);
    if(typeof(real_Path) === "undefined"){
        $.message("请先添加数据！");
        return;
    }
    var postData = {};
    postData['type'] = type;
    postData['real_Path'] = real_Path;
    postData['source'] = 'reportForms';
    postData['quarry'] = '';
    postData['mainId'] = '';
    postData['mainName'] = '';
    processData(postData);
}