<%@ page import="eiis.app.projectinfo.service.ProjectInfoService" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.context.CurrentApplicationTemplate" %>
<%@ page import="eiis.util.jquery.AppTreeNode" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!--[if lte IE 8]>
<script language="javascript" type="text/javascript" src="/public/old-ie/excanvas.min.js"></script>
<![endif]-->
<link rel="stylesheet" type="text/css" href="/public/controls/select2/css/select2.css">

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

        List<Map<String, Object>> list = ProjectInfoService.getInstance().getProjectList();
        StringBuffer sb2 = new StringBuffer();
        if(list==null || list.size()<=0){
            sb2.append("<option value=''>--无权限--</option>");
        }else{
            for(Map<String,Object> m:list){
                sb2.append("<option value='"+m.get("projectId").toString()+"'>"+m.get("projectName").toString()+"</option>");
            }
        }

        String content_url = "";
        AppTreeNode appTreeNode = CurrentApplicationTemplate.getAppTreeNodeByCode("zjzctj"); //按资源代码获取资源
        if (appTreeNode != null) {
            content_url = appTreeNode.getHref();
        }

    %>
    <div class="widget-charts-panel" style="padding: 2px;">
        <div class="col-xs-8 col-md-8 col-md-offset-2 col-xs-offset-2" style="position:absolute; z-index: 1">
            <select  id="objectId_pay" onchange="loadBar_pay()" class="select2" style="width: 100%;" multiple>
                <%=sb2.toString()%>
            </select>
        </div>
        <div id="pay_columnar_pay"  style="max-width: 100%; min-height: 200px;"></div>
    </div>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
        require([
            "/public/controls/select2/js/select2.js"
        ], function (select2) {
            $('select.select2').select2();
        });
        $(function () {
            loadBar_pay();
        });

        function loadBar_pay(){
            var objectId = $("#objectId_pay").val();
            var objectIds = "";
            if(objectId != null){
                objectIds = objectId.join(",");
            }
            $.getJSON("/public/home/sheet/plug_in_action.jsp",{action:"plugProjectMoneyPay",ids:objectIds},function(res){
                require([
                            'echarts',
                            'echarts/chart/bar'
                        ],
                        function (ec) {

                            var placeholder = $("#pay_columnar_pay");
                            placeholder.unbind();

                            var option = {
                                title : {
                                    text: '支出资金',
                                    subtext: ''
                                },
                                tooltip : {
                                    trigger: 'axis',
                                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                toolbox: {
                                    show : true,
                                    feature : {
                                        saveAsImage : {show: true}
                                    }
                                },
                                calculable : false,
                                xAxis : [
                                    {
                                        type : 'category',
                                        data : res.name,
                                        axisLabel:{
                                            interval:0, //全部显示
                                            rotate:0,  //倾斜
                                            margin:3, //距离坐标轴长度
                                            clickable:false //可点击

                                        }

                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value'
                                    }
                                ],
                                series : [
                                    {
                                        name:'金额',
                                        type:'bar',
                                        data:res.value,
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
                            };


                            var myChart = ec.init(placeholder[0], {});
                            $(window).on("resize", myChart.resize);
                            myChart.setOption(option, true);
                            myChart.on("click",function(param){
                                var url = '<%=content_url%>';
                                if(url == ""){
                                    $.message("无查看权限");
                                    return;
                                }
                                var projectId = res.id[param.dataIndex];
                                location.href = url+"?projectId="+projectId;
                            });
                        }
                );
            });
        }
    </script>
</div>
