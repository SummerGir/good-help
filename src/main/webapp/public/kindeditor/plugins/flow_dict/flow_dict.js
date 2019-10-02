KindEditor.plugin('flow_dict', function (K) {
    var editor = this, name = 'flow_dict';
    editor.plugin.flow_dict = {
        edit: function () {
            var html = ['<table width="290" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="100px" align="right">显示名称：</td>',
                '<td colspan=3>',
                '<input class="webui" style="width:96%" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">绑定字段：</td>',
                '<td colspan=3>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right" nowrap>默认值表达式：</td>',
                '<td colspan=3>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">数据来源：</td>',
                '<td colspan=3>',
                '<input id="datasource" name="datasource" style="width:208px;" readonly />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">是否多选：</td>',
                '<td colspan=3>',
                '<input class="webui" type="checkbox" id="multiple" name="multiple"  />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">单一值类型：</td>',
                '<td colspan=3>',
                '<input class="webui" type="checkbox" id="valuemode" name="valuemode"  />',
                '</td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '流程字典选择框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                    	var multiple = $("#multiple", dialog.bodyDiv).prop("checked");
                    	var valuemode = $("#valuemode", dialog.bodyDiv).prop("checked");
                        /*var htm = '<input class="webui dictionary" type="text" ctrlname="FlowDict" ' +
                         'title="' + title.val() + '" name="' + databind.val() + '" id="' + databind.val() + '" default_value="' + default_value.val() + '" ' +
                         'data-multiple="' + multiple + '"  data-childonly="false" data-valuemode="false" ' +
                         'data-code="' + dictionary_code + '" dcode="' + datasource.val() + '" ' +
                         ' value="字典(' + databind.val() + ')" />';*/
                        var htm = $("<span />").append($("<input />")
                            .attr({
                                "class": "flow dictionary",
                                "ctrlname": "FlowDict",
                                "type": "text",
                                "title": title.val(),
                                "default_value": default_value.val(),
                                "id": databind.val(),
                                "name": databind.val(),
                                "data-multiple": multiple,
                                "data-childonly": "false",
                                "data-typeonly": "false",
                                "data-valuemode": valuemode,
                                "data-code": dictionary_code,
                                "dcode": datasource.val(),
                                "value": "字典(" + databind.val() + ")",
                                "style":style
                            })
                        ).html();
                        editor.insertHtml(htm).hideDialog().focus();
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

            $("#datasource").dictionary({
                multiple: false,
                code: '',
                childOnly: false,//是否只能选择子节点
                valueMode: false,
                typeOnly: true,
                ok: function (event, values, formatValue) {
                    var id = values.length == 0 ? '' : values[0].value;
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: basePath + "flowPageDesigner/dic_code.do",
                        data: {type_id: id},
                        success: function (data) {
                            dictionary_code = data.dic_code;
                        }
                    });
                },
                cancel: function (event) {
                }
            });

            var div = dialog.div,
                title = K('[name="title"]', div),
                databind = K('[name="databind"]', div),
                default_value = K('[name="default_value"]', div),
                datasource = K('[name="datasource"]', div);
            var dictionary_code = "";
            var style="";
            var str = editor.plugin.getSelectedflow_dict();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                $("#multiple", dialog.bodyDiv).prop("checked", str.attr('data-multiple') == 'true');
                $("#valuemode", dialog.bodyDiv).prop("checked", str.attr('data-valuemode') == 'true');
                dictionary_code = str.attr('data-code');
                $("#datasource").val(str.attr('dcode'));
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_dict.edit();
        }
    });
});