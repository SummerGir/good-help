(function ($) {
    $.livequery.htcPath = "/public/jquery/livequery/jquery.livequery.htc";

    var superLivequery = $.fn.livequery;
    $.fn.livequery = function () {
        if ($.isFunction(arguments[0])) {
            var args = Arrays.clone(arguments);
            args.insert(0, this.selector);
            return superLivequery.apply(this.prevObject, args);
        }
        return superLivequery.apply(this, arguments);
    };

    var superExpire = $.fn.expire;
    $.fn.expire = function () {
        if ($.isFunction(arguments[0])) {
            var args = Arrays.clone(arguments);
            args.insert(0, this.selector);
            return superExpire.apply(this.prevObject, args);
        }
        return superExpire.apply(this, arguments);
    };

    /*
     $("*", elements).each(function (i, element) {
     $.livequery.handle[type](element);
     });
     $.livequery.handle[type](elements);
     */

})(jQuery);

