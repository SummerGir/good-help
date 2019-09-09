KindEditor.plugin('flow_calendar', function (K) {
    var editor = this, name = 'flow_calendar';
    editor.plugin.flow_calendar = {
        edit: function () {
            var html = ['<table width="290" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="100px" align="right">显示标题：</td>',
                '<td>',
                '<input class="webui" style="width:200px;" id="title" type="text" /></td>',
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
                '<td nowrap height="26px" width="100px" align="right">默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="100px" align="right">是否选择时间：</td>',
                '<td><input class="webui" type="checkbox" id="isTime" name="isTime"></td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '流程日历',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var is = document.getElementById('isTime').checked;//istime.checked; 无法取到
                        var htm = $("<span />").append($("<input />")
                            .attr({
                                "class": is ? "flow date time" : "flow date",
                                "ctrlname": "FlowCalendar",
                                "type": "text",
                                "title": title.val(),
                                "default_value": default_value.val(),
                                "id": databind.val(),
                                "name": databind.val(),
                                "istime": is,
                                "value": "日历(" + databind.val() + ")",
                                "style":style
                            })
                        ).html();
                        /*var htm = '<input ';
                         if (is) {
                         htm += 'class="webui date time" ';
                         } else {
                         htm += 'class="webui date" ';
                         }
                         htm += 'ctrlname="FlowCalendar"  type="text" ' +
                         'title="' + title.val() + '"  default_value="' + default_value.val() + '" id="' + databind.val() + '" name="' + databind.val() + '"  ' +
                         'istime="' + is + '" value="日历(' + databind.val() + ')"  />';*/
                        editor.insertHtml(htm).hideDialog().focus();
                    }
                }
            });


            var div = dialog.div,
                title = K('[id="title"]', div),
                default_value = K('[id="default_value"]', div),
                databind = K('[id="databind"]', div);
            var style="";
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
                        {
                            label: '缺省值列表',
                            template: 'tree',
                            option: {
                                url: "/workflow/pagedesigner/get_default_value_json.jsp"
                            }
                        }
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


            var str = editor.plugin.getSelectedflow_calendar();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                str.attr('istime') == 'true' ? document.getElementById('isTime').checked = true : document.getElementById('isTime').checked = false;
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_calendar.edit();
        }
    });
});