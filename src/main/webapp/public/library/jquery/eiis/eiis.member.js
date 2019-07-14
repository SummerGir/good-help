/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-3-6
 * Time: 下午1:10
 * To change this template use File | Settings | File Templates.
 */
(function ($, undefined) {
    $.widget("eiis.member", {
        _display: null,
        _hookValue: null,
        options: {
            multiple: true,
            root: '',
            freeze: false,
            dept: true,
            post: true,
            person: true,
            selectRoot: true,
            //attr:true,
            //attrChild:true,
            attrCode: '',
            attrValue: '',
            values: [],
            //callback
            ok: null, //fire on ok buttion click
            cancel: null  //fire on cancel buttion click
        },
        _create: function () {
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
                                    'root': self.options.root,
                                    'freeze': self.options.freeze,
                                    'dept': self.options.dept,
                                    'post': self.options.post,
                                    'person': self.options.person,
                                    'selectRoot': self.options.selectRoot
                                },
                                type: 'POST',
                                url: '/public/memberselector/getmembertag.jsp',
                                success: function (data, status, xhr) {
                                    if (data.length == 1) {
                                        re = data[0];
                                    }
                                }
                            });
                            return re;
                        },
                        autocomplete: {
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
                                        'root': self.options.root,
                                        'freeze': self.options.freeze,
                                        'dept': self.options.dept,
                                        'post': self.options.post,
                                        'person': self.options.person,
                                        'selectRoot': self.options.selectRoot
                                    },
                                    type: 'POST',
                                    url: '/public/memberselector/getmembertag.jsp',
                                    success: function (data, status, xhr) {
                                        cache[term] = data;
                                        if (xhr == lastXhr) {
                                            response(data);
                                        }
                                    }
                                });
                            },
                            minLength: 1
                        }
                    }
                };
            //
            self._wrap = $("<span/>")
                .width(self.element.width())
                .addClass("ui-combobox");

            self._display = $("<span>")
                .css({padding: '0.12em'})
                .appendTo(self._wrap)
                .addClass("ui-spinner ui-widget ui-widget-content ui-corner-left")
            self._display.inputTags({
                input: tagsOptions.input,
                beforeAdd: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    if (self.options.multiple == false && tags.length > 0) {
                        return false;
                    }
                },
                afterAdd: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    self.element.data('value', tags.join(';'));
                    self.element.val(self.element.data('value'));

                    if (self.options.multiple == false && tags.length > 0) {
                        //self._display.inputTags('setSelect', null);
                        //self._display.inputTags('setInput', null);
                        self._display.find("input").prop("disabled", true);
                    }
                },
                afterRemove: function (value, data) {
                    var tags = self._display.inputTags('getTagsValue');
                    self.element.data('value', tags.join(';'));
                    self.element.val(self.element.data('value'));
                    if (self.options.multiple == false && tags.length == 0) {
                        //self._display.inputTags('setSelect', tagsOptions.select);
                        //self._display.inputTags('setInput', tagsOptions.input);
                        self._display.find("input").prop("disabled", false);
                    }
                }
            });

            //button
            self._button = $("<a>")
                .appendTo(self._wrap)
                .attr("tabIndex", -1)
                .button({icons: {primary: "ui-icon-person"}, text: false})
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right webui-member-button")
                .click(function () {//按钮点击
                    $.selector({
                        title: '成员选择',
                        multiple: self.options.multiple,
                        values: self.element.val().split(";"),
                        tabs: self._tabs(),
                        format: function (values) {
                            var ids = values;
                            if ($.isArray(ids)) {
                                ids = ids.join(';');
                            }
                            var re = [];
                            $.ajax({
                                async: false,
                                data: {
                                    'ids': ids,
                                    'root': self.options.root,
                                    'freeze': self.options.freeze,
                                    'dept': self.options.dept,
                                    'post': self.options.post,
                                    'person': self.options.person,
                                    'selectRoot': self.options.selectRoot
                                },
                                dataType: 'json',
                                type: 'POST',
                                url: '/public/memberselector/getmembertag.jsp',
                                success: function (data) {
                                    re = data;
                                }
                            });
                            return re;
                        },
                        define: function (values) {
                            var formatValue = self._getFormatMember(values.join(";"));
                            self._display.inputTags('setTags', formatValue);
                            if ($.isFunction(self.options.ok)) {
                                self.options.ok.apply(self, [values, formatValue]);
                                if (self.element.attr("type") == "hidden") {
                                    self.destroy();
                                }
                            }
                            if (formatValue.length == 0) self.element.val('');
                            if (self.options.multiple == false && formatValue.length == 0) {
                                self._display.find("input").prop("disabled", false);
                            }
                        },
                        cancel: function () {
                            if ($.isFunction(self.options.cancel)) {
                                self.options.cancel.call(self);
                            }
                            if (self.element.attr("type") == "hidden") {
                                self.destroy();
                            }
                        },
                        close: function () {
                            if ($.isFunction(self.options.close)) {
                                self.options.close.call(self);
                            }
                            if (self.element.attr("type") == "hidden") {
                                self.destroy();
                            }
                        }
                    });
                });
            self.element.after(self._wrap);
            self._display.width(self._wrap.width() - self._button.outerWidth(true) - 4);
            self.element.hide();
            if(this.options.values.length  > 0){
                self.element.val(this.options.values.join(';'));
            }

            self._hookValue = new $.hook('val', function () {
                    if (arguments.length > 0) {
                        //if (self.element.data('value') != self.element.val()) {
                            self.element.change();
                        //}
                    }
                },this.element
            ).on();

            self.element.on('change.member',function () {
                if (self.element.data('value') != self.element.val()) {
                    self.element.data('value', self.element.val());
                    self._display.inputTags('setTags', self._getFormatMember(self.element.val()));
                }
            }).change();

        },
        _tabs: function () {
            var self = this;
            var tmpArray = [];
            if (self.options.person) {
                tmpArray.push({
                    label: '人员',
                    template: 'tree',
                    option: {
                        url: '/public/memberselector/getdeptperson.jsp',
                        data: {
                            'root': self.options.root,
                            'freeze': self.options.freeze,
                            'dept': self.options.dept,
                            'post': self.options.post,
                            'person': self.options.person,

                            'selectRoot': self.options.selectRoot
                        }
                    }
                });
            }
            if (self.options.post) {
                tmpArray.push({
                    label: '岗位',
                    template: 'tree',
                    option: {
                        url: "/public/memberselector/getdeptpost.jsp",
                        data: {
                            'root': self.options.root,
                            'freeze': self.options.freeze,
                            'dept': self.options.dept,
                            'post': self.options.post,
                            'person': self.options.person,
                            'selectRoot': self.options.selectRoot
                        }
                    }
                });
            }
            if (self.options.dept) {
                tmpArray.push({
                    label: '部门',
                    template: 'tree',
                    option: {
                        url: '/public/memberselector/getdept.jsp',
                        data: {
                            'root': self.options.root,
                            'freeze': self.options.freeze,
                            'dept': self.options.dept,
                            'post': self.options.post,
                            'person': self.options.person,
                            'selectRoot': self.options.selectRoot
                        }
                    }
                });
            }
            if (!String.isNullOrEmpty(self.options.attrCode) && !String.isNullOrEmpty(self.options.attrValue)) {
                tmpArray = [];
                tmpArray.push({
                    label: '属性',
                    template: 'tree',
                    option: {
                        url: '/public/memberselector/getmemberbyattr.jsp',
                        data: {
                            'root': self.options.root,
                            'freeze': self.options.freeze,
                            'dept': self.options.dept,
                            'post': self.options.post,
                            'person': self.options.person,
                            'selectRoot': self.options.selectRoot,
                            //'attr': self.options.attr,
                            'attrCode': self.options.attrCode,
                            'attrValue': self.options.attrValue
                        }
                    }
                });
            }
            tmpArray.push({
                label: '成员搜索',
                template: 'find_grid',
                option: {
                    url: '/public/memberselector/getmembertag.jsp',
                    key: 'find',
                    data: {
                        'root': self.options.root,
                        'freeze': self.options.freeze,
                        'dept': self.options.dept,
                        'post': self.options.post,
                        'person': self.options.person,
                        'selectRoot': self.options.selectRoot
                    },
                    colModel: [
                        { label: 'value', name: 'value', key: true, hidden: true }
                        ,
                        { label: '名称', name: 'label' }
                        ,
                        { label: '备注', name: 'desc' }
                    ]
                }
            });
            if (self.options.person) {
                if (!String.isNullOrEmpty(self.options.attrCode) && !String.isNullOrEmpty(self.options.attrValue)) {

                }else{
                    tmpArray.push({
                        label: '在线用户',
                        template: 'tree',
                        option: {
                            url: '/public/memberselector/getonlineperson.jsp',
                            data: {
                                'root': self.options.root,
                                'freeze': self.options.freeze,
                                'dept': self.options.dept,
                                'post': self.options.post,
                                'person': self.options.person,
                                'selectRoot': self.options.selectRoot
                            }
                        }
                    });
                    tmpArray.push({
                        label: '姓名分类',
                        template: 'tree',
                        option: {
                            url: '/public/memberselector/getpersonorderbyname.jsp',
                            data: {
                                'root': self.options.root,
                                'freeze': self.options.freeze,
                                'dept': self.options.dept,
                                'post': self.options.post,
                                'person': self.options.person,
                                'selectRoot': self.options.selectRoot
                            }
                        }
                    });
                }
            }
            return tmpArray;
        },
        show: function () {
            this._setOption("hide",false);
        },
        hide: function () {
            this._setOption("hide",true);
        },
        _getFormatMember: function (values) {
            var re = [];
            $.ajax({
                async: false,
                data: {
                    'ids': values,
                    'root': this.options.root,
                    'freeze': this.options.freeze,
                    'dept': this.options.dept,
                    'post': this.options.post,
                    'person': this.options.person,
                    'selectRoot': this.options.selectRoot
                },
                dataType: 'json',
                type: 'POST',
                url: '/public/memberselector/getmembertag.jsp',
                success: function (data) {
                    re = data;
                }
            });
            return re;
        },
        _setOptions: function () {
            this._superApply(arguments);
        },
        _setOption: function (key, value) {
            var $this = this;
            if (key == "disabled") {
                $this._button.button("option", "disabled", value);
                $this._display.find("input").prop("disabled", value);
                if (value) {
                    $this._wrap.addClass("ui-state-disabled");
                    $this._display.find(".inputTags-close").hide();
                } else {
                    $this._wrap.removeClass("ui-state-disabled");
                    $this._display.find(".inputTags-close").show();
                    if (!$this.options.multiple && !String.isNullOrEmpty($this.element.val)) {
                        $this._display.find("input").prop("disabled", true);
                    }
                }
            }
            if("hide".equalsIgnoreCase(key)){
                if(value){
                    this._wrap.hide();
                }else{
                    this._wrap.show();
                }
            }

            this._super(key, value);
        },
        _destroy: function () {
            this.element.off('.member');
            this._hookValue.off();
            this._wrap.remove();
            //this.element.member = undefined;
            if (this.element.attr("type") == "hidden") {
                this.element.remove();
            } else {
                this.element.show();
            }
        }
    });

    if (!$.selector) $.selector = {};
    $.selector.member = function () {
        var _rtn;
        var options = $.extend($.selector.member.options,{
            create: function (e, ui) {
                var m = $(this).data("member");
                if (m.options.multiple) {
                    $(this).val(m.options.values.join(";"));
                } else {
                    if (m.options.values.length > 0) $(this).val(m.options.values[0]);
                }
                m.hide();
                m._button.click();
            }
        });
        if (!$.isEmptyObject(arguments)) {
            this.member.options = $.extend(
                options,
                arguments[0]
            );
        }
        this.member.element = _rtn = $("<input type=\"hidden\">")
            .appendTo($("body"))
            .member(options);
        return _rtn.val();
    };
    $.extend($.selector.member, {
        options: {
            multiple: true,
            root: '',
            freeze: false,
            dept: true,
            post: true,
            person: true,
            selectRoot: true,
            values: [],
            //callback
            ok: null, //fire on ok buttion click
            cancel: null  //fire on cancel buttion click
        },
        element: null
    });
})(jQuery);
