//$().ready(function () {
(function ($, undefined) {
    EIIS.UI.register("text", {
        _jqElement: null,
        create: function () {
            this._jqElement = $(this.element);
            this._jqElement.addClass("form-control");
        },
        destroy: function () {
            this._jqElement.removeClass("form-control");
        }
        /*, getValue: function () {
         return this._jqElement.val() + "-get";
         },
         setValue: function (value) {
         this._jqElement.val(value + "-set");
         }
         ,isDisabled: function ($this) {
         return $this.prop("disabled");
         },
         setDisabled: function ($this, value) {
         $this.prop("disabled", value);
         }*/
    });
//});
})(jQuery);