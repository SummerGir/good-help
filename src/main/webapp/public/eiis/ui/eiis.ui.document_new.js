//$().ready(function () {
(function ($, undefined) {
    EIIS.UI.register("document_new", {
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
        widget: function () {
            return this._jqDocument;
        },
        create: function () {
            var self = this;
            self._jqElement = $(self.element);


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
                        self._jqElement.val(valid.join("|") + ":" + unvalid.join("|"));
                    }
                }
            );

            self._jqDocument.on("created.document", function () {
                self._jqDocument.document("put", fileArray);
            });

            self._jqDocument.document({
                canUpload: String.isNullOrWhiteSpace(self._jqElement.attr("data-upload"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-upload")),
                canNew: String.isNullOrWhiteSpace(self._jqElement.attr("data-new"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-new")),
                canEdit: String.isNullOrWhiteSpace(self._jqElement.attr("data-edit"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-edit")),
                canRename: String.isNullOrWhiteSpace(self._jqElement.attr("data-rename"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-rename")),
                canCancel: String.isNullOrWhiteSpace(self._jqElement.attr("data-cancel"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-cancel")),
                canRead: String.isNullOrWhiteSpace(self._jqElement.attr("data-read"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-read")),
                canDownload: String.isNullOrWhiteSpace(self._jqElement.attr("data-download"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-download")),
                multiple: String.isNullOrWhiteSpace(self._jqElement.attr("data-multiple"))
                    ? true
                    : Boolean.parse(self._jqElement.attr("data-multiple")),
                infoExtend: String.isNullOrWhiteSpace(self._jqElement.attr("data-extend"))
                    ? false
                    : Boolean.parse(self._jqElement.attr("data-extend")),
                plugins: String.isNullOrWhiteSpace(self._jqElement.attr("data-plugins"))
                    ? "all"
                    : self._jqElement.attr("data-plugins").split(','),
                allowedExtensions: String.isNullOrWhiteSpace(self._jqElement.attr("data-extension"))
                    ? null
                    : self._jqElement.attr("data-extension").split(',')
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
//});
})(jQuery);