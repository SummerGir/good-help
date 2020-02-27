(function (undefined) {

    define("jquery", [], function () {
        return jQuery;
    });

    jQuery.ajaxSettings.traditional = true;

    jQuery.ajaxErrorMessager = function (jqXHR) {
        var exceptionContent = "";
        if ($.type(jqXHR) === "string") {
            exceptionContent = $(jqXHR).find("#exceptionContent").text();
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqXHR;
            }
        } else if ($.type(jqXHR.responseText) === "string") {
            var jqResponseText = $("<div>" + jqXHR.responseText + "</div>");
            exceptionContent = jqResponseText.find("#exceptionContent").text();
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqResponseText.find("title").text();
            }
            if (String.isNullOrWhiteSpace(exceptionContent)) {
                exceptionContent = jqXHR.responseText;
            }
            jqResponseText.remove();
        }
        return exceptionContent;
    };

    EIIS.browser = {
        phone: false,
        pc: false,
        pad: false,
        isAndroid: false,
        isIOS: false,
        other: false
    };

    (function (undefined) {
        var flag = false;

        var agent = navigator.userAgent;
        var mobileKeywords = [
            "Android",
            "iPhone",
            "Windows Phone",
            "MQQBrowser",
            "UCWEB",
            "Mobile"
        ];
        var pcKeywords = [
            "Windows NT",
            "Macintosh"
        ];
        var padKeywords = [
            "iPad"
        ];

        var isKeywords = function (keywords, agent) {
            for (var i = 0, j = keywords.length; i < j; i++) {
                if (agent.indexOf(keywords[i]) >= 0) {
                    return true;
                }
            }
            return false;
        };
        if (isKeywords(pcKeywords, agent)) {
            EIIS.browser.pc = true;
        } else if (isKeywords(mobileKeywords, agent)) {
            EIIS.browser.phone = true;
            if(agent.indexOf('Android') > -1 || agent.indexOf('Adr') > -1)
                EIIS.browser.isAndroid = true;
            else if(!!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
                EIIS.browser.isIOS = true;
        } else if (isKeywords(padKeywords, agent)) {
            EIIS.browser.pad = true;
        } else {
            EIIS.browser.other = true;
        }
    })();


    EIIS.Common.jQuery = {
        ui: {
            css: ['/public/jquery/ui/jquery.ui.css'],
            js: [
                '/public/jquery/ui/jquery.ui.js'
                , '/public/jquery/ui/jquery.ui.datepicker-zh-CN.js'
            ]
        },
        noty: {
            js: ['/public/jquery/jquery.noty.packaged.min.js']
        },
        transform: {
            js: ['/public/jquery/jquery.transform.js']
        },
        json: {
            js: ['/public/jquery/jquery.json.js']
        },
        livequery: {
            dependency: ['EIIS.Common.jQuery.livequery.var1'],
            var1: {js: ['/public/jquery/livequery/var1/jquery.livequery.js', '/public/jquery/livequery/var1/jquery.livequery.expand.js']},
            var2: {
                //js: ['/public/jquery/livequery/var2/jquery.livequery.js', '/public/jquery/livequery/var2/jquery.livequery.expand.js']
                load: function () {
                    require.config({
                        paths: {
                            "jquery.livequery": "/public/jquery/livequery/var2/jquery.livequery"
                        }
                    });
                    require(['jquery.livequery',
                        '../jquery/livequery/var2/jquery.livequery.expand']);
                }
            }
        },
        form: {
            load: function () {
                require.config({
                    paths: {
                        "jquery.form": "/public/jquery/jquery.form"
                    }
                });
                //require(['/public/jquery/jquery.form.js']);
                require(["jquery.form"]);
            }
        },
        dateextend: {
            js: ['/public/js/date_extend.js']
        },
        highlight: {
            js: ['/public/jquery/jquery.highlight.js']
        },
        pagination: {
            css: ['/public/jquery/pagination/pagination.css'],
            js: ['/public/jquery/pagination/jquery.pagination.js']
        },
        validate: {
            js: ['/public/jquery/validate/jquery.validate.expand.js']
        },
        cycle: {
            js: ['/public/jquery/jquery.cycle.js']
        },

        message: {
            //loadSequence: true,
            dependency: ['EIIS.Common.UI', 'EIIS.Common.bootstrap.modal'],
            js: ['/public/controls/message/message.js']
        },
        xmlext: {
            js: ['/public/jquery/jquery.xmlext.js']
        }
    };

    var datetimepickercss = [], datetimepickerjs=[];
    //if(EIIS.browser.pc){
        datetimepickercss = ['/public/controls/datetimepicker/bootstrap-datetimepicker.min.css'];
        datetimepickerjs = ['/public/controls/datetimepicker/bootstrap-datetimepicker.min.js',
            '/public/controls/datetimepicker/bootstrap-datetimepicker.zh-CN.js',
            '/public/controls/datetimepicker/bootstrap-datetimepicker.expand.js'];
    //}
    /*else {
        datetimepickercss = ['/public/controls/time/css/mobiscroll.custom-3.0.0-beta.css'];
        datetimepickerjs = ['/public/controls/time/js/mobiscroll.custom-3.0.0-beta.min.js'];
    }*/
    EIIS.Common.bootstrap = {
        css: ['/public/bootstrap/css/bootstrap.css'],
        js: ['/public/bootstrap/js/bootstrap.js'],
        theme: {
            dependency: ['EIIS.Common.bootstrap'],
            css: ['/public/bootstrap/css/bootstrap-theme.min.css']
        },
        font_awesome: {
            dependency: ['EIIS.Common.bootstrap'],
            css: ['/public/font-awesome/css/font-awesome.min.css']
        },
        datetimepicker: {
            css: datetimepickercss,
            js: datetimepickerjs
        },

        modal: { //第三方对话框
            css: ['/public/controls/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                '/public/controls/bootstrap-modal/css/bootstrap-modal.css',
                '/public/controls/bootstrap-modal/css/bootstrap-modal.expand.css'],
            js: ['/public/controls/bootstrap-modal/js/bootstrap-modalmanager.js',
                '/public/controls/bootstrap-modal/js/bootstrap-modal.js',
                '/public/controls/bootstrap-modal/js/bootstrap-modal.expand.js']
        },
        table: {
            dependency: ['EIIS.Common.controls.fix'],
            css: ['/public/controls/table/table.css'],
            js: ['/public/controls/table/table.js']
        },
        BootstrapTable: {
            css: ['/public/controls/bootstrap-table/css/table.css'],
            js: ['/public/controls/bootstrap-table/js/bootstrap.table.js']
        },
        tabs: {
            loadSequence: true,
            dependency: ['EIIS.Common.jQuery.livequery'],
            js: ['/public/controls/tabs/tabs-expand.js']
        }
    };

    EIIS.Common.controls = {
        fix: {
            css: ['/public/controls/fix/fix.css'],
            js: ['/public/controls/fix/fix.js']
        },
        treeSelect : {
            css : ['/public/jquery-easyui/themes/default/easyui.css','/public/jquery-easyui/selectPlugins/jquery-easyui.select.css'],
            js : ['/public/jquery-easyui/jquery.easyui.min.js','/public/mobileImgSupport/js/sonic.js','/public/jquery-easyui/selectPlugins/jquery-easyui.select.js']
        },
        EasyUI: {
            js: [
                "/public/jquery-easyui/jquery.easyui.min.js",
                "/public/jquery-easyui/locale/easyui-lang-zh_CN.js"
            ],
            css: ["/public/jquery-easyui/themes/default/easyui.css","/public/jquery-easyui/themes/icon.css"]
        },
        ECharts: {
            js: [
                "/public/baidu/echarts3-1-10/echarts.min.js"
            ]
        },
        BaiduTTS: {
            js: [
                "/public/baidu/tts/index.js"
            ]
        }
    };

    EIIS.Common.UI = {
        loadSequence: true,
        dependency: ['EIIS.Common.jQuery.livequery'],
        css: ['/public/jquery/ui/jquery.ui.css','/public/esg-font/iconfont.css',"/public/esg-font/extend/iconfont.css"],
        js: ['/public/eiis/ui/eiis.ui.js',"/public/jquery/ui/jquery.ui.js",'/public/js/biaoqing.js']
    };

    EIIS.Common.loadComponent = function (component, onload) {
        var tmpComponent = component;
        if (typeof (tmpComponent) == 'string') {
            eval('tmpComponent = ' + component);
        }
        var dependency = [];
        var js = [];
        var css = [];

        if (tmpComponent['dependency']) dependency = tmpComponent['dependency'].slice(0);// Array.clone(tmpComponent['dependency']);
        if (tmpComponent['css']) css = tmpComponent['css'].slice(0);// Array.clone(tmpComponent['css']);
        if (tmpComponent['js']) js = tmpComponent['js'].slice(0);// Array.clone(tmpComponent['js']);

        if (Boolean.parse(tmpComponent['loadSequence'])
            || typeof (tmpComponent["load"]) == 'function'
            || typeof (onload) == 'function') {

            var nextLoader = function () {

                if (dependency.length > 0) {
                    var tmp = dependency.shift();
                    EIIS.Common.loadComponent(tmp, nextLoader);
                } else if (css.length > 0) {
                    var tmp = css.shift();
                    EIIS.Common.loadCss(tmp, nextLoader);
                } else if (js.length > 0) {
                    var tmp = js.shift();
                    EIIS.Common.loadJavaScript(tmp, nextLoader);
                } else {
                    if (typeof (tmpComponent["load"]) == 'function') {
                        tmpComponent["load"].call(window);
                    }
                    if (typeof (onload) == 'function') onload.call(window);
                }
            };

            nextLoader();

        } else {
            for (var i = 0, l = dependency.length; i < l; i++) {
                EIIS.Common.loadComponent(dependency[i]);
            }
            for (var i = 0, l = css.length; i < l; i++) {
                EIIS.Common.loadCss(css[i]);
            }
            for (var i = 0, l = js.length; i < l; i++) {
                EIIS.Common.loadJavaScript(js[i]);
            }
        }

    };

    $(window).on("load", function () {
        $("script.eiis-script-loaded").remove();
    });

    require.config({
        packages: [
            /*{
             name: "jquery",
             location: '/public/jquery',
             main: 'jquery-1.11.2'
             },*/
            {
                name: 'echarts3',
                location: '/public/baidu/echarts3-1-10',
                main: 'echarts.min'
            },
            {
                name: 'echarts',
                location: '/public/baidu/echarts',
                main: 'echarts'
            },
            {
                name: 'zrender',
                location: '/public/baidu/zrender',
                main: 'zrender'
            },
            {
                name: 'underscore',
                location: '/public/utilities/underscore',
                main: 'underscore-min'
            }
        ]
    });

})();