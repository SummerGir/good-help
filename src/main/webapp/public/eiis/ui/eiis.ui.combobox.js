(function ($, undefined) {

    var FUZZY = 0;
    var STARTS = 1;

    EIIS.UI.register("combobox", {
        _jqElement: null,
        _jqTagElement: null,
        _innerVal: false,
        _params: null,
        _isSetValue: false,
        _optionData: null,
        _inserValue: null,
        create: function () {
            var self = this;
            self._jqElement = $(self.element);
            if (self.element.tagName.toLowerCase() != "select") throw ("初始化标签不是select!");
            /*
             readonly:只读
             dataInput:是否允许输入
             dataInsert:是否允许新增
             placeholder:提示语(dataInput=true时生效)
             getValueByText:
             当dataInsert=true，控件失去焦点时注册getValueByText事件,
             若用户输入元素无法与已有元素匹配，则通过用户输入内容及getValueByText()返回值新增option，
             该option为选中状态，但不被显示到选择列表。
             */
            var params = {
                readonly: self._jqElement.prop('disabled'),
                dataInput: self._jqElement.attr('data-input') ? Boolean.parse(self._jqElement.attr('data-input')) : false,
                dataInsert: self._jqElement.attr('data-insert') ? Boolean.parse(self._jqElement.attr('data-insert')) : false,
                placeholder: self._jqElement.attr('placeholder') ? self._jqElement.attr('placeholder') : "必填",
                getValueByText: function (values) {
                    self._inserValue = self._jqElement.triggerHandler("formatvalue.combobox.eiis", [values]);
                }
            };

            self._params = params;
            if (!params.dataInput) {
                self._jqElement.addClass("form-control");
            } else {
                self._jqElement.hide();
                self._optionData = {};
                var optionData = {};
                var pinyinData = {};

                self._jqElement.on("refreshdata.combobox.eiis", function () {
                    self._optionData = {};
                    optionData = {};
                    self._jqElement.find("option").each(function (i, o) {
                        self._optionData[$(o).attr("value")] = $(o).text();
                        optionData[$(o).text()] = $(o).attr("value");
                        var temp = $(o).attr("data-pinyin");
                        if (String.isNullOrWhiteSpace(temp)) {
                            pinyinData[$(o).text()] = {};
                        } else {
                            pinyinData[$(o).text()] = $.parseJSON(temp);
                        }

                    });
                });
                self._jqElement.triggerHandler("refreshdata.combobox.eiis");

                var random = new Date().valueOf();
                var inputCboId = '#eiis-inputCbo' + random;

                self._jqTagElement = $("<div/>").addClass("input-group").insertAfter(self._jqElement);
                this._jqTagElement = self._jqTagElement;
                var inputCbo = $('<input type="text">').addClass("form-control").attr("id", inputCboId).attr("placeholder", params.placeholder);
                var inputCboBtnDiv = $('<div/>').addClass('input-group-btn');
                var inputCboBtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button>');
                var selectMenu = $('<ul style="max-height:250px;overflow-y: auto" role="menu"/>').addClass("dropdown-menu").addClass('dropdown-menu-right').addClass('mySelectMenu');
                inputCboBtnDiv.append(inputCboBtn);
                inputCboBtnDiv.append(selectMenu);

                self._selectMenu = selectMenu;
                self._jqTagElement.append(inputCbo);
                self._jqTagElement.append(inputCboBtnDiv);
                var selectWidth = inputCbo.outerWidth() + inputCboBtn.outerWidth();
                selectMenu.css("width", selectWidth + "px");

                var isSelectData = false;

                var searchKey = function (text, term) {
                    if (String.isNullOrWhiteSpace(term)) return true;

                    var lcTerm = term.toLowerCase();
                    if (text.toLowerCase().indexOf(lcTerm) >= 0) return true;

                    var pyd = pinyinData[text];

                    for (var key in pyd) {
                        if (pyd[key] == FUZZY) {
                            if (key.indexOf(lcTerm) >= 0) {
                                return true;
                            }
                        } else if (pyd[key] == STARTS) {
                            if (key.startsWith(lcTerm)) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                var resetMenu = function (params) {
                    selectMenu.empty();
                    if (optionData != null) {
                        $.each(optionData, function (text, id) {
                            if (!searchKey(text, params.term)) {
                                return;
                            }

                            var a = $('<a/>').attr("href", "javascript:void(0)").text(text);
                            var li = $('<li data_id="' + id + '" data_text="' + text + '"/>').append(a);
                            li.on('click', function () {
                                self._innerVal = true;
                                inputCbo.val($(this).attr("data_text"));
                                self._jqElement.val($(this).attr("data_id"));
                                if(inputCbo.val().trim().length > 0 ) {
                                    self._jqTagElement.css("border", "1px solid #fff");
                                }
                                self._innerVal = false;
                                self._jqElement.trigger("change", $(this).attr("data_id"));
                            });
                            selectMenu.on('mousemove', function () {
                                isSelectData = true;
                            });
                            selectMenu.on('mouseout', function () {
                                isSelectData = false;
                            });

                            selectMenu.append(li);
                            selectMenu.css("width", inputCbo.outerWidth() + inputCboBtn.outerWidth() + "px");
                            selectMenu.show();
                        });
                    }
                };

                var defaultValue = self._jqElement.val();
                var defaultText = self._jqElement.find("option:selected").text();
                if (!String.isNullOrWhiteSpace(defaultValue)) {
                    self._isSetValue = true;
                    self._innerVal = true;
                    inputCbo.val(defaultText);
                    self._jqElement.val(defaultValue);
                    self._innerVal = false;
                }

                var findData = function (isNull) {
                    selectMenu.empty();
                    if (!isNull || !String.isNullOrWhiteSpace(inputCbo.val().trim())) {
                        params.ids = null;
                        params.term = inputCbo.val().trim();
                        resetMenu(params);
                        selectMenu.css("height","auto");
                    }else{
                        selectMenu.css("height","10px");
                    }
                    selectMenu.show();
                };

                if(!EIIS.browser.phone){
                    inputCboBtn.on('blur', function () {//失去焦点
                        if (!isSelectData) {
                            isSelectData = false;
                            selectMenu.hide();
                        }
                    });

                }

                inputCboBtnDiv.on('click', function () {//点击事件
                    if (selectMenu.is(":hidden")) {
                        $(".mySelectMenu").hide();
                        params.ids = null;
                        //params.term = inputCbo.val().trim();
                        params.term = null;
                        resetMenu(params);
                        selectMenu.css("height","auto");
                    } else {
                        selectMenu.hide();
                    }
                })



                inputCbo.on('input', function () {//输入事件
                    if (!self._isSetValue && (!String.isNullOrWhiteSpace(inputCbo.val().trim()) || String.isNullOrWhiteSpace(inputCbo.val().trim()) && !selectMenu.is(":hidden"))) {
                        findData(true);
                    }
                    self._isSetValue = false;
                });

                inputCbo.on('focus', function () {//获取焦点
                    self._jqTagElement.css("border","1px solid #fff");
                    if (!String.isNullOrWhiteSpace(inputCbo.val().trim())) {
                        findData(false);
                    }
                });

                inputCbo.on('blur', function () {//失去焦点
                    if (!isSelectData) {
                        isSelectData = false;
                        selectMenu.hide();
                    }
                    var text = inputCbo.val().trim();
                    var value = optionData[text];
                    if (params.dataInsert) {
                        if (String.isNullOrWhiteSpace(value)) {
                            params.getValueByText.apply(self, [text]);
                            value = self._inserValue;
                        }
                        if (String.isNullOrWhiteSpace(value)) {
                            value = text;
                        }
                        var insertOption = self._jqElement.find("option[class='eiis-combobox-insert-option']");
                        if (insertOption.length > 0) {
                            insertOption.text(text);
                            insertOption.attr("value", value);
                        } else {
                            self._jqElement.append('<option value="' + value + '" class="eiis-combobox-insert-option">' + text + '</option>');
                        }
                        self._innerVal = true;
                        self._jqElement.val(value);
                        self._innerVal = false;
                    } else {
                        if (String.isNullOrWhiteSpace(value)) {
                            value = "";
                        }
                        self._innerVal = true;
                        self._jqElement.val(value);
                        self._innerVal = false;
                    }
                });

                inputCboBtnDiv.on('blur', function () {//失去焦点
                    if (!isSelectData) {
                        isSelectData = false;
                        selectMenu.hide();
                    }
                })

                if (params.readonly) {
                    self._jqTagElement.tagsinput("setReadOnly", true);
                }
            }
        },
        setDisabled: function (value) {
            if (this._jqTagElement) {
                this._jqTagElement.tagsinput("setReadOnly", value);
            } else {
                this._jqElement.tagsinput("setReadOnly", value);
            }
        },
        destroy: function () {
            if (this._jqTagElement) {
                this._jqTagElement.removeClass("form-control");
                this._jqElement.off("combobox.eiis");
            } else {
                this._jqElement.removeClass("form-control");
            }
        },
        setValue: function (value) {
            var self = this;
            if (self._jqTagElement) {
                if (!self._innerVal) {
                    self._jqTagElement.find("input").eq(0).val(this._optionData[value]);
                    self._isSetValue = true;
                }
            }
            self._jqElement.val(value);
        },
        isDisabled: function () {
            if (this._jqTagElement) {
                return this._jqTagElement.tagsinput("isReadOnly");
            } else {
                return this._jqElement.tagsinput("isReadOnly");
            }
        }
    });
})(jQuery);