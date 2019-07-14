(function (itemId) {
    $.ajax({
        type : "post",
        url : "/public/homePage/isUsedMb.do",
        dataType : "json",
        success : function(msg){
            if(!msg) {
                $(".total_capital_pom .right").hide();
                $(".total_capital_pom .left").removeClass("col-md-10").addClass("col-md-12");
            }
        }});
    var color_pro = "#03adfa";
    var color_pay = "#ffa338";
    var color_in = "#d8fee9";
    var color_out = "#cccccc";
    var color_red = "#ff0000";
    var top_data = [];
    require(['echarts3'],function (eCharts) {
        //柱状图
        var dom_z = document.getElementById("total_capital_l");
        var myChart_z = eCharts.init(dom_z, {width: '98%'});
        var option_z = {
            color : [color_out,color_pro, color_in, color_pay],
            tooltip: {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                },
                formatter: function (params) {
                    var text = params[0].data.name+"<br/>";
                    if(params[0]) text+= "<span style='color:"+params[0].color+"'>"+params[0].seriesName+"</span>"+": "+parseFloat(params[0].value.toFixed(2)).toLocaleString()+" 元<br/>";
                    if(params[2]) text+= "<span style='color: "+params[2].color+"'>"+params[2].seriesName+"</span>"+": "+parseFloat(params[2].value.toFixed(2)).toLocaleString()+" 元<br/>";
                    if(params[1]) text+= "<span style='color:"+params[1].color+"'>"+params[1].seriesName+"</span>"+": "+parseFloat(params[1].value.toFixed(2)).toLocaleString()+" 元<br/>";
                    if(params[3]) text+= "<span style='color: "+params[3].color+"'>"+params[3].seriesName+"</span>"+": "+parseFloat(params[3].value.toFixed(2)).toLocaleString()+" 元";

                    return text;
                }
            },
            grid:{
                left: 0,
                right: 0,
                top: 35,
                bottom: 4,
                containLabel: true
            },
            legend: {
                selectedMode:false,
                data: ["产值","收入","成本","支出(含借支)"]
            },
            xAxis: [{
                type : 'category',
                position:'bottom',
                axisLabel: {
                    rotate: 30
                },
                data: []
            },{
                type : 'category',
                position:'bottom',
                axisLabel: {
                    rotate: 30
                },
                data: []
            }],
            yAxis: [{
                type : 'value'
            }],
            series : [
               {
                    name: '产值',
                    type:'bar',
                    barWidth : 25,
                    xAxisIndex:0,
                    data: []
                },
                {
                    name: '收入',
                    type:'bar',
                    barWidth : 25,
                    xAxisIndex:1,
                    data: [],
                    label: {
                        normal: {
                            show: true,
                            color: '#03236f',
                            fontWeight: 'bold',
                            position: 'top',
                            formatter: function (params) {
                                return top_data[params.dataIndex].hkl;
                            }
                        }
                    }
                },
                {
                    name: '成本',
                    type:'bar',
                    barWidth : 25,
                    xAxisIndex:0,
                    data: []
                }, {
                    name: '支出(含借支)',
                    type:'bar',
                    barWidth : 25,
                    xAxisIndex:1,
                    data: [],
                    itemStyle: {
                        normal:{
                            color: function(params) {
                                return params.data.color;
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#03236f',
                            fontWeight: 'bold',
                            position: 'top',
                            formatter: function (params) {
                                return top_data[params.dataIndex].zfl;
                            }
                        }
                    }
                }
            ],
            dataZoom : {
                type : "slider",
                startValue : 0,
                endValue : 9,
                minValueSpan : 9,
                maxValueSpan : 9,
                bottom : 14,
                height: 10,
                xAxisIndex:[0,1]
            }
        };
        load_echarts({
            isFirst: true,
            itemId:itemId,
            keyStr: "total,cap,money"
        });
        function load_echarts(param) {
            option_z.xAxis[0].data = [];
            option_z.xAxis[1].data = [];
            for(var v=0;v<4;v++) {
                option_z.series[v].data = [];
            }
            $.post("/public/homePage/getMoney.do",param,function (res) {
                if($.isEmptyObject(res)){
                    dom_z.innerHTML = "<span style='font-size: 30px;display: block;text-align: center;padding-top: 80px;'>无权限</span>";
                    return;
                }
                var num;
                var projectName;
                var shortName;
                top_data = [];
                var topData = {};

                var total=res.projectNames.length;
                for(var i=0;i<total;i++){
                    projectName=res.projectNames[i][0];
                    shortName=res.projectNames[i][1];
                    option_z.xAxis[0].data.push(changeCol(shortName, 5, 1));
                    option_z.xAxis[1].data.push("");

                    num=res.outputValue[i];
                    option_z.series[0].data.push({name:projectName,value:num,color:color_out});

                    num=res.in[i];
                    option_z.series[1].data.push({name:projectName,value:num,color:color_pro});

                    num=res.production[i];
                    option_z.series[2].data.push({name:projectName,value:num,color:color_in});

                    num=res.pay[i];
                    option_z.series[3].data.push({name:projectName,value:num,color:res.pay[i]>res.production[i]?color_red:color_pay});

                    topData = {};
                    if(parseFloat(res.outputValue[i])==0) topData.hkl = "?";
                    else{
                        topData.hkl = parseFloat(res.in[i])/res.outputValue[i]*100;
                        if(topData.hkl<=0 || topData.hkl>100){
                            topData.hkl = "?";
                        }else if(topData.hkl>0 && topData.hkl<1){
                            topData.hkl = "约1%";
                        }else{
                            topData.hkl =  topData.hkl.toFixed(0);
                            if(topData.hkl=="100") topData.hkl="约100%";
                            else topData.hkl = topData.hkl+"%";
                        }
                    }

                    if(parseFloat(res.production[i])==0) topData.zfl = "?";
                    else{
                        topData.zfl = parseFloat(res.pay[i])/res.production[i]*100;
                        if(topData.zfl<=0 || topData.zfl>100){
                            topData.zfl = "?";
                        }else if(topData.zfl>0 && topData.zfl<1){
                            topData.zfl = "约1%";
                        }else{
                            topData.zfl =  topData.zfl.toFixed(0);
                            if(topData.zfl=="100") topData.zfl="约100%";
                            else topData.zfl = topData.zfl+"%";
                        }
                    }
                    top_data.push(topData);
                }
                option_z.dataZoom.show = total>10;
                myChart_z.setOption(option_z,true);

                if(param.isFirst){
                    callback($.extend(true, param, {isFirst: false}), res.data_s, res.projectId);
                }

                if(res.propList)dynaProp(res.propList);
            },"json")
        }

        function callback(param, dataArray, def) {
            $(".total_capital .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    $(".modal.dialog_total_capital_project").modal();
                    loadProjectTree($("#total_capital_tree"), dataArray, def);
                    $(".modal.dialog_total_capital_project").modal("hide");
                    $(".modal.dialog_total_capital_project").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        $(".modal.dialog_total_capital_project").modal();
                        loadProjectTree($("#total_capital_tree"), dataArray, def);
                        $(".modal.dialog_total_capital_project").modal("hide");
                        $(".modal.dialog_total_capital_project").modal();
                    })
                }
            })
            $(".total_capital .btn-primary").on("click", function () {
                $(".modal.dialog_total_capital_project").modal("hide");
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

    function dynaProp(prop) {
        var thisId = $(".total_capital_pom .chi_context");
        $(thisId).empty();
        var color = "",_right="";
        var _div = '<div class="chi">' +
            '<span class="row-name">' +
            '<span class="name-left"></span>' +
            '<span class="name-right"></span>' +
            '</span>' +
            '<span class="row-line">' +
            '<span class="line-child"></span>' +
            '</span>' +
            '</div>';
        var screenWidth = window.screen.width;
        if(prop.length==0){$(thisId).append("<div class='p_1'>权限范围内目标成本为0</div>")
        }else{
            for(var i=0;i<prop.length;i++){
                var div = $($(_div).clone());
                var prop_b = parseFloat(prop[i].prop);
                if(prop_b>=100){
                    color = "#ff6238";
                }else{
                    color = "#03adfa";
                }
                div.find(".name-left").text(screenWidth<=1366?changeCol(prop[i].projectName,4,1):changeCol(prop[i].projectName,10,1));
                div.find(".name-left").attr("title",prop[i].projectName);
                _right = prop_b>0?(prop_b+"%"):"目标成本0";
                div.find(".name-right").text(_right);
                if(prop_b>0){
                    var width = "";
                    if(prop_b>=100) width = "100%";
                    else{
                        width = prop_b+"%";
                    }
                    div.find(".line-child").css({"width": width, "background": color});
                }
                thisId.append(div);
            }
            if(prop.length>5) thisId.css("overflow-y","scroll");
        }
    }
})(itemId_total_capital)