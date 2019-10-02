KindEditor.plugin('flow_word', function (K) {
    var editor = this, name = 'flow_word';
    editor.plugin.flow_word = {
        edit: function () {
            var html = ['<table width="290" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="90px" align="right">显示名称：</td>',
                '<td>',
                '<input class="webui" style="width:200px;" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" align="right">绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" align="right" nowrap>默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" align="right">文档后缀：</td>',
                '<td align="left"><input class="webui" type="text" name="office" id="office" style="width:200px"/></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" align="right">是否留痕：</td>',
                '<td align="left"><input type="checkbox" id="revisions" name="revisions" /></td>',
                '</tr>',
//				          '<tr>',
//				          '<td height="26px" width="90px" align="right">显示方式：</td>',
//				          '<td align="left">',
//				          '<input type="radio" id="popup" name="showStyle" checked="checked"/>弹出',
//				          '<input type="radio" id="Embedded" name="showStyle"/>嵌入',
//				          '</td>',
//				          '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '流程office编辑器',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
//							var popup = document.getElementById('popup').checked;
//							var htm1= '<button class="webui office" title="'+title.val()+'" contenteditable="false" name="'+databind.val()+'" id="'+databind.val()+'" txtvalue="'+txtValue.value+'" popup="'+popup+'" office="'+office.val()+'" ctrlname="FlowWord">编辑文档</button>';
//                        var htm2 = '<textarea class="webui office" title="' + title.val() + '" name="' + databind.val() + '" id="' + databind.val() + '" default_value="' + default_value.val() + '" office="' + office.val() + '" ctrlname="FlowWord">Office(' + databind.val() + ')</textarea>';
//							popup==true?editor.insertHtml(htm1).hideDialog().focus():
                    	var revisions = document.getElementById('revisions').checked;
                        var htm2 = $("<span />").append($("<textarea />").attr({
                            "class": "flow office",
                            "ctrlname": "FlowWord",
                            "title": title.val(),
                            "default_value": default_value.val(),
                            "id": databind.val(),
                            "revisions": revisions,
                            "name": databind.val(),
                            "office": office.val(),
                            "value": "Office(" + databind.val() + ")",
                            "style":style
                        })).html();
                        editor.insertHtml(htm2).hideDialog().focus();
                    }
                }
            });

            $.ajax({
                type: "POST",
                async: false,
                url: basePath + "flowPageDesigner/core_flowPageDesigner_getfields.do",
                data: {table_uuid: page.getTable_uuid()},
                success: function (data) {
                    if (data.fields.length > 0) {
                        for (var i = 0; i < data.fields.length; i++) {
                            $("#databind").append("<option value=\"" + page.getTableName() + "." + data.fields[i].column_name_en + "\">" + data.fields[i].column_name_cn + "</option>");
                        }
                    } else {
                        $("#databind").append("<option>请选择表！</option>");
                    }
                }
            });

            $("#default_value", dialog.bodyDiv).on("custclick", function () {
                var result = null;
                $.selector({
                    title: "缺省值选择器",
                    multiple: false,
                    tabs: [
                        {label: '缺省值列表',
                            template: 'tree',
                            option: {
                                url: "/workflow/pagedesigner/get_default_value_json.jsp"
                            }}
                    ],
                    define: function (values) {
                        result = values;
                    },
                    cancel: null,
                    close: null
                });
                if (result == null) return;
                if (result.length == 0) return;

                var jqDV = $("#default_value", dialog.bodyDiv);
                if (String.isNullOrWhiteSpace(jqDV.val())) {
                    jqDV.val(result[0]);
                } else {
                    jqDV.val(jqDV.val() + " + " + result[0]);
                }
            });

            var div = dialog.div,
                title = K('[name="title"]', div),
                office = K('[name="office"]', div),
                default_value = K('[name="default_value"]', div),
                databind = K('[name="databind"]', div);
            var style="";
            var strr = editor.plugin.getSelectedflow_word_textarea();
            if (strr) {
                title.val(strr.attr('title'));
                databind.val(strr.attr('name'));
                default_value.val(strr.attr('default_value'));
                office.val(strr.attr('office'));
                strr.attr('revisions') == 'true' ? document.getElementById('revisions').checked = true : document.getElementById('revisions').checked = false;
                style=strr.attr('style')==''?'':strr.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_word.edit();
        }
    });
});