<%@ page import="java.util.Calendar" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
    int year = Calendar.getInstance().get(Calendar.YEAR);
%>
<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.UI);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.easyui);
    var itemId_lease_c = "xmzlzjzftjhzbnew";
</script>
<style>
    .lease_c{cursor: default;}
    .lease_c .panel-title{position: relative;line-height: 20px;}
    .lease_c .panel-title .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
    .lease_c .panel-body{border: none;}
    .lease_c_pom{position: relative;padding: 0;}
    .lease_c_pom .biaopan{height: 240px;padding: 0;}
    .lease_c_pom .bottom-desc{width: 150px;margin: -42px auto;}
    .lease_c_pom .bottom-desc .bottom-child span{padding: 0;}
    .lease_c_pom .bottom-desc table{min-width: 140px;}
    .lease_c_pom .bottom-desc td{border: 1px solid #b3d6ff;text-align: center;}

    .lease_c .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
</style>
<div class="panel panel-default lease_c" style="height: 100%;border-top: 2px solid rgba(30,141,237,0.3);">
    <div class="panel-heading" style="background-color: #fff;font-size: 16px;height: 30px;padding: 3px 5px;">
        <h3 class="panel-title">
            <span style="font-size: 14px;cursor: default;float: left;">项目租赁支付统计</span>
            <span class="project_name">全部项目部</span>
            <i class="iconfont icon-shezhi1"></i>
        </h3>
    </div>
    <div class="panel-body lease_c_pom">
        <div class="col-md-10" style="padding: 0 !important;border-right: 4px solid #e1e1e1;">
            <div id="lease_container_z" style="width: 100%;height: 240px;"></div>
        </div>
        <div class="col-md-2 biaopan">
            <div id="lease_container_b" style="width: 100%;height: 200px;top: -15px;"></div>
            <div class="bottom-desc">
                <table width="100%">
                    <tr>
                        <td colspan="3" style="background: #dfeefe;color: #000000;">累计租赁费用统计</td>
                    </tr>
                    <tr>
                        <td width="30%">发生额</td>
                        <td class="child-check" style="text-align: right;border-right: none;"></td>
                        <td style="width: 20%;border-left: none;color: #919191;">元</td>
                    </tr>
                    <tr>
                        <td>支付额</td>
                        <td class="child-pay" style="text-align: right;border-right: none;"></td>
                        <td style="border-left: none;color: #919191;">元</td>
                    </tr>
                </table>
            </div>
        </div>
        <%--弹框--%>
        <div class="modal dialog_lease_project" style="display: none;" aria-hidden="true" data-backdrop="static">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">项目部</h3>
            </div>
            <div class="panel-body" style="padding: 10px;">
                <div id="lease_c_tree"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
                <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="/public/home/widgets/econ/lease/c_index.js"></script>