<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String random = request.getParameter("random");
    String multiple = request.getParameter("multiple");
    String selectorId = "eiis-selectorMemberModal" + random;
    String selectorOkBtn = "eiis-selectorMemberOKBtn" + random;
%>
<style type="text/css">
    #<%=selectorId%>-tree .fa-users{
        color: #449d44;
    }
    #<%=selectorId%>-tree .fa-reddit-square{
        color: #ec971f;
    }
    #<%=selectorId%>-tree .fa-user{
        color: #31b0d5;
    }
    .person-dialog .my-footer{
        /*position:fixed;*/
        /*position:static;*/
        bottom: 0px;
        /*left:50%;*/
        /*left:0px;*/
        /*right:0px;*/
        /*top: 0px;*/
        text-align:left;
        z-index: 99999;
        width: 398px;
        background-color: #f8f8f8;
        background: -webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#f2f2f2));
        background: -webkit-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -moz-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -ms-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -o-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: linear-gradient(top, #f8f8f8, #f2f2f2);
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        /*text-shadow: 0px 1px #fff;*/
        border-bottom: 1px solid #fff;
        border-top: 1px solid #ccc;
        box-shadow: inset 0px 1px 1px #fff;
        padding-bottom: 10px;
    }

    .person-dialog .my-footer {
        text-align: left;
    }

    /*@media all and (max-width:979px){*/
        /*.person-dialog .my-footer, .person-dialog .my-footer{*/
            /*position: fixed;*/
            /*right: 20%;*/
            /*left: 19%;*/
            /*width: 60% !important;*/
        /*}*/
        /*.person-dialog .my-footer>div{*/
            /*padding-right:9px*/
        /*}*/
    /*}*/

    /*@media all and (max-width:480px){*/
        /*.person-dialog .my-footer, .person-dialog .my-footer{*/
            /*position: fixed;*/
            /*right: 1%;*/
            /*left: 1%;*/
            /*width: auto !important;*/
        /*}*/
        /*.person-dialog .my-footer>div{*/
            /*padding-right:15px*/
        /*}*/
    /*}*/

</style>
<script type="text/javascript">
//    $(document).ready(function () {
    (function () {
        <%--var height = window.screen.availHeight - $("#<%=selectorId%>-header").outerHeight(true) - $("#<%=selectorId%>-footer").outerHeight(true);--%>
        var height = window.screen.availHeight - 310;
        if (EIIS.browser.phone) {
            //解决苹果输入框与选择框距离太宽bug
            $("#<%=selectorId%>-footer").css({"position": "static"});
        } else {
            $("#<%=selectorId%>-body").css("height", height - 46 + "px");
        }
        <%--$("#<%=selectorId%>-body").css("padding-bottom", $("#<%=selectorId%>-footer").outerHeight(true) + 200 + "px");--%>
    })()
//    })
</script>
<div class="person-dialog modal container fade" id="<%=selectorId%>" tabindex="-1"
     role="dialog" aria-hidden="true" data-backdrop="static" data-width="400px">
    <div class="modal-header" id="<%=selectorId%>-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">成员选择器</h4>

        <div style="text-align: right;">
        </div>
    </div>
    <div class="modal-body" id="<%=selectorId%>-body">
        <div class="row" style="height: 100%;overflow-y: auto;">
            <div class="col-xs-12 col-md-12">
                <div id="<%=selectorId%>-tree" style="width:99%;overflow-y: auto;">成员树</div>
            </div>
        </div>
    </div>
    <div class="modal-footer my-footer" id="<%=selectorId%>-footer">
        <div id="<%=selectorId%>-wrap">
            <%--<div id="<%=selectorId%>-selector"/>--%>
            <input id="<%=selectorId%>-selector"/>
        </div><br/><br/>
        <div style="text-align: right;">
            <button type="button" class="btn btn-primary modalOk" id="<%=selectorOkBtn%>">确 定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
        </div>
    </div>
</div>