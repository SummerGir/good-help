<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.util.xml.file.PathUtil" %><%--
  Created by IntelliJ IDEA.
  User: sk
  Date: 2016/4/14
  Time: 13:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String title = request.getParameter("fileName");
    title = title.length()>8?title.substring(0,7)+"...":title;
    String displayUri = request.getParameter("displayUri");
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <script type="text/javascript" src="/public/eiis/eiis.js"></script>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.bootstrap.font_awesome);
    </script>
    <link rel="stylesheet" href="/theme/current/css/base.css"/>

    <!-- HTML5 Support for IE -->
    <!--[if lt IE 9]>
    <script src="/public/old-ie/html5shiv.min.js"></script>
    <script src="/public/old-ie/respond.min.js"></script>
    <![endif]-->
    <meta name="format-detection" content="telephone=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>图片缩放</title>
    <link rel="stylesheet" href="css/imgPreview.css" type="text/css"/>
</head>
<body>
<nav class="navbar navbar-fixed-top" role="banner">
    <div class="row" style="margin: 0;">
        <div class="col-xs-3" style="text-align: left;padding: 0;">
                <span class="navbar-brand navbar-left" >
                    <span id="master_back" onclick="back_()" style="display: block"><i class="glyphicon glyphicon-menu-left"></i>返回</span>
                </span>
        </div>
        <div class="col-xs-6" style="text-align: center;padding: 0px">
                <span class="navbar-brand navbar-center"><script type="text/javascript">
                    document.write(
                            <%if(title.length()>0){%>
                            '<%=title%>'
                    <%}else{%>
                    document.title.length>8?document.title.substring(0,7)+"...":document.title
                    <%}%>
                    );
                </script></span>
        </div>
        <div class="col-xs-3" style="text-align: right;padding: 0;">
            <a id="master_option" data-toggle="dropdown" hidden class="dropdown-toggle navbar-brand navbar-right" href="#">
                <i class="fa fa-bars"></i>
            </a>
        </div>
    </div>
</nav>

<ul class="list">
    <br/><br/><br/><br/><br/>
    <li><img src="<%=displayUri%>"/></li>
</ul>

<section class="imgzoom_pack">
    <div class="imgzoom_x">X</div>
    <div class="imgzoom_img"><img src=""/></div>
</section>
<script src="js/imgPreview.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function (event) {
        ImagesZoom.init({
            "elem": ".list"
        });
    }, false);
    function back_(){
        window.history.back();
    }
</script>
</body>
</html>
