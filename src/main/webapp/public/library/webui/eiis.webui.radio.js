$().ready(function() {
    $('.webui.radio').livequery(function() {
        var $this = $(this);
        var option = {};
        if ($this && $this.radio) {
            option.name = $this.attr("data-name") ? $this.attr("data-name") : undefined;
            var data = $this.attr("data-source") ? $.parseJSON($this.attr("data-source")) : null;
            option.source = data;
            option.url = $this.attr("data-url") ? $this.attr("data-url") : undefined;
            option.code = $this.attr("data-code") ? $this.attr("data-code") : undefined;
            option.checkedValue = $this.attr("data-value") ? $this.attr("data-value").split(",") : null;
        	$this.radio(option);

            if ($this.prop("disabled")) {
                $this.radio("disable");
            }
            this._hookProp = new $.hook('prop', function () {
                    if (arguments.length == 2) {
                        if (arguments[0].toLowerCase() == "disabled") {
                            if (Boolean.parse(arguments[1])) {
                                $this.radio("disable");
                            }
                            else {
                                $this.radio("enable");
                            }
                        }
                    }
                },this
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