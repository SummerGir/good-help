<%@ page import="eiis.context.Context" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    .fontawesome-icon-list .fa-hover:hover{
        background-color: #1d9d74;
        color: #fff;
        text-decoration: none;
        font-size: 18px;
    }

    .fontawesome-icon-list .activated {
        background-color: #1d9d74;
        color: #fff;
        text-decoration: none;
    }

    .fontawesome-icon-list .fa-hover {
        font-size: 14px;
        display: block;
        color: #222;
        line-height: 32px;
        height: 32px;
        padding-left: 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    .fontawesome-icon-list  i{
        width: 12px;
        height: 12px;
        display: inline-block;
    }
</style>
<%
    String random = request.getParameter("random");
%>
<script type="text/javascript">
    $(document).ready(function () {
        $(".fa-hover").click(function () {
            $("#eiis-selectorIconColorModal<%=random%> .fa-hover.activated").removeClass("activated");
            $(this).addClass("activated");
        });
    });
</script>
<%if(Context.getCurrent().isPhone()){%>
<div class="modal fade" id="eiis-selectorIconColorModal<%=random%>" tabindex="-1" role="dialog"
     aria-hidden="true" data-backdrop="static" >
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">图标颜色选择器</h4>
    </div>
    <div class="modal-body" style="overflow-y: auto;margin-bottom: 50px;">
        <div class="panel-group" id="icons-accordionColor<%=random%>">

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <div data-toggle="collapse" data-toggle="collapse" data-parent="#icons-accordionColor<%=random%>" href="#icons-medicalColor<%=random%>">
                            图标颜色
                        </div>
                    </h4>
                </div>
                <div id="icons-medicalColor<%=random%>" class="panel-collapse collapse">
                    <div class="panel-body">
                        <div class="row fontawesome-icon-list">

                            <div class="fa-hover col-md-3 col-sm-4"><i class="machine"></i> machine</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="lease"></i> lease</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="document"></i> document</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="work"></i> work</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="fee"></i> fee</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="money"></i> money</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="statement"></i> statement</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="material"></i> material</div>
                            <div class="fa-hover col-md-3 col-sm-4"><i class="labour"></i> labour</div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <nav class="navbar-fixed-bottom" style="background-color: #eee;padding: 15px;">
        <span class="navbar-right">
            <button type="button" class="btn btn-primary modalOk" id="eiis-selectorIconColorOkBtn<%=random%>">确 定</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
        </span>
    </nav>
</div>
<%}else{%>
    <div class="modal fade" id="eiis-selectorIconColorModal<%=random%>" tabindex="-1" role="dialog"
         aria-hidden="true" data-backdrop="static" data-width="80%" data-height="400px">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">图标颜色选择器</h4>
        </div>
        <div class="modal-body" style="overflow-y: auto;">
            <div class="panel-group" id="icons-accordionColor<%=random%>">

                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <div data-toggle="collapse" data-toggle="collapse" data-parent="#icons-accordionColor<%=random%>" href="#icons-medicalColor<%=random%>">
                                图标颜色
                            </div>
                        </h4>
                    </div>
                    <div id="icons-medicalColor<%=random%>" class="panel-collapse collapse in">
                        <div class="panel-body">
                            <div class="row fontawesome-icon-list">

                                <div class="fa-hover col-md-3 col-sm-4"><i class="machine"></i> machine</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="lease"></i> lease</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="document"></i> document</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="work"></i> work</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="fee"></i> fee</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="money"></i> money</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="statement"></i> statement</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="material"></i> material</div>
                                <div class="fa-hover col-md-3 col-sm-4"><i class="labour"></i> labour</div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary modalOk" id="eiis-selectorIconColorOkBtn<%=random%>">确 定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>

        </div>
    </div>
<%}%>



