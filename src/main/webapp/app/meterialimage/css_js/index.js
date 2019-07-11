
$(window).load(function(){
    clone_my_nav("need-nav");

});

//添加记录的窗体处理
//            formValidate("ffAdd", function (form) {
//                $("#add").modal("hide");
//                //构造参数发送给后台
//                var postData = $("#ffAdd").serializeArray();
//                $.post(url, postData, function (json) {
//                    var data = $.parseJSON(json);
//                    if (data.Success) {
//                        //增加肖像的上传处理
//                        initPortrait(data.Data1);//使用写入的ID进行更新
//                        $('#file-Portrait').fileinput('upload');
//                        //保存成功  1.关闭弹出层，2.刷新表格数据
//                        showTips("保存成功");
//                        Refresh();
//                    }
//                    else {
//                        showError("保存失败:" + data.ErrorMessage, 3000);
//                    }
//                }).error(function () {
//                    showTips("您未被授权使用该功能，请联系管理员进行处理。");
//                });
//            });
// function initPortrait(ctrlName, id) {
//     var control = $('#' + ctrlName);
//     var imageurl = '/PictureAlbum/GetPortrait?id=' + id + '&r=' + Math.random();
//     //重要，需要更新控件的附加参数内容，以及图片初始化显示
//     control.fileinput('refresh', {
//         uploadExtraData: { id: id },
//         initialPreview: [ //预览图片的设置
//             "<img src='" + imageurl + "' class='file-preview-image' alt='肖像图片' title='肖像图片'>",
//         ],
//     });
// }
//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlName, uploadUrl) {
    var control = $('#' + ctrlName);

    var path = [
        "/file/display/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
    ]
    var con = [
        {caption: "People-1.jpg", size: 576237, width: "120px", url: "", key: 1}
    ]
    // displayUri: "/file/display/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
    // downloadUri: "/file/download/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
    // fileInfoUri: "/file/info/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
    // name: "20190711133350.png"
    // path: "E:\good-helper\target\SpringMvcTest\WEB-INF\fileStorage\temp\20190711\0dfb8bd5-b87c-11e7-96df-64510645b30a\e04cf38c-8bf8-4ef7-953a-6803ead5d6ed\20190711133350.png"
    // relativePath: "/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
    // size: 432171
    // webDavUri: "/file/webdav/temp/20190711/0dfb8bd5-b87c-11e7-96df-64510645b30a/e04cf38c-8bf8-4ef7-953a-6803ead5d6ed/20190711133350.png"
//                var path = [
//                    "http://lorempixel.com/800/460/nature/1",//图片的地址
//                    "http://lorempixel.com/800/460/nature/2",
//                ]
//                var con = [
//                    {caption: "People-1.jpg", size: 576237, width: "120px", url: "/site/file-delete", key: 1},
//                ]
    $('#' + ctrlName).fileinput({
        uploadUrl: uploadUrl, //上传到后台处理的方法
        uploadAsync: false, //设置同步，异步 （同步）
        language: 'zh', //设置语言
        showUpload: false,
        showCancel:false,//显示取消按钮
        showZoom:false,//显示预览按钮
        showCaption: false,//是否显示文本框
        showRemove:false,//是否显示删除按钮
        hideThumbnailContent:false,//是否隐藏文件内容
        fileActionSettings: {                               // 在预览窗口中为新选择的文件缩略图设置文件操作的对象配置
            showRemove: true,                                   // 显示删除按钮
            showUpload: true,                                   // 显示上传按钮
            showDownload: false,                            // 显示下载按钮
            showZoom: false,                                    // 显示预览按钮
            showDrag: false,                                        // 显示拖拽
//                        removeIcon: '<i class="fa fa-trash"></i>',   // 删除图标
//                        uploadIcon: '<i class="fa fa-upload"></i>',     // 上传图标
//                        uploadRetryIcon: '<i class="fa fa-repeat"></i>'  // 重试图标
        },

//                    showPreview: false,//是否预览
//                    browseClass: "btn btn-primary btn-lg",//浏览按钮样式
//                    uploadClass:"layui-btn",//上传按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        dropZoneEnabled:false,//是否可拖拽
        uploadLabel:"上传附件",//上传按钮文本
        browseLabel: '选择附件',
//                    uploadExtraData: {'taskId':taskId,'createBy':userId,'createByname':username},   // 上传数据
        maxFileSize: 1000,//上传文件大小上限
        maxFilesNum: 10,//上传文件大小下限
        minFileCount: 1,// 最小上传数量
        maxFileCount: 5,// 最大上传数量
        overwriteInitial: false, //是否覆盖初始预览内容和标题设置
        allowedFileExtensions: ['jpg', 'png', 'gif'],//允许上传的文件类型
//                    fileType: "any",
        //下面几个就是初始化预览图片的配置
        initialPreviewAsData: true,
        initialPreviewFileType: 'image',
        initialPreview:path , //要显示的图片的路径
        initialPreviewConfig:con
    });

    control.on('filepreupload', function(event, data, previewId, index) {
        console.log(event);
        console.log(data);
        console.log(previewId);
        console.log(index);
    });
    control.on('fileselect', function(event, n, l) {
        console.log("选择文件：" + l + ",数量：" + n);
        console.log(event.currentTarget);
        $(event.currentTarget).fileinput('upload');
    });
    control.on('fileselectnone', function() {
        console.log("你没有选择任何文件")
    });
    control.on('filebrowse', function() {
        console.log("上传文件")
    });
}
function add_main(){

    $('#my_modal').modal('show');
}

function edit_main(){

    $('#my_modal').modal('show');
}

//重置
function search_show(form){
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        $(this).val("");
    });
    $(".need-nav input[name='queryData']").val(queryData);

    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    postData["queryData"] = queryData;

    $('#'+form).modal('hide');
}

//搜索
function getSearch(form){
    var postData = {};
    $("#"+form+" input,#"+form+" select").each(function(){
        var name = $(this).attr("name");
        postData[name] = $(this).val();
    });
    postData["queryData"] = "";

    $('#'+form).modal('hide');
}

