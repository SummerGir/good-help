<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
  String clicksrc=request.getParameter("src");
  String initMax=request.getParameter("initMax");
  if(initMax==null || initMax.equals("")){
      initMax="false";
  }
  Integer state=Integer.parseInt(request.getParameter("state")==null?"1":request.getParameter("state"));
  if(state!=0){
    clicksrc=clicksrc.substring(clicksrc.indexOf("p",10)-1);
  }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>demo</title>
  <script src="jquery-photo-gallery/jquery.js"></script>
  <script src="jquery-photo-gallery/jquery.photo.gallery.js"></script>
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
    function closeState(){
      var closeState=$("#closeState").val();
      return closeState;
    }
    function initMax(){
      return "<%=initMax%>";
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
  </style>
</head>
<body>
<div class="gallerys">
  <img id="img" class="gallery-pic" style="display: none" src=""/>



  <input type="hidden" id="src" value="<%=clicksrc%>"/>
  <input type="hidden" id="closeState" value="0"/>
</div>
</body>
</html>