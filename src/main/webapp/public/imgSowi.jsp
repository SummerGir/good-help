<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
  String title = request.getParameter("fileName");
  title = title.length()>8?title.substring(0,7)+"...":title;
  String displayUri = request.getParameter("displayUri");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <title>demo</title>
  <script type="text/javascript" src="/public/eiis/eiis.js"></script>
  <script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.bootstrap.font_awesome);
  </script>
  <link rel="stylesheet" href="/theme/current/css/base.css"/>
  <script src="jquery-photo-gallery/jquery.photo.gallery.js"></script>
  <!-- HTML5 Support for IE -->
  <!--[if lt IE 9]>
  <script src="/public/old-ie/html5shiv.min.js"></script>
  <script src="/public/old-ie/respond.min.js"></script>
  <![endif]-->
  <link rel="stylesheet" href="/public/controls/preview/css/imgPreview.css" type="text/css"/>
  <script type="text/javascript">
    $(function(){
      var img=$("#img");
      var src=$("#src").val();

      var srcs=localStorage["srcs"].split(",");
      var imgstrs="";
      $.each(srcs,function(){
        var _this=this.replace(/%2F/g,"/");
        if(src!=_this){
          imgstrs+="<img class=\"gallery-pic\" style=\"display: none\" src="+this+"/>";
        }
      });
      img.after(imgstrs);

      img.on("load",function(){
        $.openPhotoGallery(img);
      });
      img.attr("src",src);
    });
    function st(){
      alert(true);
    }
    function back_(){
      window.history.back();
    }
    function closeState(){
      var closeState=$("#closeState").val();
      return closeState;
    }
    function isphonee(){
      var state=0;
      if(EIIS.browser.phone){
        state=1;
      }
      return state;
    }
    function isapple(){
      var state=0;
      if(EIIS.browser.isIOS){
        state=1;
      }
      return state;
    }
  </script>
  <style>
    html,body{
      width : 100%;
      height : 100%;
      margin:0;
      overflow: hidden;
    }
    img{
      max-width: 300px;
      max-height: 200px;
    }
    .gallerys{
      width : 100%;
      height: 80%;
      margin-top: 20%;
    }
  </style>
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
<div class="gallerys">
  <img id="img" class="gallery-pic" style="display: none" src=""/>


  <input type="hidden" id="src" value="<%=request.getParameter("src")%>"/>
  <input type="hidden" id="closeState" value="1">
</div>
</body>
</html>