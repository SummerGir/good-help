
$().ready(function () {
    $(':text.webui.time:not(.date)').livequery(function () {
        var $this = $(this);
        if ($this && $this.time) {
            $this.time();
            if ($this.prop("disabled")) {
                $this.date("disable");
            }
            this._hookProp = new $.hook('prop', function () {
                    if ($this.context == this[0]) {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.date("disable");
                                }
                                else {
                                    $this.date("enable");
                                }
                            }
                        }
                    }
                }
            ).on();
            $this.attr("webuiReadyState", "complete");
        }
    }, function () {
        var $this = $(this);
        if ($this) {
            this._hookProp.off();
        }
    });
});