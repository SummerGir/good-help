(function ($, undefined) {

    $.selector = function (opt) {
        var self = {};
        $.extend(true, self, {
            option: $.extend(true, {}, $.selector.option, opt),
            //template: new $.selector.template(self),
            _events: {},
            values: [],
            _datas: {},
            on: function (event, fn) {
                if (!$.isArray(self._events[event])) {
                    self._events[event] = [];
                }
                for (var i = 0, j = self._events[event].length; i < j; i++) {
                    if (self._events[event][i] === fn) {
                        return;
                    }
                }
                self._events[event].push(fn);
            },
            trigger: function (event) {
                if ($.isArray(self._events[event])) {
                    var args = [];
                    for (var i = 1, j = arguments.length; i < j; i++) {
                        args.push(arguments[i]);
                    }
                    for (var i = 0, j = self._events[event].length; i < j; i++) {
                        self._events[event][i].apply(self, args);
                    }
                }
            },
            off: function (event) {
                if ($.isArray(self._events[event])) {
                    if (arguments.length == 1) {
                        self._events[event].length = 0;
                    } else {
                        $.grep(self._events[event], function (n, i) {
                            return n === arguments[1];
                        }, true);
                    }
                    if (self._events[event].length == 0) {
                        self._events[event] = undefined;
                    }
                }
            },
            _triggerAdd: function (key, data) {
                if (arguments.length == 1) {
                    data = self.format(key);
                }
                if (data === undefined || data === null) {
                    return;
                }
                if (arguments.length == 2) {
                    self._datas[key] = data;
                }
                if (self.values.indexOf(key) == -1) {
                    if (self.option.multiple == false && self.values.length >= 1) {
                        var tmpValues = self.values.concat([]);
                        for (var i = 0, j = tmpValues.length; i < j; i++) {
                            self._triggerRemove(tmpValues[i]);
                        }
                        self.values.length = 0;
                    }

                    self.values.push(key);
                    if ($.isArray(data)) {
                        $.each(data, function () {
                            self.trigger("add", key, this);
                        });
                    } else {
                        self.trigger("add", key, data);
                    }
                }
            },
            _triggerRemove: function (key) {
                self.values.remove(key);
                self.trigger("remove", key);
            },
            format: function (key) {
                var keys = [];
                if ($.isArray(key)) {
                    for (var i = 0, j = key.length; i < j; i++) {
                        if ($.type(self._datas[key[i]]) === "undefined") {
                            keys.push(key[i]);
                        }
                    }
                } else {
                    if ($.type(self._datas[key]) === "undefined") {
                        keys.push(key);
                    }
                }
                if ($.isFunction(self.option.format)) {
                    var res = self.option.format.call(self, keys);
                    for (var i = 0, j = res.length; i < j; i++) {
                        self._datas[res[i].value] = res[i];
                    }
                } else {
                    for (var i = 0, j = keys.length; i < j; i++) {
                        self._datas[keys[i]] = keys[i];
                    }
                }
                if ($.isArray(key)) {
                    keys = [];
                    for (var i = 0, j = key.length; i < j; i++) {
                        keys.push(self._datas[key[i]]);
                    }
                    return keys;
                } else {
                    return self._datas[key];
                }
            }
        });

        if ($.isArray(self.option.values)) {
            self.values = self.option.values.slice(0);
            for (var i = 0, j = self.values.length; i < j; i++) {
                self.values[i] = $.trim(self.values[i]);
            }
            self.values.unique();
            self.values.remove("");
            if (self.option.multiple == false && self.values.length > 1) {
                self.values.length = 1;
            }
        }

        var _tabs = [];
        $.each(self.option.tabs, function () {
            if ($.isFunction($.selector.template[this.template])) {
                _tabs.push(this);
            }
        });

        self.option.tabs = _tabs;

        var result = null;
        if (self.option.tabs.length > 0) {
            var width = 500, height = 570;
            if (self.option.multiple) {
//                width = ($.browser.msie && $.browser.version == "6.0") ? 607 : 600;
                width = 600;
            }
//            if($.browser.msie && $.browser.version == "6.0") height = 620;

            //for debug
//            window.s = self;
//            window.open("/public/jquery/selector/jquery.selector.jsp");
            //result = showModalDialog('/public/jquery/selector/jquery.selector.jsp', self, 'dialogWidth:' + width + 'px;dialogHeight:570px;help:no;scroll:no;status:no;resizable:no;center:yes')
            result = showModalDialog('/public/jquery/selector/jquery.selector.jsp', self, 'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;help:no;scroll:no;status:no;resizable:no;center:yes')
        }

        return result;
    };


    $.selector.option = {
        title: '数据',
        tabs: [
            //                {
            //                    label: ''
            //                    , template: ''
            //                    , option: {}
            //                }
        ],
        multiple: true,
        values: [],
        format: null,
        define: null,
        cancel: null,
        //dialog: '/PublicFunction/jQuery/Selector/jquery.selector.aspx'
        dialog: '/public/jquery/selector/jquery.selector.jsp'
    };

    $.selector.template = {};

})(jQuery);

(function ($, undefined) {
    $.selector.template['tree'] = function (selector, opt) {
        this.selector = selector;
        this.option = $.extend(true, {}, this.option, opt);
        if ($.isArray(this.option.data)) {
            var param = {};
            $.each(this.option.data, function () {
                param[this.name] = this.value;
            });
            this.option.data = param;
        }
    };
    $.selector.template['tree'].prototype = {
        loadComponent: [
            EIIS.Common.jQuery.dynatree
        ],
        selector: null,
        option: {
            url: '',
            data: {},
            key: 'Key',
            keyPath: 'KeyPath'
        },
        resize: function (width, height) {
            this._element.css({
                'overflow': 'auto'
            });
        },
        _element: null,
        _formatData: function (data) {
            var res = [];
            var self = this;
            if ($.type(data) === 'array') {
                $.each(data, function () {
                    res.push({
                        title: $.type(this.title) === 'string' ? this.title : null,
                        key: $.type(this.key) === 'string' ? this.key : null,
                        isFolder: $.type(this.isFolder) === 'boolean' ? this.isFolder : false,
                        isLazy: $.type(this.isLazy) === 'boolean' ? this.isLazy : false,
                        expand: $.type(this.expand) === 'boolean' ? this.expand : false,
                        tooltip: $.type(this.tooltip) === 'string' ? this.tooltip : null,
                        icon: $.type(this.icon) === 'string' ? this.icon : null,
                        select: ($.type(this.select) === 'boolean' ? this.select : false) ? true : (self.selector.values.indexOf(this.key) >= 0),
                        hideCheckbox: $.type(this.unselectable) === 'boolean' ? this.unselectable : false,
                        unselectable: $.type(this.unselectable) === 'boolean' ? this.unselectable : false,
                        children: $.type(this.children) === 'array' ? self._formatData(this.children) : null
                    });
                });
            }
            return res.length == 0 ? null : res;
        },
        create: function (element) {//alert(a);
            var self = this;
            self._element = element;
            $.ajax({
                traditional: true,
                dataType: "json",
                url: self.option.url,
                data: self.option.data,
                success: function (data) {
                    var eventKeys = [];
                    element.dynatree({
                        checkbox: true,
                        selectMode: (self.selector.option.multiple ? 2 : 1),
                        children: self._formatData(data),
                        autoFocus: false,
                        onLazyRead: function (node) {
                            var param = $.extend(true, {}, self.option.data);
                            param[self.option.key] = node.data.key;
                            param[self.option.keyPath] = node.getKeyPath();
                            $.ajax({
                                traditional: true,
                                dataType: "json",
                                url: self.option.url,
                                data: param,
                                success: function (data) {
                                    node.setLazyNodeStatus(0);
                                    node.addChild(self._formatData(data));
                                },
                                error: function (jqXHR) {
                                    node.setLazyNodeStatus(-1, {
                                        tooltip: jQuery.ajaxErrorMessager(jqXHR),
                                        info: '载入数据错误'
                                    });
                                }
                            });
                        },
                        onSelect: function (select, node) {
                            if (eventKeys.indexOf(node.data.key) == -1) {
                                if (select) {
                                    self.selector._triggerAdd(node.data.key);
                                } else {
                                    self.selector._triggerRemove(node.data.key);
                                }
                            }
                        }
                    });

                    self.selector.on('add', function (key, data) {
                        eventKeys.push(key);
                        element.dynatree("getTree").selectKey(key, true);
                        eventKeys.remove(key);
                    });
                    self.selector.on('remove', function (key) {
                        eventKeys.push(key);
                        element.dynatree("getTree").selectKey(key, false);
                        eventKeys.remove(key);
                    });
                },
                error: function (jqXHR) {
                    element.css({ 'color': 'red' })
                        .text(jQuery.ajaxErrorMessager(jqXHR));
                }
            });
        }
    }
})(jQuery);

(function ($, undefined) {
    $.selector.template['find_grid'] = function (selector, opt) {
        this.selector = selector;
        this.option = $.extend(true, {}, this.option, opt);
    };
    $.selector.template['find_grid'].prototype = {
        loadComponent: [
            EIIS.Common.jQuery.jqGrid,
            EIIS.Common.jQuery.highlight
        ],
        selector: null,
        option: {
            url: '',
            data: {},
            key: 'Key',
            colModel: [
                //   		        { label: 'NTID', name: 'NTID',  key: true }
                //                , { label: 'Name', name: 'Name' }
                //                , { label: 'Department', name: 'department' }
            ]
        },
        resize: function (width, height) {
            //var guidHeight = height - (this._gridElement.parents('.ui-jqgrid').outerHeight() - this._gridElement.parents('.ui-jqgrid-bdiv').height()) - 8;
            //this._gridElement.jqGrid('setGridHeight', guidHeight)
            //                          .jqGrid('setGridWidth', width - 2);
            //this._gridElement.jqGrid('autoFit');
        },
        _gridElement: null,
        _input: null,
        create: function (element) {
            var self = this;
            var _id = 'find_grid_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

            self._gridElement = $('<table />').attr({
                'cellpadding': '0',
                'cellspacing': '0',
                'id': _id
            }).appendTo(element);

            var _colModel = [
                {
                    name: '', index: 'checkbox', width: 22, search: false, sortable: false, align: 'center', formatter: function (e, row) {
                    return '<input type="checkbox" id="checkbox_' + _id + '" value="' + row.rowId + '" ' + (self.selector.values.indexOf(row.rowId) >= 0 ? 'checked="checked"' : '') + ' />';
                }
                }
            ];
            $.each(self.option.colModel, function () {
                _colModel.push({
                    label: this.label, name: this.name, search: false, sortable: true, key: this.key, hidden: this.hidden
                });
            });

            var eventKeys = [];

            self._gridElement.jqGrid({
                autoFit: true,
                datatype: "local",
                //                multiselect: true,
                //                multiboxonly: true,
                toolbar: [true, "top"],
                viewrecords: true,
                hidegrid: false,
                gridComplete: function () {
                    $('#checkbox_' + _id, self._gridElement).on('change', function () {
                        if (eventKeys.indexOf($(this).val()) == -1) {
                            if ($(this).prop('checked')) {
                                self.selector._triggerAdd($(this).val());
                            } else {
                                self.selector._triggerRemove($(this).val());
                            }
                        }
                    });
                },
                colModel: _colModel
            });

            self.selector.on('add', function (key, data) {
                eventKeys.push(key);
                $('#checkbox_' + _id + '[value="' + key + '"]', self._gridElement).prop('checked', true);
                eventKeys.remove(key);
            });
            self.selector.on('remove', function (key) {
                eventKeys.push(key);
                $('#checkbox_' + _id + '[value="' + key + '"]', self._gridElement).prop('checked', false);
                eventKeys.remove(key);
            });

            var cache = {}, lastXhr;

            var updateGrid = function () {
                var term = $.trim(self._input.val());
                if (term != '') {

                    var updateData = function (data) {
                        self._gridElement.clearGridData();
                        self._gridElement.jqGrid('setGridParam', {
                            data: data
                        }).trigger("reloadGrid");
                        self._gridElement.highlight(term);
                        $(".highlight", self._gridElement).css({ backgroundColor: "#FFFF88" });
                    }

                    if (term in cache) {
                        updateData(cache[term]);
                        return;
                    }

                    var param = [
                        { name: self.option.key, value: term }
                    ];
                    if ($.isArray(self.option.data)) {
                        param.push(self.option.data);
                    } else if (!$.isEmptyObject(self.option.data)) {
                        for (var extP in self.option.data) {
                            param.push({ name: extP, value: self.option.data[extP] });
                        }
                    }

                    lastXhr = $.ajax({
                        traditional: true,
                        url: self.option.url,
                        data: param,
                        type: "POST",
                        dataType: "json",
                        success: function (data, status, xhr) {
                            if ($.isArray(data)) {
                                cache[term] = data;
                            } else {
                                cache[term] = data["rows"];
                            }
                            if (xhr === lastXhr) {
                                updateData(cache[term]);
                            }
                        }
                    });

                }
            }

            self._input = $('<input />').attr({
                'type': 'text'
            })
                .addClass('webui')
                .on("keypress", function (e) {
                    if (e.which == 13) {
                        e.which = 0;
                        updateGrid();
                        //event.preventDefault();
                        e.preventDefault();
                    }
                });

            $("#t_" + _id, element).append(self._input)
                .append($("<button>搜索</button>")
                    .addClass('webui')
                    .on('click', updateGrid));
            setTimeout(function () {
                $("#t_" + _id, element).height(function () {
                    var _height = 0;
                    $(this).children().each(function () {
                        if ($(this).outerHeight() > _height) _height = $(this).outerHeight();
                    });
                    return _height + 1;
                });
            }, 100);


        }
    }
})(jQuery);