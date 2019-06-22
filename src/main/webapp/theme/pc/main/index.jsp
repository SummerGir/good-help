<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.core.menuTree.service.CoreMenuTreeService" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    JSONArray arr = new JSONArray();
    List<Map<String,Object>> list = CoreMenuTreeService.getInstance().getMainInfo(null,"1");
    List<Map<String,Object>> list1 = CoreMenuTreeService.getInstance().getMenuTree(list);

    if(list1 != null && list1.size() > 0){
        list1 = (List<Map<String,Object>>) list1.get(0).get("children");
    }

    if(list1 != null && list1.size() > 0){

        arr = JSONArray.fromObject(list1);
    }

    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(null);
    String menuTreeId = menuTree == null?"":menuTree.getMenuId();//选中的菜单

%>
<html>
<head>
    <!--子页面标题内容-->
    <title>
        <master:ContentPlaceHolder id="title"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 设置浏览器窗口图标 -->
    <link rel="shortcut icon"type="image/x-icon" href="/theme/pc/main/img/logoIco.ico"media="screen" />
    <script type="text/javascript" src="/public/jquery/jquery.js"></script>
    <script type="text/javascript" src="/public/control/resourcesload/goodhelper.js"></script>

    <script type="text/javascript">
        $(function(){
            GoodHelper.Loading(GoodHelper.Common.Util);
            GoodHelper.Loading(GoodHelper.Common.FontIcon);
            GoodHelper.Loading(GoodHelper.Common.Bootstrap);
        })
    </script>
    <link href="/theme/pc/main/css_js/index.css" rel="stylesheet">
    <!--子页面head中的内容-->
    <master:ContentPlaceHolder id="head"/>
</head>
<body>

<!-- 顶部导航栏 开始 -->
<nav class="navbar navbar-default navbar-fixed-top main-top-nav" role="navigation">
    <div class="web-top">
        <div class="web-top-left">
            <a class="navbar-brand" style="padding: 0px;" href="/theme/pc/index.jsp">
                <img src="/theme/pc/main/img/pcLogo2.png" style="width: 90px" alt="好管家">
            </a>
        </div>
        <div class="web-top-center" id="1"></div>
        <div class="web-top-right">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="font-size: 16px;">
                        <span class="esg-font icon-gangwei"></span><%=Context.getMember()==null?"登录":Context.getMember().getMemberName().toString()%>
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="#">我的信息</a></li>
                        <li><a href="#">退出</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!-- 顶部导航栏 完成 -->

<div class="main-center-div">
    <div class="main-center-nav"></div>
    <div class="main-center" style="margin-top: 15px;">
        <master:ContentPlaceHolder id="body"/>
    </div>

</div>
<script type="text/javascript">
    var menuTreeId = "<%=menuTreeId%>";
    var menuList = <%=arr%>;
</script>
<script type="text/javascript" src="/theme/pc/main/css_js/index.js"></script>
</body>

</html>
