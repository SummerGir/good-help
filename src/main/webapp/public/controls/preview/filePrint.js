
//var htmldisplayUri;
//处理打印数据
function processData(postData) {
    // type：打印类型：预览，网络打印，下载    real_Path：文件路径
    // source：来自报表还是业务中心 "值为reportForms则表示不需要剪裁PDF"
    // quarry： 判断是否为附件 "值为attachment表示为附件,附件不显示打印按钮"
    // mainId：  打印数据主表ID       mainName : 打印数据来源名称，（自定义） ，"mainId 或mainName 值为空则表示非业务中心数据，不需要保存打印信息"
    // fileName: 在预览页面显示的文件名，可以为空，为空时显示文件物理名
    var fileType = postData.real_Path.substr(postData.real_Path.lastIndexOf(".") + 1).toLocaleLowerCase();
    if (postData.type == "networkPrint") {
        $("#select_email_column").modal();
    } else if ("txt,jpg,jpeg,png,gif,bmp".indexOf(fileType) < 0) {
        $.message.loader.open();
        $.post("/anon/changefiletype/getFileUri.do", {
            url: postData.real_Path,
            type: postData.type,
            source: postData.source
        }, function (rs) {
            $.message.loader.close();
            if (rs.flag) {
                if (postData.type == 'preView') {// 预览pdf文件
                    if (!EIIS.browser.phone) {
                        // window.open("/public/controls/preview/file_pc_preview.jsp?fileName=" + (postData.fileName || rs.fileName) + "&displayUri=" + rs.displayUri + "&mainId=" + postData.mainId + "&mainName=" + postData.mainName, "_blank")
                        window.open("/public/pdfjs/web/viewer.jsp?file=" + rs.pdfUri+ "&displayUri=" + rs.displayUri+"&mainId=" + postData.mainId + "&mainName=" + postData.mainName, "_blank");
                    } else {
                        // window.location.href = "/public/controls/preview/file_pc_preview.jsp?fileName=" + (postData.fileName || rs.fileName) + "&displayUri=" + rs.displayUri+"&quarry="+postData.quarry + "&mainId=" + postData.mainId + "&mainName=" + postData.mainName;
                        window.location.href = "/public/pdfjs/web/viewer.jsp?file=" + rs.pdfUri+ "&displayUri=" + rs.displayUri+"&mainId=" + postData.mainId + "&mainName=" + postData.mainName;

                    }
                } else if (postData.type == 'download') {// 下载pdf文件
                    if(postData.mainId){
                        plusPrintNum(postData.mainId,postData.mainName);
                    }
                    window.location.href = rs.downloadUri;
                }
            } else {
                $.message("文件转换读取出错！");
            }
        }, "json");
    } else {
        imgOrTxtPreView(postData.real_Path, fileType, postData.fileName)
    }
}

function plusPrintNum(mainId,mainName){
    mainName=mainName?mainName:"";
    $.ajax({
        type : "post",
        url : "/anon/changefiletype/plusPrintNum.do",
        data : {
            mainId : mainId,
            mainName : mainName
        }
    });
}

//图片及txt处理
function imgOrTxtPreView(filePath, fileType, fn) {
    var fileName = fn || filePath.substr(filePath.lastIndexOf("/") + 1);
    if (fileType == "txt") {
        $.message.loader.open();
        $.getJSON("/public/controls/document/document.plugin.readbyhtmlTextAction.jsp", {filePath: filePath}, function (res) {
            $.message.loader.close();
            if (res.flag) {
                window.location.href = "/public/controls/preview/txtPreview.jsp?fileName=" + fileName + "&filePath=" + filePath;
            } else {
                $.message("文件转换读取出错！");
                return
            }
        });
    } else {
        $.message.loader.open();
        $.getJSON("/public/controls/document/document.plugin.readbyhtmlImgAction.jsp", {filePath: filePath}, function (res) {
            $.message.loader.close();
            if (res.flag) {
                $.gallery(res.displayUri);
            } else {
                $.message("文件转换读取出错！");
                return
            }
        });
    }
}
