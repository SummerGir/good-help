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
                .append($("<button type=\"button\" class=\"btn " + btnClass + " dropdown-toggle\" data-toggle=\"dropdown\" title=\"" + title + "\"><i class=\"" + icon + "\"></i><span class=\"hidden-xs\"> " + title + "</span> <span class=\"caret\"></span></button>"))
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
            jqButton = $("<button type=\"button\" class=\"btn\" title=\"" + title + "\"><i class=\"" + icon + "\"></i><span class=\"hidden-xs\"> " + title + "</span></button>")
                .addClass(function () {
                    return String.isNullOrWhiteSpace(btnClass) ? "" : btnClass;
                })
                .on("click", menu[0].execute);
        }
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
        getUrls: function (status) {
            var urls = [];
            this._jqFileBody.children("[data-status=\"" + status + "\"]").each(function () {
                urls.push($(this).attr("data-path"));
                if(urls.length>0){
                    var temp = [];
                    var index = [];
                    var l = urls.length;
                    for(var i = 0; i < l; i++) {
                        for(var j = i + 1; j < l; j++){
                            if (urls[i] === urls[j]){
                                i++;
                                j = i;
                            }
                        }
                        temp.push(urls[i]);
                        index.push(i);
                    }
                    urls.clear();
                    urls=temp;
                    console.log(urls);
                }
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
            var id = jqFile.attr("id");
            self._update(id, name, 0);
            var jqButton = jqFile.find(".document-button").empty();

            var newMenu = new Array();
            var plugins = self._newPluginMap.get($.fn.document.getExtension(name).toLowerCase())
            for (var i = 0, j = plugins.length; i < j; i++) {
                var plugin = plugins[i];
                newMenu.push(transformToReadyPlugin(plugin, self._jqElement, "new", {
                    name: name
                }, [name], function (result) {
                    self._update(id, result.uri, result.size);
                    self._setStatus(id, $.fn.document.status.VALID);
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
                                self._update(id, data[i].uri, data[i].size);
                                self._setStatus(id, $.fn.document.status.VALID);
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
        _update: function (id, url, size) {
            var self = this;
            var jqFile = self._jqFileBody.children("#" + id);
            var name=$.fn.document.getFileName(url);
            //var num=this._jqFileBody.children("[data-name=\"" + name + "\"][data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length/2-1;
            //console.log(name);
            //console.log(this._jqFileBody.children("[data-name=\"" + name + "\"][data-status!=\"" + $.fn.document.status.CANCEL + "\"]").length);
            //console.log(num);
            ////console.log();
            //if(num>0){
            //    name=name.substring(0,name.lastIndexOf("."))+"("+num+")"+name.substring(name.lastIndexOf("."));
            //}
            jqFile.attr({
                "data-path": url,
                "data-name": name
            });
            var tem=name.split(".");
            var suffix=tem[tem.length-1];
            // var suffix=/(?<=\.)\w+$/.exec(name);
            if(suffix===undefined){
                suffix="";
            }
            jqFile.find(".document-preview")
                .empty().append(
                $("<img />")
                    .attr("src", basePath + "preview.jsp?url=" + encodeURIComponent(url)).attr("style","width:80px; height:80px;cursor:pointer;").on("click",function(){
                    if(suffix==="docx" || suffix==="doc" || suffix==="xlsx" || suffix==="xls" || suffix==="pdf"){
                        if (!EIIS.browser.phone){
                            processData({
                                type : "preView",
                                real_Path : url,
                                source : "reportForms",
                                quarry : "attachment",
                                mainId : "",
                                mainName : ""
                            });
                        }
                    }else if(suffix==="jpg" || suffix==="gif" || suffix==="png" || suffix==="bmp" || suffix==="jpeg"){
                        if (!EIIS.browser.phone){
                            showImg($(this));
                        }
                    }
                })
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
        _setStatus: function (id, status) {

            var self = this;
            var jqFile = self._jqFileBody.children("#" + id);
            var name = jqFile.attr("data-name");
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
                    $("<button class=\"btn btn-warning\" title=\"撤销删除\"><i class=\"glyphicon glyphicon-trash\"></i><span class=\"hidden-xs\"> 撤销删除</span></button>")
                        .on("click", function () {
                            var re = self.isAllowed(name);
                            if ($.type(re) === "string") {
                                $.message(re);
                                return;
                            }
                            self._setStatus(id, $.fn.document.status.VALID);
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
                if (self.option.canDownload) {
                    //pc登陆 或者 文件不是文档的 才有下载 txy 2016-3-3 18:07:18
                    var filePath = jqFile.attr("data-path");
                    var fileType = filePath.substr(filePath.lastIndexOf(".")+1).toLocaleLowerCase();
                    if(!EIIS.browser.phone || "xlsx,xls,doc,docx,ppt,pptx,pdf,txt,jpg,jpeg,png,gif,bmp".indexOf(fileType) < 0){
                        jqButton.append(
                            $("<a class=\"btn btn-info\" target=\"_blank\" role=\"button\" title=\"下载\"><i class=\"glyphicon glyphicon-download\"></i><span class=\"hidden-xs\"> 下载</span></a>")
                                .attr("href", "/file/download" + jqFile.attr("data-path")))
                            .append(" ");
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
                if (self.option.canRead) {
                    var ext = $.fn.document.getExtension(name).toLowerCase();
                    if (self._readPluginMap.containsKey(ext)) {

                        var readMenu = new Array();
                        var plugins = self._readPluginMap.get(ext)
                        for (var i = 0, j = plugins.length; i < j; i++) {
                            var plugin = plugins[i];
                            readMenu.push(transformToReadyPlugin(plugin, self._jqElement, "read", {
                                name: name
                            }, [jqFile.attr("data-path")]));
                        }

                        createButtons("阅读", "glyphicon glyphicon-list-alt", "btn-success", readMenu, jqButton);
                    }
                }
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
                                self._update(id, result.uri, result.size);
                                self._setStatus(id, $.fn.document.status.VALID);
                            }));
                        }

                        createButtons("编辑", "glyphicon glyphicon-edit", "btn-success", editMenu, jqButton);
                    }
                }
                if (self.option.canCancel) {
                    jqButton.append(
                        $("<button class=\"btn btn-warning\" title=\"删除\"><i class=\"glyphicon glyphicon-trash\"></i><span class=\"hidden-xs\"> 删除</span></button>")
                            .on("click", function () {
                                self._setStatus(id, $.fn.document.status.CANCEL);
                            })
                    ).append(" ");
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
        allowedExtensions: null
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
    $.fn.document.addSupportComponent({
        js: ["/public/controls/preview/filePrint.js"]
    });
    if(window.obj===undefined){
        obj={};
        window.closediv=function(){
            $("body").attr("style","");
            $("#imageShow").hide();
        };
    }

    if($("#imageShow").length===0){
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
    function showImg(ele){
        var eleSrc=ele.attr("src");
        var imgArr=[],self,src,activeIndex=0;
        $.each(ele.parents("tbody").find(".document-preview"),function(i){
            self=$(this).find("img");
            src=self.attr("src");
            var tem=src.split(".");
            var suffix=tem[tem.length-1];
            if(suffix===undefined){
                suffix="";
            }
            suffix=suffix.toLocaleLowerCase();
            if(suffix==="jpg" || suffix==="gif" || suffix==="png" || suffix==="bmp" || suffix==="jpeg"){
                if(src===eleSrc){
                    activeIndex=i;
                }
                imgArr.push(src);
            }
        });
        $.gallery({
            activeIndex : activeIndex,
            urls : imgArr
        });
    }
})(jQuery);