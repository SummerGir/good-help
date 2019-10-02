KindEditor.plugin('flow_hidden', function (K) {
    var editor = this, name = 'flow_hidden';
    editor.plugin.flow_hidden = {
        edit: function () {
            var html = ['<table width="290" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="90px" align="right">显示名称：</td>',
                '<td>',
                '<input class="webui" style="width:200px;" id="title" name="title" type="text" /></td>',
                '</tr>',
                '	<tr>',
                '<td height="26px" width="90px" align="right">绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" nowrap>默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;" />',
                '</td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '流程隐藏字段',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        //var htm = '<input type="hidden" class="webui" id="' + databind.val() + '" name="' + databind.val() + '" title="' + title.val() + '" ctrlname="FlowHidden" default_value="' + default_value.val() + '"  />';
                        var htm = $("<span />").append($("<input />")
                            .attr({
                                "class": "flow hidden",
                                "ctrlname": "FlowHidden",
                                "title": title.val(),
                                "default_value": default_value.val(),
                                "id": databind.val(),
                                "name": databind.val()
                            }).css({
                                "backgroundImage": "url(\"/workflow/pagedesigner/images/flowHidden.gif\")",
                                "width": "16px",
                                "height": "16px"
                            })).html();
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

            var div = dialog.div,
                title = K('[name="title"]', div),
                default_value = K('[id="default_value"]', div),
                databind = K('[name="databind"]', div);


            var str = editor.plugin.getSelectedflow_hidden();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
            }

        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_hidden.edit();
        }
    });

});