<%@ page import="eiis.context.Context" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    .monthlyPlanStatistics{
        border-top: 2px solid rgba(30,141,237,0.3);
    }
    .monthlyPlanStatistics .contentWrapper{
        padding: 0;
    }
    .monthlyPlanStatistics .contentArea{
        min-height: 179px;
        background-color: #e1e1e1;
    }
    .monthlyPlanStatistics .contentArea>div{
        height: 100%;
        position: absolute;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft{
        padding: 6px 6px 10px 6px;
        background-color: #ffffff;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft{
        left: 0;
        top: 0;
        width: 142px;
        z-index: 1;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>div{
        height: 33%;
        width: 100%;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend tr{
        vertical-align: bottom;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>li{
        height: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        float: left;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left{
        text-align: center;
        width: 50%;
        position: relative;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left>div{
        height: 50%;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left>.num{
        font-size: 15px;
        letter-spacing:1px;
        position: relative;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left>.num>div{
        position: absolute;
        height: 20px;
        width: 100%;
        bottom: -2px;
        left: 0;
        font-size: 12px;
        color: #166de4;
        background-color: #dff1fe;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left>.title{
        color: #747474;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.left>.title>span{
        font-size: 13px;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.right{
        width: 50%;
        position: relative;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.right>.charts{
        height: 100%;
        width: 100%;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft ul>.right>.title{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        color: #003766;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend>table{
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend>table tr{
        height: 50%;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend>table tr>td{
        width: 25%;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend>table tr>td>div{
        height: 12px;
        width: 12px;
        border-radius: 6px;
        display: inline-block;
        position: relative;
        top: 1px;
    }
    .monthlyPlanStatistics .contentArea>.areaLeft>.leftLegend>table tr>td>span{
        margin-left: 2px;
    }
    .monthlyPlanStatistics .contentArea>.areaRight{
        right: 0;
        top: 0;
        width: 100%;
        padding: 0 0 0 146px;
    }
    .monthlyPlanStatistics .contentArea>.areaRight>div{
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        padding: 6px 4px 10px 6px;
    }
    .monthlyPlanStatisticsSetting .panel-body .row{
        height: 34px;
        line-height: 34px;
    }
    .monthlyPlanStatisticsSetting .panel-body label{
        width: 100%;
    }
    .monthlyPlanStatisticsSetting .panel-body label>div{
        padding-left:  60px;
        position: absolute;
        top: 0;
    }
    .monthlyPlanStatisticsSetting .ratioDic{
        width: 100%;
        padding-right: 50px;
    }
    .monthlyPlanStatisticsSetting .ratioDic>div{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .monthlyPlanStatistics .homeTable .legend{
        display: inline-block;
        width: 8px;
        height:  8px;
        border-radius: 4px;
        margin-right: 4px;
    }
    .monthlyPlanStatistics .homeTable .tableBody td{
        padding:0;
    }
    .monthlyPlanStatistics .nodeProjectName{
        cursor: default;
    }
</style>
<div class="monthlyPlanStatistics homeModule">
    <div class="homeHead">
        <span class="title">月度计划统计</span>
        <i class="setting iconfont icon-shezhi1"></i>
    </div>
    <div class="homeBody">
        <div class="contentWrapper">
            <div class="contentArea">
                <div class="areaLeft">
                    <div class="leftItem" data-type="one">
                        <ul>
                            <li class="left">
                                <div class="num">
                                    <div>1 级</div>
                                </div>
                                <div class="title"><span class="num"></span> 总节点</div>
                            </li>
                            <li class="right">
                                <div class="charts"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="leftItem" data-type="two">
                        <ul>
                            <li class="left">
                                <div class="num">
                                    <div>2 级</div>
                                </div>
                                <div class="title"><span class="num"></span> 总节点</div>
                            </li>
                            <li class="right">
                                <div class="charts"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="leftItem" data-type="three">
                        <ul>
                            <li class="left">
                                <div class="num">
                                    <div>3 级</div>
                                </div>
                                <div class="title"><span class="num"></span> 总节点</div>
                            </li>
                            <li class="right">
                                <div class="charts"></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="areaRight">
                    <div class="tableContainer">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal monthlyPlanStatisticsSetting" tabindex="-1" aria-hidden="true" data-backdrop="static" data-width="300px">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
                aria-hidden="true">&times;</button>
        <h3 class="modal-title">
            <span style="font-weight: bold;">月度计划统计设置</span>
        </h3>
    </div>
    <div class="panel-body form-horizontal" style="padding: 10px 5px 4px 16px;overflow: initial;">
        <div class="row">
            <div class="col-xs-12 col-md-12">
                <label>
                    <span>查询周期:</span>
                    <div style="padding-right: 50px;width: 100%">
                        <select class="eiis-combobox form-control eiis-loaded cycleType">
                            <option value="1">按自然月统计</option>
                            <option value="2">按指定周期统计</option>
                        </select>
                    </div>
                </label>
            </div>
        </div>
        <div class="row startDay" style="display: none;">
            <div class="col-xs-12 col-md-12">
                <label>
                    <span>开始日期:</span>
                    <div style="padding-right: 50px;width: 100%">
                        <select class="eiis-combobox form-control eiis-loaded">
                            <%for(int i=2;i<=28;i++){%>
                            <option value="<%=i%>"><%="上月 "+i+" 日"%></option>
                            <%}%>
                        </select>
                    </div>
                </label>
            </div>
        </div>
        <div class="row" style="border-top: 1px solid #e2e2e2;margin-top: 10px;">
            <div class="col-xs-12 col-md-12" style="margin-top: 10px;">
                <label>
                    <span>警示率:</span>
                    <div class="ratioDic">
                        <div>
                            <input type="text" class="eiis-text alarmRatio"/>
                            <span style="position: absolute;right: 6px;top: 0;">%</span>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-info mySubmit-button">
            <i class="fa fa-check"></i> 保存
        </button>
        <button type="button" class="eiis-button btn-default"
                data-dismiss="modal">
            <i class="fa fa-times"></i> 取消
        </button>
    </div>
</div>
<script type="application/javascript">
    !function(){
        var option = {
            series: [
                {
                    type:'pie',
                    silent: true,
                    radius: ['30%', '95%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            padding : 20,
                            position: 'inside',
                            formatter: function(data){
                                if(data.data.value>0){
                                    return data.data.value;
                                }
                            }
                        }
                    }
                }
            ]
        };
        var charts={
            one : {},
            two : {},
            three : {}
        };
        var contentArea;
        var table;
        var monthlyPlanStatisticsSetting;
        var cycleType,startDayContainer,startDay,alarmRatio;
        $(function(){
            contentArea=$(".monthlyPlanStatistics .contentArea");
            monthlyPlanStatisticsSetting=$(".monthlyPlanStatisticsSetting");
            cycleType=monthlyPlanStatisticsSetting.find(".cycleType");
            startDayContainer=monthlyPlanStatisticsSetting.find(".startDay");
            startDay=startDayContainer.find("select");
            alarmRatio=monthlyPlanStatisticsSetting.find(".alarmRatio");
            require(["echarts3"],function(ECharts){
                contentArea.find(".leftItem").each(function(){
                    var self=$(this);
                    var chart=ECharts.init(self.find(".charts")[0]);
                    charts[self.data("type")]={
                        num : self.find("span.num"),
                        chart : chart
                    };
                    chart.setOption(option);
                });
                getData();
            });
            table=contentArea.find(".areaRight>.tableContainer").homeTable({
                headBGColor : '#dff1fe',
                columns : [
                    {field:'projectName',title:'项目名称',width:'25%',align:'left',overflow:true,color:'#000000',formatter: function (value, row){
                        return '<span class="nodeProjectName" title="'+value+'">'+value+'</span>';
                        }},
                    {field:'should',title:'总节点',width:'12%',align:'center',color:'#919191'},
                    {field:'gray',title:'<span class="legend" style="background-color: #919191;"></span><span style="color:#919191;">未完</span>',width:'12%',align:'center',color:'#919191'},
                    {field:'red',title:'<span class="legend" style="background-color: #ff6238;"></span><span style="color:#ff6238;">已完</span>',width:'12%',align:'center',color:'#919191'},
                    {field:'yellow',title:'<span class="legend" style="background-color: #ffff00;"></span><span style="color:#ffff00;">已完</span>',width:'12%',align:'center',color:'#919191'},
                    {field:'green',title:'<span class="legend" style="background-color: #2dcc72;"></span><span style="color:#2dcc72;">已完</span>',width:'12%',align:'center',color:'#919191'},
                    {field:'ratio',title:'达标率',width:'15%',align:'center',color:'#919191',formatter: function (value, row){
                            if(row.colorState){
                                return '<span style="color:#fd7958;">'+value+'</span>';
                            }else{
                                return value;
                            }
                        }}
                ]
            });
            $(window).resize(function(){
                charts.one.chart.resize();
                charts.two.chart.resize();
                charts.three.chart.resize();
            });

            alarmRatio.on("propertychange input",function(){
                var ratio=alarmRatio.val().trim();
                if(ratio.indexOf(".")===-1){
                    ratio=ratio.replace(/\D/g,"").trim();
                    if(ratio!==0){
                        ratio=Number(ratio);
                        if(ratio>100){
                            ratio=100;
                        }
                    }
                }
                alarmRatio.val(ratio);
            }).on("blur",function(){
                var ratio=alarmRatio.val().trim();
                var split=ratio.split(".");
                var s=split[0].trim().replace(/\D/g,"").trim();
                if(s===""){
                    ratio="";
                }else{
                    s=Number(s);
                    if(s>=100){
                        ratio=100;
                    }else{
                        var temp=Number(ratio);
                        if(isNaN(temp)){
                            ratio=s;
                        }else{
                            ratio=temp.toFixed(2);
                        }
                    }
                }
                alarmRatio.val(ratio);
            });
            cycleType.on("change",function(){
                if(cycleType.val()==="1"){
                    startDayContainer.hide();
                }else{
                    startDay.val("2");
                    startDayContainer.show();
                }
            });
            monthlyPlanStatisticsSetting.find(".mySubmit-button").on("click",function(){
                var settingData=monthlyPlanStatisticsSetting.data("settingData");
                settingData.type=cycleType.val();
                settingData.day=startDay.val();
                settingData.ratio=alarmRatio.val();
                $.ajax({
                    type : "post",
                    url : "/public/homepage/saveMonthlyPlan.do",
                    data : JSON.stringify(settingData),
                    dataType : "json",
                    contentType: 'application/json;charset=utf-8',
                    success : function(msg){
                        if(msg.errorCode===0){
                            getData();
                            monthlyPlanStatisticsSetting.modal("hide");
                        }else{
                            $.message("保存失败");
                        }
                    }
                });
            });
            var memberId="<%=Context.getCurrent().getId().toString()%>";
            $(".monthlyPlanStatistics").find(">.homeHead>.setting").on("click",function(){
                $.ajax({
                    type : "post",
                    url : "/public/homepage/getMonthlyPlan.do",
                    data : {memberId : memberId},
                    dataType : "json",
                    success : function(msg){
                        monthlyPlanStatisticsSetting.data("settingData",msg);
                        cycleType.val(msg.type);
                        alarmRatio.val(msg.ratio);
                        cycleType.change();
                        startDay.val(msg.day);
                        monthlyPlanStatisticsSetting.modal();
                    }
                });
            });
            var getData=function getData(){
                table.loading();
                $.ajax({
                    type : "post",
                    url : "/public/homepage/getProgress.do",
                    data : {memberId : memberId},
                    dataType : "json",
                    success : function(msg){
                        var pieData=msg.pieData;
                        delete msg.pieData;
                        table.setData(msg);
                        var data,chart;
                        for(var type in pieData){
                            data=pieData[type];
                            chart=charts[type];
                            chart.num.text(data.count);
                            chart.chart.setOption({series:[{
                                    data:[
                                        {value:data.gray,itemStyle:{normal:{color:'#c7c7c7'}}},
                                        {value:data.green,itemStyle:{normal:{color:'#2dcc72'}}},
                                        {value:data.yellow,itemStyle:{normal:{color:'#ffff00'}}},
                                        {value:data.red,itemStyle:{normal:{color:'#ff6238'}}}
                                    ]
                                }]});
                        }
                        table.loaded();
                    }
                });
            };
        });
    }();
</script>