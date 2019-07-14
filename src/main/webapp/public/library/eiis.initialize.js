var EIIS = {};

(function (undefined) {
    jQuery.ajaxErrorMessager = function (jqXHR) {
        var exceptionContent = "";
        if ($.type(jqXHR) === "string") {
            exceptionContent = $(jqXHR).find("#exceptionContent").text();
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqXHR;
            }
        } else if ($.type(jqXHR.responseText) === "string") {
            var jqResponseText = $("<div>" + jqXHR.responseText + "</div>");
            exceptionContent = jqResponseText.find("#exceptionContent").text();
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqResponseText.find("title").text();
            }
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqXHR.responseText;
            }
            jqResponseText.remove();
        }
        return exceptionContent;
    };

    // 修补一个 jquery 在 IE6 上有时会出现的 bug aaaa
    var _old_text = $.expr[":"]['text'];
    $.expr[":"]['text'] = function (elem) {
        try {
            return _old_text.apply(this, arguments);
        } catch (e) {
            return elem.nodeName.toLowerCase() === "input" && "text" === elem.type;
        }
    };

    $.hook = function (methods, fun, element) {
        if ($.isArray(methods)) {
            this._methods = methods;
        } else {
            this._methods = [methods.toString()];
        }
        if ($.isFunction(fun)) {
            if (arguments.length < 3) element = "*";
            if (element instanceof jQuery) {
                element = element[0];
            }
            this.handler = {
                fun: fun,
                element: element
            };
        } else {
            return null;
        }
        return this;
    };
    $.hook.methods = {};
    $.hook.prototype = {
        _methods: [],
        off: function () {
            var self = this;
            $.each(self._methods, function (i, n) {
                n = n.toString();
                if ($.hook.methods[n] != undefined) {
                    if ($.hook.methods[n].handlers.contains(self.handler)) {
                        $.hook.methods[n].handlers.remove(self.handler)
                    }
                    if ($.hook.methods[n].handlers.length == 0) {
                        $.fn[n] = $.hook.methods[n].oldFun;
                        $.hook.methods[n] = undefined;
                    }
                }
            });
            return self;
        }, on: function () {
            var self = this;
            self.off();
            $.each(self._methods, function (i, n) {
                n = n.toString();
                if (!$.fn[n]) return;
                if ($.hook.methods[n] == undefined) {
                    $.hook.methods[n] = new function () {
                        var thisMethod = this;
                        thisMethod.handlers = [];
                        thisMethod.oldFun = $.fn[n];
                        $.fn[n] = function () {
                            var target = this;
                            var r = thisMethod.oldFun.apply(target, arguments);
                            var _remove = [];
                            for (var i = 0, j = thisMethod.handlers.length; i < j; i++) {
                                if (thisMethod.handlers[i].element != "*") {
                                    if ($(document).find(thisMethod.handlers[i].element).length == 0) {
                                        _remove.push(thisMethod.handlers[i]);
                                        continue;
                                    }
                                    if (target[0] != thisMethod.handlers[i].element) {
                                        continue;
                                    }
                                }
                                if ($.isFunction(thisMethod.handlers[i].fun)) {
                                    thisMethod.handlers[i].fun.apply(target, arguments);
                                }
                            }
                            for (var i = 0, j = _remove.length; i < j; i++) {
                                thisMethod.handlers.remove(_remove[i]);
                            }
                            return r;
                        }
                        return thisMethod;
                    }
                }
                if (!$.hook.methods[n].handlers.contains(self.handler)) {
                    $.hook.methods[n].handlers.push(self.handler)
                }
            });
            return self;
        }
    };

    EIIS.Common = {};

    EIIS.Common.themePath = $.cookie('ThemePath');
    if (String.isNullOrWhiteSpace(EIIS.Common.themePath)) {
        EIIS.Common.themePath = "/theme/current";
    }

    EIIS.Common.loadJavaScriptComplete = new Object();
    EIIS.Common.loadJavaScript = function (url, onload) {

        var currentJS = EIIS.Common.loadJavaScriptComplete[url];

        if (currentJS) {
            if (typeof (onload) == 'function') {
                if (currentJS.loaded) {
                    onload.call(window);
                } else {
                    currentJS.onload.push(onload);
                }
            }
            return;
        }
        EIIS.Common.loadJavaScriptComplete[url] = {
            loaded: false,
            onload: []
        }

        currentJS = EIIS.Common.loadJavaScriptComplete[url];

        if (typeof (onload) == 'function') currentJS.onload.push(onload);

        if (document.body || currentJS.onload.length > 0) {

            var callback = function () {
                currentJS.loaded = true;
                for (var i = 0, l = currentJS.onload.length; i < l; i++) {
                    currentJS.onload[i].call(window);
                }
            };

            var script = document.createElement('script');
            script.src = url;
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);
            if (script.attachEvent) {
                script.attachEvent("onreadystatechange", function () {
                    if (script.readyState == 4
                        || script.readyState == 'complete'
                        || script.readyState == 'loaded') {
                        callback();
                    }
                });
            } else if (script.addEventListener) {
                script.addEventListener("load", callback, false);
            }

            return;

        }
        window.document.writeln('<scr' + 'ipt type="text/javascript" src="' + url + '"><\/scr' + 'ipt>');
        currentJS.loaded = true;

    };

    EIIS.Common.loadCssComplete = new Object();
    EIIS.Common.loadCss = function (url, onload) {

        var currentCSS = EIIS.Common.loadCssComplete[url];

        if (currentCSS) {
            if (typeof (onload) == 'function') {
                if (currentCSS.loaded) {
                    onload.call(window);
                } else {
                    currentCSS.onload.push(onload);
                }
            }
            return;
        }
        EIIS.Common.loadCssComplete[url] = {
            loaded: false,
            onload: []
        }

        currentCSS = EIIS.Common.loadCssComplete[url];

        if (typeof (onload) == 'function') currentCSS.onload.push(onload);

        var callback = function () {
            currentCSS.loaded = true;
            for (var i = 0, l = currentCSS.onload.length; i < l; i++) {
                currentCSS.onload[i].call(window);
            }
        };

        var link = document.createElement('link');
        link.href = url;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
        // if (link.addEventListener) {
        // link.addEventListener("load", callback, false);
        // } else if (link.attachEvent) {
        // link.attachEvent("onreadystatechange", function () {
        // if (link.readyState == 4
        // || link.readyState == 'complete'
        // || link.readyState == 'loaded') {
        // callback();
        // }
        // });
        // }

        callback();

    };

    EIIS.Common.WebUI = {
        loadSequence: true,
        dependency: ['EIIS.Common.jQuery.ui', 'EIIS.Common.jQuery.livequery'],
        css: [window.contextPath + '/public/library/webui/eiis.ui.css'],
        js: [window.contextPath + '/public/library/webui/eiis.webui.js'],

        Text: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.text'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.text.js']
        },
        Password: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.text'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.password.js']
        },
        Number: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.number'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.number.js']
        },
        Date: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.date'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.date.js']
        },
        Time: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.time'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.time.js']
        },
        DateTime: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.datetime'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.datetime.js']
        },
        Button: {
            loadSequence: true,
            //dependency: ['EIIS.Common.jQuery.button', 'EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.button.js']
        },
        ComboBox: {
            loadSequence: true,
            dependency: ['EIIS.Common.jQuery.combobox', 'EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.combobox.js']
        },
        Radio: {
            loadSequence: true,
            dependency: ['EIIS.Common.jQuery.radio', 'EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.radio.js']
        },
        CheckBox: {
            loadSequence: true,
            dependency: ['EIIS.Common.jQuery.checkbox', 'EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.checkbox.js']
        },
        Dictionary: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.dictionary'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.dictionary.js']
        },
        Member: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.member'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.member.js']
        },
        Textarea: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.textarea.js']
        },
        Html: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.html'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.html.js']
        },
        CustomText: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.customtext'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.customtext.js']
        },
        Tags: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.inputtags'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.tags.js']
        },
        Table: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.table.js']
        },
        Form: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.form.js']
        },
        File: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.inputtags', "EIIS.Common.jQuery.uploadfiles"],
            js: [window.contextPath + '/public/library/webui/eiis.webui.file.js']
        },
        Office: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.office'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.office.js']
        },
        OfficeExt: {
            loadSequence: true,
            dependency: ['EIIS.Common.WebUI', 'EIIS.Common.jQuery.office'],
            js: [window.contextPath + '/public/library/webui/eiis.webui.officeext.js']
        }
    };

    EIIS.Common.jQuery = {
        ui: {
            dependency: ['EIIS.Common.jQuery.bgiframe'],
            css: [ window.contextPath + '/public/library/jquery/ui/jquery.ui.css'
                , window.contextPath + '/public/library/jquery/ui/jquery.ui.extend.tabs.css'
                , window.contextPath + '/public/library/jquery/ui/timepicker/jquery-ui-timepicker-addon.css'
            ],
            js: [
                window.contextPath + '/public/library/jquery/ui/jquery.ui.js'
//              window.contextPath + '/public/library/jquery/ui/jquery-ui-1.9.2.custom.js'
                , window.contextPath + '/public/library/jquery/ui/jquery.ui.datepicker-zh-CN.js'
                , window.contextPath + '/public/library/jquery/ui/jquery.ui.extend.tabs.js'
                , window.contextPath + '/public/library/jquery/ui/jquery.ui.extend.dialog.js'
                , window.contextPath + '/public/library/jquery/ui/timepicker/jquery-ui-timepicker-addon.js'
                , window.contextPath + '/public/library/jquery/ui/timepicker/jquery-ui-timepicker-zh-CN.js'
            ]
        },
        transform: {
            js: [window.contextPath + '/public/library/jquery/jquery.transform.js']
        },
        json: {
            js: [window.contextPath + '/public/library/jquery/jquery.json.js']
        },
        warnLeavingUnsaved: {
            js: [window.contextPath + '/public/library/jquery/eiis/window.warn_leaving_unsaved.js']
        },
        codeeditor: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/controls/codeeditor/ace/ace.js', window.contextPath + '/public/library/jquery/eiis/eiis.codeeditor.js']
        },
        livequery: {
            js: [window.contextPath + '/public/library/jquery/jquery.livequery.js']
        },
        combobox: {
            dependency: ['EIIS.Common.jQuery.inputtags'],
            // css: [window.contextPath +
            // '/public/library/jquery/eiis/eiis.combobox.css'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.combobox.js']
        },
        jqGrid: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: [window.contextPath + '/public/library/jquery/jqgrid/ui.jqgrid.css'],
            js: [window.contextPath + '/public/library/jquery/jqgrid/grid.locale-cn.js', window.contextPath + '/public/library/jquery/jqgrid/jquery.jqgrid.js', window.contextPath + '/public/library/jquery/jqgrid/expand.js']
        },
        selector: {
            js: [window.contextPath + '/public/library/jquery/selector/jquery.selector.js'],
            icons: {
                dependency: ['EIIS.Common.jQuery.selector'],
                js: [window.contextPath + '/public/library/jquery/selector/icons/selector.icons.js']
            }
        },
        dictionary: {
            dependency: ['EIIS.Common.jQuery.inputtags', 'EIIS.Common.jQuery.selector'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.dictionary.js']
        },
        member: {
            dependency: ['EIIS.Common.jQuery.inputtags', 'EIIS.Common.jQuery.selector'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.member.js']
        },
        uploadfiles: {
            dependency: ['EIIS.Common.WebUI'],
            css: [window.contextPath + '/public/library/jquery/uploadfiles/jquery.uploadfiles.css'],
            js: [window.contextPath + '/public/library/jquery/uploadfiles/jquery.uploadfiles.js'],
            flash: {dependency: ['EIIS.Common.jQuery.uploadfiles'],
                js: [window.contextPath + '/public/library/jquery/uploadfiles/flash/swfupload.js'],
                swf: "/public/library/jquery/uploadfiles/flash/swfupload.swf"
            }
        },
        layout: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: [window.contextPath + '/public/library/jquery/layout/layout.css'],
            js: [window.contextPath + '/public/library/jquery/layout/jquery.layout.js', window.contextPath + '/public/library/jquery/layout/expand.js']
        },
        form: {
            js: [window.contextPath + '/public/library/jquery/jquery.form.js']
        },
        highlight: {
            js: [window.contextPath + '/public/library/jquery/jquery.highlight.js']
        },
        pagination: {
            css: [window.contextPath + '/public/library/jquery/pagination/pagination.css'],
            js: [window.contextPath + '/public/library/jquery/pagination/jquery.pagination.js']
        },
        bgiframe: {
            js: [window.contextPath + '/public/library/jquery/jquery.bgiframe.js']
        },
        cycle: {
            js: [window.contextPath + '/public/library/jquery/jquery.cycle.js']
        },
        message: {
            dependency: ['EIIS.Common.jQuery.ui'], js: [window.contextPath + '/public/library/jquery/message/jquery.message.js']
        },
        xmlext: {
            js: [window.contextPath + '/public/library/jquery/jquery.xmlext.js']
        },
        validate: {
            js: [window.contextPath + '/public/library/jquery/validate/jquery.validate.js', window.contextPath + '/public/library/jquery/validate/messages_zh.js', window.contextPath + '/public/library/jquery/validate/expand.js']
        },
        inputtags: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: [window.contextPath + '/public/library/jquery/inputtags/jquery.inputtags.css'],
            js: [window.contextPath + '/public/library/jquery/inputtags/jquery.inputtags.js']
        },
        html: {
            css: [window.contextPath + '/public/kindeditor/themes/eiis_kindeditor.css'],
            js: [
                window.contextPath + '/public/kindeditor/kindeditor-min.js'
                , window.contextPath + '/public/kindeditor/lang/zh_CN.js'
                , window.contextPath + '/public/library/jquery/eiis/eiis.html.js'
            ]
        },
        office: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.office.js']
        },
        dynatree: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: [window.contextPath + '/public/library/jquery/dynatree/skin/ui.dynatree.css'],
            js: [window.contextPath + '/public/library/jquery/dynatree/jquery.dynatree.js', window.contextPath + '/public/library/jquery/dynatree/expand.js']
        },
        text: {
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.text.js']
        },
        number: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.number.js']
        },
        date: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.date.js']
        },
        time: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.time.js']
        },
        datetime: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.datetime.js']
        },
        radio: {
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.radio.js']
        },
        checkbox: {
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.checkbox.js']
        },
        customtext: {
            dependency: ['EIIS.Common.jQuery.ui'],
            js: [window.contextPath + '/public/library/jquery/eiis/eiis.customtext.js']
        }
    };

    EIIS.Common.loadComponent = function (component, onload) {
        // component.Load(onload);

        var tmpComponent = component;
        if (typeof (tmpComponent) == 'string') {
            eval('tmpComponent = ' + component);
        }
        var dependency = [];
        var js = [];
        var css = [];

        if (tmpComponent['dependency']) dependency = tmpComponent['dependency'].slice(0);// Array.clone(tmpComponent['dependency']);
        if (tmpComponent['js']) js = tmpComponent['js'].slice(0);// Array.clone(tmpComponent['js']);
        if (tmpComponent['css']) css = tmpComponent['css'].slice(0);// Array.clone(tmpComponent['css']);

        if (Boolean.parse(tmpComponent['loadSequence']) || typeof (onload) == 'function') {

            var nextLoader = function () {

                if (dependency.length > 0) {
                    var tmp = dependency.shift();
                    EIIS.Common.loadComponent(tmp, nextLoader);
                } else if (css.length > 0) {
                    var tmp = css.shift();
                    EIIS.Common.loadCss(tmp, nextLoader);
                } else if (js.length > 0) {
                    var tmp = js.shift();
                    EIIS.Common.loadJavaScript(tmp, nextLoader);
                } else {
                    if (typeof (onload) == 'function') onload.call(window);
                }
            };

            nextLoader();

        } else {
            for (var i = 0, l = dependency.length; i < l; i++) {
                EIIS.Common.loadComponent(dependency[i]);
            }
            for (var i = 0, l = css.length; i < l; i++) {
                EIIS.Common.loadCss(css[i]);
            }
            for (var i = 0, l = js.length; i < l; i++) {
                EIIS.Common.loadJavaScript(js[i]);
            }
        }

    };

    EIIS.Common.loadCss(window.contextPath + '/public/library/base.css');

})();
