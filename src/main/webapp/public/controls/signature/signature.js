(function ($, undefined) {

    var ltIE9 = false;
    try {
        if (window.ActiveXObject) {
            ltIE9 = true;
        } else {
            //支持 IE11 的判断
            if (window.ActiveXObject == undefined && $.type(window.ActiveXObject.prototype) === "object") {
                ltIE9 = true;
            }
        }
    } catch (e) {
    }
    if (ltIE9 === true) {
        ltIE9 = false;
        if ($.type(window.XMLHttpRequest) !== "function") {
            ltIE9 = true;
        }
    }
    if (ltIE9 == true) {
        EIIS.Common.loadJavaScript("/public/controls/signature/libs/flashcanvas.min.js");
    }
    EIIS.Common.loadJavaScript("/public/controls/signature/libs/jSignature.min.js");
//    EIIS.Common.loadJavaScript("/public/controls/signature/src/jSignature.js");
//    EIIS.Common.loadJavaScript("/public/controls/signature/src/plugins/jSignature.CompressorSVG.js");
//    EIIS.Common.loadJavaScript("/public/controls/signature/src/plugins/jSignature.UndoButton.js");

    $.signature = function (o) {

        var option = $.extend(true, {}, $.signature.option, o);

        var caption = "保留原笔记输入";

        var jqBackdrop = $("<div/>")
            .css({
                "position": "fixed",
                "top": "0",
                "right": "0",
                "bottom": "0",
                "left": "0",
                "z-index": "2040",
                "opacity": "0.7",
                "filter": "alpha(opacity=70)",
                "background": "#fff"
            });

        var jqDialog = $("<div/>")
            .addClass("panel panel-default")
            .css({
                "position": "fixed", "top": "2px", "right": "2px"
                //, "bottom": "2px"
                , "left": "2px", "z-index": "2046"

            })
            .append("<div class=\"panel-heading\"><button type=\"button\" class=\"close\">×</button> <h3 class=\"dialog-title\">" + caption + "</h3></div>")
            .append("<div class=\"panel-body\"><div></div></div>")
            //.append("<div class=\"panel-footer\"><div class=\"pull-right\"><button type=\"button\" class=\"eiis-button\" data-type=\"submit\">确定</button> <button type=\"button\" class=\"eiis-button\" data-type=\"cancel\">取消</button></div><div>笔的颜色：<select class=\"eiis-combobox pen-color\" style=\"width: 40px;display:inline\"></select>&nbsp;&nbsp;&nbsp;&nbsp;笔的粗细：<select class=\"eiis-combobox pen-size\" style=\"width: 40px;display:inline\"></select></div><div class=\"clearfix\"></div></div>");
            .append("<div class=\"panel-footer\"><div class=\"pull-right\"><button type=\"button\" class=\"eiis-button btn-xs btn-default\" data-type=\"submit\">确定</button>&nbsp;&nbsp;<button type=\"button\" class=\"eiis-button btn-xs btn-default\" data-type=\"cancel\">取消</button></div><div><button type=\"button\" class=\"eiis-button btn-xs btn-default\" data-type=\"reset\">重置</button>&nbsp;&nbsp;<button type=\"button\" class=\"eiis-button btn-xs btn-default\" data-type=\"undo\"><i class=\"fa fa-undo\"></i> 撤销</button></div><div class=\"clearfix\"></div></div>");

        $("body").addClass("modal-open page-overflow")
            .append(jqBackdrop)
            .append(jqDialog);


        var UndoButtonRenderer = function () {
            return jqDialog.find(":button[data-type=\"undo\"]");
        };

        var jqSignDiv = jqDialog.find(".panel-body>div");
        var winHeight = $(window).height();
        try{
            if(iosParam && "ios".equals(iosParam.platform)){
                winHeight = iosParam.height;
                jqBackdrop[0].scrollIntoView();
            }
        }catch (e){}
        jqSignDiv.css({
            'height': (winHeight - jqDialog.height() - 14) + "px",
            "padding": "1px",
            "border": "1px dotted black"
        }).jSignature({
            'width': jqSignDiv.width(),
            'height': jqSignDiv.height(),
            'sizeRatio': 4 // only used when height = 'ratio'
            , 'color': 'black',
            'background-color': 'transparent',
            'decor-color': 'transparent',
            'lineWidth': 0,
            'minFatFingerCompensation': -10,
            'showUndoButton': true,
            'UndoButton': UndoButtonRenderer,
            'readOnly': option.readOnly,
            'data': option.data
        });

        var closeDialog = function () {
            $("body").removeClass("modal-open page-overflow");
            jqBackdrop.remove();
            jqDialog.remove();
        };

        jqDialog.find(":button.close, :button[data-type=\"cancel\"]")
            .on("click", closeDialog);

        /*jqDialog.find("select.pen-color")
         .append("<option value='black'>黑色</option>")
         .append("<option value='red'>红色</option>")
         .append("<option value='green'>绿色</option>")
         .append("<option value='blue'>蓝色</option>")
         .append("<option value='yellow'>黄色</option>")
         .on("change", function () {
         jqSignDiv.jSignature("updateSetting", 'color', $(this).children("option:selected").val());
         });
         jqDialog.find("select.pen-size")
         .append("<option value='-20'>-20</option>")
         .append("<option value='-10'>-10</option>")
         .append("<option value='0'>0</option>")
         .append("<option value='10'>10</option>")
         .append("<option value='20'>20</option>")
         .on("change", function () {
         jqSignDiv.jSignature("updateSetting", 'lineWidth', parseInt($(this).children("option:selected").val()));
         });*/

        jqDialog.find(":button[data-type=\"submit\"]")
            .on("click", function () {
                if ($.isFunction(option.change)) {
                    //option.change(jqSignDiv.jSignature("getData", 'image/svg+xml;base64'));
                    option.change(jqSignDiv.jSignature("getData", 'image/svg+xml'), jqSignDiv.jSignature("getData", 'native'));
                }
                closeDialog();
            });
//fa fa-undo
        jqDialog.find(":button[data-type=\"reset\"]")
            .on("click", function () {
                jqSignDiv.jSignature('reset');
            });
    };

    $.signature.isEmptyData = function (data) {
        var jqSvg = $(data[1]).filter("svg");
        return jqSvg.children().length == 0;
    };

    $.signature.getSize = function (data) {
        var jqSvg = $(data[1]).filter("svg");
        return {
            "width": jqSvg.attr("width"),
            "height": jqSvg.attr("height")
        };
    };

    $.signature.option = {
        'change': null,
        'readOnly': false,
        'data': []
    };

    $.fn.signature = function (o) {
        var option = $.extend(true, {}, $.fn.signature.option, o);
        var self = this;
        if (ltIE9) {
            $.ajax({
                url: "/public/controls/signature/svg2png.jsp",
                data: {
                    "svg": option.data[1]
                },
                type: "POST",
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    if ($.isArray(data) && data.length > 0) {
                        var img = $("<img/>");
                        if (option.width != null) {
                            img.css("width", option.width);
                        }
                        if (option.height != null) {
                            img.css("height", option.height);
                        }

                        self.empty().append(img.attr({
                            "border": "0",
                            "src": data[0].displayUri
                        }));
                    }
                }
            });

        } else {
            var jqSvg = $(option.data[1]).filter("svg");
            var _width = jqSvg.attr("width");
            var _height = jqSvg.attr("height");
            jqSvg[0].setAttribute("width", option.width == null ? _width : option.width);
            jqSvg[0].setAttribute("height", option.height == null ? _height : option.height);
            jqSvg[0].setAttribute("viewBox", "0 0 " + _width + " " + _height);
            self.empty().append(jqSvg);
        }
    };
    $.fn.signature.option = {
        'width': null,
        'height': null,
        'data': []
    };
})(jQuery);