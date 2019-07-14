
$().ready(function () {
    $(':text.webui.date:not(.time)').livequery(function () {
        var $this = $(this);
        if ($this) {
            if($this.date){
                $this.date();
                if ($this.prop("disabled")) {
                    $this.date("disable");
                }
                this._hookProp = new $.hook('prop', function () {
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
                    },this
                ).on();
                $this.attr("webuiReadyState", "complete");
            }
        }
    }, function () {
        var $this = $(this);
        if ($this) {
            this._hookProp.off();
        }
    });
});