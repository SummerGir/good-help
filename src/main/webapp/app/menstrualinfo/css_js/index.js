
var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var thisYear;
var thisMonth;
var thisDayStr = "";
var thisCycle =  30;
var mensDiver =  "准时来了";
var jqState = 1;//1:来了，0走了

var myTable = $("#myTableTest");
var selectedRow;
var loading = false;//控制项目列表频繁点击
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/menstrualinfo/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    columns:[
        {name:'startTime',title:"开始日期",align:'center',width:'30%'},
        {name:'mensCycle',title:"实际/预计持续天数",align:'center',width:'20%'},
        {name:'diverStr',title:"状态",align:'left',width:'30%'},
        {name:'sysTime',title:'编制日期',align:'center',width:'20%'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};

$(window).load(function(){
    // clone_my_nav("need-nav");
    myTable.ghTable(option);
    myTable.on("table.created", function() {
//                    $.message("创建表格");
        loading = false;
    });
    //行选中
    myTable.on("table.row.selected", function(event,eventData) {
        selectedRow = eventData.row;
    });
    myTable.on("table.column.mensCycle.foramt", function (a, eventData) {
        var row = eventData.row;
        if(!Boolean.parse(row.isValid)){
            eventData.ed.html('<span class="plan-days">' + row.mensCycle + '（预）</span>');
        }else{
            eventData.ed.html(row.mensCycle);
        }
    });

    var d = new Date();
    thisYear = d.getFullYear();
    thisMonth = d.getMonth();

    var str = '';
    weeks.forEach(function(item,index){
        if(!item)
            return;
        str += '<div class="sr-th" >'+ item +'</div>';
    });
    $(".sr-table>.sr-thead>.sr-tr").append(str);
    loadTbody();
});

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
                loadTbody();
                myTable.ghTable(option);
            }
        });
    }
}

function loadTbody() {
    var rs = getDayCls();
    // console.log(rs);
    var d = new Date();
    d.setFullYear(thisYear);
    d.setMonth(thisMonth);
    d.setDate(1);

    $(".sr-table>.sr-title>.sr-tr>.sr-td-title>.center-text").html(getTitle());
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
    // console.log(ds);
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

function changeMonth(type){
    if(type){
        thisMouth ++;
        if(thisMouth > 11){
            thisYear++;
            thisMouth = 0;
        }
    }else {
        thisMouth --;
        if(thisMouth<0){
            thisYear--;
            thisMouth = 11;
        }
    }
    loadTbody();
}
function getDayCls(){
    var r = {};
    $.ajax({
        url:"/app/menstrualinfo/saveMain.do",  //请求路径
        data:{}, //请求参数
        type:"post", //请求方式
        async:false,  //是否异步，默认值true
        dataType:'json',
        success:function(res){ ////成功之后回调
            // console.log(res);
            if (res.error == 0) {
                var entity = JSON.parse(res.msg);
                if(entity != null){
                    try{
                        console.log(entity);
                        var mensDiver = "准时来了";
                        try{
                            if (entity.mensDiver){
                                var mensDiver = parseInt(entity.mensDiver);
                                if (mensDiver > 0) {
                                    mensDiver = "延期 " + mensDiver + "天";
                                } else if (mensDiver < 0) {
                                    mensDiver = "提前 " + (-mensDiver) + "天";
                                }
                            }
                        }catch(e){
                            console.log(e)
                        }

                        //从上次月经开始，推算出到当前查看月份的下一个月的预测经期开始时间
                        var ds = [];
                        var l = entity.startTime.split("-");
                        var d = new Date();
                        d.setFullYear(l[0]);
                        d.setMonth(l[1] - 1);
                        d.setDate(l[2]);

                        var cycle = (entity == null || entity.mensCycle == null) ? 28 : parseInt(entity.mensCycle);//平均周期
                        thisCycle = cycle;
                        var duration = (entity == null || entity.duration == null) ? 3 : parseInt(entity.duration);//经期长度

                        while(d.getFullYear() <= thisYear && d.getMonth() <= thisMonth + 1){
                            ds.push(getDateStr(d));
                            d.setDate(d.getDate() + cycle);
                        }

                        // console.log(ds);
                        var plqStart = 19;//排卵期开始。下次经期的开始往前推14天是排卵日，排卵日前五天后四天共十天为排卵期
                        var plqLength = 10;//排卵期长度
                        var plr = 6;//排卵期开始后的第几天是排卵日
                        var d1 = new Date();//今天的日期
                        for(var m = 0 ; m < ds.length ; m++){
                            l = ds[m].split("-");
                            d.setFullYear(l[0]);
                            d.setMonth(l[1] - 1);
                            d.setDate(l[2]);

                            var cls = "";
                            //实际经期与预测经期
                            for (var i = 0; i < duration; i++) {
                                if (i == 0) {
                                    if (m == 0 && d <= d1) {
                                        cls = "jq-sj jq-sj-start";//经期开始
                                    } else {
                                        cls = "jq-yc jq-yc-start";//预测经期开始
                                    }
                                } else if (i + 1 == duration) {
                                    if (m == 0 && d <= d1) {
                                        cls = "jq-sj jq-sj-end";//经期结束
                                    } else {
                                        cls = "jq-yc jq-yc-end";//预测经期结束
                                    }
                                } else {
                                    if (m == 0 && d <= d1) {
                                        cls = "jq-sj";//经期中途
                                    } else {
                                        cls = "jq-yc jq-yc-center";//预测经期中途
                                    }
                                }

                                r[getDateStr(d)] = cls;
                                d.setDate(d.getDate() + 1);
                            }

                            if(m < ds.length - 1){
                                l = ds[m + 1].split("-");
                                d.setFullYear(l[0]);
                                d.setMonth(l[1] - 1);
                                d.setDate(l[2]);

                                d.setDate(d.getDate() - plqStart);
                                for (var i = 1; i <= plqLength; i++) {
                                    if (i == plr) {
                                        cls = "jq-plr";//排卵日
                                    } else {
                                        cls = "jq-plq";//排卵期
                                    }
                                    r[getDateStr(d)] = cls;
                                    d.setDate(d.getDate() + 1);
                                }
                            }
                        }
                    }catch(e){
                        console.log(e);
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