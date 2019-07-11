<%@ page import="eiis.context.Context" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="eiis.sys.baseSettingImpl.service.CoreAppSettingPageAlarmService" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>

<%
    String materPageId = "_app";
    String mainId=request.getParameter("mainId");
    String url=request.getParameter("url");
    String uuidStr=request.getParameter("uuidStr");
    String pubTime=request.getParameter("pubTime");
    String cur_memberName=Context.getCurrent().getName().toString();
    String cur_memberId= Context.getCurrent().getId().toString();
    String dir_code = request.getParameter("dir_code")==null?"":request.getParameter("dir_code");
    if(StringUtils.isBlank(pubTime)){
        pubTime= CoreAppSettingPageAlarmService.getInstance().getAlarmItem(mainId).get("pushTime").toString().split(" ")[0];
    }
%>
<master:ContentPage materPageId="<%=materPageId%>">
    <master:Content contentPlaceHolderId="title">查看文档</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.form);
            EIIS.Common.loadComponent(EIIS.Common.controls.custom);
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.mobpersontree);
        </script>

        <meta name="format-detection" content="telephone=no"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="stylesheet" href="/public/controls/preview/css/imgPreview_inOtherPage.css" type="text/css"/>
        <link rel="stylesheet" href="/public/controls/share/share.css" type="text/css"/>
        <%--<script src="/public/controls/preview/js/imgPreview.js"></script>--%>
        <script src="/public/controls/preview/filePrint.js"></script>
        <script src="/public/controls/share/share.js"></script>
        <style type="text/css">
            *{margin: 0;padding: 0;}
            a{text-decoration:none;color: #000000;}
            .container{
                color: #999;
                padding: 0px;
                overflow-x: hidden;
                overflow-y: auto;
                word-wrap: break-word;
                font-size: 14px;
                background: #FFFFFF;
                /*border:solid;*/
            }
            #detail_form .row{
                margin: 0px;
                padding:10px 10px 5px 10px;
            }
            #detail_form{overflow-y: auto;-webkit-overflow-scrolling:touch;
}
            .myRow{
                border-bottom: 1px solid #bebebe;
            }
            .col-md-12{
                padding: 0px;

            }
            .myOl li{
                text-decoration:underline;
                color: #0000cc;
            }
            #relation ol,.myOl{
                padding: 0px 0px 0px 25px;
            }
            #relation ol li{
                padding-bottom: 10px;
            }
            #relation ol li i{
                color: red;
            }
            sup{
                color: #ccc;
            }
            .sige_span span{
                position: absolute;
                height:18px;
                line-height: 18px;
                width:18px;
                left:15px;
                top:-5px;
                font-size: 13px;
                background-color:#d43f3a;
                color: #fff;
                text-align: center;
                border-bottom-left-radius: 50%;
                border-bottom-right-radius: 50%;
                border-top-left-radius: 50%;
                border-top-right-radius: 50%;
            }
            .sige_span{
                margin-right: 15px;
            }
            .myCol{
                padding: 0px;
            }
            .myOl li{
                text-decoration:underline;
                color: #0000cc;
            }
            .myIco{
                font-size: 22px;
                color: #2dcc70;
                text-align: center;
            }
            .item{
                width: 100%;
            }
            .item_1{
                height: 40px;
                line-height:40px;
                vertical-align: middle;
                color: #696969;
                width: 100%;
                display: block;
                padding: 0;
                border-bottom: 1px solid  #EBEBEB;
            }
            .item_1 span{
                display: inline;
                line-height: 20px;
                font-size: 13px;
                margin-top: 10px;
                vertical-align: middle;
                color: #5e5e5e;
            }
            .headImg {
                width: 40px;
                height: 40px;
                vertical-align: middle;
                display: inline-block;
            }
            .headImg img{
                border-radius: 15px;
                width: 30px;
                height: 30px;
                float: left;
                margin-top: 2px;
            }
            .item_2{
                padding: 5px 10px;
                padding-top: 10px;
                overflow: hidden;
                background-color: white;
                /*border: solid;*/
            }
            .item_2>.tit{
                font-size: 16px;
                color: #000000;
                width: 100%;
                float:left;
            }
            .item_2 .tit span{
                float: left;
                width: 100%;
                margin-bottom: 10px;
                font-size: 20px;
                line-height: 30px;
            }
            .doc_info{
                width: 100%;
                float: left;
                color:#575757;
                font-size: 16px;
                line-height: 25px;
            }
            .doc_img{
                width: 100%;
                height:150px;
                margin-top: 10px;
                float: left;
            }
            .doc_img img{
                width: 100%;
                height: 100%;
            }
            #comments {
                margin-top: 10px;
                width: 100%;
                float: left;
                background-color: #fff;
                display: none;
                border-top: 1px solid  #EBEBEB;
                padding-top: 5px;
            }
            #comments .t_info{
                width: 100%;
                height: 40px;
                padding-left: 10px;
            }
            .dropdown-menu ul,li {
                margin:0;
                margin-bottom: 5px;
                padding:0;
            }
            #comments  ul{
                width: 100%;
                float: left;
                border: none;
            }
            #comments li{
                width: 100%;
                list-style: none;
                font-style:normal;
                margin: 0 auto;
                margin-bottom:10px;
            }
            #comments li .t_info{
                height: 40px;
                line-height: 40px;
                color: #919191;
                padding: 0 10px;
            }
            #comments li .t_info .com_name{
                font-size: 13px;
                display:inline-block ;
            }
            #comments li .com_info{
                width: 100%;
                padding: 10px;
                padding-bottom: 0px;
            }
            #comments li .com_info p{
                width: 100%;
                color: #636363;
                padding-left: 10px;
            }
            #comments li .f_info{
                width: 100%;
                font-size: 13px;
                padding:5px 10px 5px 20px ;
                color: #919191;
                border-bottom: 1px solid  #EBEBEB;
            }

            #comments li .f_info a{
                padding-left: 20px;
                font-size: 13px;
                color: #3190be;
            }
            #fj{
                margin-top: 20px;
            }
            #comment{
                width: 100%;
                height: 60px;
                float: left;
                bottom: 0;
                background-color: #EDEDED;
                display: none;
                /*z-index: -2;*/
            }
            #comment  .cont{
                width:80%;
                height: 40px;
                border-radius: 18px;
                border:1px #EDEDED solid;
                margin-left: 10px;
                color:#303030;
                float: left;
                margin-top: 10px;
                background-color: #fff;
            }
            #comment input{
                width:80%;
                height: 26px;
                outline:none;
                margin-left: 10px;
                font-size: 14px;
                color:#303030;
                margin-top: 7px;
                border: none;
            }
            #comment .pubCom{
                float: right;
                margin-right: 15px;
                position: relative;
                width:auto;
                height:60px;
                color: #3190be;
                font-size: 16px;
                line-height: 60px;
                text-align: center;
            }
            #detail_content{
                border-bottom: 1px solid  #EBEBEB;
                padding-bottom: 5px;
            }
            .dropdown-menu{margin: 0;}
            .dropdown-menu>li{
                border: none;
                border-bottom: 1px solid #bebebe;
            }
            .dropdown-menu>li:last-child{border: none;}
            .dropdown-menu ul, li{margin: 0;}
            .circle{
                width: 100%;
                height: 46px;
                background-color: #2dcc70;
                text-align: center;
                margin-left: 15px;
            }
            .circle .play{
                font-size: 18px;
                color: white;
                line-height: 46px;
            }
            .contentTitle{
                font-weight: bold;
                font-size: 16px;
                color: #000;
            }
            .separated{
                background-color: #f5f5f5;
                height: 1px;
                margin: 3px 0;
            }
            .dicInfoTitle{
                color: #000000;
            }
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="row" id="detail_form" style="margin: 0px;">
            <div class="col-md-12" style="background-color: white;">
                <div class="row" id="detail_content">
                    <div class="item" data_id="">
                        <div class="item_1">
                            <div class="headImg">
                                <i class="iconfont icon-LOGOxinban" style="color: #2dcc70;line-height:35px;font-size:26px;"></i>
                            </div>
                            <input type="hidden" name="weidu"/>
                            <input type="hidden" name="yidu"/>
                            <span name="pushManName" style="padding-left: -5px;">e施工</span>
                            <span name="pushTime" style="padding-left: -2px;"><%=pubTime%></span>
                            <span name="yidu" style="float: right;padding-right: 2%;" onclick="readState()"></span>
                            <span name="weidu" style="float: right;padding-right: 2%;" onclick="readState()"></span>
                            <span name="fjCount" style="float: right;padding-right: 2%;"></span>

                        </div>
                        <div class="item_2">
                            <div class="tit" onclick="viewItem(this,null)">
                                <span name="title"></span>
                                <div class="attachImg"><img src=""></div>
                            </div>
                            <div class="doc_info">
                                <span name="con"></span>
                            </div>
                        </div>
                    </div>
                    <div id="fj">

                    </div>
                    <!-- 评论等组件按钮 -->
                    <%--<div>--%>
                        <%--<jsp:include page="/app/appcomponent/appcomponent.jsp">--%>
                            <%--<jsp:param name="mainId" value="<%=mainId%>"/>--%>
                            <%--<jsp:param name="dirCode" value="<%=dir_code%>"/>--%>
                            <%--<jsp:param name="shareType" value="worknote"/>--%>
                            <%--<jsp:param name="isShare" value="true"/>--%>
                        <%--</jsp:include>--%>
                    <%--</div>--%>
                </div>
                <%--<div id="comments">--%>
                    <%--<ul class="comm">--%>
                    <%--</ul>--%>
                <%--</div>--%>
            </div>
        </div>
        <div class="row" style="height: 46px;width: 100%;position: fixed;display: block;bottom:0;">
            <div class="circle" onclick="readContext();"> <i class="fa fa-play play"></i><span class="play"> 点击语音播报</span></div>
        </div>
        <%--<div id="model_4" style="display: none">--%>
            <%--<div class="navbar-brand">--%>
                <%--<span style="padding: 5px 5px;" class="rightVoices"  onclick="readContext()"><i class='fa fa-volume-up'></i></span>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div id="comment">--%>
            <%--<div class="cont"><input placeholder="发表评论..."/></div>--%>
            <%--<div onclick="comment()" class="pubCom">发送</div>--%>
        <%--</div>--%>
        <%--<div id="fjImgDisplay" style="display: none;">--%>
            <%--<div class="doc_img">--%>
                <%--<img src="">--%>
            <%--</div>--%>
        <%--</div>--%>
        <%--<div style="display: none;" class="comli">--%>
            <%--<ul>--%>
                <%--<li>--%>
                    <%--<div class="t_info">--%>
                        <%--<div class="headImg">--%>
                            <%--<img src="">--%>
                        <%--</div>--%>
                        <%--<div class="com_name"></div>--%>
                    <%--</div>--%>
                    <%--<div class="com_info">--%>
                        <%--<p></p>--%>
                    <%--</div>--%>
                    <%--<div class="f_info">--%>
                        <%--<span class="f_time"></span>--%>
                        <%--<a href="#" class="f_reply" onclick="reply(this)">回复</a>--%>
                        <%--<input type="hidden" name="rep_name"/>--%>
                    <%--</div>--%>
                <%--</li>--%>
            <%--</ul>--%>
        <%--</div>--%>
        <%--<div id="model_1" style="display: none;">--%>
            <%--<ul class="dropdown-menu">--%>
                <%--<li>--%>
                    <%--<a href="#" onclick="edit_()">编辑</a>--%>
                <%--</li>--%>
                <%--<li>--%>
                    <%--<a href="#" onclick="delete_()">删除</a>--%>
                <%--</li>--%>
            <%--</ul>--%>
        <%--</div>--%>
        <%--<div id="model_2" style="display: none;">--%>
            <%--<div class="row" style="padding: 0px;">--%>
                <%--<div class="col-xs-1 col-md-1 myCol myIco"><i class="fa fa-paperclip" style="transform: rotateY(180deg);"></i></div>--%>
                <%--<div class="col-xs-11 col-md-11 myCol" style="padding-left: 10px;color: #0000C0;" name="fjName"></div>--%>
            <%--</div>--%>
        <%--</div>--%>
        <%--<div id="model_3" style="display: none;">--%>
            <%--<div class="row myCol">--%>
                <%--<div class="col-xs-3 col-md-3 myCol" name="memberName"></div>--%>
                <%--<div class="col-xs-3 col-md-3 myCol" name="isNew"></div>--%>
                <%--<div class="col-xs-6 col-md-6 myCol" name="sysTime"></div>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<section class="imgzoom_pack">--%>
            <%--<div class="imgzoom_x">X</div>--%>
            <%--<div class="imgzoom_img"><img src=""/></div>--%>
        <%--</section>--%>
    </master:Content>
</master:ContentPage>

<script type="text/javascript">
    var mainId="<%=mainId%>";
    var url = '<%=url%>';
    var code = '<%=dir_code%>';
    var uuidStr = '<%=uuidStr%>';
    var replyName="";
    $(document).ready(function(){
        var size=getWindowSize();
        $(".container").height(size.y-50);
        $("#master_title").html("查看文档");

       initOption();
        showOption();
        myLode();
    });
    //阅读情况
    function readState(){
        var yidu=$(".item_1 input[name='yidu']").val();
        var weidu=$(".item_1 input[name='weidu']").val();
        window.location.href="readState.jsp?mainId=<%=mainId%>"+"&yidu="+yidu+"&weidu="+weidu;
    }

    var clickNum = 0;
    function readContext() {
        var data={};
        var context = $(".doc_info").text().trim();

        if($(".play").hasClass("fa fa-play")){
            data={
                code:"esgApp_function",
                fname:"",
                param:{str:""}
            };
            if(context){
                data.param.str=context;
            }
            if(clickNum==0){
                data.fname = "startSpeak";
                $(".circle").empty().append("<i class='fa fa-pause play'></i><span class='play'> 点击暂停播报</span>");
            }else{
                data.fname = "resumeSpeaking";
                $(".circle").empty().append("<i class='fa fa-pause play'></i><span class='play'> 点击暂停播报</span>");
            }
            if(context){
                setTimeout(function () {
                    sendRequest(data);
                },100);
            }
        }else{
            data={
                code:"esgApp_function",
                fname:"pauseSpeaking",
                param:{str:""}
            };
            $(".circle").empty().append("<i class='fa fa-play play'></i><span class='play'> 点击继续播报</span>");
            setTimeout(function () {
                sendRequest(data);
            },100);
        }
        clickNum ++;
    }

    //加载右侧当前nav
    function initOption(){
        $("#master_option").show().parent().append('<ul class="dropdown-menu diy_op">' +
            '                <li class="anpai" onclick="fenxiang();"><a href="#">分享</a></li>' +
            '            </ul>');
    }

    function fenxiang(){
        $.share({
            title : $("#detail_content .item_2 span[name='title']").text(),
            callback : function(data){
                $.ajax({
                    type : "post",
                    url : "/public/baseSet/impl/alarm/addReadPerson.do",
                    data : {
                        mainId : mainId,
                        content : data.content,
                        memberId : data.ids.join(";"),
                        type : "alarm"
                    },
                    dataType : "json",
                    success : function(msg){
                        $.message(msg.errorCode===0?"分享成功":"分享失败");
                    }
                });
            }
        });
    }

    //获取文档信息
    function myLode(){
        $.getJSON("/public/baseSet/impl/alarm/getAlarmItem.do",{"mainId":mainId,alarmTypeCode:code},function(res){
            $(".item_1 input[name='yidu']").val(res.yidu);
            $(".item_1 input[name='weidu']").val(res.weidu);
            res.shareCount = Math.min(99,res.shareCount);
            if(res.files.length>0){
                var arr=res.files;
                for(var i=0;i<arr.length;i++){
                    var div = $("#model_2>div").clone(true);
                    var a = "<a onclick='skip(\""+arr[i]+"\")'>"+ arr[i].split("/")[arr[i].split("/").length-1]+"</a>";
                    div.find("div[name='fjName']").append(a);
                    $("#fj").append(div);

                    var attachUrl="";
                    if(arr[i].indexOf("display")>0){
                        attachUrl=arr[i].substring(14,arr[i].length);
                    }else if(arr[i].indexOf("download")>0){
                        attachUrl=arr[i].substring(15,arr[i].length);
                    }
                    if(attachUrl.IsPicture()){
                        var imgdiv= $($("#fjImgDisplay").html());
                        attachUrl="/file/display/"+attachUrl;
                        imgdiv.find("img").attr("src",attachUrl);
                        $(".item_2").append(imgdiv);
                    }
                }
            }else{
                $("#fj").hide();
            }

//            $(".item_1 img").attr('src',"/app/userinfo/member_outphoto.jsp?personId="+ res.pushManId);
            if(res.isShare==true){
                var shareList=res.shareList;
                if(shareList.length>0){
                    for(var i=0;i<shareList.length;i++){
                        var item = $($(".comli ul").html());
                        item.find(".headImg img").attr('src',"/app/userinfo/member_outphoto.jsp?personId="+ shareList[i].memberId);
                        item.find(".com_name").text(shareList[i].replyMemberName);
                        item.find("input[name='rep_name']").val(shareList[i].replyMemberName);
                        item.find(".com_info p").text(shareList[i].shareContent);
                        item.find(".f_info input[name='rep_name']").val(shareList[i].memberName);
                        item.find(".f_time").text(shareList[i].sysTime);
                        $(".comm").append(item);
                    }
                }
                if(shareList.length>0){
                    $("#comments").css("margin-bottom","30px");
                }
                $("#comments").show();
                $("#comment").show();
                $("#detail_form").height($(".container").height()-60);
            }else{
                $("#detail_form").height($(".container").height());
            }
//            $("#detail_form span[name='pushManName']").text(res.pushManName)
            $("#detail_form span[name='title']").html(res.title);

            $("#detail_form span[name='yidu']").html('<font style="color:#fe3600;">'+res.yidu+'</font> 已读');
            $("#detail_form span[name='weidu']").html('<font style="color:#fe3600;">'+res.weidu+'</font> 未读');
            $("#detail_form span[name='fjCount']").html('<font style="color:#fe3600;">'+res.fjCount+'</font> 附件');
            var con=$("#detail_form span[name='con']");
            con.html(res.con);
            con.find("img").addClass("img-responsive");
            var html='',share;
            for(var o=0;o<res.shares.length;o++){
                share=res.shares[o];
                html+='<div style="width: 100%;height: 1px;background-color: #f5f5f5;margin: 5px 0;"></div>';
                html+='<span style="color:#a1a1a1;"><span style="display: inline-block;width: 30px;height: 30px;"><img style="width: 100%;height: 100%;border-radius: 15px;" src="/app/userinfo/member_outphoto.jsp?personId='+share.memberId+'"/></span> <div style="padding-left:  40px;margin-top:  -28px;">'+share.content+'</div></span>';
            }
            con.append(html);
//            ImagesZoom.init({
//                "elem": "#detail_form"
//            });
            if(res.isPushMan){
                showOption();
            }else{
                hideOption();
            }
            if(res.docType){
                hideOption();
            }
        });
    }
    String.prototype.IsPicture = function()
    {
        //判断是否是图片 - strFilter必须是小写列举
        var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
        if(this.indexOf(".")>-1)
        {
            var p = this.lastIndexOf(".");
            var strPostfix=this.substring(p,this.length) + '|';
            strPostfix = strPostfix.toLowerCase();
            if(strFilter.indexOf(strPostfix)>-1)
            {
                return true;
            }
        }
        return false;
    }
    //删除文档
    function delete_() {
        $.message({caption: "删除询问",
            text: "删除文档会同时删除文档的内容和附件，将不能恢复，请考虑清楚！\r\n\r\n您确定要删除吗？",
            button: $.message.button.yesNo,
            icon: $.message.icon.exclamation,
            verify: {
                result: $.message.result.yes
            },
            result: function (re) {
                if (re == $.message.result.yes) {
                    $.message.loader.open("正在删除...");
                    $.ajax({
                        url: "/app/infocenter/documents_action.jsp",
                        data: {
                            "action": "remove",
                            "doc_id": mainId
                        },
                        type: "POST",
                        dataType: "json",
                        error: function(jqXHR){
                            $.message.loader.close();
                            $.message({caption: "错误",
                                text: $.ajaxErrorMessager(jqXHR),
                                button: $.message.button.ok,
                                icon: $.message.icon.error,
                                result: null });
                        },success: function (data, textStatus, jqXHR) {
                            $.message.loader.close();
                            back_();
                        }
                    });
                }
            }
        });
    }
    function edit_(){
        window.location.href='write.jsp?type=edit&mainId='+mainId+"&dir_code="+"<%=dir_code%>";
    }
    //展示编辑删除选项
    function showOption(){
//        var opBtn = $("#master_option");
//        var ul = $("#model_1>ul").clone(true);
//        ul.addClass("diy_op");
//        opBtn.after(ul);
//        opBtn.show();
    }
    //隐藏编辑删除选项
    function hideOption(){
        var opBtn = $("#master_option");
        opBtn.next(".diy_op").remove();
        opBtn.hide();
    }
    function skip(uri){
        if(EIIS.browser.phone){
            var postData = {};
            postData['type'] = "preView";
            postData['real_Path'] = uri;
            postData['source'] = 'reportForms';
            postData['quarry'] = 'attachment';
            postData['mainId'] = '';
            postData['mainName'] = '';
            processData(postData);
        }else {
            window.location.href = uri;
        }
    }
    function back_(){
        var data={
            code:"esgApp_function",
            fname:"stopSpeak",
            param:{str:""}
        };
        sendRequest(data);
        var reg=new RegExp("#$");
        if(reg.test(window.location.href)){
            history.go(-2);
        }else{
            if(url == "undefined" || url == null || url == "" || url=="null") {
                window.location.href="/theme/current/master/phone_home/infocenter.jsp";
            }else {
//            history.go(-1);
                if(url.indexOf("beforeProjectId")!==-1){
                    window.location.href = url;
                }else{
                    window.location.href = url + '?nowCode=' + code + '&uuidStr=' + uuidStr;
                }
            }
        }
    }
    function comment(){
        var shareContent=$("#comment input").val();
        if($.trim(shareContent)==""){
            $.message("内容不能为空");
            return false;
        }
        var memberName="";
        var shareType="infocenter";
        $.post("/app/share/mob/action.jsp?action=save",{mainId:mainId,shareContent:shareContent,replyMemberName:replyName,shareType:shareType},function(rs){
            if(rs.error==0){
                var item = $($(".comli ul").html());
                item.find(".headImg img").attr('src',"/app/userinfo/member_outphoto.jsp?personId=<%=cur_memberId%>");
                if(replyName==""){
                    item.find(".com_name").text("<%=cur_memberName%>");
                    $.message("评论成功");
                    setTimeout('closeWin()',2000);
                }else{
                    item.find(".com_name").text(replyName);
                    $.message("回复成功");
                    setTimeout('closeWin()',2000);
                }
                item.find(".com_info p").text(shareContent);
                item.find(".f_time").text(getNowFormatDate());
                item.find(".f_info input[name='rep_name']").val("<%=cur_memberName%>");
                $(".comm").prepend(item);
                if($(".comm li").length==1){
                    $("#comments").css("margin-bottom","70px");
                }
            }
        },"json");
        $("#comment input").attr("placeholder","  发表评论...");
        $("#comment input").val("");
        return true;
    }
    function reply(e){
        var comName= $(e).parents(".f_info").find("input[name='rep_name']").val();
        $("#comment input").focus();
        $("#comment input").attr("placeholder","  发表回复...");
        replyName="<%=cur_memberName%>"+"回复"+comName;
    }

    function getNowFormatDate() {
        var date = new Date();
        var hour;
        var minutes;
        if(date.getMinutes()<10){
            minutes="0"+date.getMinutes();
        }else{
            minutes=date.getMinutes();
        }
        if(date.getHours()<10){
            hour="0"+date.getHours();
        }else{
            hour=date.getHours();
        }
        var currentdate = hour+":"+minutes;
        return currentdate;
    }
    function closeWin(){
        $(".modal-scrollable button").trigger('click');
    }
</script>