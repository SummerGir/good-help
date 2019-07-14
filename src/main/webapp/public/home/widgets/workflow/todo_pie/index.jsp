<%@ page import="eiis.core.workflow.ModuleCode" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.textindex.*" %>
<%@ page import="org.joda.time.DateTime" %>
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
    <%
        FactoryBean tiFactoryBean = DefaultFactory.getFactory();

        Query tiQuery = new Query();
        tiQuery.addModCode(ModuleCode.FLOW_TASK_TODO_CODE);
        tiQuery.addAuthMemId(Context.getCurrent().getId());

        Reader tiReader = tiFactoryBean.createReader();
        tiReader.setReturnContentResults(ReturnContentResults.NONE);
        tiReader.setRows(1);

        DateTime dateTime = new DateTime();
        QueryFilter tiFilter = null;
        DocumentList documentList = null;

        //未过期
        tiFilter = tiFactoryBean.createFilter("STATE", 1, FieldType.INT);
        tiFilter.and(tiFactoryBean.createFilter("alert_time", dateTime.plusSeconds(1).toDate(), dateTime.plusYears(10).toDate(), FieldType.DATE));
        tiQuery.setFilter(tiFilter);
        documentList = tiReader.query(tiQuery);
        long unexpired = documentList.getNumFound();

        //快超期
        tiFilter = tiFactoryBean.createFilter("STATE", 1, FieldType.INT);
        tiFilter.and(tiFactoryBean.createFilter("alert_time", dateTime.plusYears(-10).toDate(), dateTime.toDate(), FieldType.DATE))
                .and(tiFactoryBean.createFilter("extend_time", dateTime.plusSeconds(1).toDate(), dateTime.plusYears(10).toDate(), FieldType.DATE));
        tiQuery.setFilter(tiFilter);
        documentList = tiReader.query(tiQuery);
        long fastExpired = documentList.getNumFound();

        //超期
        tiFilter = tiFactoryBean.createFilter("STATE", 1, FieldType.INT);
        tiFilter.and(tiFactoryBean.createFilter("extend_time", dateTime.plusYears(-10).toDate(), dateTime.toDate(), FieldType.DATE));
        tiQuery.setFilter(tiFilter);
        documentList = tiReader.query(tiQuery);
        long expired = documentList.getNumFound();

    %>
    <div class="widget-charts-panel">
        <div class="widget-charts-title">流程饼图</div>
        <div id="piechart-placeholder"
             class="widget-charts-content"></div>
    </div>
    <script type="text/javascript">
        $(window).load(function () {
            require([
                        'echarts',
                        'echarts/chart/pie'
                    ],
                    function (ec) {
                        var data = new HashMap();
                        data.put("已超期", <%=expired%>);
                        data.put("快过期", <%=fastExpired%>);
                        data.put("未过期", <%=unexpired%>);

                        var placeholder = $("#piechart-placeholder");
                        placeholder.unbind();

                        var option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                x: "right",
                                y: "bottom",
                                formatter: function (name) {
                                    return data.get(name) + "个" + name;
                                },
                                data: data.keys()
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            color: [
                                '#c12e34', '#e6b600', '#2b821d'
                            ],
                            calculable: true,
                            series: [
                                {
                                    name: '待审情况',
                                    type: 'pie',
                                    radius: [60, 45],
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: true
                                            },
                                            labelLine: {
                                                show: true
                                            }
                                        },
                                        emphasis: {
                                            label: {
                                                show: true,
                                                position: 'center',
                                                textStyle: {
                                                    fontSize: '20',
                                                    fontWeight: 'bold'
                                                }
                                            }
                                        }
                                    },
                                    data: [
                                        {value: data.get('已超期'), name: '已超期'},
                                        {value: data.get('快过期'), name: '快过期'},
                                        {value: data.get("未过期"), name: "未过期"}
                                    ]
                                }
                            ]
                        };

                        var myChart = ec.init(placeholder[0], {});
                        $(window).on("resize", myChart.resize);
//                                    window.onresize = myChart.resize;
                        myChart.setOption(option, true);
                    }
            );
        });
    </script>
</div>
