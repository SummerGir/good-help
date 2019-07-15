(function (window) {
    /*
     * 字典选择器弹出窗口
     */
    if ($.selector == undefined) {
        $.selector = {};
    }

    $.selector.dialog = function (options) {
        var self = this;
        var defaultOptions = {
            readonly: false,
            multiple: true,
            treekind: '',
            freeze: false,
            selectRoot: false,
            attrCode: '',
            roots: '',
            houseId: '',
            exclude: '',
            values: [],
            showitem:true,
            ok: null,
            source: '',
            extendParam:'',
            reqUrl: '',
            reqData: {searchKey:"",rows:20},
            pageCount: '',
            showCol: [],
            showColTitle: []
        };

        var params = $.isEmptyObject(options) ? $.extend(true,{}, defaultOptions) : $.extend(true,{}, defaultOptions, options);
        var okFun = params.ok;
        var onInit = params.onInit;
        if(onInit!==undefined){
            delete params.onInit;
        }
        delete params.ok;
        var defaultValues = params.values ? params.values.join(";") : "";
        var random = new Date().valueOf();
        var selectorId = '#eiis-selectorDicInfoModal' + random;
        var selectorOkBtn = '#eiis-selectorDicInfoOKBtn' + random;
        var myModal = $(selectorId);

        var pageOptions = {
            page: 1,
            url: params.reqUrl,
            term: params.reqData,
            even: "click",
            btns: {
                prev: "li.table-page-prev",
                next: "li.table-page-next"
            }
        };

        var hasNextPage = function (opt) {
            var data = $.extend(true,{},opt.term);
            data.page = opt.page*data.rows+1;
            data.rows = 1;
            var flag = false;
            $.ajax({async: false, dataType: 'json', type: 'post',
                url:opt.url,data:data,
                success:function (d) {
                    if(d.length>0)
                        flag = true;
                }
            });
            return flag;
        };
        var request = function (k) {
            pageOptions.page += k;
            pageOptions.term.page = pageOptions.page;
            $.ajax({async: true, dataType: 'json', type: 'post',
                url:pageOptions.url,data:pageOptions.term,
                success:function (d) {
                    $(selectorId).find('span.page_no').html(pageOptions.page);
                    dialog_grid.createTab(d, params.showColTitle, params.showCol);
                }
            });
        };

        var dialog_grid = {
            _checkedMemberList: [],
            _uncheckedMemberList: [],
            initdialog: function (first) {
                var _this = this;
                $.post(params.reqUrl, params.reqData, function (dd) {
                    if(dd.length==0){
                        if(first)
                            $.message('无数据');
                        if($.isFunction(onInit)){
                            onInit();
                        }
                        return false;
                    }
                    var da = dd;
                    if (da && da.length > 0) {
                        $.ajax({
                            url: "/public/controls/dialog/dialog.jsp",
                            data: {
                                random: random,
                                source: params.source
                            },
                            type: "post",
                            async: false,
                            cache: false,
                            dataType: "html",
                            success: function (data, textStatus, jqXHR) {
                                if ($(selectorId).length == 0) {
                                    $("body").append(data);
                                    $(selectorId + "-selector")
                                        .tagsinput({
                                            idKey: "id",
                                            displayKey: "text",
                                            multiple: params.multiple,
                                            input: {
                                                placeholder: '输入拼音',
                                                source: function (value) {
                                                        params.ids = null;
                                                        params.term = value;

                                                        $(selectorId).find('table.dialog_tab .c').remove();
                                                        params.reqData.searchKey = $.trim(value);
                                                        _this.initdialog();
                                                }
                                            },
                                            button: null
                                        });
                                } else {
                                    $('body').append($(data)[2]);
                                }
                                _this.createTab(da, params.showColTitle, params.showCol);
                                myModal = $(selectorId);
                                var excludes = params.exclude.split(";");
                                $(selectorId + "-selector")
                                    .on({
                                        "remove.tagsinput": function (e, id, data) {
                                            _this.uncheckedMember(id);
                                            _this.setItemCheck(false,id);
                                            $(selectorId + "_checkAll").prop('checked',false);
                                        }
                                    });
                                _this._checkedMemberList = new Array();
                                _this._uncheckedMemberList = new Array();

                                $(selectorOkBtn, myModal).off("click");
                                $(selectorOkBtn, myModal).unbind('click').on("click", function () {
                                    // var data = [];
                                    // $(selectorId).find('table.dialog_tab').find('tr.checked').each(function () {
                                    //     data.push($(this).data('table-row-data'))
                                    // });
                                    var data=$(selectorId + "-selector").tagsinput("getValues");
                                    myModal.modal("hide");
                                    if ($.isFunction(okFun)) {
                                        okFun(data);
                                    }
                                });
                                myModal.on('shown.bs.modal', function (e) {
                                    //查询结果向上显示
                                    $(selectorId + "-selector").find("div[class='tagsinput']").attr("class", "tagsinput dropup");
                                    if (params.source) {
                                        //因为查询列表里的数据是异步的，当页面append进来之前表格的数据还没有查询回来，所以这里刷新一次列表数据
                                        $(selectorId + "-info-table").table("loadData", null, {
                                            "source": params.source,
                                            "extendParam": params.extendParam
                                        });
                                    }
                                });
                                _this._page();
                                myModal.modal();
                                if($.isFunction(onInit)){
                                    onInit();
                                }
                            }
                        });
                    }
                }, 'json')

            },
            createTab: function(jsonArr, showColTitleArr, showColArr) {
                var _this = this;
                $(selectorId).find('table.dialog_tab').empty();
                var t = $('<tr></tr>').css('background', '#e2e2e2').appendTo($(selectorId).find('table.dialog_tab'));
                var d = $('<td></td>').appendTo(t);
                $('<input id="eiis-selectorDicInfoModal' + random + '_checkAll" type="checkbox" />')
                    .on('click', function () {
                        var isChecked = this.checked;
                        $("input[name='" + random + "_itemBox']").each(function () {
                            this.checked = isChecked;
                            _this.itemOnClick(this, $(this).attr("data-id"), $(this).attr("data-name"));
                            if (isChecked)
                                $(this).parents('tr.c').addClass('checked');
                            else
                                $(this).parents('tr.c').removeClass('checked');
                        });
                    })
                    .appendTo(d);
                for (var a = 0; a < showColTitleArr.length; a++) {
                    $('<td></td>').html(showColTitleArr[a]).appendTo(t);
                }
                if (jsonArr && jsonArr.length > 0) {
                    for (var v = 0; v < jsonArr.length; v++) {
                        (function (_data) {
                            var state = true;
                            var numState = _data.numState;
                            var readonly = _data.readonly==0;
                            if (!numState) {
                                if (_data.lastNum == 0) {
                                    state = false;
                                }
                            }
                            var tr = $('<tr></tr>').addClass('c')
                                .appendTo($(selectorId).find('table.dialog_tab'));
                            if(readonly){
                                tr.css({"color":"rgb(200,200,200)"});
                            }else{
                                tr.on('click', function (e) {
                                    $(this).find('input[name="' + random + '_itemBox"]').click();
                                })
                            }
                            if (!state) {
                                tr.css("background-color", "#bbbbbb");
                            }
                            $(tr).data('table-row-data', _data);
                            var td = $('<td></td>').appendTo(tr);
                            for (var v = 0; v < showColArr.length; v++) {
                                (function(_v){
                                    if (_v == 0) {
                                        if (state) {
                                            if(readonly){
                                                $("<i class='esg-font icon-jujue'/>").appendTo(td);
                                            }else{
                                                var checkbox =$('<input type="checkbox" />').attr({
                                                    'name': random + '_itemBox',
                                                    'data-id': _data[showColArr[0]],
                                                    'data-name': _data[showColArr[1]]
                                                })
                                                    .appendTo(td);
                                                checkbox.on('click', function (e) {
                                                    e.stopPropagation();
                                                    var parentTR = $(this).parents('tr.c');
                                                    if ($(this).is(':checked')) {
                                                        $(parentTR).addClass('checked');
                                                    } else {
                                                        $(parentTR).removeClass('checked');
                                                    }
                                                    $(this).tagsinput("putTag", _data);
                                                    var checkedAll = true;
                                                    $(parentTR).parent().find('.c').each(function () {
                                                        if ($(this).find('td:first input').length > 0 && !$(this).find('td:first input').is(':checked'))
                                                            checkedAll = false;
                                                    })
                                                    $(selectorId + "_checkAll").prop("checked", checkedAll);
                                                    _this.itemOnClick(this, $(this).attr("data-id"), $(this).attr("data-name"));
                                                });
                                            }
                                        }
                                    } else
                                        $('<td></td>').html(_data[showColArr[v]]).appendTo(tr);
                                })(v)
                            }
                        })(jsonArr[v])
                    }
                }
            },
            itemOnClick: function (e, itemId, title) {
                var _this = this;
                if (e.checked) {
                    if (_this._checkedMemberList.contains(itemId)) return;
                    if (!params.multiple) {
                        $(selectorId + "-selector").tagsinput("clearTag");
                    }
                    var row = $($(e).parents("tr")[0]).data("table-row-data");
                    var specName = row.dicName;
                    var unitId = row.dicId;
                    var unitName = row.dicName;
                    var sum = 100;
                    if (String.isNullOrEmpty(specName)) {
                        specName = "";
                    }
                    if (String.isNullOrEmpty(unitId)) {
                        unitId = "";
                    }
                    if (String.isNullOrEmpty(unitName)) {
                        unitName = "";
                    }
                    if (String.isNullOrEmpty(sum)) {
                        sum = "";
                    }
                    _this.checkedMember($.extend(true,{},{
                        id: itemId,
                        text: title,
                        path: "",
                        sum: sum,
                        specName: specName,
                        unitId: unitId,
                        unitName: unitName
                    },row));
                } else {
                    if (_this._uncheckedMemberList.contains(itemId)) return;
                    _this.uncheckedMember(itemId);
                }
            },
            checkedMember: function (data) {
                var _this = this;
                if (!_this._checkedMemberList.contains(data.id)) {
                    _this._checkedMemberList.push(data.id);
                    var ids = $(selectorId + "-selector").tagsinput("getIds");
                    if (!ids.contains(data.id)) {
                        $(selectorId + "-selector").tagsinput("putTag", data);
                    }
                    _this._checkedMemberList.remove(data.id);
                }
            },
            uncheckedMember: function (memId) {
                var _this = this;
                if (!_this._uncheckedMemberList.contains(memId)) {
                    _this._uncheckedMemberList.push(memId);
                    $(selectorId + "-selector").tagsinput("removeTag", memId);
                    _this._uncheckedMemberList.remove(memId);
                }
            },
            setItemCheck: function (isChecked, id){
                $("input[name='"+random+"_itemBox']").each(function(){
                    if($(this).attr("data-id") === id){
                        this.checked = isChecked;
                        $(this).parents('tr.checked').removeClass('checked');
                    }
                })
            },
            _page: function() {
                $(pageOptions.btns.prev).unbind("click").on("click",function(){
                    if(pageOptions.page>1){
                        request(-1);
                    }
                });
                $(pageOptions.btns.next).unbind("click").on("click",function(){
                    if(hasNextPage(pageOptions)){
                        request(1);
                    }
                });
            }
        };
        if (myModal.length == 0) {
            dialog_grid.initdialog(true);
        }

    };
})(window);