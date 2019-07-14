/**
 * Created by 59823 on 2019/1/14.
 */
(function (itemId) {
    var color_b = "#16dcd5", color_z = "#80e5e1", color_n = "#ff6238", color_red = "#ff6238";
    var top_data = [];
    require(['echarts3'],function (eCharts) {
        //圆饼图
        var dom_b = document.getElementById("lease_project_b");
        var myChart_b = eCharts.init(dom_b, {width: '100%'});
        var option_b = {
            tooltip: {},
            grid:{
                left: 0,
                right: 0,
                top: 0,
                bottom: 4,
                containLabel: true
            },
            series: {
                type: 'gauge',
                radius: '75%',
                title: {
                    offsetCenter: [0, '-20%'],
                    textStyle: {
                        fontSize: 12
                    }
                },
                detail: {
                    formatter:'{value}%',
                    offsetCenter: [0, '65%'],
                    textStyle: {
                        fontSize: 14,
                        color: "#1650e4",
                        fontWeight: 'bold'
                    }
                },
                pointer: {
                    width: 5
                },
                axisLabel: {
                    color: '#919191'
                },
                splitLine: {
                    length: 12
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[1, color_b]]
                    }
                },
                data: [{name: '总支付比'}]
            }
        };
        //柱状图
        var dom_z = document.getElementById("lease_project_z");
        var myChart_z = eCharts.init(dom_z, {width: '98%'});
        var option_z = {
            color : [color_z, color_n],
            tooltip: {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                formatter: function (params) {
                    return params[0].data.name+"<br/>"
                        +(params[0]?params[0].seriesName+": "+params[0].value+"元<br/>":"")
                        +(params[1]?params[1].seriesName+": "+params[1].value+"元<br/>":"")
                        +(params[2]?params[2].seriesName+": "+params[2].value+"元":"");
                }
                // formatter: "{b}<br />{a0}: {c0}元<br />{a1}: {c1}元<br />{a2}: {c2}元"
            },
            legend: {
                data: ["已对账","未对账", "已支付(含借支)"]
            },
            grid:{
                left: 10,
                right: 0,
                top: 35,
                bottom: 4,
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
                name: '单位: 元'
            },
            series : [{
                name: '已对账',
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                itemStyle: {
                    normal:{
                        color: function(params) {
                            return params.data?params.data.color:"";
                        }
                    }
                }
            },{
                name: '未对账',
                type:'bar',
                barWidth : 25,
                stack: 1,
                data: [],
                label: {
                    normal: {
                        show: true,
                        color: '#03236f',
                        fontWeight: 'bold',
                        position: 'top',
                        formatter: function (params) {
                            return top_data[params.dataIndex].zfb + (isNaN(top_data[params.dataIndex].zfb) ? "" : "%");
                        }
                    }
                },
                itemStyle:{
                    normal:{
                        // opacity: 0.6,
                        color: '#cccccc'
                    },
                    emphasis:{
                        color:'#cccccc'
                    }
                }
            },{
                name: '已支付(含借支)',
                type:'line',
                data: [],
                lineStyle: {
                    color: color_b
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
            type: "project",
            appKindStr: "Lease"
        });
        function load_echarts(param) {
            option_z.xAxis.data = [];
            option_z.series[0].data = [];
            option_z.series[1].data = [];
            option_z.series[2].data = [];
            top_data = [];
            $.post("/public/homePageReport/getMoneyByKindStr.do",param,function (data) {
                if($.isEmptyObject(data)){
                    dom_z.innerHTML = "<span style='font-size: 30px;display: block;text-align: center;padding-top: 80px;'>无权限</span>";
                    return;
                }
                if(data.data_b){
                    $(".lease_p_pom .mid-b").html((data.data_b.totle_check==0?0:data.data_b.totle_pay/data.data_b.totle_check*100).toFixed(0)+"%");
                    option_b.series.data[0].value = (data.data_b.totle_check==0?0:data.data_b.totle_pay/data.data_b.totle_check*100).toFixed(0);
                    myChart_b.setOption(option_b, true);
                }
                if(data.data_z){
                    for(var v=0;v<data.data_z.length;v++){
                        data.data_z[v].zfb = data.data_z[v].totalCheckMoney==0||data.data_z[v].totalPayMoney>data.data_z[v].totalCheckMoney?"?":(data.data_z[v].totalPayMoney/data.data_z[v].totalCheckMoney*100).toFixed(0);
                        if(data.data_z[v].zfb==0 && data.data_z[v].totalPayMoney!=0)data.data_z[v].zfb="<1%";
                        if(data.data_z[v].zfb==100 && data.data_z[v].totalPayMoney!=data.data_z[v].totalCheckMoney)data.data_z[v].zfb="约100%";
                        top_data.push(data.data_z[v]);

                        var data_name = changeCol(data.data_z[v].projectName, 5, 1);
                        option_z.xAxis.data.push(data_name);
                        option_z.series[0].data.push({name: data.data_z[v].projectFullName, value: Number(data.data_z[v].totalCheckMoney).toFixed(2), color: data.data_z[v].totalPayMoney>data.data_z[v].totalCheckMoney?color_red:color_b});
                        option_z.series[1].data.push({name: data.data_z[v].projectFullName, value: Number(data.data_z[v].noCheckMoney).toFixed(2)});
                        option_z.series[2].data.push({name: data.data_z[v].projectFullName, value: Number(data.data_z[v].totalPayMoney).toFixed(2)});
                    }
                    option_z.dataZoom.show = data.data_z.length>10;
                    myChart_z.setOption(option_z, true);
                }
                if(data.yearData){
                    $(".lease_p_pom .child-check").text(parseFloat(Number(data.yearData.caigou).toFixed(0)).toLocaleString());
                    $(".lease_p_pom .child-pay").text(parseFloat(Number(data.yearData.zhifu).toFixed(0)).toLocaleString());
                }
                if(param.isFirst){
                    callback($.extend(true, param, {isFirst: false}), data.data_s, data.projectId);
                    $(".lease_p .project_name").text(data.projectName);
                }
            },"json")
        }
        function callback(param, dataArray, def) {
            $(".lease_p .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    $(".modal.dialog_lease_company").modal();
                    loadProjectTree($("#lease_p_tree"), dataArray, def);
                    $(".modal.dialog_lease_company").modal("hide");
                    $(".modal.dialog_lease_company").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        $(".modal.dialog_lease_company").modal();
                        loadProjectTree($("#lease_p_tree"), dataArray, def);
                        $(".modal.dialog_lease_company").modal("hide");
                        $(".modal.dialog_lease_company").modal();
                    })
                }
            })
            $(".lease_p .btn-primary").on("click", function () {
                $(".modal.dialog_lease_company").modal("hide");
                var checkedNodes = project_tree.treegrid("getCheckedNodes");
                var projectIds = [], projectNames = [];
                if(checkedNodes && checkedNodes.length>0){
                    var all_p = false;
                    for(var v=0;v<checkedNodes.length;v++){
                        if(checkedNodes[v].projectId=="0000"){
                            all_p = true;
                        }else{
                            projectIds.push(checkedNodes[v].projectId);
                            projectNames.push(checkedNodes[v].projectName);
                        }
                    }
                    if(all_p)projectNames = ["全部项目部"];
                }else{
                    projectIds = [""];
                    projectNames = [""];
                }
                param.projectId = projectIds.join(",");
                $(".lease_p .project_name").text(projectNames.join(","));
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
                project_tree.treegrid("loadData", [{projectId: "0000", projectName: "全部项目部", children: dataArray}]);
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
    })
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
})(itemId_lease_p)