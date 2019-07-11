//$().ready(function () {
(function ($, undefined) {
    var datetimecomp = {}, datecomp = {}, timecomp = {};
    //if(EIIS.browser.pc){
        datetimecomp = {
            loadSequence: true,
            dependency: ['EIIS.Common.bootstrap.datetimepicker'],
            js: ['/public/eiis/ui/eiis.ui.datetime.js']
        };
        datecomp = {
            loadSequence: true,
            dependency: ['EIIS.Common.bootstrap.datetimepicker'],
            js: ['/public/eiis/ui/eiis.ui.date.js']
        };
        timecomp = {
            loadSequence: true,
            dependency: ['EIIS.Common.bootstrap.datetimepicker'],
            js: ['/public/eiis/ui/eiis.ui.time.js']
        };
    //}else{

    //}
    var controls = {
        text: {
            selector: ":text.eiis-text,:password.eiis-text,textarea.eiis-text",
            component: {
                js: ['/public/eiis/ui/eiis.ui.text.js']
            }
        },
        datetime: {
            selector: ":text.eiis-datetime",
            component: datetimecomp
        },
        date: {
            selector: ":text.eiis-date",
            component: datecomp
        },
        time: {
            selector: ":text.eiis-time",
            component: timecomp
        },
        checkbox: {
            selector: ":checkbox.eiis-checkbox",
            component: {
                js: ['/public/eiis/ui/eiis.ui.checkbox.js']
            }
        },
        radio: {
            selector: ":radio.eiis-radio",
            component: {
                js: ['/public/eiis/ui/eiis.ui.radio.js']
            }
        },
        button: {
            selector: ":button.eiis-button",
            component: {
                js: ['/public/eiis/ui/eiis.ui.button.js']
            }
        },
        member: {
            selector: ":text.eiis-member",
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.member"],
                js: ['/public/eiis/ui/eiis.ui.member.js']
            }
        },
        materialpickmember: {
            selector: ":text.eiis-pickMember",
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.materialPickMember"],
                js: ['/public/eiis/ui/eiis.ui.pickMember.js']
            }
        },
        docmember: {
            selector: ":text.eiis-docmember",
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.docmember"],
                js: ['/public/eiis/ui/eiis.ui.docmember.js']
            }
        },
        netdisk: {
            selector: ":text.eiis-netdisk",
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.netdisk"],
                js: ['/public/eiis/ui/eiis.ui.netdisk.js']
            }
        },
        appmember: {
            selector: ":text.eiis-appmember",
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.appmember"],
                js: ['/public/eiis/ui/eiis.ui.appmember.js']
            }
        },
        combobox: {
            selector: "select.eiis-combobox",
            component: {
                js: ['/public/eiis/ui/eiis.ui.combobox.js']
            }
        },
        file: {
            selector: 'input.eiis-file',
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.document.upload"],
                js: ['/public/eiis/ui/eiis.ui.file.js']
            }
        },
        document: {
            selector: 'input.eiis-document',
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.document.upload", "EIIS.Common.controls.document.plugins.all"],
                js: ['/public/eiis/ui/eiis.ui.document.js?v=1']
            }
        },
        document_new: {
            selector: 'input.eiis-document-new',
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.controls.document_new.upload", "EIIS.Common.controls.document_new.plugins.all"],
                js: ['/public/eiis/ui/eiis.ui.document_new.js?v=1']
            }
        },
        html: {
            selector: 'textarea.eiis-html',
            component: {
                loadSequence: true,
                dependency: ["EIIS.Common.jQuery.html"],
                js: ['/public/eiis/ui/eiis.ui.html.js']
            }
        }
    };

    var getValueElements = new HashMap();
    var setValueElements = new HashMap();
    var fnVal = $.fn.val;
    $.fn.val = function () {
        var $target = this;
        if (arguments.length > 0) {
            if (setValueElements.containsKey($target[0])) {
                var setValue = setValueElements.get($target[0]);
                if ($.isFunction(setValue)) {
                    if ($target.data("function-stack-setValue") !== true) {
                        $target.data("function-stack-setValue", true);
                        setValue(arguments[0]);
                        $target.removeData("function-stack-setValue");
                        return $target;
                    }
                    /*if (!hasFunctionStack(setValue)) {
                     setValue.apply($target[0], [$target, arguments[0]]);
                     return $target;
                     }*/
                }
            }
        } else {
            if (getValueElements.containsKey($target[0])) {
                var getValue = getValueElements.get($target[0]);
                if ($.isFunction(getValue)) {
                    if ($target.data("function-stack-getValue") !== true) {
                        $target.data("function-stack-getValue", true);
                        var result = getValue();
                        $target.removeData("function-stack-getValue");
                        return result;
                    }
                    /*if (!hasFunctionStack(getValue)) {
                     return getValue.apply($target[0], [$target]);
                     }*/
                }
            }
        }
        return fnVal.apply($target, arguments);
    };

    var isDisabledElements = new HashMap();
    var setDisabledElements = new HashMap();
    var fnProp = $.fn.prop;
    $.fn.prop = function () {
        var $target = this;
        if ("disabled".equals(arguments[0])) {
            if (arguments.length > 1) {
                if (setDisabledElements.containsKey($target[0])) {
                    var setDisabled = setDisabledElements.get($target[0]);
                    if ($.isFunction(setDisabled)) {
                        if ($target.data("function-stack-setDisabled") !== true) {
                            $target.data("function-stack-setDisabled", true);
                            setDisabled(Boolean.parse(arguments[1]));
                            $target.removeData("function-stack-setDisabled");
                            return $target;
                        }
                    }
                }
            } else {
                if (isDisabledElements.containsKey($target[0])) {
                    var isDisabled = isDisabledElements.get($target[0]);
                    if ($.isFunction(isDisabled)) {
                        if ($target.data("function-stack-isDisabled") !== true) {
                            $target.data("function-stack-isDisabled", true);
                            var result = Boolean.parse(isDisabled());
                            $target.removeData("function-stack-isDisabled");
                            return result;
                        }
                    }
                }
            }

        }
        return fnProp.apply($target, arguments);
    };

    var hideElements = new HashMap();
    var fnHide = $.fn.hide;
    $.fn.hide = function () {
        var $target = this;
        if (hideElements.containsKey($target[0])) {
            var hide = hideElements.get($target[0]);
            if ($.isFunction(hide)) {
                if ($target.data("function-stack-hide") !== true) {
                    $target.data("function-stack-hide", true);
                    hide();
                    $target.removeData("function-stack-hide");
                    return $target;
                }
            }
        }
        return fnHide.apply($target, arguments);
    };

    var showElements = new HashMap();
    var fnShow = $.fn.show;
    $.fn.show = function () {
        var $target = this;
        if (showElements.containsKey($target[0])) {
            var show = showElements.get($target[0]);
            if ($.isFunction(show)) {
                if ($target.data("function-stack-show") !== true) {
                    $target.data("function-stack-show", true);
                    show();
                    $target.removeData("function-stack-show");
                    return $target;
                }
            }
        }
        return fnShow.apply($target, arguments);
    };

    var $body = $("body");

    var instanceElements = new HashMap();

    var selectorMap = new HashMap();
    EIIS.UI = {
        addControl: function (control) {
            if (!$.isPlainObject(control)) {
                throw "不是一个对象.";
            }
            if ($.type(control.selector) != "string" || String.isNullOrWhiteSpace(control.selector)) {
                throw "selector 属性不存在或值为空.";
            }
            if (selectorMap.containsKey(control.selector)) {
                throw "已经存在对 " + control.selector + " 操作的控件.";
            }
            selectorMap.put(control.selector, {
                matchedFn: function () {

                    var self = new Object();
                    for (p in control) {
                        self[p] = control[p];
                    }
                    self.element = this;


                    var $this = $(this);

                    instanceElements.put($this[0], self);

                    $this.addClass("eiis-loading");
                    if ($.isFunction(self.create)) {
                        self.create();
                    }
                    if ($.isFunction(self.getValue)) {
                        getValueElements.put($this[0], Function.createDelegate(self, self.getValue));
                    }
                    if ($.isFunction(self.setValue)) {
                        setValueElements.put($this[0], Function.createDelegate(self, self.setValue));
                    }
                    if ($.isFunction(self.isDisabled)) {
                        isDisabledElements.put($this[0], Function.createDelegate(self, self.isDisabled));
                    }
                    if ($.isFunction(self.setDisabled)) {
                        setDisabledElements.put($this[0], Function.createDelegate(self, self.setDisabled));
                    }
                    if ($.isFunction(self.hide)) {
                        hideElements.put($this[0], Function.createDelegate(self, self.hide));
                    }
                    if ($.isFunction(self.show)) {
                        showElements.put($this[0], Function.createDelegate(self, self.show));
                    }
                    $this.addClass("eiis-loaded").removeClass("eiis-loading");

                    $this.triggerHandler("loaded.ui.eiis", [$this]);
                },
                unmatchedFn: function () {
                    var $this = $(this);
                    getValueElements.remove($this[0]);
                    setValueElements.remove($this[0]);
                    isDisabledElements.remove($this[0]);
                    setDisabledElements.remove($this[0]);
                    hideElements.remove($this[0]);
                    showElements.remove($this[0]);

                    var self = instanceElements.get($this[0]);
                    if ($.isFunction(self.destroy)) {
                        self.destroy();
                    }
                    instanceElements.remove($this[0]);
                }
            });

            $body.livequery(control.selector + ":not(eiis-loading):not(eiis-loaded)",
                selectorMap.get(control.selector).matchedFn,
                selectorMap.get(control.selector).unmatchedFn);

        },
        removeControl: function (selector) {
            if (selectorMap.containsKey(selector)) {
                $body.expire(selector + ":not(eiis-loading):not(eiis-loaded)",
                    selectorMap.get(selector).matchedFn,
                    selectorMap.get(selector).unmatchedFn);
                selectorMap.remove(selector);
            }
        },
        register: function (name, control) {
            if (String.isNullOrWhiteSpace(name)) {
                throw "注册的系统控件名称不能为空.";
            }
            name = name.toLowerCase();
            if (!$.isPlainObject(controls[name])) {
                throw "未找到 " + name + " 名称的系统控件.";
            }
            var newControl = $.extend(true, {}, control, controls[name]);
            EIIS.UI.removeControl(newControl.selector);
            EIIS.UI.addControl(newControl);
        }
    };

    for (var key in controls) {
        (function (control) {
            var matchedFn = function () {
                $body.expire(control.selector, matchedFn);
                EIIS.Common.loadComponent(control.component);
            };
            $body.livequery(control.selector, matchedFn);
        })(controls[key]);
    }

    $.fn.eiis = function () {
        var instance = instanceElements.get(this[0]);
        if (instance) {
            if ($.isFunction(instance.handler)) {
                var result = instance.handler.apply(instance, arguments);
                return result != undefined ? result : this;
            }
        }
        return this;
    };
    $.fn.widget = function () {
        var instance = instanceElements.get(this[0]);
        if (instance) {
            if ($.isFunction(instance.widget)) {
                return instance.widget.apply(instance, arguments);
            }
        }
    };
    if(!EIIS.browser.pc){
        jQuery.prototype.datetimepicker = function(){
            return this;
        }
    }
//});
})(jQuery);