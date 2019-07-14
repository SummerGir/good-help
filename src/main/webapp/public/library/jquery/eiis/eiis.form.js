(function ($, undefined) {
    $.widget("eiis.form", {
        widget: function () {
            return this.element;
        },
        update: function (jsonData) {
            for (var key in jsonData) {
                var obj = $("#" + key, this.element);
                if (obj.is(":input")) {
                    obj.val(jsonData[key]);
                } else if (obj.is("div,span")) {
                    obj.text(jsonData[key]);
                }
            }
        },
        clear: function () {

        },
        setReadOnly: function (readOnly) {

        }
    });
})(jQuery);