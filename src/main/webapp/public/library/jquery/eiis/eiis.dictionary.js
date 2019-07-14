(function ($, undefined) {

    $.widget("eiis.dictionary",{
        options : {
            multiple: false,
            code: '',
            childOnly: true,
            typeOnly:false,
            valueMode:true,
            values:[],
            //callback
            ok:null,
            cancel:null
        },
        _wrap:null,
        _display: null,
        _button:null,
        _hookValue: null,
        _setOption:function(key,value){
            if("disabled".equalsIgnoreCase(key)){
                if(Boolean.parse(value)){
                    this._display.attr(key,true);
                    this._button.button("disable");
                }else{
                    this._display.attr(key,false);
                    this._button.button("enable");
                }
            }

            this._superApply(arguments);
        },
        _create:function(){
            var self = this,
                cache = {},
                lastXhr,
                tagsOptions = {
                    input: {
                        onPartComplete: function (value, type) {
                            var re = null;
                            $.ajax({
                                async: false,
                                dataType: "json",
                                data: {
                                    'key': type != 'select' ? value : '',
                                    'ids': type == 'select' ? value : '',
                                    'dictcode': self.options.code,
                                    'childOnly': self.options.childOnly,
                                    'typeOnly':self.options.typeOnly
                                },
                                type: 'POST',
                                url: '/public/dictionary/getdictionarytag.jsp',
                                success: function (data, status, xhr) {
                                    if (data.length == 1) {
                                        re = data[0];
                                    }
                                }
                            });
                            return re;
                        }
                        , autocomplete: {
                            source: function (request, response) {
                                var term = request.term;
                                if (term in cache) {
                                    response(cache[term]);
                                    return;
                                }
                                lastXhr = $.ajax({
                                    dataType: "json",
                                    data: {
                                        'find': request.term,
                                        'dictcode': self.options.code,
                                        'childOnly': self.options.childOnly,
                                        'typeOnly':self.options.typeOnly
                                    },
                                    type: 'POST',
                                    url: '/public/dictionary/getdictionarytag.jsp',
                                    success: function (data, status, xhr) {
                                        cache[term] = data;
                                        if (xhr === lastXhr) {
                                            response(data);
                                        }
                                    }
                                });
                            },
//                                                select: function (event, ui) {
//                                                    self._display.inputTags('addTag', ui.item);
//                                                    //return true;
//                                                },
                            minLength: 2
                        }
                    }
                };

            self._wrap = $("<span/>")
                .width(self.element.width())
                .addClass("ui-combobox");

            self._display = $("<span>")
                .css({padding:'0.12em'})
                .addClass('ui-spinner ui-widget ui-widget-content ui-corner-left')
                .appendTo(self._wrap);
            self._display.inputTags({
                //tags: self.GetFormatDictionary(self.element.val()),
                //select: tagsOptions.select,
                input: tagsOptions.input,
                beforeAdd: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    if (self.options.multiple == false && tags.length > 0) {
                        return false;
                    }
                },
                afterAdd: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    if(self.options.valueMode){
                        $(tags).each(function(i,o){
                            tags[i] = o.split("|")[0];
                        });
                    }
                    self.element.data('value', tags.join(';'));
                    self.element.val(self.element.data('value'));

                    if (self.options.multiple == false && tags.length > 0) {
                        //self._display.inputTags('setSelect', null);
                        //self._display.inputTags('setInput', null);
                        self._display.find("input").prop("disabled",true);
                    }
                },
                afterRemove: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    self.element.data('value', tags.join(';'));
                    self.element.val(self.element.data('value'));
                    if (self.options.multiple == false && tags.length == 0) {
                        //self._display.inputTags('setSelect', tagsOptions.select);
                        //self._display.inputTags('setInput', tagsOptions.input);
                        self._display.find("input").prop("disabled",false);
                    }
                }
            });
            //button
            self._button = $("<a>")
                .appendTo(self._wrap)
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-bookmark"}, text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right webui-member-button")
                .click(function () {//按钮点击
                    $.selector({
                        title: '数据字典',
                        multiple: self.options.multiple,
                        values: self.element.val().split(";"),
                        tabs: [
                            {
                                label: '数据字典列表',
                                template: 'tree',
                                option: {
                                    url: '/public/dictionary/getdictionarynode.jsp',
                                    data: {
                                        'dictcode': self.options.code,
                                        'childOnly': self.options.childOnly,
                                        'typeOnly':self.options.typeOnly
                                    }
                                }
                            },
                            {
                                label: '数据字典搜索',
                                template: 'find_grid',
                                option: {
                                    url: '/public/dictionary/getdictionarytag.jsp',
                                    key: 'find',
                                    data: {
                                        'dictcode': self.options.code,
                                        'childOnly': self.options.childOnly,
                                        'typeOnly':self.options.typeOnly
                                    },
                                    colModel: [
                                        { label: 'value', name: 'value', key: true, hidden: true }
                                        , { label: '名称', name: 'label' }
                                        , { label: '备注', name: 'desc' }
                                    ]
                                }
                            }
                        ],
                        format: function (values) {
                            var IDs = values;
                            if ($.isArray(IDs)) {
                                IDs = IDs.join(';');
                            }
                            var re = [];
                            $.ajax({
                                async: false,
                                data: {
                                    'ids': IDs,
                                    'dictocde': self.options.code,
                                    'childOnly': self.options.childOnly,
                                    'typeOnly':self.options.typeOnly
                                },
                                dataType: 'json',
                                type: 'POST',
                                url: '/public/dictionary/getdictionarytag.jsp',
                                success: function (data) {
                                    re = data;
                                }
                            });
                            return re;
                        },
                        define: function (values) {
                            var tags = self._getFormatDictionary(values.join(";"));
                            self._display.inputTags('setTags', tags);
                            if(tags.length == 0) self.element.val('');
                            if (self.options.multiple == false && tags.length == 0) {
                                self._display.find("input").prop("disabled",false);
                            }
                            if($.isFunction(self.options.ok)){
                                if(self.options.valueMode){
                                    $(values).each(function(i,o){
                                        values[i] = o.split('|')[0];
                                    });
                                }
                                self.options.ok.apply(self,[values,tags]);
                                if(self.element.attr("type") == "hidden"){
                                    self.destroy();
                                }
                            }
                        },
                        cancel: function(){
                            if($.isFunction(self.options.cancel)){
                                self.options.cancel.call(self);
                            }
                            if(self.element.attr("type") == "hidden"){
                                self.destroy();
                            }
                        },
                        close:function(){
                            if($.isFunction(self.options.close)){
                                self.options.close.call(self);
                            }
                            if(self.element.attr("type") == "hidden"){
                                self.destroy();
                            }
                        }
                    });
                });
            self.element.after(self._wrap);
            self._display.width(self._wrap.width() - self._button.outerWidth(true) -4);
            self.element.hide();
            if(this.options.values.length  > 0){
                self.element.val(this.options.values.join(';'));
            }

            self._hookValue = new $.hook('val', function () {
                    if (arguments.length > 0) {
                        if (self.element.data('value') != self.element.val()) {
                            self.element.change();
                        }
                    }
                },this.element
            ).on();

            self.element.on('change.dictionary', function () {
                if (self.element.data('value') != self.element.val()) {
                    self.element.data('value', self.element.val());
                    self._display.inputTags('setTags', self._getFormatDictionary(self.element.val()));
                }
            }).change();
        },
        show:function(){
            this._wrap.show();
        },
        hide:function(){
            this._wrap.hide();
        },
        _getFormatDictionary: function (values) {
            var re = [];
            $.ajax({
                async: false,
                data: {
                    'ids': values,
                    'dictcode': this.option.code,
                    'childOnly': this.options.childOnly,
                    'typeOnly':this.options.typeOnly
                },
                dataType: 'json',
                type: 'POST',
                url: '/public/dictionary/getdictionarytag.jsp',
                success: function (data) {
                    re = data;
                }
            });

            if(this.options.valueMode){
                $(re).each(function(i,o){
                    re[i].value = o.value.split('|')[0];
                });
            }
            return re;
        },
        _destroy: function () {
            //this._super();
            this.element.off('.dictionary');
            this._hookValue.off();
            //this.element.dictionary = undefined;
            this._wrap.remove();
            if(this.element.attr("type") == "hidden"){
                this.element.remove();
            }else{
                this.element.show();
            }
        }
    })

    if(!$.selector) $.selector = {};
    $.selector.dictionary = function(){
        var _rtn;
        var options = $.extend($.selector.member.options,{
            create:function(e,ui){
                var dict = $(this).data("dictionary");
                if(dict.options.multiple){
                    $(this).val(dict.options.values.join(";"));
                }else{
                    if(dict.options.values.length > 0) $(this).val(dict.options.values[0]);
                }
                dict.hide();
                dict._button.click();
            }
        });
        if(!$.isEmptyObject(arguments)){
            this.dictionary.options = $.extend(
                options,
                arguments[0]
            );
        }
        this.dictionary.element = _rtn = $("<input type=\"hidden\">")
            .appendTo($("body"))
            .dictionary(options);
        return _rtn.val();
    };
    $.extend($.selector.dictionary,{
        options:{
            multiple: false,
            code: '',
            childOnly: true,
            valueMode:true,
            values:[],
            ok:null,
            cancel:null
        },
        element:null
    });


})(jQuery);