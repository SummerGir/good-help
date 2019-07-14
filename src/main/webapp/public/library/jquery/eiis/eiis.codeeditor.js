(function ($, undefined) {
    $.widget('eiis.codeeditor', {
        options: {
            theme: 'chrome',
            mode: 'jsp',
            fontSize: null
        },
        _editor: null,
        _editorAce: null,
        _originValue: "",
        _originHide: false,
        _customStyleName: "",
        _isAce: jQuery.support.style,
        _setOption: function (key, value) {
            var self = this;
            if (self._isAce) {
                self._setOptionAce(key, value);
            } else {
                self._setOptionTextarea(key, value);
            }
            self._super(key, value);
        },
        _setOptionTextarea: function (key, value) {
            var self = this;
            if ('disabled'.endsWithIgnoreCase(key)) {
                self._editor.prop("disabled", value);
            } else if ("hide".equalsIgnoreCase(key)) {
                if (value) {
                    self._editor.hide();
                } else {
                    self._editor.show();
                }
            } else if ("fontSize".endsWithIgnoreCase(key)) {
                self._editor.css("fontSize", "");
                if (!String.isNullOrWhiteSpace(value)) {
                    if (value.toString().isNumber()) {
                        self._editor.css("fontSize", value + "px");
                    }
                }
            } else if ("height".endsWithIgnoreCase(key)
                || "width".endsWithIgnoreCase(key)) {
                self._editor.css(key, value);
            }

        },
        _setOptionAce: function (key, value) {
            var self = this;
            if ('theme'.endsWithIgnoreCase(key)) {
                self._editorAce.setTheme("ace/theme/" + value);
            } else if ('mode'.endsWithIgnoreCase(key)) {
                self._editorAce.getSession().setMode("ace/mode/" + value);
            } else if ('disabled'.endsWithIgnoreCase(key)) {
                self._editorAce.setReadOnly(value);
            } else if ("hide".equalsIgnoreCase(key)) {
                if (value) {
                    self._editor.hide();
                } else {
                    self._editor.show();
                }
            } else if ("fontSize".endsWithIgnoreCase(key)) {
                $("#" + self._customStyleName).remove();
                if (!String.isNullOrWhiteSpace(value)) {
                    if (value.toString().isNumber()) {
                        var styleSB = new StringBuilder();
                        styleSB.append(".");
                        styleSB.append(self._customStyleName);
                        styleSB.append(" div, .");
                        styleSB.append(self._customStyleName);
                        styleSB.appendLine(" span {");
                        styleSB.append("    font-size: ");
                        styleSB.append(value);
                        styleSB.appendLine("px;");
                        styleSB.appendLine("}");
                        $("<style />").attr({
                            "type": "text/css",
                            "id": self._customStyleName
                        }).appendTo($("head"))
                            .text(styleSB.toString());
                    }
                }
            } else if ("height".endsWithIgnoreCase(key)
                || "width".endsWithIgnoreCase(key)) {
                self._editor.css(key, value);
                self._editorAce.resize(true);
            }

        },
        _create: function () {
            var self = this;
            if (self._isAce) {
                self._createAce();
            } else {
                self._createTextarea();
            }
            self._super();
        },
        _createTextarea: function () {
            var self = this;
            self._editor = $("<textarea />").width(self.element.width())
                .height(self.element.height());
            self._originHide = self.element.is(":hidden");
            if (!self._originHide) {
                self.element.hide();
            }
            self.element.after(self._editor);
            if (self.element.is(":input")) {
                self._originValue = self.element.val();
            } else {
                self._originValue = self.element.text();
            }
            self._editor.val(self._originValue);
            self._editor.on("blur", Function.createDelegate(self, self._updateValue));
        },
        _createAce: function () {
            var self = this;
            self._editor = $("<div />").width(self.element.width())
                .height(self.element.height());
            self._originHide = self.element.is(":hidden");
            if (!self._originHide) {
                self.element.hide();
            }
            self.element.after(self._editor);
            if (self.element.is(":input")) {
                self._originValue = self.element.val();
            } else {
                self._originValue = self.element.text();
            }
            self._editorAce = ace.edit(self._editor[0]);
            self._editorAce.setValue(self._originValue, -1);
            self._editorAce.on("blur", Function.createDelegate(self, self._updateValue));

            self._editorAce.setShowInvisibles(true);
            //self._editorAce.setDisplayIndentGuides(true);
            self._editorAce.getSession().setFoldStyle("markbeginend");

            self._customStyleName = "ace_custom_style_" + Math.floor(Math.random() * 1000 + 1);
            self._editor.addClass(self._customStyleName);
            for (var key in self.options) {
                self._setOption(key, self.options[key]);
            }
        },
        _updateValue: function () {
            var self = this;
            var value = "";
            if (self._isAce) {
                value = self._editorAce.getValue();
            } else {
                value = self._editor.val();
            }
            if (self.element.is(":input")) {
                self.element.val(value);
            } else {
                self.element.text(value);
            }
        },
        value: function () {
            var self = this;
            if (arguments.length == 0) {
                self._updateValue();
                if (self.element.is(":input")) {
                    return self.element.val();
                }
                return self.element.text();
            }
            if (self._isAce) {
                self._editorAce.setValue(arguments[0], -1);
            } else {
                self._editor.val(arguments[0]);
            }
            self._updateValue();
        },
        show: function () {
            this._setOption("hide", false);
        },
        hide: function () {
            this._setOption("hide", true);
        },
        widget: function () {
            return this._editor;
        },
        _destroyAce: function () {
            this._editorAce.destroy();
            this._editor.remove();
            if (!this._originHide) {
                this.element.show();
            }
        },
        _destroyTextarea: function () {
            this._editor.remove();
            if (!this._originHide) {
                this.element.show();
            }
        },
        _destroy: function () {
            if (this._isAce) {
                this._destroyAce();
            } else {
                this._destroyTextarea();
            }
            this._super();
        }
    });
})(jQuery);