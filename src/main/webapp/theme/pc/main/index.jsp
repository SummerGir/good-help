<%@ page import="java.util.Map" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.core.menuTree.service.CoreMenuTreeService" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    JSONArray arr = new JSONArray();
    List<Map<String,Object>> list = CoreMenuTreeService.getInstance().getMainInfo();
    if(list != null && list.size() > 0){
        arr = JSONArray.fromObject(list);
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
    <link href="/public/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="/theme/pc/main/css/index.css" rel="stylesheet">
    <!---->
    <script type="text/javascript" src="/public/control/util/eiis.foundation.js"></script>
    <!--jquery-->
    <script type="text/javascript" src="/public/jquery/jquery.js"></script>
    <!--bootstrap-->
    <script type="text/javascript" src="/public/bootstrap/js/bootstrap.js"></script>
    <!--bootstrap datetimepicker-->
    <script type="text/javascript" src="/public/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
    <script type="text/javascript" src="/public/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
    <link href="/public/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet">


    <!--提示框-->
    <script type="text/javascript" src="/public/control/message/message.js"></script>
    <!--子页面head中的内容-->
    <master:ContentPlaceHolder id="head"/>

</head>
<body>

<!-- 顶部导航栏 开始 -->
<nav class="navbar navbar-default navbar-fixed-top main-top-nav" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" style="padding-top: 15px;" href="/theme/pc/index.jsp">&nbsp;&nbsp;&nbsp;&nbsp;好&nbsp;&nbsp;&nbsp;&nbsp;管&nbsp;&nbsp;&nbsp;&nbsp;家</a>
        </div>
        <div>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <span class="glyphicon glyphicon-user"></span><%=Context.getMember()==null?"登录":Context.getMember().getMemberName().toString()%>
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
                    <span class="list-group-item-icon"></span>
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
        <%--<nav class="navbar navbar-default main-center2-nav" role="navigation">--%>
            <%--<div class="container-fluid">--%>
                <%--<div class="navbar-header">--%>
                    <%--<span style="font-size: 15px;margin-right: 5px;" class="<%=(menuTree.getIcon()==null || StringUtils.isBlank(menuTree.getIcon().toString()))?"glyphicon glyphicon-file":menuTree.getIcon()%>"></span>--%>
                    <%--<span style="font-size: 16px;font-weight: bold;color: #000 ;line-height: 45px;">--%>
                        <%--<%=menuTree.getTitle() == null ? "" : menuTree.getTitle()%>--%>
                    <%--</span>--%>
                <%--</div>--%>
                <%--<div class="navbar-header  navbar-right">--%>
                    <%--<ol class="breadcrumb">--%>
                        <%--&lt;%&ndash;<li class="active">用户管理</li>&ndash;%&gt;--%>
                    <%--</ol>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</nav>--%>
        <!--子页面中的正文-->
        <div class="col-md-12 main-right-div-content"><master:ContentPlaceHolder id="body"/></div>

    </div>
</div>
<script type="text/javascript">
    var menuTreeId = "<%=menuTreeId%>";
    $(function(){
        createLeftItem();
        //左侧导航栏点击事件
        $("#accordion a").on("click",function(){

            var clas1 = "list-group-item2-click";
            var clas2 = "my-in";
            var clas3 = "list-group-item-click";
            //是否选中过
            var has = $(this).hasClass(clas1);
            var parentId = "#"+$(this).parent().parent().attr("id");
            $(this).parents(parentId).children().each(function(){
                $(this).children().first().removeClass(clas1);
                $(this).children().first().removeClass(clas3);
            });
            //
            $(this).parents(parentId).find("ul").each(function(i,o){
                var a = $(this).hasClass(clas2);
                if(a){
                    $(this).removeClass(clas2);
                    $(this).slideUp(400);
                }
            });
            //点击展开
            if(!has){
                //有下级菜单
                if($(this).hasClass("sub")){
                    $(this).addClass(clas1);
                    $(this).next().addClass(clas2);
                    $(this).next().slideDown(400);
                }else{//无下级菜单
                    //第一级菜单
                    if("accordion" == $(this).parent().parent().attr("id")){
                        $(this).addClass(clas1);
                    }else{
                        $(this).addClass(clas3);
                    }
                }
            }
        });
        selectMenu();
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

                row.find(".list-group-item-icon").addClass(obj.icon?obj.icon:"glyphicon glyphicon-file");
                row.find("a").attr("id","item_"+obj.menuId);
                row.find("a").attr("href","#");
                row.find("a").attr("onClick","click_item('"+(obj.url==""?"#":obj.url)+"','"+obj.menuId+"')");
                row.find(".pull-right").remove();
                row.find("ul").remove();
            }else{
                row.find(".list-group-item-icon").addClass(obj.icon?obj.icon:"glyphicon glyphicon-folder-open");
                row.find("a").attr("id","item_"+obj.menuId);
                row.find("a").addClass("sub");
                row.find("a").attr("href","#");
                row.find("ul").attr("id",obj.outlineLevel);
            }
            $("#"+parentLevel).append(row);
        }
    }
    function selectMenu(){
        var mId = menuTreeId;
        if(mId != ""){
            $("#item_"+mId).addClass("list-group-item-click");
            var parent = $("#item_"+mId).parent().parent();
            var i = 0;
            while ("accordion" != $(parent).attr("id") && "" != $(parent).attr("id")){
                var p = $(parent).prev();
//                $(p).addClass("list-group-item-click");
                $(p).trigger("click");
                mId = $(p).attr("id");
                parent = $("#"+mId).parent().parent();
                i++;
                if(i > 5){
                    break;
                }
            }
        }
    }
    function click_item(url,menuId){
        $.post("/core/menuTree/setMenuTree.do",{menuId:menuId},function(){
            window.location.href=url;
        },"json");
    }
</script>
</body>

</html>
