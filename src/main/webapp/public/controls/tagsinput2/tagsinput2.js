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
    function getTruePostParam(postData) {
        var p = $.extend(true,{},postData);
        for(var i in p){
            if (typeof window[p[i]] === 'function') {
                try{
                    p[i]=window[p[i]].call(this);
                }catch (e){ console.log(e)};
            }
        }
        return p;
    }

    var tagsinput2 = function (element, option) {
        var self = this;
        self.option = $.extend(true, {}, $.fn.tagsinput2.option, option);
        self.element = element;
        self._jqElement = $(self.element);

        self._create();

        return self;
    };
    tagsinput2.prototype = {
        option: null,
        element: null,
        _jqElement: null,
        _jqPanel: null,
        _jqTags: null,
        _jqMenu: null,
        _jqMDiv: null,
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
                self._jqTags.find("span>i").hide();
                if (self._jqButton != null) {
                    self._jqButton.hide();
                }
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

        // 下页
        goNextPage:function(){
            var self = this;
            if(self.hasNextPage && self.freeTime !=false){
                var viewH =self._jqMenu.height();
                var contentH =self._jqMenu.get(0).scrollHeight;
                var scrollTop =self._jqMenu.scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 250) {
                    self.freeTime = false;
                    var k=1;
                    var postData = self.option.postData;
                    postData.page +=k;
                    $.ajax({
                        dataType: 'json', cache: true,
                        url: self.option.url,
                        data: getTruePostParam(postData),
                        success: function (results) {
                            var rsArr = self._cacheSource.get(postData.searchKey);
                            if(Array.isArray(rsArr)){
                                // self._cacheSource.put(postData.searchKey, rsArr.concat(results));
                            }else
                                // self._cacheSource.put(postData.searchKey, results);
                            self._sourceCallback(results,"append");
                            self.freeTime = true;
                        }
                    });
                }
            }
        },
        // 获得总条数
        getRSCount:function(){
            var self = this;
            var searchKey = self.option.postData.searchKey;
            var count = 0;
            if(self._cacheSource.get(searchKey+"__count")!=null){
                count = self._cacheSource.get(searchKey+"__count");
                self._jqMDiv.find(".rs_count").text(count);
            }else{
                $.ajax({
                    dataType: 'json', cache: true,
                    url: self.option.url,
                    data: getTruePostParam($.extend(true,{requestType:"count"},self.option.postData)),
                    success: function (results) {
                        if(typeof results[0] == "number"){
                            // self._cacheSource.put(searchKey+"__count", results[0]);
                            self._jqMDiv.find(".rs_count").text(results[0]);
                        }else {
                            self._jqMDiv.find(".rs_count").text("NaN");
                        }

                    }
                });
            }
        },
        setSearchText: function (text) {
            var self = this;
            self._jqInput.val(text);
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
        },
        _putTag: function (value) {
            var self = this;
            if (self._tags.containsKey(value[self.option.idKey])) {

                var jqTag = self._jqTags.children("span[data-tag-id=\"" + value[self.option.idKey] + "\"]")
                    .removeClass("tagsinput2-selected-prompt");
                //if (jqTag.is(":visible")) {
                window.setTimeout(function () {
                    jqTag.addClass("tagsinput2-selected-prompt");
                    window.setTimeout(function () {
                        jqTag.removeClass("tagsinput2-selected-prompt");
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

            jqTag = $("<div/>").append($("<span/>")
                .text(value[self.option.displayKey[0]])
                .attr("data-tag-id", value[self.option.idKey])
                .addClass(tagClass)
            );

            var tagHtml = jqTag.html();
            tagHtml += " ";
            if (self._jqInput == null) {
                self._jqTags.append(tagHtml);
            } else {
                self._jqInput.before(tagHtml);
                self._jqInput.trigger("focus");
            }
            self._jqElement.triggerHandler("put.tagsinput2", [value[self.option.idKey], value]);


        },
        removeTag: function (id) {
            var self = this;
            self._jqTags.children("span[data-tag-id=\"" + id + "\"]").remove();
            var value = self._tags.get(id);
            self._tags.remove(id);
            self._jqElement.triggerHandler("remove.tagsinput2", [id, value]);
            // 如果输入框无内容，增加占位符提示
            if(self._jqPanel.find(".label-info").length == 0){
                if(self._jqInput){
                    self._jqInput.attr("placeholder", self._placeholder).attr("size",4);
                }
            }
        },
        clearTag: function () {
            var self = this;
            var ids = self.getIds();
            var values = self.getValues();
            self._jqTags.children("span").remove();
            self._tags.clear();
            self._jqElement.triggerHandler("clear.tagsinput2", [ids, values]);
        },
        putMenu: function (value) {
            var self = this;

            if (self._jqMenu == null) {
                self._jqMDiv = $("<div class='dropdown-menu tag-dropdown-menu'/>").appendTo(self._jqPanel);
                self._jqMenu = $("<ul class=\"menu-ul\" role=\"menu\">")
                    .appendTo(self._jqMDiv)
                    .on("click", "li", function () {
                        if (self._menuTimeoutId != null) {
                            window.clearTimeout(self._menuTimeoutId);
                        }
                        if(self._menus.get($(this).attr("data-menu-id"))){
                            if(self.option.multiple==false){
                                self.clearTag();
                            }
                            self.putTag(self._menus.get($(this).attr("data-menu-id")));
                            if (self._jqInput != null) {
                                self._jqInput.val("");
                                self._jqInput.trigger("focus");
                            }
                        }else{
                            self._jqInput.trigger("focus");
                        }

                    }).on("mouseenter", "li", function () {
                        if($(this).attr("data-menu-id")){
                            self._jqMenu.children().removeClass("active");
                            $(this).addClass("active");
                        }
                    });


                var bottom = $("<div class='menu-bottom'/>");
                self._jqMDiv.append(bottom);
                $("<span style='float: left;'>找到 <span class='rs_count'>0</span> 个</span>").appendTo(bottom);
                if(self.option.addOption){
                    var span = $("<a href='javascript:void(0)' style='float: right;'><i class='esg-font icon-tianjia' style='font-size: 10px;'/>添加</a>");
                    span.css({
                        "padding" : "0 10px",
                        "color": "#118fff",
                        float: "right",
                        width: "inherit"
                    });
                    span.on("click",function(){
                        window[self.option.addOption.addFunction].call(this,self.option.addOption.treeKind);
                    }).appendTo(bottom);
                }

                var scrollFunc=function(e){
                    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
                    var l = 25;
                    var k= self._jqMenu.scrollTop();
                    if (delta > 0) {
                        var n = k>l?k-l:0;
                        self._jqMenu.scrollTop(n);
                    } else if (delta < 0) {
                        self._jqMenu.scrollTop(k+l);
                        self.goNextPage();
                    }
                };
                self._jqMenu.on("mousewheel DOMMouseScroll",scrollFunc);
            }

            if ($.isArray(value)) {
                for (var i = 0, j = value.length; i < j; i++) {
                    self._putMenu(value[i]);
                }

                if(value.length>0){
                    self.hasNextPage = false;
                    if(value.length == self.option.postData.rows) {
                        var postData = $.extend({},self.option.postData);
                        postData.page = postData.page*postData.rows +1;
                        postData.rows = 1;
                        $.ajax({
                            dataType: 'json', cache: false,async:false,
                            url: self.option.url,
                            data: getTruePostParam(postData),
                            success: function (results) {
                                if(results.length>0) {
                                    self.hasNextPage = true;
                                }
                            }
                        });
                    }
                    if(!self.hasNextPage){
                        var li = $("<li style='text-align: center;'/>");
                        li.append("-----到底了-----");
                        self._jqMenu.append(li);
                    }
                }else{
                    var li = $("<li class='rs_none'><i class='fa fa-exclamation-circle'/> <span>未搜索到相关信息</span></li>");
                    self._jqMenu.append(li);
                }
            } else {
                self._putMenu(value);
            }
        },
        _putMenu: function (value) {
            var self = this;
            self._menus.put(value[self.option.idKey], value);
            var itemHtml = "";
            if ($.isFunction(self.option.menuTemplate)) {
                itemHtml = self.option.menuTemplate(value);
            }else{
                itemHtml = value[self.option.displayKey[0]];
            }

            var li = $("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"javascript:void(0)\">" + itemHtml + "</a></li>");
            if(value.readonly !=0){
                li.attr("data-menu-id", value[self.option.idKey]);
            }
            li.appendTo(self._jqMenu);

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
                self.option.postData.searchKey = val;
                self.option.postData.page = 1;
                self.option.input.source(val, function (value) {
                    // self._cacheSource.put(val, value);
                    self._sourceCallback(value);
                });
            }
        },
        _sourceCallback: function (value,type) {
            var self = this;
            if(type!="append")
                self.clearMenu();
            self.putMenu(value);
            self.getRSCount();
            self._showMenu();
            if(type!="append")
                self._jqMenu.scrollTop(0);
        },
        _showMenu: function () {
            var self = this;
            if (self._jqMDiv != null) {
                if (self._jqMDiv.is(":hidden")) {
                    self._jqMenu.children().removeClass("active");
                    self._jqMenu.children("[data-menu-id]:first()").addClass("active");

                    var topL = self._jqPanel.offset().top-$(window).scrollTop();
                    var bottomL = $(window).height() - topL - self._jqPanel.height();
                    var mL =  self._jqMDiv.height();
                    var top;
                    if(bottomL>=mL || bottomL >= topL){
                        top = topL+ self._jqPanel.height();
                        self._jqMDiv.css({top:top+"px"});
                    }else{
                        top = topL-mL-5;
                        self._jqMDiv.css({top:top+"px"});
                    }
                    self._jqMDiv.css({"min-width":self._jqPanel.width()+"px"
                        ,position:"fixed"
                        ,left:self._jqPanel.offset().left+"px"});

                    var d_top =  document.body.scrollTop;
                    var d_left =  document.body.scrollLeft;
                    var left =  self._jqPanel.offset().left;
                    $(window).bind("scroll.tagsinput2",function(){
                        if(self._jqMDiv && !self._jqMDiv.is(":hidden")){
                            var k = document.body.scrollTop - d_top;
                            var t = top - k;
                            var l = document.body.scrollLeft - d_left;
                            var le = left - l;
                            self._jqMDiv.css({top:t+"px",left:le+"px"});
                        }
                    });
                    $(window).bind("resize.tagsinput2",function () {
                        if(self._jqMDiv && !self._jqMDiv.is(":hidden")){
                            self._hideMenu();
                        }
                    });
                    self._jqMDiv.show();
                }else {
                    var topL = self._jqPanel.offset().top-$(window).scrollTop();
                    var top = self._jqMDiv[0].offsetTop;
                    var mL =  self._jqMDiv.height();
                    if(top<topL){
                        top = topL-mL-5;
                        self._jqMDiv.css({top:top+"px"});
                    }
                }
            }
        },
        _hideMenu: function () {
            var self = this;
            if (self._jqMDiv != null) {
                if (self._jqMDiv.is(":visible")) {
                    self._jqMenu.children().removeClass("active");
                    self._jqMDiv.hide();
                    self._jqMenu.empty();
                    self._currentSourceVal = null;
                }
            }
            $ (window).unbind ('scroll.tagsinput2');
            $ (window).unbind ('resize.tagsinput2');
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
        _create: function () {
            var self = this;
            self._tags = new HashMap();
            self._menus = new HashMap();
            self._cacheSource = new HashMap();

            self._jqPanel = $("<div class=\"tagsinput2\"/>")
                .on("click",function(){
                   self._showInput();
                });
            if(self._jqElement.prev().attr("_height")){
                self._jqPanel.css({height:self._jqElement.prev().attr("_height")+"px"});
            }
            if(self._jqElement.prev().attr("_width")){
                self._jqPanel.css({width:self._jqElement.prev().attr("_width")+"px"});
            }
            self._jqPanel.appendTo(self._jqElement);

            self._jqPanel.html("<label class=\"tags\">");
            self._jqTags = self._jqPanel.children(".tags");
            self._jqTags.on("click", "span>i", function (event) {
                self.removeTag($(this).parent().attr("data-tag-id"));
                event.preventDefault();
            });

            //console.dirxml(self._jqPanel[0]);
            if ($.isPlainObject(self.option.input)) {
                if ($.isFunction(self.option.input.source)) {
                    var inputSize = 25;
                    self._jqInput = $("<input type=\"text\">").appendTo(self._jqTags);

                    if (!String.isNullOrWhiteSpace(self.option.input.placeholder)) {
                        self._placeholder = self.option.input.placeholder;
                        self._jqInput.attr("placeholder", self.option.input.placeholder);
                    }
                    self._jqInput.attr("size", inputSize);

                    self._jqInput.on("focus", function () {
                        self._jqPanel.addClass("tagsinput2-focus");
                        self._jqInput.triggerHandler("keyup");
                        self._jqPanel.css("border","1px solid #95B8E7");
                    }).on("blur", function () {
                        self._jqPanel.removeClass("tagsinput2-focus");
                        if (self._jqMenu != null) {
                            self._menuFocusElement = this;
                            //页面样式美观
                            self._hideInput(inputSize);
                            self._menuTimeoutId = window.setTimeout(function () {
                                self._hideMenu();
                            }, 200);
                        }else{
                            //页面样式美观 （用于详情表页面的主表信息显示时）
                            self._hideInput(inputSize);
                        }

                        if(self._jqInput.val().lengthb() > 0){//input输入框中有内容
                            self._jqInput.attr('size', Math.max(inputSize, self._jqInput.val().lengthb()));
                        }else {
                            if(self._jqPanel.find(".label-info").length > 0){
                                self._jqInput.attr("placeholder", "").attr("size",1);
                            }else {
                                self._jqInput.attr('size', 4).attr("placeholder", self._placeholder); //用于显示占位符（解决手机上显示不完问题）
                            }
                        }

                    }).on('keydown', function (event) {
                        if (event.which == 8) {
                            // BACKSPACE
                            if (doGetCaretPosition(self._jqInput[0]) === 0) {
                                self.removeTag(self._jqInput.prev().attr("data-tag-id"));
                                event.preventDefault();
                            }
                        } else if (event.which == 37 || event.which == 39) {
                            event.preventDefault();
                        } else if ( event.which == 38 || event.which == 40) {
                            if (self._jqMenu != null) {
                                var l = 25;
                                var k= self._jqMenu.scrollTop();
                                if (event.which == 38) {
                                    //up
                                    if(self._jqMenu.children("[data-menu-id]").length == 0
                                        ||( self._jqMenu.children(".active").length != 0 && self._jqMenu.children(".active").prevAll("[data-menu-id]").length == 0) ){
                                        self._jqInput.val("");
                                        self._hideMenu();
                                    }else if (self._jqMenu.children(".active").length == 0) {
                                        self._jqMenu.children("[data-menu-id]:first").addClass("active");
                                    }
                                    self._jqMenu.children(".active").prevAll("[data-menu-id]:first").trigger("mouseenter");
                                    event.preventDefault();

                                    var n = k>l?k-l:0;
                                    self._jqMenu.scrollTop(n);
                                } else if (event.which == 40) {
                                    //down
                                    if (self._jqMenu.children(".active").length == 0) {
                                        self._jqMenu.children("[data-menu-id]:first").addClass("active");
                                    }
                                    self._jqMenu.children(".active~[data-menu-id]:first").trigger("mouseenter");
                                    event.preventDefault();
                                    self._jqMenu.scrollTop(k+l);
                                    self.goNextPage();
                                }
                            }
                        } else if(event.which == 13 && self._jqMenu){
                            //enter
                            if (self._jqMenu.children(".active").length == 0) {
                                self._jqMenu.children("[data-menu-id]:first").addClass("active");
                            }
                            self._jqElement.attr("which","13");
                            self._jqMenu.children(".active").trigger("click");
                            event.preventDefault();
                        }
                    }).on('keyup', function (event) {
                        //页面样式美观
                        if(self._jqInput.val().lengthb() > 0){//input输入框中有内容
                            self._jqInput.attr('size', Math.max(inputSize, self._jqInput.val().lengthb()));
                        }else {
                            if(self._jqPanel.find(".label-info").length > 0){
                                self._jqInput.attr("placeholder", "").attr("size",1);
                            }else {
                                self._jqInput.attr('size', 4).attr("placeholder", self._placeholder); //用于显示占位符（解决手机上显示不完问题）
                            }
                        }
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
            self._jqInput.trigger("focus");
        }
    };


    $.fn.tagsinput2 = function () {
        if (this.length > 0) {
            var self = this[0];
            if ($.type(arguments[0]) === 'string'
                && !arguments[0].startsWith("_")) {
                var _instance = $.data(self, "eiis-tagsinput2");
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
                $.data(self, "eiis-tagsinput2", new tagsinput2(self, arguments[0]));
                $(self).triggerHandler("created.tagsinput2");
            }
        }
        return this;
    };

    $.fn.tagsinput2.option = {
        tagClass: "label label-info",
        idKey: "id",
        displayKey: ["value"],
        url: "",
        postData: {},
        addOption: null,
        menuTemplate: null,
        input: {
            cache: true,
            placeholder: "",
            delay: 500,
            minLength: 2,
            source: null
        }
    };

})(jQuery);