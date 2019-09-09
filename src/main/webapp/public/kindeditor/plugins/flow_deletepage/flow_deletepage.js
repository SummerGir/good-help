KindEditor.plugin('flow_deletepage', function () {
    var editor = this, name = 'flow_deletepage';
    editor.clickToolbar(name, function () {
        //alert(page.getPath());
        if (page.isNew()) {
            alert("当前页面没有保存！");
        } else {
            if (confirm("确定要删除当前页面吗？")) {
                $.ajax({
                    type: "POST",
                    url: "/workflow/pagedesigner/action/delete_page.jsp",
                    data: {
                        "page_name": page.getCode()
                    },
                    error: $.message.ajaxError,
                    success: function (msg) {
                        page = new Page();
                        //page.setNew(true);
                        //page.setContent(undefined);
                        editor.html('');
                        alert("删除完成！");
                    }
                });
            }
        }

    });
});
