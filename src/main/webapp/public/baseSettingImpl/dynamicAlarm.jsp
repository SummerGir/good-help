<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
    String nowCode=request.getParameter("nowCode");
    if(nowCode==null){
        nowCode="";
    }
%>
<master:ContentPage  materPageId="_app">
    <master:Content contentPlaceHolderId="title">
        报警列表
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.json);
            EIIS.Common.loadCss("/public/baseSettingImpl/css/dynamicAlarm.css?n="+Math.random());
            EIIS.Common.loadJavaScript("/public/baseSettingImpl/js/dynamicAlarm.js?n="+Math.random());
            if(!EIIS.browser.pc)
                EIIS.Common.loadComponent(EIIS.Common.bootstrap.mobdatetimepicker);
            var mainId="";
            var nowCode="<%=nowCode%>";
            var uuidStr="";
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div id="wrap_title" class="kind_label">
            <div id="wrap_title_child" class="btn-group btn-group-justified">
            </div>
        </div>
        <div id="wrap" class="kind_desc">
            <div id="wrap_child">
            </div>
        </div>
        <div id="model_1" style="display: none">
            <div class="navbar-brand">
                <span style="padding: 5px 5px;" onclick="show_search()"><i class="esg-font icon-sousuo"></i></span>
                <span name="DOC_PUBLISH" onclick="add_doc()" style="padding: 5px 5px;display: none;"><i class="esg-font icon-tianjia"></i></span>
            </div>
        </div>

        <div id="model_3" style="display: none">
            <div class="item" data_id="">
                <div class="item_1">
                    <div class="headImg" align="center">
                        <i class="iconfont icon-LOGOxinban" style="color: #2dcc70;line-height:35px;font-size:26px;"></i>
                    </div>
                    <input type="hidden" name="mainId"/>
                    <input type="hidden" name="weidu"/>
                    <input type="hidden" name="yidu"/>
                    <span name="publishPersonName" style="margin-left: -7px;">e施工</span>
                    <span name="time" style="padding-left: -2px;"></span>
                    <span name="yidu" style="float: right;padding-right: 2%;" onclick="readState(this)"></span>
                    <span name="weidu" style="float: right;padding-right: 2%;" onclick="readState(this)"></span>
                    <span name="fileCount" style="float: right;padding-right: 2%;"></span>
                </div>
                <div class="item_2">
                    <div class="tit" onclick="viewItem(this,null)">
                        <div class="new">新</div>
                        <span name="title"></span>
                        <div class="attachImg"><img src=""></div>
                    </div>
                    <div onclick="viewItem(this,null)" style="display: none;">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span name="content"></span>
                    </div>
                </div>
            </div>
        </div>
        <div id="model_4" style="display: none">
        </div>

        <div id="search_modal" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">文档搜索</span>
                </h3>
            </div>
            <div class="panel-body form-horizontal">
                <div class="row">
                    <div class="col-xs-12">
                        <h4>文档标题：</h4>
                        <div>
                            <div style="float: right">
                                <button onclick="search_submit('isprimary')" type="button"  class="btn btn-default"
                                        style="color: white;background-color: #2dcc70;padding:6px 15px; border: 0;">搜索</button>
                            </div>
                            <div style="margin-right: 70px;">
                                <input name="masterKey" type="text" class="eiis-text"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12" align="right" style="font-size: 14px;padding-top: 5px;color: #2dcc70; ">
                        <span onclick="show_search1()">高级搜索</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="search_modal1" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">按条件搜索</span>
                </h3>
            </div>
            <div class="panel-body form-horizontal">
                <div class="row">
                    <div class="col-xs-12">
                        文档标题<input name="masterKey" type="text" class="eiis-text"/>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        开始时间<input name="startTime" type="text" class="eiis-text" eiis-dateType="yy-MM-dd"/>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        结束时间<input name="endTime" type="text" class="eiis-text" eiis-dateType="yy-MM-dd"/>
                    </div>
                </div>
                <div style="margin: 15px 0;">
                    <button onclick="search_submit('issenior')" type="button" class="btn btn-info"
                            style="font-size: 16px; color: white;background-color: #2dcc70;width: 100%;border: 0;">
                        搜&nbsp;&nbsp;索
                    </button>
                </div>
            </div>
        </div>

        <div id="search_none" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="panel-body form-horizontal"  align="center">
                <div class="row" style="margin-top: 40px;">
                    <div class="col-xs-12">
                        <i class="esg-font icon-weisousuodao" style="font-size: 100px;color:#f71f1f; "></i>
                            <%--<i class="fa fa-plus" style="font-size: 72px;color:#f71f1f; "></i>--%>
                    </div>
                </div>
                <div class="row" style="margin-bottom: 40px;font-size: 16px;">
                    <div class="col-xs-12" style="color: #f71f1f;">
                        未搜索到相关结果
                    </div>
                </div>
                <div style="margin: 15px 0;">
                    <button  type="button" class="btn btn-info" data-dismiss="modal"
                             style="font-size: 16px; color: white;background-color: #2dcc70;width: 100%;border: 0;">
                        关&nbsp;&nbsp;闭
                    </button>
                </div>
            </div>
        </div>
    </master:Content>
</master:ContentPage>

