(function ($, undefined) {
    EIIS.UI.register("button", {
        _jqElement: null,
        create: function () {
            this._jqElement = $(this.element);
            var btnClass = "btn";
            var iconClass = "";
            switch (this._jqElement.attr("data-type")) {
                case "delete":
                    btnClass += " btn-warning";
                    iconClass = "fa fa-trash-o";
                    break;
                case "submit":
                    btnClass += " btn-primary";
                    iconClass = "fa fa-check";
                    break;
                case "reset":
                    btnClass += " btn-default";
                    iconClass = "fa fa-eraser";
                    break;
                case "cancel":
                    btnClass += " btn-default";
                    iconClass = "fa fa-power-off";
                    break;
                case "add":
                    btnClass += " btn-success";
                    iconClass = "fa fa-plus";
                    break;
                case "copy":
                    btnClass += " btn-success";
                    iconClass = "fa fa-files-o";
                    break;
                case "edit":
                    btnClass += " btn-success";
                    iconClass = "fa fa-pencil-square-o";
                    break;
                case "save":
                    btnClass += " btn-primary";
                    iconClass = "fa fa-floppy-o";
                    break;
                case "search":
                    btnClass += " btn-info";
                    iconClass = "fa fa-search";
                    break;
            }

            this._jqElement.addClass(btnClass);
            if (!String.isNullOrWhiteSpace(iconClass)) {
                var jqI = this._jqElement.children("i");
                if (jqI.length == 0) {
                    jqI = $("<i/>").prependTo(this._jqElement);
                    jqI.after("&nbsp;");
                }
                jqI.addClass(iconClass);
            }
        }
    });
})(jQuery);