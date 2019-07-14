<%@ page import="eiis.context.CurrentApplicationTemplate" %>
<%@ page import="eiis.util.jquery.AppTreeNode" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    AppTreeNode xmzzjfxbb = CurrentApplicationTemplate.getAppTreeNodeByCode("xmzzjfxbb");
    String nodeKey="";
    if(xmzzjfxbb!=null){
        nodeKey=xmzzjfxbb.getTemplateItemId();
    }
%>
<style type="text/css">
    .projectCostIndicator{
        border-top: 2px solid rgba(85,169,241,0.3);
    }
    .projectCostIndicator .contentWrapper{
        padding: 0;
    }
    .projectCostIndicator .contentArea{
        min-height: 179px;
        background-color: #e1e1e1;
    }
    .projectCostIndicator .contentArea>div{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
    }
    .projectCostIndicator .contentArea>.left{
        padding: 6px 10px 10px 10px;
        background-color: #ffffff;
    }
    .projectCostIndicator .contentArea>.left{
        width: 150px;
        z-index: 1;
    }
    .projectCostIndicator .contentArea>.left>div{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .projectCostIndicator .contentArea>.left>div>div{
        width: 100%;
        position: absolute;
    }
    .projectCostIndicator .contentArea>.left>div>.chart{
        height: 100%;
        top: 0;
        left: 0;
        padding-top: 4px;
        padding-bottom: 54px;
    }
    .projectCostIndicator .contentArea>.left>div>.info{
        bottom: 0;
        left: 0;
        color: #166de4;
        text-align: center;
    }
    .projectCostIndicator .contentArea>.left>div>.info>span{
        font-weight: bolder;
    }
    .projectCostIndicator .contentArea>.left>div>.projectName{
        bottom: 24px;
        left: 0;
        color: #686868;
        text-align: center;
        padding: 0 14px;
        width: 100%;
        overflow: hidden;
        white-space:  nowrap;
        text-overflow: ellipsis;
    }
    .projectCostIndicator .contentArea>.right{
        width: 100%;
        padding: 0 0 0 154px;
    }
    .projectCostIndicator .contentArea>.right>div{
        width: 100%;
        height: 100%;
        display: table;
        color: #686868;
        text-align: center;
        padding: 6px 6px 10px 6px;
        background-color: #ffffff;
    }
    .projectCostIndicator .contentArea>.right>div>._row{
        display: table-row;
    }
    .projectCostIndicator .contentArea>.right>div>._row>.none{
        background-color: #ffffff;
    }
    .projectCostIndicator .contentArea>.right>div>.head{
        background-color: #eeeeee;
    }
    .projectCostIndicator .contentArea>.right>div>.head>.cell{
        vertical-align: middle !important;
    }
    .projectCostIndicator .contentArea>.right>div>._row>.cell{
        display: table-cell;
        vertical-align: bottom;
    }
    .projectCostIndicator .contentArea>.right>div>.total{
        color: #000000;
    }
    .projectCostIndicator .contentArea>.right>div>._row>.legend>div{
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 4px;
    }
    .projectCostIndicatorSetting .panel-body .row{
        height: 34px;
        line-height: 34px;
    }
    .projectCostIndicatorSetting .panel-body label>div{
        padding-left: 60px;
        position: absolute;
        top: 0;
    }
</style>
<div class="projectCostIndicator homeModule">
    <div class="homeHead">
        <span class="title">项目成本指标</span>
        <i class="setting iconfont icon-shezhi1"></i>
    </div>
    <div class="homeBody">
        <div class="contentWrapper">
            <div class="contentArea">
                <div class="left">
                    <div>
                        <div class="chart">

                        </div>
                        <div class="projectName"></div>
                        <div class="info">
                            建筑规模 <span class="money"></span> ㎡
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div>
                        <div class="_row head">
                            <div class="cell">成本类型</div>
                            <div class="cell">发生成本</div>
                            <div class="cell">单方造价</div>
                            <div class="cell">已付金额</div>
                            <div class="cell">支付比例</div>
                        </div>
                        <div class="_row meterial">
                            <div class="cell legend">
                                <div style="background-color: #43cbfe;"></div>
                                <span>材料成本</span>
                            </div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                        <div class="_row labour">
                            <div class="cell legend">
                                <div style="background-color: #ffa338;"></div>
                                <span>劳务成本</span>
                            </div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                        <div class="_row lease">
                            <div class="cell legend">
                                <div style="background-color: #2dcc72;"></div>
                                <span>租赁成本</span>
                            </div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                        <div class="_row machine">
                            <div class="cell legend">
                                <div style="background-color: #166de4;"></div>
                                <span>机械成本</span>
                            </div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                        <div class="_row fee">
                            <div class="cell legend">
                                <div style="background-color: #ff6238;"></div>
                                <span>间接费用</span>
                            </div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                        <div class="_row total">
                            <div class="cell">&nbsp;&nbsp;&nbsp;小&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal projectCostIndicatorSetting" tabindex="-1" data-width="498px">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
                aria-hidden="true">&times;</button>
        <h3 class="modal-title">
            <span style="font-weight: bold;">项目成本指标设置</span>
        </h3>
    </div>
    <div class="panel-body form-horizontal" style="padding: 10px;overflow: initial;">
        <div class="project-combobox"></div>
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
        var homeModule=$(".projectCostIndicator");
        var settingModal=$(".projectCostIndicatorSetting");
        var contentArea=homeModule.find(".contentArea");
        var chart,projectName,money;
        var option = {
            series: [
                {
                    silent:true,
                    type:'pie',
                    radius: ['50%', '100%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            align:'center',
                            verticalAlign:'middle',
                            fontSize : 10,
                            position: 'inside',
                            formatter: function(data){
                                if(data.value>0){
                                    return data.value+"%"
                                }
                            }
                        }
                    },
                    data:[
                        {value:10, itemStyle:{
                                normal: {
                                    color : '#43cbfe'
                                }
                            }},
                        {value:20, itemStyle:{
                                normal: {
                                    color : '#ffa338'
                                }
                            }},
                        {value:30, itemStyle:{
                                normal: {
                                    color : '#2dcc72'
                                }
                            }},
                        {value:20, itemStyle:{
                                normal: {
                                    color : '#166de4'
                                }
                            }},
                        {value:20, itemStyle:{
                                normal: {
                                    color : '#ff6238'
                                }
                            }}
                    ]
                }
            ]
        };
        $(function(){
            window.projectSelect=$(".project-combobox").homeSelect({
                idField : "projectId",
                treeField : "projectName",
                title : "项目部",
                multiple : false
            });
            require(["echarts3"],function(ECharts){
                chart=ECharts.init(contentArea.find(">.left .chart")[0]);
                projectName=contentArea.find(">.left .projectName");
                money=contentArea.find(">.left .money");
                getData();
            });
            var clickState=false;
            settingModal.find(".mySubmit-button").on("click",function(){
                if(!clickState){
                    clickState=true;
                    $.ajax({
                        type : "post",
                        url : "/public/homepage/saveIndicatorSetting.do",
                        data : {projectId : projectSelect.homeSelect("getValue")},
                        dataType : "json",
                        success : function(msg){
                            clickState=false;
                            if(msg.errorCode===0){
                                getData();
                                settingModal.data("tempId",projectSelect.homeSelect("getValue"));
                                settingModal.modal("hide");
                            }else{
                                $.message("保存失败");
                            }
                        }
                    });
                }
            });
            $.ajax({
                type : "post",
                url : "/public/homepage/getProject.do",
                data : {nodeKey : "<%=nodeKey%>"},
                dataType : "json",
                success : function(msg){
                    projectSelect.homeSelect("setData",msg);
                    $.ajax({
                        type : "post",
                        url : "/public/homepage/getIndicatorSetting.do",
                        data : {},
                        dataType : "json",
                        success : function(msg1){
                            var tempId;
                            if(msg1.projectId){
                                var project,first=true,firstId,state=false;
                                for(var i=0;i<msg.rows[0].children.length;i++){
                                    project=msg.rows[0].children[i];
                                    if(first){
                                        firstId=project.projectId;
                                        first=false;
                                    }
                                    if(msg1.projectId===project.projectId){
                                        tempId=msg1.projectId;
                                        state=true;
                                        break;
                                    }
                                }
                                if(!state){
                                    tempId=firstId;
                                }
                            }else{
                                tempId=msg.rows[0].children[0].projectId;
                            }
                            projectSelect.homeSelect("select",tempId);
                            settingModal.data("tempId",tempId);
                        }
                    });
                }
            });
            homeModule.find(".setting").on("click",function(){
                settingModal.off("shown.bs.modal").on("shown.bs.modal",function(){
                    projectSelect.homeSelect("resize");
                });
                projectSelect.homeSelect("select",settingModal.data("tempId"));
                settingModal.modal();
            });
            $(window).resize(function(){
                chart.resize();
            });
        });
        var getData=function(){
            $.ajax({
                type : "post",
                url : "/public/homepage/getIndicator.do",
                data : {},
                dataType : "json",
                success : function(msg){
                    projectName.text(msg.projectName);
                    var rows=msg.rows,row,tableRow,cells;
                    var totalCostMoney=0.00,moneys=[],ratios=[];
                    for(var i=0;i<rows.length;i++){
                        row=rows[i];
                        tableRow=homeModule.find("."+row.kindStr);
                        cells=tableRow.find(".cell");
                        cells.eq(1).text(row.costMoney);
                        cells.eq(2).text(row.price);
                        cells.eq(3).text(row.payMoney);
                        cells.eq(4).text(row.ratio);
                        if(row.kindStr!=="total"){
                            totalCostMoney+=Number(row.costMoney);
                            moneys.push(Number(row.costMoney));
                        }
                    }
                    money.text(msg.projectNum);
                    for(i=0;i<5;i++){
                        option.series[0].data[i].value=totalCostMoney===0.00?0.00:parseInt(moneys[i]/totalCostMoney*100);
                    }
                    chart.setOption(option);
                }
            });
        };
    }();
</script>