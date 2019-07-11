<%@ page import="eiis.context.Context" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>

<%
    String materPageId = "_app";
    String mainId=request.getParameter("mainId");
    String yidu=request.getParameter("yidu");
    String weidu=request.getParameter("weidu");
    String pubTime=request.getParameter("pubTime");
    String cur_memberName=Context.getCurrent().getName().toString();
    String cur_memberId= Context.getCurrent().getId().toString();
%>
<master:ContentPage materPageId="<%=materPageId%>">
    <master:Content contentPlaceHolderId="title">阅读情况</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.form);
            EIIS.Common.loadComponent(EIIS.Common.controls.custom);
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.moveload);
        </script>
        <style type="text/css">
            a{
                text-decoration: none;
            }
            #fri_myTab{
                width: 100%;
                background-color: #fff;
                line-height: 40px;
                height: 42px;
                overflow-x: auto;
                border-bottom:1px solid #ddd;
            }
            #fri_myTab a {
                text-decoration:none;
                padding: 0 10px;
                text-align: center;
                line-height: 40px;
                font-size: 16px;
                font-weight: 100;
                display: inline-block;
                float: left;
                width: 50%;
                color: #0d0d0d;
            }
            #fri_myTab>a.active {
                font-weight: 400;
                color: #fe3600;
                font-size: 16px;
                border-bottom:1px #fe3600 solid;
            }
            /*.swiper-container{ height:100%;width:100%;padding-top: 50px;}*/
            /*.swiper-slide{height:100% !important;width:100%;position: relative;}*/
            /*.swiper-wrapper{height: 100% !important;}*/

            .sort_list{
                padding:13px 60px 19px 60px;
                position: relative;
                height: 68px;
                line-height: 68px;
                border-bottom:1px solid #ddd;
            }

            .sort_list .num_logo{
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 40px;
                overflow: hidden;
                /*position: absolute;*/
                top: 15px;
                left: 13.5px;
                color: white;
            }
            .sort_list .num_logo img{
                width: 40px;
                height: 40px;
            }
            .sort_list .num_name,.sort_list .num_name2{
                color: #000;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                /*--------------todo-------------*/
                line-height: 1.3;
                padding-left: .2em;
            }

            .sort_list .num_name2{
                color: #c6c6c6;
                font-size: 12px;
            }
            .py_div{
                width: 100%;
                /*position: absolute;*/
                left: 0;
                margin-top: 2px;
            }
            .sort_list{
                padding:0 auto;
                width: 100%;
                position: relative;
                height: 68px;
                line-height: 68px;
                border-bottom:1px solid #ddd;
            }

            .sort_list .num_logo{
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 40px;
                overflow: hidden;
                position: absolute;
                top: 15px;
                left: 13.5px;
                color: white;
            }
            .sort_list .num_logo img{
                width: 40px;
                height: 40px;
            }
            .sort_list .num_name,.sort_list .num_name2{
                color: #000;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                /*--------------todo-------------*/
                line-height: 1.3;
                padding-left: .2em;
            }
            .sort_list .num_name2{
                color: #c6c6c6;
                font-size: 12px;
            }
            .sort_box{
                width: 100%;
                float: left;
                position: relative;
            }
            .sort_box .sort_list .num_name{font-size: 17px;}
            .sort_box .sort_list .num_name .up-right{color: #656565;font-size: 15px;}
            .sort_box .sort_list .num_name2{color: #929292;font-size: 13px;padding-top: 5px;}
            .sort_box .sort_list .check_img{width: 32px;height: 32px;position: absolute;top: 9px;right: 25px;border: 1px solid #c6c6c6;}

            .type4{background-color:#2dcc70;}
            .time{
                height: 30px;
                line-height: 30px;
                font-size: 15px;
                color: #0d0d0d;
                float: right;
                right:20px;
                position: absolute;
            }
            #wrapper{
                width: 100%;
                overflow-x: hidden;
                overflow-y: auto;
                -webkit-overflow-scrolling:touch;
                margin-top: 5px;
            }
        </style>

        <script type="text/javascript">
            $(document).ready(function () {
                $("#friend_nav").parent().addClass("active");
                $("#friend_nav").unbind();
            });
        </script>
        <meta name="format-detection" content="telephone=no"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="stylesheet" href="/public/controls/preview/css/imgPreview_inOtherPage.css" type="text/css"/>
        <script src="/public/controls/preview/js/imgPreview.js"></script>
        <script src="/public/controls/preview/filePrint.js"></script>
        <style type="text/css">
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="wrap">
            <div class="tabs" id="fri_myTab">
                <a id="inner_nav" href="#" hidefocus="true" class="active"></a>
                <a id="outer_nav" href="#" hidefocus="true"></a>
            </div>
            <div id="wrapper">
                <div>
                    <div id="pullUp">下拉刷新...</div>
                        <%--人员列表--%>
                    <div id="list_div" class="py_div"
                         style="-webkit-overflow-scrolling:touch;overflow-y: auto;overflow-x: hidden">

                    </div>
                    <div id="pullDown"></div>
                </div>
            </div>
        </div>
        <div id="person" style="display: none;">
            <div class="sort_box">
                <div class="sort_list">
                    <div class="num_logo type4"><img src=""></div>
                    <div class="num_name" pinyin="ADMIN"><span class="nameT"></span>&nbsp;<span class="up-right">'</span></div>
                    <div class="num_name2"></div>
                </div>
            </div>
        </div>
        <div id="readed" style="display: none;">
            <div class="sort_box">
                <div class="sort_list">
                    <div class="num_logo type4"><img src=""></div>
                    <div class="time"></div>
                    <div class="num_name" pinyin="ADMIN"><span class="nameT"></span>&nbsp;<span class="up-right">'</span></div>
                    <div class="num_name2"></div>
                </div>
            </div>
        </div>
    </master:Content>
</master:ContentPage>

<script type="text/javascript">
    $(function(){
        $("#master_title").text("阅读情况");
        var opBtn = $("#master_option").parent();
        opBtn.empty().append($("#model_1").html());
        opBtn.show();
    });
</script>

<script type="text/javascript">
    var mainId="<%=mainId%>";
    var weidu;
    var yidu;
    var type=0; //0-- 未读 1-- 已读
    var yiduPage=1;
    var weiduPage=1;
    var count=20;
    var endyidu=false;
    var endweidu=false;
    $(document).ready(function(){
        $(".wrap").width("100%");
        var start=(weiduPage-1)*count;
        var num=count;
        if(weidu<count){
            num=weidu;
            endweidu=true;
        }
        if(yidu<count){
            endyidu=true;
        }
        $.getJSON("/public/baseSet/impl/alarm/getReadState.do",{"mainId":mainId,"readed":true,"start":start,"count":num},function(res){
            weidu=res.weidu;
            yidu=res.yidu;
            $("#inner_nav").text(res.weidu+" 未阅读");
            $("#outer_nav").text(res.yidu+" 已阅读");
            $.each(res.list,function(i,o){
                var item = $($("#person").html());
                item.find(".num_logo img").attr("src","/app/userinfo/member_outphoto.jsp?personId="+ o.memberId);
                item.find(".nameT").html(o.memberName);
                item.find(".up-right").html(o.post);
                item.find(".num_name2").text(o.dept);
                $(".py_div").append(item);
            });
            if(num<count){
                $("#pullDown").html("");
            }else{
                setTimeout(function(){
                    $("#pullDown").html("上拉加载更多...");
                },1000);
            }
        });
        $("#inner_nav").click(function(){
            type = 0;
            $("#outer_nav").removeClass("active");
            $("#inner_nav").addClass("active");
            $("#wrapper").children().eq(0).css("transform","translate(0px, -40px) scale(1) translateZ(0px)");
            loadUnreaded();
        });
        $("#outer_nav").click(function(){
            type = 1;
            $("#inner_nav").removeClass("active");
            $("#outer_nav").addClass("active");
            $("#wrapper").children().eq(0).css("transform","translate(0px, -40px) scale(1) translateZ(0px)");
            loadReaded();
        });
    });

    function loadReaded(){
        $(".py_div").empty();
        var num=count;
        if(yidu<count){
            num=yidu;
            endyidu=true;
        }else{
            endyidu=false;
        }
        $.ajax({
            url:"/public/baseSet/impl/alarm/getReadState.do",  //请求路径
            data:{
                mainId: mainId,
                readed : false,
                start :0,
                count : num
            }, //请求参数
            type:"post", //请求方式
            async:false,  //是否异步，默认值true
            dataType:'json',
            success:function(res){ ////成功之后回调
                $.each(res.list,function(i,o){
                    var item = $($("#readed").html());
                    item.find(".num_logo img").attr("src","/app/userinfo/member_outphoto.jsp?personId="+ o.memberId);
                    item.find(".nameT").html(o.memberName);
                    item.find(".up-right").html(o.post);
                    item.find(".num_name2").text(o.dept);
                    item.find(".time").text(o.time);
                    $(".py_div").append(item);
                });
            }
        });
        if(num<count){
            $("#pullDown").html("");
        }else{
            setTimeout(function(){
                $("#pullDown").html("上拉加载更多...");
            },1000);
        }
    }
    function loadUnreaded(){
        $(".py_div").empty();
        var num=count;
        if(weidu<count){
            num=weidu;
            endweidu=true;
        }else{
            endweidu=false;
        }
        $.ajax({
            url:"/public/baseSet/impl/alarm/getReadState.do",  //请求路径
            data:{
                mainId: mainId,
                readed : true,
                start :0,
                count : num
            }, //请求参数
            type:"post", //请求方式
            async:false,  //是否异步，默认值true
            dataType:'json',
            success:function(res){ ////成功之后回调
                $.each(res.list,function(i,o){
                    var item = $($("#readed").html());
                    item.find(".num_logo img").attr("src","/app/userinfo/member_outphoto.jsp?personId="+ o.memberId);
                    item.find(".nameT").html(o.memberName);
                    item.find(".up-right").html(o.post);
                    item.find(".num_name2").text(o.dept);
                    item.find(".time").text(o.time);
                    $(".py_div").append(item);
                });
            }
        });
        if(num<count){
            $("#pullDown").html("");
        }else{
            setTimeout(function(){
                $("#pullDown").html("上拉加载更多...");
            },1000);
        }
    }

    function initPage(){
        var readed=true;
        var start;
        var num=count;
        if(type==1){
            if(endyidu){
                return;
            }
            readed=false;
           start=(yiduPage-1)*count;
            if(start+count>yidu){
                num=yidu-start;
                endyidu=true;
            }
        }else{
            if(endweidu){
                return;
            }
            start=(weiduPage-1)*count;
            if(start+count>weidu){
                num=weidu-start;
                endweidu=true;
            }
        }
        $.ajax({
            url:"/public/baseSet/impl/alarm/getReadState.do",  //请求路径
            data:{
                mainId: mainId,
                readed : readed,
                start :start,
                count : num
            }, //请求参数
            type:"post", //请求方式
            async:false,  //是否异步，默认值true
            dataType:'json',
            success:function(res){ ////成功之后回调
                $.each(res.list,function(i,o){
                    var item;
                    if(!readed){
                        item = $($("#readed").html());
                        item.find(".time").text(o.time);
                    }else{
                        item = $($("#person").html());
                    }
                    item.find(".num_logo img").attr("src","/app/userinfo/member_outphoto.jsp?personId="+ o.memberId);
                    item.find(".nameT").html(o.memberName);
                    item.find(".up-right").html(o.post);
                    item.find(".num_name2").text(o.dept);
                    $(".py_div").append(item);
                });
                myScroll.refresh();
            }
        });
    }
    function back_(){
        var reg=new RegExp("#$");
        if(reg.test(window.location.href)){
            history.go(-2);
        }else{
            history.back();
        }
    }
    var moveloadconf = {
        upcallback: function(){
            if(type==0){
                if(weidu <= ((weiduPage-1)*count)){
                    $("#pullDown").html("没有更多了");
                    return;
                }
                weiduPage ++;
            }else{
                if(yidu <= ((yiduPage-1)*count)){
                    $("#pullDown").html("没有更多了");
                    return;
                }
                yiduPage++;
            }
            initPage();
        },
        downcallback: function(){
            if(type==0){
                weiduPage  = 1;
                loadUnreaded();
            }else{
                yiduPage = 1;
                loadReaded();
            }
        }
    };
    moveload(moveloadconf);
</script>