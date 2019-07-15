(function (window) {

    if ($.selector == undefined) {
        $.selector = {};
    }

    $.selector.docmember = function (options) {
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
                url: "/public/controls/selector/member/selector.docmember.jsp",
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
                $(selectorId + "-selector")
                    .tagsinput({
                        idKey: "id",
                        displayKey: "text",
                        multiple: params.multiple,
                        menuTemplate: function (value) {
                            return "<i style='" + value["style"] + "' class='" + value["classIcon"] + "'>&nbsp;&nbsp;</i><b>" + value["text"] + "</b>&nbsp;&nbsp;" + value["path"];
                        },
                        input: {
                            placeholder: '输入成员拼音',
                            source: function (value, callback) {
                                params.ids = null;
                                params.term = value;
                                $.ajax({
                                    dataType: 'json', cache: false,
                                    url: '/app/infocenter/getMemBySeaKey.do',
                                    data: params,
                                    success: function (results) {
                                        callback(results);
                                    }
                                });
                            }
                        },
                        button: null
                    });
                var excludes = params.exclude.split(";");
                if (defaultValues) {
                    params.ids = defaultValues;
                    params.term = "";
                    $.ajax({
                        dataType: 'json',
                        async: false,
                        cache: false,
                        url: '/app/infocenter/getMemBySeaKey.do',
                        data: params,
                        success: function (data) {
                            if (data) {
                                $(selectorId + "-selector").tagsinput("putTag", data);
                            }
                        }
                    });
                }
                $(selectorId + "-selector")
                    .on({
                        "put.tagsinput": function (e, id, data) {
                            checkedMember(data);
                            setItemCheck(true, id);
                            if (excludes.contains(id)) {
                                $(selectorId + "-selector").find("span[data-tag-id='" + id + "']").css({"backgroundColor": "#5cb85c"});
                            }
                        },
                        "remove.tagsinput": function (e, id, data) {
                            uncheckedMember(id);
                            setItemCheck(false, id);
                        },
                        "clear.tagsinput": function (e, ids, datas) {
                            $.each(ids, function (i, id) {
                                uncheckedMember(id);
                                setItemCheck(false, id);
                            });
                        }
                    });

                var setItemCheck = function (isChecked, id) {
                    $("input[name='" + random + "_itemBox']").each(function () {
                        if ($(this).attr("data-id") === id) {
                            this.checked = isChecked;
                        }
                    });
                }


                var _checkedMemberList = new Array();
                var checkedMember = function (data) {
                    if (!_checkedMemberList.contains(data.id)) {
                        _checkedMemberList.push(data.id);
                        var ids = $(selectorId + "-selector").tagsinput("getIds");
                        if (!ids.contains(data.id)) {
                            $(selectorId + "-selector").tagsinput("putTag", data);
                        }
                        var tmpNodes = $(selectorId + "-tree").fancytree("getTree").getNodesByRef(data.id);
                        if (tmpNodes != null) {
                            $.each(tmpNodes,
                                function (i, node) {
                                    node.setSelected(true);
                                });
                        }
                        _checkedMemberList.remove(data.id);
                        $(selectorId+"-body").css("padding-bottom",$(selectorId + "-selector .tagsinput").outerHeight(true)+110+"px");
                    }
                };

                var _uncheckedMemberList = new Array();
                var uncheckedMember = function (memId) {
                    if (!_uncheckedMemberList.contains(memId)) {
                        _uncheckedMemberList.push(memId);
                        $(selectorId + "-selector").tagsinput("removeTag", memId);
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
                        url: "/app/infocenter/getDocMemTree.do",
                        data: params
                    },
                    lazyLoad: function (event, ctx) {
                        params["nodeId"] = ctx.node.refKey;
                        ctx.result = {
                            url: "/app/infocenter/getDocMemTree.do",
                            data: params
                        };
                    },
                    createNode: function (event, data) {
                        var ids = $(selectorId + "-selector").tagsinput("getIds");
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
                                    $(selectorId + "-selector").tagsinput("clearTag");
                                }
                                checkedMember({id: data.node.refKey, text: data.node.title, path: path});
                            }
                        } else {
                            if (_uncheckedMemberList.contains(data.node.refKey)) return;
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
                            url: "/app/infocenter/getDocMemTree.do",
                            data: params
                        });
                    }
                });
            })
        }

        $(selectorOkBtn, myModal).off("click");
        $(selectorOkBtn, myModal).on("click", function () {
            var data = $(selectorId + "-selector").tagsinput("getValues");
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
            $(selectorId + "-selector").find("div[class='tagsinput']").attr("class","tagsinput dropup");
        });
        myModal.modal();

    };
})(window);