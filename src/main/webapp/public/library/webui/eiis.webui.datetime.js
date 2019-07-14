
$().ready(function() {
    $(':text.webui.date.time').livequery(function() {
        var $this = $(this);
        if ($this) {
            if($this.datetime){
                $this.datetime();
                if ($this.prop("disabled")) {
                    $this.datetime("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.datetime("disable");
                                }
                                else {
                                    $this.datetime("enable");
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