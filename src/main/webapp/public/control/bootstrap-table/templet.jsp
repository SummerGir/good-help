<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    boolean isPage = Boolean.parseBoolean(request.getParameter("isPage"));
%>
<link href="/public/control/bootstrap-table/css/table.css" rel="stylesheet">
<div class="panel panel-default">
    <div class="panel-body table-panel-body" style="padding: 0px;">
        <div class="form-inline">
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" style="margin-bottom: 10px;">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            <%if(isPage){%>
            <div class="table-footer">
                <div class="my-table-left table-toolbar" style="min-height: 31px;line-height: 31px;padding: 0px 5px;">
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
                </div>
                <div class="my-table-center" style="min-height: 31px;line-height: 31px;padding: 0px 5px;">
                    <div class="table-info"></div>
                </div>
                <div class="my-table-right" style="padding: 0px 5px;">
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
