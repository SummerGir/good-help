<%@ page import="com.google.common.base.Strings" %>
<%@ page import="eiis.util.ui.table.TableParam" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    TableParam tableParam = (TableParam) request.getAttribute(TableParam.ATTRIBUTE_NAME);
%>
<div class="panel panel-default" id="<%=tableParam.getClientId()%>">
    <% if(!Strings.isNullOrEmpty(tableParam.getCaption())){ %>
    <div class="panel-heading">
        <div class="row">
            <div class="col-xs-6 table-panel-caption">
                <%
                    if (!Strings.isNullOrEmpty(tableParam.getIcon())) {
                %><i class="<%=tableParam.getIcon()%>"></i> <%
                }%>
                <%=tableParam.getCaption()%>
            </div>
            <div class="col-xs-6">
                <div class="pull-right table-panel-ribbon"></div>
            </div>
        </div>
    </div>
    <%} %>
    <div class="panel-body table-panel-body" style="padding: 0px;">
        <div class="form-inline">
            <div class="row table-toolbar" style="margin: 0px;padding: 5px 0px 4px 0px;background-color: #f5f5f5;">
                <div class="col-xs-12" style="padding: 0px 5px;">
                    <div class="pull-left">
                        <select class="eiis-combobox input-sm table-page-size">
                            <option value="5">显示5项</option>
                            <option value="10">显示10项</option>
                            <option value="25" selected="selected">显示25项</option>
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
                    <%=tableParam.getBodyContent()%>
                </table>
            </div>
            <% if(tableParam.getPageSize() > -1){ %>
            <div class="row" style="margin: 0px 0px 10px 0px;">
                <div class="col-sm-3 col-xs-12" style="min-height: 31px;line-height: 31px;padding: 0px 5px;">
                    <div class="table-info"></div>
                </div>
                <div class="col-sm-9 col-xs-12" style="padding: 0px 5px;">
                    <ul class="pagination table-pagination pull-right">
                        <li class="table-page-first hidden-xs"><a href="#this" data-page-number="1">首页</a></li>
                        <li class="table-page-prev "><a href="#this">上页</a></li>
                        <li class="table-page-next"><a href="#this">下页</a></li>
                        <li class="table-page-last hidden-xs"><a href="#this">尾页</a></li>
                        <li><input type="text" class="eiis-text table-page-zhiding" style="text-align: center;width:45px;padding: 6px;height: 30px;line-height: 18px;"  placeholder="指定"/></li>
                    </ul>

                </div>
            </div>
            <%} %>
        </div>
    </div>
</div>
<div class="menu-top menu" style="overflow: hidden;z-index: 110013; display: none;">
    <div class="menu-line"></div>
</div>
<script type="text/javascript">
    EIIS.Common.loadCss("/public/jquery-easyui/themes/icon.css");
    EIIS.Common.loadCss("/public/jquery-easyui/themes/default/menu.css");
    EIIS.Common.loadCss("/public/jquery-easyui/themes/default/menubutton.css");
    EIIS.Common.loadComponent(EIIS.Common.bootstrap.table);
</script>
<script type="text/javascript">
    $(window).on("load", function () {
        $("#<%=tableParam.getClientId()%>").table(<%=TableParam.mapper.writeValueAsString(tableParam)%>);
    });
</script>
