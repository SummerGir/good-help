;
(function ($) {

    //给 jqGrid 增加最大化功能
    $.jgrid.extend({
        maximize: function () {
            this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }

                if ($.isEmptyObject($t.grid["_maximized"])) {
                    $t.grid["_maximized"] = {
                        isFire: false,
                        fire: function () {
                            if ($t.grid["_maximized"].isFire) return;
                            $t.grid["_maximized"].isFire = true;
                            setTimeout($t.grid["_maximized"].run, 10);
                        },
                        run: function () {
                            var _heightBorder = $('body').outerHeight() - $('body').innerHeight();
                            var _widthBorder = $('body').outerWidth() - $('body').innerWidth();
                            var _height = $(window).height();
                            var _width = $(window).width();
                            //var guidHeight = _height - _heightBorder - ($($t.grid.bDiv).parent().parent().height() - $($t.grid.bDiv).height()) - 3;
                            var guidHeight = _height - _heightBorder - ($($t.grid.bDiv).parents('.ui-jqgrid').height() - $($t.grid.bDiv).height()) - 5;
                            var guidWidth = _width - _widthBorder - 2;
                            $($t).jqGrid('setGridHeight', guidHeight < 20 ? 20 : guidHeight)
                                .jqGrid('setGridWidth', guidWidth < 20 ? 20 : guidWidth);
                            $t.grid["_maximized"].isFire = false;
                        }
                    };
                }


                $(window).off('resize', $t.grid["_maximized"].fire);
                $(window).on('resize', $t.grid["_maximized"].fire).trigger('resize');
            });
        },
        autoFit: function () {
            this.each(function () {
                var table = this,
                    $t = $(table),
                    options = table.p;
                if (!table.grid) return;
                //if(!options.autoFit) return;

                var _wrap = $("#gbox_" + table.id),
                    _view = $(".ui-jqgrid-view", _wrap),
                    _pager = $(".ui-jqgrid-pager", _wrap),
                    _wrapper = _wrap.parent();
                var h = 0;
                if (!(options.height.toString().endsWith("%") || "auto".equalsIgnoreCase(options.height.toString()))) {
                    $(">div", _view).each(function (i, o) {
                        if (!$(o).hasClass("ui-jqgrid-bdiv")) {
                            h += $(o).outerHeight(true);
                        }
                    });
                    $t.jqGrid('setGridHeight', _wrapper.height() - _pager.outerHeight(true) - h - 1);
                }
                if (!(options.width.toString().endsWith("%") || "auto".equalsIgnoreCase(options.width.toString()))) {
                    $t.jqGrid('setGridWidth', _wrapper.width() - 2);
                }
            });
        }
    });

    var super_fn_jqGrid = $.fn.jqGrid;

    $.extend(true, $.jgrid, {
        defaults: {
            jsonReader: {
                repeatitems: false
            },
            loadError: function (jqXHR) {
                EIIS.Common.loadComponent(EIIS.Common.jQuery.message, function () {
                    $.message({caption: "错误",
                        text: $.ajaxErrorMessager(jqXHR),
                        button: $.message.button.ok,
                        icon: $.message.icon.error,
                        result: null });
                });
            },
            autoWidth: true,
            shrinkToFit: true,
            forceFit: false,
            viewrecords: true,
            hidegrid: false,
            mtype: 'post',
            datatype: "json",
            toolbar: [true, "top"],
            pager: "#pager",
            rowNum: 20,
            rowList: [10, 20, 30, 50, 100]
        },
        nav: {
            edittext: "编辑",
            addtext: "添加",
            deltext: "删除",
            searchtext: "查找",
            refreshtext: "刷新",
            viewtext: "查看"
        },
        colModelOption: {
            resizable: true
        },
        getMethod: function (name) {
            return this.getAccessor(super_fn_jqGrid, name);
        }
    });

    $.fn.jqGrid = function () {
        if ($.isPlainObject(arguments[0])) {
            if ($.type(arguments[0].colModel) === "array") {
                for (var i = 0, j = arguments[0].colModel.length; i < j; i++) {
                    arguments[0].colModel[i] = $.extend(true, {}, $.jgrid.colModelOption, arguments[0].colModel[i]);
                }
            }
        }
        var _rtn = super_fn_jqGrid.apply(this, arguments);
        if ($.isPlainObject(arguments[0])) {
            if ($.type(arguments[0].autoFit) == "boolean") {
                if (arguments[0].autoFit === true) {
                    this.jqGrid("autoFit");
                }
            }
            if ($.type(arguments[0].maximize) == "boolean") {
                if (arguments[0].maximize === true) {
                    this.jqGrid("maximize");
                }
            }
        }
        return _rtn;
    }


})(jQuery);