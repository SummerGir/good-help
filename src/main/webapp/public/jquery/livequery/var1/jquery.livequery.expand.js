(function ($) {

    var superLivequery = $.fn.livequery;
    $.fn.livequery = function () {
        if ($.isFunction(arguments[0])) {
            return superLivequery.apply(this, arguments);
        }
        var args = Arrays.clone(arguments);
        args.shift();
        return superLivequery.apply($(arguments[0], this), args);
    };

    var superExpire = $.fn.expire;
    $.fn.expire = function () {
        if ($.isFunction(arguments[0])) {
            return superExpire.apply(this, arguments);
        }
        var args = Arrays.clone(arguments);
        args.shift();
        return superExpire.apply($(arguments[0], this), args);
    };

})(jQuery);

