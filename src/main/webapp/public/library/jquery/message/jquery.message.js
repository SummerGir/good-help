(function ($, undefined) {

    $.message = function (opt) {

        var option = opt;
        if ($.type(opt) === 'string') {
            option = {
                text: opt
            };
        }

        var defaultOption = $.extend(true, {}, $.message.option, {verify: null});

        option = $.extend(true, {}, defaultOption, option);

        var text = $('<div/>').text(option.text).html();

        text = text.replace(/ /g, "&nbsp;");
        text = text.replace(/\r\n/g, "<br />");
        text = text.replace(/\n/g, "<br />");
        text = text.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

        var dialog = $("<div />");

        var generateVerifyCode = function (length) {
            if (length < 1) length = 4;
            var rnd = "";
            for (var i = 0; i < length; i++)
                rnd += Math.floor(Math.random() * 10);
            return rnd;
        }

        if ($.isPlainObject(option.verify)) {
            if (!$.isEmptyObject(option.verify)) {
                if (option.verify.result >= $.message.result.ok &&
                    option.verify.result <= $.message.result.no) {
                    if ($.type(option.verify.code) != "string") {
                        if ($.type(option.verify.code) != "number") {
                            option.verify.code = 4;
                        }
                        option.verify.code = generateVerifyCode(option.verify.code);
                    }
                    option.verify.code = option.verify.code.trim();
                    if (!String.isNullOrWhiteSpace(option.verify.code)) {
                        text += $("<div />").append("<br />请在下边的输入框中输入“<span style=\"color:#ff0000\">" + option.verify.code + "</span>”这几位验证码。")
                            .append("<br />")
                            .append($("<input />").attr({
                                "type": "text"
                            }).addClass("webui message-verify")
                                .css({
                                    "width": (8 * option.verify.code.lengthb()) + "px"
                                })).html();
                    }
                }
            }
        }

        var fireClose = function (result) {

            var verifyElement = dialog.find(".message-verify");
            if (verifyElement.length > 0) {
                if (result == option.verify.result) {
                    if (!option.verify.code.equalsIgnoreCase(verifyElement.val().trim())) {
                        alert("验证码输入正确后才能点击此按钮！");
                        return;
                    }
                }
            }

            dialog.dialog("destroy");
            dialog.remove();

            if ($.isFunction(option.result)) {
                option.result(result);
            }
        }


        if ($.trim(option.icon) != "" && option.icon != $.message.icon.none) {
            var icon = $("<div />").addClass(option.icon);
            if (icon.hasClass("ui-state-error")) {
                icon.removeClass("ui-state-error");
                dialog.addClass("ui-state-error");
            }
            icon.css({
                'float': 'left'
            });
            dialog.append(icon);
            dialog.append($("<div />").css({
                'margin': '0 0 0 30px'
            }).html(text));
        } else {
            dialog.html(text);
        }

        var buttons = {};
        if (option.button == $.message.button.okCancel) {
            buttons = {
                "确定": function () {
                    fireClose($.message.result.ok);
                }, "取消": function () {
                    fireClose($.message.result.cancel);
                }
            };
        } else if (option.button == $.message.button.abortRetryIgnore) {
            buttons = {
                "中止": function () {
                    fireClose($.message.result.abort);
                }, "重试": function () {
                    fireClose($.message.result.retry);
                }, "忽略": function () {
                    fireClose($.message.result.ignore);
                }
            };
        } else if (option.button == $.message.button.yesNoCancel) {
            buttons = {
                "是": function () {
                    fireClose($.message.result.yes);
                }, "否": function () {
                    fireClose($.message.result.no);
                }, "取消": function () {
                    fireClose($.message.result.cancel);
                }
            };
        } else if (option.button == $.message.button.yesNo) {
            buttons = {
                "是": function () {
                    fireClose($.message.result.yes);
                }, "否": function () {
                    fireClose($.message.result.no);
                }
            };
        } else if (option.button == $.message.button.retryCancel) {
            buttons = {
                "重试": function () {
                    fireClose($.message.result.retry);
                }, "取消": function () {
                    fireClose($.message.result.cancel);
                }
            };
        } else {
            buttons = {
                "确定": function () {
                    fireClose($.message.result.ok);
                }
            };
        }


        dialog.appendTo("body").dialog();
        //var _height = dialog[0].scrollHeight + 20;
        var _width = dialog[0].scrollWidth + 20;
        dialog.dialog("close");
        dialog.dialog("option", {
            //minHeight: "80",
            minWidth: "100",
            //height: _height,
            width: _width,
            position: "center",
            modal: true,
            title: option.caption,
            buttons: buttons,
            close: function (event, ui) {
                fireClose($.message.result.none);
            }
        });
        dialog.dialog("open");
    };

    $.message.result = {
        none: 0 //从对话框返回了 null。 
        , ok: 1 //对话框的返回值是 OK（通常从标签为“确定”的按钮发送）。
        , cancel: 2 //对话框的返回值是 Cancel（通常从标签为“取消”的按钮发送）。
        , abort: 3 //对话框的返回值是 Abort（通常从标签为“中止”的按钮发送）。
        , retry: 4 //对话框的返回值是 Retry（通常从标签为“重试”的按钮发送）。
        , ignore: 5 //对话框的返回值是 Ignore（通常从标签为“忽略”的按钮发送）。
        , yes: 6 //对话框的返回值是 Yes（通常从标签为“是”的按钮发送）。
        , no: 7 //对话框的返回值是 No（通常从标签为“否”的按钮发送）。
    };

    $.message.button = {
        ok: 0 //消息框包含“确定”按钮。
        , okCancel: 1 //消息框包含“确定”和“取消”按钮。
        , abortRetryIgnore: 2 //消息框包含“中止”、“重试”和“忽略”按钮。
        , yesNoCancel: 3 //消息框包含“是”、“否”和“取消”按钮。
        , yesNo: 4 //消息框包含“是”和“否”按钮。
        , retryCancel: 5 //消息框包含“重试”和“取消”按钮。
    };

    $.message.icon = {
        none: "",//消息框未包含符号。
        stop: "ui-icon ui-icon-circle-close",
        error: "ui-state-error ui-icon ui-icon-circle-close",
        warning: "ui-icon ui-icon-alert",
        information: "ui-icon ui-icon-info",
        exclamation: "ui-icon ui-icon-alert",
        question: "ui-icon ui-icon-help"
    };

    /**
     *
     * @type {{caption: string, text: string, button: number, icon: string, verify: {code: number, button: number}, result: null}}
     */
    $.message.option = {
        /**
         * 消息框的标题
         */
        caption: '消息',
        /**
         * 消息框的内容文本
         */
        text: '',
        /**
         * 消息框需要的按钮
         */
        button: $.message.button.ok,
        icon: $.message.icon.information,
        //verify: null,
        /**
         * 消息框的按钮是否需要验证为 null 或空对象则为不需要。
         * 缺省为    null
         */
        verify: {
            /**
             * 如果类型为“string”则为验证码的内容大小写不敏感，<br />
             * 如果为“number”则随机生成指定位数的数字验证码。
             * 缺省值为 4.
             */
            code: 4,
            result: $.message.result.ok
        },
        result: null //function ($.message.result){}
    };

    $.message.ajaxError = function (jqXHR) {
        //alert("错误");
        $.message({caption: "错误",
            text: $.ajaxErrorMessager(jqXHR),
            button: $.message.button.ok,
            icon: $.message.icon.error,
            result: null });
    }


    $.message.loader = {
        _loaderDialog: null,
        open: function (text, fu) {
            if (text != undefined) {
                $.message.loader._text = text;
            }
            if (fu != undefined) {
                $.message.loader._abortEvent = fu;
            }
            if ($.message.loader._loaderDialog == null) {
                $(':focus').each(function () {
                    this.blur();
                });

                $.message.loader._loaderDialog = $("<div />").css({"text-align": "center"});
                $.message.loader._loaderDialog.append($("<img />")
                    .css({
                        width: "64",
                        height: "64"
                    })
                    .attr({
                        "src": "/public/jquery/message/loading.gif"
                    }));
                $.message.loader._loaderDialog.appendTo("body");
            }
            $.message.loader._refresh();
        },
        _text: null,
        setText: function (text) {
            $.message.loader._text = text;
            $.message.loader._refresh();
        },
        _abortEvent: null,
        setAbortEvent: function (fu) {
            $.message.loader._abortEvent = fu;
            $.message.loader._refresh();
        },
        _refresh: function () {
            if ($.message.loader._loaderDialog != null) {
                $.message.loader._loaderDialog.dialog();
                $.message.loader._loaderDialog.dialog("destroy");
                /*if ($.message.loader._text != null) {
                 var loaderText = $("div.loader_text", $.message.loader._loaderDialog);
                 if (loaderText.length == 0) {
                 loaderText = $("<div />")
                 .addClass("loader_text")
                 .appendTo($.message.loader._loaderDialog);
                 }
                 loaderText.text($.message.loader._text);
                 } else {
                 var loaderText = $("div.loader_text", $.message.loader._loaderDialog);
                 if (loaderText.length > 0) {
                 loaderText.remove();
                 }
                 }*/

                var options = {
                    //minHeight: "80",
                    minWidth: "100",
                    //height: _height,
                    //width: _width,
                    title: $.type($.message.loader._text) != "string" ? "请稍后..." : $.message.loader._text,
                    position: "center",
                    modal: true
                };
                if ($.message.loader._abortEvent != null) {
                    $.extend(true, options, {
                        beforeClose: $.message.loader._abortEvent,
                        close: function (event, ui) {
                            $.message.loader.close();
                        },
                        buttons: [
                            { text: "中断", click: function () {
                                $.message.loader._loaderDialog.dialog("close");
                            } }
                        ] });
                } else {
                    $.extend(true, options, {
                        open: function (event, ui) {
                            $(".ui-dialog-titlebar-close", $.message.loader._loaderDialog.siblings("div.ui-dialog-titlebar")).remove();
                        }
                    });
                }
                $.message.loader._loaderDialog.dialog(options);
            }
        },
        close: function () {
            if ($.message.loader._loaderDialog != null) {
                $.message.loader._loaderDialog.dialog("destroy");
                $.message.loader._loaderDialog.remove();
                $.message.loader._loaderDialog = null;

            }
        }
    };


})(jQuery);
