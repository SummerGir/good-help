(function ($, undefined) {

    $.widget("eiis.customtext", {
        options: {
            hide:false,
            valueType: "string",
            //callback
            click: null,
            format: null
        },
        _hookValue: null,
        _wrap: null,
        _button: null,
        _display:null,
        _setOption: function (key, value) {
            if(key.equalsIgnoreCase("hide")){
                if(value){
                    this._wrap.hide();
                }else{
                    this._wrap.show();
                }
            }
            if(key.equalsIgnoreCase("disabled")){
                if(value){
                    this._display.attr("disabled",true);
                    this._button.button("disable");
                }else{
                    this._display.attr("disabled",false);
                    this._button.button("enable");
                }
            }

            this._super(key, value);
        },
        _create: function () {
            var self = this;
            if (self.options.valueType == "string") {
                 self._drawByString();
            } else if (self.options.valueType == "array") {
                 self._drawByArray();
            }
            self._display.width(self._wrap.width() - self._button.outerWidth(true) - 8);
            self._hookValue = new $.hook('val', function () {
                    if (arguments.length > 0) {
                        if (self.element.data('value') != self.element.val()) {
                            self.element.change();
                        }
                    }
                },this.element
            ).on();

            self.element.on('change.customtext',function () {
                if (self.element.data('value') != self.element.val()) {
                    if ($.isFunction(self.options.format)) {
                        var re = self.options.format.apply(self, [self.element.val()]);
                        self._refresh(re);
                    }
                    self.element.data('value', self.element.val());
                }
            }).change();
        },
        show:function(){
            this._setOption("hide",false);
        },
        hide:function(){
            this._setOption("hide",true);
        },
        _drawByString:function(){
            var self = this;
            self._wrap = $("<span>")
                .width(self.element.width())
                .addClass("ui-combobox")
                .insertAfter(self.element);

            self._display = self.element
                .addClass("ui-combobox-input ui-widget ui-widget-content ui-corner-left")
                //.prop("readonly",true)
                .appendTo(self._wrap);

            self._button = $("<a>")
                .insertAfter(self._display)
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-carat-1-e"}, text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle")
                .click(function () {//按钮点击
                    if ($.isFunction(self.options.click)) {
                        var re = self.options.click.apply(self.element, [self]);
                        if (re === false) return;
                        if ($.isFunction(self.options.format)) {
                            re = self.options.format.apply(self, [re]);
                        }
                        self._refresh(re);
                    }
                });
        },
        _drawByArray:function(){
            var self = this;
            self._wrap = $("<span/>")
                .width(self.element.width())
                .addClass("ui-combobox")
                .insertAfter(self.element);

            self._display = $("<input>")
                .width(self.element.outerWidth() - 5)
                .addClass("ui-combobox-input ui-widget ui-widget-content ui-corner-left")
                .prop("readonly", true)
                .appendTo(self._wrap);

            //button
            self._button = $("<a>")
                .insertAfter(self._display)
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-carat-1-e"}, text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle")
                .click(function () {//按钮点击
                    if ($.isFunction(self.options.click)) {
                        var re = self.options.click.apply(self.element, [self]);
                        if (re === false) return;
                        if ($.isFunction(self.options.format)) {
                            re = self.options.format.apply(self, [re]);
                        }
                        self._refresh(re);
                    }
                });
            self.element.hide();
        },
        _refresh:function(data){
            var self = this;
            if(this.options.valueType == "string"){
                if($.type(data) == "string"){
                    self.element.data("value",data);
                    self.element.val(data);
                    self._display.val(data);
                }
            }else{
                if ($.isArray(data)) {
                    if ($.isPlainObject(data[0])) {
                        var tmpValue = new StringBuilder();
                        var tmpLabel = new StringBuilder();
                        $.each(data, function () {
                            tmpValue.append(this.value);
                            tmpLabel.append(this.label)
                        });
                        var tmpV = tmpValue.toString(";");
                        self.element.data("value",tmpV);
                        self.element.val(tmpV);
                        self._display.val(tmpLabel.toString(";"));
                    } else {
                        self.element.data("value",data[0]);
                        self.element.val(data[0]);
                        self._display.val(data[1]);
                    }
                }
            }
        },
        title: function () {
            return this._display.val();
        },
        value: function (key, value) {
            if (arguments.length == 0) return this.element.val();
            if (arguments.length == 1) {
                this.element.val(key);
                this._display.val(key);
            }
            if (arguments.length == 2) {
                this.element.val(value);
                this._display.val(key);
            }
        },
        _uniqid: function uniqid(prefix) {
            var uid = new Date().getTime().toString(16);
            uid += Math.floor((1 + Math.random()) * Math.pow(16, (16 - uid.length)))
                .toString(16).substr(1);
            return (prefix || '') + uid;
        },
        widget:function(){
            return this._wrap;
        },
        _destroy: function () {
            this.element.off(".customtext");
            this._hookValue.off();
            if (this.options.valueType == "array") {
                this._wrap.remove();
                this.element.show();
            } else {
                this.element.insertAfter(this._wrap);
                this._wrap.remove();
            }
        }
    });
})(jQuery);