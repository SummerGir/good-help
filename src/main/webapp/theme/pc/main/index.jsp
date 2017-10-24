<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.core.menuTree.service.CoreMenuTreeService" %>
<%@ page import="com.google.gson.JsonArray" %>
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

    <style type="text/css">
        .main-top-nav{
            border-radius:0px;
        }
        .main-top-nav .dropdown>a>span{
            margin-right: 5px;
        }
        .main-center-div{
            margin-top: 51px;
        }
        .main-left-div{
            width: 200px;
            float: left;
        }
        .main-left-div ul,.main-left-div li{
            list-style: none;
            list-style-type: none;
            margin: 0px;
            padding: 0px;
        }
        .main-left-div ul,.main-left-div li,.main-left-div a{
            background-color: #f8f8f8;
        }
        .main-left-div .list-group-item{
            border-radius:0px;
            border-top: none;
        }
        .main-right-div{
            margin-left: 200px;
        }
        .main-center2-nav{
            border-radius:0px;
            margin: 0px;
            height: 50px;
        }
        .main-center2-nav ol,main-center2-nav li{
            margin: 0px;
        }
        .main-center2-nav .breadcrumb{
            padding: 13px 0px;
        }
    </style>
    <style type="text/css">
        .main-right-div-content{
            margin-top: 10px;
        }
        .list-group-item-click{
            border-bottom: 1px solid #167cac;
            border-top: 1px solid #2094ca;
            background-color: #0993d3;
            background: -webkit-gradient(linear, left top, left bottom, from(#1aaef3), to(#0993d3));
            background: -webkit-linear-gradient(top, #1aaef3, #0993d3);
            background: -moz-linear-gradient(top, #1aaef3, #0993d3);
            background: -ms-linear-gradient(top, #1aaef3, #0993d3);
            background: -o-linear-gradient(top, #1aaef3, #0993d3);
            background: linear-gradient(top, #1aaef3, #0993d3);
            box-shadow: none;
            color: #fff !important;
            font-weight: bold;
        }
        .list-group-item-click a,.list-group-item-click span{
            color: #fff !important;
        }
    </style>
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
            <li>
                <!--这个类中加一个active表示选中-->
                <a class="list-group-item" href="#collapseOne">
                    <span class="list-group-item-heading">系统管理</span>
                </a>
            </li>
            <li>
                <!--这个类中加一个active表示选中-->
                <a class="list-group-item" data-toggle="collapse" href="#1">
                    <span class="list-group-item-heading">系统管理</span>
                    <span class="pull-right">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </span>
                </a>
                <!--这个类中加一个in表示初始展开-->
                <ul id="1" class="list-group panel-collapse collapse">
                        <li>
                            <!--这个类中加一个active表示选中-->
                            <a class="list-group-item" href="#collapseOne">
                                <span class="list-group-item-heading">系统管理</span>
                            </a>
                        </li>
                </ul>
            </li>
            <li>
                <!--这个类中加一个active表示选中-->
                <a class="list-group-item" data-toggle="collapse" href="#2">
                    <span class="list-group-item-heading">系统管理</span>
                    <span class="pull-right">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </span>
                </a>
                <!--这个类中加一个in表示初始展开-->
                <ul id="2" class="list-group panel-collapse collapse">
                    <li>
                        <!--这个类中加一个active表示选中-->
                        <a class="list-group-item" href="#collapseOne">
                            <span class="list-group-item-heading">系统管理</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>

    </div>
    <div name="menuTree_mode" style="display: none;">
        <ul>
            <li>
                <!--这个类中加一个active表示选中-->
                <a class="list-group-item" data-toggle="collapse" href="#collapseOne">
                    <span class="list-group-item-heading">系统管理</span>
                    <span class="pull-right">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </span>
                </a>
                <!--这个类中加一个in表示初始展开-->
                <div id="collapseOne" class="list-group panel-collapse collapse"></div>
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
//        createItem();
        $("#accordion .sub").on("click",function(){
            var clas = "in";
            var has = $(this).children().hasClass(clas);
            $(this).children().removeClass(clas);
            if(has)
                $(this).children().last().addClass(clas);
        });
        $("#accordion .list-group-item").on("click",function(){
            var clas = "list-group-item-click";
            var has = $(this).hasClass(clas);
            $(this).parent().children().removeClass(clas);
            console.log(has);
            if(!has)
                $(this).addClass(clas);
        });
    });
    function createItem(){
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

            row.find(".list-group-item>.list-group-item-heading").html(obj.title);
            if(obj.type){//是应用
                row.find(".list-group-item").attr("data-toggle","");
                row.find(".list-group-item").attr("href",obj.url);
                row.find(".list-group-item>.pull-right").remove();
                row.find("div").remove();
            }else{
                row.addClass("sub");
                row.find(".list-group-item").attr("href","#"+obj.outlineLevel);
                row.find("div").attr("id",obj.outlineLevel);
            }
            $("#"+parentLevel).append(row);
        }


    }
</script>
</body>

</html>
