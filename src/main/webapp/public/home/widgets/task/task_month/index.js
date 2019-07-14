/**
 * Created by 59823 on 2019/3/4.
 */
(function (itemId) {
    var top_data = [];
    var levelJSON = {}, numberJSON = {
        num_level_1: 0, num_level_2: 0, num_level_3: 0,
        num_finish_cq: 0, num_finish_db: 0,
        num_nofinish_wkg: 0, num_nofinish_ykg: 0
    };
    var maxDate = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate(),
        minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
    require(['echarts3'],function (eCharts) {
        //柱状图
        var dom_z = document.getElementById("task_month_z");
        var myChart_z = eCharts.init(dom_z, {width: '98%'});
        var option_z = {
            tooltip: {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                formatter: function (params) {
                    var shiji = "未开始";
                    if(params[0].data.isStartFlow){
                        if(params[0].data.flowType==2)
                            shiji = new Date(params[0].data.startDate).Format("yyyy-MM-dd")+"至"+new Date(params[0].data.endDate).Format("yyyy-MM-dd")+"("+params[0].data.duration+"天)";
                        else
                            shiji = new Date(params[0].data.startDate).Format("yyyy-MM-dd")+"至今";
                    }
                    return params[0].data.projectName+"<br/>"
                        +params[0].data.name+"<br/>"
                        +"基准工期:"+new Date(params[0].data.baseLineStartDate).Format("yyyy-MM-dd")+"至"+new Date(params[0].data.baseLineEndDate).Format("yyyy-MM-dd")+"("+params[0].data.baseLineDuration+"天)<br/>"
                        +"实际工期:"+shiji;
                }
            },
            legend: {
                show: false,
                // selectedMode: false,
                data: ["基准","实际"]
            },
            grid:{
                left: 0,
                right: 0,
                top: 35,
                bottom: 0,
                containLabel: true
            },
            xAxis : {
                type : 'category',
                axisLabel: {
                    rotate: 30
                },
                data: []
            },
            yAxis : {
                type : 'value',
                max: maxDate,
                min: -1*minDate,
                // name: new Date().Format("yyyy-MM"),
                axisLabel: {
                    formatter: function (param) {
                        var beforeStr = "";
                        if(param>0)beforeStr = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).Format("MM-");
                        else if(minDate+param!=0 && param<0)beforeStr = new Date(new Date().getFullYear(), new Date().getMonth(), 0).Format("MM-");
                        return param==0?(new Date().getMonth()+1+"月初"):
                            (minDate+param==0?((new Date().getMonth()==0?12:new Date().getMonth())+"月初"):
                                (beforeStr+(param>0?addZero(param):addZero(minDate+param))));
                    }
                }
            },
            series : [{
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                itemStyle:{
                    normal:{
                        opacity : 0
                    }
                },
                markLine: {
                    label: {
                        normal: {
                            position: "middle",
                            formatter: function () {
                                return "今日"+new Date().Format("MM-dd");
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#FF0033',
                            type : "solid",
                            width : 1
                        }
                    },
                    symbol: 'none',
                    data: [{
                        yAxis: new Date().getDate()
                    }]
                }
            },{
                name: '基准',
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                itemStyle:{
                    normal:{
                        color:'#cccccc'
                    },
                    emphasis:{
                        color:'#cccccc'
                    }
                }
            },{
                name: '基准',
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                itemStyle:{
                    normal:{
                        opacity : 0
                    }
                }
            },{
                name: '基准',
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                itemStyle:{
                    normal:{
                        color:'#cccccc'
                    },
                    emphasis:{
                        color:'#cccccc'
                    }
                }
            }
            ,{
                type:'bar',
                barWidth : 25,
                stack: 2,
                data: [],
                itemStyle:{
                    normal:{
                        opacity : 0
                    }
                }
            },{
                name: '实际',
                type:'bar',
                barWidth : 25,
                stack: 2,
                data: [],
                itemStyle:{
                    normal:{
                        color: function(params) {
                            return !params.data||params.data.value==0?"":getLevelColor2(params.data.compane, params.data.taskLevel);
                        }
                    }
                }
            },{
                type:'bar',
                barWidth : 25,
                stack: 2,
                data: [],
                itemStyle:{
                    normal:{
                        opacity : 0
                    }
                }
            },{
                name: '实际',
                type:'bar',
                barWidth : 25,
                stack: 2,
                data: [],
                itemStyle:{
                    normal:{
                        color: function(params) {
                            return !params.data||params.data.value==0?"":getLevelColor2(params.data.compane, params.data.taskLevel);
                        }
                    }
                }
            }],
            dataZoom : {
                type : "slider",
                startValue : 0,
                endValue : 9,
                minValueSpan : 9,
                maxValueSpan : 9,
                bottom : 14,
                height: 10
            }
        };
        load_echarts({
            itemId: itemId,
            isFirst: true,
            keyStr_project: "poto,task,month,project",
            keyStr_level: "poto,task,month,level"
        });
        function load_echarts(param) {
            option_z.xAxis.data = [];
            for(var v=0;v<8;v++){
                option_z.series[v].data = [];
            }
            for(var key in numberJSON){
                numberJSON[key] = 0;
            }
            top_data = [];
            $.post("/public/homePageReport/getTaskMonth.do",param,function (data) {
                if($.isEmptyObject(data)){
                    dom_z.innerHTML = "<span style='font-size: 30px;display: block;text-align: center;padding-top: 80px;'>无权限</span>";
                    return;
                }
                if(data.nodeList){
                    for(var v=0;v<data.nodeList.length;v++){
                        levelJSON[data.nodeList[v].nodeId] = {
                            startNum: data.nodeList[v].startNum,
                            endNum: data.nodeList[v].endNum
                        };
                    }
                }
                if(data.list){
                    for(var v=0;v<data.list.length;v++){
                        var nameAllArray = data.list[v].taskNameAll.split("/");
                        option_z.xAxis.data.push(changeCol(nameAllArray.length>0?nameAllArray[0]:"",5,1)+"\n"+changeCol(data.list[v].taskName, 5, 1));
                        option_z.series[0].data.push($.extend(true, data.list[v], {name: data.list[v].taskNameAll,value: getMonthDate(true, true, true, data.list[v].baseLineStartDate)}));
                        option_z.series[1].data.push({name: data.list[v].taskNameAll, value: getMonthDate(true, true, true, data.list[v].baseLineStartDate, data.list[v].baseLineEndDate)});
                        option_z.series[2].data.push({name: data.list[v].taskNameAll, value: getMonthDate(true, true, false, data.list[v].baseLineStartDate)});
                        option_z.series[3].data.push({name: data.list[v].taskNameAll, value: getMonthDate(true, true, false, data.list[v].baseLineStartDate, data.list[v].baseLineEndDate)});
                        option_z.series[4].data.push({name: data.list[v].taskNameAll, value: getMonthDate(false, data.list[v].isStartFlow, true, data.list[v].startDate)});
                        option_z.series[5].data.push({name: data.list[v].taskNameAll, value: getMonthDate(false, data.list[v].isStartFlow, true, data.list[v].startDate, data.list[v].endDate), compane: data.list[v].compane, taskLevel: data.list[v].taskLevel});
                        option_z.series[6].data.push({name: data.list[v].taskNameAll, value: getMonthDate(false, data.list[v].isStartFlow, false, data.list[v].startDate)});
                        option_z.series[7].data.push({name: data.list[v].taskNameAll, value: getMonthDate(false, data.list[v].isStartFlow, false, data.list[v].startDate, data.list[v].endDate), compane: data.list[v].compane, taskLevel: data.list[v].taskLevel});
                        //数字统计
                        setNumJSON(data.list[v]);
                    }
                    option_z.dataZoom.show = data.list.length>10;
                    myChart_z.setOption(option_z, true);
                    setNumHTML();
                }
                if(param.isFirst){
                    callback($.extend(true, param, {isFirst: false}), data.data_s, data.projectId, data.level);
                    var projectNameArray = data.projectName?$.trim(data.projectName).split(" "):[];
                    $(".task_month .project_name").html(projectNameArray.length==0?"全部项目部":projectNameArray[0]+(projectNameArray.length>1?"等"+projectNameArray.length+"个项目部":""));
                }
            },"json")
        }
        function callback(param, dataArray, defProjectId, defLevel) {
            $(".task_month .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    $(".modal.dialog_task_month").modal();
                    loadProjectTree($("#task_month_project_tree"), dataArray, defProjectId);
                    loadLevelTree($("#task_month_level_tree"), defLevel);
                    $(".modal.dialog_task_month").modal("hide");
                    $(".modal.dialog_task_month").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        $(".modal.dialog_task_month").modal();
                        loadProjectTree($("#task_month_project_tree"), dataArray, defProjectId);
                        loadLevelTree($("#task_month_level_tree"), defLevel);
                        $(".modal.dialog_task_month").modal("hide");
                        $(".modal.dialog_task_month").modal();
                    })
                }
            })
            $(".task_month .btn-primary").on("click", function () {
                $(".modal.dialog_task_month").modal("hide");
                var checkedNodes = project_tree.treegrid("getCheckedNodes");
                var projectIds = [], projectCode = [], projectNamesJSON = {};
                if(checkedNodes && checkedNodes.length>0){
                    for(var v=0;v<checkedNodes.length;v++){
                        if(checkedNodes[v].projectId=="0000"){

                        }else{
                            projectIds.push(checkedNodes[v].projectId);
                            projectCode.push(checkedNodes[v].projectCode);
                            projectNamesJSON[checkedNodes[v].projectCode] = checkedNodes[v].projectName;
                        }
                    }
                }else{
                    projectIds = [""];
                }
                param.projectId = projectIds.join(",");
                param.level = level_tree.combotree("getValues").join(",");
                projectCode.sort();
                $(".task_month .project_name").html(projectCode.length==0?"":projectNamesJSON[projectCode[0]]+(projectCode.length>1?"等"+projectCode.length+"个项目部":""));
                load_echarts(param);
            })
        }
        var project_tree;
        function loadProjectTree(node, dataArray, def) {
            if(!project_tree) {
                project_tree = node.treegrid({
                    idField: 'projectId',
                    treeField: 'projectName',
                    width: '100%',
                    height: '320px',
                    striped: true,
                    singleSelect: true,
                    checkOnSelect: true,
                    checkbox: true,
                    columns: [
                        [{
                            field: "projectName",
                            title: "项目部",
                            width: '100%',
                            align: 'left'
                        }]
                    ],
                    onClickRow: function (row) {
                        project_tree.treegrid("checkNode", row.projectId);
                    }
                })
                project_tree.treegrid("loadData", [{projectId: "0000", projectName: "项目部名称", children: dataArray}]);
                if(def) {
                    var defIdArray = def.split(",");
                    for(var v=0;v<defIdArray.length;v++) {
                        project_tree.treegrid("checkNode", defIdArray[v]);
                    }
                }else{
                    for(var v=0;v<dataArray.length;v++) {
                        project_tree.treegrid("checkNode", dataArray[v].projectId);
                    }
                }
            }
        }
        var level_tree;
        function loadLevelTree(node, def) {
            if(!level_tree) {
                level_tree = node.combotree({
                    valueField:'id',
                    textField:'text',
                    width: '100%',
                    panelHeight: 85,
                    multiple: true,
                    data: [{
                        "id":1,
                        "text":"1级节点"
                    },{
                        "id":2,
                        "text":"2级节点"
                    },{
                        "id":3,
                        "text":"3级节点"
                    }]
                })
                if(def) level_tree.combotree('setValues', def.split(","));
                else level_tree.combotree('setValues', [1,2,3]);
            }
        }
    })
    //数字统计
    function setNumJSON(data) {
        numberJSON["num_level_"+data.taskLevel]++;
        if(data.flowType==2){
            if(getLevelColor2(data.compane, data.taskLevel)=="green")numberJSON.num_finish_db++;
            else numberJSON.num_finish_cq++;
        }else{
            if(data.isStartFlow)numberJSON.num_nofinish_ykg++;
            else numberJSON.num_nofinish_wkg++;
        }
    }
    function setNumHTML() {
        for(var key in numberJSON){
            $(".task_month_pom .right_num").find("span[name='"+key+"']").html(numberJSON[key]);
        }
        $(".task_month_pom .right_num").find("span[name='num_finish']").html(numberJSON.num_finish_cq+numberJSON.num_finish_db);
        $(".task_month_pom .right_num").find("span[name='num_nofinish']").html(numberJSON.num_nofinish_ykg+numberJSON.num_nofinish_wkg);
        $(".task_month_pom .right_num").find("span[name='num_level']").html(numberJSON.num_level_1+numberJSON.num_level_2+numberJSON.num_level_3);
    }
    //字符串换行 num每行个数 r_num行数
    function changeCol(str, num, r_num) {
        var res = "";
        for(var v=0;v<str.length/num;v++){
            res += str.substr(v*num, num);
            if(r_num>1 && v+1<str.length/num)res += "\n";
            if(r_num && v+1==r_num){
                if(res.length-(r_num-1)*1<str.length) res += "...";
                break;
            }
        }
        return res;
    }
    var thisDateStr = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).Format("yyyy-MM"),
        upperDateStr = new Date(new Date().getFullYear(), new Date().getMonth(), 0).Format("yyyy-MM");
    //获取时间段内在当月所占天数(是否基线，是否开始，是否线上，开始时间，结束时间)
    function getMonthDate(isPlan, isStartFlow, isUp, sTime, eTime) {
        var res = 0;
        //透明填充
        if(sTime && !eTime){
            if(isUp){
                if(new Date(sTime).Format("yyyy-MM")<thisDateStr)
                    res = 0;
                else if(new Date(sTime).Format("yyyy-MM")==thisDateStr)
                    res = new Date(sTime).getDate()-1;
                else
                    res = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
            }else {
                if(new Date(eTime).Format("yyyy-MM")==upperDateStr)
                    res = -1*(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()-new Date(eTime).getDate());
                else
                    res = 0;
            }
        }
        //施工天数
        else if(sTime && eTime) {
            if(isUp) {
                //    上月    |     本月    |    下月
                //======O=====|=============|==============
                if (new Date(eTime).Format("yyyy-MM") < thisDateStr) {
                    res = 0;
                }
                //============|======O======|==============
                else if (new Date(eTime).Format("yyyy-MM") == thisDateStr) {
                    if (!isPlan && !isStartFlow) {
                        res = 0;
                    } else {
                        if (new Date(sTime).Format("yyyy-MM") == thisDateStr) {
                            res = (!isPlan && new Date(eTime) > new Date() ? new Date().getDate() + 1 : new Date(eTime).getDate() + 1) - new Date(sTime).getDate();
                            if (res < 0) res = 0;
                        } else
                            res = !isPlan && new Date(eTime) > new Date() ? new Date().getDate() : new Date(eTime).getDate();
                    }
                }
                //==========|============|=======O======
                else {
                    if (!isPlan && !isStartFlow) {
                        res = 0;
                    } else {
                        if (new Date(sTime).Format("yyyy-MM") < thisDateStr) {
                            res = isPlan ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() : new Date().getDate();
                        } else if (new Date(sTime).Format("yyyy-MM") == thisDateStr) {
                            res = (isPlan ? (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() + 1) : new Date().getDate() + 1) - new Date(sTime).getDate();
                            if (res < 0) res = 0;
                        } else
                            res = 0;
                    }
                }
            }else{
                //    上上月    |     上月    |    本月
                //=======O======|=============|==============
                if (new Date(eTime).Format("yyyy-MM") < upperDateStr) {
                    res = 0;
                }
                //==============|======O======|==============
                else if (new Date(eTime).Format("yyyy-MM") == upperDateStr) {
                    if(!isPlan && !isStartFlow)
                        res = 0;
                    else if(new Date(sTime).Format("yyyy-MM") == upperDateStr)
                        res = -1*(new Date(eTime).getDate()-new Date(sTime).getDate());
                    else
                        res = -1*new Date(eTime).getDate();
                }
                //=============|=============|=======O======
                else {
                    if((!isPlan && !isStartFlow) || new Date(sTime).Format("yyyy-MM") == thisDateStr)
                        res = 0;
                    else if(new Date(sTime).Format("yyyy-MM") == upperDateStr)
                        res = -1*(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()-new Date(sTime).getDate())-1;
                    else
                        res = -1*new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
                }
            }
        }
        return res;
    }

    function getLevelColor2(compane, taskLevel) {
        if(typeof compane=="undefined" || compane<=levelJSON[taskLevel].startNum)return "green";
        else if(compane>levelJSON[taskLevel].endNum)return "red";
        else  return "yellow";
    }

    function addZero(num) {
        return num!=0&&num<10?"0"+num:num;
    }
})(itemId_task_month)