$().ready(function () {
    $('select.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            if($this.combobox){
                var option = {
                    datasource: $this.attr("data-source") ? $this.attr("data-source") : undefined,
                    input: $this.attr("data-input") ? Boolean.parse($this.attr("data-input")) : false,
                    multiple: $this.prop("multiple") ? true : false,
                    selected:$this.attr("data-value") ? $this.attr("data-value") : null
                };
                $this.combobox(option);

                if ($this.prop("disabled")) {
                    $this.combobox("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.combobox("disable");
                                }
                                else {
                                    $this.combobox("enable");
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