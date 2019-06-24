<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="util.context.Context" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/31
  Time: 15:09
  To change this template use File | Settings | File Templates.
--%>
<%

    String menuCode = "menstrual_info";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();

    String queryData = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            GoodHelper.Loading(GoodHelper.Common.BootstrapTable);
            GoodHelper.Loading(GoodHelper.Common.BootstrapDateTimepicker);
        </script>

        <link href="/app/menstrualinfo/css_js/index.css" rel="stylesheet"/>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <div class="row">
            <div class="col-md-12">
                <!--表格-->
                <div id="datetimepicker"></div>
            </div>
        </div>

        <script type="text/javascript">
            var queryData = "<%=queryData%>";

        </script>

        <script src="/app/menstrualinfo/css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
