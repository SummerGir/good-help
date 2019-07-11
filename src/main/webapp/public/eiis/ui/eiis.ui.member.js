(function ($, undefined) {
    EIIS.UI.register("member", {
        _jqElement: null,
        _jqButton: null,
        _jqTagElement: null,
        _innerVal: false,
        _params: null,
        create: function () {
            var self = this;
            self._jqElement = $(self.element);
            if (self.element.tagName.toLowerCase() != "input") throw ("初始化标签不是input!");
            var params = {
                readonly: self._jqElement.prop('disabled'),
                multiple: self._jqElement.attr('data-multiple') ? Boolean.parse(self._jqElement.attr('data-multiple')) : true,
                dept: self._jqElement.attr("data-dept") ? Boolean.parse(self._jqElement.attr('data-dept')) : true,
                post: self._jqElement.attr("data-post") ? Boolean.parse(self._jqElement.attr('data-post')) : true,
                person: self._jqElement.attr("data-person") ? Boolean.parse(self._jqElement.attr('data-person')) : true,
                freeze: self._jqElement.attr("data-freeze") ? Boolean.parse(self._jqElement.attr("data-freeze")) : false,
                selectRoot: self._jqElement.attr("data-select-root") ? Boolean.parse(self._jqElement.attr('data-select-root')) : true,
                attrCode: self._jqElement.attr("data-attr-code") ? self._jqElement.attr('data-attr-code') : '',
                attrValue: self._jqElement.attr("data-attr-value") ? self._jqElement.attr('data-attr-value') : '',
                roots: self._jqElement.attr("data-id") ? self._jqElement.attr('data-id') : '',
                exclude:self._jqElement.attr("data-exclude") ? self._jqElement.attr('data-exclude') : '',
                placeholder:self._jqElement.attr("placeholder") ? self._jqElement.attr('placeholder') : '',
                initFun:self._jqElement.data("init") ? self._jqElement.data('init') : '',
                hideHint:self._jqElement.attr("data-hideHint") ? self._jqElement.attr('data-hideHint') : false  //是否隐藏提示消息
            };

            self._params = params;
            self._jqElement.hide();
            var excludes = params.exclude.split(";");


            self._jqTagElement = $("<div/>").insertAfter(self._jqElement);

            self._jqTagElement
                .tagsinput({
                    idKey: "id",
                    displayKey: "text",
                    multiple: params.multiple,
                    menuTemplate: function (value) {
                        return "<i style='" + value["style"] + "' class='" + value["classIcon"] + "'>&nbsp;&nbsp;</i><b>" + value["text"] + "</b>&nbsp;&nbsp;" + value["path"];
                    },
                    input: {
                        placeholder: params.placeholder || '输入成员拼音',
                        source: function (value, callback) {
                            params.ids = null;
                            params.term = value;
                            $.ajax({
                                dataType: 'json', cache: false,
                                url: '/public/controls/selector/member/selector.member.query.jsp',
                                data: params,
                                success: function (results) {
                                    callback(results);
                                }
                            });
                        }
                    },
                    button: {
//                        text: "选择成员",
                        icon: "glyphicon glyphicon-option-vertical"
                    }
                });
            var defaultValues = self._jqElement.val();
            if (defaultValues) {
                params.term = null;
                params.ids = self._jqElement.val();
                $.ajax({
                    url: '/public/controls/selector/member/selector.member.query.jsp',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: params,
                    success: function (data) {
                        if (data) {
                            self._jqTagElement.tagsinput("putTag", data);
                        }
                    }
                });
            }
            self._jqTagElement
                .on("put.tagsinput remove.tagsinput", function (e, id, data) {
                    self._innerVal = true;
                    self._jqElement.val(self._jqTagElement.tagsinput("getIds").join(";"));
                    self._innerVal = false;
                    if (excludes.contains(id)) {
                        self._jqTagElement.find("span[data-tag-id='" + id + "']").css({"backgroundColor": "#5cb85c"});
                    }
                });
            self._jqTagElement
                .on("put.tagsinput", function (e, id, data) {
                    if (id) {
                        self._jqElement.triggerHandler("member.put.tagsinput", [data, "input"]);
                    }
                });
            self._jqTagElement
                .on("remove.tagsinput", function (e, id, data) {
                    if (id) {
                        self._jqElement.triggerHandler("member.remove.tagsinput", [data, "remove"]);
                    }
                });
            if (params.readonly) {
                self._jqTagElement.tagsinput("setReadOnly", true);
            }

            self._jqTagElement.on("button.tagsinput", function () {
                params.values = self._jqTagElement.tagsinput("getIds");
                $.selector.member($.extend(true, {}, params, {
                    ok: function (data) {
                        self._jqTagElement.tagsinput("clearTag");
                        self._jqTagElement.tagsinput("putTag", data);
                    }
                }));
            });

            //$("<div class=\"tooltip bottom\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\">Tooltip on the bottom</div></div>").insertAfter(self._jqElement);
            if(!params.hideHint){ //不隐藏则显示出来
                self._jqElement.next("div").after(
                    $("<div/>").append("<i style=\"color:#f0ad4e\" class=\"glyphicon glyphicon-info-sign\"></i> ")
                        .append($("<span/>").text("可以输入名称的全拼、简拼等进行查找用户."))
                );
            }
            //glyphicon glyphicon-info-sign
            if(params.initFun && window[params.initFun] && $.isFunction(window[params.initFun])){
                window[params.initFun].call(self._jqElement);
            }
        },
        setDisabled: function (value) {
            this._jqTagElement.tagsinput("setReadOnly", value);
        },
        destroy: function () {
            this._jqTagElement.remove();
            this._jqElement.show();
        },
        setValue: function (value) {
            var self = this;
            if (!self._innerVal) {
                var params = self._params;
                params.term = null;
                params.ids = value;
                $.ajax({
                    url: '/public/controls/selector/member/selector.member.query.jsp',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: params,
                    success: function (data) {
                        self._jqTagElement.tagsinput("clearTag");
                        self._jqTagElement.tagsinput("putTag", data);
                    }
                });
            }
            self._jqElement.val(value);
        },
        isDisabled: function () {
            return this._jqTagElement.tagsinput("isReadOnly");
        }
    });
})(jQuery);