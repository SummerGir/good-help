
(function (window) {

    function _getContextPath() {
//        var baseDom = document.getElementsByTagName("base");
//        var _path = "";
//    if(baseDom.length>0){
//        _path = baseDom.;
//    }
        var els = document.getElementsByTagName('script'), src;
        for (var i = 0, len = els.length; i < len; i++) {
            src = els[i].src || '';
            if (src.lastIndexOf('/public/library/eiis.js') > 0) {
                src = src.substring(src.indexOf(window.location.protocol + "//" + window.location.host));
                src = src.substring(0, src.lastIndexOf('/public/library/eiis.js'));
                return src;
            }
        }
        return '';
    }

    window.contextPath = "";

    var loadScript = function (url) {
        if (document.body) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement,
                script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            head.insertBefore(script, head.firstChild);
        } else {
            window.document.writeln('<scr' + 'ipt type="text/javascript" src="' + url + '"><\/scr' + 'ipt>');
        }
    };

    loadScript(window.contextPath + '/public/library/jquery/jquery.js');
    loadScript(window.contextPath + '/public/library/jquery/jquery.cookie.js');
    loadScript(window.contextPath + '/public/library/eiis.foundation.js');
    loadScript(window.contextPath + '/public/library/eiis.initialize.js');
})(window);

