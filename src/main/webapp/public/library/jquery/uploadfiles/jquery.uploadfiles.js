(function ($, undefined) {

    var saveUrl = "/file/save/";

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

    //获得 ID
    var createFileID = function () {
        return 'uploadFiles_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    //实现类的完全继承（包括静态）。
    var inheritance = function (first, second) {
        if (first == undefined || second == undefined) return;
        for (var prop in second) {
            if (first[prop] == undefined) {
                first[prop] = second[prop];
            } else {
                if ($.isPlainObject(first[prop]) && $.isPlainObject(second[prop])) {
                    inheritance(first[prop], second[prop]);
                }
            }
        }
        inheritance(first.prototype, second.prototype);
    };

    $.fn.uploadFiles = function () {
        var self = this[0];
        var p = $.extend({}, $.fn.uploadFiles.options);
        if (self["data-upload-div"] == undefined) {
            if ($.isEmptyObject(self.uploadFiles)) {
                if (!$.isEmptyObject(arguments[0])) {
                    p = $.extend(p, arguments[0]);
                }
                self.uploadFiles = new $.fn.uploadFiles.base($(self));
                self.uploadFiles._create(p);

                if (!$.isEmptyObject(p)) {
                    return self.uploadFiles;
                }
            }
        }

        if ($.type(arguments[0]) === 'string') {
            self.uploadFiles = self['data-upload-div'][0].uploadFiles;
            if ($.isFunction(self.uploadFiles[arguments[0]])) {
                var args = arguments.length == 1 ? [arguments[0]] : Array.apply(null, arguments);
                args = args.splice(1);
                return self.uploadFiles[arguments[0]].apply(self.uploadFiles, args);
            }
        } else if (!$.isEmptyObject(arguments[0])) {
            if (self["data-upload-div"] != undefined) {
                $.extend(true, p, arguments[0]);
                //self.uploadFiles.destroy();
                self['data-upload-div'][0].uploadFiles.destroy();
                self.uploadFiles = new $.fn.uploadFiles.base($(self));
                self.uploadFiles._create(p);
            }
        }

        return self.uploadFiles;

    };

    $.fn.uploadFiles.options = {
        editable: false,
        multiple: true,
        files: [],
        sizeLimit: 0,
        maxConnections: 3,
        allowedExtensions: [],
        messages: {
            waiting: '正在等候上传...',
            sizeError: '文件大小超过限制！',
            typeError: '该文件类型不允许上传！',
            uploadError: "文件上传错误！"
        },
        html: {
            select: '添加附件',
            cancel: '取消上传',
            revoke: '[撤销]',
            remove: '[删除]'
        },
        onSubmit: function (id, fileName, localPath) {
        },
        onProgress: function (id, fileName, loaded, total) {
        },
        onComplete: function (id, fileName, response) {
        },
        onCancel: function (id, fileName) {
        },
        onEdit: function (id, fileName, response) {
        }
    };

    $.fn.uploadFiles.base = function (element) {
        this.element = element;
    };
    $.fn.uploadFiles.base.prototype = {
        _create: function (opt) {
            var self = this;

            self._handler = $.fn.uploadFiles.handler.create();
            if (self._handler == null) {
                self.destroy();
                return false;
            }

            self.options = $.extend(true, {}, $.fn.uploadFiles.options, opt);

            if (self.options.maxConnections < 1) self.options.maxConnections = 999;

            self._ul = $('<ul />').addClass('uploadFiles').appendTo(self.element);
            //self._select = $('<li><a href=\"#\"></a></li>').addClass('select').appendTo(self._ul);
            self._select = $('<li />').addClass('select').appendTo(self._ul).append($('<a onclick="javascript:return false;"\"#;\" />').html(self.options.html.select));

            self._handler._onSubmit = Function.createDelegate(self, self._onSubmit);
            self._handler._onProgress = Function.createDelegate(self, self._onProgress);
            self._handler._onComplete = Function.createDelegate(self, self._onComplete);
            self._handler._onError = Function.createDelegate(self, self._onError);

            self._handler.initialize($('a', self._select), self.options.multiple, self.options.maxConnections);

            //初始化缺省值
            var initDefaultValues = function () {

                var fileValues = "";
                $.each(self.options.files, function () {
                    if (fileValues == "") {
                        fileValues = this;
                    }
                    else {
                        fileValues += "|" + this;
                    }
                });

                var newTags = new Array();
                var defaultInvalidFile = new Array();

                if (fileValues != "") {
                    $.ajax({
                        url: "/file/info/",
                        data: ({
                            'files': fileValues
                        }),
                        type: "POST",
                        dataType: "json",
                        success: function (data, status, xhr) {
                            if (data.length > 0) {
                                //单文件时,只显示第一个附件
                                var length = (self.options.multiple ? data.length : 1);
                                for (var i = 0; i < length; i++) {
                                    var _id = createFileID();
                                    self._onSubmit(_id, data[i].uri);
                                    self._onComplete(_id, data[i].uri, data[i]);
                                }
                            }
                        }
                    });
                }
            }
            initDefaultValues();

            /*for (var i = 0, j = self.options.files.length; i < j; i++) {
             //单文件时,只显示一个附件
             if (self.options.multiple || i < 1) {
             var _id = createFileID();
             self._onSubmit(_id, self.options.files[i]);
             self._onComplete(_id, self.options.files[i]);
             }
             }*/
            self._updateSelect();
        },
        _handler: null,
        _select: null,
        _ul: null,
        _updateSelect: function () {
            var self = this;
            if (!self.options.multiple) {
                if ($("li.file.waiting, li.file.progress, li.file.complete", self._ul).length == 0) {
                    self._select.show()
                    self._handler.setSelect(true);
                } else {
                    self._select.hide();
                    self._handler.setSelect(false);
                }
            }
        },
        _formatMessage: function (message) {
            //message.re
            return message;
        },
        _toggleStatus: function (_li, status) {
            _li.removeClass('waiting');
            _li.removeClass('progress');
            _li.removeClass('complete');
            _li.removeClass('revoke');
            _li.removeClass('error');
            _li.addClass(status);
        },
        _isStatus: function (_li, status) {
            return _li.hasClass(status);
        },
        _validExt: function (fileName) {
            var self = this;
            if (self.options.allowedExtensions.length > 0) {
                var ext = GetExtension(fileName);
                if (self.options.allowedExtensions.contains(ext)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        _validSize: function (size) {
            return this.options.sizeLimit >= size;
        },
        _fileExist: function (fileName) {
            var rtn = false;
            var self = this;
            $("li.file > .label", self._ul).each(function (i, o) {
                if ($(o).text().equalsIgnoreCase(fileName) && (!$(o).parent(".file").hasClass("revoke"))) {
                    rtn = true;
                }
            });
            return rtn;
        },
        _isDeleted: function (fileName) {
            var rtn = false;
            var self = this;
            $("li.file > .label", self._ul).each(function (i, o) {
                if ($(o).text().equalsIgnoreCase(fileName) && $(o).parent(".file").hasClass("complete")) {
                    rtn = true;
                }
            });

            return rtn;
        },
        _onSubmit: function (id, fileName) {
            var self = this;
            //判断是否已经存在相同文件名的附件
            //判断附件大小
            //件判断附件是否是允许的后缀文。
            //判断该文件是否是否有同名文件未删除
            if (self._fileExist(fileName)) {
                alert("该文件已经存在！请先删除同名文件");
                return false;
            }
            if (!self._validSize(self.options.sizeLimit)) {
                alert("不允许上传过大的文件！");
                return false;
            }

            if (!self._validExt(fileName)) {
                alert("不允许上传该类型文件！");
                return false;
            }

            var re = true;
            if ($.isFunction(self.options.onSubmit)) {
                re = self.options.onSubmit(id, fileName);
            }
            if (re != false) {
                var _li = $('<li />').addClass('file')
                    .attr({'id': id})
                    .append($('<span />').addClass('icon'))
                    .append($('<span />').addClass('label'))
                    .append($('<span />').addClass('message'))
                    .append($('<span />').addClass('cancel'));

                self._select.before(_li);
                self._toggleStatus(_li, 'waiting');
                $('.label', _li).text(GetFileName(fileName));
                $('.message', _li).text(self.options.messages.waiting);
                $('.cancel', _li)
                    .on('click', function () {
                        self._onCancel(id, fileName);
                    })
                    .text(self.options.html.cancel);

                if (fileName.indexOf(':\\') == 1) {
                    $('.label', _li).attr('title', fileName);
                }

            }


        },
        _onProgress: function (id, fileName, loaded, total) {
            var self = this;
            var _li = $('#' + id);
            if (_li.length == 0) return false;

            var _progress = $('.progress', _li);
            if (self._isStatus(_li, 'waiting')) {
                self._toggleStatus(_li, 'progress');
                $('.message', _li).hide();
                $('.label', _li).after($('<span />').addClass('status'));
                $('.status', _li).after($('<span />').addClass('progress'));
                _progress = $('.progress', _li);
                _progress.append($('<span />').addClass('value'));
                $('.status', _li).append($("<img />").attr("src", EIIS.Common.themePath + '/images/loading.gif'));
            }
            if (self._isStatus(_li, 'progress')) {
                if (total > 0) {
                    $('.status', _li).hide();
                    _progress.show();
                    $('.value', _progress).css('width', (loaded / total * 100) + '%');
                } else {
                    _progress.hide();
                }
                if ($.isFunction(self.options.onProgress)) {
                    self.options.onProgress(id, fileName, loaded, total);
                }
            }
        },
        _onComplete: function (id, fileName, response) {

//            alert($("ul.uploadFiles").children("li.file").hasClass("complete"));


            var self = this;
            if (self._isDeleted(fileName)) {
                alert("请先删除同名生效附件");
            } else {
                var _li = $('#' + id);
                if (_li.length == 0) return false;

                self._toggleStatus(_li, 'complete');
                _li.data('response', response);

                $('.revoke', _li).remove();
                $('.message', _li).remove();
                $('.cancel', _li).remove();
                $('.status', _li).remove();
                $('.progress', _li).remove();
                //            _li.append($('<span />').addClass('remove'));
                $('<span/>')
                    .addClass("remove")
                    .insertAfter($(">.icon", _li));
                $('.remove', _li)//.append($('<a onclick="javascript:return false;" href="#" />')
                    .on('click', function () {
                        self._onRevoke(id, fileName);
                    })
                    .html(self.options.html.remove);//);
                if ($.isFunction(self.options.onComplete)) {
                    self.options.onComplete(id, fileName, response);
                }
                self._updateSelect();
                $(">.label", _li).html($('<a target="_blank" href="' + response.downloadUri + '">' + $(">.label", _li).text() + '</a>'));
                //文件编辑
                if (self.options.editable) {
                    var icon = $("<span title=\"编辑\"/>")
                        .addClass("ui-icon ui-icon-pencil ui-state-disabled")
                        .css({'margin-top': '1px'})
                        .on({
                            mouseenter: function () {
                                $(this).removeClass("ui-state-disabled");
                            },
                            mouseleave: function () {
                                $(this).addClass("ui-state-disabled");
                            },
                            click: function () {
                                var result = showModalDialog('/public/jquery/uploadfiles/upload.edit.jsp', _li.data('response'), 'dialogWidth:' + window.screen.availWidth + 'px;dialogHeight:' + window.screen.availHeight + ';help:no;scroll:no;status:no;resizable:no;center:yes')
                                if (result) {
                                    _li.data("response", result);
                                    if ($.isFunction(self.options.onEdit)) {
                                        self.options.onEdit(id, fileName, response);
                                    }
                                }
                            }
                        });
                    $(">.icon", _li).html(icon);
                } else {
                    $(">.icon", _li).empty();
                }
            }
        },
        _onRevoke: function (id, fileName) {
            var self = this;
            var _li = $('#' + id);
            if (_li.length == 0) return false;

            self._toggleStatus(_li, 'revoke');
            $('.remove', _li).remove();
//            _li.append($('<span />').addClass('revoke'));
            $('<span/>')
                .addClass("revoke")
                .insertAfter($(">.icon", _li));
            $('.revoke', _li)//.append($('<a onclick="javascript:return false;" href="#" />')
                .on('click', function () {
                    if (self.options.multiple || ($("li.file.waiting, li.file.progress, li.file.complete", self._ul).length == 0)) {
                        self._onComplete(id, fileName, _li.data('response'));
                    }
                    else {
                        alert("超过可选择文件数量!");
                    }
                })
                .html(self.options.html.revoke);//);

            if ($.isFunction(self.options.onCancel)) {
                self.options.onCancel(id, fileName);
            }
            self._updateSelect();

        },
        _onCancel: function (id, fileName) {
            var self = this;
            var _li = $('#' + id);
            if (_li.length == 0) return false;

            self._handler.cancel(id);
            _li.remove();
            self._updateSelect();
        },
        _onError: function (id, fileName, message) {
            var self = this;
            var _mess = '未知的错误！';
            var customError = false;
            if ($.trim(message) != '') {
                _mess = self.options.messages[message];
                if (_mess == undefined) {
                    customError = true;
                    _mess = self.options.messages.uploadError;
                }
            }
            _mess = self._formatMessage(_mess);

            var _li = $('#' + id);
            if (_li.length == 0) return false;
            self._toggleStatus(_li, 'error');
            $('.message', _li).show()
                .text(_mess);
            if (customError === true) {
                $('.message', _li)
                    .on("click", function () {
                        alert(message);
                    });
            }
            $('.revoke', _li).remove();
            $('.status', _li).remove();
            $('.progress', _li).remove();
            self._updateSelect();
        },
        getFiles: function () {
            var self = this;
            var _files = [];
            $("li.file.complete", self._ul).each(function () {
                _files.push($(this).data('response').uri);
            });
            return _files;
        },
        getRemoveFiles: function () {
            var self = this;
            var _files = [];
            $("li.file.revoke", self._ul).each(function () {
                _files.push($(this).data('response').uri);
            });
            return _files;
        },
        element: null,
        options: {},
        //是否还在上传中
        getInProgress: function () {
            var self = this;
            return $("li.file.waiting, li.file.progress", self._ul).length > 0;
        },
        destroy: function () {
            var self = this;
            if (self._handler != null) {
                self._handler.destroy();
            }
            if (self._ul != null) {
                self._ul.remove();
            }
            self.element.uploadFiles = undefined;
        }
    };

    $.fn.uploadFiles.handler = {
        _handler: new Array(10),
        add: function (handler, priority) {
            inheritance(handler, $.fn.uploadFiles.handler.abstract);
            this._handler[priority] = handler;
        },
        create: function () {
            for (var i = 0, j = this._handler.length; i < j; i++) {
                if (this._handler[i] != undefined) {
                    if (this._handler[i].isSupported()) {
                        return new this._handler[i]();
                    }
                }
            }
            return null;
        }
    };

    $.fn.uploadFiles.handler.abstract = function () {
    };
    $.fn.uploadFiles.handler.abstract.isSupported = function () {
        return false;
    };
    $.fn.uploadFiles.handler.abstract.prototype = {
        initialize: function (select, multiple, maxConnections) {
        },
        _onSubmit: null,
        _onProgress: null,
        _onComplete: null,
        _onError: null,
        multiple: true,
        maxConnections: 3,
        onSubmit: function (id, fileName) {
            if ($.isFunction(this._onSubmit)) {
                return this._onSubmit(id, fileName);
            }
        },
        onProgress: function (id, fileName, loaded, total) {
            if ($.isFunction(this._onProgress)) {
                return this._onProgress(id, fileName, loaded, total);
            }
        },
        onComplete: function (id, fileName, response) {
            if ($.isFunction(this._onComplete)) {
                return this._onComplete(id, fileName, response);
            }
        },
        onError: function (id, fileName, message) {
            if ($.isFunction(this._onError)) {
                return this._onError(id, fileName, message);
            }
        },
        getSize: function (id) {
            return -1;
        },
        cancel: function (id) {
        },
        setSelect: function (status) {
        },
        destroy: function () {
        }
    };

    (function ($, undefined) {
        var html4 = function () {
        };
        html4.isSupported = function () {
            return true;
        };
        html4.prototype = {
            initialize: function (select, multiple, maxConnections) {
                this._select = select;
                this.multiple = multiple;
                this.maxConnections = maxConnections;
                this.destroy();
                this._groupId = createFileID() + '_group_html4';
                this._inputs = [];
                this._createInput();
            },
            _groupId: '',
            _select: null,
            _currentInput: null,
            _inputs: [],
            _createInput: function () {
                var self = this;
                var _id = createFileID();
                self._currentInput = $("<input />").attr('type', 'file')
                    .attr({
                        'name': 'file',
                        'fileId': _id,
                        'id': _id + '_input'
                    })
                    .addClass(self._groupId)
                    .css({
                        'position': 'absolute', 'margin': '-5px 0 0 -175px', 'padding': '0', 'width': '220px', 'height': '30px', 'fontSize': '14px', 'opacity': '0', 'cursor': 'pointer', 'display': 'none', 'zIndex': '2147483583'
                    });

                if (!(self._currentInput.css('opacity') === "0")) {
                    self._currentInput.css("filter", "alpha(opacity=0)");
                }

                $(document.body).append(self._currentInput);

                self._currentInput.on('change', Function.createDelegate(self, self._change));
                self._currentInput.on('click', Function.createDelegate(self, self._click));
                self._currentInput.on('mousemove', Function.createDelegate(self, self._mousemove));

                self._select.off('mousemove').on('mousemove', Function.createDelegate(self, self._mousemove));

            },
            _change: function () {
                var self = this;
                if ($.trim(self._currentInput.val()) === '') {
                    return false;
                }

                self._currentInput.off();
                //if (self.onSubmit(self._currentInput.attr('fileId'), "file:\\" + self._currentInput.val()) == false) {
                if (self.onSubmit(self._currentInput.attr('fileId'), GetFileName(self._currentInput.val())) == false) {
                    self._currentInput.remove();
                    self._createInput();
                    return false;
                }
                self._inputs.push(self._currentInput.attr('fileId'));
                self._createInput();
                self._submit();
            },
            _click: function () {
                var self = this;
                setTimeout(function () {
                    self._currentInput.css('display', 'none');
                }, 0);
            },
            _mousemove: function (e) {
                var self = this;
                if (self._currentInput != null) {
                    var pageX = e.pageX;
                    var pageY = e.pageY;

                    var offset = self._select.offset();

                    if ((pageX >= offset.left) && (pageX <= offset.left + self._select.width()) &&
                        (pageY >= offset.top) && (pageY <= offset.top + self._select.height())) {

                        self._currentInput.css({
                            top: pageY,
                            left: pageX,
                            display: 'block'
                        });

                    } else {
                        self._currentInput.css('display', 'none');
                    }
                }
            },
            _submit: function () {
                var self = this;
                if ($('iframe.' + self._groupId).length >= self.maxConnections) {
                    return false;
                }
                if (self._inputs.length == 0) return false;

                var _input = $('#' + self._inputs.shift() + '_input');

                if (_input.length == 0) {
                    self._submit();
                    return false;
                }

                var _id = _input.attr('fileId');
                var _fileName = GetFileName(_input.val());

                self.onProgress(_id, _fileName, -1, -1);

                var _iframe = $('<iframe src="javascript:false;" name="' + _id + '_iframe" />')
                    .attr({
                        'id': _id + '_iframe',
                        'fileId': _id
                    })
                    .addClass(self._groupId)
                    .css('display', 'none')
                    .appendTo(document.body);

                _iframe.on('load', function () {

                    var doc = _iframe[0].contentDocument ? _iframe[0].contentDocument : frames[_iframe.attr("id")].document;

                    // fixing Opera 9.26
                    if (doc.readyState && doc.readyState != 'complete') {
                        return false;
                    }
                    // fixing Opera 9.64
                    if (doc.body && doc.body.innerHTML == "false") {
                        return false;
                    }

                    var response;
                    try {
                        response = $.parseJSON($(doc).text()); //eval("(" + doc.body.innerHTML + ")");
                    } catch (err) {
                        response = null;
                    }
                    if ($.type(response) === "array") {
                        self.onComplete(_id, _fileName, response[0]);
                    } else {
                        var errMessage = String.Empty;
                        try {
                            errMessage = $.ajaxErrorMessager(doc.documentElement.outerHTML);
                        } catch (err) {
                            errMessage = err.Message;
                        }
                        self.onError(_id, _fileName, errMessage);
                    }
                    _iframe.attr("src", "javascript:false;")
                        .remove();

                    self._submit();
                });

                var _form = $('<form method="post" enctype="multipart/form-data"></form>')
                    .css('display', 'none')
                    .addClass(self._groupId)
                    .attr("action", saveUrl)
                    .attr("target", _iframe.attr("name"))
                    .appendTo(document.body)
                    .append(_input);

                _form.submit();

                _input.remove();
                _form.remove();

            },
            cancel: function (id) {
                var self = this;
                $('#' + id + '_input').remove();
                $('#' + id + '_iframe').attr("src", "javascript:false;")
                    .remove();
                self._submit();
            },
            destroy: function () {
                if ($.trim(this._groupId) != '') {
                    $('iframe.' + this._groupId).attr("src", "javascript:false;")
                        .remove();
                    $('input:file.' + this._groupId).remove();
                    $('form.' + this._groupId).remove();
                }

            }
        };

        $.fn.uploadFiles.handler.add(html4, 9);

    })(jQuery);

    (function ($, undefined) {

        var html5 = function () {
        };
        html5.isSupported = function () {
            var input = document.createElement('input');
            input.type = 'file';
            return ('multiple' in input &&
                typeof File != "undefined" &&
                typeof (new XMLHttpRequest()).upload != "undefined");
        };
        html5.prototype = {
            initialize: function (select, multiple, maxConnections) {
                this._select = select;
                this.multiple = multiple;
                this.maxConnections = maxConnections;
                this.destroy();
                this._groupId = createFileID() + '_group_html5';
                this._connection = 0;
                this._fileQueue = [];
                this._uploadingXhr
                this._createInput();
            },
            _groupId: '',
            _select: null,
            multiple: true,
            maxConnections: 3,
            _uploadingXhr: {},
            _connection: 0,
            _fileQueue: [],
            _createInput: function () {
                var self = this;
                var _id = createFileID();
                self._currentInput = $("<input />").attr('type', 'file')
                    .attr({
                        'name': 'file',
                        'fileId': _id,
                        'id': _id + '_input'
                    })
                    .addClass(self._groupId)
                    .css({
                        'position': 'absolute', 'margin': '-5px 0 0 -175px', 'padding': '0', 'width': '220px', 'height': '30px', 'fontSize': '14px', 'opacity': '0', 'cursor': 'pointer', 'display': 'none', 'zIndex': '2147483583'
                    });
                if (this.multiple) {
                    self._currentInput.attr("multiple", "multiple");
                }

                $(document.body).append(self._currentInput);

                self._currentInput.on('change', Function.createDelegate(self, self._change));
                self._currentInput.on('click', Function.createDelegate(self, self._click));
                self._currentInput.on('mousemove', Function.createDelegate(self, self._mousemove));

                self._select.off('mousemove').on('mousemove', Function.createDelegate(self, self._mousemove));

            },
            _change: function () {
                var self = this;
                var files = self._currentInput[0].files;
                if (files.length == 0) {
                    return false;
                }
                self._currentInput.off();
                var _fileId = self._currentInput.attr('fileId');
                for (var i = 0; i < files.length; i++) {
                    /*if (!this._validateFile(files[i])) {
                     return false;
                     }*/
                    /*if (self.onSubmit(_fileId + '_' + i, "file:\\" + files[i].name) == false) {
                     self._currentInput.remove();
                     self._createInput();
                     return false;
                     }*/
                    var fileSize = 0;
                    if (files[i].size > 1024 * 1024)
                        fileSize = (Math.round(files[i].size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                    else
                        fileSize = (Math.round(files[i].size * 100 / 1024) / 100).toString() + 'KB';

                    if (self.onSubmit(_fileId + '_' + i, files[i].name) != false) {
                        self._fileQueue.push({
                            fileIndex: i,
                            fileId: _fileId + '_' + i,
                            fileName: files[i].name,
                            fileSize: fileSize,
                            file: files[i]
                        });
                    }

                }
                //self._createInput();
                self._submit();
                self._currentInput.remove();
                self._createInput();
                /*for (var i = 0; ((self._fileQueue.length > 0) && (self._connection <= self.maxConnections) && (i < self.maxConnections)); i++) {
                 self._requestUploadNextFile(self._fileQueue.pop());
                 }*/
            },
            /*_requestUploadNextFile: function (fileObject) {
             if (self.onSubmit(fileObject.fileId, fileObject.fileName) == false) {
             self._currentInput.remove();
             self._createInput();
             return false;
             }
             self._connection++;
             self._submit(fileObject);
             },*/
            _click: function () {
                var self = this;
                setTimeout(function () {
                    self._currentInput.css('display', 'none');
                }, 0);
            },
            _mousemove: function (e) {
                var self = this;
                if (self._currentInput != null) {
                    var pageX = e.pageX;
                    var pageY = e.pageY;

                    var offset = self._select.offset();

                    if ((pageX >= offset.left) && (pageX <= offset.left + self._select.width()) &&
                        (pageY >= offset.top) && (pageY <= offset.top + self._select.height())) {

                        self._currentInput.css({
                            top: pageY,
                            left: pageX,
                            display: 'block'
                        });

                    } else {
                        self._currentInput.css('display', 'none');
                    }
                }
            },
            _submit: function () {
                var self = this;

                if ((self._fileQueue.length == 0) || (self._connection >= self.maxConnections)) {
                    return false;
                }

                var fileObject = self._fileQueue.pop();

                self._connection++;

                var uploadProgress = function (evt) {
                    if (evt.lengthComputable) {
                        self.onProgress(fileObject.fileId, fileObject.fileName, evt.loaded, evt.total);
                    }
                    else {
                        self.onProgress(fileObject.fileId, fileObject.fileName, -1, -1);
                    }
                };

                var uploadFailed = function (evt) {
                    self.onError(fileObject.fileId, fileObject.fileName, "上传文件失败!");
                    uodateFinish(evt);
                };

                var uploadCanceled = function (evt) {
                    self.onError(fileObject.fileId, fileObject.fileName, "上传文件被中断!");
                    uodateFinish(evt);
                };

                var uploadComplete = function (evt) {
                    var response, errMessage;
                    try {
                        response = $.parseJSON(evt.target.responseText);
                    } catch (err) {
                        response = null;
                    }
                    if ($.type(response) === "array") {
                        self.onComplete(fileObject.fileId, fileObject.fileName, response[0]);
                    } else {
                        self.onError(fileObject.fileId, fileObject.fileName, evt.target.status + "  " + evt.target.statusText + "\r\n\r\n" + jQuery.ajaxErrorMessager(evt.target));
                    }
                    uodateFinish(evt);
                };

                var uodateFinish = function (evt) {
                    self._uploadingXhr[fileObject.fileId] = undefined;
                    self._connection--;
                    self._submit();
                }

                var fd = new FormData();
                //fd.append("fileToUpload", self._currentInput[0].files[fileObject.fileIndex]);
                fd.append("fileToUpload", fileObject.file);
                var xhr = new XMLHttpRequest();
                self._uploadingXhr[fileObject.fileId] = xhr;
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", uploadComplete, false);
                xhr.addEventListener("error", uploadFailed, false);
                xhr.addEventListener("abort", uploadCanceled, false);
                xhr.open("POST", saveUrl);
                xhr.send(fd);
                self._submit();
            },
            cancel: function (id) {
                var self = this;
                if (self._uploadingXhr[id]) {
                    self._uploadingXhr[id].abort();
                }
            },
            destroy: function () {
                if ($.trim(this._groupId) != '') {
                    $('input:file.' + this._groupId).remove();
                    for (var xhr in self._uploadingXhr) {
                        xhr.abort();
                    }
                    self._uploadingXhr = {};
                }
                self._connection = 0;
            }
        };

        $.fn.uploadFiles.handler.add(html5, 3);

    })(jQuery);

    //Flash上传
    (function ($, undefined) {

        var FlashUploadFile = function () {
        };
        FlashUploadFile.isSupported = function () {

            //获取 Flash 的版本号。
            //该代码是在 SWFObject v2.2 <http://code.google.com/p/swfobject/> 
            //基础上进行精简出来的。
            var playerVersion = function () {
                var UNDEF = "undefined",
                    OBJECT = "object",
                    SHOCKWAVE_FLASH = "Shockwave Flash",
                    SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
                    FLASH_MIME_TYPE = "application/x-shockwave-flash",

                    win = window,
                    doc = document,
                    nav = navigator,

                    _playerVersion = [0, 0, 0],
                    d = null
                    ;

                if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                    d = nav.plugins[SHOCKWAVE_FLASH].description;
                    if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                        d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                        _playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                        _playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                        _playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                    }
                }
                else if (typeof win.ActiveXObject != UNDEF) {
                    try {
                        var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                        if (a) { // a will return null when ActiveX is disabled
                            d = a.GetVariable("$version");
                            if (d) {
                                d = d.split(" ")[1].split(",");
                                _playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                            }
                        }
                    }
                    catch (e) {
                    }
                }
                return { major: _playerVersion[0], minor: _playerVersion[1], release: _playerVersion[2] };
            }();

            if (playerVersion.major >= 9) {
                return true;
            }
            return false;
        };
        FlashUploadFile.prototype = {
            initialize: function (select, multiple, maxConnections) {
                var self = this;
                this._select = select;
                this.multiple = multiple;
                this.maxConnections = maxConnections;
                this.destroy();
                this._groupId = createFileID() + '_group_flash';
                this._connection = 0;
                this._inputs = [];
                this._fileQueue = [];

                //EIIS.Common.loadJavaScript("/PublicFunction/jQuery/uploadFiles/swfupload/swfupload.js", Function.createDelegate(this, this._createInput));
                EIIS.Common.loadComponent(EIIS.Common.jQuery.uploadfiles.flash, Function.createDelegate(this, this._createInput));
                $(window).on({
//                    "beforeunload":function(){
//                        alert("beforeunload")
//                        self.destroy();
//                    },
                    'unload': function () {//for ie
                        //alert("unload")
                        self.destroy();
                    }
                });
            },
            _select: null,
            multiple: true,
            maxConnections: 3,
            _connection: 0,
            _inputs: [],
            _swfcontrol: null,
            _currSelectCount: 0,
            _fileQueue: [],
            fileId: "",
            _swfcontrol: null,
            _createInput: function () {

                if (window.SWFUpload == undefined) return false;

                var self = this;
                //var _id = createFileID();

                var settings = {
                    id: createFileID(),
                    width: self._select.width() == 0 ? 50 : self._select.width(),
                    height: self._select.height() == 0 ? 15 : self._select.height()
                }
                self.fileId = settings.id;

                self._select.attr("id", settings.id);

                // Prepare settings for SWFUpload
                var swfUploadSettings = {
                    assume_success_timeout: 30,
                    button_placeholder_id: settings.id,
                    button_width: settings.width,
                    button_height: settings.height,
                    button_text: null,
                    button_text_style: null,
                    button_text_top_padding: 0,
                    button_text_left_padding: 0,
                    button_action: (self.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE),
                    button_disabled: false,
                    button_cursor: SWFUpload.CURSOR.HAND,
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    debug: false,
                    requeue_on_error: false,
                    file_post_name: "Filedata",
                    file_size_limit: 0,
                    file_types: "*.*",
                    file_types_description: "所有文件",
                    file_queue_limit: 0,
                    file_upload_limit: 0,
                    //flash_url: "/PublicFunction/jQuery/uploadFiles/flash/uploadify.swf",
                    //flash_url: "/public/jquery/uploadfiles/flash/swfupload.swf",
                    flash_url: EIIS.Common.jQuery.uploadfiles.flash.swf,
                    prevent_swf_caching: false, //在 url 中添加随机值，以防止缓存。
                    post_params: {},
                    upload_url: saveUrl,
                    use_query_string: false,

                    //file_queue_error_handler: self._fileQueueError,
                    //file_queued_handler: self._fileQueued,
                    //upload_progress_handler: self._uploadProgress,
                    //upload_error_handler: self._uploadError,
                    //upload_success_handler: self._uploadSuccess,
                    //upload_complete_handler: self._uploadComplete,

                    file_queue_error_handler: function (file, errorCode, message) {
                        var self = this.customSettings.owner;
                        if (file != null) {
                            if (self.onSubmit(file.id, file.name) != false) {
                                switch (errorCode) {
                                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                                        self.onError(file.id, file.name, "已经超出上传文件队列的限制!");
                                        break;
                                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                        self.onError(file.id, file.name, '\n文件 "' + file.name + '" 的大小超过系统限制.');
                                        break;
                                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                                        self.onError(file.id, file.name, '\n文件 "' + file.name + '" 是一个空文件.');
                                        break;
                                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                                        self.onError(file.id, file.name, '\n文件 "' + file.name + '" 的类型是不允许上传的.');
                                        break;
                                }
                            }
                        }
                    },
                    file_queued_handler: function (file) {
                        var self = this.customSettings.owner;
                        if (self.onSubmit(file.id, file.name) != false) {
                            self._startUpload();
                        }
                    },
                    upload_start_handler: function (file) {
                        var self = this.customSettings.owner;
                        self.onProgress(file.id, file.name, 0, file.size);
                    },
                    upload_progress_handler: function (file, fileBytesLoaded, fileTotalBytes) {
                        var self = this.customSettings.owner;
                        self.onProgress(file.id, file.name, fileBytesLoaded, fileTotalBytes);
                    },
                    upload_error_handler: function (file, errorCode, errorMsg) {
                        var self = this.customSettings.owner;

                        switch (errorCode) {
                            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                                errorString = errorMsg;
                                break;
                            case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                                errorString = 'Missing Upload URL';
                                break;
                            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                                errorString = 'IO 错误';
                                break;
                            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                                errorString = '安全性错误';
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                                errorString = '超过上传限制';
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                                errorString = '失败';
                                break;
                            case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                                errorString = '指明的文件 Id 不存在';
                                break;
                            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                                errorString = '验证错误';
                                break;
                            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                                errorString = '注销';
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                                errorString = '停止';
                                break;
                        }
                        self._swfcontrol.cancelUpload(file.id, false)
                        self.onError(file.id, file.name, errorString);
                    },
                    upload_success_handler: function (file, data, response) {
                        var self = this.customSettings.owner;
                        try {
                            self.onComplete(file.id, file.name, $.parseJSON(data)[0]);
                        } catch (err) {
                            self.onError(file.id, file.name, "返回信息错误!");
                        }
                    },
                    upload_complete_handler: function (file) {
                        self._startUpload();
                    },

                    custom_settings: {
                        owner: self
                    }
                }

                self._swfcontrol = new SWFUpload(swfUploadSettings);

                var $wrapper = $('<div />', {
                    'id': settings.id,
                    //'class': 'uploadify',
                    'css': {
                        'height': settings.height + 'px',
                        'width': settings.width + 'px',
                        "position": "relative"
                    }
                });
                $('#' + self._swfcontrol.movieName).wrap($wrapper);
                // Recreate the reference to wrapper
                $wrapper = $('#' + settings.id);
                $wrapper.append(self._select);

                // Adjust the styles of the movie
                $('#' + self._swfcontrol.movieName).css({
                    'position': 'absolute',
                    'z-index': 1
                });
                self._swfcontrol.button = self._select;
                $(self._swfcontrol.getMovieElement()).attr("name", $(self._swfcontrol.getMovieElement()).attr('id'));
            },
            _startUpload: function () {
                var self = this;
                if (self._swfcontrol == undefined || self._swfcontrol == null) return false;
                try {
                    self._swfcontrol.startUpload();
                } catch (e) {
                }
            },
            cancel: function (id) {
                var self = this;
                self._swfcontrol.cancelUpload(id);
            },
            destroy: function () {
                if (window.SWFUpload == undefined) return false;
                var self = this;
                if (self._swfcontrol == undefined || self._swfcontrol == null) return false;
                self._swfcontrol.destroy();
                delete self._swfcontrol;
            }
        };

        $.fn.uploadFiles.handler.add(FlashUploadFile, 6);

    })(jQuery);

})(jQuery);

