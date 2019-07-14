<%@ page import="eiis.sys.userSetting.SysUserSettingData" %>
<%@ page import="eiis.app.projectinfo.service.ProjectInfoService" %>
<%@ page import="java.util.List" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.Arrays" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
    String projectId = SysUserSettingData.getInstance().getData(new String[]{"poto", "indicator","prop"});
    if(projectId==null){
        projectId="";
    }
    String projectName = ProjectInfoService.getInstance().getProjectNames(projectId.split(","));
    List<String> nameList = StringUtils.isBlank(projectName)?null: Arrays.asList(projectName.substring(0,projectName.length()-1).split(" "));
%>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.UI);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.easyui);
        var itemId_indicatorProp = "xmzzjfxbb";
    </script>
    <style>
        .indicatorProp{cursor: default;}
        .indicatorProp .chi{margin-top: 18px;}
        .indicatorProp .panel-title{position: relative;line-height: 20px;}
        .indicatorProp .panel-title .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
        .indicatorProp .panel-body{border: none;}
        .indicatorProp .indicatorProp{position: relative;padding: 0;}
        .indicatorProp .bottom-desc .bottom-child span{padding: 0;}
        .indicatorProp .bottom-desc table{min-width: 140px;}
        .indicatorProp .bottom-desc td{border: 1px solid #b3d6ff;text-align: center;}

        .indicatorProp .right-title{font-size: 14px;font-weight: bold;text-align: center;padding: 5px;margin-top: 0px;background: #daf0ff;color: #000;}
        .indicatorProp .row-name{display: block;}
        .indicatorProp .row-name .name-right{float: right;padding-right: 6px;}
        .indicatorProp .row-line{display: block;height: 5px;background: #e8e8e8;border-radius: 5px;}
        .indicatorProp .row-line .line-child{display: block;height: 5px;border-radius: 5px;width: 0;}

        .indicatorProp .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
    </style>
    <div class="panel panel-default indicatorProp" style="height: 100%;border-top: 2px solid rgba(30,141,237,0.3);">
      <div class="panel-heading" style="background-color: #fff;font-size: 16px;height: 30px;padding: 3px 5px;">
        <h3 class="panel-title">
            <span style="font-size: 14px;cursor: default;float: left;">零工、机械指标</span>
            <span class="project_name"><%=nameList==null?"全部项目部":nameList.get(0)+"等"+nameList.size()+"个项目部"%></span>
            <i class="iconfont icon-shezhi1"></i>
        </h3>
      </div>
        <div class="panel-body indicatorProp">
            <div class="col-md-10" style="padding: 10px 0 0 10px;border-right: 4px solid #e1e1e1;">
                <div id="indicatorProp_l" style="width: 100%;height: 226px;margin-right: 4px;"></div>
            </div>
            <div class="col-md-2" style="padding: 0 10px 0 10px;margin-top: 6px;">
                <div class="chi right-title">分项成本平均指标</div>
                <div class="chi row-Meterial">
                    <span class="row-name">
                        <span class="name-left">计时用工</span>
                        <span class="name-right">0</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Lease">
                    <span class="row-name">
                        <span class="name-left">零星收方</span>
                        <span class="name-right">0</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Labour">
                    <span class="row-name">
                        <span class="name-left">劳务奖罚</span>
                        <span class="name-right">0</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
                <div class="chi row-Machine">
                    <span class="row-name">
                        <span class="name-left">机械费用</span>
                        <span class="name-right">0</span>
                    </span>
                    <span class="row-line">
                        <span class="line-child"></span>
                    </span>
                </div>
            </div>

            <%--弹框--%>
            <div class="modal dialog_indicatorProp_project" aria-hidden="true" data-backdrop="static">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">项目部</h3>
                </div>
                <div class="panel-body" style="padding: 10px;">
                    <div id="indicatorProp_tree"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
                    <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
                </div>
            </div>
        </div>
    </div>
<script type="text/javascript" src="/public/home/widgets/indicatorProp/index.js"></script>