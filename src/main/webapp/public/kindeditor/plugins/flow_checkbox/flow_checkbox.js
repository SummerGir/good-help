KindEditor.plugin('flow_checkbox', function (K) {
    var editor = this, name = 'flow_checkbox';
    editor.plugin.flow_checkbox = {
        edit: function () {
            var html = [
                '<table width="294" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="80px" align="right">显示名称：</td>',
                '<td>',
                '<input class="webui" style="width:96%" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px"  align="right">绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right">默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px"  align="right">数据来源：<br/>(字典)&nbsp;&nbsp;&nbsp;</td>',
                '<td>',
                '<input id="datacode" name="datacode" style="width:208px;" />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px"  align="right">(表达式)&nbsp;&nbsp;&nbsp;</td>',
                '<td>',
                '<textarea class="" id="datasource" name="datasource" style="width:208px;height:100px;" ></textarea>',
                '</td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '工作流复选框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                    	datacode.val()==''?dictionary_code='':dictionary_code=dictionary_code;
                        var htm = $("<span />").append($("<input />")
                            .attr({
                                "class": "flow checkbox",
                                "ctrlname": "FlowCheckBox",
                                "type": "checkbox",
                                "title": title.val(),
                                "default_value": default_value.val(),
                                "id": databind.val(),
                                "name": databind.val(),
                                "data_code": dictionary_code,
                                "data_source": datasource.val(),
                                "dcode": datacode.val(),
                                "value": "on",
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

            $("#datacode").dictionary({
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
                datacode = K('[name="datacode"]', div),
                datasource = K('[name="datasource"]', div);
            var dictionary_code = "";
            var style="";
            var str = editor.plugin.getSelectedflow_checkbox();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                //datasource.val(str.attr('data-source'));
                dictionary_code = str.attr('data_code');
                $("#datacode").val(str.attr('dcode'));
                datasource.val(str.attr('data_source'));
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_checkbox.edit();
        }
    });
});