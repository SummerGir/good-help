/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/

// Baidu Maps: http://dev.baidu.com/wiki/map/index.php?title=%E9%A6%96%E9%A1%B5

KindEditor.plugin('flow_code_html', function (K) {
    var editor = this, name = 'flow_code_html';
    editor.clickToolbar(name, function () {
        //$(editor.container[0]).hide();
        var htmlCode = editor.html();
        htmlCode = htmlCode.replaceAll("&lt;", "<");
        htmlCode = htmlCode.replaceAll("&gt;", ">");
        htmlCode = htmlCode.replaceAll("&amp;", "&");
        var code_html_codeeditor = $("<pre />")
            .appendTo("body")
            .text(htmlCode)
            .codeeditor();
        ;
        var code_html_dialog = $("<div />")
            .css({
                "overflow": "hidden",
                "margin": "0px",
                "padding": "0px"
            })
            .append(code_html_codeeditor.codeeditor("widget")).dialog({
                title: editor.lang(name),
                maximized: true,
                closeOnEscape: true,
                //modal: true,
                position: ['left', 'top'],
                resize: function (event, ui) {
                    code_html_codeeditor.codeeditor("option", "width", code_html_dialog.width());
                    code_html_codeeditor.codeeditor("option", "height", code_html_dialog.height());
                },
                buttons: {
                    "确定": function () {
                        editor.html(code_html_codeeditor.codeeditor("value"));
                        $(this).dialog("close");
                    },
                    "取消": function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    code_html_dialog.dialog('destroy');
                    //code_html_dialog.remove();
                    //code_html_dialog = null;
                    code_html_codeeditor.codeeditor('destroy');
                    code_html_codeeditor.remove();
                    code_html_dialog.remove();
                    //$(editor.container[0]).show();
                }
            });
    });
});
