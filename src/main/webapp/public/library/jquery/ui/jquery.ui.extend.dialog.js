;
(function ($) {

//给 dialog 增加最大化功能.
    $.extend($.ui.dialog.prototype, {
        originalOpen: $.ui.dialog.prototype["open"],
        originalClose: $.ui.dialog.prototype["close"],
        open: function () {
            var self = this;
            self.originalOpen();
            if (self.options["maximized"] === true) {
                self._setOptions({
                    resizable: false,
                    draggable: false,
                    position: ['left', 'top'],
                    modal: false
                });
                if (!$.isFunction(self["_maximized"])) {
                    self["_maximized"] = function () {
                        setTimeout(function () {
                            var _height = $(window).height();
                            var _width = $(window).width();
                            var _heightBorder = $('body').outerHeight() - $('body').innerHeight();
                            var _widthBorder = $('body').outerWidth() - $('body').innerWidth();
                            var ui = {
                                originalPosition: {left: 0, top: 0},
                                position: {left: 0, top: 0},
                                originalSize: {width: self.options.width, height: self.options.height},
                                size: {
                                    width: _width - _widthBorder - 8,
                                    height: _height - _heightBorder - 8}
                            };
                            self._setOptions({
                                width: ui.size.width,
                                height: ui.size.height
                            });
                            self._trigger("resize", event, ui);
                        }, 0);
                    };
                }

                $(window).off('resize', self["_maximized"]);
                $(window).on('resize', self["_maximized"]).trigger('resize');
            }
        },
        close: function () {
            if ($.isFunction(this["_maximized"])) {
                $(window).off('resize', this["_maximized"]);
            }
            this.originalClose();
        }
    });

})(jQuery);