$.extend($.fn.treegrid.methods, {
    //添加列编辑
    addEditor: function(_this, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(_this).treegrid('getColumnOption', typeof item == 'string'?item:item.field);
                e.editor = typeof item == 'string'?{type: 'text'}:item.edit;
            });
        } else {
            var e = $(_this).treegrid('getColumnOption', typeof param == 'string'?param:param.field);
            e.editor = typeof param == 'string'?{type: 'text'}:param.edit;
        }
    },
    //移除列编辑
    removeEditor: function(_this, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(_this).treegrid('getColumnOption', item);
                delete e.editor;
            });
        } else {
            var e = $(_this).treegrid('getColumnOption', param);
            delete e.editor;
        }
    }
});