(function ($, undefined) {

    $.fn.document.upload.prototype = {
        _document: null,
        _jqButton: null,
        _jqFile: null,
        _fileQueue: [],
        _connection: 0,
        _isExcelUpload: false,
        _submit: function () {
            var self = this;
            if (self._fileQueue.length == 0 || self._connection >= $.fn.document.upload.maxConnection) {
                return;
            }
            self._connection++;

            var fileObject = self._fileQueue.shift();

            fileObject.xhr = new XMLHttpRequest();

            fileObject.jqProgress = $("<div class=\"progress-bar progress-bar-warning\" style=\"width:0%;\">0%</div>");
            fileObject.element.find(".document-size")
                .empty().append(
                $("<div class=\"progress progress-striped active\" />")
                    .append(fileObject.jqProgress)
            );

            $.fn.document.upload.drawCancelButton(fileObject, Function.createDelegate(self, function (fileObject) {
                fileObject.xhr.abort();
            }));

            var uploadProgress = function (evt) {
                if (evt.lengthComputable) {
                    var value = Math.round(evt.loaded / evt.total * 100);
                    if (value >= 100) value = 99;
                    value += "%";
                    fileObject.jqProgress.css("width", value).text(value);
                }
                else {
                    fileObject.jqProgress.css("width", "0%").text("0%");
                }
            };

            var uploadFailed = function (evt) {
                $.fn.document.upload.error(fileObject, "上传文件失败!");
                updateFinish(evt);
            };

            var uploadCanceled = function (evt) {
                self._document._remove(fileObject.id);
                updateFinish(evt);
            };

            var uploadComplete = function (evt) {
                var response;
                try {
                    response = $.parseJSON(evt.target.responseText);
                } catch (err) {
                    response = null;
                }
                if ($.type(response) === "array") {
                    fileObject.element.attr({
                        "data-sendName" : response[0].sendName,
                        "data-sendTime" : response[0].sendTime
                    });
                    self._document._update(fileObject.id,
                        response[0].uri,
                        response[0].size);
                    self._document._setStatus(fileObject.id, $.fn.document.status.VALID);
                }else if(self._isExcelUpload){

                } else {
                    $.fn.document.upload.error(fileObject, evt.target.status + "  " + evt.target.statusText + "\r\n\r\n" + jQuery.ajaxErrorMessager(evt.target));
                }
                updateFinish(evt);
            };

            var updateFinish = function (evt) {
                delete fileObject;
                self._connection--;
                self._submit();
            };
            var fd = new FormData();
            fd.append("fileToUpload", fileObject.file);
            fd.append("fileName", fileObject.file.name);
            fd.append("infoExtend", self._document.option.infoExtend);

            fileObject.xhr.upload.addEventListener("progress", uploadProgress, false);
            fileObject.xhr.addEventListener("load", uploadComplete, false);
            fileObject.xhr.addEventListener("error", uploadFailed, false);
            fileObject.xhr.addEventListener("abort", uploadCanceled, false);
            //上传excel回调
            if(self._isExcelUpload) {
                fileObject.xhr.onreadystatechange = function (d) {
                    if(fileObject.xhr.readyState==4 && fileObject.xhr.status==200 && d.target.response!="{}"){
                        var dataJSON = JSON.parse(d.target.response);
                        var mainData = JSON.parse(dataJSON.mainData);
                        var excelData = eval(dataJSON.excelData);
                        mainData.costProjectId = projectId;
                        if(dataJSON.error && dataJSON.error==1){
                            alert('上传失败');
                        }else {
                            var formDa = {
                                costMain: mainData,
                                costDataList: excelData
                            };
                            $.ajax({
                                type : "post",
                                async: false,
                                url : "/excel/upload.do",
                                contentType : 'application/json;charset=utf-8',
                                data : JSON.stringify(formDa),
                                dataType : "json",
                                success : function(rs){
                                    if(rs.error==0)
                                        window.location.href="";
                                }
                            })
                        }
                    }
                }
            }
            var url = self._isExcelUpload?$.fn.document.upload.excelUrl:$.fn.document.upload.saveUrl;
            fileObject.xhr.open("POST", url);
            fileObject.xhr.send(fd);
            if(!self._isExcelUpload)
                self._submit();
        },
        _cancel: function (fileObject) {
            this._fileQueue.remove(fileObject);
            this._document._remove(fileObject.id);
        },
        _create: function () {
            var self = this;
            if(self._jqFile && $(self._jqFile).attr('excelupload'))
                self._isExcelUpload = $(self._jqFile).attr('excelupload');
            self._jqFile = self._jqButton.find(":file");
            if (self._jqFile.length == 0) {
                self._jqFile = $("<input type=\"file\" />");
                self._jqFile.appendTo(self._jqButton);
            }
            if(self._isExcelUpload){
                self._jqFile.attr("excelupload", self._isExcelUpload);
            }
            if (self._document.option.multiple) {
                self._jqFile.prop("multiple", true);
            } else {
                self._jqFile.prop("multiple", false);
            }
            self._jqFile.on('change', Function.createDelegate(self, self._change));
        },
        _change: function () {
            var self = this;
            var files = self._jqFile[0].files;
            if (files.length == 0) {
                return false;
            }

            self._jqFile.remove();
            self._create();

            var errorMessage = [];
            var errorNames1=[];
            var errorNames2=[];
            var isZoomImg = 0;
            for (var i = 0, j = files.length; i < j; i++) {
                var fileObject = {};
                fileObject.file = files[i];
                fileObject.name = $.fn.document.getFileName(fileObject.file.name);
                if(fileObject.name.replace(/%/g,"")!=fileObject.name){
                    errorNames1.push(fileObject.name);
                    continue;
                }
                if(fileObject.name.replace(/#/g,"")!=fileObject.name){
                    errorNames2.push(fileObject.name);
                    continue;
                }
                fileObject.element = $.fn.document.upload.initUploadFile(self._document, fileObject.name);

                if ($.type(fileObject.element) === "string") {
                    if (!String.isNullOrWhiteSpace(fileObject.element)) {
                        errorMessage.push(fileObject.element);
                    }
                    continue;
                }
                fileObject.id = fileObject.element.attr("id");
                $.fn.document.upload.initElement(fileObject, Function.createDelegate(self, self._cancel));

                if (fileObject.file.type.match('image.*')
                    && fileObject.file.size < 1048576) {//1MB
                    var reader = new FileReader();
                    reader.onload = (function (fileObject) {
                        return function (e) {
                            try {
                                fileObject.element.find(".document-preview")
                                    .empty().append(
                                    $("<img />")
                                        .on("load", function () {
                                            var rect = $.fn.document.upload.imageZoomParam(this.offsetWidth, this.offsetHeight);
                                            this.width = rect.width;
                                            this.height = rect.height;
                                            this.style.marginLeft = rect.left + 'px';
                                            this.style.marginTop = rect.top + 'px';
                                        })
                                        .attr("src", e.target.result)//预览图片的位置
                                );
                            } catch (e) {
                                if (e.number == -2147024882) {
                                    //alert("内存不足，无法预览。");
                                } else {
                                    throw e;
                                }
                            }
                        };
                    })(fileObject);

                    reader.readAsDataURL(fileObject.file);

                }

                if (fileObject.file.type.match('image.*') ) {
                    (function (fileObject) {
                        var src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ?
                            window.webkitURL.createObjectURL(fileObject.file) : window.URL.createObjectURL(fileObject.file);
                        var orientation="";
                        if(EIIS.browser.isIOS){
                            EXIF.getData(fileObject.file, function() {
                                orientation = EXIF.getTag(this, 'Orientation');
                            });
                        }
                        var image=new Image();
                        image.onload=function(){
                            var canvas = document.createElement("canvas");
                            var im= $.fn.document.upload.imageZoomParam2(image.width,image.height,1366,1366);
                            canvas.width=im.w;
                            canvas.height=im.h;
                            var base64 = "";
                            if(EIIS.browser.isIOS && orientation && orientation!=1 ){
                                var con =null;
                                switch(orientation){
                                    case 6://需要顺时针（向左）90度旋转
                                        con = self.rotateImg(this,1,canvas);
                                        break;
                                    case 8://需要逆时针（向右）90度旋转
                                        con = self.rotateImg(this,3,canvas);
                                        break;
                                    case 3://需要180度旋转
                                        con = self.rotateImg(this,2,canvas);
                                        break;
                                }
                                base64=canvas.toDataURL('image/jpeg',0.9);
                                canvas.width=0;
                                canvas.height=0;
                                if(con)
                                    con.clearRect(0,0,canvas.width,canvas.height);
                            }else{
                                var con=canvas.getContext('2d');
                                con.clearRect(0,0,canvas.width,canvas.height);
                                con.drawImage(image,0,0,canvas.width,canvas.height);
                                base64=canvas.toDataURL('image/jpeg',0.9);
                                canvas.width=0;
                                canvas.height=0;
                                con.clearRect(0,0,canvas.width,canvas.height);
                            }

                            var data = window.atob(base64.split(',')[1]);
                            var ia = new Uint8Array(data.length);
                            for (var i = 0; i < data.length; i++) {
                                ia[i] = data.charCodeAt(i);
                            }
                            var blob = new Blob([ia], {
                                type: "image/jpeg"
                            });
                            blob.name = fileObject.file.name;
                            fileObject.file = blob;
                            self._fileQueue.push(fileObject);
                            isZoomImg--;
                        }
                        isZoomImg++;
                        image.src=src;
                    })(fileObject)

                }else{
                    self._fileQueue.push(fileObject);
                }
            }
            if(errorNames1.length!=0){
                $.message(errorNames1.join(",")+"等"+errorNames1.length+"个文件含有%号，请去掉符号后在上传");
            }
            if(errorNames2.length!=0){
                $.message(errorNames2.join(",")+"等"+errorNames2 .length+"个文件含有#号，请去掉符号后在上传");
            }
            if(isZoomImg==0){
                self._submit();
                if (errorMessage.length > 0) {
                    $.message(errorMessage.join("\r\n"));
                }
            }else{
                var st =window.setInterval(function () {
                    if(isZoomImg==0){
                        self._submit();
                        if (errorMessage.length > 0) {
                            $.message(errorMessage.join("\r\n"));
                        }
                        window.clearInterval(st);
                    }
                }, 200);
            }
        },
        create: function () {
            var self = this;
            self._create();
        },
        rotateImg: function (img, step,canvas) {
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        var e_w = canvas.width;
        var e_h = canvas.height;
        switch (step) {
            case 0:
                canvas.width = e_w;
                canvas.height = e_h;
                ctx.drawImage(img, 0, 0,e_w,e_h);
                break;
            case 1:
                canvas.width = e_h;
                canvas.height = e_w;
                ctx.rotate(degree);
                ctx.drawImage(img, 0, -e_h,e_w,e_h);
                break;
            case 2:
                canvas.width = e_w;
                canvas.height = e_h;
                ctx.rotate(degree);
                ctx.drawImage(img, -e_w, -e_h,e_w,e_h);
                break;
            case 3:
                canvas.width = e_h;
                canvas.height = e_w;
                ctx.rotate(degree);
                ctx.drawImage(img, -e_w, 0,e_w,e_h);
                break;
        }
        return ctx;
    }
    };

})(jQuery);