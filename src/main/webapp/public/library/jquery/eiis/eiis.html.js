(function ($, undefined) {
    $.widget('eiis.webeditor', {
        _editor: null,
        options: {
            hide: false,
            readOnly: false,
            filePostName: 'TargetFolder',
            uploadName: "uploadpath",
            uploadPath: null,
            uploadJson: '/file/save',
            fileManagerJson: '',
            allowFileManager: false,
            filterMode: false,
            extraFileUploadParams: {},
            items: [
                //'source','|',
                'cut', 'copy', 'paste',
                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '|', '/',
                'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'eiis_image', 'eiis_multiimage',
                'eiis_flash', 'eiis_media', 'eiis_insertfile', 'table', 'hr', 'anchor', 'link', 'unlink', '|'
            ]
        },

        _setOption: function (key, value) {
            if (key == 'readOnly') {
                this._editor.readonly(true);
            }
            if (key == "hide") {
                if (value) {
                    this._editor.container.hide();
                } else {
                    //alert(this._editor.container);
                    this._editor.container.show();
                    this._editor.container.css("display", "");
                }
            }
            this._super(key, value);
        },
        _initKe: function () {
            KindEditor.lang({
                eiis_insertfile: '插入文件',
                'eiis_insertfile.url': 'URL',
                'eiis_insertfile.title': '文件说明',
                'eiis_insertfile.upload': '上传',
                'eiis_insertfile.viewServer': '文件空间',

                eiis_image: '图片',
                'eiis_image.remoteImage': '网络图片',
                'eiis_image.localImage': '本地上传',
                'eiis_image.remoteUrl': '图片地址',
                'eiis_image.localUrl': '上传文件',
                'eiis_image.size': '图片大小',
                'eiis_image.width': '宽',
                'eiis_image.height': '高',
                'eiis_image.resetSize': '重置大小',
                'eiis_image.align': '对齐方式',
                'eiis_image.defaultAlign': '默认方式',
                'eiis_image.leftAlign': '左对齐',
                'eiis_image.rightAlign': '右对齐',
                'eiis_image.imgTitle': '图片说明',
                'eiis_image.upload': '浏览...',
                'eiis_image.viewServer': '图片空间',

                eiis_multiimage: '批量图片上传',
                'eiis_multiimage.uploadDesc': '允许用户同时上传<%=uploadLimit%>张图片，单张图片容量不超过<%=sizeLimit%>',
                'eiis_multiimage.startUpload': '开始上传',
                'eiis_multiimage.clearAll': '全部清空',
                'eiis_multiimage.insertAll': '全部插入',
                'eiis_multiimage.queueLimitExceeded': '文件数量超过限制。',
                'eiis_multiimage.fileExceedsSizeLimit': '文件大小超过限制。',
                'eiis_multiimage.zeroByteFile': '无法上传空文件。',
                'eiis_multiimage.invalidFiletype': '文件类型不正确。',
                'eiis_multiimage.unknownError': '发生异常，无法上传。',
                'eiis_multiimage.pending': '等待上传',
                'eiis_multiimage.uploadError': '上传失败',

                eiis_flash: 'Flash',
                'eiis_flash.url': 'URL',
                'eiis_flash.width': '宽度',
                'eiis_flash.height': '高度',
                'eiis_flash.upload': '上传',
                'eiis_flash.viewServer': '文件空间',

                eiis_media: "音视频",
                'eiis_media.url': 'URL',
                'eiis_media.width': '宽度',
                'eiis_media.height': '高度',
                'eiis_media.autostart': '自动播放',
                'eiis_media.upload': '上传',
                'eiis_media.viewServer': '文件空间'
            });
        },
        value: function (value) {
            if (arguments.length == 0) return this._editor.html();
            this._editor.html(value);
        },
        show: function () {
            this._setOption("hide", false);
        },
        hide: function () {
            this._setOption("hide", true);
        },
        _bindForm: function () {
            if (this.element[0].form) {
                var self = this;
                var form = this.element[0].form;
                var submitHtml = {
                    submit: function (e) {
                        self._editor.sync();
                    }
                };
                var submit_id = 'eiis_html_' + (new Date()).valueOf().toString() + '_submit';
                form[submit_id] = form.submit;
                form.submit = function () {
                    submitHtml.submit();
                    this[submit_id]();
                };
                $(form).on("submit", Function.createDelegate(submitHtml, submitHtml.submit));
            }
        },
        _create: function () {
            var self = this;
            if (this._editor == null) {
                this._initKe();
                var extParams = {};
                if (this.options.uploadPath == null) {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: '/file/save/create',
                        async: false,
                        success: function (data) {
                            self.options.uploadPath = data[0]["uri"];
                        }
                    });
                }
                extParams[this.options.filePostName] = this.options.uploadPath;
                this.options.extraFileUploadParams = $.extend(this.options.extraFileUploadParams, extParams);

                //伴随提交的隐藏input
                $('<input type="hidden" name="' + this.options.uploadName + '" value="' + this.options.uploadPath + '" />')
                    .insertAfter(this.element);
                this._editor = KindEditor.create(this.element, this.options);

                //移除编辑器默认右键菜单
                $.each($(self._editor._contextmenus), function (i, o) {
                    if (o.title == "删除图片") self._editor._contextmenus.remove(o);
                    if (o.title == "图片属性") self._editor._contextmenus.remove(o);
                });

                //重写编辑器默认右键菜单
                KindEditor.each('image'.split(','), function (i, name) {
                    var uName = name.charAt(0).toUpperCase() + name.substr(1);
                    KindEditor.each('edit,delete'.split(','), function (j, val) {
                        self._editor.addContextmenu({
                            title: self._editor.lang(val + uName),
                            click: function () {
                                self._editor.loadPlugin('eiis_' + name, function () {
                                    self._editor.plugin['eiis_' + name][val]();
                                    self._editor.hideMenu();
                                });
                            },
                            cond: self._editor.plugin['getSelected' + uName],
                            width: 150,
                            iconClass: val == 'edit' ? 'ke-icon-' + name : undefined
                        });
                    });
                    self._editor.addContextmenu({ title: '-' });
                });

                this._bindForm();
            }
        },
        instance: function () {
            return this._editor;
        },
        widget: function () {
            return this._editor.container;
        },
        _destroy: function () {
            this._editor.remove();
        }
    });
})(jQuery);