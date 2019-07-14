<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.UI);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.easyui);
        var itemId_task_month = "progressStatistical";
    </script>
    <script type="text/javascript" src="/public/js/date_extend.js"></script>
    <style>
        .task_month{cursor: default;}
        .task_month .panel-title{position: relative;line-height: 20px;}
        .task_month .panel-title .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
        .task_month .panel-body{border: none;}
        .task_month .task_month_pom{position: relative;padding: 0;}
        .task_month_pom .biaopan{height: 227px;padding: 0;}
        .task_month_pom .bottom-desc{width: 150px;margin: -42px auto;}
        .task_month_pom .bottom-desc .bottom-child span{padding: 0;}
        .task_month_pom .bottom-desc table{min-width: 140px;}
        .task_month_pom .bottom-desc td{border: 1px solid #b3d6ff;text-align: center;}
        .task_month .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
        .task_month_pom table{width: 100%;}
        .task_month_pom table td{text-align: center;padding: 4px 1px;}
    </style>
    <div class="panel panel-default task_month" style="height: 100%;border-top: 2px solid rgba(30,141,237,0.3);">
      <div class="panel-heading" style="background-color: #fff;font-size: 16px;height: 30px;padding: 3px 5px;">
        <h3 class="panel-title">
            <span style="font-size: 14px;cursor: default;float: left;">月度节点透视</span>
            <span class="project_name">全部项目部</span>
            <i class="iconfont icon-shezhi1"></i>
        </h3>
      </div>
        <div class="panel-body task_month_pom">
          <div class="col-md-10" style="padding: 10px 0 0 10px;border-right: 4px solid #e1e1e1;position: relative;">
              <div id="task_month_z" style="width: 100%;height: 226px;margin-right: 4px;"></div>
              <div style="position: absolute;top: 11px;left: 50%;margin-left: -200px;">
                  <div style="background: #cccccc;width: 25px;height: 14px;border-radius: 3px;float: left;margin-top: 4px;"></div>
                  <span style="float: left;margin-left: 5px;">基准工期</span>
                  <div style="background: green;width: 25px;height: 14px;border-radius: 3px;float: left;margin-top: 4px;margin-left: 15px;"></div>
                  <span style="float: left;margin-left: 5px;">实际工期(绿灯)</span>
                  <div style="background: yellow;width: 25px;height: 14px;border-radius: 3px;float: left;margin-top: 4px;margin-left: 15px;"></div>
                  <span style="float: left;margin-left: 5px;">实际工期(黄灯)</span>
                  <div style="background: red;width: 25px;height: 14px;border-radius: 3px;float: left;margin-top: 4px;margin-left: 15px;"></div>
                  <span style="float: left;margin-left: 5px;">实际工期(红灯)</span>
              </div>
          </div>
            <div class="col-md-2 right_num" style="padding: 0 !important;">
                <div style="margin: 5px;border: 1px solid #1093ed;">
                    <table style="color: #919191;">
                        <tr>
                            <td rowspan="3" style="width: 40%;color: #fff;background: #1093ed;font-size: 18px;"><span name="num_level">0</span>项</td>
                            <td style="width: 20%">1级</td>
                            <td style="text-align: right;padding-right: 15px;"><span style="font-size: 14px;color: #1093ed;" name="num_level_1">0</span>&nbsp;项</td>
                        </tr>
                        <tr>
                            <td>2级</td>
                            <td style="text-align: right;padding-right: 15px;"><span style="font-size: 14px;color: #1093ed;" name="num_level_2">0</span>&nbsp;项</td>
                        </tr>
                        <tr>
                            <td>3级</td>
                            <td style="text-align: right;padding-right: 15px;"><span style="font-size: 14px;color: #1093ed;" name="num_level_3">0</span>&nbsp;项</td>
                        </tr>
                    </table>
                </div>
                <div style="margin: 5px;">
                    <table style="color: #5e5e5e;">
                        <tr>
                            <td colspan="2">已完成项统计（<span name="num_finish">0</span>）</td>
                        </tr>
                        <tr>
                            <td style="background: #e1e1e1;border-right: 1px solid #fff;">超期项&nbsp;<span style="color: red;font-size: 14px;" name="num_finish_cq">0</span></td>
                            <td style="background: #e1e1e1;">达标项&nbsp;<span style="color: #2ac68d;font-size: 14px;" name="num_finish_db">0</span></td>
                        </tr>
                    </table>
                </div>
                <div style="margin: 5px;">
                    <table>
                        <tr>
                            <td colspan="2">未完成项统计（<span name="num_nofinish">0</span>）</td>
                        </tr>
                        <tr>
                            <td style="background: #e1e1e1;border-right: 1px solid #fff;">未开工项&nbsp;<span style="color: #000000;font-size: 14px;" name="num_nofinish_wkg">0</span></td>
                            <td style="background: #e1e1e1;">现施工项&nbsp;<span style="color: #2ac68d;font-size: 14px;" name="num_nofinish_ykg">0</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <%--弹框--%>
            <div class="modal dialog_task_month" style="display: none;" aria-hidden="true" data-backdrop="static">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">项目部</h3>
                </div>
                <div class="panel-body" style="padding: 10px;">
                    <div style="margin-bottom: 10px;">
                        <div id="task_month_level_tree"></div>
                    </div>
                    <div id="task_month_project_tree"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
                    <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
                </div>
            </div>
        </div>
    </div>
<script type="text/javascript" src="/public/home/widgets/task/task_month/index.js"></script>