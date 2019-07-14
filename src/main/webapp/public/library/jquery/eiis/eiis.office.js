(function ($, undefined) {
    (function (undefined) {
        var _version = "2.1.1.3";
        var _support = null;
        var _install = null;
        var _helperAX = null;
        var _cookie = null;
        var _browserType = null;
        $.office = {
            getCookie: function () {
                if (_cookie == null) {
                    $.ajax({
                        type: "OPTIONS",
                        url: "/file/webdav/cookie",
                        dataType: "text",
                        async: false,
                        success: function (data) {
                            _cookie = data;
                        }
                    });
                    //alert(_cookie);
                }
                return _cookie;
            },
            WdRevisionsView: {
                wdRevisionsViewFinal: 0,//最终状态
                wdRevisionsViewOriginal: 1//原始状态
            },
            WdProtectionType: {
                wdAllowOnlyComments: 1,
                wdAllowOnlyFormFields: 2,
                wdAllowOnlyReading: 3,
                wdAllowOnlyRevisions: 0,
                wdNoProtection: -1
            },
            BrowserType: {
                IE: 1,
                historyIE: 3,
                NonIE: 2
            },
            getBrowserType: function () {
                if (_browserType == null) {
                    var _ie = false;
                    try {
                        if (window.ActiveXObject) {
                            _ie = true;
                        } else {
                            //支持 IE11 的判断
                            if (window.ActiveXObject == undefined && $.type(window.ActiveXObject.prototype) === "object") {
                                _ie = true;
                            }
                        }
                    } catch (e) {
                    }
                    if (_ie === true) {
                        if ($.type(window.XMLHttpRequest) === "function") {
                            _browserType = $.office.BrowserType.IE;
                        } else {
                            _browserType = $.office.BrowserType.historyIE;
                        }
                    } else {
                        _browserType = $.office.BrowserType.NonIE;
                    }
                }
                return _browserType;
            },
            isSupport: function () {
                if (_support == null) {
                    _support = false;
                    if ($.office.getBrowserType() === $.office.BrowserType.IE
                        || $.office.getBrowserType() === $.office.BrowserType.historyIE) {
                        _support = true;
                    } else if ($.office.getBrowserType() === $.office.BrowserType.NonIE) {
                        var mimetype = navigator.mimeTypes["application/x-itst-activex"];
                        if (mimetype) {
                            var plugin = mimetype.enabledPlugin;
                            if (plugin) {
                                _support = true;
                            }
                        } else {
                            //没有安装 ff-activex-host.
                        }
                    }
                }
                return _support;
            },
            isInstall: function () {
                if (_install == null) {
                    _install = false;
                    if ($.office.isSupport() === true) {
                        try {
                            if ($.type($.office._getHelper().Version) != "string") {
                                throw "DSOFramer.Helper 控件没有正常安装.";
                            }
                            var DSOFramerElement = $.office.createDSOFramerElement();
                            DSOFramerElement.setAttribute("height", "1px");
                            DSOFramerElement.setAttribute("width", "1px");
                            $("body").append(DSOFramerElement);
                            var tmpCV = DSOFramerElement.Version.split(".");
                            var tmpRV = $.office.getVersion().split(".");
                            for (var i = 0, j = tmpRV.length; i < j; i++) {
                                if (parseInt(tmpCV[i]) < parseInt(tmpRV[i])) {
                                    throw "版本不支持。";
                                }
                            }
                            $(DSOFramerElement).remove();
                            _install = true;
                        } catch (e) {
                        }
                    }
                }
                return _install;
            },
            createActiveXElement: function (clsid, codebase) {
                if (!$.office.isSupport()) return null;
                var AXElement = document.createElement("object");
                if ($.office.getBrowserType() === $.office.BrowserType.NonIE) {
                    AXElement.setAttribute("clsid", "{" + clsid + "}");
                    AXElement.setAttribute("type", "application/x-itst-activex");
                } else {
                    AXElement.setAttribute("classid", "clsid:" + clsid);
                }
                /*if ($.type(codebase) === "string") {
                 AXElement.setAttribute("codebase", codebase);
                 }*/
                return AXElement;
            },
            createDSOFramerElement: function () {
                return $.office.createActiveXElement("00460182-9E5E-11D5-B7C8-B8269041DD58", "/public/activex/dsoframer.ocx#version=" + $.office.getVersion().replace(/\./g, ","));
            },
            _getHelper: function () {
                if (_helperAX == null) {
                    //_helperAX = new ActiveXObject("DSOFramer.Helper");
                    _helperAX = $.office.createActiveXElement("9CD6683B-C4D2-46AF-B797-6A63F7392BB6");
                    _helperAX.setAttribute("height", "0px");
                    _helperAX.setAttribute("width", "0px");
                    $("body").append(_helperAX);
                }
                return _helperAX;
            },
            getHelper: function () {
                if ($.office.isInstall() == true) {
                    return $.office._getHelper();
                }
                return null;
            },
            getVersion: function () {
                return _version;
            },
            install: function () {
                window.open("/public/activex/install.html");
                //window.open("/public/activex/eiis.exe");
            },
            bindEvent: function (el, type, fn) {
                if (el.attachEvent) {
                    el.attachEvent(type, fn);
                } else if (el.addEventListener) {
                    if (type.startsWith("on")) {
                        type = type.substr(2);
                    }
                    el.addEventListener(type, fn, false);
                }
            },
            unbindEvent: function (el, type, fn) {
                if (el.detachEvent) {
                    el.detachEvent(type, fn);
                } else if (el.removeEventListener) {
                    if (type.startsWith("on")) {
                        type = type.substr(2);
                    }
                    el.removeEventListener(type, fn, false);
                }
            },
            objectEvents: {},
            bindObjectEvent: function (obj, type, fn) {
                var id = obj.id;
                if ($.office.objectEvents[id] == undefined) {
                    $.office.objectEvents[id] = {};
                }
                $.office.objectEvents[id][type] = fn;
                if ($.office.getBrowserType() === $.office.BrowserType.IE) {
                    var newScript = document.createElement("SCRIPT");
                    newScript.setAttribute("type", "text/javascript");
                    newScript.setAttribute("FOR", id);
                    newScript.setAttribute("event", type);
                    //newScript.text = "alert(\"" + type + "==\" + $.office.objectEvents[\"" + id + "\"][\"" + type + "\"]);$.office.objectEvents[\"" + id + "\"][\"" + type + "\"].apply(this, arguments);";
                    newScript.innerHTML = "$.office.objectEvents[\"" + id + "\"][\"" + type + "\"].apply(this, arguments);";
                    document.getElementsByTagName("HEAD").item(0).appendChild(newScript);
                } else if ($.office.getBrowserType() === $.office.BrowserType.historyIE) {
                    obj.attachEvent(type, $.office.objectEvents[id][type]);
                } else if ($.office.getBrowserType() === $.office.BrowserType.NonIE) {
                    var fuName = id + "___" + type;
                    window[fuName] = $.office.objectEvents[id][type];
                    obj.setAttribute("event_" + type, fuName);
                }
            },
            unbindObjectEvent: function (obj, type) {
                var id = obj.id;
                if ($.office.getBrowserType() === $.office.BrowserType.IE) {
                    for (var newScript in document.getElementsByTagName("SCRIPT")) {
                        if (newScript.getAttribute("for") == id
                            && newScript.getAttribute("event") == type) {
                            newScript.parentElement().removeChild(newScript);
                        }
                    }
                } else if ($.office.getBrowserType() === $.office.BrowserType.historyIE) {
                    obj.detachEvent(type, $.office.objectEvents[id][type]);
                } else if ($.office.getBrowserType() === $.office.BrowserType.NonIE) {
                    var fuName = id + "___" + type;
                    window[fuName] = undefined;
                }
                $.office.objectEvents[id][type] = undefined;
            },
            getRandomString: function (length) {
                if (length < 1) length = 4;
                var rnd = "";
                for (var i = 0; i < length; i++)
                    rnd += Math.floor(Math.random() * 10);
                return rnd;
            },
            getFileName: function (file) {
                return file.replace(/.*(\/|\\)/, "");
            },
            getExtension: function (file) {
                if (/[.]/.exec(file)) {
                    var tmpE = /[^.]+$/.exec(file.toLowerCase());
                    if (tmpE.length > 0) {
                        return tmpE[tmpE.length - 1];
                    }
                }
                return '';
            },
            getFile: function (url) {
                var tmpFolder = $.office.getHelper().CreateTempFolder();
                var tmpFile = tmpFolder + "\\" + $.office.getFileName(url);
                if ($.office.getHelper().GetFile(encodeURI(url), tmpFile, $.office.getCookie()) == 200) {
                    return tmpFile;
                } else {
                    return false;
                }
            },
            getOfficeInfo: function (document) {
                if (!document) return null;
                return {
                    UserAddress: document.Application.UserAddress,
                    UserInitials: document.Application.UserInitials,
                    UserName: document.Application.UserName,
                    ProtectionType: document.ProtectionType
                };
            },
            setOfficeInfo: function (document, value) {
                if (!document) return;
                if (document.Application.UserAddress) document.Application.UserAddress = value.UserAddress;
                if (document.Application.UserInitials) document.Application.UserInitials = value.UserInitials;
                document.Application.UserName = value.UserName;
            },
            showRevisions: function (document, value) {
                if (!document) return;
                if (document.ProtectionType == $.office.WdProtectionType.wdAllowOnlyFormFields) return;
                document.ShowRevisions = value;
                document.ActiveWindow.View.ShowRevisionsAndComments = value;
                document.ActiveWindow.View.RevisionsView = $.office.WdRevisionsView.wdRevisionsViewFinal;
            },
            setRevisions: function (document, value) {
                if (!document) return;
                if (document.ProtectionType == $.office.WdProtectionType.wdAllowOnlyFormFields) return;
                document.TrackRevisions = value;
                document.ActiveWindow.View.ShowRevisionsAndComments = value;
                document.ActiveWindow.View.RevisionsView = $.office.WdRevisionsView.wdRevisionsViewFinal;
            },
            setProtectionType: function (document, value, pwd) {
                if (!document) return;
                if (document.ProtectionType != $.office.WdProtectionType.wdNoProtection) {//文档本身有保护，解除保护
                    try {
                        //document.UnProtect();
                        document.UnProtect(pwd);
                    } catch (e) {
                    }
                }

                if (value != $.office.WdProtectionType.wdNoProtection) {//加文档保护
                    document.Protect(value, null, pwd);
                }
            }
        }
    })();

    $.widget("eiis.office", {
        options: {
            hide: false,
            extName: 'doc'
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key == 'hide') {
                if (value) {
                    this.element.hide();
                } else {
                    this.element.show();
                }
            }
        },
        _create: function () {
            //throw "error!";
            if ($.office.isSupport() === false) {
                alert("对不起，您现在使用的浏览器不支持 AvtiveX 控件！");
                //return null;
                return $.error("对不起，您现在使用的浏览器不支持 AvtiveX 控件！");
            }
            if ($.office.isInstall() === false) {
                if (confirm("对不起，您的电脑没有安装 EIIS 客户端控件或控件的版本太低。\r\n需要安装或升级控件。\r\n\r\n点击 [确定] 安装或升级控件\r\n点击 [取消] 不使用该功能。")) {
                    $.office.install();
                }
                //return null;
                return $.error("没有安装 EIIS 客户端控件或控件的版本太低!");
            }

            if ($.isFunction(this.options.afterOpened)) $(this.element).on("afterOpened", this.options.afterOpened);
            if ($.isFunction(this.options.beforeClosed)) $(this.element).on("beforeClosed", this.options.beforeClosed);
            this._Application = null;
            //this._SaveFormat = EIIS.WebUI.Office.WdSaveFormat.wdFormatDocument;
            //this._ViewType = EIIS.WebUI.Office.WdViewType.wdPrintView;
            this._opened = {};
            this._currentUrl = String.Empty;
            this._tempFiles = [];
            this._ProtectPassword = (new Date()).valueOf().toString();
            this._IsActiveDocument = false;

            var obj = $("object[data-for='" + this.element.attr("data-for") + "']");
            if (obj.length > 0) {
                this._Application = obj[0];
            } else {
                this._Application = $.office.createDSOFramerElement();
            }

            if (String.isNullOrWhiteSpace(this._Application.getAttribute("id"))) {
                this._Application.setAttribute("id", "DSOffice" + $.office.getRandomString(8));
            }
            $(this._Application).attr("data-for", this.element.attr("data-for"));

            this._Application.setAttribute("height", "100%");
            this._Application.setAttribute("width", "100%");

            if ($.office.getBrowserType() === $.office.BrowserType.historyIE) {
                if (obj.length == 0) {
                    this.element.append(this._Application);
                }
            }

            this._OnDocumentOpenedHandler = Function.createDelegate(this, this._OnDocumentOpened);
            $.office.bindObjectEvent(this._Application, "OnDocumentOpened", this._OnDocumentOpenedHandler);

            this._OnBeforeDocumentClosedHandler = Function.createDelegate(this, this._OnBeforeDocumentClosed);
            $.office.bindObjectEvent(this._Application, "BeforeDocumentClosed", this._OnBeforeDocumentClosedHandler);

            this._onCustomButtonEventHandler = Function.createDelegate(this, this._onCustomButtonEvent);
            $.office.bindObjectEvent(this._Application, "OnCustomButtonEvent", this._onCustomButtonEventHandler);

            if ($.office.getBrowserType() != $.office.BrowserType.historyIE) {
                if (obj.length == 0) {
                    this.element[0].appendChild(this._Application);
                }
            }

            this._Application.BorderStyle = "1";
            this._Application.TitlebarColor = "52479";
            this._Application.TitlebarTextColor = "0";
            this._Application.Menubar = true;
            this._Application.Titlebar = false;
            this._Application.Caption = "重庆网腾软件有限公司";
            this._Application.ActivationPolicy = 1; //解决花屏问题

            this._Application.EnableButton("New", false);//新建
            this._Application.EnableButton("Open", false);//打开
            this._Application.EnableButton("Close", false);//关闭
            this._Application.EnableButton("Save", true); //保存
            this._Application.EnableButton("SaveAs", false);//另存为
            this._Application.EnableButton("PageSetup", true); //页面设置
            this._Application.EnableButton("Print", true); //打印
            this._Application.EnableButton("Properties", false);//属性
            this._Application.EnableButton("PrintPreview", true); //打印预览
            this._Application.EnableButton("FullScreen", true); //全屏

            this._Application.ButtonIconSize = "32";
            this._Application.ButtonFontSize = "16";

            $(window).on("unload", Function.createDelegate(this, function () {
                if (this.element) {
                    this.element.remove();
                }
            }));
            var _h = this.element.height();
            this.element.height(_h - 10);
            setTimeout(Function.createDelegate(this, function () {
                if ($.type(this.element) === "null"
                    || $.type(this.element) === "undefined") return;
                this.element.height(_h);
                this._Application.removeAttribute("height");
                this._Application.removeAttribute("width");
                $(this._Application).width(this.element.width())
                    .height(this.element.height());
            }), 0);

            //this._Application.Open("e:\\a.doc");
        },
        _OnDocumentOpened: function () {
            //the._Application.Activate();
            //alert(this._Application.ModalState);
            this._IsActiveDocument = true;
            $(this.element).trigger("afterOpened", [this]);
        },
        _OnBeforeDocumentClosed: function () {
            $(this.element).trigger("beforeClosed", [this]);
            this._IsActiveDocument = false;
        },
        _onCustomButtonEvent: function (btnID) {
            $(this.element).trigger("button." + btnID + ".click", [btnID, this]);
        },
        show: function () {
            this._setOption("hide", false);
        },
        hide: function () {
            this._setOption("hide", true);
        },
        getActiveDocument: function () {
            if (this._IsActiveDocument) {
                return this._Application.ActiveDocument;
            } else {
                return null;
            }
        },
        getHeight: function () {
            return this.element.height();
        },
        setHeight: function (value) {
            this.element.height(value);
            $(this._Application).height(this.element.height());
        },
        getWidth: function () {
            return this.element.width();
        },
        setWidth: function (value) {
            this.element.width(value);
            $(this._Application).width(this.element.width());
        },
        getBorderStyle: function () {
            return this._Application.BorderStyle;
        },
        setBorderStyle: function (value) {
            this._Application.BorderStyle = value;
        },
        getTitlebarColor: function () {
            return this._Application.TitlebarColor;
        },
        setTitlebarColor: function (value) {
            this._Application.TitlebarColor = value;
        },
        getTitlebarTextColor: function () {
            return this._Application.TitlebarTextColor;
        },
        setTitlebarTextColor: function (value) {
            this._Application.TitlebarTextColor = value;
        },
        getMenubar: function () {
            return this._Application.Menubar;
        },
        setMenubar: function (value) {
            this._Application.Menubar = value;
        },
        getTitlebar: function () {
            return this._Application.Titlebar;
        },
        setTitlebar: function (value) {
            this._Application.Titlebar = value;
        },
        getCaption: function () {
            return this._Application.Caption;
        },
        setCaption: function (value) {
            this._Application.Caption = value;
        },
        getDocumentFullName: function () {
            return this._Application.DocumentFullName;
        },
        getDocumentName: function () {
            return this._Application.DocumentName;
        },
        addButton: function (name, btnID, callBack, icon) {
            this._Application.AddCustomButton(name, btnID, icon);
            $(this.element).on("button." + btnID + ".click", callBack);
        },
        buttonEnable: function (btnCode, value) {
            /*
             Code清单
             New		   0
             Open	       1
             Close	       2
             Save	       3
             SaveAs	       4
             Print	       5
             PageSetup	   6
             Properties	   7
             PrintPreview  8
             FullScreen    9
             自定义按钮ID
             */
            this._Application.EnableButton(btnCode, value);
        },
        close: function () {
            if (this._IsActiveDocument) {
                this._Application.Close();
            }
        },
        bindingForm: function (form, name) {
            if (typeof (form) == "string") {
                form = $(form)[0];
            }
            try {
                if (form.tagName != "FORM") {
                    form = null;
                }
            } catch (e) {
                form = null;
            }
            if (form == null) {
                return false;
            }
            if (typeof (name) == "string") {
                if ($(name).length == 0) {
                    var tmpName = document.createElement("input");
                    tmpName.type = "hidden";
                    tmpName.name = name;
                    name = tmpName;
                    form.appendChild(name);
                } else {
                    name = $(name)[0];
                }
            }
            try {
                if (name.tagName != "INPUT" && name.tagName != "TEXTAREA") {
                    name = null;
                }
                if (name.form != form) {
                    name = null;
                }
                if (name.name == undefined || name.name == null || name.name == "") {
                    name = null;
                }
            } catch (e) {
                name = null;
            }
            if (name == null) {
                return false;
            }
            var submitOffice = {
                thisClass: this,
                input: name,
                submit: function (e) {
                    submitOffice.input.value = submitOffice.thisClass.save()
                    if (submitOffice.input.value == false) {
                        e.preventDefault();
                    }
                }
            };
            var submit_id = 'eiis_office_' + (new Date()).valueOf().toString() + '_submit';
            form[submit_id] = form.submit;
            form.submit = function () {
                submitOffice.submit();
                this[submit_id]();
            };
            $(form).on("submit", Function.createDelegate(submitOffice, submitOffice.submit));
        },
        getOffice: function () {
            return this;
        },
        getDso: function () {
            return this._Application;
        },
        getCurrentFileInfo: function () {
            return this._opened[this._currentUrl];
        },
        save: function () {
            this._Application.Save();
            var tmpFullName = this.getDocumentFullName();
            //var tmpName = tmpFullName.substr(tmpFullName.lastIndexOf("\\") + 1);
            var path = location.protocol + "//" + location.host + this._opened[this._currentUrl].webDavUri;
            if ($.office.getHelper().PutFile(encodeURI(path), tmpFullName, $.office.getCookie()) == 200) {
                return this._opened[this._currentUrl].uri;
            } else {
                alert("保存文件到服务器发生错误，请将文档保存到本地稍后再试！");
                this._Application.ShowDialog(3);
                return false;
            }
        },
        open: function (url) {
            if (String.isNullOrEmpty(url)) {
                return false;
            } else {
                this.options.extName = $.office.getExtension(url);
            }
            var the = this;
            this.close();
            if (this._opened[url] == undefined) {
                $.ajax({
                    type: "PROPFIND",
                    url: encodeURI("/file/webdav" + url),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.length > 0) {
                            the._opened[url] = data[0];//.webDavUri;
                            the._currentUrl = url;//data[0].uri;
                        }
                    }
                });
            }
            if (the._opened[url] == undefined) {
                alert("打开失败！");
                the._opened = {};
                the._currentUrl = String.Empty;
                return false;
            }
            var path = location.protocol + "//" + location.host + the._opened[url].webDavUri;
            var fileName = path.substr(path.lastIndexOf("/") + 1);
            var tmpFolder = $.office.getHelper().CreateTempFolder();

            var tmpFile = tmpFolder + "\\" + fileName;
            the._tempFiles.push(tmpFile);

            if ($.office.getHelper().GetFile(encodeURI(path), tmpFile, $.office.getCookie()) == 200) {
                //this._Application.Open(encodeURI(path));
                the._Application.Open(tmpFile);
                return this._opened[this._currentUrl].uri;
            } else {
                the._opened = {};
                the._currentUrl = String.Empty;
                return false;
            }

        },
        create: function (extName) {
            //1 = 2;
            var $this = this;
            if (String.isNullOrEmpty(extName)) {
                extName = this.options.extName;
            } else {
                this.options.extName = extName;
            }
            this.close();
            var reValue = false;
            $.ajax({
                type: "PROPFIND",
                url: '/file/webdav/create/newfile.' + extName,
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.length > 0) {
                        var progId = $.office.getHelper().GetProgIDByExtension(extName);
                        if (String.isNullOrEmpty(progId)) {
                            alert("不支持该文件格式，或者对应的打开程序没有正确安装。");
                            return false;
                        }
                        $this._Application.CreateNew(progId);
                        var tmpFolder = $.office.getHelper().CreateTempFolder();
                        var tmpPath = tmpFolder + "\\newfile." + extName;
                        $this._tempFiles.push(tmpPath);
                        $this._Application.Save(tmpPath, true);
                        $this._opened[data[0].uri] = data[0];//.webDavUri;
                        $this._currentUrl = data[0].uri;
                        reValue = data[0].uri;
                    }
                }
            });
            return reValue;
        },
        _destroy: function () {
            //window.detachEvent("onbeforeunload", this._OnBeforeunLoadHandler);
//            $(window).off("unload", this._OnBeforeunLoadHandler);
            this.close();
            //this._Application.detachEvent("ondocumentopened", this._OnDocumentOpenedHandler);
            $.office.unbindObjectEvent(this._Application, "OnDocumentOpened");
            //this._Application.detachEvent("onbeforedocumentclosed", this._OnBeforeDocumentClosedHandler);
            $.office.unbindObjectEvent(this._Application, "BeforeDocumentClosed");
            $.office.unbindObjectEvent(this._Application, "OnCustomButtonEvent");

            for (var i = 0; i < this._tempFiles.length; i++) {
                try {
                    $.office.getHelper().DeleteFile(this._tempFiles[i]);
                } catch (e) {
                }
            }
            this._tempFiles = [];
            this.element = null;
            this._tempFiles = null;
            this._OnDocumentOpenedHandler = null;
            this._OnBeforeDocumentClosedHandler = null;
            this._onCustomButtonEventHandler = null;
            this._Application = null;
        }
    });

    $.widget('eiis.officeExt', $.eiis.office, {
        options: {
            userName: '',
            extName: 'doc',
            revisions: true,
            readOnly: false
        },
        _officeInfo: null,
        isWord: function () {
            var wordExt = ["doc", "docx"];
            if (wordExt.contains(this.options.extName.toLowerCase())) {
                return true;
            }
            return false;
        },
        _OnDocumentOpened: function () {
            this._IsActiveDocument = true;
            this.buttonEnable("save", false);
            var doc = this.getActiveDocument();
            if (!String.isNullOrEmpty(this.options.userName)) {
                this._officeInfo = $.office.getOfficeInfo(doc);
                var _info = $.extend({}, this._officeInfo);
                _info.UserName = this.options.userName;
                $.office.setOfficeInfo(doc, _info);
            }
            if (this.isWord()) {
                $.office.showRevisions(doc, false);
                if (this.options.readOnly) {
                    /*
                     New		   0
                     Open	       1
                     Close	       2
                     Save	       3
                     SaveAs	       4
                     Print	       5
                     PageSetup	   6
                     Properties	   7
                     PrintPreview  8
                     FullScreen    9
                     */
                    this.buttonEnable("New", false);
                    this.buttonEnable("Open", false);
                    this.buttonEnable("Close", false);
                    this.buttonEnable("Save", false);
                    this.buttonEnable("SaveAs", false);
                    this.buttonEnable("Print", false);
                    this.buttonEnable("PageSetup", false);
                    this.buttonEnable("PrintPreview", false);
                    this.buttonEnable("Properties", false);
                    $.office.setProtectionType(doc, $.office.WdProtectionType.wdAllowOnlyFormFields, this._ProtectPassword);
                } else {
                    if (this.options.revisions) {
                        $.office.setProtectionType(doc, $.office.WdProtectionType.wdAllowOnlyRevisions, this._ProtectPassword);
                    }
                }
            }
            this.element.trigger("afterOpened", [this]);
            this._super();
        },
        _OnBeforeDocumentClosed: function () {
            if (this.isWord()) {
                $.office.setProtectionType(this.getActiveDocument(), $.office.WdProtectionType.wdNoProtection, this._ProtectPassword);
//                if(this.options.readOnly){
//                    $.office.setProtectionType(this.getActiveDocument(),$.office.WdProtectionType.wdNoProtection,this._ProtectPassword);
//                }else{
//                    if(this.options.revisions){
//                        $.office.setProtectionType(this.getActiveDocument(),$.office.WdProtectionType.wdNoProtection,this._ProtectPassword);
//                    }
//                }
            }
            if (!String.isNullOrEmpty(this.options.userName)) {
                $.office.setOfficeInfo(this.getActiveDocument(), this._officeInfo);
            }
            this._super();
        },
        _saveForWord: function () {
            var currentType = this.getActiveDocument().ProtectionType;
            $.office.setProtectionType(this.getActiveDocument(), $.office.WdProtectionType.wdNoProtection, this._ProtectPassword);
//            if(this.options.revisions){
//                $.office.setProtectionType(this.getActiveDocument(),$.office.WdProtectionType.wdNoProtection,this._ProtectPassword);
//            }
            this._Application.Save();

            var tmpFullName = this.getDocumentFullName();
            //var tmpName = tmpFullName.substr(tmpFullName.lastIndexOf("\\") + 1);
            var path = location.protocol + "//" + location.host + this._opened[this._currentUrl].webDavUri;
            if ($.office.getHelper().PutFile(encodeURI(path), tmpFullName, $.office.getCookie()) == 200) {
//                if(this.options.revisions){
//                }
                $.office.setProtectionType(this.getActiveDocument(), currentType, this._ProtectPassword);
                $.office.showRevisions(this.getActiveDocument(), false);
                return this._opened[this._currentUrl].uri;
            } else {
                alert("保存文件到服务器发生错误，请将文档保存到本地稍后再试！");
                this._Application.ShowDialog(3);
                return false;
            }
        },
        save: function () {
            if (this.isWord()) {
                return this._saveForWord();
            }
            return this._super();
        }
    });

    var orgOffice = $.fn.office;
    $.fn.office = function () {
        var officeDiv = this[0]["data-office-div"];
        if (officeDiv == undefined) {
            return orgOffice.apply(this, arguments);
        }
        return officeDiv.office.apply(officeDiv, arguments);
    }
    var orgOfficeExt = $.fn.officeExt;
    $.fn.officeExt = function () {
        var officeDiv = this[0]["data-office-div"];
        if (officeDiv == undefined) {
            return orgOfficeExt.apply(this, arguments);
        }
        return officeDiv.officeExt.apply(officeDiv, arguments);
    }
})(jQuery);