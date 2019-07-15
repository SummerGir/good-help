(function (window) {

    if ($.selector == undefined) {
        $.selector = {};
    }

    $.selector.member = function (options) {
        var self = this;
        var defaultOptions = {
            readonly: false,
            multiple: true,
            dept: true,
            post: true,
            person: true,
            freeze: false,
            selectRoot: true,
            attrCode: '',
            roots: '',
            exclude: '',
            values: [],
            ok: null
        };
        var params = $.isEmptyObject(options) ? $.extend({}, defaultOptions) : $.extend({}, defaultOptions, options);
        var okFun = params.ok;
        delete params.ok;
        var defaultValues = params.values ? params.values.join(";") : "";
        var random = new Date().valueOf();
        var selectorId = '#eiis-selectorMemberModal' + random;
        var selectorOkBtn = '#eiis-selectorMemberOKBtn' + random;
        var myModal = $(selectorId);
        if (myModal.length == 0) {
            $.ajax({
                url: "/public/controls/selector/member/selector.member.jsp",
                data: {random: random, multiple: params.multiple},
                async: false,
                cache: false,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    $("body").append(data);
                }
            });

            myModal = $(selectorId);
            myModal.on('show.bs.modal', function (e) {
                $(selectorId + "-selector").pickMem({
                    height : 30,
                    menuHeight : 400,
                    idField : "id",
                    textField : "text",
                    explaField : "path",
                    menuDisplay : "top",
                    showExpla : false,
                    newLine : true,
                    multiple : params.multiple,
                    searchKeyName : "term",
                    searchOneKeyName : "ids",
                    placeholder : "输入成员拼音",
                    exclude : params.exclude,
                    urls : {
                        list : {
                            url : "/public/controls/selector/member/selector.member.query.jsp",
                            extendParam : $.extend({},params,{ids : null,page : 1,rows : -1})
                        },
                        item : {
                            url : "/public/controls/selector/member/selector.member.query.jsp",
                            extendParam : $.extend({},params,{term : "",page : 1,rows : -1})
                        }
                    },
                    onSelect : function(data){
                        setItemCheck(true,data.id);
                        checkedMember(data);
                    },
                    onUnSelect : function(datas){
                        if(datas){
                            if($.isArray(datas)){
                                var id;
                                for(var i=0;i<datas.length;i++){
                                    id=datas[i].id;
                                    uncheckedMember(id);
                                    setItemCheck(false,id);
                                }
                            }else{
                                uncheckedMember(datas.id);
                                setItemCheck(false,datas.id);
                            }
                        }
                    }
                });

                if (defaultValues) {
                    $(selectorId + "-selector").pickMem("setValues",defaultValues);
                }

                var setItemCheck = function (isChecked, id) {
                    $("input[name='" + random + "_itemBox']").each(function () {
                        if ($(this).attr("data-id") === id) {
                            this.checked = isChecked;
                        }
                    });
                };


                var _checkedMemberList = new Array();
                var checkedMember = function (data) {
                    if (!_checkedMemberList.contains(data.id)) {
                        _checkedMemberList.push(data.id);
                        var ids = $(selectorId + "-selector").pickMem("getIds");
                        if (!ids.contains(data.id)) {
                            $(selectorId + "-selector").pickMem("setValue", data);
                        }
                        var tmpNodes = $(selectorId + "-tree").fancytree("getTree").getNodesByRef(data.id);
                        if (tmpNodes != null) {
                            $.each(tmpNodes,
                                function (i, node) {
                                    node.setSelected(true);
                                });
                        }
                        _checkedMemberList.remove(data.id);
                        // $(selectorId+"-body").css("padding-bottom",$(selectorId + "-selector .pickContainer").outerHeight(true)+110+"px");
                    }
                };

                var _uncheckedMemberList = new Array();
                var uncheckedMember = function (memId) {
                    if (!_uncheckedMemberList.contains(memId)) {
                        _uncheckedMemberList.push(memId);
                        var tmpNodes = $(selectorId + "-tree").fancytree("getTree").getNodesByRef(memId);
                        if (tmpNodes != null) {
                            $.each(tmpNodes,
                                function (i, node) {
                                    node.setSelected(false);
                                });
                        }
                        _uncheckedMemberList.remove(memId);
                    }
                };
                $(selectorId + "-tree").fancytree({
                    minExpandLevel: 1,
                    checkbox: true,
//                    selectMode: params.multiple ? 2 : 1,
                    selectMode: 2,
                    autoFocus: false,
                    clickFolderMode: 1,
                    source: {
                        url: "/public/controls/selector/member/selector.member.tree.jsp",
                        data: params
                    },
                    lazyLoad: function (event, ctx) {
                        params["nodeId"] = ctx.node.refKey;
                        ctx.result = {
                            url: "/public/controls/selector/member/selector.member.tree.jsp",
                            data: params
                        };
                    },
                    createNode: function (event, data) {
                        var ids = $(selectorId + "-selector").pickMem("getIds");
                        if (ids.contains(data.node.refKey)) {
                            data.node.setSelected(true);
                        }
                    },
                    select: function (event, data) {
                        if (data.node.selected) {
                            if (_checkedMemberList.contains(data.node.refKey)) return;
                            if (data.node.data.type != "noMember") {
                                var path = [];
                                data.node.visitParents(function (parent) {
                                    path.push(parent.title);
                                }, false);
                                path = path.join(" / ");
                                path = path.substring(0, path.length - 1);

                                if (!params.multiple) {
                                    $(selectorId + "-selector").pickMem("clear");
                                }
                                checkedMember({id: data.node.refKey, text: data.node.title, path: path,parentId:data.node.parent.refKey});
                            }
                        } else {
                            if (_uncheckedMemberList.contains(data.node.refKey)) return;
                            $(selectorId + "-selector").pickMem("unSelect", data.node.refKey);
                            uncheckedMember(data.node.refKey);
                        }
                        if (data.node.data.type == "noMember" && params.multiple) {
                            $.each(data.node.children, function (i, node) {
                                node.setSelected(data.node.selected);
                            });
                        }
                    },click:function(event,data){
                        if(EIIS.browser.phone){
                            $(selectorId+"-body").css("min-height",$(selectorId+"-tree").height()+"px");
                        }
                        if (data.targetType === "title") {
                            data.node.setSelected(!data.node.isSelected());
                        }
                    }, dblclick: function (event, data) {
                        if (params.multiple && data.targetType === "checkbox") {
                            if (data.node.hasChildren() == undefined) {
                                data.node.load();
                                data.node.visit(function (node) {
                                    if(!data.node.key.equalsIgnoreCase(node.key)){
                                        node.setSelected(true);
                                    }
                                }, true);
                            } else {
                                data.node.setExpanded(true);
                                data.node.visit(function (node) {
                                    if(!data.node.key.equalsIgnoreCase(node.key)){
                                        node.setSelected(!node.isSelected());
                                    }
                                }, true);
                            }

                        }
                        return false;
                        //event.preventDefault();
                        //event.stopPropagation();
                    }
                });
                //init buttons
                $(selectorId + " .btn-tree").on({
                    click: function () {
                        params.type = this.name;
                        /*$(selectorId + "-tree").fancytree("option", "source", {
                         url: "/public/controls/selector/member/selector.member.tree.jsp",
                         data: params
                         }).fancytree("getTree").reload();*/
                        $(selectorId + "-tree").fancytree("getTree").reload({
                            url: "/public/controls/selector/member/selector.member.tree.jsp",
                            data: params
                        });
                    }
                });
            })
        }

        $(selectorOkBtn, myModal).off("click");
        $(selectorOkBtn, myModal).on("click", function () {
            var data = $(selectorId + "-selector").pickMem("getValues");
            /*if (params.selector) {// ui方式调用selector属性不为空
             if (data) params.selector.select2("data", data);
             myModal.modal("hide");
             } else {*/
            myModal.modal("hide");
            if ($.isFunction(okFun)) {
                //okFun.apply(self, [data]);
                okFun(data);
            }
//            }
        });
        myModal.on('shown.bs.modal', function (e) {
            //查询结果向上显示

        });
        myModal.modal();

    };
})(window);