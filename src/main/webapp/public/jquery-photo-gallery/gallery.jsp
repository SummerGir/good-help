<%@ page contentType="text/html; charset=utf-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>图片查看器</title>
	<link rel="stylesheet" href="photoGallery.css"/>
	<script src="jquery.js"></script>
	<script src="/public/jquery-photo-gallery/jquery.photo.gallery.js"></script>
	<style type="text/css" rel="stylesheet">
		.imgTop{
			width: 100%;
			height: 3px;
			margin-top: 0px;
			margin-left: 0px;
			cursor : n-resize;
			background-color: red;
			position: absolute;
		}
		.imgRight{
			width: 3px;
			height: 100%;
			float: right;
			cursor : e-resize;
			/*background-color: blue;*/
			position: absolute;
		}
		.imgDown{
			width: 100%;
			height: 3px;
			margin-top: 0px;
			margin-bottom: 0px;
			cursor : n-resize;
			/*background-color: yellow;*/
			position: absolute;
		}
		.imgLeft{
			width: 3px;
			height: 100%;
			margin-top: 0px;
			margin-left: 0px;
			cursor : e-resize;
			/*background-color: green;*/
			position: absolute;
		}
		.imgLeftTop{
			width: 3px;
			height: 3px;
			margin-top: 0px;
			margin-left: 0px;
			cursor : nw-resize;
			/*background-color: black;*/
			position: absolute;
		}
		.imgLeftDown{
			width: 3px;
			height: 3px;
			margin-bottom: 0px;
			margin-left: 0px;
			cursor : sw-resize;
			/*background-color: black;*/
			position: absolute;
		}
		.imgRightDown{
			width: 3px;
			height: 3px;
			margin-bottom: 0px;
			margin-right: 0px;
			cursor : se-resize;
			/*background-color: black;*/
			position: absolute;
		}
	</style>
	<script type="text/javascript">
        var pt=window.parent;
        var ppt=pt.parent;
        var mouseStyle=["n-resize","e-resize","nw-resize","sw-resize","se-resize"]; //0:上下 1:左右 2:左上 3:左下 4:右下
        var nowImg;
        var iFrame=$(pt.document.getElementById("J_pg"));
        var imgShowDiv=$(ppt.document.getElementById("imageShow"));
        $(function(){
            var clickState1=false;
            var clickState2=false;
            var x=0;
            var y=0;
            var closeState=pt.closeState();
            if(closeState=="1"){
                $(".closeWin").remove();
            }
            if(pt.initMax()==="true"){
                $(".gallery").find(".oper_fullscreen").click().hide();
            }else{
                $(".gallery").find(".oper_fullscreen").show();
            }
            $(".box").preventScroll();
            if(imgShowDiv && imgShowDiv.length>0){
                var imgTop=$(".imgTop"),imgRight=$(".imgRight"),imgDown=$(".imgDown"),imgLeft=$(".imgLeft"),imgLeftTop=$(".imgLeftTop"),imgLeftDown=$(".imgLeftDown"),imgRightDown=$(".imgRightDown");
				/*(function(width,height){
				 imgTop.css({
				 width: "100%",
				 height: "3px",
				 position: "absolute",
				 top: "0px",
				 left: "0px",
				 cursor : "n-resize"
				 });
				 imgRight.css({
				 width: "3px",
				 height: "100%",
				 position: "absolute",
				 top: "0px",
				 left: (width-10)+"px",
				 cursor : "e-resize"
				 });
				 imgDown.css({
				 width: "100%",
				 height: "3px",
				 position: "absolute",
				 top: (height-10)+"px",
				 left: "0px",
				 cursor : "n-resize"
				 });
				 imgLeft.css({
				 width: "3px",
				 height: "100%",
				 position: "absolute",
				 top: "0px",
				 left: "0px",
				 cursor : "e-resize"
				 });
				 imgLeftTop.css({
				 width: "3px",
				 height: "3px",
				 position: "absolute",
				 top: "0px",
				 left: "0px",
				 cursor : "nw-resize"
				 });
				 imgLeftDown.css({
				 width: "3px",
				 height: "3px",
				 position: "absolute",
				 top: (height-10)+"px",
				 left: "0px",
				 cursor : "sw-resize"
				 });
				 imgRightDown.css({
				 width: "3px",
				 height: "3px",
				 position: "absolute",
				 top: (height-10)+"px",
				 left: (width-10)+"px",
				 cursor : "se-resize"
				 });
				 })(ppt.initDivWidth,ppt.initDivHeight);*/
                $(".gallery").bind("mousedown",function(e){
                    var but=e.button;
                    if(but!=0){
                        return;
                    }
                    clickState1=true;
                    x= e.pageX;
                    y= e.pageY;
                }).bind("mouseup",function(e){
                    var but=e.button;
                    if(but!=0){
                        return;
                    }
                    clickState1=false;
                    x= 0;
                    y= 0;
                }).bind("mousemove",function(e){
                    if(clickState1){
                        var lastX= e.pageX-x;
                        var lastY= e.pageY-y;
                        ppt.moveImg(lastX,lastY);
                    }
                });
                var divs=[imgTop,imgRight,imgDown,imgLeft,imgLeftTop,imgLeftDown,imgRightDown];
                $.each(divs,function(index,obj){
                    var self=$(obj);
                    var index=Number(self.attr("data-index"));
                    self.bind("mousedown", function (e) {
                        e.preventDefault();
                        var but = e.button;
                        if (but != 0) {
                            return;
                        }
                        console.log("边缘鼠标左键点击");
                        clickState2 = true;
                        x = e.pageX;
                        y = e.pageY;
                        console.log(ppt.document.body);
                        $(ppt.document.body).bind("mousemove",function(){
                            if (clickState2) {
                                console.log("边缘鼠标移动中。。。。");
                                var lastX = e.pageX - x;
                                var lastY = e.pageY - y;
//								changeImgWH(index,self, lastX, lastY);
                            }
                        });
                    }).bind("mouseup", function (e) {
                        e.preventDefault();
                        var but = e.button;
                        if (but != 0) {
                            return;
                        }
                        console.log("边缘鼠标左键抬起");
                        clickState2 = false;
                        x = 0;
                        y = 0;
                        $(ppt.document.body).unbind("mousemove");
                    });
                });
//				maxImg();
                console.log($(".box").width() +""+$(".box").height());
                console.log($(".gallery").width() +""+$(".gallery").height());
            }
        });

        function changeImgWH(index,self,X,Y){
            var nowImgWidth=nowImg.css("width");
            var nowImgHeight=nowImg.css("height");
            var iFrameWidth=iFrame.css("width");
            var iFrameHeight=iFrame.css("height");
            var imgShowDivWidth=imgShowDiv.css("width");
            var imgShowDivHeight=imgShowDiv.css("height");

            console.log(nowImgWidth);
            console.log(nowImgHeight);
            console.log("----------------------------------");
            console.log(iFrameWidth);
            console.log(iFrameHeight);
            console.log("----------------------------------");
            console.log(imgShowDivWidth);
            console.log(imgShowDivHeight);

            if(index == 0){
                var imgPositionDown=self.css("top");
                self.css("top",(Number((imgPositionDown.substr(0,imgPositionDown.length-2)))+Y)+"px");
                nowImg.css("height",(Number((nowImgHeight.substr(0,nowImgHeight.length-2)))+Y)+"px");
                iFrame.css("height",(Number((iFrameHeight.substr(0,iFrameHeight.length-2)))+Y)+"px");
                imgShowDiv.css("height",(Number((imgShowDivHeight.substr(0,imgShowDivHeight.length-2)))+Y+6)+"px");
            }
        }

        function maxImg(){
            iFrame.css({
                top: 0,
                left : 0,
                width : pt.document.body.clientWidth,
                height : pt.document.body.clientHeight
            });
        }

        $.fn.extend({
            preventScroll:function(){
                $(this).each(function(){
                    var _this = this;
                    if(navigator.userAgent.indexOf('Firefox') >= 0){   //firefox
                        _this.addEventListener('DOMMouseScroll',function(e){
                            e.preventDefault();
                        },false);
                    }else{
                        _this.onmousewheel = function(e){
                            return false;
                        };
                    }
                })
            }
        });
	</script>
</head>
<body>
<div class="box">
	<header drag>
		<div class="winControl" noDrag>
			<span class="closeWin" title="关闭"><i class="icon_close-big"></i></span>
		</div>
	</header>
	<div class="gallery" style="cursor : move"><!-- <div class="imgTop" data-index="0"></div><div class="imgRight" data-index="1"></div><div class="imgDown" data-index="0"></div><div class="imgLeft" data-index="1"></div>
		<div class="imgLeftTop" data-index="2"></div><div class="imgLeftDown" data-index="3"></div><div class="imgRightDown" data-index="4"></div>--></div>
</div>
<script>
    $.initGallery();
</script>
</body>
</html>