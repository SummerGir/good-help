var EIIS = {};

(function (window) {

    EIIS.Common = {};

    EIIS.Common.removeScript = function (script) {
        script.onload = script.onerror = script.onreadystatechange = null;
        script.setAttribute("class", "eiis-script-loaded");
    };

    var headElement = document.getElementsByTagName("head")[0];
    EIIS.Common.loadJavaScriptComplete = new Object();
    EIIS.Common.loadJavaScript = function (url, onload) {

        var currentJS = EIIS.Common.loadJavaScriptComplete[url];

        if (currentJS) {
            if (typeof (onload) == 'function') {
                if (currentJS.loaded) {
                    onload.call(window);
                } else {
                    currentJS.onload.push(onload);
                }
            }
            return;
        }
        EIIS.Common.loadJavaScriptComplete[url] = {
            loaded: false,
            onload: []
        };

        currentJS = EIIS.Common.loadJavaScriptComplete[url];

        if (typeof (onload) == 'function') currentJS.onload.push(onload);

        if (document.body || currentJS.onload.length > 0) {
            var script = document.createElement('script');

            var callback = function () {
                currentJS.loaded = true;

                script.onload = script.onerror = script.onreadystatechange = null;

                headElement.removeChild(script);
                script = null;
                script = undefined;
                delete script;

                for (var i = 0, l = currentJS.onload.length; i < l; i++) {
                    currentJS.onload[i].call(window);
                }
            };

            var supportOnload = "onload" in script;

            if (supportOnload) {
                script.onload = script.onerror = callback;
            }
            else {
                script.onreadystatechange = function () {
                    if (/loaded|complete/.test(script.readyState)) {
                        callback();
                    }
                }
            }

            script.type = "text/javascript";
            script.async = 1;
            script.src = url;
            //headElement.insertBefore(script, headElement.lastChild);
            headElement.appendChild(script);
        } else {
            window.document.writeln('<scr' + 'ipt type="text/javascript" src="' + url + '" onload="javascript:EIIS.Common.removeScript(this);" onerror="javascript:EIIS.Common.removeScript(this);" onreadystatechange="javascript:EIIS.Common.removeScript(this);"><\/scr' + 'ipt>');
            currentJS.loaded = true;
        }

    };

    EIIS.Common.loadCssComplete = new Object();
    EIIS.Common.loadCss = function (url, onload) {

        var currentCss = EIIS.Common.loadCssComplete[url];

        if (currentCss) {
            if (typeof (onload) == 'function') {
                if (currentCss.loaded) {
                    onload.call(window);
                } else {
                    currentCss.onload.push(onload);
                }
            }
            return;
        }
        EIIS.Common.loadCssComplete[url] = {
            loaded: false,
            onload: []
        };

        currentCss = EIIS.Common.loadCssComplete[url];

        if (typeof (onload) == 'function') currentCss.onload.push(onload);


        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";

        var callback = function () {
            currentCss.loaded = true;
            link.onload = link.onerror = link.onreadystatechange = null;
            for (var i = 0, l = currentCss.onload.length; i < l; i++) {
                currentCss.onload[i].call(window);
            }
        };


        var supportOnload = "onload" in link;

        if (supportOnload) {
            link.onload = link.onerror = callback;
        }
        else {
            link.onreadystatechange = function () {
                if (/loaded|complete/.test(link.readyState)) {
                    callback();
                }
            }
        }

        link.href = url;
        headElement.appendChild(link);

    };

    EIIS.Common.loadJavaScript("/public/utilities/require/require.min.js");
    EIIS.Common.loadJavaScript("/public/jquery/jquery.js");
    EIIS.Common.loadJavaScript("/public/eiis/eiis.foundation.js");
    EIIS.Common.loadJavaScript("/public/eiis/eiis.initialize.js");

})(window);

