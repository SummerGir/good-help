<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.core.workflow.ModuleCode" %>
<%@ page import="eiis.textindex.*" %>
<%@ page import="org.joda.time.DateTime" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Collection" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--[if lte IE 8]>
<script language="javascript" type="text/javascript" src="/public/old-ie/excanvas.min.js"></script>
<![endif]-->
<style type="text/css">
    .widget-charts {
        text-align: center;
    }

    .widget-charts-panel {
        /*display: inline-block;*/
        margin-bottom: 5px;
        margin-right: 0px;
        padding: 10px 20px;
        background-color: #f8f8f8;
        background: -webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#f2f2f2));
        background: -webkit-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -moz-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -ms-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -o-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: linear-gradient(top, #f8f8f8, #f2f2f2);
        background: #f8f8f8 url("/public/home/widgets/workflow/todo_pie/cream.png") repeat;
        text-shadow: 0px 1px #fff;
        border: 1px solid #ccc;
        box-shadow: inset 0px 0px 3px #fff;
        max-width: 100%;
        /*width: 300px;*/
        text-align: center;
    }

    .widget-charts-title {
        float: left;
        width: 28px;
        line-height: 22px;
        font-weight: bold;
        font-size: 18px;
        border: 1px solid #e0e0e0;
        background-color: #f3f3f3;
        text-align: center;
        padding: 4px;
        position: relative;
        display: block !important;
    }

    .widget-charts-content {
        margin-left: 40px;
        max-width: 100%;
        min-height: 150px
    }
</style>
<div class="widget-charts">
    <div class="widget-charts-panel" style="padding: 0px;">
        <div id="linechart-placeholder" style="max-width: 100%; min-height: 170px"></div>
    </div>
    <%
        FactoryBean tiFactoryBean = DefaultFactory.getFactory();

        Query tiQuery = new Query();
        tiQuery.addModCode(ModuleCode.FLOW_TASK_TODO_CODE);
        tiQuery.addAuthMemId(Context.getCurrent().getId());
        tiQuery.addModCode(ModuleCode.FLOW_TASK_FINISHED_CODE);
        int pastWeeks = 3;
        Collection<Long> received = new ArrayList<Long>(pastWeeks + 1);
        Collection<Long> processed = new ArrayList<Long>(pastWeeks + 1);

        QueryFilter tiFilter = null;
        Reader tiReader = tiFactoryBean.createReader();
        tiReader.setReturnContentResults(ReturnContentResults.NONE);
        tiReader.setRows(1);

        DateTime dateTime = new DateTime();
        dateTime = dateTime.withHourOfDay(0).withMinuteOfHour(0).withSecondOfMinute(0).withMillisOfSecond(0).minusDays(dateTime.getDayOfWeek() - 1);
        for (int i = pastWeeks; i >= 0; i--) {
            Date startDate = dateTime.minusWeeks(i).toDate();
            Date endDate = dateTime.minusWeeks(i - 1).minusMillis(1).toDate();
            tiFilter = tiFactoryBean.createFilter("send_time", startDate, endDate, FieldType.DATE);
            tiQuery.setFilter(tiFilter);
            received.add(tiReader.query(tiQuery).getNumFound());

            tiFilter = tiFactoryBean.createFilter("finish_time", startDate, endDate, FieldType.DATE);
            tiQuery.setFilter(tiFilter);
            processed.add(tiReader.query(tiQuery).getNumFound());
        }
    %>
    <script type="text/javascript">
        $(window).load(function () {
            require(
                    [
                        'echarts',
                        'echarts/chart/line',
                        'echarts/chart/bar'
                    ],
                    function (ec) {

                        var xAxisData = [];
                        for (var i = <%=pastWeeks%>; i >= 0; i--) {
                            if (i == 0) {
                                xAxisData.push("本周");
                            } else if (i == 1) {
                                xAxisData.push("上周");
                            } else {
                                xAxisData.push("前" + i + "周");
                            }
                        }

                        var placeholder = $("#linechart-placeholder");
                        placeholder.unbind();

                        var option = {
                            title: {
                                text: '流程处理图'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['接收', '办理']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataZoom: {
                                        show: true
                                    },
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}/*,
                                     myTool: {
                                     show: true,
                                     title: '放大/缩小',
                                     icon: 'saveAsImage',
                                     onclick: function () {
                                     alert('myToolHandler')
                                     }
                                     }*/
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: xAxisData
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    min: 0
                                }
                            ],
                            series: [
                                {
                                    name: '接收',
                                    type: 'line',
                                    data: <%=eiis.util.json.JsonUtils.toString(received)%>,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '办理',
                                    type: 'line',
                                    data: <%=eiis.util.json.JsonUtils.toString(processed)%>,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        };

                        var myChart = ec.init(placeholder[0], {});
                        $(window).on("resize", myChart.resize);
//                                    window.onresize = myChart.resize;
                        myChart.setOption(option);
                    }
            );
        });
    </script>
</div>
