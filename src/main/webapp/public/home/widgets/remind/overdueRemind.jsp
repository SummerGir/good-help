<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    .trafficOverdueStatistics{
        border-top: 2px solid rgba(30,141,237,0.3);
    }
    .trafficOverdueStatistics .contentArea{
        min-height: 130px;
    }
    .trafficOverdueStatistics .contentArea>div{
        height: 100%;
        position: absolute;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft{
        left: 0;
        top: 0;
        width: 30%;
        border-right: 4px solid #e2e2e2;
        padding: 10px;
        z-index: 1;
        cursor: default;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft>.top{
        height: 80%;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft>.bottom{
        height: 20%;
        text-align: center;
        font-size: 14px;
        color: #1093ed;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft>div{
        height: 100%;
        width: 100%;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft ul{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft ul>li{
        height: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        float: left;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft ul>.right{
        width: 100%;
        position: relative;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft ul>.right>.charts{
        height: 100%;
        width: 100%;
    }
    .trafficOverdueStatistics .contentArea>.areaLeft ul>.right>.title{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -19px;
        margin-top: -10px;
        font-weight: 900;
        color: #003766;
        cursor: default;
    }
    .trafficOverdueStatistics .contentArea>.areaRight{
        right: 0;
        top: 0;
        width: 70%;
        text-align: center;
        padding: 7% 10px;
        cursor: default;
    }
    .trafficOverdueStatistics .contentArea>.areaRight>table{
        height: 70%;
        width: 96%;
        margin: auto;
    }
    .trafficOverdueStatistics .contentArea>.areaRight>table span{
        font-size: 22px;
        font-weight: 900;
    }
    .trafficOverdueStatistics .contentArea>.areaRight>table a{
        border-radius: inherit;
        background-color: #F3F3F3;
        border: 0;
        padding: 2px 0;
        width: 70px;
        height: 24px;
        margin-left: 4%;
    }
    .trafficOverdueStatistics .contentArea>.areaRight>div{
        width: 100%;
        height: 50%;
        cursor: default;
    }
    .trafficOverdueStatisticsSetting .panel-body .row{
        height: 34px;
        line-height: 34px;
    }
    .trafficOverdueStatisticsSetting .panel-body label{
        width: 100%;
    }
    .trafficOverdueStatisticsSetting .panel-body label>div{
        padding-left:  60px;
        position: absolute;
        top: 0;
    }

    .trafficOverdueStatistics .homeHead{border-bottom: 1px solid #e2e2e2;cursor: default;}
    .trafficOverdueStatistics .homeBody{padding-top: 29px;}
    .trafficOverdueStatistics .contentWrapper{padding: 0!important;}
</style>
<div class="trafficOverdueStatistics homeModule">
    <div class="homeHead">
        <span class="title">流程超期统计</span>
    </div>
    <div class="homeBody">
        <div class="contentWrapper">
            <div class="contentArea">
                <div class="areaLeft">
                    <div class="top">
                        <ul>
                            <li class="right">
                                <div class="charts"></div>
                                <div class="title">12级</div>
                            </li>
                        </ul>
                    </div>
                    <div class="bottom">
                        月度超期率
                    </div>
                </div>
                <div class="areaRight">
                    <table>
                        <tr>
                            <td><span style="color: #2ac68d" id="officeCount">0</span></td>
                            <td><span style="color: #1093ed" id="costCount">0</span></td>
                            <td><span style="color: #ff6238" id="progresCount">0</span></td>
                            <td><span style="color: #fbac04" id="capitalCount">0</span></td>
                        </tr>
                        <tr>
                            <td><a class="btn btn-default" href="javascript:void(0);" onclick="jump_flowExamine('work')" role="button">办公</a></td>
                            <td><a class="btn btn-default" href="javascript:void(0);" onclick="jump_flowExamine('cost')" role="button">成本</a></td>
                            <td><a class="btn btn-default" href="javascript:void(0);" onclick="jump_flowExamine('progress')" role="button">进度</a></td>
                            <td><a class="btn btn-default" href="javascript:void(0);" onclick="jump_flowExamine('money')" role="button">资金</a></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="application/javascript">
    !function(){
        var option = {
            series: [
                {
                    type:'pie',
                    silent: true,
                    radius: ['50%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    }
                }
            ]
        };
        var chart;
        var trafficOverdueStatisticsSetting;
        var cycleType,startDayContainer,startDay,alarmRatio;
        $(function(){
            trafficOverdueStatisticsSetting=$(".trafficOverdueStatisticsSetting");
            cycleType=trafficOverdueStatisticsSetting.find(".cycleType");
            startDayContainer=trafficOverdueStatisticsSetting.find(".startDay");
            startDay=startDayContainer.find("select");
            alarmRatio=trafficOverdueStatisticsSetting.find(".alarmRatio");

            require(['echarts3'],function (eCharts) {
                chart=eCharts.init($(".trafficOverdueStatistics .contentArea .charts")[0]);
                chart.setOption(option);
                getData();
            });
            //根据窗口同步调整大小
            $(window).resize(function(){
                chart.resize();
            });


            var getData=function getData(){
                $.ajax({
                    type : "post",
                    url : "/app/process/getProcess.do",
                    dataType : "json",
                    success : function(data){
                        chart.setOption({series:[{
                                data:[
                                    {value:data.count,itemStyle:{normal:{color:'#ff6238'}}},
                                    {value:(data.total-data.count),itemStyle:{normal:{color:'#c7c7c7'}}}
                                ]
                            }]});

                        $("#officeCount").html(data.office);
                        $("#costCount").html(data.cost);
                        $("#progresCount").html(data.progres);
                        $("#capitalCount").html(data.capital);
                        $(".areaLeft .bottom").html(data.month+'月份超期率');
                        var overdueRate=(data.count/data.total)*100;
                        $(".trafficOverdueStatistics .contentArea>.areaLeft ul>.right>.title").html(isNaN(overdueRate)?"0.00%":overdueRate.toFixed(2)+"%");
                    }
                });
            };
        });
    }();
    
    function jump_flowExamine(type) {
        window.open("/app/statementmoney/flowExamine/flow_index.jsp?flowType="+type+"&isOverdue=1&showType=readonly");
    }
</script>