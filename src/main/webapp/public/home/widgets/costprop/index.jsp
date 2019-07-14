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
        var itemId_cost_prop = "xmzzjfxbb";
    </script>
    <style>
        .cost_prop{cursor: default;}
        .cost_prop .chi{margin-top: 11px;}
        .cost_prop .panel-title{position: relative;line-height: 20px;}
        .cost_prop .panel-title .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
        .cost_prop .panel-body{border: none;}
        .cost_prop .cost_prop_pom{position: relative;padding: 0;}
        .cost_prop_pom .bottom-desc .bottom-child span{padding: 0;}
        .cost_prop_pom .bottom-desc table{min-width: 140px;}
        .cost_prop_pom .bottom-desc td{border: 1px solid #b3d6ff;text-align: center;}

        .cost_prop .right-title{font-size: 14px;font-weight: bold;text-align: center;padding: 5px;margin-top: 0px;background: #daf0ff;color: #000;}
        .cost_prop .row-name{display: block;}
        .cost_prop .row-name .name-right{float: right;padding-right: 6px;}
        .cost_prop .row-line{display: block;height: 5px;background: #e8e8e8;border-radius: 5px;}
        .cost_prop .row-line .line-child{display: block;height: 5px;border-radius: 5px;width: 0;}

        .cost_prop .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
    </style>
    <div class="panel panel-default cost_prop" style="height: 100%;border-top: 2px solid rgba(30,141,237,0.3);">
      <div class="panel-heading" style="background-color: #fff;font-size: 16px;height: 30px;padding: 3px 5px;">
        <h3 class="panel-title">
            <span style="font-size: 14px;cursor: default;float: left;">成本占比分析(公司)</span>
            <%--<span class="project_name">全部项目部</span>--%>
            <i class="iconfont icon-shezhi1"></i>
        </h3>
      </div>
        <div class="panel-body cost_prop_pom">
            <div class="col-md-10" style="padding: 10px 0 0 10px;border-right: 4px solid #e1e1e1;">
                <div id="cost_prop_l" style="width: 100%;height: 226px;margin-right: 4px;"></div>
            </div>
            <div class="col-md-2" style="padding: 0 10px 0 10px;margin-top: 6px;">
                <div class="chi right-title">项目成本平均占比</div>
                <div class="chi row-Meterial">
                    <span class="row-name">
                        <span class="name-left">材料成本</span>
                        <span class="name-right">0%</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Lease">
                    <span class="row-name">
                        <span class="name-left">租赁成本</span>
                        <span class="name-right">0%</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Labour">
                    <span class="row-name">
                        <span class="name-left">劳务成本</span>
                        <span class="name-right">0%</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Machine">
                    <span class="row-name">
                        <span class="name-left">机械成本</span>
                        <span class="name-right">0%</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Fee">
                    <span class="row-name">
                        <span class="name-left">间接费成本</span>
                        <span class="name-right">0%</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
            </div>

            <%--弹框--%>
            <div class="modal dialog_cost_prop_project" aria-hidden="true" data-backdrop="static">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">项目部</h3>
                </div>
                <div class="panel-body" style="padding: 10px;">
                    <div id="cost_prop_tree"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
                    <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
                </div>
            </div>
        </div>
    </div>
<script type="text/javascript" src="/public/home/widgets/costprop/index.js"></script>