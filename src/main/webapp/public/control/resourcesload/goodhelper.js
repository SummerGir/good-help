var GoodHelper = {};
(function(window){
    console.log("222");
    GoodHelper.Common = {};

    GoodHelper.Common.Util = {
        js: [
            "/public/control/util/eiis.foundation.js",
            "/public/control/message/message.js"
        ],
        css: []
    };

    <!-- 字体图标-->
    GoodHelper.Common.FontIcon = {
        js: [],
        css: ["/public/esg-font/iconfont.css"]
    };

    GoodHelper.Common.Bootstrap = {
        js: [
            "/public/bootstrap/js/bootstrap.js"
        ],
        css: ["/public/bootstrap/css/bootstrap.css"]
    };

    <!-- 时间控件-->
    GoodHelper.Common.BootstrapTable = {
        js: [
            "/public/control/bootstrap-table/js/bootstrap.table.js"
        ]
    };

    GoodHelper.Common.BootstrapDateTimepicker = {
        js: [
            "/public/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"
        ],
        css: ["/public/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css"]
    };

    GoodHelper.Common.EasyUI = {
        js: [
            "/public/jquery-easyui/jquery.easyui.min.js",
            "/public/jquery-easyui/locale/easyui-lang-zh_CN.js"
        ],
        css: ["/public/jquery-easyui/themes/default/easyui.css","/public/jquery-easyui/themes/icon.css"]
    };

    <!-- 图表-->
    GoodHelper.Common.ECharts = {
        js: [
            "/public/baidu/echarts3-1-10/echarts.js"
        ]
    };

    <!-- 百度文字转语音-->
    GoodHelper.Common.BaiduTTS = {
        js: [
            "/public/baidu/tts/index.js"
        ]
    };


    //根据传入的GoodHelper.Common类型进行动态加载css和js文件
    GoodHelper.Loading = function(obj){
        console.log("加载");

        if(obj == undefined || !obj){
            return;
        }
        if(obj.css && obj.css.length > 0){
            for(var i = 0 ; i < obj.css.length ; i++){
                GoodHelper.Common.loadCss(obj.css[i]);
            }
        }
        if(obj.js && obj.js.length > 0){
            for(var i = 0 ; i < obj.js.length ; i++){
                GoodHelper.Common.loadJs(obj.js[i]);
            }
        }

        if(obj.fun){
            obj.fun();
        }
    };

    //根据路径加载js文件
    GoodHelper.Common.loadJs = function(path){
        if(!path || path.length < 1){
            throw new Error("资源路径为空");
        }
        console.log(path);
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    };

    //根据路径加载css文件
    GoodHelper.Common.loadCss = function(path){
        if(!path || path.length < 1){
            throw new Error("资源路径为空");
        }
        console.log(path);
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    };

})(window);