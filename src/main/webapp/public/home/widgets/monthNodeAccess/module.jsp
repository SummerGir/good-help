<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    .monthNodeAccess{
        border-top: 2px solid #00b9ed;
    }
    .monthNodeAccess .contentArea{
        min-height: 229px;
    }
    .monthNodeAccess .homeBody{
        padding-bottom: 0;
    }
    .monthNodeAccess .contentArea>.tools{
        position: absolute;
        right: 40px;
        z-index: 1;
    }
    .monthNodeAccess .contentArea>.tools span{
        margin-right: 4px;
    }
    .monthNodeAccess .contentArea>.tools select{
        width: 100px;
        border-color: #d2d2d2;
        border-radius: 3px;
        padding-left: 4px;
    }
    .monthNodeAccess .contentArea>.chart{
        width: 100%;
        height: 100%;
    }
</style>
<div class="monthNodeAccess homeModule">
    <div class="homeHead">
        <span class="title">月度节点透视</span>
        <i class="setting iconfont icon-shezhi1"></i>
    </div>
    <div class="homeBody">
        <div class="contentWrapper">
            <div class="contentArea">
                <div class="tools">
                    <label>
                        <span>节点明细 : </span>
                        <select>
                            <option value="1">1级节点</option>
                            <option value="2">2级节点</option>
                            <option value="3">3级节点</option>
                        </select>
                    </label>
                </div>
                <div class="chart"></div>
            </div>
        </div>
    </div>
</div>
<script type="application/javascript">
    !function(){
        var contentArea,chart;
        var option = {
            grid: {
                top: '30px',
                left: '0',
                right: '40px',
                bottom: '40px',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['周一','周二','周三','周四','周五','周六','周日','周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    type:'bar',
                    silent:true,
                    barWidth:20,
                    itemStyle:{
                        normal:{
                            color:'#dbeef4'
                        }
                    },
                    data:[320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320]
                },
                {
                    type:'bar',
                    silent:true,
                    barWidth:20,
                    itemStyle:{
                        normal:{
                            color:'#ff6238'
                        }
                    },
                    data:[320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320]
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    startValue:0,
                    endValue:10,
                    minValueSpan:10,
                    maxValueSpan:10,
                    xAxisIndex: [0],
                    height : 20,
                    bottom : 10,
                    handleStyle:{
                        opacity:0
                    }
                }
            ]
        };
        $(function(){
            contentArea=$(".monthNodeAccess .contentArea");
            require(["echarts3"],function(ECharts){
                chart=ECharts.init(contentArea.find(".chart")[0]);
                chart.setOption(option);
            });
        });
    }();
</script>