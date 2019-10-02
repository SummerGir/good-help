KindEditor.plugin('flow_newpage', function (K) {
    var editor = this, name = 'flow_newpage';
    var table_uuid = page.getTable_uuid();
    editor.plugin.flow_newpage = {
        edit: function () {
            if (page.getContent() != page.getSaveContent(editor.html())) {
                if (confirm("当前页面经过修改，你需要保存后再新建吗？")) {
                    editor.loadPlugin('flow_savepage', function () {
                        editor.plugin['flow_savepage']['edit']();
                    });
                    return;
                }
            }
            editor.plugin.flow_newpage.newCreate(Function.emptyFunction, Function.emptyFunction);
        },
        newCreate: function (define, cancel) {
            //page = new Page();
            //editor.html('');
            editor.loadPlugin('flow_pageattribute', function () {
                editor.plugin['flow_pageattribute']['openAttribute'](new Page(), function (newPage) {
                    page = newPage;
                    editor.html('');
                    define();
                }, function () {
                    cancel();
                });
            });
        }
    };
    editor.clickToolbar(name, editor.plugin.flow_newpage.edit);
});


