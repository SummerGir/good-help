$().ready(function () {
    $(':text.webui.member').livequery(function () {
        var $this = $(this);
        if ($this && $this.member) {
            $this.member({
                multiple: $this.attr('data-multiple') ? Boolean.parse($this.attr('data-multiple')) : true,
                root: $this.attr('data-id') ? $this.attr('data-id') : '',
                freeze: $this.attr("data-freeze") ? Boolean.parse($this.attr("data-freeze")) : false,
                dept: $this.attr("data-dept") ? Boolean.parse($this.attr('data-dept')) : true,
                post: $this.attr("data-post") ? Boolean.parse($this.attr('data-post')) : true,
                person: $this.attr("data-person") ? Boolean.parse($this.attr('data-person')) : true,
                //attr: $this.attr("data-attr") ? $this.attr('data-attr') : 'true',
                attrCode: $this.attr("data-attr-code") ? $this.attr('data-attr-code') : '',
                attrValue: $this.attr("data-attr-value") ? $this.attr('data-attr-value') : '',
                selectRoot: $this.attr("data-select-root") ? Boolean.parse($this.attr('data-select-root')) : true,
                values: $this.val() ? $this.val().split(";") : [],
                ok: function (values, formatValue) {
                    $this.trigger("ok", [values, formatValue]);
                },
                cancel: function () {
                    $this.trigger("cancel");
                }
            });
            if ($this.prop("disabled")) {
                $this.member("disable");
            }
            this._hookProp = new $.hook('prop', function () {
                    if (arguments.length == 2) {
                        if (arguments[0].toLowerCase() == "disabled") {
                            if (Boolean.parse(arguments[1])) {
                                $this.member("disable");
                            }
                            else {
                                $this.member("enable");
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
            //$this.member('destroy');
            //$this._hookProp.off();
            this._hookProp.off();
        }
    });
})
;