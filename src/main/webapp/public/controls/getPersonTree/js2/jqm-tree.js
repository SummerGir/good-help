/**
 树形
 */

resultData = [];
persontree = {};
samenum = 0;
(function () {
    var Jqmtree = function (conf) {
        var _this = this;
        var options = $.extend(true, {
            version: "201606221710",
            bindId: '#tree',
            title: '',
            defaultdata: [], //默认选中值
            maxNum: null,
            minNum: null,
            isRela: false,  //是否关联子类
            isCheckDep: true,	//部门是否可选
            isCheckPost: true,	//岗位是否可选
            isCheckperson: true, //人员是否可选
            isOpen: false,
            data: [],
            collapsed: false,
            textTag: 'h4',
            callback: function () {
            }
        }, conf);

        var _getdefaultdatastrtree = function () {
            return options.defaultdata.join();
        };
        var _create = function () {
            var o = options;
            resultData = [];
            _makeHtml();
            return _this;
        };

        var _makeHtml = function () {
            var o = options;
            if (o.data.length > 0) {
                var tree = $(o.bindId);
                _combineHtml(tree);
            }
        };
        //生成部门tree
        var _combineHtml = function (tree) {
            var o = options;
            for (var i = 0; i < o.data.length; i++) {
                var node = o.data[i];
                if (typeof(node.pid) == 'undefined')
                    node.pid = 0;
                if (node.pid == 0) {
                    _combineNodeHtml(node, tree, 1);
                }
            }
        };
        var _arrayminus = function (a, b) {
            var newArray = [];
            for (var j = 0; j < a.length; j++) {
                var boo = false;
                for (var k = 0; k < b.length; k++) {
                    if (a[j] == b[k]) {
                        boo = true;
                        break;
                    }
                }
                if (!boo)
                    newArray.push(a[j]);
            }
            return newArray;
        };
        //同步拼音
        var _syncPinyin = function (d, n) {
            resultData = [].concat(typeof resultParam=='object'?resultParam:[]);
            for (var v = 0; v < resultData.length; v++) {
                if (resultData[v].id == d.id) {
                    $(n).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                }
            }
        };
        //递归生成子部门和人员
        var _combineNodeHtml = function (node, tree, num) {
            num++;
            if (num > 3)return;
            var resultHtm;
            var o = options;
            var nodeId = node.id;
            for (var i = 0; i < o.data.length; i++) {
                if (o.data[i].id == nodeId)
                    continue;
                if (typeof (o.data[i].pid) == 'undefined')
                    o.data[i].pid = 0;
                if (o.data[i].pid.indexOf(nodeId)!=-1) {
                    hasSon = true;
                    break;
                }
            }
            //部门
            if (node.type == 1) {
                (function (n) {
                    var parDiv = $('<div></div>').attr('data-role', 'collapsible').addClass('pad-10').appendTo(tree);
                    var textTag = $("<" + o.textTag + ">" + "</" + o.textTag + ">").addClass('font-3').appendTo(parDiv);
                    var titleimg = $('<div></div>').addClass('title-img').addClass('esg-font')
                        .bind('click', function () {
                            var _this = this;
                            if ($(_this).hasClass('icon-zhankai')) {
                                if ($(_this).parent().parent().children('div[data-role="collapsible"]').length == 0) {
                                    for (var i = 0; i < o.data.length; i++) {
                                        if (o.data[i].pid.indexOf(n.id)!=-1) {
                                            var resnode = _combineNodeHtml(o.data[i], parDiv, 2);
                                            _syncPinyin(o.data[i], resnode);
                                        }
                                    }
                                }
                                $(_this).removeClass('icon-zhankai').addClass('icon-shouqi');
                                $(_this).parent().parent().children('div[data-role="collapsible"]').show();
                            } else {
                                $(_this).removeClass('icon-shouqi').addClass('icon-zhankai');
                                $(_this).parent().parent().children('div[data-role="collapsible"]').hide();
                            }
                        })
                        .appendTo(textTag);
                    if (!o.isOpen) {
                        if (num < 3)titleimg.removeClass('icon-zhankai').addClass('icon-shouqi');
                        else titleimg.removeClass('icon-shouqi').addClass('icon-zhankai');
                    } else
                        titleimg.removeClass('icon-zhankai').addClass('icon-shouqi');
                    var titlepng = $('<div></div>').addClass('title-png')
                        .css({'font-size': '20px'}).appendTo(textTag);
                    //$('<img />').addClass('img-circle').css({'width':'40px','height':'40px'}).attr('src','/app/userinfo/member_outphoto.jsp?personId='+ n.id).appendTo(titlepng);
                    //var datatitle = $('<div></div>').addClass('row-desc').html(n.title).appendTo(parRow);
                    var showname = $('<div></div>').addClass('show-name').html(n.title);
                    var treeimg = $('<div></div>').addClass('tree-img')
                        .on('click',function(e){
                            e.stopPropagation();
                            $(this).parents('.font-3').find('.title-img').click();
                        }).appendTo(showname);
                    if(num==2)treeimg.addClass('esg-font icon-gongsi');
                    else treeimg.addClass('esg-font icon-bumen1');
                    //$('<img />').addClass('tree-img-circle').attr('src','/app/userinfo/member_outphoto.jsp?personId='+n.id).appendTo(treeimg);
                    var parRow = $('<div></div>').addClass('pad-10').addClass('row-desc').html(showname)
                        .bind('click', function (event) {
                            if (!o.isCheckDep)return;
                            //阻止事件冒泡
                            event.stopPropagation();
                            resultData = [].concat(resultParam);
                            //移除选中
                            if ($(this).find('div').hasClass('icon-xuanzhong')) {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                $(this).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                                resultData = _contrlResultData(n, 2);
                                //样式处理
                                _contrlResultHtml(textTag, 2);
                                //同步移除
                                var delD = _arrayminus(abc, resultData);
                                for (var h = 0; h < delD.length; h++) {
                                    var tongbu = "tongbu" + delD[h].id;
                                    if(typeof pinyin[tongbu]=='function')
                                        pinyin[tongbu].call(this, delD[h]);
                                }
                            }
                            //选中
                            else {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                resultData = _contrlResultData(n, 1);
                                if (o.maxNum != null && resultData.length > o.maxNum) {
                                    resultData = abc;
                                    $.message('最多选' + o.maxNum + '个')
                                    return;
                                }
                                //样式处理
                                $(this).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                                _contrlResultHtml(textTag, 1);
                                //同步选中
                                var addD = _arrayminus(resultData, abc);
                                for (var h = 0; h < addD.length; h++) {
                                    var tongbu = "tongbu" + addD[h].id;
                                    if(typeof pinyin[tongbu]=='function')
                                        pinyin[tongbu].call(this, addD[h]);
                                }
                            }
                            o.callback(resultData);
                        })
                        .appendTo(textTag);

                    var checkDesc = $('<div></div>').addClass('checkDesc').attr('type', n.type).appendTo(parRow);
                    if(o.isCheckDep)checkDesc.addClass('esg-font icon-weixuanzhong');
                    for (var i = 0; i < o.data.length; i++) {
                        (function (d, pd) {
                            if (typeof (d.pid) == 'undefined')
                                d.pid = 0;
                            if (d.pid == nodeId) {
                                _combineNodeHtml(d, pd, num);
                            }
                        })(o.data[i], parDiv)
                    }
                    if (!o.isOpen && num > 3) {
                        parDiv.addClass('dis-none');
                    }
                    //默认值选中
                    if (_getdefaultdatastrtree().indexOf(n.id) != -1) {
                        $(parRow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                        resultData.push(n);
                    }
                    //同步方法
                    var tongbu = "tongbu" + n.id;
                    persontree[tongbu] = function (d) {
                        if ($(parRow).find('.checkDesc').hasClass('icon-xuanzhong')) {
                            $(parRow).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                            for (var u = 0; u < resultData.length; u++) {
                                if (resultData[u].id == d.id) {
                                    resultData.splice(u, 1);
                                }
                            }
                        } else {
                            $(parRow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                            resultData.push(d);
                        }
                    }
                    resultHtm = parDiv;
                })(node)
            }
            //岗位
            else if (node.type == 2) {
                (function (n) {
                    var parDiv = $('<div></div>').attr('data-role', 'collapsible').addClass('pad-10').appendTo(tree);
                    var textTag = $("<" + o.textTag + ">" + "</" + o.textTag + ">").addClass('font-3').appendTo(parDiv);
                    var titleimg = $('<div></div>').addClass('title-img').addClass('esg-font')
                        .bind('click', function () {
                            var _this = this;
                            if ($(_this).hasClass('icon-zhankai')) {
                                if ($(_this).parent().parent().children('div[data-role="collapsible"]').length == 0) {
                                    for (var i = 0; i < o.data.length; i++) {
                                        if (o.data[i].pid.indexOf(n.id)!=-1) {
                                            var resnode = _combineNodeHtml(o.data[i], parDiv, 2);
                                            _syncPinyin(o.data[i], resnode);
                                        }
                                    }
                                }
                                $(_this).removeClass('icon-zhankai').addClass('icon-shouqi');
                                $(_this).parent().parent().children('div[data-role="collapsible"]').show();
                            } else {
                                $(_this).removeClass('icon-shouqi').addClass('icon-zhankai');
                                $(_this).parent().parent().children('div[data-role="collapsible"]').hide();
                            }
                        })
                        .appendTo(textTag);
                    if (!o.isOpen) {
                        if (num < 3)titleimg.addClass('icon-shouqi');
                        else titleimg.addClass('icon-zhankai');
                    } else
                        titleimg.addClass('icon-shouqi');
                    var titlepng = $('<div></div>').addClass('title-png')
                        .css({
                            'color': '#10A6E2',
                            'font-size': '20px'
                        }).appendTo(textTag);
                    //$('<img />').addClass('img-circle').css({'width':'40px','height':'40px'}).attr('src','/app/userinfo/member_outphoto.jsp?personId='+ n.id).appendTo(titlepng);
                    var showname = $('<div></div>').addClass('show-name').html(n.title);
                    var treeimg = $('<div></div>').addClass('tree-img').addClass('esg-font icon-gangwei1')
                        .on('click',function(e){
                            e.stopPropagation();
                            $(this).parents('.font-3').find('.title-img').click();
                        }).appendTo(showname);
                    //$('<img />').addClass('tree-img-circle').attr('src','/app/userinfo/member_outphoto.jsp?personId='+n.id).appendTo(treeimg);
                    var parRow = $('<div></div>').addClass('pad-10').addClass('row-desc').html(showname)
                        .bind('click', function (event) {
                            if (!o.isCheckPost)return;
                            //阻止事件冒泡
                            event.stopPropagation();
                            resultData = [].concat(resultParam);
                            //移除选中
                            if ($(this).find('.checkDesc').hasClass('icon-xuanzhong')) {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                $(this).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                                resultData = _contrlResultData(n, 2);
                                //样式处理
                                _contrlResultHtml(textTag, 2)
                                //同步移除
                                var delD = _arrayminus(abc, resultData);
                                for (var h = 0; h < delD.length; h++) {
                                    var tongbu = "tongbu" + delD[h].id;
                                    if(typeof pinyin[tongbu]=='function')
                                        pinyin[tongbu].call(this, delD[h]);
                                }
                            }
                            //选中
                            else {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                resultData = _contrlResultData(n, 1);
                                if (o.maxNum != null && resultData.length > o.maxNum) {
                                    resultData = abc;
                                    $.message('最多选' + o.maxNum + '个')
                                    return;
                                }
                                //样式处理
                                $(this).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                                _contrlResultHtml(textTag, 1);
                                //同步选中
                                var addD = _arrayminus(resultData, abc);
                                for (var h = 0; h < addD.length; h++) {
                                    var tongbu = "tongbu" + addD[h].id;
                                    if(typeof pinyin[tongbu]=='function')
                                        pinyin[tongbu].call(this, addD[h]);
                                }
                            }
                            o.callback(resultData);
                        })
                        .appendTo(textTag);
                    var checkDesc = $('<div></div>').addClass('checkDesc').attr('type', n.type).appendTo(parRow);
                    if(o.isCheckPost)checkDesc.addClass('esg-font icon-weixuanzhong');
                    for (var i = 0; i < o.data.length; i++) {
                        (function (d, pd) {
                            if (typeof (d.pid) == 'undefined')
                                d.pid = 0;
                            if (d.pid.indexOf(nodeId) != -1) {
                                _combineNodeHtml(d, pd, num);
                            }
                        })(o.data[i], parDiv)
                    }
                    if (!o.isOpen && num > 3) {
                        parDiv.addClass('dis-none');
                    }
                    //默认值选中
                    if (_getdefaultdatastrtree().indexOf(n.id) != -1) {
                        $(parRow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                        resultData.push(n);
                    }
                    //同步方法
                    var tongbu = "tongbu" + n.id;
                    persontree[tongbu] = function (d) {
                        if ($(parRow).find('.checkDesc').hasClass('icon-xuanzhong')) {
                            $(parRow).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                            for (var u = 0; u < resultData.length; u++) {
                                if (resultData[u].id == d.id) {
                                    resultData.splice(u, 1);
                                }
                            }
                        } else {
                            $(parRow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                            resultData.push(d);
                        }
                    }
                    resultHtm = parDiv;
                })(node)
            }
            //人员
            else if (node.type == 4) {
                (function (n) {
                    var da = $('<div></div>').attr('data-role', 'collapsible').addClass('pad-10').css({
                        'position': 'relative',
                        'height': '45px',
                        'border-bottom': '1px solid #ddd'
                    }).appendTo(tree);
                    var arow = $('<a></a>').addClass('ui-btn').addClass('ui-corner-all').addClass('a-row')
                        .bind('click', function () {
                            if (!o.isCheckperson)return;
                            resultData = [].concat(typeof resultParam=='object'?resultParam:[]);
                            if ($(this).find('.checkDesc').hasClass('icon-xuanzhong')) {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                //数据处理
                                resultData = _contrlResultData(n, 2);
                                //样式处理
                                _contrlResultHtml($(this).parent(), 2)
                                //同步移除
                                var delD = _arrayminus(abc, resultData);
                                for (var h = 0; h < delD.length; h++) {
                                    var tongbu = "tongbu" + delD[h].id;
                                    if (typeof pinyin[tongbu] == 'function')
                                        pinyin[tongbu].call(this, delD[h]);
                                }
                                $(this).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                            }
                            //选中
                            else {
                                var abc = [];
                                for (var c = 0; c < resultData.length; c++) {
                                    abc.push(resultData[c]);
                                }
                                resultData = _contrlResultData(n, 1);
                                if (o.maxNum != null && resultData.length > o.maxNum) {
                                    resultData = abc;
                                    $.message('最多选' + o.maxNum + '个')
                                    return;
                                }
                                _contrlResultHtml($(this).parent(), 1);
                                //同步选中
                                var addD = _arrayminus(resultData, abc);
                                for (var h = 0; h < addD.length; h++) {
                                    var tongbu = "tongbu" + addD[h].id;
                                    if(typeof pinyin[tongbu] == 'function')
                                        pinyin[tongbu].call(this, addD[h]);
                                }
                                $(this).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                            }
                            o.callback(resultData);
                        }).appendTo(da);
                    $('<div></div>').css({
                        'padding-left': '65px',
                        'height': '50px',
                        'line-height': '50px',
                        'font-size': '15px',
                        'display': 'block',
                        'white-space': 'nowrap',
                        'overflow': 'hidden',
                        'text-overflow': 'ellipsis',
                        'max-width': '85%'
                    }).text(n.title).appendTo(arow);
                    var titlepng = $('<div></div>').addClass('tree-img').css({
                        'background-color': '#2dcc70',
                        'left': '35px',
                        'top': '5px'
                    }).appendTo(arow);
                    $('<img />').addClass('tree-img-circle').attr('src','/app/userinfo/member_outphoto.jsp?personId='+n.id).appendTo(titlepng);
                    var checkDesc = $('<div></div>').addClass('checkDesc').attr('type', n.type).appendTo(arow);
                    if(o.isCheckperson)checkDesc.addClass('esg-font icon-weixuanzhong');
                    if (!o.isOpen && num > 3) {
                        da.addClass('dis-none');
                    }
                    //是否包含
                    var isChecked = function (datas, data) {
                        var isHash = false;
                        for (var q = 0; q < datas.length; q++) {
                            if (datas[q].id == data.id) {
                                isHash = true;
                                break;
                            }
                        }
                        return isHash;
                    };
                    //默认值选中
                    if (_getdefaultdatastrtree().indexOf(n.id) != -1) {
                        $(arow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                        if (!isChecked(resultData, n))
                            resultData.push(n);
                    }
                    //同步方法
                    var tongbu = "tongbu" + n.id;
                    if (typeof persontree[tongbu] == 'function') {
                        samenum++;
                        tongbu = tongbu + '_' + samenum;
                    }
                    persontree[tongbu] = function (d) {
                        if ($(arow).find('.checkDesc').hasClass('icon-xuanzhong')) {
                            $(arow).find('.checkDesc').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                            for (var u = 0; u < resultData.length; u++) {
                                if (resultData[u].id == d.id) {
                                    resultData.splice(u, 1);
                                }
                            }
                        } else {
                            $(arow).find('.checkDesc').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                            if (!isChecked(resultData, d))
                                resultData.push(d);
                        }
                    }
                    resultHtm = da;
                })(node)
            }
            return resultHtm;
        };
        //选中样式处理
        var _contrlResultHtml = function (node, contrlType) {
            var o = options;
            if (options.isRela) {
                $(node).parent().find('.checkDesc').each(function () {
                    var add = true;
                    if (contrlType == 1) {
                        if (!o.isCheckDep && $(this).attr('type') == 1)add = false;
                        if (!o.isCheckPost && $(this).attr('type') == 2)add = false;
                        if (!o.isCheckperson && $(this).attr('type') == 4)add = false;
                        if (add)$(this).removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
                    } else {
                        $(this).removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
                    }
                })
            }
        };
        //返回的数据处理 contrlType: 1添加 2移除
        var _contrlResultData = function (data, contrlType) {
            var o = options;
            if (data) {
                if (contrlType == 1) {
                    //检验是否已添加
                    for (var v = 0; v < resultData.length; v++) {
                        var _data = resultData[v];
                        if (_data.id == data.id) {
                            return;
                        }
                    }
                    resultData.push(data);
                    //查询子类并添加
                    if (o.isRela && data.type != 4) {
                        var childArray = [];
                        var newResultDatas = [];
                        childArray = _getChildNode(data, childArray);

                        for (var b = 0; b < childArray.length; b++) {
                            var has = false;
                            for (var v = 0; v < resultData.length; v++) {
                                if (resultData[v].id == childArray[b].id) {
                                    has = true;
                                    break;
                                }
                            }
                            if (!has)
                                newResultDatas.push(childArray[b])
                        }
                        $.merge(resultData, newResultDatas);
                    }
                    return resultData;
                } else if (contrlType == 2) {
                    var newdatas = [];
                    for (var v = 0; v < resultData.length; v++) {
                        var _data = resultData[v];
                        if (_data.id != data.id) {
                            newdatas.push(_data);
                        }
                    }
                    //查询子类并移除
                    if (o.isRela) {
                        var childArray = [];
                        var newResultDatas = [];
                        childArray = _getChildNode(data, childArray);
                        for (var a = 0; a < newdatas.length; a++) {
                            var isHas = false;
                            for (var b = 0; b < childArray.length; b++) {
                                if (newdatas[a].id == childArray[b].id) {
                                    isHas = true;
                                    break;
                                }
                            }
                            if (!isHas)
                                newResultDatas.push(newdatas[a]);
                        }
                        newdatas = newResultDatas;
                    }
                    return newdatas;
                }
            }
        };
        //查询子类
        var _getChildNode = function (node, childArray) {
            var o = options;
            for (var v = 0; v < o.data.length; v++) {
                //部门、岗位、人员是否可选
                if (!o.isCheckDep && o.data[v].type == 1)break;
                if (!o.isCheckPost && o.data[v].type == 2)break;
                if (!o.isCheckperson && o.data[v].type == 4)break;
                if (o.data[v].pid == node.id) {
                    childArray.push(o.data[v]);
                    _getChildNode(o.data[v], childArray);
                }
            }
            return childArray;
        };
        _create();
    };
    window.jqmtree = function (conf) {
        new Jqmtree(conf);
    };
})();
