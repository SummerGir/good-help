(function ($, undefined) {
    var _isAce = jQuery.support.style;
    if (_isAce == true) {
        EIIS.Common.loadJavaScript("/public/controls/codeeditor/ace/ace.js");
    }

    var _options = {
        theme: 'chrome',
        mode: 'jsp',
        fontSize: null
    };

    EIIS.Common.loadComponent(EIIS.Common.UI, function () {

        EIIS.UI.addControl({
            selector: "textarea.eiis-codeeditor",
            _jqElement: null,
            _options: null,
            _editor: null,
            _editorAce: null,
            _originHide: null,
            _changeUpdate: false,
            create: function () {
                var self = this;
                self._jqElement = $(self.element);

                self._options = $.extend(true, {}, _options);

                var value = self._jqElement.attr("data-theme");
                if (!String.isNullOrWhiteSpace(value)) {
                    self._options.theme = value;
                }
                value = self._jqElement.attr("data-mode");
                if (!String.isNullOrWhiteSpace(value)) {
                    self._options.mode = value;
                }
                value = self._jqElement.css("fontSize");
                if (!String.isNullOrWhiteSpace(value)) {
                    self._options.fontSize = parseFloat(value);
                }

                if (_isAce) {
                    self._createAce();
                } else {
                    self._createTextarea();
                }

            },
            _createTextarea: function () {
                var self = this;
                self._editor = self._jqElement;
            },
            _createAce: function () {
                var self = this;
                //self._editor = $("<pre />").width(self._jqElement.width())
                //    .height(self._jqElement.height());
                self._editor = $("<pre />").css({
                    width: self._jqElement.css("width"),
                    height: self._jqElement.css("height")});
                self._originHide = self._jqElement.is(":hidden");
                //if (!self._originHide) {
                self._jqElement.hide();
                //}
                self._jqElement.after(self._editor);

                self._editorAce = ace.edit(self._editor[0]);
                self._editorAce.setValue(self._jqElement.val(), -1);
                self._editorAce.on("change", function () {
                    self._changeUpdate = true;
                    self._jqElement.val(self._editorAce.getValue());
                    self._changeUpdate = false;
                });

                self._editorAce.setShowInvisibles(true);//显示行号
                //self._editorAce.setDisplayIndentGuides(true);//显示缩进
                self._editorAce.getSession().setFoldStyle("markbeginend");
                //self._editorAce.setFadeFoldWidgets();
                //self._editorAce.setShowFoldWidgets(true);//显示折叠

                //self._editorAce.setHighlightActiveLine(true);//高亮显示当前行

                self._editorAce.setTheme("ace/theme/" + self._options.theme);

                self._editorAce.getSession().setMode("ace/mode/" + self._options.mode);

                if (!String.isNullOrWhiteSpace(self._options.fontSize)) {
                    self._editorAce.setFontSize(self._options.fontSize);
                }


            },
            destroy: function () {
                var self = this;
                if (_isAce) {
                    self._editorAce.destroy();
                    self._editor.remove();
                    if (!this._originHide) {
                        self._jqElement.show();
                    }
                }
            },
            isDisabled: function () {
                var self = this;
                if (_isAce) {
                    return  self._editorAce.getReadOnly();
                } else {
                    return self._jqElement.prop("disabled");
                }
            },
            setDisabled: function (value) {
                var self = this;
                if (_isAce) {
                    self._editorAce.setReadOnly(value);
                } else {
                    self._jqElement.prop("disabled", value);
                }
            },
            hide: function () {
                this._editor.hide();
            },
            show: function () {
                this._editor.show();
            },
            getValue: function () {
                var self = this;
                if (_isAce) {
                    self._changeUpdate = true;
                    self._jqElement.val(self._editorAce.getValue());
                    self._changeUpdate = false;
                }
                return this._jqElement.val();
            },
            setValue: function (value) {
                var self = this;
                if (_isAce && !self._changeUpdate) {
                    self._editorAce.setValue(value, -1);
                }
                self._jqElement.val(value);
            }
        });

    });


})(jQuery);