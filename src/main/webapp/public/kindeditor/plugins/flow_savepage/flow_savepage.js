KindEditor.plugin('flow_savepage', function (K) {
    var editor = this, name = 'flow_savepage';
    editor.plugin.flow_savepage = {
        edit: function () {
            if (String.isNullOrWhiteSpace(page.getCode())) {
                alert('页面名称不能为空，请到页面属性中设置页面名称！');
                editor.loadPlugin('flow_pageattribute', function () {
                    editor.plugin['flow_pageattribute']['edit']();
                });
                return;
            }
            editor.plugin.flow_savepage.save(page.getCode(),
                page.isNew(),
                page,
                editor.html(),
                function (data, textStatus, jqXHR) {
                    page.setNew(false);
                });
            return false;
        },
        save: function (code, isNew, savePage, html, saveSuccess) {
            var page_content_html = savePage.getSaveContent(html);
            var page_content = page_content_html;
            page_content = editor.edit.beforeGetHtml(page_content);
            $.ajax({
                type: "POST",
                async: true,
                url: "/workflow/pagedesigner/action/save_page_content.jsp",
                data: {
                    "page_code": code,
                    "is_new": isNew,
                    "upload_path": editor.uploadPath,
                    "page_content": page_content
                },
                dataType: "json",
                error: $.message.ajaxError,
                /*error: function (jqXHR, textStatus, errorThrown) {
                    alert(page_content_html);
                    alert(page_content);
                },*/
                success: function (data, textStatus, jqXHR) {
                    savePage.setContent(page_content_html);
                    saveSuccess(data, textStatus, jqXHR);
                    alert("保存成功！");
                }
            });
        }
    };
    editor.clickToolbar(name, editor.plugin.flow_savepage.edit);
});


