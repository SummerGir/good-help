
<%

    String listOp=request.getParameter("listOp");
    String finishedProOp=request.getParameter("finishedProOp");
    String doingProOp=request.getParameter("doingProOp");

%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<style type="text/css">
    #left_div .panel-heading li>a{border-bottom: 1px solid #ddd}
    #left_div .nav-tabs>li.active>a{border-top: 2px solid #F6CA18;border-bottom: none;}
    #types_list{min-height: 126px;}
    #types_list .nav>li>a{padding-left: 20px;text-align: left;}
    #types_list .nav>li>a{
        padding-left: 10px;
        text-align: left;
    }
</style>
<div class="col-md-2" style="padding-right: 0px;">
    <!-- 左边 开始 -->
    <div class="panel panel-default " id="left_div" style="padding-left: 0px;padding-right:0px;">
        <div class="panel-heading" style="background: white;background-color: #f5f5f5;padding:0px;border-bottom: 0">
            <ul class="nav nav-tabs" style="padding-left: 0px;">
                <li role="presentation" class="active" style="width: 50%;">
                    <a href="#doing_type" data-toggle="tab" aria-controls="doing_type" style="padding: 12px 0px;text-align: center;margin-right: 0px;border-left: none;border-top-right-radius: 0px;">有效类型</a>
                </li>
                <li role="presentation" style="width: 50%;">
                    <a href="#finished_type" data-toggle="tab" aria-controls="finished_type" style="padding: 12px 0px;text-align: center;margin-right: 0px;border-right: none;border-top-left-radius: 0px;">失效类型</a>
                </li>
            </ul>
        </div>
        <div class="tab-content" id="types_list">
            <div role="tabpanel" class="tab-pane active" id="doing_type">
                <ul class="nav nav-pills nav-stacked">
                    <%=doingProOp.toString() %>
                </ul>
            </div>
            <div role="tabpanel" class="tab-pane" id="finished_type">
                <ul class="nav nav-pills nav-stacked">
                    <%=finishedProOp.toString() %>
                </ul>
            </div>
        </div>
    </div>
    <!-- 左边 结束-->
</div>
