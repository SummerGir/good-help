KindEditor.plugin('flow_fileupload', function (K) {
    var editor = this, name = 'flow_fileupload';
    editor.plugin.flow_fileupload = {
        edit: function () {
            var html = ['<table width="290" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="100px" align="right">显示名称：</td>',
                '<td>',
                '<input style="width:97%" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right" nowrap>默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">是否可多上传：</td>',
                '<td>',
                '<input type="checkbox" id="multiple_file" />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">是否可编辑：</td>',
                '<td>',
                '<input type="checkbox" id="data_editable" />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">是否显示上传信息：</td>',
                '<td>',
                '<input type="checkbox" id="data_extend" />',
                '</td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '流程文件上传框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var multiple_file = $("#multiple_file", dialog.bodyDiv).prop("checked");
                        var data_editable = $("#data_editable", dialog.bodyDiv).prop("checked");
                        var data_extend = $("#data_extend", dialog.bodyDiv).prop("checked");
                        /*var htm = '';
                         if (upload == true) {
                         htm += '<input class="webui file multiple" ';
                         } else {
                         htm += '<input class="webui file" ';
                         }
                         htm += 'title="' + title.val() + '" id="' + databind.val() + '" name="' + databind.val() + '" default_value="' + default_value.val() + '" upload="' + upload + '" ctrlname="FlowFileUpload" value="附件(' + databind.val() + ')" type="text" />';*/
                        var htm = $("<span />").append($("<input />").attr({
                            "class": "flow file",
                            "ctrlname": "FlowFileUpload",
                            "type": "text",
                            "title": title.val(),
                            "default_value": default_value.val(),
                            "id": databind.val(),
                            "name": databind.val(),
                            "multiple_file": multiple_file,
                            "data_editable": data_editable,
                            "data_extend": data_extend,
                            "value": "附件(" + databind.val() + ")",
                            "style":style
                        })).html();
                        editor.insertHtml(htm).hideDialog().focus();
                    }
                }
            });
            $("#title").input();

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
                default_value = K('[name="default_value"]', div),
                databind = K('[name="databind"]', div);
            //var btn1 = document.getElementById("but1");
            var style="";
            var str = editor.plugin.getSelectedflow_fileupload();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                $("#multiple_file", dialog.bodyDiv).prop("checked", str.attr('multiple_file') == 'true');
                $("#data_editable", dialog.bodyDiv).prop("checked", str.attr('data_editable') == 'true');
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_fileupload.edit();
        }
    });
});