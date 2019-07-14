(function($,undefined){
    $.widget("eiis.combobox",{
        options:{
            input: false,
            multiple:false,
            datasource:null,
            selected:null
        },
        _menu:null,
        _autoComplete:null,
        _input:null,
        _tags:null,
        _tagsWrap:null,
        _button:null,
        _wrap:null,
        _hookValue:null,
        _create:function(){
            if(!this.element.is("select")){
                throw "要求标签select";
            }
            var me = this;
            this._source();
            this._createHtmlNode();
            this._refresh();
        },
        _setOption:function(key,value){
            if (key === "disabled") {
                if (value) {
                    //this.element.attr("disabled", true);
                    this._input.autocomplete("disable");
                    this._button.button("disable");
                    if(this.options.multiple) this._tags.find(".inputTags-close").hide();
                } else {
                    //this.element.attr("disabled", false);
                    this._input.autocomplete("enable");
                    this._button.button("enable");
                    if(this.options.multiple) this._tags.find(".inputTags-close").show();
                }
            }
            if("hide".equalsIgnoreCase(key)){
                if(value){
                    this.widget().hide();
                }else{
                    this.widget().show();
                }
            }
            //$.Widget.prototype._setOption.apply(this, arguments);
            this._super(key,value);
        },
        _source:function(){
            var me = this;
            if(!String.isNullOrEmpty(this.options.datasource)){
                $.ajax({
                    async:false,
                    dataType:'json',
                    type:'post',
                    url:'/public/dictionary/getdictionarynode.jsp',
                    data:{dictcode:me.options.datasource,childOnly:true,typeOnly:false,valueOnly:true},
                    success:function(data,state){
                        if(data){
                            $.each(data,function(i,o){
                                if(o.key == me.options.selected){
                                    me.element.append('<option selected value="'+ o.key +'">'+ o.title +'</option>');
                                }else{
                                    me.element.append('<option value="'+ o.key +'">'+ o.title +'</option>');
                                }
                            });
                        }
                    }
                });
            }
        },
        _createHtmlNode:function(){
            var me = this;
            if(me.options.multiple){
                me._multiple();
            }else{
                me._single();
            }
            me._on(me._wrap,{
                click:function(){
                    me._input.focus();
                    me._toggleMenu();
                    return false;
                }
            });
        },
        _single:function(){
            var me = this;
            me.element.removeProp("multiple");
            me._wrap = $("<span>")
                .addClass("ui-combobox")
                .insertAfter(me.element);
            me._input = $("<input>")
                .addClass("ui-widget ui-widget-content ui-corner-left ui-combobox-input")
                .attr("readonly",!me.options.input)
                .on({
                    keydown:function(e){
                        if(!me.options.input){
                            if (e.keyCode == 8) {
                                return false;
                            }
                        }
                    }
                })
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: function (request, response) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        response(me.element.children("option:not([custom])").map(function () {
                            var text = $(this).text();
                            //if (this.value && (!request.term || matcher.test(text)))
                            if ((!request.term || matcher.test(text)))
                                return {
                                    label: text.replace(
                                        new RegExp(
                                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                                $.ui.autocomplete.escapeRegex(request.term) +
                                                ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                        ), "<strong>$1</strong>"),
                                    value: text,
                                    option: this
                                };
                        }));
                    },
                    select: function (e, ui) {
                        me.value(ui.item.option.value);
                        if(me.element.data("value") != me.element.val()){
                            me.element.data("value",me.element.val());
                            me.element.trigger("change");
                        }
                        me._trigger("selected", event, {
                            item: ui.item.option
                        });
                    },
                    change: function (e, ui) {//输入改变时
                        //alert(1);
                        if (!ui.item) {
                            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                                valid = false;
                            me.element.children("option").each(function () {
                                if ($(this).text().match(matcher)) {
                                    //this.selected = valid = true;
                                    me._setValue(this,true);
                                    valid = true;
                                    return false;
                                }
                            });
                            if (!valid) {
                                if (!me.options.input) {
                                    $(this).val("");
                                    //me.element.val("");
                                    me._input.data("autocomplete").term = "";
                                    return false;
                                } else {
                                    var custom = me.element.children("option[custom]:last");
                                    if (custom.length == 0) {
                                        custom = $("<option selected />").appendTo(me.element)
                                            .attr("custom", "true");
                                    }
                                    custom.val($(this).val());
                                    custom.text($(this).val());
                                    //me.value($(this).val());
                                    me._setValue(custom[0],true);
                                    me._refresh();
                                    //custom.prop("selected",true);
                                    return false;
                                }
                            }
                        }
                    }
                }).appendTo(me._wrap);

            me._autoComplete = me._input.data("autocomplete");
            me._autoComplete._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
            me._autoComplete._suggest = function( items ) {
                var ul = this.menu.element
                    .empty()
                    .zIndex( this.element.zIndex() + 1 );
                this._renderMenu( ul, items );
                this.menu.refresh();

                // size and position menu
                ul.show()
                this._resizeMenu();
                ul.position( $.extend({
                    of: me._wrap
                }, this.options.position ));

                if ( this.options.autoFocus ) {
                    this.menu.next();
                }
            },
                me._autoComplete._resizeMenu = function() {
                    var ul = this.menu.element;
                    ul.outerWidth( Math.max(
                        // Firefox wraps long text (possibly a rounding bug)
                        // so we add 1px to avoid the wrapping (#7513)
                        ul.width( "" ).outerWidth() + 1,
                        me._wrap.outerWidth()
                    ));
                    var ulHeight = 0;
                    ul.find("li").each(function(i,o){
                        ulHeight += $(o).outerHeight(true);
                    });
                    var _dist = $(window).height() - me._wrap.outerHeight(true) - me._wrap.offset().top - 6;
                    if(ulHeight > _dist){
                        ul.height(_dist).css({'overflow-x':'hidden','overflow-y':'auto'});
                    }else{
                        ul.height(ulHeight).css({'overflow-x':'hidden','overflow-y':'hidden'});
                    }
                }

            me._menu = me._autoComplete.menu;

            me._button = $("<a>")
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-triangle-1-s"},text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle")
                .click(function () {
                    //me._toggleMenu();
                    //return false;
                })
                .appendTo(me._wrap);

            me._wrap.width(me.element.outerWidth(true));
            me._input.width(me._wrap.width() - me._button.outerWidth(true) - 4);
            me.element.hide();
        },
        _multiple:function(){
            var me = this;
            me.element.prop("multiple",true);

            me._wrap = $("<span>")
                .addClass("ui-combobox")
                .insertAfter(me.element);

            me._tags = $("<span>")
                .css({padding: '0.1em'})
                .addClass("ui-spinner ui-widget ui-widget-content ui-corner-left")
                .appendTo(me._wrap);
            me._inputTags = me._tags.inputTags({
                abreast:true,
                input: {
                    onPartComplete: function (value, type) {
                        var option = $("option:contains('"+value+"')",me.element);
                        if(option.length > 0){
                            return {label: option.text(),desc: option.text(),value: option.val()};
                        }
                    },
                    autocomplete: {
                        source: function (request, response) {
                            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                            response(me.element.children("option:not([custom])").map(function () {
                                var text = $(this).text();
                                //if (this.value && (!request.term || matcher.test(text)))
                                if ((!request.term || matcher.test(text)))
                                    return {
                                        label:text,
                                        value: text,
                                        option: this
                                    };
                            }));
                        },
                        select: function (e, ui) {
                            me._input.blur();
                            me._input.focus();
                        },
                        change: function (e, ui) {//输入改变时
                            if (!ui.item) {
                                var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                                    valid = false;
                                me.element.children("option").each(function () {
                                    if ($(this).text().match(matcher)) {
                                        //this.selected = valid = true;
                                        me._setValue(this,true);
                                        valid = true;
                                        return false;
                                    }
                                });
                                if (!valid) {
                                    if (!me.options.input) {
                                        $(this).val("");
                                        //me.element.val("");
                                        me._input.data("autocomplete").term = "";
                                        return false;
                                    } else {
                                        var custom = me.element.children("option[custom]:last");
                                        if (custom.length == 0) {
                                            custom = $("<option />").appendTo(me.element)
                                                .attr("custom", "true");
                                        }
                                        custom.val($(this).val());
                                        custom.text($(this).val());
                                        //me.value($(this).val());
                                        me._setValue(custom[0],true);
                                        me._refresh();
                                        //custom.prop("selected",true);
                                        return false;
                                    }
                                }
                            }
                        },
                        minLength: 0
                    }
                },
                afterAdd:function(value,item){
                    var option = $("option[value='"+value+"']",me.element)
                    if(option.length > 0){
                        me._setValue(option[0],true);
                        //option.prop("selected",true);
                    }
                    me._input.val("");
                    if(me.element.data("value") != me.element.val()){
                        me.element.data("value",me.element.val());
                        me.element.trigger("change");
                    }
                },
                afterRemove:function(value,item){
                    var option = $("option[value='"+value+"']",me.element)
                    if(option.length > 0){
                        me._setValue(option[0],false);
                        //option.prop("selected",false);
                    }
                }
            });
            me._button = $("<a>")
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-triangle-1-s"},text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle")
                .click(function () {
                    //me._toggleMenu();
                    //return false;
                })
                .appendTo(me._wrap);

            me._input = $("input:eq(0)",me._tags);
            me._input
                .attr("readonly",!me.options.input)
                .on({
                    keydown:function(e){
                        if(!me.options.input){
                            if (e.keyCode == 8) {
                                return false;
                            }
                        }
                    }
                });
            me._autoComplete = me._input.data("autocomplete");
            me._autoComplete._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
            me._autoComplete._suggest = function( items ) {
                var ul = this.menu.element
                    .empty()
                    .zIndex( this.element.zIndex() + 1 );
                this._renderMenu( ul, items );
                this.menu.refresh();

                // size and position menu
                ul.show();
                this._resizeMenu();
                ul.position( $.extend({
                    of: me._wrap
                }, this.options.position ));

                if ( this.options.autoFocus ) {
                    this.menu.next();
                }
            },
                me._autoComplete._resizeMenu = function() {
                    var ul = this.menu.element;
                    ul.outerWidth( Math.max(
                        // Firefox wraps long text (possibly a rounding bug)
                        // so we add 1px to avoid the wrapping (#7513)
                        ul.width( "" ).outerWidth() + 1,
                        me._wrap.outerWidth()
                    ));
                    var _dist = window.screen.availHeight - me._wrap.outerHeight(true) - ul.offset().top;
                    if(ul.outerHeight(true) > _dist){
                        _dist = _dist > 400 ? 400 : _dist;
                        ul.height(_dist).css({'overflow-x':'hidden','overflow-y':'auto'});
                    }
                }
            me._menu = me._autoComplete.menu;

            me._wrap.width(me.element.outerWidth(true))
            me._tags.width(me._wrap.width() - me._button.outerWidth(true) - 2);

            me.element.hide();
        },
        _toggleMenu:function(){
            var me = this;
            var wasOpen = me._input.autocomplete("widget").is(":visible");
            if(wasOpen){
                me._input.autocomplete("close");
                return;
            }
            me._input.autocomplete("search", "");
        },
        _refresh:function(){
            var me = this;
            if(me.options.multiple){
                me._tags.inputTags("removeTags");
                me.element.children("option:selected").each(function(i,o){
                    me._tags.inputTags("addTag",{label: o.text,desc: o.text,value: o.value});
                });
            }else{
                me.element.children("option:selected").each(function(i,o){
                    me._input.val(o.text);
                });
            }
        },
        _setValue:function(o,selected){
            var custom = $(o).attr("custom");
            var option = $('<option value="'+ o.value+'">'+ o.text+'</option>');
            if(custom) option = $('<option custom="true" value="'+ o.value+'">'+ o.text+'</option>');
            if(selected){
                if(custom){
                    option = $('<option custom="true" selected value="'+ o.value+'">'+ o.text+'</option>')
                }else{
                    option = $('<option selected value="'+ o.value+'">'+ o.text+'</option>')
                }
            }
            option.insertAfter($(o));
            $(o).remove();
            return option;
        },
        title:function(){
            return this.element.find(":selected").text();
        },
        value:function(value){
            var $this = this;
            if(arguments.length == 0) {
                var _value = $this.element.val();
                return _value;
            }
            //if(!value) return;
            var tmpValue = [];
            if($.isArray(value)){
                tmpValue = value;
            }else{
                tmpValue.push(value);
            }
            if(!$this.options.multiple) $this.element[0].selectedIndex = -1;
            $.each(tmpValue,function(i,o){
                var  option = $("option[value='"+o+"']",$this.element);
                if(option.length > 0){
                    $this._setValue(option[0],true);
                }
            });
            $this._refresh();
        },
        addOption:function(text,value){
            if(text && value){
                this.element.append("<option value=\""+ value +"\">"+ text +"</option>");
            }
        },
        removeOption:function(value){
            var $this = this;
            if(value){
                this.element.children("option").each(function(i,o){
                    if($(o).value == value) {
                        $(o).remove();
                        if(o.selected){
                            $this._refresh();
                        }
                        return false;
                    }
                });
            }
        },
        clear:function(){
            this.element.empty();
            this._refresh();
        },
        show:function(){
            this._setOption("hide",false);
        },
        hide:function(){
            this._setOption("hide",true);
        },
        widget: function () {
            return this._wrap;
        },
        _destroy:function(){}
    });
})(jQuery);