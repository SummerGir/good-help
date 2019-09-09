/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/

// Baidu Maps: http://dev.baidu.com/wiki/map/index.php?title=%E9%A6%96%E9%A1%B5

KindEditor.plugin('flow_openpage', function (K) {
    var editor = this, name = 'flow_openpage';
    editor.clickToolbar(name, function () {
        if (page.getContent() != page.getSaveContent(editor.html())) {
            if (confirm("当前页面经过修改，你需要保存后再打开吗？")) {
                editor.loadPlugin('flow_savepage', function () {
                    editor.plugin['flow_savepage']['edit']();
                });
                return;
            }
        }

        var html = ['<div style="padding:10px 20px;">',
            '<div>搜索页面</div>',
            '<input id="keyWord" style="width:150px;" />&nbsp;',
            '<button class="webui" id="searchBtn" >搜索</button>',
            '&nbsp;&nbsp;&nbsp;&nbsp;<button class="webui" id="newBtn" >新建页面</button>',
            '<div>',
            '<hr />',
            '</div>',
            '<select id="fileName" size="16" style="width:100%;border:1px solid #99CCFF" >',
            '</select>',
            '</div>'].join('');
        var dialog = editor.createDialog({
            name: name,
            width: 360,
            height: 400,
            title: editor.lang(name),
            body: html,
            yesBtn: {
                name: editor.lang('yes'),
                click: function (e) {
//                	var str = $("#filename").options[$("#filename").options.selectedIndex].text();
//                	var str =$("#filename").find('option:selected').val();
//                	var str =$("select[id=filename]").val();
                    //var str = fileName.value; // 列表选择
                    //alert(fileName.value);
                    var jqFileName = $("#fileName");
                    //page.setPath(jqFileName.val());
                    var tmpCode = jqFileName.val();
                    $.ajax({
                        url: "/workflow/pagedesigner/action/get_page_content.jsp",
                        data: {
                            "page_code": tmpCode
                        },
                        dataType: "text",
                        error: $.message.ajaxError,
                        success: function (data, textStatus, jqXHR) {
                            var page_content = document.createElement("div");
                            page_content.innerHTML = data;
                            var content = $(page_content);
                            var property = content.children("#page_property");
                            page.setCode(tmpCode);
                            page.setName(property.attr('page_name'));
                            page.setTableName(property.attr('table_name'));
                            page.setPK(property.attr('table_key'));
                            page.setTable_uuid(property.attr('table_id'));
                            page.setNew(false);

                            var htmlCode = content.children("#page_content").html();
                            if ($(htmlCode).filter("pre.flow_java_code").length == 0) {
                                htmlCode = "<pre class=\"flow_java_code\" style=\"display:none;\">\r\n&lt;%\r\n//可以在此处可以插入 Java 代码\r\n\r\n%&gt;\r\n</pre>" + htmlCode;
                            }
                            htmlCode = htmlCode.replaceAll("&lt;%", "<%");
                            htmlCode = htmlCode.replaceAll("%&gt;", "%>");
                            editor.html(htmlCode);

                            page.setContent(page.getSaveContent(editor.html()));

                            editor.hideDialog();
                        }
                    });
                }
            }
        });
        $("#keyWord", dialog.bodyDiv).input();
        $("#newBtn", dialog.bodyDiv).on("click", function () {
            editor.loadPlugin('flow_newpage', function () {
                editor.plugin['flow_newpage']['newCreate'](function () {
                    editor.hideDialog();
                }, Function.emptyFunction);
            });
        });


        var pageList = [];
        var updateList = function (data) {
            var jqFileName = $("#fileName");
            jqFileName.empty();
            $.each(data, function () {
            	var tmpValue = this;
            	var arr = tmpValue.split("\|");
            	if (arr.length == 2){
            		jqFileName.append($("<option />")
                    .val(arr[1])
                    .text(arr[0]));
            	}
            });
        }

        var div = dialog.div,
            addressBox = K('#keyWord', div),
            searchBtn = K('#searchBtn', div);
        $.ajax({
            url: "/workflow/pagedesigner/action/get_page_list_json.jsp",
            dataType: "json",
            error: $.message.ajaxError,
            success: function (data, textStatus, jqXHR) {
                pageList = data;
                updateList(pageList);
            }
        });
        searchBtn.click(function () {
            var key = addressBox.val();
            if (String.isNullOrWhiteSpace(key)) {
                updateList(pageList);
                return;
            }
            var tmpList = [];
            for (var i = 0, j = pageList.length; i < j; i++) {
            	var arr = pageList[i].toLowerCase().split("\|");
            	if (arr.length == 2){
            		if (arr[0].indexOf(key) >= 0) {
            			tmpList.add(pageList[i]);
            		}
            	}
            }
            updateList(tmpList);
        });
    });
});
