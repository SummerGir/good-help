<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
%>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.UI);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.easyui);
        var itemId_total_capital = "ZJFPJH";
    </script>
    <style>
        .total_capital .chi{margin-top: 11px;}
        .total_capital .panel-title{position: relative;}
        .total_capital .panel-title .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
        .total_capital .panel-body{border: none;}
        .total_capital .total_capital_pom{position: relative;padding: 0;}
        .total_capital_pom .bottom-desc .bottom-child span{padding: 0;}
        .total_capital_pom .bottom-desc table{min-width: 140px;}
        .total_capital_pom .bottom-desc td{border: 1px solid #b3d6ff;text-align: center;}

        .total_capital .right-title{font-size: 14px;font-weight: bold;text-align: center;padding: 5px;margin-top: 3px;background: #daf0ff;color: #000;}
        .total_capital .row-name{display: block;}
        .total_capital .row-name .name-right{float: right;padding-right: 6px;}
        .total_capital .row-line{display: block;height: 5px;background: #e8e8e8;border-radius: 5px;}
        .total_capital .row-line .line-child{display: block;height: 5px;border-radius: 5px;width: 0;}

        .total_capital .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
        .total_capital .chi_context {cursor: default;}
        .total_capital .chi_context .p_1{width: 100%;height: 100%;line-height:190px;font-weight: bold;text-align: center;color: #888;font-size: 14px; }
    </style>
    <div class="panel panel-default total_capital" style="height: 100%;border-top: 2px solid rgba(30,141,237,0.3);">
      <div class="panel-heading" style="background-color: #fff;font-size: 16px;height: 30px;padding: 3px 5px;">
        <h3 class="panel-title">
            <span style="font-size: 14px;cursor: default;float: left;">项目资金统计(公司)</span>
            <%--<span class="project_name">全部项目部</span>--%>
            <i class="iconfont icon-shezhi1"></i>
        </h3>
      </div>
        <div class="panel-body total_capital_pom">
            <div class="col-md-10 left" style="padding: 10px 0 0 10px;border-right: 4px solid #e1e1e1;">
                <div id="total_capital_l" style="width: 100%;height: 226px;margin-right: 4px;"></div>
            </div>
            <div class="col-md-2 right" style="padding: 0 10px 0 10px;cursor: default;">
                <div class="chi right-title">昨日动态对标情况</div>
                <div class="chi_context" style="height: 190px;"></div>
            </div>

            <%--弹框--%>
            <div class="modal dialog_total_capital_project" aria-hidden="true" data-backdrop="static">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">项目部</h3>
                </div>
                <div class="panel-body" style="padding: 10px;">
                    <div id="total_capital_tree"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
                    <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
                </div>
            </div>
        </div>
    </div>
<script type="text/javascript" src="/public/home/widgets/totalCapital/index.js"></script>