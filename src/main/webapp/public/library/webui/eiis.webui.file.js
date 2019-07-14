
$().ready(function () {
    $(':text.webui.file').livequery(function () {
        //获取文件名
        var GetFileName = function (file) {
            return file.replace(/.*(\/|\\)/, "");
        }
        //获取扩展名
        var GetExtension = function (file) {
            if (/[.]/.exec(file)) {
                var tmpE = /[^.]+$/.exec(file.toLowerCase());
                if (tmpE.length > 0) {
                    return tmpE[tmpE.length - 1];
                }
            }
            return '';
        }
        //格式化文件字节
        var formatSize = function (oSize) {

            var vSize = oSize;
            if (!isNaN(parseInt(vSize))) {
                if (vSize > 1024) {
                    vSize = vSize / 1024;
                    if (vSize > 1024) {
                        return Math.round(vSize / 1024).toString() + 'MB';
                    } else {
                        return Math.round(vSize).toString() + 'KB';
                    }
                } else {
                    return vSize.toString() + 'B';
                }
            } else {
                return '';
            }

        };

        var $this = $(this);
        if ($this) {
            var exts = [];
            if(!String.isNullOrEmpty($this.attr("data-extname"))){
                exts = $this.attr("data-extname").split(',');
            }

            //取得文件列表
            var value = $.trim($this.val());
            var fileArray = [];
            if (value != "") {
                fileArray = value.split("|");
            }

            var tmpSpan = $("<div/>");
            $this.after(tmpSpan);
            $this.hide();
            $this.data("oldvalue", value);
            $this.val("");
            $this.data("filelist", []);

            var uploader = tmpSpan.uploadFiles({
                editable:Boolean.parse($this.attr("data-editable")),
                multiple: $this.hasClass('multiple'),
                files: fileArray,
                allowedExtensions: exts,
                onSubmit: function (id, fileName, localPath) { },
                onProgress: function (id, fileName, loaded, total) { },
                onComplete: function (id, fileName, response) {
                    var valid = uploader.getFiles(),
                        unvalid = uploader.getRemoveFiles();
                    if(unvalid.length == 0){
                        $this.val(valid.join("|"));
                    }else{
                        $this.val(valid.join("|")+":"+unvalid.join("|"));
                    }
                    $this.trigger("complete",[response]);
                },
                onCancel: function (id, fileName) {
                    var valid = uploader.getFiles(),
                        unvalid = uploader.getRemoveFiles();
                    if(unvalid.length == 0){
                        $this.val(valid.join("|"));
                    }else{
                        $this.val(valid.join("|")+":"+unvalid.join("|"));
                    }
                },
                onEdit:function(id, fileName, response){
                    var valid = uploader.getFiles(),
                        unvalid = uploader.getRemoveFiles();
                    if(unvalid.length == 0){
                        $this.val(valid.join("|"));
                    }else{
                        $this.val(valid.join("|")+":"+unvalid.join("|"));
                    }
                }
            });
            $this[0]["data-upload-div"] = tmpSpan;
        }
    }, function () {
        var $this = $(this);
        if ($this) {
            $this.uploadFiles('destroy');
        }
    });
});