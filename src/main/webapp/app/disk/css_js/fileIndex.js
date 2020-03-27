var _imgURL;
var _fileInfo = {};

$(window).load(function () {
    // getMainInfo(_treeNode.treeId);

});

function getMainInfo(treeNode) {
    $("#file_Content").empty();
    $.ajax({
        url:"/app/file/getMainInfo.do",
        data:{"fileTreeId":treeNode},
        type:"post",
        dataType:'json',
        success:function (rs) {
            for(var i=0;i<rs.length;i++){
                var file = rs[i];
                //组装方块
                var modal_file = $("div[name='modal_file']").clone();
                $(modal_file).find(".box-head-left").text(file.fileName);
                $(modal_file).find(".box-body img").attr("src",file.filePath);
                $(modal_file).find(".box-head-right i").attr("data-str",file.fileId);
                $(modal_file).find(".box-head-right a").attr("data-str",file.fileId);
                $(modal_file).find(".box-head-right a").attr("href","/app/file/downLoadMain.do?fileId="+file.fileId);
                $("#file_Content").append($(modal_file).html());
                //填充数据
                var singleInfo = {};
                singleInfo["fileId"] = file.fileId;
                singleInfo["fileTreeId"] = file.fileTreeId;
                singleInfo["fileName"] = file.fileName;
                singleInfo["filePath"] = file.filePath;
                singleInfo["createdTime"] = file.createdTime;
                singleInfo["systime"] = file.systime;
                singleInfo["comment"] = file.comment;
                _fileInfo[file.fileId] = singleInfo;
            }
            $("#file_Content").find(".box-head-right #edit").unbind("click").bind("click",function () {
                edit_file($(this).attr("data-str"));
            });
            $("#file_Content").find(".box-head-right #delete").unbind("click").bind("click",function () {
                delete_file($(this).attr("data-str"));
            });
            $(".pimg").click(function () {
                var _this = $(this);//将当前的pimg元素作为_this传入函数
                imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
            });
            alterImgSize();
        }
    })
}

function alterImgSize() {
    $(".pimg").each(function(i){
        var img = $(this);
        var realWidth;//真实的宽度
        var realHeight;//真实的高度
        //这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
        $("<img/>").attr("src", $(img).attr("src")).load(function() {
            /*
              如果要获取图片的真实的宽度和高度有三点必须注意
              1、需要创建一个image对象：如这里的$("<img/>")
              2、指定图片的src路径
              3、一定要在图片加载完成后执行如.load()函数里执行
             */
            realWidth = this.width;
            realHeight = this.height;
            //如果真实的宽度大于浏览器的宽度就按照100%显示
            if(realWidth > realHeight){
                var n = Math.round((200 - (realHeight /  realWidth  * 200)) / 2)-30;
                $(img).css("width","100%").css("height","auto").css("padding-top",n).css("display","inline");
                // $(img).css("width","100%").css("height","auto").css("padding-top",n)
            }else {
                $(img).css("height","100%").css("width","auto").css("display","inline");
                // $(img).css("height","100%").css("width","auto")
            }

        });
    });
}


function edit_file(fileId) {
    var file_info = _fileInfo[fileId];
    $("#details_modal input,#details_modal textarea").each(function (i,o) {
        if($(o).attr("type") == "file"){
            $(o).css("display","none");
        }else {
            var name = $(o).attr("name");
            var val = file_info[name];
            $(o).val(val);
        }
    });
    $("#img-change").attr("src",file_info.filePath);
    $("#img-change").css("display","block");
    $('#details_modal').modal('show');
}

function delete_file(fileId) {
    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除此数据?"
        ,result:function(result){
            if(result == $.message.result.yes){
                $.post(
                    "/app/file/deleteMain.do",
                    {fileId : fileId},
                    function(rs) {
                        $.message(rs.msg);
                        if (rs.error == 0) {
                            getMainInfo(_treeNode.treeId);
                        }
                     },
                    "json");
            }
        }
    });
}



function add_file() {
    if(_treeNode == null || (_treeNode["children"] != null)){
        $.message("请先选中一个可用的节点数据！");
        return;
    }


    $("#details_modal input,#details_modal textarea").each(function () {
        if($(this).attr("type") == "file"){
            $(this).css("display","block");
        }
        $(this).val("");
        if($(this).attr("name") == "fileTreeId"){
            $(this).val(_treeNode.treeId);
        }
    });

    $("#img-change").css("display","none");

    $('#details_modal').modal('show');
}


function filechange(event){
    var files = event.target.files, file;
    if (files && files.length > 0) {
        // 获取目前上传的文件
        file = files[0];// 文件大小校验的动作
        // if(file.size > 1024 * 1024 * 2) {
        //     alert('图片大小不能超过 2MB!');
        //     return false;
        // }
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
}

$("#fileInput").click(function () {
    $("#img-change").css("display","none");
});








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



function submitForm() {
    var flag = true;
    var isEdit = false;
    if($("#details_modal input[name='fileId']").val()){
        isEdit = true;
    }
    if(isEdit){
        $("#details_modal input[type='file']").removeAttr("required");
    }
    $("#details_modal input").each(function () {
        if(!$(this).val() && $(this).attr("required")){
            flag = false;
            $(this).css("border", "1px solid red");
            $.message($(this).prev().text() + " 不能为空!");
            return false;
        }
    });
    if(!flag){
        return;
    }
    // jquery 表单提交
    $("#saveReportForm").ajaxSubmit(function(result) {
        // 对于表单提交成功后处理，result为表单正常提交后返回的内容
        if(result.error == 0){
            $.message(result.msg);
            $('#details_modal').modal('hide');
            getMainInfo(_treeNode.treeId);
        }

    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转

}
