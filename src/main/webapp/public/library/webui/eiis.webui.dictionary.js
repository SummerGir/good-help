
$().ready(function () {
    $(':text.webui.dictionary').livequery(function () {
        var $this = $(this);
        if ($this) {
            if($this.dictionary){
                $this.dictionary({
                    multiple: Boolean.parse($this.attr("data-multiple")),
                    code: $this.attr('data-code') ? $this.attr('data-code') : '',
                    childOnly: $this.attr('data-childonly') ? Boolean.parse($this.attr('data-childonly')) : true,
                    typeOnly:  $this.attr('data-typeonly') ? Boolean.parse($this.attr('data-typeonly')) : false,
                    valueMode: $this.attr('data-valuemode') ? Boolean.parse($this.attr('data-valuemode')) : true,
                    ok:function(values,formatValues){
                        $this.trigger("ok",[values,formatValues])
                    },
                    cancel:function(){
                        $this.trigger("cancel");
                    }
                });

                if ($this.prop("disabled")) {
                    $this.dictionary("disable");
                }
                this._hookProp = new $.hook('prop', function () {
                        if (arguments.length == 2) {
                            if (arguments[0].toLowerCase() == "disabled") {
                                if (Boolean.parse(arguments[1])) {
                                    $this.dictionary("disable");
                                }
                                else {
                                    $this.dictionary("enable");
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