(function ($, undefined) {

    function doGetCaretPosition(oField) {
        var iCaretPos = 0;
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') {
            iCaretPos = oField.selectionStart;
        }
        return (iCaretPos);
    }

    var tagsinput = function (element, option) {
        var self = this;
        self.option = $.extend(true, {}, $.fn.tagsinput.option, option);
        self.element = element;
        self._jqElement = $(self.element);

        self._create();

        return self;
    };
    tagsinput.prototype = {
        option: null,
        element: null,
        _jqElement: null,
        _jqPanel: null,
        _jqTags: null,
        _jqMenu: null,
        _jqInput: null,
        _jqButton: null,
        _sourceTimeoutId: null,
        _menuTimeoutId: null,
        _menuFocusElement: null,
        _tags: null,
        _menus: null,
        _currentSourceVal: null,
        _cacheSource: null,
        _readOnly: false,
        _placeholder:"",
        setReadOnly: function (value) {
            var self = this;
            if (self._readOnly == value)return;
            self._readOnly = value;
            if (self._readOnly == true) {
                if (self._jqInput != null) {
                    self._jqInput.prop("disabled", true);
                    self._jqInput.hide();
                }

                /*只读状态去掉篮筐背景 ↓↓↓*/
                self._jqTags.css({
                    'background': '#eee',
                    'cursor': 'not-allowed'
                });
                self._jqTags.find('>span').css({
                    'color':'#555',
                    'background':'#eee',
                    'max-width': '99%',
                    'text-align': 'left'
                });
                self._jqTags.find('>input').hide();
                /*↑↑↑↑↑*/

                self._jqTags.find("span>i").hide();
                if (self._jqButton != null) {
                    self._jqButton.hide();
                }
                //取消只读状态的点击事件
                if(self._readOnly)self._jqPanel.unbind('click').unbind('dblclick');
            } else {
                if (self._jqInput != null) {
                    self._jqInput.prop("disabled", false);
                    self._jqInput.show();
                }
                self._jqTags.find("span>i").show();
                if (self._jqButton != null) {
                    self._jqButton.show();
                }
            }
        },
        setReadOnlyNew : function(){
            var self=this;
            self._jqInput.attr("disabled",true);
        },
        isReadOnly: function () {
            return this._readOnly;
        },
        getIds: function () {
            return this._tags.keys();
        },
        getValues: function () {
            return this._tags.values();
        },
        setPlaceholder:function(placeholder){
            this._placeholder = placeholder;
        },

        // 上一页
        prePage_:function(value){
            $("#btn1").attr("disabled","true"); //页面加载完成后才能再次点击
            var self = this;
            var postDate = value[0].params;
            if(value[0].page_*1 > 1){
                postDate.page = value[0].page_*1-1;
            }else{
                postDate.page = 1;
            }
            postDate.term = value[0].find;
            $.ajax({
                dataType: 'json', cache: false,
                url: '/app/dicinfo/control/selector.dicinfo.query.jsp',
                data: postDate,
                success: function (results) {
                    self._cacheSource.put(postDate.term, results);
                    self._sourceCallback(results);
                }
            });
        },
        // 下一页
        nextPage_:function (value){
            $("#btn2").attr("disabled","true"); //页面加载完成后才能再次点击
            var self = this;
            var postDate = value[0].params;
            postDate.page = value[0].page_*1+1;
            postDate.term = value[0].find;
            $.ajax({
                dataType: 'json', cache: false,
                url: '/app/dicinfo/control/selector.dicinfo.query.jsp',
                data: postDate,
                success: function (results) {
                    self._cacheSource.put(postDate.term, results);
                    self._sourceCallback(results);
                }
            });
        },

        putTag: function (value) {
            var self = this;
            if ($.isArray(value)) {
                for (var i = 0, j = value.length; i < j; i++) {
                    self._putTag(value[i]);
                }
            } else {
                self._putTag(value);
            }

            self._setInput();
        },
        _putTag: function (value) {
            var self = this;
            if (self._tags.containsKey(value[self.option.idKey])) {
                var jqTag = self._jqTags.children("span[data-tag-id=\"" + value[self.option.idKey] + "\"]")
                    .removeClass("tagsinput-selected-prompt");
                //if (jqTag.is(":visible")) {
                window.setTimeout(function () {
                    jqTag.addClass("tagsinput-selected-prompt");
                    window.setTimeout(function () {
                        jqTag.removeClass("tagsinput-selected-prompt");
                    }, 5000);
                }, 0);
                //}
                return;
            }

            self._tags.put(value[self.option.idKey], value);

            var tagClass = self.option.tagClass;
            if ($.isFunction(tagClass)) {
                tagClass = tagClass(value);
            }

            var isContract_ = false;
            //合同选择器进行text处理
            if("sign_" in value && value.sign_ == "contractSelector"){
                isContract_ = true;
            }

            var jqTag = null;
            //计算是否超出文本框
            var len = 0;
            if(self._jqPanel.children(".tags").width() == 100){//label默认宽度，用于选择弹出框的显示
                len = value[self.option.displayKey].length - 260/17;
            }else {
                len = (isContract_?value[self.option.displayKey].split(" ")[0].length:value[self.option.displayKey].length) - self._jqPanel.children(".tags").width()/17;
            }

            if(EIIS.browser.phone && len > 0){
                //计算需要截取的字符
                var subt = value[self.option.displayKey].length - len;
                jqTag = $("<div/>").append($("<span/>")
                    .text((isContract_?value[self.option.displayKey].split(" ")[0]:value[self.option.displayKey]).substring(0,subt)+"...")
                    .append("<i class=\"glyphicon glyphicon-remove\"></i>")
                    .attr("data-tag-id", value[self.option.idKey])
                    .addClass(tagClass)
                );
            }else {
                jqTag = $("<div/>").append($("<span/>")
                    .text(isContract_?value[self.option.displayKey].split(" ")[0]:value[self.option.displayKey])
                    .append("<i class=\"glyphicon glyphicon-remove\"></i>")
                    .attr("data-tag-id", value[self.option.idKey])
                    .addClass(tagClass)
                );
            }

            var tagHtml = jqTag.html();
            tagHtml += " ";
            if (self._jqInput == null) {
                self._jqTags.append(tagHtml);
            } else {
                self._jqInput.before(tagHtml);
            }
            self._jqElement.triggerHandler("put.tagsinput", [value[self.option.idKey], value]);
            // 如果输入框有内容，取消占位符提示
            if(self._jqInput){
                if(self._jqInput.val().lengthb() == 0 && self._jqPanel.find(".label-info").length > 0){
                    self._jqInput.attr("placeholder", "").hide();
                    self._jqPanel.css("border","1px solid #ccc");
                }
            }

        },
        removeTag: function (id) {
            var self = this;
            self._jqTags.children("span[data-tag-id=\"" + id + "\"]").remove();
            var value = self._tags.get(id);
            self._tags.remove(id);
            self._jqElement.triggerHandler("remove.tagsinput", [id, value]);

            self._setInput();
        },
        clearTag: function () {
            var self = this;
            var ids = self.getIds();
            var values = self.getValues();
            self._jqTags.children("span").remove();
            self._tags.clear();
            self._jqElement.triggerHandler("clear.tagsinput", [ids, values]);
        },
        putMenu: function (value) {
            var self = this;
            var butn1 = $("<li class='text-center'><button type='button' name='btn1' id='btn1' class='btn btn-info btn-primary btn-sm' >向上翻页</button></li> ");
            var butn2 = $("<li class='text-center'><button type='button' name='btn2' id='btn2' class='btn btn-info btn-primary btn-sm' >向下翻页</button></li> ");
            if (self._jqMenu == null) {
                self._jqMenu = $("<ul class=\"dropdown-menu tag-dropdown-menu menu-ul\" role=\"menu\">")
                    .appendTo(self._jqPanel)
                    .on("click", "li", function () {
                        if (self._menuTimeoutId != null) {
                            window.clearTimeout(self._menuTimeoutId);
                            //self._menuFocusElement.focus();
                        }
                        if(self.option.multiple==false){
                            self.clearTag();
                        }
                        self.putTag(self._menus.get($(this).attr("data-menu-id")));
                        if (self._jqInput != null) {
                            self._jqInput.val("");
                            self._jqInput.trigger("focus");
                        }
                    }).on("mouseenter", "li", function () {
                        self._jqMenu.children().removeClass("active");
                        $(this).addClass("active");
                        //console.log("mouseenter");
                    });
            }

            if ($.isArray(value)) {
                // 如果为材料字典则进行分页
                if(value.length > 0 && value[0]!=null && value[0].params){
                    if(value[0].page_ > 1) {
                        butn1.on("click",function(){
                            self.prePage_(value);
                        });
                        self._jqMenu = self._jqMenu.append(butn1);
                    }
                }

                for (var i = 0, j = value.length; i < j; i++) {
                    self._putMenu(value[i]);
                }
                // 如果为材料字典则进行分页
                if(value[0]!=null && value.length > 0 && value[0].params){
                    if(value.length == 15 && value[0].flag_) {
                        butn2.on("click",function(){
                            self.nextPage_(value);
                        });
                        self._jqMenu = self._jqMenu.append(butn2);
                    }
                }
                if(value.length ==0 || value[0]==null || value==null){
                    var li = $("<li class='rs_none'><i class='fa fa-exclamation-circle'/> <span>未搜索到相关信息</span></li>");
                    self._jqMenu.append(li);
                }
            } else {
                self._putMenu(value);
            }
        },
        _putMenu: function (value) {
            var self = this;
            var itemHtml;
            if(value!=null){
                self._menus.put(value[self.option.idKey], value);
                itemHtml = value[self.option.displayKey];
            }
            if ($.isFunction(self.option.menuTemplate)) {
                itemHtml = self.option.menuTemplate(value);
            }
            if(value!=null && value.IsValid!=false){
                $("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"javascript:void(0)\">" + itemHtml + "</a></li>")
                    .attr("data-menu-id", value[self.option.idKey])
                    .appendTo(self._jqMenu);
            }else{
                if(value!=null)
                $("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"javascript:void(0)\" style=\'background-color:#eeeeee\'>" + itemHtml + "</a></li>")
                    .attr("data-menu-id", value[self.option.idKey])
                    .appendTo(self._jqMenu)
                    .css('pointer-events','none');
            }

        },
        clearMenu: function () {
            var self = this;
            if (self._jqMenu != null) {
                self._jqMenu.children("li").remove();
                self._menus.clear();
            }
        },
        _source: function () {
            var self = this;
            self._sourceTimeoutId = null;
            var val = self._jqInput.val();
            self._currentSourceVal = val;

            if (self.option.input.cache === true
                && self._cacheSource.containsKey(val)) {
                self._sourceCallback(self._cacheSource.get(val));
            } else {
                self.option.input.source(val, function (value) {
                    self._cacheSource.put(val, value);
                    self._sourceCallback(value);
                });
            }
        },
        _sourceCallback: function (value) {
            var self = this;
            self.clearMenu();
            self.putMenu(value);
            self._showMenu();
        },
        _showMenu: function () {
            var self = this;
            if (self._jqMenu != null) {
                if (self._jqMenu.is(":hidden")) {
                    self._jqMenu.children().removeClass("active");
                    if(self._menus.elements.length>0 && self._menus.elements[0].value.IsValid!=undefined && self._menus.elements[0].value.IsValid==true){
                        self._jqMenu.children(":first()").addClass("active");
                    }
                    self._jqMenu.show();
                    //console.log("showMenu");
                    //console.trace();
                }
            }
        },
        _hideMenu: function () {
            var self = this;
            if (self._jqMenu != null) {
                if (self._jqMenu.is(":visible")) {
                    self._jqMenu.children().removeClass("active");
                    self._jqMenu.hide();
                    self._currentSourceVal = null;
                }
            }
        },
        _showInput: function () {
            var self = this;
            //如果元素为隐藏,则将它显现
            if(self._jqInput){
                if(self._jqInput.is(":hidden")){
                    self._jqInput.show().trigger("focus")
                }
            }
        },
        _hideInput: function (inputSize) {
            var self = this;
            if(self._jqInput.val().lengthb() > 0){//input输入框中有内容
                self._jqInput.attr('size', Math.max(inputSize, self._jqInput.val().lengthb()));
            }else {
                if(self._jqPanel.find(".label-info").length > 0){
                    self._jqInput.hide();
                }else {
                    self._jqInput.show(); //用于显示占位符（解决手机上显示不完问题）
                }
            }
        },
        _setInput: function () {
            var self = this;
            if(self._jqInput){
                if(self._jqPanel.find(".label-info").length == 0){
                    // 如果输入框无内容，增加占位符提示
                    self._jqInput.attr("placeholder", self._placeholder).attr("size",15);
                }else{
                    //如果已经选择了至少一个，则取消提示语,并且缩短输入框
                    self._jqInput.attr("placeholder", "").attr("size",2);
                }
            }
        },
        _create: function () {
            var self = this;
            self._tags = new HashMap();
            self._menus = new HashMap();
            self._cacheSource = new HashMap();

            self._jqPanel = $("<div class=\"tagsinput\"/>").appendTo(self._jqElement)
                .on("click",function(){
                   self._showInput();
                });

            //self._jqTags = $("<label class=\"tags\">").appendTo(self._jqPanel);
            self._jqPanel.html("<label class=\"tags\">");
            self._jqTags = self._jqPanel.children(".tags");
            self._jqTags.on("click", "span>i", function (event) {
                self.removeTag($(this).parent().attr("data-tag-id"));
                event.preventDefault();
            });

            //console.dirxml(self._jqPanel[0]);
            if ($.isPlainObject(self.option.input)) {
                if ($.isFunction(self.option.input.source)) {
                    //原代码
                    //var inputSize = 30;
                    //self._jqInput = $("<input type=\"text\">").appendTo(self._jqTags);
                    //if (!String.isNullOrWhiteSpace(self.option.input.placeholder)) {
                    //    self._jqInput.attr("placeholder", self.option.input.placeholder)
                    //    inputSize = self.option.input.placeholder.lengthb();
                    //}
                    var inputSize = 15;
                    self._jqInput = $("<input type=\"text\">").appendTo(self._jqTags);

                    if (!String.isNullOrWhiteSpace(self.option.input.placeholder)) {
                        self._placeholder = self.option.input.placeholder;
                        self._jqInput.attr("placeholder", self.option.input.placeholder);
                        //inputSize = self.option.input.placeholder.lengthb();
                    }
                    //self._jqInput.attr("size", inputSize);

                    self._jqInput.on("focus", function () {
                        self._jqPanel.addClass("tagsinput-focus");
                        self._jqInput.triggerHandler("keyup");
                        self._jqPanel.css("border","1px solid #ccc");
                    }).on("blur", function () {
                        self._jqPanel.removeClass("tagsinput-focus");
                        if (self._jqMenu != null) {
                            self._menuFocusElement = this;
                            //页面样式美观
                            //self._hideInput(inputSize);
                            self._menuTimeoutId = window.setTimeout(function () {
                                self._hideMenu();
                            }, 200);
                        }else{
                            //页面样式美观 （用于详情表页面的主表信息显示时）
                            //self._hideInput(inputSize);
                        }
                    }).on('keydown', function (event) {
                        if (event.which == 8) {
                            // BACKSPACE
                            if (doGetCaretPosition(self._jqInput[0]) === 0) {
                                self.removeTag(self._jqInput.prev().attr("data-tag-id"));
                                event.preventDefault();
                            }
                        }
                    }).on('keyup', function (event) {
                         if (self._jqMenu != null && !self._jqMenu.is(":hidden")) {
                            if (event.which == 13 || event.which == 32) {
                                //enter,空格
                                if (self._jqMenu.children(".active").length == 0) {
                                    self._jqMenu.children(":first()").addClass("active");
                                }
                                self._jqMenu.children(".active").trigger("click");
                                event.preventDefault();
                            } else if (event.which == 38) {
                                //up
                                //console.log("up");
                                if (self._jqMenu.children(".active").length == 0) {
                                    self._jqMenu.children(":first()").addClass("active");
                                }
                                self._jqMenu.children(".active").prev().trigger("mouseenter");
                                event.preventDefault();
                            } else if (event.which == 40) {
                                //down
                                //console.log("down");
                                if (self._jqMenu.children(".active").length == 0) {
                                    self._jqMenu.children(":first()").addClass("active");
                                }
                                self._jqMenu.children(".active").next().trigger("mouseenter");
                                event.preventDefault();
                            }
                        }
                        //页面样式美观
                        //if(self._jqInput.val().lengthb() > 0){//input输入框中有内容
                        //    self._jqInput.attr('size', Math.max(inputSize, self._jqInput.val().lengthb()));
                        //}else {
                        //    if(self._jqPanel.find(".label-info").length > 0){
                        //        self._jqInput.attr("placeholder", "").attr("size",1);
                        //    }else {
                        //        self._jqInput.attr('size', 4).attr("placeholder", self._placeholder); //用于显示占位符（解决手机上显示不完问题）
                        //    }
                        //}
                    });

                    if ($.isFunction(self.option.input.source)) {
                        self._jqInput.on("keyup", function () {
                            if (self._jqInput.val().equals(self._currentSourceVal)) return;
                            if (self._jqInput.val().lengthb() >= self.option.input.minLength) {
                                if (self.option.input.delay > 0) {
                                    if (self.option.input.cache === true
                                        && self._cacheSource.containsKey(self._jqInput.val())) {
                                        self._source();
                                    } else if (self._sourceTimeoutId == null) {
                                        self._sourceTimeoutId = window.setTimeout(Function.createDelegate(self, self._source)
                                            , self.option.input.delay);
                                    }
                                } else {
                                    self._source();
                                }
                            } else {
                                if (self._sourceTimeoutId != null) {
                                    window.clearTimeout(self._sourceTimeoutId);
                                    self._sourceTimeoutId = null;
                                }
                                self._hideMenu();
                            }
                        });
                    }
                }
            }
            if ($.isPlainObject(self.option.button)) {
                var btnHtml = "";
                if ($.type(self.option.button.text) === "string") {
                    btnHtml += self.option.button.text;
                }
                if ($.type(self.option.button.icon) === "string") {
                    btnHtml += " ";
                    btnHtml += "<i class=\"" + self.option.button.icon + "\"></i>";
                }
                if (!String.isNullOrWhiteSpace(btnHtml)) {
                    self._jqButton = $("<span class=\"tags-btn\" />").css({"right": "1px"})
                        .append($("<button type=\"button\" class=\"btn btn-default\"/>")
                            .css({"border": "none", "padding": "2px 5px", "height": "100%"})
                            .append(btnHtml)
                            .on("click", function () {
                                self._jqElement.triggerHandler("button.tagsinput");
                            })
                        ).appendTo(self._jqPanel);
                    if(navigator.userAgent.indexOf("Chrome")>-1 && navigator.userAgent.indexOf("Edge")==-1)
                        self._jqButton.css({"height": "100%"});
                }
            } else if ("select".equals(self.option.button)) {
                self._jqButton = $("<span class=\"tags-btn\" />")
                    .append($("<button type=\"button\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-chevron-down\"></i></button>")
                        .on("focus", function () {
                            self._showMenu();
                        }).on("blur", function () {
                            if (self._jqMenu != null) {
                                self._menuFocusElement = this;
                                self._menuTimeoutId = window.setTimeout(function () {
                                    self._hideMenu();
                                }, 200);
                            }
                        })
                    ).appendTo(self._jqPanel);
            }
        },
        clearCache : function(){
            this._cacheSource.clear();
        }
    };


    $.fn.tagsinput = function () {
        if (this.length > 0) {
            var self = this[0];
            if ($.type(arguments[0]) === 'string'
                && !arguments[0].startsWith("_")) {
                var _instance = $.data(self, "eiis-tagsinput");
                if (_instance) {
                    if ($.isFunction(_instance[arguments[0]])) {
                        var args = Arrays.clone(arguments);
                        args.splice(0, 1);
                        var result = _instance[arguments[0]].apply(_instance, args);
                        return result != undefined ? result : this;
                    }
                    return _instance[arguments[0]];
                }
            } else if ($.isPlainObject(arguments[0])) {
                $.data(self, "eiis-tagsinput", new tagsinput(self, arguments[0]));
                $(self).triggerHandler("created.tagsinput");
            }
        }
        return this;
    };

    $.fn.tagsinput.option = {
        tagClass: "label label-info",
        idKey: "id",
        displayKey: "value",
        menuTemplate: null,
        input: {
            cache: true,
            placeholder: "",
            delay: 500,
            minLength: 2,
            source: null
        },
        button: {
            text: null,
            icon: null
        }
    };

})(jQuery);