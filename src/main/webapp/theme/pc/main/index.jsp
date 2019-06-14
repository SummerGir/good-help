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

    <link href="/theme/pc/main/css/index.css" rel="stylesheet">
    <!---->
    <!--jquery-->
    <!--bootstrap-->
    <!--bootstrap datetimepicker-->

    <style type="text/css">
        .form-control:focus{
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 14px rgba(233,0,0, .9);!important;
        }
    </style>
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
        <div class="web-top-center" id="accordion"></div>
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
    <div class="main-center"><master:ContentPlaceHolder id="body"/></div>

</div>
<script type="text/javascript">
    var menuTreeId = "<%=menuTreeId%>";
    $(function(){
        createLeftItem();
        //左侧导航栏点击事件
        selectMenu();
    });
    //创建左侧导航栏
    function createLeftItem(){
        var isC = true;
        var maxW = 992;
        var t_w = $(".web-top-center").width();
        var jg = t_w >= maxW ? 120 : 90;
        var maxN = parseInt(t_w / jg) - 1;

        var menuList = <%=arr%>;
        $(".web-top-center").empty();
        for(var i = 0;i < menuList.length;i++){
            var obj = menuList[i];

            //是否存在上级菜单
            var parentLevel = obj.outlineLevel.substring(0,obj.outlineLevel.lastIndexOf("."));
            var thisN = obj.outlineLevel.split("\.")[0];

            if(parentLevel == ""){
                parentLevel = "accordion";
            }

            var str = '';
            if(thisN <= maxN){
                if(obj.type){//是应用
                    str +='<div class="'+ (parentLevel == "accordion" ? "menu-item":"menu-item2") +'" id="item_'+ obj.menuId +'" onClick="click_item(\''+ (obj.url==""?"#":obj.url) +'\',\''+ obj.menuId +'\')">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '</div>';
                }else{
                    str +='<div class="menu-item dropdown" id="item_'+ obj.menuId +'">';
                    str += '<div id="item_'+ obj.menuId +'" class="dropdown-toggle" data-toggle="dropdown">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '<b class="caret"></b>';
                    str += '</div>';
                    str += '<ul class="dropdown-menu" id="'+ obj.outlineLevel +'"></ul>';
                    str += '</div>';
                }
            }else{
                parentLevel = "other";
                if(obj.type){//是应用
                    str +='<div class="menu-item2" id="item_'+ obj.menuId +'" onClick="click_item(\''+ (obj.url==""?"#":obj.url) +'\',\''+ obj.menuId +'\')">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '</div>';
                }
            }
            $("#"+parentLevel).append(str);


            str = '';
            if(thisN == maxN && menuList.length > maxN && isC){
                str +='<div class="menu-item dropdown" id="item_other">';
                str += '<div class="dropdown-toggle" data-toggle="dropdown">';
                str += '<i class="icon esg-font icon-gerenyingyon"></i>更多<b class="caret"></b>';
                str += '</div>';
                str += '<ul class="dropdown-menu" id="other"></ul>';
                str += '</div>';
                $("#accordion").append(str);
                isC = false;
            }
        }

        if($("#other>div").length < 1)
            $("#item_other").remove();
    }

    function selectMenu(){
        var mId = menuTreeId;
        if(mId != ""){
            $("#item_"+mId).addClass("list-group-item-click2");

            if($("#item_"+mId).parents(".menu-item").length > 0){
                $("#item_"+mId).parents(".menu-item").addClass("list-group-item-click");
            }
        }
    }

    function click_item(url,menuId){
        $.post("/core/menuTree/setMenuTree.do",{menuId:menuId},function(){
            window.location.href=url;
        },"json");
    }

    function clone_my_nav(clas){
        var h = $("."+clas).clone();
        $("."+clas).remove();
        $(".main-center-nav").empty().append(h);
    }
</script>
</body>

</html>
