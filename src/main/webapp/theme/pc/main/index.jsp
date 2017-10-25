<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.core.menuTree.service.CoreMenuTreeService" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    List<Map<String,Object>> list = CoreMenuTreeService.getInstance().getMainInfo();
    JSONArray arr = JSONArray.fromObject(list);
%>
<html>
<head>
    <!--子页面标题内容-->
    <title>
        <master:ContentPlaceHolder id="title"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/public/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="/theme/pc/main/css/index.css" rel="stylesheet">
    <script type="text/javascript" src="/public/jquery/jquery.js"></script>
    <script type="text/javascript" src="/public/bootstrap/js/bootstrap.min.js"></script>
    <!--子页面head中的内容-->
    <master:ContentPlaceHolder id="head"/>

</head>
<body>

<!-- 顶部导航栏 开始 -->
<nav class="navbar navbar-inverse navbar-fixed-top main-top-nav" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">好管家</a>
        </div>
        <div>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <span class="glyphicon glyphicon-user"></span>张三
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
    <!-- 左侧导航栏 开始 -->
    <div class="panel-group main-left-div">
        <ul id="accordion">
            <%--<li>--%>
                <%--<!--这个类中加一个active表示选中-->--%>
                <%--<a class="list-group-item" href="#collapseOne">--%>
                    <%--<span class="list-group-item-heading">系统管理</span>--%>
                <%--</a>--%>
            <%--</li>--%>
            <%--<li>--%>
                <%--<!--这个类中加一个active表示选中-->--%>
                <%--<a class="list-group-item" data-toggle="collapse" href="#1">--%>
                    <%--<span class="list-group-item-heading">系统管理</span>--%>
                    <%--<span class="pull-right">--%>
                        <%--<i class="glyphicon glyphicon-chevron-right"></i>--%>
                    <%--</span>--%>
                <%--</a>--%>
                <%--<!--这个类中加一个in表示初始展开-->--%>
                <%--<ul id="1" class="list-group panel-collapse collapse">--%>
                        <%--<li>--%>
                            <%--<!--这个类中加一个active表示选中-->--%>
                            <%--<a class="list-group-item" href="#collapseOne">--%>
                                <%--<span class="list-group-item-heading">系统管理</span>--%>
                            <%--</a>--%>
                        <%--</li>--%>
                <%--</ul>--%>
            <%--</li>--%>
        </ul>

    </div>
    <!-- 左侧导航栏 模版 -->
    <div name="menuTree_mode" style="display: none;">
        <ul>
            <li>
                <a href="#collapseOne">
                    <span class="list-group-item-heading">系统管理</span>
                    <span class="pull-right">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </span>
                </a>
                <ul id="collapseOne"  style="display: none;"></ul>
            </li>
        </ul>
    </div>
    <!-- 左侧导航栏 完成 -->

    <!-- 右侧导航栏 开始 -->
    <div class="main-right-div">
        <nav class="navbar navbar-default main-center2-nav" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <ol class="breadcrumb">
                        <li><a href="#">系统管理</a></li>
                        <li class="active">用户管理</li>
                    </ol>
                </div>
                <div class="navbar-header  navbar-right">
                    <ol class="breadcrumb">
                        <li class="active">用户管理</li>
                    </ol>
                </div>
            </div>
        </nav>
        <!--子页面中的正文-->
        <div class="col-md-12 main-right-div-content"><master:ContentPlaceHolder id="body"/></div>

    </div>
</div>
<script type="text/javascript">
    $(function(){
        createLeftItem();
        //左侧导航栏点击事件
        $("#accordion a").on("click",function(){
            var clas1 = "list-group-item-click";
            var clas2 = "my-in";
            //是否选中过
            var has = $(this).hasClass(clas1);
            var parentId = "#"+$(this).parent().parent().attr("id");
            $(this).parents(parentId).find("a").removeClass(clas1);
            $(this).parents(parentId).find("ul").each(function(i,o){
                var a = $(this).hasClass(clas2);
                if(a){
                    $(this).removeClass(clas2);
                    $(this).slideUp(400);
                }
            });
            //点击展开
            if(!has){
                $(this).addClass(clas1);
                if($(this).hasClass("sub")){
                    $(this).next().addClass(clas2);
                    $(this).next().slideDown(400);
                }
            }
        });
    });
    //创建左侧导航栏
    function createLeftItem(){
        var menuList = <%=arr%>;
        var myMode = $("div[name='menuTree_mode']>ul").children().clone();
        $("#accordion").empty();

        for(var i = 0;i < menuList.length;i++){
            var obj = menuList[i];
            var row = $(myMode.clone());
            //是否存在上级菜单
            var parentLevel = obj.outlineLevel.substring(0,obj.outlineLevel.lastIndexOf("."));
            if(parentLevel == ""){
                parentLevel = "accordion";
            }

            row.find(".list-group-item-heading").html(obj.title);
            if(obj.type){//是应用
//                row.find("a").attr("data-toggle","");

                row.find("a").attr("href",obj.url==""?"#":obj.url);
                row.find(".pull-right").remove();
                row.find("ul").remove();
            }else{
                row.find("a").addClass("sub");
                row.find("a").attr("href","#");
                row.find("ul").attr("id",obj.outlineLevel);
            }
            $("#"+parentLevel).append(row);
        }


    }
</script>
</body>

</html>
