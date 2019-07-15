(function ($, undefined) {

    var uploadJs = "document.upload.html5.js?v=1";

    $.fn.document.addSupportComponent({
        css: [$.fn.document.basePath + "document.upload.css"],
        js: ["/public/js/exif.js",$.fn.document.basePath + uploadJs]
    });


    $.fn.document.upload = function (document, button) {
        var self = this;
        self._document = document;
        self._jqButton = button;


        /*$.fn.document.initSupportComponents(function(){
         self.create.call(self);
         });*/




        self.create();
        return self;
    };
    $.fn.document.upload.saveUrl = "/file/save/";
    $.fn.document.upload.excelUrl = "/public/excel/in";
    $.fn.document.upload.maxConnection = 3;

    $.fn.document.upload.initElement = function (fileObject, cancelFn) {
        fileObject.element.find(".document-info")
            .empty().append(
            $("<span/>").text(fileObject.name)
        );
        fileObject.element.find(".document-size")
            .empty().append(
            $("<span/>").text("等待上传...")
        );
        $.fn.document.upload.drawCancelButton(fileObject, cancelFn);
    };

    $.fn.document.upload.initUploadFile = function (documentInstance, name) {
        var eventData = {
            name: name,
            cancel: false
        };
        documentInstance._jqElement.triggerHandler("upload.document", [eventData]);
        if (eventData.cancel) return "";

        var jqFile = documentInstance._put(name);
        if ($.type(jqFile) === "string") {
            //$.message(jqFile);
            return jqFile;
        }
        //documentInstance._refreshPanel();
        return jqFile;
    };

    $.fn.document.upload.drawCancelButton = function (fileObject, cancelFn) {
        fileObject.element.find(".document-button")
            .empty().append(
            $("<button class=\"btn btn-warning\"><i class=\"glyphicon glyphicon-ban-circle\"></i><span>取消</span></button>")
                .data("fileObject", fileObject)
                .on("click", function () {
                    cancelFn($(this).data("fileObject"))
                })
        );
    };

    $.fn.document.upload.error = function (fileObject, errMessage) {
        fileObject.element.find(".document-size")
            .empty().append(
            $("<span class=\"label label-danger\" />")
                .text(errMessage)
        );
        fileObject.element.find(".document-button")
            .empty();
    };

    $.fn.document.upload.imageZoomParam = function (width, height) {
        var maxWidth = 80, maxHeight = 80;
        var param = {top: 0, left: 0, width: width, height: height};
        if (width > maxWidth || height > maxHeight) {
            rateWidth = width / maxWidth;
            rateHeight = height / maxHeight;

            if (rateWidth > rateHeight) {
                param.width = maxWidth;
                param.height = Math.round(height / rateWidth);
            } else {
                param.width = Math.round(width / rateHeight);
                param.height = maxHeight;
            }
        }

        param.left = Math.round((maxWidth - param.width) / 2);
        param.top = Math.round((maxHeight - param.height) / 2);
        return param;
    };
    $.fn.document.upload.imageZoomParam2 = function (imageWidth,imageHeight,maxWidth,maxHeight) {
        var ib =imageWidth/imageHeight;
        var mb = maxWidth/maxHeight;
        var w =imageWidth ,h=imageHeight;
        if(ib> mb && imageWidth>maxWidth){
            w=maxWidth;
            h=imageHeight*(maxWidth/imageWidth);
        }else if(imageHeight > maxHeight){
            h=maxHeight;
            w=imageWidth*(maxHeight/imageHeight);
        }
        return {
            w: w.toFixed(0),
            h: h.toFixed(0)
        }
    };


})(jQuery);