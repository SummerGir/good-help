(function ($, undefined) {
    EIIS.UI.register("date", {
        _jqElement: null,
        create: function () {
            this._jqElement = $(this.element);
            this._jqElement.addClass("form-control").datetimepicker({
                format: 'yyyy-mm-dd',
                todayBtn: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                startDate: this._jqElement.attr("data-startDate"),
                endDate: this._jqElement.attr("data-endDate")
            });
            this._jqElement.attr("readonly","readonly").css("background-color","#ffffff");
            if(this._jqElement.attr("disabled"))this._jqElement.css("background-color","#eee");
            if(this._jqElement.attr("required")){
                this._jqElement.attr("placeholder",this._jqElement.attr("placeholder")?this._jqElement.attr("placeholder"):"必填");
            }
        }
    });
})(jQuery);
