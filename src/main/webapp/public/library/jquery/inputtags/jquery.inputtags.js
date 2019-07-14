
(function ($, undefined) {

    $.fn.inputTags = function () {
        var self = this[0];
        var p = {};

        if ($.isEmptyObject(self.inputTags)) {
            if (!$.isEmptyObject(arguments[0])) {
                $.extend(true, p, arguments[0]);
            }
            self.inputTags = new $.fn.inputTags.base(self);
            self.inputTags._create(p);

            if (!$.isEmptyObject(p)) {
                return self.inputTags;
            }
        }

        if ($.type(arguments[0]) === 'string') {
            if ($.isFunction(self.inputTags[arguments[0]])) {
                var args = arguments.length == 1 ? [arguments[0]] : Array.apply(null, arguments);
                args.splice(0, 1);
                return self.inputTags[arguments[0]].apply(self.inputTags, args);
            }
        } else if (!$.isEmptyObject(arguments[0])) {
            $.extend(true, p, arguments[0]);
            self.inputTags.destroy();
            self.inputTags = new $.fn.inputTags.base(self);
            self.inputTags._create(p);
        }

        return self.inputTags;

    };

    $.fn.inputTags.option = {
        tags: [
        //					  { label: "显示的名称", value: "标签值", desc: "提示信息"}
        //					, { label: "显示的名称", value: "标签值", desc: "提示信息"}
        //					, { label: "显示的名称", value: "标签值", desc: "提示信息"}
        //					, { label: "显示的名称", value: "标签值", desc: "提示信息"}
				],
        abreast: true, //让没有标签并列显示，否则没有标签占一行。
        select: null, // 不进行选择
        input: null, //不进行输入
        tagsCss: null, //标签区域的 CSS
        tagCss: 'inputTags-tag-style', //标签 CSS
        beforeAdd: null, //添加标签前
        afterAdd: null, //添加标签后
        beforeRemove: null, //删除标签前
        afterRemove: null, //删除标签后
        beforeUpdate: null, //更新标签前
        afterUpdate: null //更新标签后
    };

    $.fn.inputTags.base = function (element) {
        this.element = element;
    };

    $.fn.inputTags.base.prototype = {

        _create: function (opt) {
            var self = this;
            // 引用默认属性
            var p = $.extend(true, {}, $.fn.inputTags.option);

            if (!$.isEmptyObject(opt.input)) {
                opt = $.extend(true, { input: {
                    css: 'inputTags-input-style', //输入框对象的 CSS
                    breakKeyCodes: [//$.ui.keyCode.COMMA //逗号
                                , $.ui.keyCode.ENTER //回车
                    //, $.ui.keyCode.SPACE //空格
                                , 186 // 分号
                                ], //输入时确定完成部分的分隔符
                    autocomplete: null, //jQuery ui autocomplete 的参数。
                    onPartComplete: false //对输入的内容进行近一步处理。
                }
                }, opt);
            };

            if (!$.isEmptyObject(opt.select)) {
                opt = $.extend(true, { select: {
                    element: "请选择...", //选择事件触发对象
                    css: null, //选择对象的 CSS
                    onFire: false //触发选择。
                }
                }, opt);
            };

            self.option = $.extend(true, p, opt);

            $(self.element).append($('<ul />')
                            .addClass((self.option.abreast === true ? 'inputTags abreast' : 'inputTags')));

            self.setTags(self.option.tags);
            self.setSelect(self.option.select);
            self.setInput(self.option.input);

            if (jQuery.type(self.option.tagsCss) === "string") {
                $('ul.inputTags', self.element).addClass(self.option.tagsCss);
            }

        },

        element: null,
        option: {},

        destroy: function () {
            var self = this;
            $('ul.inputTags', self.element).remove();
            self.element.inputTags = undefined;
        },

        _formatValue: function (value) {
            var self = this;
            var newValue = {
                label: '',
                value: '',
                desc: ''
            };

            var _type = jQuery.type(value.value);
            if (_type === "undefined" || _type === "null") {
                newValue.value = value.toString();
                newValue.label = newValue.value;
                newValue.desc = newValue.value;
            } else {
                newValue.value = value.value.toString();

                _type = jQuery.type(value.label);
                if (_type === "undefined" || _type === "null") {
                    newValue.label = newValue.value;
                } else {
                    newValue.label = value.label.toString();
                }

                _type = jQuery.type(value.desc);
                if (_type === "undefined" || _type === "null") {
                    newValue.desc = newValue.value;
                } else {
                    newValue.desc = value.desc.toString();
                }
            }
            return newValue;
        },

        _getTagWidget: function (tag) {
            var self = this;
            var _ovalue = '';

            var _type = jQuery.type(tag.value);
            if (_type === "undefined" || _type === "null") {
                _ovalue = tag.toString();
            } else {
                _ovalue = tag.value.toString();
            }

            var tagLi = null;
            $("ul.inputTags > li.inputTags-tag", self.element).each(function () {
                if ($(this).data("value") == _ovalue) {
                    tagLi = $(this);
                    return false;
                }
            });

            return tagLi;
        },

        _lastTagWidget: function () {
            var self = this;
            return $("ul.inputTags > li.inputTags-tag:last", self.element);
        },

        _setTagWidget: function (tagWidget, newValue, data) {
            var self = this;
            tagWidget.empty();
            tagWidget.removeClass();
            tagWidget.off();

            var _label = $('<span class="inputTags-label"></span>').text(newValue.label);
            var _removeTagText = (self.option.abreast === true ? ';' : '\xd7');


            tagWidget.addClass('inputTags-tag')
                        .data("value", newValue.value)
                        .data("data", data)
                        .attr('title', newValue.desc)
                        .hover(function () {
                            $(this).addClass("inputTags-tag-style-hover");
                            _removeTagA.text('\xd7');
                        }, function () {
                            $(this).removeClass("inputTags-tag-style-hover");
                            _removeTagA.text(_removeTagText);
                        })
                        .append(_label);

            var _removeTagA = $('<a></a>') // \xd7 is an X
                .addClass('inputTags-close')
                .attr('title', "移除")
                .on("click", function (event) {
                    self._removeTag(tagWidget, true);
                    return false;
                })
                .text(_removeTagText);

            tagWidget.append(_removeTagA);

            if (jQuery.type(self.option.tagCss) === "string") {
                tagWidget.addClass(self.option.tagCss);
            }
        },

        _removeTag: function (tagWidget, animate) {
            var self = this;
            if (tagWidget == null) return;

            var tmpData = tagWidget.data("data");
            var tmpValue = tagWidget.data("value");

            if (jQuery.isFunction(self.option.beforeRemove)) {
                if (self.option.beforeRemove.call(self.element, tmpValue, tmpData) === false) {
                    return;
                }
            }

            var _remove = function () {
                tagWidget.remove();
                if (jQuery.isFunction(self.option.afterRemove)) {
                    self.option.afterRemove.call(self.element, tmpValue, tmpData);
                }
            }

            if (animate === true) {
                tagWidget.fadeOut('fast').hide('blind', { direction: (self.option.abreast === true ? 'horizontal' : 'vertical') }, 'fast', _remove).dequeue();
            } else {
                _remove();
            }

        },

        //增加一个标签。
        addTag: function (tag) {

            var self = this;
            var newValue = self._formatValue(tag);

            if (newValue.value == '') return false;

            if (self._getTagWidget(newValue.value) != null) return false;

            if (jQuery.isFunction(self.option.beforeAdd)) {
                if (self.option.beforeAdd.call(self.element, newValue.value, tag) === false) {
                    return false;
                }
            }

            var _tag = $('<li></li>');
            self._setTagWidget(_tag, newValue, tag);

            var newLi = $('ul.inputTags > li.inputTags-tag:last', self.element);
            if (newLi.length == 0) {
                $('ul.inputTags', self.element).prepend(_tag);
            } else {
                newLi.after(_tag);
            }

            if (jQuery.isFunction(self.option.afterAdd)) {
                self.option.afterAdd.call(self.element, newValue.value, tag, _tag);
            }
            return true;
        },

        //设置标签。
        setTags: function (tags) {
            var self = this;
            $("ul.inputTags > li.inputTags-tag", self.element).remove();

            if ($.isArray(tags)) {
                $.each(tags, function () {
                    self.addTag(this);
                });
            } else {
                self.addTag(tags);
            }
        },

        //创建文本输入框
        setInput: function (value) {
            var self = this;


            $('ul.inputTags li.inputTags-input', self.element).remove();
            if (!$.isEmptyObject(self.option.input)) {
                if (jQuery.type(self.option.input.css) === "string") {
                    $('ul.inputTags', self.element).removeClass(self.option.input.css);
                }
            }
            $('ul.inputTags', self.element).off('click.inputTags-input', '**');

            self.option.input = value;

            if (value == null || jQuery.isEmptyObject(value)) {
                //取消输入框
                return;
            }

            var setInputError = function () {
                _input.removeClass('error');
                if ($.trim(_input.val()) != '') {
                    _input.addClass('error');
                }
                _input.triggerHandler('update');
            };
            var _createInputTag = function (value, type) {
                if (jQuery.isFunction(self.option.input.onPartComplete)) {
                    value = self.option.input.onPartComplete.call(self.element, value, type);
                }
                var _type = jQuery.type(value);
                if (_type === "undefined" || _type === "null") {
                    setInputError();
                    return false;
                }

                var re = self.addTag(value);
                if (re) {
                    _input.val('');
                }
                setInputError();
                return re;

            };

            var isBreakKeyCodes = function (which) {
                var re = false;
                $.each(self.option.input.breakKeyCodes, function () {
                    if (this == which) {
                        re = true;
                        return false;
                    }
                });
                return re;
            };

            var update_input_timeout = null;
            var update_input = function (fun) {
                var _this = this;
                if (update_input_timeout != null) clearTimeout(update_input_timeout);
                update_input_timeout = setTimeout(function () {
                    update_input_timeout = null;
                    fun.call(_this);
                }, 100);
            };

            var _input = $('<input />').attr('type', 'text')
	            .keydown(function (event) {
	                // Backspace 用 keypress 检测不到, 这里使用 keydown.
	                if (event.which == $.ui.keyCode.BACKSPACE && _input.val() === '') {
	                    //删除最后一个标签。
	                    self._removeTag(self._lastTagWidget(), true);
	                }
	                if (isBreakKeyCodes(event.which)) {
	                    update_input(function () {
	                        _createInputTag(_input.val(), 'keydown');
	                    });
	                    event.preventDefault();
	                }
	            }).blur(function (e) {
	                if (_input.val() != '') {
	                    update_input(function () {
	                        _createInputTag(_input.val(), 'blur');
	                    });
	                }
	            });

            var _inputLi = $("<li />").addClass('inputTags-input')
	            .click(function (event) {
	                //if (document.activeElement != _input[0]) {
	                _input.not(':focus').focus();
	                //_input.focus();
	                //}
	                event.preventDefault();
	            })
	             .append(_input);

            var newLi = $('ul.inputTags > li.inputTags-tag:last', self.element);
            if (newLi.length == 0) {
                $('ul.inputTags', self.element).prepend(_inputLi);
            } else {
                newLi.after(_inputLi);
            }

            $('ul.inputTags', self.element).on('click.inputTags-input', function (event) {
                if ($(event.target).closest('li.inputTags-tag, li.inputTags-select').length == 0) {
                    //if (document.activeElement != _input[0]) {
                    _input.not(':focus').focus();
                    //_input.focus();
                    //}
                    event.preventDefault();
                }
            });

            if (!$.isEmptyObject(self.option.input.autocomplete)) {

                var customSelect = function () { return true; };
                if ($.isFunction(self.option.input.autocomplete.select)) {
                    customSelect = self.option.input.autocomplete.select;
                }

                var customFocus = function () { return true; };
                if ($.isFunction(self.option.input.autocomplete.focus)) {
                    customFocus = self.option.input.autocomplete.focus;
                }

                _input.autocomplete($.extend(true
	                , {}
	                , self.option.input.autocomplete
	                , {
	                    select: function (event, ui) {
	                        update_input(function () {
	                            if (customSelect.apply(this, arguments) === true) {
	                                _createInputTag(ui.item.value, 'select');
	                            }
	                        });
	                        return false;
	                    }
	                    , focus: function (event, ui) {
	                        if (customFocus.apply(this, arguments) === true) {
	                            _input.val(ui.item.label);
	                        }
	                        return false;
	                    }
	                }));
            }

            var _inputBorder;
            if (self.option.abreast === true) {
                _inputBorder = $('ul.inputTags', self.element);

                (function () {

                    var minWidth = 10,
                        comfortZone = 15,
                        maxWidth = function () {
                            return $(self.element).width();
                        },
                        val = '',
                        testSubject = $('<tester/>').css({
                            position: 'absolute',
                            top: -9999,
                            left: -9999,
                            width: 'auto',
                            fontSize: _input.css('fontSize'),
                            fontFamily: _input.css('fontFamily'),
                            fontWeight: _input.css('fontWeight'),
                            letterSpacing: _input.css('letterSpacing'),
                            whiteSpace: 'nowrap'
                        }),
                        check = function () {

                            if (val === (val = _input.val())) { return; }

                            // Enter new content into testSubject
                            var escaped = val.replace(/&/g, '&amp;').replace(/\s/g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            testSubject.html(escaped);

                            // Calculate new width + whether to change
                            var testerWidth = testSubject.width(),
                                newWidth = (testerWidth + comfortZone) >= minWidth ? testerWidth + comfortZone : minWidth,
                                currentWidth = _input.width(),
                                isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                                     || (newWidth > minWidth && newWidth < maxWidth());

                            // Animate width
                            if (isValidWidthChange) {
                                _input.width(newWidth);
                            }

                        };

                    testSubject.insertAfter(_input);

                    _input.width(comfortZone >= minWidth ? comfortZone : minWidth);

                    _input.bind('keyup keydown blur update paste', check);

                    check();

                })();

            } else {
                _inputBorder = _inputLi;
                _input.css({ 'width': '100%' });
            }

            if (jQuery.type(self.option.input.css) === "string") {
                _inputBorder.addClass(self.option.input.css);
            }

        },

        //创建选择按钮
        setSelect: function (value) {
            var self = this;
            self.option.select = value;

            $('ul.inputTags li.inputTags-select', self.element).remove();

            if (value == null || jQuery.isEmptyObject(value)) {
                //取消选择
                return;
            }

            var _selectLi = $("<li />").addClass('inputTags-select')
                                              .html(self.option.select.element);
            if (jQuery.type(self.option.select.css) === "string") {
                _selectLi.addClass(self.option.select.css);
            }

            _selectLi.on("click", function (event) {

                if (jQuery.isFunction(self.option.select.onFire)) {
                    var newTags = self.option.select.onFire.call(self.element);
                    var _type = jQuery.type(newTags);
                    if (_type === "undefined" || _type === "null") {
                        return;
                    }
                    if ($.isArray(newTags)) {
                        $.each(newTags, function () {
                            self.addTag(this);
                        });
                    } else {
                        self.addTag(newTags);
                    }
                }

            });

            $('ul.inputTags', self.element).append(_selectLi);
        },

        //获取标签
        getTags: function () {
            var self = this;
            var newTags = new Array();
            $("ul.inputTags > li.inputTags-tag", self.element).each(function () {
                newTags.push($(this).data("data"));
            });
            return newTags;
        },

        //获取标签的值
        getTagsValue: function () {
            var self = this;
            var newTags = new Array();
            $("ul.inputTags > li.inputTags-tag", self.element).each(function () {
                newTags.push($(this).data("value"));
            });
            return newTags;
        },

        //改变标签的值
        updateTag: function (tag, value) {
            var self = this;
            var newValue = self._formatValue(value);
            if (newValue.value == '') return;

            if (self._formatValue(tag).value != newValue.value) {
                if (self._getTagWidget(newValue.value) != null) return;
            }

            var tagLi = self._getTagWidget(tag);

            if (tagLi != null) {
                if (jQuery.isFunction(self.option.beforeUpdate)) {
                    if (self.option.beforeUpdate.call(self.element, newValue.value, value, tagLi[0]) === false) {
                        return;
                    }
                }
                self._setTagWidget(tagLi, newValue, value);
                if (jQuery.isFunction(self.option.afterUpdate)) {
                    self.option.afterUpdate.call(self.element, newValue.value, value, tagLi[0]);
                }
            }

        },

        //移除标签
        removeTag: function (tag) {
            var self = this;
            self._removeTag(self._getTagWidget(tag));
        },

        //移除全部标签
        removeTags: function () {
            var self = this;
            $("ul.inputTags > li.inputTags-tag", self.element).remove();
        },

        //获取标签的数据
        getTag: function (tag) {
            var self = this;
            var tagLi = self._getTagWidget(tag);
            if (tagLi != null) {
                return tagLi.data("data");
            }
            return null;
        }

    };

})(jQuery);