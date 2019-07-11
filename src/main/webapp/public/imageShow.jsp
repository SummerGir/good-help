<div id="imageShow" style="position: fixed;left:0px;top:0px;width: 300px;height:200px;display: none;z-index: 9999"></div>
<script type="text/javascript">
    var initDivWidth=0;
    var initDivHeight=0;
    var maxState=true;
    var moveState=true;
    var nowMaxState=false;
    var params={};
    function moveImg(pageX,pageY){
        if(moveState && !nowMaxState){
            var imgDiv=$("#imageShow");
            var tl=imgDiv.offset();
            imgDiv.offset({
                left : tl.left+pageX,
                top : tl.top+pageY
            });
        }
    }
    $(function(){
        var imgDiv=$("#imageShow");
        var width=document.body.clientWidth;
        var height=document.body.clientHeight;

        initDivWidth=parseInt(width/2);
        initDivHeight=parseInt(height/1.7);
        imgDiv.css("width",initDivWidth+"px");
        imgDiv.css("height",initDivHeight+"px");

        imgDiv.offset({
            left : (initDivWidth/2),
            top : 0
        });
    });

    function changeImgDivWidth(width){
        $("#imageShow").css(width+"px");
    }

    function imgBodyMove(state){
        var imgDiv=$("#imageShow");
        if(state){
            params.top=imgDiv.css("top");
            params.left=imgDiv.css("left");
            imgDiv.css({
                width : "100%",
                height : "100%",
                top : 0,
                left :0
            });
            moveState=false;
            nowMaxState=true;
        }else{
            moveState=true;
            nowMaxState=false;
            imgDiv.css({
                top : params.top,
                left : params.left
            });
        }
    }
</script>