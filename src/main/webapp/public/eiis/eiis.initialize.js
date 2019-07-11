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
        html: {
            css: ['/public/kindeditor/themes/eiis_kindeditor.css'],
            js: ['/public/kindeditor/kindeditor-min.js'
                , '/public/kindeditor/lang/zh_CN.js']
        },
        message: {
            //loadSequence: true,
            dependency: ['EIIS.Common.UI', 'EIIS.Common.bootstrap.modal'],
            js: ['/public/controls/message/message.js']
        },
        appmessage: {
            //loadSequence: true,
            dependency: ['EIIS.Common.UI', 'EIIS.Common.bootstrap.modal'],
            js: ['/public/controls/message-app/message.js']
        },
        xmlext: {
            js: ['/public/jquery/jquery.xmlext.js']
        },
        fancytree: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: ['/public/jquery/fancytree/esg_all/src/jquery-ui.css', '/public/jquery/fancytree/esg_all/src/skin-xp/ui.fancytree.css'],
            js: [ '/public/jquery/fancytree/jquery.fancytree.js','/public/jquery/fancytree/jquery.fancytree.expand.js'],
            childcounter: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.childcounter.js']
            },
            clones: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.clones.js']
            },
            columnview: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.columnview.js']
            },
            dnd: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                css: ['/public/jquery/fancytree/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.dnd.js']
            },
            edit: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.edit.js']
            },
            filter: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.filter.js']
            },
            glyph: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.glyph.js']
            },
            gridnav: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.gridnav.js']
            },
            menu: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.menu.js']
            },
            persist: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.persist.js']
            },
            table: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.table.js']
            },
            themeroller: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.themeroller.js']
            },
            wide: {
                dependency: ['EIIS.Common.jQuery.fancytree'],
                js: ['/public/jquery/fancytree/src/jquery.fancytree.wide.js']
            }
        },
        /*
        fancytree1: {
            dependency: ['EIIS.Common.jQuery.ui'],
            css: ['/public/jquery/fancytree1/esg_all/src/jquery-ui.css', '/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
            //css: ['/public/jquery/fancytree/skin-bootstrap/ui.fancytree.min.css', '/public/jquery/fancytree/skin-bootstrap/ui.fancytree.expand.css'],
            //js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.expand.js','/public/jquery/fancytree1/esg_all/lib/jquery.js', '/public/jquery/fancytree1/esg_all/lib/jquery-ui.custom.js', '/public/jquery/fancytree1/esg_all/src/jquery.fancytree.js', '/public/jquery/fancytree1/esg_all/lib/jquery-ui-contextmenu/jquery.ui-contextmenu.min.js'],
            js: ['/public/jquery/fancytree1/jquery.fancytree.min.js', '/public/jquery/fancytree1/esg_all/src/jquery.fancytree.expand.js'],
            childcounter: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.childcounter.js']
            },
            clones: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                css: ['/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.clones.js']
            },
            columnview: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.columnview.js']
            },
            dnd: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                css: ['/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.dnd.js']
            },
            edit: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                css: ['/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.edit.js']
            },
            filter: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                css: ['/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.filter.js']
            },
            glyph: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                css: ['/public/jquery/fancytree1/esg_all/src/skin-xp/ui.fancytree.css'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.glyph.js']
            },
            gridnav: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.gridnav.js']
            },
            menu: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.menu.js']
            },
            persist: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.persist.js']
            },
            table: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.table.js']
            },
            themeroller: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.themeroller.js']
            },
            wide: {
                dependency: ['EIIS.Common.jQuery.fancytree1'],
                js: ['/public/jquery/fancytree1/esg_all/src/jquery.fancytree.wide.js']
            }
        },
        */
        select240: {
            load: function () {
                require.config({
                    paths: {
                        "jquery.select240": ["/public/controls/select2/js/select2","/public/controls/select2/js/i18n/zh-CN"]
                    },
                    map: {
                        '*': {
                            'css': '/public/utilities/require/css.min.js'
                        }
                    },
                    shim : {
                        "jquery.select240": ['css!/public/controls/select2/css/select2.css']
                    }
                });
            }
        },
        intro: {
            load: function () {
                require.config({
                    paths: {
                        "jquery.introJs": ["/public/controls/intro/intro"]
                    },
                    map: {
                        '*': {
                            'css': '/public/utilities/require/css.min.js'
                        }
                    },
                    shim : {
                        "jquery.introJs": ['css!/public/controls/intro/introjs.min.css']
                    }
                });
            }
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
        css: ['/public/bootstrap/css/bootstrap.min.css'],
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
        //人员树形
        mobpersontree:{
            css: ['/public/controls/getPersonTree/css/pinyin.css'],
            js: ['/public/controls/getPersonTree/js2/jquery.charfirst.pinyin.js',
            '/public/controls/getPersonTree/js2/sort.js',
            '/public/controls/getPersonTree/js2/jqm-tree.js',
            '/public/controls/getPersonTree/js2/persontree.js']
        },
        //滑动加载
        moveload:{
            css:['/public/controls/moveload/css/scrollbar.css'],
            js:[ '/public/controls/moveload/js/iscroll.js',
                '/public/controls/searchDic/js/loading.js',
                '/public/controls/moveload/js/moveload.js']
        },
        //多选字典(内含滑动加载，要和滑动加载一起引用)
        searchdic:{
            css:["/public/controls/searchDic/css/searchdic.css"],
            js:["/public/controls/searchDic/js/loading.js",
                "/public/controls/searchDic/js/searchdic.js",
                "/public/controls/getPersonTree/js2/jquery.charfirst.pinyin.js"]
        },
        modal: { //第三方对话框
            css: ['/public/controls/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                '/public/controls/bootstrap-modal/css/bootstrap-modal.css',
                '/public/controls/bootstrap-modal/css/bootstrap-modal.expand.css'],
            js: ['/public/controls/bootstrap-modal/js/bootstrap-modalmanager.js',
                '/public/controls/bootstrap-modal/js/bootstrap-modal.js',
                '/public/controls/bootstrap-modal/js/bootstrap-modal.expand.js']
        },
        /*modal: { //原生对话框的扩展
         css: ['/public/controls/modal/modal.css'],
         js: ['/public/controls/modal/modal.js']
         },*/
        signature: {
            js: ['/public/controls/signature/signature.js']
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
        },
        bswitch: {
            css: ['/public/controls/bootstrap-switch/css/bootstrap-switch.css',
                '/public/controls/bootstrap-switch/css/highlight.css'],
            js: ['/public/controls/bootstrap-switch/js/bootstrap-switch.js',
                '/public/jquery/jquery.highlight.js']
        },
        bselect: {
            css: ['/public/controls/bootstrap-select/bootstrap-select.min.css'],
            js: ['/public/controls/bootstrap-select/bootstrap-select.min.js']
        },
        three: {
            css: [
                '/public/controls/three/css/dxf_3d.css'
            ],
            js: [
                '/public/controls/three/js/OrbitControls.js',
                '/public/controls/three/js/CanvasRenderer.js',
                '/public/controls/three/js/dxf_3d.js'
            ]
        }
    };

    EIIS.Common.controls = {
        icons: {
            js: ['/public/controls/selector/icons/selector.icons.js']
        },
        member: {
            dependency: [
                "EIIS.Common.bootstrap.modal",
                'EIIS.Common.jQuery.fancytree',
                'EIIS.Common.controls.tagsinput',
                'EIIS.Common.controls.pickMember',
                'EIIS.Common.controls.materialPickMember'
            ],
            js: ['/public/controls/selector/member/selector.member.js']
        },
        materialPickMember: {
            js: ['/app/statementmoney/meterial/selector/selector.pickMember.js']
        },
        docmember: {
            dependency: [
                "EIIS.Common.bootstrap.modal",
                'EIIS.Common.jQuery.fancytree',
                'EIIS.Common.controls.tagsinput'
            ],
            js: ['/public/controls/selector/member/selector.docmember.js']
        },
        dialog: {
            dependency: [
                "EIIS.Common.bootstrap.modal",
                "EIIS.Common.bootstrap.table",
                "EIIS.Common.jQuery.fancytree.glyph",
                "EIIS.Common.jQuery.fancytree.clones",
                "EIIS.Common.controls.tagsinput"
            ],
            js: ['/public/controls/dialog/dialog.js']
        },
        businessView:{
            dependency:[
                "EIIS.Common.controls.pickMember"
            ],
            js:['/public/controls/businessView/businessView.js'],
            css:['/public/controls/businessView/businessView.css','/public/jquery-easyui/themes/default/easyui.css']
        },
        dialoghaspagecount: {
            dependency: [
                "EIIS.Common.bootstrap.modal",
                "EIIS.Common.bootstrap.table",
                "EIIS.Common.jQuery.fancytree.glyph",
                "EIIS.Common.jQuery.fancytree.clones",
                "EIIS.Common.controls.tagsinput"
            ],
            js: ['/public/controls/dialoghaspagecount/dialog.js','/public/controls/dialoghaspagecount/page.js']
        },
        tagsinput: {
            css: ['/public/controls/tagsinput/tagsinput.css'],
            js: ['/public/controls/tagsinput/tagsinput.js']
        },
        fix: {
            css: ['/public/controls/fix/fix.css'],
            js: ['/public/controls/fix/fix.js']
        },
        document: {
            dependency: [
                'EIIS.Common.jQuery.message',
                'EIIS.Common.controls.gallery'
            ],
            css: ['/public/controls/document/document.css'],
            js: ['/public/controls/document/document.js'],
            plugins: {
                all: {
                    dependency: [
                        'EIIS.Common.controls.document',
                        'EIIS.Common.controls.document.plugins.readbyhtml'
                    ]
                },
                readbyhtml: {
                    dependency: [
                        'EIIS.Common.controls.document'
                    ],
                    js: ['/public/controls/document/document.plugin.readbyhtml.js']
                }
            },
            upload: {
                dependency: [
                    'EIIS.Common.controls.document'
                ],
                css: ['/public/controls/document/document.upload.css'],
                js: ['/public/controls/document/document.upload.js?v=1.1']
            }
        },
        pickMember : {
            css : ['/public/controls/selector/pickMember/pickMember.css'],
            js : ['/public/controls/selector/pickMember/pickMember.js']
        },
        gallery : {
            css : ['/public/mobileImgSupport/css/gallery.css'],
            js : ['/public/mobileImgSupport/js/gallery.js']
        },
        treeSelect : {
            dependency: [
                'EIIS.Common.controls.custom'
            ],
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


window.addEventListener('message',function(e){
    var data = e.data;
    if (data.code == 'esgWeb_function') {
        try {
            var fname = eval(data.fname);
            if (typeof fname === 'function') {
                fname.call(this, data.param);
            }
        } catch (e) {
            console.log("esgWeb_function:["+data.fname+"]"+JSON.stringify(e));
        }
    }
},false);
