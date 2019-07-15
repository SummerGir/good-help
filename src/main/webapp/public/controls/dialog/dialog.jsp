<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
    String random = request.getParameter("random");
    String source = request.getParameter("source");
    String selectorId = "eiis-selectorDicInfoModal" + random;
    String selectorOkBtn = "eiis-selectorDicInfoOKBtn" + random;
    String md = "9"; //表格的宽，有数据源的时候没有树形，宽为12
%>
<style type="text/css">
    #<%=selectorId%>-tree .fa-folder-open{
        color: #ec971f;
    }
    #<%=selectorId%>-tree .fa-folder-open-o{
        color: #ec971f;
    }
    #<%=selectorId%>-tree .fa-bookmark{
        color: #31b0d5;
    }
    #<%=selectorId%>-tree .fa-bookmark-o{
        color: #31b0d5;
    }
    #<%=selectorId%>-tree .fa-star{
        color: #449d44;
    }
    #<%=selectorId%>-tree .exclude-node>.fancytree-title{
        color: #5cb85c;
    }
    #<%=selectorId%>-tree .fa-info-circle{
        color: #5cb85c;
        margin-left:2em;
    }

    <%=selectorId%>_table th{
        text-align: center;
        font-size: 14px;
    }
    .<%=selectorId%>_firstTr th{
        border-bottom-width: 0px !important;
    }
    #<%=selectorId%>-body{
        overflow-y:auto !important;
    }
</style>
<style>
    .container .modal-footer{text-align: left;}
    .tagsinput .tags{padding-right: 58px;}
    tr.checked{background: #e0e0e0;}
    .dialog_tab td{padding: 8px;border: 1px solid #919191;}

    @media (min-width: 768px) {
        .form-control {
            display: inline-block;
            /*width: auto;*/
            vertical-align: middle;
        }
    }
</style>
<div class="modal container fade" id="<%=selectorId%>" tabindex="-1"
     role="dialog" aria-hidden="true" data-backdrop="static" data-width="90%" data-height="450px"  style="margin-bottom:0px;overflow: visible;">
    <div class="modal-header" id="<%=selectorId%>-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" style="display: inline">字典选择器 </h4>
        <div style="text-align: right;">
        </div>
    </div>

    <div class="modal-footer my-footer" id="<%=selectorId%>-footer" style="position: relative;">
        <div id="<%=selectorId%>-wrap">
            <div id="<%=selectorId%>-selector"/>
        </div>
        <div style="text-align: right;position: absolute;right: 15px;top: 6px;">
            <button type="button" style="margin-top: 8px;padding: 6px 15px;" class="btn btn-primary btn-sm modalOk" id="<%=selectorOkBtn%>">确 定</button>
        </div>
    </div>
    <div class="modal-footer my-footer" style="padding:0 15px;border-top:none;">
        <div class="table-custom-ribbon"></div>
    </div>
    <div class="modal-body" id="<%=selectorId%>-body">
        <div class="row">
            <div class="col-xs-12 col-md-12" id="<%=selectorId%>_table">
                <table class="dialog_tab" style="width: 100%;"></table>
            </div>
            <div class="col-xs-12" style="margin-top: 10px;">
                <div class="col-sm-3 col-xs-12">
                    <div class="table-info">
                        <span>第<span class="page_no">1</span>页</span>
                    </div>
                </div>
                <div class="col-sm-9 col-xs-12">
                    <ul class="pagination table-pagination pull-right">
                        <li class="table-page-prev"><a href="#this">上页</a></li>
                        <li class="table-page-next"><a href="#this">下页</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>