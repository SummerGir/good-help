;
(function ($) {

    $.ui.dynatree.prototype.options = $.extend(true, {}, $.ui.dynatree.prototype.options, {
        clickFolderMode: 1,
        fx: { height: "toggle", duration: 200 },
        strings: {
            loading: "载入中&#8230;",
            loadError: "加载错误!"
        }
    });

})(jQuery);
