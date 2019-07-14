$().ready(function() {
    $(':text.webui.text').livequery(function() {
        var $this = $(this);
        if ($this && $this.input) {
            if($this.input){
                $this.input();

                if ($this.prop("disabled")) {
                    $this.input("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.input("disable");
                                }
                                else {
                                    $this.input("enable");
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