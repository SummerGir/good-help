var _imgURL;

$(window).load(function () {
    $.ajax({
        url:"/app/file/getMainInfo.do",
        data:{},
        type:"post",
        dataType:'json',
        success:function (rs) {
            for(var i=0;i<rs.length;i++){
                var file = rs[i];
                var modal_file = $("div[name='modal_file']").clone();
                $(modal_file).find(".box-head-left").text(file.fileName);
                $(modal_file).find(".box-body img").attr("src",file.filePath);
                $(modal_file).find(".box-head-right i").attr("data-str",i);
                $("#file_Content").append($(modal_file).html());
            }

            $(".pimg").click(function () {
                var _this = $(this);//将当前的pimg元素作为_this传入函数
                imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);

            });

        }
    })

});
// $("#sub").click(function () {
//     $("#frm-reg").ajaxSubmit(function (data) {
//         alert(data.Message);
//     });
// });

function add_file() {
    $("#details_modal input,#details_modal textarea").each(function () {
       $(this).val("");
    });

    $("#img-change").css("display","none");

    $('#details_modal').modal('show');
}
var filechange=function(event){
    var files = event.target.files, file;
    if (files && files.length > 0) {
        // 获取目前上传的文件
        file = files[0];// 文件大小校验的动作
        if(file.size > 1024 * 1024 * 2) {
            alert('图片大小不能超过 2MB!');
            return false;
        }
        // 获取 window 的 URL 工具
        var URL = window.URL || window.webkitURL;
        // 通过 file 生成目标 url
        var _imgURL = URL.createObjectURL(file);
        //用attr将img的src属性改成获得的url
        $("#img-change").css("display","block");
        $("#img-change").attr("src",_imgURL);
        // 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
        // URL.revokeObjectURL(imgURL);
        // console.log(_imgURL);
    }
};
$("#fileInput").click(function () {
    $("#img-change").css("display","none");
});
$("#img-change").click(function () {
    $("#fileInput").click();
});

function save_file() {
    var flag = true;
    var postData = {};
    $("#details_modal input,#details_modal select,#details_modal textarea").each(function () {
        var name = $(this).attr("name");
        if($(this).attr("required") && !$(this).val()){
            $(this).css("border","1px solid red");
            flag = false;
            $.message($(this).prev().text() + " 不能为空!");
            return;
        }else {
            postData[name] = $(this).val();
        }
    });
    console.log(postData);
    if(!flag) return;
    $.ajax({
        url:"/app/file/saveMain.do",
        data:postData,
        type:"post",
        dataType:'json',
        success:function (rs) {

        }
    })

}





function imgShow(outerdiv, innerdiv, bigimg, _this) {

    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性

    $(bigimg).attr("src", src);//设置#bigimg元素的src属性

    /*获取当前点击图片的真实大小，并显示弹出层及大图*/

    $("<img/>").attr("src", src).load(function () {

        var windowW = $(window).width(); //获取当前窗口宽度

        var windowH = $(window).height(); //获取当前窗口高度

        var realWidth = this.width; //获取图片真实宽度

        var realHeight = this.height; //获取图片真实高度

        var imgWidth, imgHeight;

        var scale = 0.8; //缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放



        if (realHeight > windowH * scale) { //判断图片高度

            imgHeight = windowH * scale; //如大于窗口高度，图片高度进行缩放

            imgWidth = imgHeight / realHeight * realWidth; //等比例缩放宽度

            if (imgWidth > windowW * scale) { //如宽度扔大于窗口宽度

                imgWidth = windowW * scale; //再对宽度进行缩放

            }

        } else if (realWidth > windowW * scale) { //如图片高度合适，判断图片宽度

            imgWidth = windowW * scale; //如大于窗口宽度，图片宽度进行缩放

            imgHeight = imgWidth / realWidth * realHeight; //等比例缩放高度

        } else { //如果图片真实高度和宽度都符合要求，高宽不变

            imgWidth = realWidth;

            imgHeight = realHeight;

        }

        $(bigimg).css("width", imgWidth); //以最终的宽度对图片缩放



        var w = (windowW - imgWidth) / 2; //计算图片与窗口左边距

        var h = (windowH - imgHeight) / 2; //计算图片与窗口上边距

        $(innerdiv).css({ "top": h, "left": w }); //设置#innerdiv的top和left属性

        $(outerdiv).fadeIn("fast"); //淡入显示#outerdiv及.pimg

    });



    $(outerdiv).click(function () {  //再次点击淡出消失弹出层

        $(this).fadeOut("fast");

    });

}

