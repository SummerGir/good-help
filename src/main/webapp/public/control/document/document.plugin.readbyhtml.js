(function ($, undefined) {

    var _dialogHTML = null;
    var getDialogHTML = function () {
        if (_dialogHTML == null) {
            $.ajax({
                url: "/public/controls/document/document.plugin.readbyhtml.jsp",
                async: false,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    _dialogHTML = data;
                }
            });
        }
        return _dialogHTML;
    };

    var _displayUriMap = new HashMap();
    var _pdfUriMap = new HashMap();
    var createDialog = function (filePath, callback, args) {
        var caption = filePath.substr(filePath.lastIndexOf("/")+1);
    /*    var jqDialog = $(getDialogHTML());
        jqDialog.find(".modal-header>.modal-title").text(caption);
        jqDialog.modal("show");
        var iFrame = $('<iframe id="phone_view" scrolling="no" frameborder="0" width="100%"></iframe>').load(function(){
            var ifm = document.getElementById("phone_view");
            var subWeb = document.frames ? document.frames["phone_view"].document : ifm.contentDocument;
            if (ifm != null && subWeb != null) {
                if (navigator.userAgent.indexOf("iPhone") >= 0) {
                    ifm.height = document.body.scrollHeight - 100;
                } else {
                    ifm.height = subWeb.body.scrollHeight;
                }
            }
        });
*/
        if(!_displayUriMap.containsKey(filePath)){
            $.message.loader.open();
            $.getJSON("/public/controls/document/document.plugin.readbyhtmlAction.jsp",{filePath:filePath},function(res){
                $.message.loader.close();
                if(res.flag){
                    // _displayUriMap.put(filePath,res.displayUri);
                    // window.location.href = "/public/controls/preview/file_pc_preview.jsp?fileName=" + caption + "&displayUri=" + res.displayUri+"&quarry=attachment";
                    _displayUriMap.put(filePath,res.pdfUri);
                    _pdfUriMap.put(filePath,res.displayUri);

                    // window.location.href = "/public/pdfjs/web/viewer.jsp?file=" + res.pdfUri + "&displayUri=" + res.displayUri;

                    var pdfContainer=$("#pdfContainer");
                    if(pdfContainer.length===0){
                        var body=$("body");
                        var w=body.width(),h=body.height();
                        body.append("<div id='pdfContainer' style='width: "+w+"px;height: "+h+"px;position: absolute;top: 0;left: 0;z-index: 1111111;'></div>");
                        pdfContainer=$("#pdfContainer");
                    }
                    pdfContainer.empty().append("<iframe style='width: 100%;height: 100%' src='/public/pdfjs/web/viewer.jsp?file="+res.pdfUri+"&displayUri="+res.displayUri+"'></iframe>");

                    //iFrame.attr("src",res.displayUri);
                    //jqDialog.find("#dengdai").empty().append(iFrame);
                }else {
                    $.message("文件转换读取出错！");
                    //jqDialog.find("#dengdai").text("文件转换读取出错！");
                }
            });
        }else {
            // window.location.href = "/public/controls/preview/file_pc_preview.jsp?fileName=" + caption + "&displayUri=" + _displayUriMap.get(filePath)+"&quarry=attachment";
            // window.location.href = "/public/pdfjs/web/viewer.html?file=" + res.pdfUri + "&displayUri=" + _displayUriMap.get(filePath);

            var pdfContainer=$("#pdfContainer");
            if(pdfContainer.length===0){
                var body=$("body");
                var w=body.width(),h=body.height();
                body.append("<div id='pdfContainer' style='width: "+w+"px;height: "+h+"px;position: absolute;top: 0;left: 0;z-index: 1111111;'></div>");
                pdfContainer=$("#pdfContainer");
            }
            pdfContainer.empty().append("<iframe style='width: 100%;height: 100%' src='/public/pdfjs/web/viewer.jsp?file="+_displayUriMap.get(filePath)+"&displayUri="+_pdfUriMap.get(filePath)+"'></iframe>");

            //iFrame.attr("src",_displayUriMap.get(filePath));
            //jqDialog.find("#dengdai").empty().append(iFrame);
        }
        //return jqDialog;
    };

    var createDialogText = function (filePath, callback, args) {
        var caption = filePath.substr(filePath.lastIndexOf("/")+1);
    /*    var jqDialog = $(getDialogHTML());
        jqDialog.find(".modal-header>.modal-title").text(caption);
        jqDialog.modal("show");
        var h = 90;
        if(navigator.userAgent.indexOf("iPhone") >= 0) h = 30; //ios浏览器
        jqDialog.find("#dengdai").height($(window).height()-h);*/
        if(!_displayUriMap.containsKey(filePath)){
            $.message.loader.open();
            $.getJSON("/public/controls/document/document.plugin.readbyhtmlTextAction.jsp",{filePath:filePath},function(res){
                $.message.loader.close();
                if(res.flag){
                    _displayUriMap.put(filePath,res.textContent);
                    var pdfContainer=$("#pdfContainer");
                    if(pdfContainer.length===0){
                        var body=$("body");
                        var w=body.width(),h=body.height();
                        body.append("<div id='pdfContainer' style='width: "+w+"px;height: "+h+"px;position: absolute;top: 0;left: 0;z-index: 1111111;'></div>");
                        pdfContainer=$("#pdfContainer");
                    }
                    pdfContainer.empty().append("<iframe style='width: 100%;height: 100%' src='/public/controls/preview/txtPreview.jsp?fileName="+caption+"&filePath="+filePath+"'></iframe>");
                    // window.location.href = "/public/controls/preview/txtPreview.jsp?fileName=" + caption + "&filePath=" + filePath;
                    //var textarea = $("<textarea readonly style=\"border: 0px;width: 100%;height: 100%;font-size: 16px;\" />").append(res.textContent);
                    //jqDialog.find("#dengdai").empty().append(textarea);
                }else {
                    $.message("文件转换读取出错！");
                    //jqDialog.find("#dengdai").text("文件转换读取出错！");
                }
            });
        }else {
            var pdfContainer=$("#pdfContainer");
            if(pdfContainer.length===0){
                var body=$("body");
                var w=body.width(),h=body.height();
                body.append("<div id='pdfContainer' style='width: "+w+"px;height: "+h+"px;position: absolute;top: 0;left: 0;z-index: 1111111;'></div>");
                pdfContainer=$("#pdfContainer");
            }
            pdfContainer.empty().append("<iframe style='width: 100%;height: 100%' src='/public/controls/preview/txtPreview.jsp?fileName="+caption+"&filePath="+filePath+"'></iframe>");
            // window.location.href = "/public/controls/preview/txtPreview.jsp?fileName=" + caption + "&filePath=" + filePath;
            //var textarea = $("<textarea readonly style=\"border: 0px;width: 100%;height: 100%;font-size: 16px;\" />").append(_displayUriMap.get(filePath));
            //jqDialog.find("#dengdai").empty().append(textarea);
        }
        //return jqDialog;
    };

    var createDialogImg = function (filePath, callback, args) {
        filePath="http://"+location.host+"/public/controls/document/preview.jsp?url="+encodeURIComponent(filePath);
        showImage(filePath);
        return;
        var caption = filePath.substr(filePath.lastIndexOf("/")+1);
       /* var jqDialog = $(getDialogHTML());
        jqDialog.find(".modal-header>.modal-title").text(caption);
        jqDialog.modal("show");
        var h = 90; //android浏览器要减掉的高度
        if(navigator.userAgent.indexOf("iPhone") >= 0) h = 30; //ios浏览器
        jqDialog.find("#dengdai").height($(window).height()-h);*/
        var trs=$(".document-list tr");
        var srcs=[];
        $.each(trs,function(i){
            i+=1;
            if(i%2!=0){
                var _this=$(this);
                var img=_this.children("td").eq(0).children();
                var src=img.attr("src");
                var temp="/file/display"+src.substr(src.indexOf("?url")+5);
                srcs.push(temp.replace(/%2F/g,"/"));
            }
        });
        localStorage.removeItem("srcs");
        localStorage["srcs"]=srcs;
        $.message.loader.open();
        $.getJSON("/public/controls/document/document.plugin.readbyhtmlImgAction.jsp",{filePath:filePath},function(res){
            $.message.loader.close();
            if(res.flag){
                window.location.href = "/public/imgSowi.jsp?src=" + res.displayUri+"&fileName=" + caption;
                //window.location.href = "/public/controls/preview/imgPreview.jsp?fileName=" + caption + "&displayUri=" + res.displayUri;
                //var img = $("<img width='100%'/>").attr("src",res.displayUri);
                //jqDialog.find("#dengdai").empty().append(img);
            }else {
                $.message("文件转换读取出错！");
                //jqDialog.find("#dengdai").text("文件转换读取出错！");
            }
        });

        //return jqDialog;
    };

    var canRead = function () {
        if (isUsable()) {
            return {
                caption: "用浏览器阅读",
                execute: function (filePath, callback, args) {
                    var jqDialog = createDialog(filePath, callback, args);
                }
            };
        }
        return null;
    };

    var canReadText = function () {
        if (isUsable()) {
            return {
                caption: "用浏览器阅读",
                execute: function (filePath, callback, args) {
                    var jqDialog = createDialogText(filePath, callback, args);
                }
            };
        }
        return null;
    };

    var canReadImg = function () {
        if (isUsable()) {
            return {
                caption: "用浏览器阅读",
                execute: function (filePath, callback, args) {
                    var jqDialog = createDialogImg(filePath, callback, args);
                }
            };
        }
        return null;
    };

    var _isUsable = null;
    var isUsable = function () {
        if (EIIS.browser.phone) {
            _isUsable = true;
        }
        return _isUsable;
    };

    $.fn.document.plugins.register("readbyhtml", {
        "doc": {
            isUsable: isUsable,
            icon: "fa fa-file-word-o",
            canRead: canRead
        },
        "docx": {
            isUsable: isUsable,
            icon: "fa fa-file-word-o",
            canRead: canRead
        },
        "xls": {
            isUsable: isUsable,
            icon: "fa fa-file-excel-o",
            canRead: canRead
        },
        "xlsx": {
            isUsable: isUsable,
            icon: "fa fa-file-excel-o",
            canRead: canRead
        },
        "ppt": {
            isUsable: isUsable,
            icon: "fa fa-file-powerpoint-o",
            canRead: canRead
        },
        "pptx": {
            isUsable: isUsable,
            icon: "fa fa-file-powerpoint-o",
            canRead: canRead
        },
        "pdf": {
            isUsable: isUsable,
            icon: "fa fa-file-pdf-o",
            canRead: canRead
        },
        "txt":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadText
        },
        "xml":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadText
        },
        "jpg":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadImg
        },
        "jpeg":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadImg
        },
        "png":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadImg
        },
        "gif":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadImg
        },
        "bmp":{
            isUsable:isUsable,
            icon:"fa fa-file-pdf-o",
            canRead: canReadImg
        }
    });
})(jQuery);

function closePDF(){
    $("#pdfContainer").remove();
}