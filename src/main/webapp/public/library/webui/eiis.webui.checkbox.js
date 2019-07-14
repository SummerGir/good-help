$().ready(function() {
    $('.webui.checkbox').livequery(function() {
        var $this = $(this);
        var option = {};
        if ($this) {
            if($this.checkbox){
                option.name = $this.attr("data-name") ? $this.attr("data-name") : undefined;
                var data = $this.attr("data-source") ? $.parseJSON($this.attr("data-source")) : null;
                option.source = data;
                option.url = $this.attr("data-url") ? $this.attr("data-url") : undefined;
                option.code = $this.attr("data-code") ? $this.attr("data-code") : undefined;
                option.checkedValue = $this.attr("data-value") ? $this.attr("data-value").split(",") : null;
                $this.checkbox(option);

                if ($this.prop("disabled")) {
                    $this.checkbox("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.checkbox("disable");
                                }
                                else {
                                    $this.checkbox("enable");
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