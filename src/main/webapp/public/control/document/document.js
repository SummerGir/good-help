(function ($, undefined) {

    function _getBasePath() {
        var els = document.getElementsByTagName('script'), src;
        for (var i = 0, len = els.length; i < len; i++) {
            src = els[i].src || '';
            if (/document.js/.test(src)) {
                return src.substring(0, src.lastIndexOf('/') + 1);
            }
        }
        return '';
    }

    //获得 ID
    var createDocumentID = function () {
        return 'document_id_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };


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
    var basePath = _getBasePath();

    var _templatePanel = null;
    var getTemplatePanel = function () {
        if (_templatePanel == null) {
            $.ajax({
                url: basePath + "template.jsp",
                async: false,
                dataType: "html",
                error: $.message.ajaxError,
                success: function (data, textStatus, jqXHR) {
                    _templatePanel = data;
                }
            });
        }
        return _templatePanel;
    };

    var createButtons = function (title, icon, btnClass, menu, jqParent) {
        if (menu.length == 0) return;
        var jqButton;
        if (menu.length > 1) {
            jqButton = $("<div class=\"btn-group\">")
                .append($("<button style='margin: 2px 3px;' type=\"button\" class=\"btn " + btnClass + " dropdown-toggle\" data-toggle=\"dropdown\" title=\"" + title + "\"><i class=\"" + icon + "\"></i><span class=\"hidden-xs\"> " + title + "</span> <span class=\"caret\"></span></button>"))
                .append($("<ul class=\"dropdown-menu\" role=\"menu\" />"));
            var jqMenu = jqButton.children(".dropdown-menu");
            for (var i = 0, j = menu.length; i < j; i++) {
                var item = menu[i];
                jqMenu.append($("<li/>")
                    .append($("<a href=\"javascript:void(0)\"/>")
                        .append(function () {
                            var html = "";
                            if (!String.isNullOrWhiteSpace(item.icon)) {
                                html += "<i class=\"" + item.icon + "\"></i> ";
                            }
                            html += item.caption;
                            return html;
                        })).on("click", item.execute));
            }
        } else {
            jqButton = $("<button style='margin: 2px 3px;' type=\"button\" class=\"btn\" title=\"" + title + "\"><i class=\"" + icon + "\"></i><span class=\"hidden-xs\"> " + title + "</span></button>")
                .addClass(function () {
                    return String.isNullOrWhiteSpace(btnClass) ? "" : btnClass;
                })
                .on("click", menu[0].execute);
        }
        jqParent.append(jqButton).append(" ");
    };

    var createButtons1 = function (title, icon, btnClass,jqParent,name,download,contentType) {
        var jqButton = $("<button style='margin: 2px 3px;' type=\"button\" class=\"btn\" title=\"" + title + "\"><i class=\"" + icon + "\"></i><span class=\"hidden-xs\"> " + title + "</span></button>").addClass(function () {
            return String.isNullOrWhiteSpace(btnClass) ? "" : btnClass;
        }).on("click", function(){
            openFileByOther(contentType,name,download);
        });

        jqParent.append(jqButton).append(" ");
    };

    var transformToReadyPlugin = function (plugin, triggerElement, eventName, eventData, args, updateCallback) {
        return {
            icon: plugin.icon,
            caption: plugin.caption,
            name: plugin.name,
            execute: function () {
                var tmpEventData = $.extend(true, {}, eventData, {
                    cancel: false,
                    plugin: plugin.name,
                    args: null
                });
                triggerElement.triggerHandler(eventName + ".before.document", [tmpEventData]);
                if (tmpEventData.cancel) return;

                var executeArgs = [];
                executeArgs.addRange(args);

                executeArgs.push(function (result) {
                    if ($.isPlainObject(result) && $.isFunction(updateCallback)) {
                        updateCallback(result);
                    }
                    var tmpEventData = $.extend(true, {}, eventData, {
                        plugin: plugin.name,
                        result: result
                    });
                    triggerElement.triggerHandler(eventName + ".after.document", [tmpEventData]);
                });

                if (tmpEventData.args != undefined && tmpEventData.args != null) {
                    if ($.isArray(tmpEventData.args)) {
                        executeArgs.addRange(tmpEventData.args);
                    } else {
                        executeArgs.push(tmpEventData.args);
                    }
                }

                plugin.execute.apply(window, executeArgs);
            }
        };


    };

    var _document = function (element, option) {
        var self = this;
        self.option = $.extend(true, {}, $.fn.document.option, option);
        if (!$.isArray(self.option.allowedExtensions)) {
            self.option.allowedExtensions = [];
        }
        for (var i = 0, j = self.option.allowedExtensions.length; i < j; i++) {
            self.option.allowedExtensions[i] = self.option.allowedExtensions[i].toLowerCase();
        }
        self.element = element;
        self._jqElement = $(self.element);

        self._jqPanel = $(getTemplatePanel());
        self._jqPanel.appendTo(self.element);
        self._jqExtendTable=self._jqPanel.find(".extendInfo");
        self._jqExtendTbody=self._jqPanel.find(".extendInfo tbody");

        self._jqFileBody = self._jqPanel.find(".document-list>table>tbody");

        self._jqTemplate = self._jqFileBody.children("tr.document-template").remove().removeClass("document-template");

        var addGlobalPlugin = function (name) {
            if (pluginsMap.containsKey(name)) return;
            $.fn.document.addSupportComponent("EIIS.Common.controls.document.plugins." + name);
        };

        if (self.option.canNew === true
            || self.option.canEdit === true
            || self.option.canRead === true) {

            if ("all".equalsIgnoreCase(self.option.plugins)) {
                $.fn.document.addSupportComponent("EIIS.Common.controls.document.plugins.all");
            } else if ($.type(self.option.plugins) === "string") {
                addGlobalPlugin(self.option.plugins);
            } else if ($.isArray(self.option.plugins)) {
                for (var i = 0, j = self.option.plugins.length; i < j; i++) {
                    addGlobalPlugin(self.option.plugins[i]);
                }
            }

        }

        if (self.option.canUpload === true) {
            $.fn.document.addSupportComponent("EIIS.Common.controls.document.upload");
            //EIIS.Common.loadComponent("EIIS.Common.controls.document.upload");
            //$.fn.document.addSupportJs(EIIS.Common.controls.document.upload.js);
        }

        self._newPluginMap = new HashMap();
        self._editPluginMap = new HashMap();
        self._readPluginMap = new HashMap();

        $.fn.document.initSupportComponents(function () {
            self._create.call(self);
        });

        return self;
    };
    _document.prototype = {
        option: null,
        element: null,
        _jqElement: null,
        _jqPanel: null,
        _jqFileBody: null,
        _jqTemplate: null,
        _uploadInstance: null,
        _jqExtendTable : null,
        _jqExtendTbody : null,
        extendInfoTemplate : function(index,content,num,coment){
            if(!coment){
                return '<tr><td class="extendTitle">'+index+'、'+content+'  '+num+'张'+'</td></tr>';
            }else{
                return '<tr><td class="extendTitle">'+index+'、'+content+'  '+num+'张'+'('+coment+')'+'</td></tr>';
            }
        },
        putExtendInfo : function(){
            var self=this;
            var sourceInput=self._jqElement.prev();
            var updateimg = sourceInput.attr("data-updateimg");
            if(updateimg == undefined){
                updateimg = self.option.updateimg;
            }
            $.fn.document.option.updateimg = updateimg;
            if(!self.option.infoComment){
                return;
            }
            var extendType=sourceInput.attr("data-extendType");
            var extendLayerNum=sourceInput.attr("data-extendLayerNum");
            if(extendType && extendLayerNum){
                $.ajax({
                    type : "post",
                    url : "/public/constraint/getExtendInfo.do",
                    data : {
                        type : extendType,
                        layerNum : extendLayerNum
                    },
                    dataType : "json",
                    success : function(msg){
                        if($.isEmptyObject(msg)){
                            return;
                        }
                        var html="";
                        var details=msg.extendInfo.details;
                        var detail;
                        for(var i=0;i<details.length;i++){
                            detail=details[i];
                            html+=self.extendInfoTemplate((i+1),detail.content,detail.num,detail.coment);
                        }
                        self._jqExtendTbody.empty().append(html);
                        self._jqExtendTable.show();
                    },error : function(){}
                });
            }
        },
        getUrls: function (status) {
            var urls = [];
            this._jqFileBody.children("[data-status=\"" + status + "\"]").each(function () {
                urls.push($(this).attr("data-path"));
            });
            return urls;
        },
        isBusy: function () {
            return this._jqFileBody.children(":not([data-status])").length > 0;
        },
        createNew: function (name, canDelete) {
            var self = this;
            var re = self._createNewAllowed(name);
            if ($.type(re) === "string") {
                $.message(re);
                return;
            }
            self._createNew(name, canDelete);
        },
        _createNewAllowed: function (name) {
            var self = this;
            if (String.isNullOrWhiteSpace(name)) {
                return "文档名称不能为空！";
            }
            var re = self.isAllowed(name);
            if ($.type(re) === "string") {
                return re;
            }
            if (!self._newPluginMap.containsKey($.fn.document.getExtension(name).toLowerCase())) {
                return "不支持新建该文档.";
            }
            return false;
        },
        _createNew: function (name, canDelete) {
            var self = this;
            var jqFile = self._put(name);
            if ($.type(jqFile) === "string") {
                $.message(jqFile);
                return;
            }
            var dowSrc = "/file/download"+jqFile.attr("data-path");
            var id = jqFile.attr("id");
            self._update(id, name, 0,"");
            var jqButton = jqFile.find(".document-button").empty();

            var newMenu = new Array();
            var plugins = self._newPluginMap.get($.fn.document.getExtension(name).toLowerCase())
            for (var i = 0, j = plugins.length; i < j; i++) {
                var plugin = plugins[i];
                newMenu.push(transformToReadyPlugin(plugin, self._jqElement, "new", {
                    name: name
                }, [name], function (result) {
                    self._update(id, result.uri, result.size,result.contentType);
                    self._setStatus(id, $.fn.document.status.VALID,result.contentType);
                }));
            }

            createButtons("编辑", "glyphicon glyphicon-edit", "btn-success", newMenu, jqButton);

            if (canDelete != false) {
                jqButton.append(
                    $("<button class=\"btn btn-warning\" title=\"取消\"><i class=\"glyphicon glyphicon-ban-circle\"></i><span class=\"hidden-xs\"> 取消</span></button>")
                        .on("click", function () {
                            self._remove(id);
                        })
                ).append(" ");
            }

        },
        put: function (urls) {
            var self = this;
            var fileValues = [];
            if (!$.isArray(urls)) {
                fileValues.push(urls.toString());
            } else {
                fileValues.addRange(urls);
            }
            if (fileValues.length > 0) {
                $.ajax({
                    url: "/file/info/",
                    data: ({
                        'files': fileValues.join("|")
                    }),
                    type: "POST",
                    dataType: "json",
                    success: function (data, status, xhr) {
                        if (data.length > 0) {
                            for (var i = 0, j = data.length; i < j; i++) {
                                var jqFile = self._put(data[i].uri);
                                if(self.option.infoExtend){
                                    jqFile.attr({
                                        "data-sendName" : data[i].sendName,
                                        "data-sendTime" : data[i].sendTime
                                    });
                                }
                                if ($.type(jqFile) === "string") {
                                    $.message(jqFile);
                                    continue;
                                }
                                var id = jqFile.attr("id");
                                self._update(id, data[i].uri, data[i].size,data[i].contentType);
                                self._setStatus(id, $.fn.document.status.VALID,data[i].contentType);
                            }
                        }
                    }
                });
            }
        },
        _put: function (url) {

            var name = $.fn.document.getFileName(url);

            var re = this.isAllowed(url);
            if ($.type(re) === "string") {
                return re;
            }

            var jqFile = this._jqTemplate.clone().attr({
                "id": createDocumentID(),
                "data-name": name,
                "data-path": url
            }).appendTo(this._jqFileBody);

            this._refreshPanel();
            return jqFile;
        },
        isAllowed: function (url) {
            var name = $.fn.document.getFileName(url);
            if (this.option.allowedExtensions.length > 0) {
                if (!this.option.allowedExtensions.contains($.fn.document.getExtension(name).toLowerCase())) {
                    return "文档“" + name + "”不被支持.";
                }
            }
            /*if (this._jqFileBody.children("[data-name=\"" + name + "\"][data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length > 0) {
             return "名称为“" + name + "”的文档已经存在.";
             }*/
            if (!this.option.multiple) {
                if (this._jqFileBody.children("[data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length > 0) {
                    return "不支持多文档.";
                }
            }
            return;
        },
        /*remove: function (url) {
         var re = this._jqFileBody.children("[data-path=\"" + url + "\"]");
         if (re.length == 0) {
         re = this._jqFileBody.children("[data-name=\"" + url + "\"]");
         }
         re.remove();
         },*/
        _remove: function (id) {
            this._jqFileBody.children("#" + id).remove();
            this._refreshPanel();
        },
        _refreshPanel: function () {
            if (this.option.canUpload || this.option.canNew) {
                if (!this.option.multiple) {
                    if (this._jqFileBody.children("[data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length > 0) {
                        this._jqPanel.children(".panel-heading").hide();
                    } else {
                        this._jqPanel.children(".panel-heading").show();
                    }
                }
            } else {
                this._jqPanel.children(".panel-heading").hide();
            }
        },
        _update: function (id, url, size,contentType) {
            var self = this;
            var jqFile = self._jqFileBody.children("#" + id);
            jqFile.attr({
                "data-path": url,
                "data-name": name
            });
            // var name=$.fn.document.getFileName(url);
            var dowSrc = "/file/download"+jqFile.attr("data-path");
            var name = jqFile.attr("data-name");
            var fileType = dowSrc.substr(dowSrc.lastIndexOf(".")+1).toLocaleLowerCase();
            //var num=this._jqFileBody.children("[data-name=\"" + name + "\"][data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length/2-1;
            //console.log(name);
            //console.log(this._jqFileBody.children("[data-name=\"" + name + "\"][data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length);
            //console.log(num);
            ////console.log();
            //if(num>0){
            //    name=name.substring(0,name.lastIndexOf("."))+"("+num+")"+name.substring(name.lastIndexOf("."));
            //}
            jqFile.find(".document-preview")
                .empty().append(
                $("<img />")
                    .attr("src", basePath + "preview.jsp?url=" + encodeURIComponent(url)).attr("style","width:80px; height:80px;").attr("data-src",dowSrc).attr("data-name",name).attr("data-fileType",fileType).attr("data-contentType",contentType)
            );
            jqFile.find(".document-info")
                .empty().append(
                $("<span/>").text(name).attr("style","width:100px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;display:inline-block;display:-moz-inline-box;")
            );
            jqFile.find(".document-size")
                .empty().append(
                $("<span />")
                    .text(formatSize(size))
            );
        },
        _setStatus: function (id, status,contentType) {

            var self = this;
            var jqFile = self._jqFileBody.children("#" + id);

            var dowSrc = "/file/download"+jqFile.attr("data-path");
            var name = jqFile.attr("data-name");
            var fileType = dowSrc.substr(dowSrc.lastIndexOf(".")+1).toLocaleLowerCase();
            if ($.fn.document.status.CANCEL.equals(status)) {

                var eventData = {
                    name: name,
                    status: status,
                    cancel: false
                };
                self._jqElement.triggerHandler("cancel.before.document", [eventData]);
                if (eventData.cancel) return;

                jqFile.attr("data-status", $.fn.document.status.CANCEL);

                jqFile.find(".document-info").css("text-decoration", "line-through");
                jqFile.find(".document-button")
                    .empty()
                    .append(
                        $("<button class=\"btn btn-warning\" title=\"撤销删除\"><i class=\"fa fa-reply\"></i><span class=\"hidden-xs\"> 撤销删除</span></button>")
                            .on("click", function () {
                                var re = self.isAllowed(name);
                                if ($.type(re) === "string") {
                                    $.message(re);
                                    return;
                                }
                                self._setStatus(id, $.fn.document.status.VALID,contentType);
                            })
                    );

                eventData = {
                    name: name,
                    status: status
                };
                self._jqElement.triggerHandler("cancel.after.document", [eventData]);

            } else if ($.fn.document.status.VALID.equals(status)) {

                var eventData = {
                    name: name,
                    status: status,
                    cancel: false
                };
                self._jqElement.triggerHandler("valid.before.document", [eventData]);
                if (eventData.cancel) return;

                jqFile.attr("data-status", $.fn.document.status.VALID);

                jqFile.find(".document-info").css("text-decoration", "");
                var jqButton = jqFile.find(".document-button").empty();

                //删除按钮
                if (self.option.canCancel) {
                    jqButton.append(
                        $("<button style='margin: 2px 3px;' class=\"btn btn-warning\" title=\"删除\"><i class=\"glyphicon glyphicon-trash\"></i><span class=\"hidden-xs\"> 删除</span></button>")
                            .on("click", function () {
                                self._setStatus(id, $.fn.document.status.CANCEL);
                            })
                    ).append(" ");
                }

                //阅读按钮
                if (self.option.canRead) {
                    var ext = $.fn.document.getExtension(name).toLowerCase();
                    // if (self._readPluginMap.containsKey(ext)) {
                    //     var readMenu = new Array();
                    //     var plugins = self._readPluginMap.get(ext)
                    //     for (var i = 0, j = plugins.length; i < j; i++) {
                    //         var plugin = plugins[i];
                    //         readMenu.push(transformToReadyPlugin(plugin, self._jqElement, "read", {
                    //             name: name,
                    //             jqButton : jqButton
                    //         }, [jqFile.attr("data-path")]));
                    //     }
                    //
                    //     createButtons("阅读", "glyphicon glyphicon-list-alt", "btn-success", readMenu, jqButton);
                    // }
                    if(EIIS.browser.phone && ("jpg,jpeg,png,gif,bmp".indexOf(fileType) < 0 || (!eval($.fn.document.option.updateimg) && "jpg,jpeg,png,gif,bmp".indexOf(fileType) >= 0))){
                        //app上非图片
                        createButtons1("阅读", "glyphicon glyphicon-list-alt", "btn-success",jqButton,name, dowSrc,contentType);
                    }else if (self._readPluginMap.containsKey(ext) && (!EIIS.browser.phone || "jpg,jpeg,png,gif,bmp".indexOf(fileType) >= 0)) {
                        var readMenu = new Array();
                        var plugins = self._readPluginMap.get(ext)
                        for (var i = 0, j = plugins.length; i < j; i++) {
                            var plugin = plugins[i];
                            readMenu.push(transformToReadyPlugin(plugin, self._jqElement, "read", {
                                name: name,
                                jqButton : jqButton
                            }, [jqFile.attr("data-path")]));
                        }

                        createButtons("阅读", "glyphicon glyphicon-list-alt", "btn-success", readMenu, jqButton);
                    }
                }

                //编辑按钮
                if (self.option.canEdit) {
                    var ext = $.fn.document.getExtension(name).toLowerCase();
                    if (self._editPluginMap.containsKey(ext)) {

                        var editMenu = new Array();
                        var plugins = self._editPluginMap.get(ext)
                        for (var i = 0, j = plugins.length; i < j; i++) {
                            var plugin = plugins[i];
                            editMenu.push(transformToReadyPlugin(plugin, self._jqElement, "edit", {
                                name: name
                            }, [jqFile.attr("data-path")], function (result) {
                                self._update(id, result.uri, result.size,contentType);
                                self._setStatus(id, $.fn.document.status.VALID,contentType);
                            }));
                        }

                        createButtons("编辑", "glyphicon glyphicon-edit", "btn-success", editMenu, jqButton);
                    }
                }

                //下载按钮
                if (self.option.canDownload) {
                    //pc登陆 或者 文件不是文档的 才有下载 txy 2016-3-3 18:07:18
                    // if(!EIIS.browser.phone || "xlsx,xls,doc,docx,ppt,pptx,pdf,txt,jpg,jpeg,png,gif,bmp,xml".indexOf(fileType) < 0){
                    //     jqButton.append(
                    //         $("<a class=\"btn btn-info\" target=\"_blank\" role=\"button\" title=\"下载\"><i class=\"glyphicon glyphicon-download\"></i><span class=\"hidden-xs\"> 下载</span></a>")
                    //             .attr("href", dowSrc))
                    //         .append(" ");
                    // }

                    //PC端都可以下载
                    if(!EIIS.browser.phone){
                        jqButton.append(
                            $("<a  style='margin: 2px 3px;' class=\"btn btn-info\" target=\"_blank\" role=\"button\" title=\"下载\"><i class=\"glyphicon glyphicon-download\"></i><span class=\"hidden-xs\"> 下载</span></a>")
                                .attr("href", dowSrc))
                            .append(" ");
                    }else if(EIIS.browser.phone && "jpg,jpeg,png,gif,bmp".indexOf(fileType) >= 0){
                        //app只允许图片下载，下载到手机的本地图库
                        jqButton.append(
                            $("<a style='margin: 2px 3px;' class=\"btn btn-info\" data-src='"+dowSrc+"' title=\"下载\"><i class=\"glyphicon glyphicon-download\"></i><span class=\"hidden-xs\"> 下载</span></a>").on("click", function () {
                                var src = $(this).attr("data-src");
                                saveImgToLib(src);
                            })).append(" ");
                    }
                }

                if(self.option.infoExtend){
                    var sendName=jqFile.attr("data-sendName");
                    var sendTime=jqFile.attr("data-sendTime");
                    if(sendName && sendTime){
                        if(EIIS.browser.phone){
                            jqFile.find(".document-button").addClass("phoneExtend").append('<div class="phoneExtendInfo"><span>发 起 人:'+sendName+'</span><br/><span>发起时间:'+sendTime+'</span></div>');
                        }else{
                            jqFile.find(".document-preview").after('<td class="sendName">发起人:<span>'+sendName+'</span></td>');
                            jqFile.find(".document-size").before('<td class="sendTime">发起时间:<span>'+sendTime+'</span></td>');
                        }
                    }
                }

                eventData = {
                    name: name,
                    status: status
                };
                self._jqElement.triggerHandler("valid.after.document", [eventData]);
            }
            this._refreshPanel();
        },
        _create: function () {
            var self = this;
            if ("all".equalsIgnoreCase(self.option.plugins)) {
                var plugins = pluginsMap.values();
                for (var i = 0, j = plugins.length; i < j; i++) {
                    self._addPlugin(plugins[i]);
                }
            } else if ($.type(self.option.plugins) === "string") {
                if (pluginsMap.containsKey(self.option.plugins)) {
                    self._addPlugin(pluginsMap.get(self.option.plugins));
                }
            } else if ($.isArray(self.option.plugins)) {
                for (var i = 0, j = self.option.plugins.length; i < j; i++) {
                    if (pluginsMap.containsKey(self.option.plugins[i])) {
                        self._addPlugin(pluginsMap.get(self.option.plugins[i]));
                    }
                }
            }

            if (self.option.canUpload === true
                && $.isFunction($.fn.document.upload)) {
                self._jqPanel.find(".document-upload-button").show();

                var i = 0;
                var _createUpload = function () {
                    if ($.isFunction($.fn.document.upload.prototype.create)) {
                        self._uploadInstance = new $.fn.document.upload(self, self._jqPanel.find(".document-upload-button"));
                        return;
                    }
                    i++;
                    if (i < 20) {
                        setTimeout(_createUpload, 100);
                    } else {
                        alert("载入上传组件失败.");
                    }
                };
                _createUpload();

            } else {
                self._jqPanel.find(".document-upload-button").remove();
            }

            if (self.option.canNew === true
                && !self._newPluginMap.isEmpty()) {

                var jqNewDialog = self._jqPanel.find(".document-new-dialog").hide();

                self._jqPanel.find(".document-new-button").show()
                    .on("click", function () {
                        jqNewDialog.find(":text").val("");
                        jqNewDialog.find(".document-new-dialog-error").text("");
                        jqNewDialog.modal("show");
                        setTimeout(function () {
                            jqNewDialog.find(":text").focus();
                        }, 1000);
                    });

                jqNewDialog.find(":button[data-type='submit']")
                    .on("click", function () {
                        var name = jqNewDialog.find(":text").val();
                        var re = self._createNewAllowed(name);
                        if ($.type(re) === "string") {
                            jqNewDialog.find(".document-new-dialog-error").text(re);
                            return;
                        }
                        self._createNew(name);
                        jqNewDialog.modal("hide");
                    });

                var _newKeys = self._newPluginMap.keys();
                _newKeys.distinct();
                jqNewDialog.find(".document-new-dialog-info").text("说明：文档名称包括文档的后缀名。后缀名可以为 [" + _newKeys.join("、") + "] 等。");

            } else {
                self._jqPanel.find(".document-new-button").remove();
                self._jqPanel.find(".document-new-dialog").remove();
            }

            self._refreshPanel();

            setTimeout(function () {
                self._jqElement.triggerHandler("created.document");
            }, 0);

            self.putExtendInfo();
        },
        _newPluginMap: null,
        _editPluginMap: null,
        _readPluginMap: null,
        _addPlugin: function (plugin) {
            var self = this;
            if ($.isPlainObject(plugin)) {
                var errorSet = new Array();
                var handlePluginCan = function (pluginCan, pluginMap, extension, name, icon) {
                    if ($.isFunction(pluginCan)) {
                        var can = pluginCan.call(window);
                        if ($.isPlainObject(can)) {
                            if ($.type(can.caption) === "string"
                                && $.isFunction(can.execute)) {
                                var value;
                                if (pluginMap.containsKey(extension)) {
                                    value = pluginMap.get(extension);
                                } else {
                                    value = new Array();
                                }
                                value.push({
                                    name: name,
                                    icon: icon,
                                    caption: can.caption,
                                    execute: can.execute
                                });
                                pluginMap.put(extension, value);
                            }
                        } else if (can instanceof jQuery) {
                            if (!errorSet.contains(can)) {
                                errorSet.push(can);
                            }
                        }
                    }
                };
                for (var key in  plugin) {
                    var extension = key.toString().toLowerCase();
                    if (self.option.allowedExtensions.length > 0) {
                        if (!self.option.allowedExtensions.contains(extension)) {
                            continue;
                        }
                    }
                    handlePluginCan(plugin[key].canNew, self._newPluginMap, extension, plugin.name, plugin[key].icon);
                    handlePluginCan(plugin[key].canEdit, self._editPluginMap, extension, plugin.name, plugin[key].icon);
                    handlePluginCan(plugin[key].canRead, self._readPluginMap, extension, plugin.name, plugin[key].icon);
                }

                if (errorSet.length > 0) {
                    var jqFooter = $("<div class=\"panel-footer\"/>").appendTo(self._jqPanel);
                    $.each(errorSet, function () {
                        this.clone(true, true).appendTo(jqFooter);
                    });
                }
            }
        }
    };

    //获得 ID
    /*var createDocumentInstanceID = function () {
     return (((1 + Math.random()) * 0x10000000000) | 0);
     };
     var _instanceMap = new HashMap();*/

    $.fn.document = function () {
        arguments[0].canRead=true;
        if (this.length > 0) {
            var self = this[0];
            if ($.type(arguments[0]) === 'string'
                && !arguments[0].startsWith("_")) {
                var _instance = $.data(self, "eiis-document");
                //var instanceID = self.getAttribute("data-document-instance");
                //var _instance = _instanceMap.get(instanceID);
                if (_instance) {
                    if ($.isFunction(_instance[arguments[0]])) {
                        var args = Arrays.clone(arguments);
                        args.splice(0, 1);
                        var result = _instance[arguments[0]].apply(_instance, args);
                        return result != undefined ? result : this;
                    }
                    return _instance[arguments[0]];
                }
            } else if ($.isPlainObject(arguments[0])) {
                //var instanceID = createDocumentInstanceID().toString();
                //self.setAttribute("data-document-instance", instanceID);
                //_instanceMap.put(instanceID, new _document(self, arguments[0]));
                $.data(self, "eiis-document", new _document(self, arguments[0]));
                //$(self).triggerHandler("created.document");
            }
        }
        return this;
    };

    $.fn.document.option = {
        canUpload: true,
        canNew: true,
        canEdit: true,
        canRename: true,
        canCancel: true,
        canRead: true,
        canDownload: true,
        multiple: true,
        infoExtend : false,
        plugins: "all",
        allowedExtensions: null,
        updateimg:false
    };


    var pluginsMap = new HashMap();

    $.fn.document.plugins = {
        register: function (name, plugin) {
            if (pluginsMap.containsKey(name)) {
                return;
            }
            /*for (var key in plugin) {
             if (plugin[key].name == undefined) {
             plugin[key].name = name;
             }
             }*/
            if (plugin.name == undefined) {
                plugin.name = name;
            }
            pluginsMap.put(name, plugin);
        }
    };

    $.fn.document.status = {
        CANCEL: "cancel",
        VALID: "valid"
    };

    $.fn.document.basePath = basePath;

    $.fn.document.getFileName = function (file) {
        return file.replace(/.*(\/|\\)/, "").replace(/tempSplitSymbol20[0-9]{2}.+\./,".");
    };

    //获取扩展名
    $.fn.document.getExtension = function (file) {
        if (/[.]/.exec(file)) {
            var tmpE = /[^.]+$/.exec(file.toLowerCase());
            if (tmpE != null && tmpE.length > 0) {
                return tmpE[tmpE.length - 1];
            }
        }
        return '';
    };

    var _supportComponents = [];

    $.fn.document.addSupportComponent = function (components) {
        if ($.isArray(components)) {
            _supportComponents.addRange(components);
        } else {
            _supportComponents.push(components);
        }
    };

    $.fn.document.initSupportComponents = function (callback) {
        if (_supportComponents.length == 0) {
            callback();
            return;
        }
        EIIS.Common.loadComponent(_supportComponents.shift(), function () {
            $.fn.document.initSupportComponents(callback);
        });
        //EIIS.Common.loadJavaScript(_supportJs.shift(), initSupportJs);
    };
    if(EIIS.browser.phone){
        $("body").append('<div class="containerGallery" id="containerGallery" style="display: none;z-index: 1049"><div class="page gallery js_show">'+
            '<div class="page__hd" style="padding: 10px;">'+
            '<div class="imgTools">' +
            '<div class="imgClose"><label class="bg-green start">关闭</label></div>'+
            '<div class="imgMark"><label class="bg-green">标记</label></div>'+
            '<div class="imgClear" style="display: none"><label class="bg-green start">清空</label></div>'+
            '<div class="imgColor" style="display: none"><div class="butLineLeft"><div></div></div>' +
                '<section class="main">'+
                '<div class="wrapper-demo">'+
                '<div class="wrapper-dropdown-5" tabindex="1"><span>颜色</span>'+
                '<ul class="dropdown">'+
                '<li class="selected"><a href="#" style="color: #ff0000" data-key="strokeStyle" data-value="#ff0000">红色</a></li>'+
                '<li><a href="#" style="color: #c3c33a" data-key="strokeStyle" data-value="#c3c33a">黄色</a></li>'+
                '<li><a href="#" style="color: #0000ff" data-key="strokeStyle" data-value="#0000ff">蓝色</a></li>'+
                '</ul>'+
                '</div>'+
                '​</div>'+
                '</section>'+
            '<div class="butLineRight"><div></div></div></div>'+
            '<div class="imgThickness" style="display: none">' +
                '<section class="main">'+
                '<div class="wrapper-demo">'+
                '<div class="wrapper-dropdown-5" tabindex="1"><span>粗细</span>'+
                '<ul class="dropdown">'+
                '<li class="selected"><a href="#" data-key="lineWidth" data-value="4">1号</a></li>'+
                '<li><a href="#" data-key="lineWidth" data-value="6">2号</a></li>'+
                '<li><a href="#" data-key="lineWidth" data-value="8">3号</a></li>'+
                '</ul>'+
                '</div>'+
                '​</div>'+
                '</section>'+
            '</div>'+
            '<div class="imgSave" style="display: none"><label class="bg-green start">保存</label></div>'+
            '</div>'+
            '</div>'+
            '<div class="weui-gallery" style="display: block">'+
            '<span class="weui-gallery__img" style="background-image: url();"></span>'+
            '</div></div>');

        var wrapperDropdown=$('.wrapper-dropdown-5');
        $(document).click(function() {
            wrapperDropdown.removeClass('active');
        });
        wrapperDropdown.find("li").on("click",function(){
            var self=$(this);
            self.parents("ul").find(".selected").removeClass("selected");
            self.addClass("selected");
            self.parents("section").parent().data(self.find("a").attr("data-key"),self.find("a").attr("data-value"));
        });
        wrapperDropdown.on('click', function(event){
            $(this).toggleClass('active');
            event.stopPropagation();
        });
    }else{
        $.ajax({
            type : "post",
            url : "/public/imageShow.jsp",
            data: {},
            dataType : "html",
            success : function(msg){
                $("body").append(msg);
            }
        });
    }
})(jQuery);
function showImage(ele){
    $("body").css("overflow","hidden");
    var eleSrc;
    if(typeof ele==="string"){
        eleSrc=ele;
    }else{
        var isNotImg = $(ele).parent().attr("data-name").replace(/.+\.(jpg|gif|png|bmp|jpeg)/gi,"")!=="";//是否为非图片
        if(EIIS.browser.phone){
            if(isNotImg || !eval($.fn.document.option.updateimg)){
                var obj = $(ele).children();
                var src = $(obj).attr("data-src");//文件下载路径
                var name = $(obj).attr("data-name");//文件名
                var fileType = $(obj).attr("data-fileType");//文件后缀
                var contentType = $(obj).attr("data-contentType");//文件类型
                openFileByOther(contentType,name,src);

                return;
            }
        }else if(isNotImg){
            return;
        }

        eleSrc=$(ele).children().attr("src");
    }
    // openFileByOther("image/png","aaaa.png",eleSrc);
    var imgArr=[];
    $.each($(".document-preview img"),function(){
        if($(this).parent().parent().attr("data-name").replace(/.+\.(jpg|gif|png|bmp|jpeg)/gi,"")!==""){
            return true;
        }
        imgArr.push($(this).attr("src"));
    });
    if(EIIS.browser.phone){

        var hm={};
        var gallery=$("#containerGallery");
        var imgClose=gallery.find(".imgClose"),imgMark=gallery.find(".imgMark"),imgSave=gallery.find(".imgSave"),imgClear=gallery.find(".imgClear"),imgColor=gallery.find(".imgColor"),imgThickness=gallery.find(".imgThickness");

        imgClose.unbind("click").on("click",function(){
            var state=Boolean.parse(imgMark.attr("data-state"));
            if(!state){
                imgMark.trigger("click");
            }
            $(".swiper-slide").trigger("click");
        });
        imgClear.unbind("click").on("click",function(){
            $.message({
                button:$.message.button.yesNo
                ,text:"清空后将重置到上次保存后的图形，是否确定?"
                ,result:function(result){
                    if(result === $.message.result.yes){
                        var swiperImg=$("#swiperImg_"+mySwiper.activeIndex);
                        var $canvas=swiperImg.find("canvas");
                        swiperImg.empty().append('<canvas width="'+$canvas.attr("data-width")+'" height="'+$canvas.attr("data-height")+'" data-width="'+$canvas.attr("data-width")+'" data-height="'+$canvas.attr("data-height")+'"></canvas>');
                        createImg("swiperImg_"+mySwiper.activeIndex,imgColor,imgThickness);
                        new hammerManager(swiperImg.find("canvas")).manager();
                        var $canvas2=swiperImg.find("canvas");
                        $canvas2.disabledHammer();
                        imgMark.click();
                    }
                }
            });
        });
        imgMark.unbind("click").on("click",function(){
            var self=imgMark;
            var state=Boolean.parse(self.attr("data-state"));
            var swiperImg=$("#swiperImg_"+mySwiper.activeIndex+" canvas");
            if(state){
                self.find("label").addClass("active");
                imgClear.show();
                imgColor.show();
                imgThickness.show();
                imgSave.show();
                mySwiper.detachEvents();
                swiperImg.resetHammer(0);
                swiperImg.disabledHammer();
                mySwiper.hideState=false;

                setTimeout(function(){
                    var split=swiperImg.css("transform").replace("matrix(","").replace(")","").split(",");
                    var offSet=swiperImg.offset();
                    swiperImg.data("tempTop",offSet.top);
                    swiperImg.data("tempLeft",offSet.left);
                    swiperImg.data("WRato",swiperImg.data("imgW")/(swiperImg.width()*Number(split[0])));
                    swiperImg.data("HRato",swiperImg.data("imgH")/(swiperImg.height()*Number(split[3])));
                    swiperImg.data("markState",true);
                },500);
            }else{
                self.find("label").removeClass("active");
                imgClear.hide();
                imgColor.hide();
                imgThickness.hide();
                imgSave.hide();
                mySwiper.attachEvents();
                swiperImg.enabledHammer();
                mySwiper.hideState=true;

                swiperImg.data("markState",false);
            }
            self.attr("data-state",!state);
        }).attr("data-state","true");
        imgSave.unbind("click").on("click",function(){
            $.message({
                button:$.message.button.yesNo
                ,text:"保存后将不能还原到最初图形，是否确定?"
                ,result:function(result){
                    if(result === $.message.result.yes){
                        var self=imgSave;
                        self.find("label").addClass("active");
                        var swiperImg=$("#swiperImg_"+mySwiper.activeIndex);
                        var imgsrc=swiperImg.attr("data-imgsrc").split("?url=")[1];
                        var $canvas=swiperImg.find("canvas");
                        var canvas = $canvas[0];
                        var oMyForm = new FormData();
                        oMyForm.append("files",convertImgDataToBlob(canvas.toDataURL()));
                        oMyForm.append("imgUrl",imgsrc);
                        $.ajax({
                            type : "post",
                            url : "/public/file/replace/replaceImg.do",
                            data : oMyForm,
                            dataType : "json",
                            processData: false,
                            contentType: false,
                            success : function(msg){
                                if(msg.errorCode===0){
                                    $("img[src='"+swiperImg.attr("data-imgsrc")+"']").attr("src",swiperImg.attr("data-imgsrc")+"&n="+Math.random());
                                    swiperImg.empty().append('<canvas width="'+$canvas.attr("data-width")+'" height="'+$canvas.attr("data-height")+'" data-width="'+$canvas.attr("data-width")+'" data-height="'+$canvas.attr("data-height")+'"></canvas>');
                                    createImg("swiperImg_"+mySwiper.activeIndex,imgColor,imgThickness);
                                    new hammerManager(swiperImg.find("canvas")).manager();
                                    gallery.find(".imgMark").click();
                                    $(".swiper-slide").trigger("click");
                                }else{
                                    $.message("保存失败");
                                }
                                self.find("label").removeClass("active");
                            }
                        });
                    }
                }
            });
        });
        var gallerys=gallery.find(".weui-gallery");

        gallerys.html('<div class="swiper-container"><div class="swiper-wrapper"></div></div>');
        var mySwiper = new Swiper('.swiper-container', {
            onSlideNextEnd: function(swiper){
                var $2 = $("#swiperImg_" + (Number(swiper.activeIndex)-1));
                $2.find("canvas").resetHammer();
                $("#swiperImg_" + swiper.activeIndex).find("canvas").resetHammer();
            },
            onSlidePrevEnd: function(swiper){
                var $2 = $("#swiperImg_" + (Number(swiper.activeIndex)+1));
                $2.find("canvas").resetHammer();
                $("#swiperImg_" + swiper.activeIndex).find("canvas").resetHammer();
            }
        });
        var index=0;
        var winWidth=$(window).width();
        var winHeight=$(window).height()-51;
        for(var i=0;i<imgArr.length;i++){
            if(eleSrc===imgArr[i]){
                index=i;
            }
            mySwiper.appendSlide('<div class="swiper-slide"><div class="imgContain"  id="swiperImg_'+i+'" data-imgSrc="'+imgArr[i]+'"><canvas width="'+winWidth+'" height="'+winHeight+'" data-width="'+winWidth+'" data-height="'+winHeight+'"></canvas></div></div>');
            createImg("swiperImg_"+i,imgColor,imgThickness);
        }
        mySwiper.hideState=true;
        $(".swiper-slide").bind("click",function(){
            if(mySwiper.hideState){
                $("body").css("overflow","initial");
                gallery.hide();
            }
        });
        hm=new hammerManager($("#swiperImg_"+0+" canvas"));
        hm.manager();
        setTimeout(function(){
            mySwiper.onResize();
        },100);
        mySwiper.slideTo(index,0,true);
        gallery.show();
        if(!eval($.fn.document.option.updateimg)){
            $(".js_show>.page__hd").hide();
        }
    }else{
        localStorage.removeItem("srcs");
        localStorage["srcs"]=imgArr;
        $("#imageShow").html("<iframe id=\"iframe\" src=\"/public/imgShowMaxSmail.jsp?state=0&src="+eleSrc+"&n="+Math.random()+"\" frameBorder=\"0\" width=\"100%\" height=\"100%\" scrolling=\"no\" allowTransparency=\"true\"></iframe>");
        $("#imageShow").show();
        $(ele).removeAttr("href");
    }
}
function createImg(id,color,line){
    var contain=$("#"+id);
    var $canvas=contain.find("canvas");
    var canvas=$canvas[0];
    var cxt=canvas.getContext("2d");
    var image=new Image();
    var offTop=0,offLeft=0;
    var WRato,HRato;
    image.onload=function(){
        var imgW=this.width;
        var imgH=this.height;
        $canvas.data("imgW",imgW);
        $canvas.data("imgH",imgH);
        var canW=$canvas.attr("data-width");
        var canH=$canvas.attr("data-height");
        var lastW,lastH,rato;

        if(imgW<=canW && imgH<=canH){//图片长宽都小于容器不进行等比例缩放，计算x，y的偏移量
            lastH=imgH;
            lastW=imgW;
        }else if(imgW>canW && imgH>canH){//图片长宽都大于容器将进行等比例缩放，取最大差值比例，宽度差大于宽度差计算y的偏移量反之计算x
            var minusW=imgW-canW;
            var minusH=imgH-canH;

            if(minusW>minusH){
                rato=canW/imgW;
                lastW=canW;
                lastH=imgH*rato;
            }else{
                rato=canH/imgH;
                lastH=canH;
                lastW=imgW*rato;
            }
        }else if(imgW<=canW && imgH>canH){
            rato=canH/imgH;
            lastH=canH;
            lastW=imgW*rato;
        }else if(imgW>canW && imgH<=canH){
            rato=canW/imgW;
            lastH=imgH*rato;
            lastW=canW;
        }
        canvas.width=imgW;
        canvas.height=imgH;
        canvas.style.width=lastW+"px";
        canvas.style.height=lastH+"px";
        canvas.style.position="absolute";
        offTop=((canH-lastH)/2);
        offLeft=((canW-lastW)/2);
        canvas.style.top=offTop+"px";
        canvas.style.left=offLeft+"px";
        offTop+=50;
        cxt.drawImage(image,0,0,imgW,imgH);

        WRato=imgW/lastW;
        HRato=imgH/lastH;
        $canvas.data("lastW",lastW);
        $canvas.data("lastH",lastH);
    };
    image.src=contain.attr("data-imgSrc")+"&n="+Math.random();
    $canvas.on({
        touchstart : function(e){
            if($canvas.data("markState")){
                e=e.originalEvent.changedTouches[0];
                cxt.beginPath();
                cxt.lineWidth = line.data("lineWidth")?line.data("lineWidth"):4;
                cxt.strokeStyle = color.data("strokeStyle")?color.data("strokeStyle"):"#FF0000";
                cxt.moveTo((e.clientX-$canvas.data("tempLeft"))*$canvas.data("WRato"),(e.clientY-$canvas.data("tempTop"))*$canvas.data("HRato"));
            }
        },
        touchmove : function(e){
            if($canvas.data("markState")){
                e=e.originalEvent.changedTouches[0];
                cxt.lineTo((e.clientX-$canvas.data("tempLeft"))*$canvas.data("WRato"),(e.clientY-$canvas.data("tempTop"))*$canvas.data("HRato"));
                cxt.stroke();
            }
        }
    });
}
function convertImgDataToBlob(base64Data) {
    var format = "image/png";
    var base64 = base64Data;
    var code = window.atob(base64.split(",")[1]);
    var aBuffer = new window.ArrayBuffer(code.length);
    var uBuffer = new window.Uint8Array(aBuffer);
    for(var i = 0; i < code.length; i++){
        uBuffer[i] = code.charCodeAt(i) & 0xff ;
    }
    var blob=null;
    try{
        blob = new Blob([uBuffer], {type : format});
    }
    catch(e){
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if(e.name == 'TypeError' && window.BlobBuilder){
            var bb = new window.BlobBuilder();
            bb.append(uBuffer.buffer);
            blob = bb.getBlob("image/png");

        }
        else if(e.name == "InvalidStateError"){
            blob = new Blob([aBuffer], {type : format});
        }
        else{

        }
    }
    return blob;
}