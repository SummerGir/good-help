(function ($, undefined) {


    var _updateTbody = function (instance, skip) {

        if (!$.isPlainObject(instance.option.data)) return;

        instance.jqTbody.empty();

        for(var tempKey in instance.columnGroup){
            instance.columnGroup[tempKey].body=[];
        }
        $.each(instance.option.data["rows"], function (i, rowData) {
            if (instance.option.pageSize < 0
                || (i < instance.option.pageSize + skip
                && i >= skip)) {
                var tr = $(instance.templet);
                $("td", tr).each(function () {
                    var td = $(this);
                    var key = td.attr("data-column-key");
                    var eventData = {
                        td: td,
                        column: rowData[td.attr("data-column-key")],
                        row: rowData,
                        html: $("<div/>").text(rowData[td.attr("data-column-key")]).html()
                    };
                    instance.jqElement.triggerHandler("table.column." + key + ".foramt", [eventData]);
                    td.html(eventData.html);
                    if(instance.columnGroup[key]){
                        instance.columnGroup[key].body.push(td);
                        if(instance.columnGroup[key].hide){
                            td.hide();
                        }
                    }
                });
                $.data(tr[0], "table-row-data", rowData);
                instance.jqElement.triggerHandler("table.createRow",{tr : tr,rowData : rowData});
                tr.appendTo(instance.jqTbody);
                if (instance.option.selectMode > 0) {
                    tr.on("click", function () {
                        if (instance.option.selectMode == 1) {
                            tr.siblings().removeClass(instance.option.selectClass);
                        }
                        tr.toggleClass(instance.option.selectClass);

                        instance.jqElement.triggerHandler("table.row.selected", [
                            {
                                row: $.data(tr[0], "table-row-data"),
                                selected: tr.is("." + instance.option.selectClass),
                                tr: tr
                            }
                        ]);
                    });
                }
            }
        });


        if (instance.jqPagination.length > 0) {
            var page = $.data(instance.jqPagination, "page");
            var total = $.data(instance.jqPagination, "total");
            if (instance.option.page != page
                || instance.option.total != total) {

                page = instance.option.page;
                total = instance.option.total;

                $.data(instance.jqPagination, "page", page);
                $.data(instance.jqPagination, "total", total);

                var jqPageFirst = instance.jqPagination.children(".table-page-first");
                var jqPagePrev = instance.jqPagination.children(".table-page-prev");
                var jqPageNext = instance.jqPagination.children(".table-page-next");
                var jqPageLast = instance.jqPagination.children(".table-page-last");

                var i = page - 3;
                if (i < 1) i = 1;
                var j = page + 3;
                if (j > total) j = total;
                if (j < 1) j = 1;

                if (page <= 1) {
                    jqPageFirst.addClass("disabled");
                    jqPagePrev.addClass("disabled");
                } else {
                    jqPageFirst.removeClass("disabled");
                    jqPagePrev.removeClass("disabled");
                }
                if (page >= total) {
                    jqPageNext.addClass("disabled");
                    jqPageLast.addClass("disabled");
                } else {
                    jqPageNext.removeClass("disabled");
                    jqPageLast.removeClass("disabled");
                }

                jqPagePrev.children("a").attr("data-page-number", page - 1);
                jqPageNext.children("a").attr("data-page-number", page + 1);
                jqPageLast.children("a").attr("data-page-number", total);

                instance.jqPagination.children(".table-page-number").remove();
                for (i; i <= j; i++) {
                    jqPageNext.before($("<li/>")
                        .addClass("table-page-number"
                        + (i == page ? " active" : " hidden-xs"))
                        .append($("<a/>").attr({
                            "data-page-number": i,
                            "href": "#this"
                        }).text(i)
                    ));
                }
            }
        }

        var startNumber = 0;
        var endNumber = 0;

        if (instance.option.records > 0) {
            if (instance.option.pageSize < 1) {
                startNumber = 1;
                endNumber = instance.option.records;
            } else {
                startNumber = (instance.option.page - 1) * instance.option.pageSize + 1;
                endNumber = (instance.option.page * instance.option.pageSize) > instance.option.records
                    ? instance.option.records
                    : instance.option.page * instance.option.pageSize;
            }
        }

        instance.jqInfo.text(String.format("第 {0} 至 {1} 项，共 {2} 项",
            startNumber,
            endNumber,
            instance.option.records))
            .removeClass("alert-danger");

        if (!String.isNullOrWhiteSpace(instance.option.sortKey)) {
            $("thead>tr>td[data-sort-key], thead>tr>th[data-sort-key], tfoot>tr>td[data-sort-key], tfoot>tr>th[data-sort-key]", instance.jqTable).each(function () {
                var jqThis = $(this);
                if (jqThis.attr("data-sort-key").equals(instance.option.sortKey)) {
                    if (instance.option.sortType.equalsIgnoreCase("ASC")) {
                        jqThis.removeClass("sorting sorting_desc").addClass("sorting_asc");
                    } else if (instance.option.sortType.equalsIgnoreCase("DESC")) {
                        jqThis.removeClass("sorting sorting_asc").addClass("sorting_desc");
                    }
                } else {
                    jqThis.removeClass("sorting_asc sorting_desc").addClass("sorting");
                }

            });
        }
    };

    var _updatePageNumber = function (instance) {
        if (!$.isPlainObject(instance.option.data)) return;

        var formatData = function (key) {
            var num = NaN;
            if ($.type(instance.option.data[key]) !== "number") {
                num = parseInt(instance.option.data[key]);
            } else {
                num = instance.option.data[key];
            }
            if (num != NaN) {
                instance.option[key] = num;
            }
        };

        formatData("records");// data["records"] 总记录数量
        formatData("page");// data["page"]当前页
        //formatData("total");// data["total"]总页数

        if (instance.option.page < 1) instance.option.page = 1;

        _formatPageNumber(instance);

    };

    var _formatPageNumber = function (instance) {
        if (!$.isPlainObject(instance.option.data)) return;
        if (instance.option.records <= 0
            && $.isArray(instance.option.data.rows)) {
            instance.option.records = instance.option.data.rows.length;
        }

        var total = 1;
        if (instance.option.pageSize > 0) {
            total = Math.ceil(instance.option.records / instance.option.pageSize);
        }
        instance.option.total = total;

        if (instance.option.page > instance.option.total) {
            instance.option.page = instance.option.total;
        }
        if (instance.option.page < 1)instance.option.page = 1;
    };

    var _formatSortData = function (instance) {
        if (!$.isPlainObject(instance.option.data)) return;
        if (!String.isNullOrWhiteSpace(instance.option.sortKey)
            && $.isArray(instance.option.data.rows)
            && instance.option.data.rows.length > 0) {
            var sortKey = $.data(instance.element, "sortKey");
            var sortType = $.data(instance.element, "sortType");
            if (instance.option.sortType != sortType
                || instance.option.sortKey != sortKey) {
                $.data(instance.element, "sortKey", sortKey);
                $.data(instance.element, "sortType", sortType);

                if ($.type(instance.option.data.rows[0][instance.option.sortKey]) === "number") {
                    if (instance.option.sortType.equalsIgnoreCase("ASC")) {
                        instance.option.data.rows = instance.option.data.rows.sort(function (a, b) {
                            return a[instance.option.sortKey] - b[instance.option.sortKey];
                        });
                    } else {
                        instance.option.data.rows = instance.option.data.rows.sort(function (a, b) {
                            return b[instance.option.sortKey] - a[instance.option.sortKey];
                        });
                    }
                } else {
                    if (instance.option.sortType.equalsIgnoreCase("ASC")) {
                        instance.option.data.rows = instance.option.data.rows.sort(function (a, b) {
                            return a[instance.option.sortKey].localeCompare(b[instance.option.sortKey])
                        });
                    } else {
                        instance.option.data.rows = instance.option.data.rows.sort(function (a, b) {
                            return b[instance.option.sortKey].localeCompare(a[instance.option.sortKey])
                        });
                    }
                }
            }
        }
    };

    var _create = function (self, p) {

        var instance = {
            element: self,
            jqElement: $(self),
            option: p
        };
        instance.jqMenu = instance.jqElement.next();
        instance.jqTable = instance.jqElement.find("table.table");
        instance.jqPagination = instance.jqElement.find("ul.table-pagination");
        instance.jqPagination.on("click", "li>a", function () {
            if (!$(this).parent().hasClass("disabled")) {
                instance.option.page = parseInt($(this).attr("data-page-number"));
                if (instance.option.page < 1)instance.option.page = 1;
                instance.loadData();
            }
        });
        instance.jqInfo = instance.jqElement.find(".table-info");

        instance.jqToolbar = instance.jqElement.find(".table-toolbar");
        instance.jqCustomRibbon = instance.jqElement.find(".table-custom-ribbon");
        instance.getCustomRibbon = function () {
            return instance.jqCustomRibbon;
        };
        instance.jqPanelRibbon = instance.jqElement.find(".table-panel-ribbon");
        instance.getPanelRibbon = function () {
            return instance.jqPanelRibbon;
        };
        instance.jqPanelBody = instance.jqElement.find(".table-panel-body");
        instance.getPanelBody = function () {
            return instance.jqPanelBody;
        };
        instance.jqPanelCaption = instance.jqElement.find(".table-panel-caption");
        instance.getPanelCaption = function () {
            return instance.jqPanelCaption;
        };


        instance.getSelected = function () {
            var rows = [];
            instance.jqTbody.children("tr").each(function () {
                if ($(this).hasClass(instance.option.selectClass)) {
                    var rowData = $.data(this, "table-row-data");
                    if ($.isPlainObject(rowData)) {
                        rows.push(rowData);
                    }
                }
            });
            return rows;
        };

        // 创建隐藏列相关
        instance.jqThead = $("thead", instance.jqTable);
        instance.jqTbody = $("tbody", instance.jqTable);
        instance.jqTfoot = $("tfoot", instance.jqTable);
        instance.columnGroup={};
        var tableKey=instance.option.ajaxData?instance.option.ajaxData.tableKey:undefined;
        var tempTds=instance.jqThead.find("th"),tempIds2=instance.jqTfoot.find("td"),tempTd,tempTd2,key,_default,keys=[],menuItem,td,hidden,maxLength=0,tempLength,menuLine=instance.jqMenu.find(".menu-line"),isCreateMenu=false;
        $.each(instance.jqTbody.find("td"),function(i,o){
            td=$(o);
            tempTd=tempTds.eq(i);
            if(tempIds2.length!==0){
                tempTd2=tempIds2.eq(i);
            }
            if(tempTd.length===0){
                return false;
            }
            key=td.data("column-key");
            hidden=td.data("hidden");
            tempTd.data("key",key);
            if(tempIds2.length!==0){
                tempTd2.data("key",key);
            }
            if(hidden!==undefined && tableKey){
                _default=td.data("default");
                if(_default!==undefined){
                    keys.push(key);
                }
                isCreateMenu=true;
                $.ajax({
                    type : "post",
                    url : "/public/memory/getMainColsMemory.do",
                    data : {
                        tableKey : tableKey,
                        column : key
                    },
                    dataType : "json",
                    async : false,
                    success : function(msg){
                        if(!msg.state){
                            hidden=Boolean.parse(hidden);
                        }else{
                            hidden=false;
                        }
                    }
                });
                if(hidden){
                    tempTd.hide();
                    if(tempIds2.length!==0){
                        tempTd2.hide();
                    }
                }
                tempLength=tempTd.text().trim().length;
                if(maxLength<tempLength){
                    maxLength=tempLength;
                }
                menuLine.css("height",(menuLine.height()+24)+"px");
                menuItem=$('<div class="menu-item" data-key="'+key+'" style="height: 22px;"></div>');
                instance.jqMenu.css("height",(instance.jqMenu.height()+28)+"px").append(menuItem.append('<div class="menu-text" style="height: 20px; line-height: 20px;">'+tempTd.text().trim()+'</div>'+ '<div class="menu-icon '+(hidden?"icon-empty":"icon-ok")+'"></div>'));
            }
            !function(key,menuItem){
                instance.columnGroup[key]={
                    hide : hidden,
                    head : tempTd,
                    foot : tempTd2,
                    body : [],
                    change : function(async){
                        if(async===undefined){
                            async=true;
                        }
                        var self=this,i;
                        this.hide=!this.hide;
                        $.ajax({
                            type : "post",
                            url : "/public/memory/refreshMainColsMemory.do",
                            async : async,
                            data : {
                                tableKey : tableKey,
                                column : key,
                                hide : self.hide
                            },
                            dataType : "json",
                            success : function(msg){
                                if(msg.errorCode===0){
                                    if(self.hide){
                                        self.head.hide();
                                        if(self.foot){
                                            self.foot.hide();
                                        }
                                        for(i=0;i<self.body.length;i++){
                                            self.body[i].hide();
                                        }
                                        menuItem.find(".menu-icon").removeClass("icon-ok").addClass("icon-empty");
                                    }else{
                                        self.head.show();
                                        if(self.foot){
                                            self.foot.show();
                                        }
                                        for(i=0;i<self.body.length;i++){
                                            self.body[i].show();
                                        }
                                        menuItem.find(".menu-icon").removeClass("icon-empty").addClass("icon-ok");
                                    }
                                }
                            }
                        });
                    }
                };
            }(key,menuItem);
        });
        if(tableKey){
            $.ajax({
                type : "post",
                url : "/public/memory/isFirst.do",
                data : {
                    tableKey : tableKey
                },
                dataType : "json",
                success : function(msg){
                    if(msg.state){
                        for(var i=0;i<keys.length;i++){
                            instance.columnGroup[keys[i]].change(false);
                        }
                    }
                }
            });
        }
        instance.jqMenu.css("width",(maxLength*20+20)+"px");
        if(isCreateMenu){
            _createMenu(instance);
        }
        // ------
        instance.templet = instance.jqTbody.html();
        instance.jqTbody.remove();
        instance.jqTbody = $("<tbody/>").appendTo(instance.jqTable);

        instance.setOption = function (name, value) {
            instance.option[name] = value;
        };
        instance.getOption = function (name) {
            return instance.option[name];
        };

        instance.updateData = function (data) {
            if (!$.isArray(data.rows)) data.rows = [];
            instance.option.data = data;
            _updatePageNumber(instance);
            instance.option.page = 1;
            instance.option.records = data["rows"].length;
            instance.option.ajax = false;
            _formatSortData(instance);
            _updateTbody(instance, 0);
        };
        instance.loadData = function (url, param) {
            if (!String.isNullOrWhiteSpace(url)) {
                instance.option.url = url;
            }
            if ($.isPlainObject(param)) {
                //instance.option.ajaxData.addRange(param);
                //对象的数组值合并的时候，不能覆盖掉原有的值：如第一次选择三个项目部ID并存为数组，第二次选择一个，合并后还是三个
                for(p in param){
                    if (param.hasOwnProperty(p)) {
                        if(param[p] instanceof Array){
                            instance.option.ajaxData[p] = [];
                        }
                    }
                }
                $.extend(true, instance.option.ajaxData, param);
            }
            var eventData = {
                url: instance.option.url,
                data: instance.option.ajaxData,
                dataType: instance.option.ajaxDataType,
                type: instance.option.ajaxType,
                async: instance.option.async
            }
            eventData.data = $.extend(true, eventData.data, {
                "page": instance.option.page,
                "rows": instance.option.pageSize,
                "sidx": instance.option.sortKey,
                "sord": instance.option.sortType
            });

            instance.jqElement.triggerHandler("table.data.loading", [eventData]);

            var total = 1;
            if (eventData.data.rows > 0) {
                total = Math.ceil(instance.option.records / eventData.data.rows);
            }
            if (eventData.data.page > total) {
                eventData.data.page = total;
            }
            if (eventData.data.page < 1)eventData.data.page = 1;

            if (instance.option.ajax) {
                $.ajax({
                    url: eventData.url,
                    data: eventData.data,
                    dataType: eventData.dataType,
                    type: eventData.type,
                    async: eventData.async,
                    cache: false,
                    error: function (jqXHR) {
                        instance.jqInfo.text($.ajaxErrorMessager(jqXHR))
                            .addClass("alert-danger");
                        setTimeout(function () {
                            instance.jqInfo.css({
                                "background-color": "",
                                "border-color": ""
                            });
                        }, 1);
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (!$.isArray(data.rows)) data.rows = [];
                        var eventData = {
                            data: data
                        };
                        instance.jqElement.triggerHandler("table.data.loaded", [eventData]);
                        instance.option.data = eventData.data;
                        _updatePageNumber(instance);
                        _updateTbody(instance, 0);
                        instance.jqElement.triggerHandler("table.updated");
                    }
                });
            } else {
                var eventData = {
                    data: $.extend(true, {}, instance.option.data)
                };
                instance.jqElement.triggerHandler("table.data.loaded", [eventData]);
//                instance.option.data = eventData.data;
                _formatPageNumber(instance);
                _formatSortData(instance);
                _updateTbody(instance, (instance.option.page - 1) * instance.option.pageSize);
                instance.jqElement.triggerHandler("table.updated");
            }

        };

        instance.jqPageSize = instance.jqElement.find(".table-page-size");
        if (instance.jqPageSize.children("option[value=" + instance.option.pageSize + "]").prop("selected", true).length > 0) {
            instance.option.pageSize = parseInt(instance.jqPageSize.children("option:selected").val());
        }
        instance.jqPageSize.on("change", function () {
            instance.option.pageSize = parseInt(instance.jqPageSize.children("option:selected").val());
            instance.option.page=1;
            instance.loadData();
        });
        instance.jqZhiDing = instance.jqElement.find(".table-page-zhiding");
        instance.jqZhiDing.keyup(function () {
            var zhiding=instance.jqZhiDing.val();
            //对输入的值进行限制
            if(zhiding){
                if(isNaN(zhiding)){//去除非数字
                    zhiding = zhiding.replace(/[^\d]/g, "");
                    instance.jqZhiDing.val(zhiding);
                }else if(zhiding<=0){
                    instance.jqZhiDing.val(1);
                }else if(zhiding>instance.option.total){
                    instance.jqZhiDing.val(instance.option.total);
                }
            }
        });
        instance.jqZhiDing.on("change", function () {
            //取值
            var zhiding=instance.jqZhiDing.val();
            //跳转
            instance.option.page=zhiding;
            instance.loadData();
            //清空值
            instance.jqZhiDing.val("");
        });

        //初始化排序表头图标
        //fTr.hide();
        //instance.jqTfoot = $("tfoot", instance.jqTable);
        $("thead>tr>td[data-sort-key], thead>tr>th[data-sort-key], tfoot>tr>td[data-sort-key], tfoot>tr>th[data-sort-key]", instance.jqTable).each(function () {
            $(this).addClass("sorting").on("click", function () {
                var jqThis = $(this);
                if (instance.option.sortKey.equals(jqThis.attr("data-sort-key"))) {
                    if (instance.option.sortType.equalsIgnoreCase("ASC")) {
                        instance.option.sortType = "DESC";
                    } else {
                        instance.option.sortType = "ASC";
                    }
                } else {
                    instance.option.sortKey = jqThis.attr("data-sort-key");
                }
                instance.option.page = 1;
                instance.loadData();
            });
        });

        if ($.isPlainObject(instance.option.data)) {
            if (!$.isArray(instance.option.data.rows)) instance.option.data.rows = [];
            _updatePageNumber(instance);
            _updateTbody(instance, 0);
        } else {
            instance.loadData();
        }

        var scrollTimeout = null;
        //    $(function(){

        if (instance.option.fixTool) {
            instance.jqToolbar.fix({beginElement: instance.jqTbody});
        }
        if (instance.option.fixHead) {
            instance.jqThead.fix({beginElement: instance.jqTbody});
        }

        //   })

        //$(document).on('scroll', function () {
        //    //if (scrollTimeout == null) {
        //    //    scrollTimeout = setTimeout(function () {
        //    _updateToolBarPosition(instance);
        //    //        scrollTimeout = null;
        //    //    }, 100);
        //    //}
        //    //alert($(this).scrollTop() + "===" + instance.jqElement.offset().top);
        //});
        return instance;
    };

    var _createMenu=function(instance){
        instance.jqThead.off("contextmenu").on("contextmenu",function(){
            instance.jqMenu.show().offset({
                top : event.y-10,
                left : event.x-10
            });
            return false;
        });
        instance.jqMenu.on("mouseout",function(){
            if(!new RegExp("^menu").test(event.relatedTarget.className)){
                instance.jqMenu.hide();
            }
        }).delegate(".menu-item",{
            "mouseover" : function(){
                $(this).addClass("menu-active").siblings().removeClass("menu-active");
            },
            "click" : function(){
                instance.columnGroup[$(this).data("key")].change();
            }
        });
    };

    //var _updateToolBarPosition = function (instance) {
    //
    //    var offsetY = $(".navbar-fixed-top").height();
    //
    //    //instance.jqToolbar.parent().offset().top
    //    var startTop = instance.jqPanelBody.offset().top - offsetY;
    //    var endTop = instance.jqTable.offset().top + instance.jqTable.height() - offsetY;
    //
    //    var scrollTop = window.scrollY != undefined ? window.scrollY : window.pageYOffset;
    //    scrollTop = scrollTop != undefined ? scrollTop : (document.documentElement || document.body).scrollTop;
    //    //jqElement
    //    if (scrollTop > startTop
    //        && scrollTop < endTop) {
    //        instance.jqToolbar.addClass("table-toolbar-fixed-top");
    //        //instance.jqToolbar.css("top", (scrollTop - startTop ) + "px");
    //        instance.jqToolbar.css({
    //            "top": offsetY + "px",
    //            "width": instance.jqElement.width()
    //        });
    //
    //    } else {
    //        instance.jqToolbar.css({
    //            "top": "",
    //            "width": ""
    //        });
    //        instance.jqToolbar.removeClass("table-toolbar-fixed-top");
    //    }
    //    //instance.jqToolbar
    //};

    $.fn.table = function () {
        if (this.length > 0) {
            var self = this[0];
            if ($.type(arguments[0]) === 'string') {
                var _instance = $.data(self, "eiis-table");
                if (_instance) {
                    if ($.isFunction(_instance[arguments[0]])) {
                        var args = Arrays.clone(arguments);
                        args.splice(0, 1);
                        var result = _instance[arguments[0]].apply(_instance, args);
                        return result ? result : this;
                    }
                }

            } else if ($.isPlainObject(arguments[0])) {
                var p = $.extend(true, {}, $.fn.table.option, arguments[0]);
                $.data(self, "eiis-table", _create(self, p));
                $(self).triggerHandler("table.created");
            }
        }
        return this;
    };

    $.fn.table.option = {
        ajax: true,
        url: null,
        ajaxData: null,
        ajaxDataType: "json",
        ajaxType: "GET",
        data: null,
        pageSize: 25,
        page: 1,
        total: 1,
        records: 0,
        selectMode: 0,
        fixTool: false,//默认值修改为不固定
        fixHead: false,//默认值修改为不固定
        selectClass: "info",
        sortKey: "",
        sortType: "ASC",
        async: true
    };

})(jQuery);