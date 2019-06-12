
$(function(){
    detailTable=$("#detailTable");
    loadTable();

    require(['echarts3'],function (ecs) {
        eCharts = ecs;
        loadCharts();
        loadTableData();
    });

    window.onresize=function(){
        if(myCharts){
            myCharts.resize();
        }
    };
});


//初始化表格
function loadTable(){
    var index = 0;
    var lw = getTableWidth();
    var col = [
        [{title : "周期",field : "cycle",width : lw[index] + '%',rowspan:2,align: 'center'}],
        []
    ];

    var type = 1;
    col[0].push({title : "端口",colspan:3});
    index ++;
    col[1].push({field:"count_" + type,title: "数量",readonly:true,width : lw[index] + '%',align: 'center'});
    index ++;
    col[1].push({field:"add_" + type,title:"增长数量",readonly:true,width : lw[index] + '%',align: 'center'});
    index ++;
    col[1].push({field:"ratio_" + type,title:"同比增长",readonly:true,width : lw[index] + '%',align: 'center'});

    mainTable=$("#mainTable").datagrid({
        height: 'auto',
        width: '100%',
        singleSelect: true,//单选
        fitColumns: true,
        autoRowHeight: true,
        scrollbarSize: 0,
        columns:col,
        onLoadSuccess: function (data) {
            if(data.rows.length===0){
                //关闭加载提示框
                mainTable.datagrid("loaded");
                return;
            }

            mainTable.datagrid("loaded");
        },onLoadError : function() {
            mainTable.datagrid("loaded");
        },onSelect : function(index,data){

        }
    });
}

//加载表格数据
function loadTableData(){
    var data = getSearchData();
    if(data === false){
        return;
    }

    mainTable.datagrid("loading");
    $.ajax({
        type : "post",
        url : "/app/statement/realincome/loadTableData.do",
        data : data,
        dataType : "json",
        success : function(msg){
            if($.isEmptyObject(msg)){
                mainTable.datagrid('loadData',{rows:[],footer:[]});
                myCharts.clear();
                return;
            }
            try{
                mainTable.datagrid('loadData',msg);
                //如果页面出现滚动条，会导致表格宽度变化，所以在这里重置一遍宽度
                mainTable.datagrid('resize',{width:'100%'});
                loadChartsData(msg.rows);
            }catch (e){
                mainTable.datagrid("loaded");
                myCharts.clear();
            }
        }
    });
}

//加载折线图数据
function loadChartsData(rows){
    if(!myCharts){
        loadCharts();
    }
    myCharts.showLoading();
    myCharts.clear();

    var leg = [];
    var xA = [];
    var ss = [];

    var type = 1
    leg.push('金额');
    var ll = {
        name:'金额',
        type:"line",
        smooth:true,//折线是否平滑
        data:[]
    };
    for(var i = rows.length - 1 ; i >= 0 ; i--){
        var d = rows[i];
        xA.push(d.cycle.substring(0,5)+"\n"+d.cycle.substring(5));
        ll.data.push(d["count_" + type]);
    }
    ss.push(ll);
    option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }]
    };
    myCharts.hideLoading();

    //折线类别
    option.legend.data = leg;
    //X轴类型
    option.xAxis.data = xA;
    //数据
    option.series = ss;
    myCharts.setOption(option);
}