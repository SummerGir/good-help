(function (mod) {
    if (typeof define == "function" && define.amd) // AMD
        define(["codeeditor/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {


    //代码模块
    var codeMode = {};
    codeMode["jsp"] = {
        mode: "application/x-jsp",
        js: [
            "codeeditor/mode/clike/clike",
            "codeeditor/mode/xml/xml",
            "codeeditor/mode/javascript/javascript",
            "codeeditor/mode/css/css",
            "codeeditor/mode/htmlmixed/htmlmixed",
            "codeeditor/mode/htmlembedded/htmlembedded"]
    };

    //获得 ID
    var createStyleID = function () {
        return 'codeeditor-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    EIIS.Common.loadComponent(EIIS.Common.UI, function () {

        EIIS.UI.addControl({
            selector: "textarea.eiis-codeeditor",
            _jqElement: null,
            _editor: null,
            _styleId: null,
            _changeUpdate: false,
            create: function () {
                var self = this;
                self._jqElement = $(self.element);

                var mode = self._jqElement.attr("data-mode");
                if (String.isNullOrWhiteSpace(mode)) {
                    mode = "jsp";
                }
                var style = self._jqElement.attr("style");
                if (String.isNullOrWhiteSpace(style)) {
                    style = "width: " + self._jqElement.width() + "px;height: " + self._jqElement.height() + "px";
                }
                self._styleId = createStyleID();

                $("<style>." + self._styleId + "{" + style + "}</style>").attr({
                    "type": "text/css",
                    "id": self._styleId
                }).insertAfter(self._jqElement);

                /*require([
                 "codemirror"
                 ], function (CodeMirror) {*/


                //});
                //EIIS.Common.loadComponent(codeMode[mode], function () {
                //require(['codemirror'], function (CodeMirror) {

                var css = [];
                var rjs = [];

                //主程序
                css.push("/public/controls/codeeditor/codeeditor.css");
                css.push("/public/controls/codeeditor/codemirror/lib/codemirror.css");

                //代码折叠
                css.push("/public/controls/codeeditor/codemirror/addon/fold/foldgutter.css");
                rjs.push("codeeditor/addon/fold/foldcode");
                rjs.push("codeeditor/addon/fold/foldgutter");
                rjs.push("codeeditor/addon/fold/brace-fold");
                rjs.push("codeeditor/addon/fold/xml-fold");
                rjs.push("codeeditor/addon/fold/markdown-fold");
                rjs.push("codeeditor/addon/fold/comment-fold");

                //加亮当前行
                rjs.push("codeeditor/addon/selection/active-line");

                //编辑增强
                rjs.push("codeeditor/addon/edit/matchbrackets");//高亮显示当前的开始结束 符号
                rjs.push("codeeditor/addon/edit/matchtags");//高亮显示当前的开始结束 标签
                rjs.push("codeeditor/addon/edit/closebrackets");//自动输入关闭 符号
                //rjs.push("codeeditor/addon/edit/continuelist");//自动插入前导空格
                rjs.push("codeeditor/addon/edit/closetag");//自动输入关闭 标签

                rjs.addRange(codeMode[mode].js);

                EIIS.Common.loadComponent({
                    css: css
                });

                require(rjs, function () {

                    self._editor = CodeMirror.fromTextArea(self.element, {
                        lineNumbers: true,
                        mode: codeMode[mode].mode,
                        indentUnit: 4,
                        //lineWrapping: true,//代码换行
                        indentWithTabs: true,
                        styleActiveLine: true,
                        matchBrackets: true,
                        matchTags: {bothTags: true},
                        autoCloseBrackets: true,
                        autoCloseTags: true,
                        foldGutter: true,
                        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                    });
                    self._editor.on("change", function () {
                        self._changeUpdate = true;
                        self._jqElement.val(self._editor.getValue());
                        self._changeUpdate = false;
                    });
                    $(self._editor.getWrapperElement()).addClass(self._styleId);
                    self._editor.refresh();
                });
                //cm.setSize(width: number|string, height: number|string)
            },
            destroy: function () {
                var self = this;
                $(self._editor.getWrapperElement()).remove();
                $("#" + self._styleId).remove();
                self._jqElement.show();
            },
            isDisabled: function () {
                var self = this;
                return self._editor.getOption("readOnly");
            },
            setDisabled: function (value) {
                var self = this;
                return self._editor.setOption("readOnly", value);
            },
            hide: function () {
                $(this._editor.getWrapperElement()).hide();
            },
            show: function () {
                $(this._editor.getWrapperElement()).show();
            },
            getValue: function () {
                var self = this;
                self._changeUpdate = true;
                self._jqElement.val(self._editor.getValue());
                self._changeUpdate = false;
                return this._jqElement.val();
            },
            setValue: function (value) {
                var self = this;
                if (!self._changeUpdate) {
                    self._editor.setValue(value);
                }
                self._jqElement.val(value);
            }
        });

    });


});
