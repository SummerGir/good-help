(function ($, undefined) {

    var generateVerifyCode = function (length) {
        if (length < 1) length = 4;
        var rnd = "";
        for (var i = 0; i < length; i++)
            rnd += Math.floor(Math.random() * 10);
        return rnd;
    };

    var _dialogHTML = null;
    var getDialogHTML = function () {
        if (_dialogHTML == null) {
            $.ajax({
                url: "/public/control/message/message.jsp",
                async: false,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    _dialogHTML = data;
                }
            });
        }
        return _dialogHTML;
    };

    $.message = function (opt) {

        var option = opt;
        if ($.type(opt) === 'string') {
            option = {
                text: opt
            };
        }

        var defaultOption = $.extend(true, {}, $.message.option, {verify: null});

        option = $.extend(true, {}, defaultOption, option);

        if (String.isNullOrWhiteSpace(option.caption)) {
            switch (option.icon) {
                case $.message.icon.stop:
                    option.caption = "停止";
                    break;
                case $.message.icon.error:
                    option.caption = "错误";
                    break;
                case $.message.icon.warning:
                    option.caption = "警告";
                    break;
                case $.message.icon.question:
                    option.caption = "讯问";
                    break;
                default :
                    option.caption = "消息";
            }

        }

        var isBodyHtml = (option.body != null) && $.isFunction(option.result);
        var bodyHtml = "";
        var dialog = $(getDialogHTML());

        if (isBodyHtml) {
            bodyHtml = option.body;
        } else {
            bodyHtml = $('<div/>').html(option.text).html();

            // bodyHtml = bodyHtml.replace(/ /g, "&nbsp;");
            bodyHtml = bodyHtml.replace(/\r\n/g, "<br />");
            bodyHtml = bodyHtml.replace(/\n/g, "<br />");
            bodyHtml = bodyHtml.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

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
                            bodyHtml += $("<div />").append("<br /><br />请在下边的输入框中输入“<span style=\"color:#ff0000\">" + option.verify.code + "</span>”这几位验证码。")
                                .append("<br />")
                                .append($("<input />").attr({
                                    "type": "text"
                                }).addClass("eiis-text message-verify")
                                /*.css({
                                 "width": (10 * option.verify.code.lengthb()) + "px"
                                 })*/
                            ).html();
                        }
                    }
                }
            }
        }

        var fireClose = function (result) {

            if (isBodyHtml) {
                if (option.result(result) === false) {
                    //dialog.modal("show");
                    return false;
                }

                $(dialog).off('hide.bs.modal');
                $(dialog).modal("destroy");//destroy
                $(dialog).remove();
            } else {
                var verifyElement = dialog.find(".message-verify");
                if (verifyElement.length > 0) {
                    if (result == option.verify.result) {
                        if (!option.verify.code.equalsIgnoreCase(verifyElement.val().trim())) {
                            alert("验证码输入正确后才能点击此按钮！");
                            return;
                        }
                    }
                }

                $(dialog).off('hide.bs.modal');
                $(dialog).modal("destroy");//destroy
                $(dialog).remove();

                if ($.isFunction(option.result)) {
                    option.result(result);
                }
            }
        };

        var iconColor = null;
        if ($.trim(option.icon) != "" && option.icon != $.message.icon.none) {
            $(".modal-title>i.fa:not(." + option.icon + ")", dialog).remove();
            if (option.icon == $.message.icon.error) {
                iconColor = "alert-danger";
            } else if (option.icon == $.message.icon.warning) {
                iconColor = "alert-warning";
            }
        } else {
            $(".modal-title>i.fa", dialog).remove();
        }
        $(".modal-body", dialog).html(bodyHtml);
        if (isBodyHtml) {
            $(".modal-body", dialog).css("display", "inline");
        }
        $(".modal-title>span", dialog).text(option.caption);

        $(".modal-footer>button:not(" + option.button + ")", dialog).remove();
        $(".modal-footer>button", dialog).on("click", function () {
            fireClose($.message.result[$(this).attr("data-result")]);
        });

        dialog.on('hide.bs.modal', function (e) {
            if (fireClose($.message.result.none) === false) {
                return false;
            }
        });

        //dialog.appendTo("body");
        dialog.modal("show");
        setTimeout(function () {
            dialog.find(":text").focus();
        }, 1000);

        if (!String.isNullOrWhiteSpace(iconColor)) {
            $(dialog).addClass(iconColor);
            setTimeout(function () {
                $(dialog).css({
                    "background-color": "",
                    "border-color": ""
                });
            }, 1);
        }
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
        ok: ".modal-message-button-ok" //消息框包含“确定”按钮。
        , okCancel: ".modal-message-button-ok, .modal-message-button-cancel" //消息框包含“确定”和“取消”按钮。
        , abortRetryIgnore: ".modal-message-button-abort, .modal-message-button-retry, .modal-message-button-ignore" //消息框包含“中止”、“重试”和“忽略”按钮。
        , yesNoCancel: ".modal-message-button-yes, .modal-message-button-no, .modal-message-button-cancel" //消息框包含“是”、“否”和“取消”按钮。
        , yesNo: ".modal-message-button-yes, .modal-message-button-no" //消息框包含“是”和“否”按钮。
        , retryCancel: ".modal-message-button-retry, .modal-message-button-cancel" //消息框包含“重试”和“取消”按钮。
    };

    $.message.icon = {
        none: "",//消息框未包含符号。
        stop: "fa-stop",
        error: "fa-times-circle",
        warning: "fa-exclamation-triangle",
        information: "fa-info-circle",
        exclamation: "fa-exclamation-circle",
        question: "fa-question-circle"
    };

    /**
     *
     * @type {{caption: string, text: string, button: number, icon: string, verify: {code: number, button: number}, result: null}}
     */
    $.message.option = {
        /**
         * 消息框的标题
         */
        caption: null,
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
        body: null,//不为空时 text 和 verify 无效
        result: null //function ($.message.result){}
    };

    $.message.ajaxError = function (jqXHR) {
        //alert("错误");
        $.message({
            caption: "错误",
            text: $.ajaxErrorMessager(jqXHR),
            button: $.message.button.ok,
            icon: $.message.icon.error,
            result: null
        });
    };

    $.message.loader = {
        _loaderDialog: null,
        _isOpen: false,
        open: function (text, fu) {
            if (text != undefined) {
                $.message.loader._text = text;
            }
            if (fu != undefined) {
                $.message.loader._abortEvent = fu;
            }
            if (!$.message.loader._isOpen) {
                $.message.loader._isOpen = true;
                $.message.loader._loaderDialog = $(getDialogHTML());
                $(".modal-body", $.message.loader._loaderDialog).append($("<div/>")
                    .css({
                        "width": "100%",
                        "text-align": "center"
                    })
                    .append($("<img />")
                        .css({
                            "width": "48",
                            "height": "48"
                        })
                        .attr({
                            "src": "/public/controls/message/loading.gif"
                        }))
                    .append($("<span />")
                        .css({
                            "color": "#0072c6",
                            "white-space": "nowrap",
                            "margin-left": "16px"
                        })));
                $(".modal-footer>button:not(.modal-message-button-abort)", $.message.loader._loaderDialog).remove();

                $(".modal-footer>button.modal-message-button-abort", $.message.loader._loaderDialog)
                    .on("click", function () {
                        $.message.loader.close();
                        if ($.isFunction($.message.loader._abortEvent)) {
                            $.message.loader._abortEvent();
                        }
                    });
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
            if ($.message.loader._isOpen) {

                $(".modal-header", $.message.loader._loaderDialog)
                    .empty()
                    .text($.type($.message.loader._text) != "string"
                        ? "请稍后..."
                        : $.message.loader._text);

                $.message.loader._loaderDialog.modal("show");

                if ($.isFunction($.message.loader._abortEvent)) {
                    $(".modal-footer>button.modal-message-button-abort", $.message.loader._loaderDialog).show();
                } else {
                    $(".modal-footer>button.modal-message-button-abort", $.message.loader._loaderDialog).hide();
                }

                $.message.loader._isOpen = true;
            }
        },
        close: function () {
            if ($.message.loader._loaderDialog != null) {
                $.message.loader._loaderDialog.modal("destroy");//destroy
                $.message.loader._loaderDialog.remove();
                $.message.loader._loaderDialog = null;
            }
            $.message.loader._isOpen = false;
        }
    };

})(jQuery);
