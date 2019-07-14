/**
 * Created by 59823 on 2019/1/14.
 */
(function (itemId) {
    var color_0 = "#43b5fe", color_1 = "#2dcc72", color_2 = "#ffa338", color_3 = "#166de4", color_4 = "#ff6238";
    var _type = ["Meterial", "Lease", "Labour", "Machine", "Fee"];
    require(['echarts3'],function (eCharts) {
        //柱状图
        var dom_z = document.getElementById("indicatorProp_l");
        var myChart_z = eCharts.init(dom_z, {width: '98%'});
        var option_z = {
            color : [color_0, color_1, color_2, color_3, color_4],
            tooltip: {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                formatter: function (params) {
                    return params[0].data.name+"<br/>"
                        +(params[0]?params[0].seriesName+": "+params[0].value+"<br/>":"")
                        +(params[1]?params[1].seriesName+": "+params[1].value+"<br/>":"")
                        +(params[2]?params[2].seriesName+": "+params[2].value+"<br/>":"")
                        +(params[3]?params[3].seriesName+": "+params[3].value:"");
                }
                // formatter: "{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%<br />{a3}: {c3}%<br />{a4}: {c4}%"
            },
            legend: {
                data: ["计时用工","零星收方", "劳务奖罚", "机械费用"]
            },
            grid:{
                left: 20,
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
                name: '单位: 元/㎡'
            },
            series : [{
                name: '计时用工',
                type:'line',
                data: []
            },{
                name: '零星收方',
                type:'line',
                data: []
            },{
                name: '劳务奖罚',
                type:'line',
                data: []
            },{
                name: '机械费用',
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
            keyStr: "poto,indicator,prop"
        });
        function load_echarts(param) {
            option_z.xAxis.data = [];
            for(var v=0;v<4;v++) {
                option_z.series[v].data = [];
            }
            $.post("/public/homePageReport/getIndicatorProp.do",param,function (data) {
                if($.isEmptyObject(data)){
                    dom_z.innerHTML = "<span style='font-size: 30px;display: block;text-align: center;padding-top: 80px;'>无权限</span>";
                    return;
                }
                if(data.list_l) {
                    var item, projectNum, len = data.list_l.length;
                    var money, money1 = 0.00, money2 = 0.00, money3 = 0.00, money4 = 0.00;
                    for (v = 0; v < len; v++) {
                        item = data.list_l[v];
                        projectNum = item.num;
                        option_z.xAxis.data.push(changeCol(item.projectName, 5, 1));
                        for (var k = 0; k < 4; k++) {
                            money = projectNum === 0.00 ? 0.00 : (item["money" + (k + 1)] / projectNum);
                            option_z.series[k].data.push({
                                name: item.projectFullName+(item.init?"(规模计算中)":""),
                                value: money.toFixed(2)
                            });
                            if (k === 0) {
                                money1 += money;
                            } else if (k === 1) {
                                money2 += money;
                            } else if (k === 2) {
                                money3 += money;
                            } else {
                                money4 += money;
                            }
                        }
                    }
                    money1 /= len;
                    money2 /= len;
                    money3 /= len;
                    money4 /= len;
                    money = money1 + money2 + money3 + money4;
                    option_z.dataZoom.show = data.list_l.length > 10;
                    myChart_z.setOption(option_z, true);
                    if (money > 0) {
                        var self, ratio;
                        $(".indicatorProp .chi").each(function (i, o) {
                            if (i > 0) {
                                self = $(this);
                                ratio = (eval("money" + i) / money * 100).toFixed(2);
                                self.find(".name-right").html(eval("money" + i).toFixed(2));
                                self.find(".line-child").css({
                                    "width": ratio + "%",
                                    "background": eval("(color_" + (i - 1) + ")")
                                });
                            }
                        });
                    } else {
                        $(".indicatorProp .chi").each(function (i, o) {
                            if (i > 0) {
                                self = $(this);
                                self.find(".name-right").html(0);
                                self.find(".line-child").css({"width": 0});
                            }
                        });
                    }
                }
                else{
                    $(".indicatorProp .chi").each(function(i,o){
                        if(i>0){
                            self=$(this);
                            self.find(".name-right").html(0);
                            self.find(".line-child").css({"width": 0});
                        }
                    });
                }
                if(param.isFirst){
                    callback($.extend(true, param, {isFirst: false}), data.data_s, data.projectId);
                }
            },"json")
        }
        function callback(param, dataArray, def) {
            $(".indicatorProp .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    $(".modal.dialog_indicatorProp_project").modal();
                    loadProjectTree($("#indicatorProp_tree"), dataArray, def);
                    $(".modal.dialog_indicatorProp_project").modal("hide");
                    $(".modal.dialog_indicatorProp_project").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        $(".modal.dialog_indicatorProp_project").modal();
                        loadProjectTree($("#indicatorProp_tree"), dataArray, def);
                        $(".modal.dialog_indicatorProp_project").modal("hide");
                        $(".modal.dialog_indicatorProp_project").modal();
                    })
                }
            })
            $(".indicatorProp .btn-primary").on("click", function () {
                $(".modal.dialog_indicatorProp_project").modal("hide");
                var checkedNodes = project_tree.treegrid("getCheckedNodes");
                var projectIds = [],projectName=[];
                if(checkedNodes && checkedNodes.length>0){
                    var all_p = false;
                    for(var v=0;v<checkedNodes.length;v++){
                        if(checkedNodes[v].projectId=="0000"){
                            all_p = true;
                        }else{
                            projectIds.push(checkedNodes[v].projectId);
                            projectName.push(checkedNodes[v].projectName);
                        }
                    }
                    if(all_p)projectName = ["全部项目部"];
                }else{
                    projectIds = [""];
                    projectName = ["全部项目部"];
                }
                $(".indicatorProp .project_name").text(projectName.length==0?"":all_p?projectName.join(","):projectName[0]+"等"+projectName.length+"个项目部");
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
})(itemId_indicatorProp)