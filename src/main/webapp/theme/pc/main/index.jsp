<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
    <div class="panel-group main-left-div" id="accordion">
        <ul>
            <li><a class="list-group-item "><h4 class="list-group-item-heading">个人中心</h4></a></li>
            <li><a class="list-group-item "><h4 class="list-group-item-heading">我的笔记</h4></a></li>
            <li><a class="list-group-item "><h4 class="list-group-item-heading">消费记录</h4></a></li>
            <li>
                <!--这个类中加一个active表示选中-->
                <a class="list-group-item " data-toggle="collapse" data-parent="#accordion" href="#collapseOne"><h4 class="list-group-item-heading">系统管理</h4></a>
            </li>
            <!--这个类中加一个in表示初始展开-->
            <li  id="collapseOne" class="list-group panel-collapse collapse">
                <a href="#" class="list-group-item">
                    <h4 class="list-group-item-heading">菜单管理</h4>
                </a>
                <a href="#" class="list-group-item">
                    <h4 class="list-group-item-heading">用户管理</h4>
                </a>
                <a href="#" class="list-group-item">
                    <h4 class="list-group-item-heading">图标管理</h4>
                </a>
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

</body>

</html>
