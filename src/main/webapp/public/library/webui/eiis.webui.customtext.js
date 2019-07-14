
$().ready(function () {
    $(':text.webui.customtext').livequery(function () {
        var $this = $(this);
        if ($this) {
        	if($this.customtext){
                var options = {
                    valueType:"array".equalsIgnoreCase($this.attr("data-type")) ? "array" : "string",
                    click:function(){
                        return $this.triggerHandler("custclick");
                    },
                    format:function(value){
                        return $this.triggerHandler("format",[value]);
                    }
                };
                $this.customtext(options);

                if ($this.prop("disabled")) {
                    $this.customtext("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.customtext("disable");
                                }
                                else {
                                    $this.customtext("enable");
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