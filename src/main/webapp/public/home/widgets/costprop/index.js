/**
 * Created by 59823 on 2019/1/14.
 */
(function (itemId) {
    var color_Meterial = "#43b5fe", color_Lease = "#2dcc72", color_Labour = "#ffa338", color_Machine = "#166de4", color_Fee = "#ff6238";
    var _type = ["Meterial", "Lease", "Labour", "Machine", "Fee"];
    require(['echarts3'],function (eCharts) {
        //柱状图
        var dom_z = document.getElementById("cost_prop_l");
        var myChart_z = eCharts.init(dom_z, {width: '98%'});
        var option_z = {
            color : [color_Meterial, color_Lease, color_Labour, color_Machine, color_Fee],
            tooltip: {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                formatter: function (params) {
                    return params[0].data.name+"<br/>"
                        +(params[0]?params[0].seriesName+": "+params[0].value+"%<br/>":"")
                        +(params[1]?params[1].seriesName+": "+params[1].value+"%<br/>":"")
                        +(params[2]?params[2].seriesName+": "+params[2].value+"%<br/>":"")
                        +(params[3]?params[3].seriesName+": "+params[3].value+"%<br/>":"")
                        +(params[4]?params[4].seriesName+": "+params[4].value+"%":"");
                }
                // formatter: "{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%<br />{a3}: {c3}%<br />{a4}: {c4}%"
            },
            legend: {
                data: ["材料成本","租赁成本", "劳务成本", "机械成本", "间接费成本"]
            },
            grid:{
                left: 0,
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
                name: '单位: %'
            },
            series : [{
                name: '材料成本',
                type:'line',
                data: []
            },{
                name: '租赁成本',
                type:'line',
                data: []
            },{
                name: '劳务成本',
                type:'line',
                data: []
            },{
                name: '机械成本',
                type:'line',
                data: []
            },{
                name: '间接费成本',
                type:'line',
                data: []
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
            isFirst: true,
            itemId: itemId,
            keyStr: "poto,cost,prop"
        });
        function load_echarts(param) {
            option_z.xAxis.data = [];
            for(var v=0;v<5;v++) {
                option_z.series[v].data = [];
            }
            $.post("/public/homePageReport/getCostProp.do",param,function (data) {
                if($.isEmptyObject(data)){
                    dom_z.innerHTML = "<span style='font-size: 30px;display: block;text-align: center;padding-top: 80px;'>无权限</span>";
                    return;
                }
                if(data.list_l){
                    var billMoney_Meterial = 0,billMoney_Lease = 0,billMoney_Labour = 0,billMoney_Machine = 0,billMoney_Fee = 0,billMoney_all = 0;
                    for(var v=0;v<data.list_l.length;v++){
                        option_z.xAxis.data.push(changeCol(data.list_l[v].projectName, 5, 1));
                        var billMoney = Number(data.list_l[v]["billMoney"]);
                        billMoney_all += billMoney;
                        for(var j=0;j<_type.length;j++) {
                            var billMoney_one = data.list_l[v]["billMoney_"+_type[j]];
                            option_z.series[j].data.push({name: data.list_l[v].projectFullName, value: (billMoney==0?0:(billMoney_one?billMoney_one:0)/billMoney*100).toFixed(2)});
                            eval("billMoney_"+_type[j]+"+= Number(isNaN("+billMoney_one+")?0:"+billMoney_one+")");
                        }
                    }
                    option_z.dataZoom.show = data.list_l.length>10;
                    myChart_z.setOption(option_z, true);
                    if(billMoney_all>0){
                        for(var v=0;v<_type.length;v++) {
                            var bili = (eval("(billMoney_" + _type[v] + ")")/billMoney_all*100).toFixed(2);
                            $(".cost_prop .row-"+_type[v]).find(".name-right").html(bili+"%");
                            $(".cost_prop .row-"+_type[v]).find(".line-child").css({"width": bili+"%", "background": eval("(color_" + _type[v] + ")")});
                        }
                    }
                }
                if(param.isFirst){
                    callback($.extend(true, param, {isFirst: false}), data.data_s, data.projectId);
                }
            },"json")
        }
        function callback(param, dataArray, def) {
            $(".cost_prop .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    $(".modal.dialog_cost_prop_project").modal();
                    loadProjectTree($("#cost_prop_tree"), dataArray, def);
                    $(".modal.dialog_cost_prop_project").modal("hide");
                    $(".modal.dialog_cost_prop_project").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        $(".modal.dialog_cost_prop_project").modal();
                        loadProjectTree($("#cost_prop_tree"), dataArray, def);
                        $(".modal.dialog_cost_prop_project").modal("hide");
                        $(".modal.dialog_cost_prop_project").modal();
                    })
                }
            })
            $(".cost_prop .btn-primary").on("click", function () {
                $(".modal.dialog_cost_prop_project").modal("hide");
                var checkedNodes = project_tree.treegrid("getCheckedNodes");
                var projectIds = [];
                if(checkedNodes && checkedNodes.length>0){
                    for(var v=0;v<checkedNodes.length;v++){
                        if(checkedNodes[v].projectId=="0000"){

                        }else{
                            projectIds.push(checkedNodes[v].projectId);
                        }
                    }
                }else{
                    projectIds = [""];
                }
                param.projectId = projectIds.join(",");
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
    function hh(s,n) {
        var r = "";
        for(var v=1;v<parseInt(s.length/n)+2;v++){
            r += s.substr((v-1)*n, n)+"\n";
        }
        return r;
    }
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
})(itemId_cost_prop)