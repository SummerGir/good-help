(function (window) {
    /*
     * 字典选择器弹出窗口
     */
    if ($.selector == undefined) {
        $.selector = {};
    }

    $.selector.dialoghaspagecount = function (options) {
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
            reqData: '',
            pageCount: '',
            showCol: [],
            showColTitle: [],
            showColStyle: []
        };

        var params = $.isEmptyObject(options) ? $.extend({}, defaultOptions) : $.extend({}, defaultOptions, options);
        params.reqData.searchKey = "";
        params.reqData.rows = 25;
        var okFun = params.ok;
        delete params.ok;
        var defaultValues = params.values ? params.values.join(";") : "";
        var random = new Date().valueOf();
        var selectorId = '#eiis-selectorDicInfoModal' + random;
        var selectorOkBtn = '#eiis-selectorDicInfoOKBtn' + random;
        var myModal = $(selectorId);

        var pageOptions = {
            pageCount: 5,
            url: params.reqUrl,
            term: params.reqData,
            even: "click",
            btns: {
                prev: "li.table-page-prev",
                next: "li.table-page-next",
                search: "input.table-page-zhiding"
            },
            callback: function (d,o) {
                $(selectorId).find('span.page_no').html(o.pageNo);
                dialog_grid.createTab(d.rows, params.showColTitle, params.showCol);
            }
        };
        var dialog_grid = {
            _checkedMemberList: [],
            _uncheckedMemberList: [],
            initdialog: function (first) {
                var _this = this;
                $.post(params.reqUrl, params.reqData, function (dd) {
                    if(dd.rows.length==0){
                        if(first) {
                            $.message.loader.close();
                            $.message('无数据');
                        }
                        return false;
                    }
                    var da = dd.rows;
                    var totle = dd.records;
                    if (da && da.length > 0) {
                        $.ajax({
                            url: "/public/controls/dialoghaspagecount/dialog.jsp",
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
                                    var data = [];
                                    $(selectorId).find('table.dialog_tab').find('tr.checked').each(function () {
                                        data.push($(this).data('table-row-data'))
                                    });
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
                                var showPageNum = $(selectorId).find('select.table-page-size').val();
                                if(typeof(showPageNum)=="undefined"){
                                    showPageNum = 25;
                                }
                                pageOptions.rows = showPageNum;
                                pageOptions.pageCount = parseInt(Math.floor(totle/showPageNum)) + parseInt(totle%showPageNum>0?1:0);
                                $(selectorId).find('span.page_count').html(pageOptions.pageCount);
                                _this._page();
                                $.message.loader.close();
                                myModal.modal();
                            }
                        });
                    }

                }, 'json')
            },
            createTab: function(jsonArr, showColTitleArr, showColArr) {
                var _this = this;
                $(selectorId).find('table.dialog_tab').empty();
                var t = $('<tr></tr>').css({'background': '#efefef','text-align': 'center','width': '50px'}).appendTo($(selectorId).find('table.dialog_tab'));
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
                    var _td = $('<td></td>').html(showColTitleArr[a]).appendTo(t);
                    if(params.showColStyle.length>0)
                        $(_td).css('width', params.showColStyle[a].width);
                }
                if (jsonArr && jsonArr.length > 0) {
                    for (var v = 0; v < jsonArr.length; v++) {
                        (function (_data) {
                            var state = true;
                            var numState = _data.numState;
                            if (!numState) {
                                if (_data.lastNum <= 0) {
                                    state = false;
                                }
                            }
                            var measureNum = _data.measureNum;
                            if (measureNum != undefined) {
                                if (_data.measureNum <= 0) {
                                    state = false;
                                }
                            }
                            var tr = $('<tr></tr>').addClass('c')
                                .on('click', function (e) {
                                    $(this).find('input[name="' + random + '_itemBox"]').click();
                                }).appendTo($(selectorId).find('table.dialog_tab'));
                            if (!state) {
                                tr.css("color", "rgb(200,200,200)");
                            }
                            $(tr).data('table-row-data', _data);
                            var td = $('<td></td>').css({'text-align': 'center','width': '50px'}).appendTo(tr);
                            for (var v = 0; v < showColArr.length; v++) {
                                (function(_v){
                                    if (_v == 0) {
                                        if (state) {
                                            $('<input type="checkbox" />').attr({
                                                    'name': random + '_itemBox',
                                                    'data-id': _data[showColArr[0]],
                                                    'data-name': _data[showColArr[1]]
                                                })
                                                .on('click', function (e) {
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
                                                })
                                                .appendTo(td);
                                        }else{
                                            $('<span></span>').addClass('esg-font icon-jujue').css('font-size','14px').appendTo(td);
                                        }
                                    } else {
                                        var _td = $('<td></td>').css({'text-align': 'center'});
                                        var _html = _data[showColArr[v]];
                                        if(params.showColStyle.length>0 && v>0){
                                            if(params.showColStyle[v-1].typeStr=='number'){
                                                $(_td).css({'text-align': 'right'});
                                                if(params.showColStyle[v-1].precision)
                                                    _html = Number(_html).toFixed(params.showColStyle[v-1].precision);
                                            }
                                        }
                                        $(_td).html(_html).appendTo(tr);
                                    }
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
                    _this.checkedMember({
                        id: itemId,
                        text: title,
                        path: "",
                        sum: sum,
                        specName: specName,
                        unitId: unitId,
                        unitName: unitName
                    });
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
                //分页
                pageinit(pageOptions);
            }
        }
        if (myModal.length == 0) {
            dialog_grid.initdialog(true);
        }

    };
})(window);