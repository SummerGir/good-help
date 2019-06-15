var detailTable = $("#detailTable");
var option_detail = {
    id:"#detailTable",//需要绑定的Id或class
    url:"/app/statement/realincome/loadDetailTableData.do",//表格请求的路径
    isPage:false,//不分页
    columns:[
        {name:'myTime',title:"标题",align:'left',width:'20%'},
        {name:'myMoney',title:'金额',align:'right',width:'20%'},
        {name:'dicInfo',title:'材料明细',align:'left'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};
$(window).load(function(){
    clone_my_nav("need-nav");
    detailCharts=$("#detailCharts");
    loadTable();

    loadCharts();
    loadTableData();

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
        [{title : "日期",field : "cycle",width : lw[index] + '%',rowspan:2,align: 'center'}],
        []
    ];

    for(var type in jbTypes){
        if(type == undefined)
            continue;
        var name = jbTypes[type];
        col[0].push({title : name + "分析",colspan:3});
        index ++;
        col[1].push({field:"count_" + type,title:name + "金额",readonly:true,width : lw[index] + '%',align: 'right',
            formatter: function(value,row,index){
                if(value > 0){
                    return "<span class='can-click'>"+ value +"</span>";
                }
                return "";
            }});
        index ++;
        col[1].push({field:"add_" + type,title:"增长量",readonly:true,width : lw[index] + '%',align: 'right'});
        index ++;
        col[1].push({field:"ratio_" + type,title:"同比增长",readonly:true,width : lw[index] + '%',align: 'right'});
    }
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

        },onClickCell:function(index,field,value){
            mainTable.datagrid('selectRow',index);
            var data = mainTable.datagrid('getSelected');
            // console.log(data);
            // console.log(value);
            var type = field.substr(field.length - 1);
            if((field == "count_0" || field == "count_1") && (value != '' && value > 0)){//工作金额
                loadDetailTableData(data,type);
            }
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

//加载明细表格数据
function loadDetailTableData(data,type){
    console.log(data);
    console.log(type);
    if(!type){
        return;
    }

    option_detail.data = {type: type,cycle: data.cycle};
    detailTable.ghTable(option_detail);
    $('#my_modal').modal('show');

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

    var typeCount = 1;
    var index = 1;
    for(var type in jbTypes){
        if(type == undefined)
            continue;
        typeCount++;
    }

    for(var type in jbTypes){
        if(type == undefined)
            continue;
        leg.push(jbTypes[type]);
        var ll = {
            name:jbTypes[type],
            type:"bar",
            data:[]
            // ,
            // markPoint: {
            //     data: []
            // }
        };
        for(var i = rows.length - 1 ; i >= 0 ; i--){
            var d = rows[i];
            if(index == 1){
                xA.push(d.cycle.substring(0,5)+"\n"+d.cycle.substring(5));
            }
            var v = d["count_" + type];
            ll.data.push(v);
            if(v > 0){
                // ll.markPoint.data.push({value: v,xAxis: (rows.length - 1) - i,yAxis: v});
            }
        }
        ss.push(ll);
        index++;
    }

    myCharts.hideLoading();

    //折线类别
    option.legend.data = leg;
    //X轴类型
    option.xAxis.data = xA;
    //数据
    option.series = ss;
    myCharts.setOption(option);
}