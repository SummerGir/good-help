<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    boolean haveHead = Boolean.parseBoolean(request.getParameter("haveHead"));
    boolean isPage = Boolean.parseBoolean(request.getParameter("isPage"));
%>
<link href="/public/control/bootstrap-table/css/table.css" rel="stylesheet">
<div class="panel panel-default">
    <%if(haveHead){%>
    <div class="panel-heading">
        <div class="row">
            <div class="col-xs-6 table-panel-caption"></div>
            <div class="col-xs-6">
                <div class="pull-right table-panel-ribbon"></div>
            </div>
        </div>
    </div>
    <%}%>

    <div class="panel-body table-panel-body" style="padding: 0px;">
        <div class="form-inline">
            <div class="row table-toolbar" style="margin: 0px;padding: 5px 0px 4px 0px;background-color: #f5f5f5;">
                <div class="col-xs-12" style="padding: 0px 5px;">
                    <div class="pull-left my-table-left-select">
                        <select class="eiis-combobox input-sm table-page-size">
                            <option value="5">显示5项</option>
                            <option value="10" selected="selected">显示10项</option>
                            <option value="25">显示25项</option>
                            <option value="50">显示50项</option>
                            <option value="100">显示100项</option>
                            <option value="-1">显示所有</option>
                        </select>
                    </div>
                    <div class="table-custom-ribbon"></div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" style="margin-bottom: 10px;">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            <%if(isPage){%>
            <div class="row table-footer" style="margin: 0px 0px 10px 0px;">
                <div class="col-sm-3 col-xs-12" style="min-height: 31px;line-height: 31px;padding: 0px 5px;">
                    <div class="table-info"></div>
                </div>
                <div class="col-sm-9 col-xs-12" style="padding: 0px 5px;">
                    <ul class="pagination table-pagination pull-right" style="margin: 0px;">
                        <li class="table-page-first hidden-xs"><a href="#this" data-page-number="1">首页</a></li>
                        <li class="table-page-prev "><a href="#this">上页</a></li>
                        <li class="table-page-next"><a href="#this">下页</a></li>
                        <li class="table-page-last hidden-xs"><a href="#this">尾页</a></li>
                        <%--<li><input type="text" class="eiis-text table-page-zhiding" style="text-align: center;width:45px;padding: 6px;height: 30px;line-height: 18px;"  placeholder="指定"/></li>--%>
                    </ul>

                </div>
            </div>
            <%}%>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(window).on("load", function () {

    });
</script>
