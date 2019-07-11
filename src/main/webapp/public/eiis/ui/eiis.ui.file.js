(function ($, undefined) {
    EIIS.UI.register("file", {
        _jqElement: null,
        _jqDocument: null,
        _form: null,
        _formSubmit: null,
        _formOnSubmit: null,
        _bindForm: function () {
            var self = this;
            if (self._jqElement.form) {
                self._form = self._jqElement.form;
                self._formSubmit = self._form.submit;
                self._form.submit = function () {
                    if (!self._jqDocument.document("isBusy")) {
                        self._formSubmit.call(self._form);
                    }
                };
                self._formOnSubmit = Function.createDelegate(self, function () {
                    return !self._jqDocument.document("isBusy");
                });
                $(self._form).on("submit", self._formOnSubmit);
            }
        },
        handler: function () {
            var result = this._jqDocument.document.apply(this._jqDocument, arguments);
            if (result != undefined) {
                return result;
            }
        },
        create: function () {
            var self = this;
            self._jqElement = $(self.element);

            var exts = [];
            if (!String.isNullOrEmpty(self._jqElement.attr("data-extname"))) {
                exts = self._jqElement.attr("data-extname").split(',');
            }

            //取得文件列表
            var value = $.trim(self._jqElement.val());
            var fileArray = [];
            if (value != "") {
                fileArray = value.split("|");
            }

            self._jqDocument = $("<div/>");
            self._jqElement.after(self._jqDocument)
                .hide();

            self._jqDocument.on("valid.after.document cancel.after.document edit.after.document",
                function (e, eventData) {
                    var valid = self._jqDocument.document("getUrls", $.fn.document.status.VALID),
                        unvalid = self._jqDocument.document("getUrls", $.fn.document.status.CANCEL);
                    if (unvalid.length == 0) {
                        self._jqElement.val(valid.join("|"));
                    } else {
                        self._jqElement.val(valid.join("|") + ":" + unvalid.join(":"));
                    }
                }
            );

            self._jqDocument.on("created.document",function(){
                self._jqDocument.document("put", fileArray);
            });
            self._jqDocument.document({
                canUpload: Boolean.parse(self._jqElement.attr("data-upload")?self._jqElement.attr("data-upload"):true),
                canNew: Boolean.parse(self._jqElement.attr("data-new")?self._jqElement.attr("data-new"):true),
                canEdit: Boolean.parse(self._jqElement.attr("data-editable")),
                canRename: true,
                canCancel: Boolean.parse(self._jqElement.attr("data-cancel")?self._jqElement.attr("data-cancel"):true),
                infoExtend: Boolean.parse(self._jqElement.attr("data-extend")?self._jqElement.attr("data-extend"):false),
                canRead: true,
                canDownload: true,
                multiple: self._jqElement.attr('data-multiple') ? Boolean.parse(self._jqElement.attr('data-multiple')) : true,
                allowedExtensions: exts
            });

            self._bindForm();
        },
        destroy: function () {

            if (this._form != null) {
                this._form.submit = this._formSubmit;
                $(this._form).off("submit", this._formOnSubmit);
            }

            this._jqDocument.remove();
            this._jqElement.show();
        },
        isDisabled: function () {
            return this._jqDocument.prop("disabled");
        },
        setDisabled: function (value) {
            this._jqDocument.prop("disabled", value);
        },
        hide: function () {
            this._jqDocument.hide();
        },
        show: function () {
            this._jqDocument.show();
        }
    });
})(jQuery);