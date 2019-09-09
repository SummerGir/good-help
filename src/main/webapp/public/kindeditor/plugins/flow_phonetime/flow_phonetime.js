KindEditor.plugin('flow_phonetime', function (K) {
    var editornn = this, name = 'flow_phonetime';
    editornn.plugin.flow_phonetime = {
        edit: function () {
            var html = [
                '<table width="294" border="0" cellspacing="2" cellpadding="0">',
                '<input type="hidden" id="plugins" name="plugins" value="EIISFlowTextBox"  >',
                '<tr>',
                '<td height="26px" width="80px" align="right">显示名称:</td>',
                '<td colspan=3>',
                '<input class="webui" style="width:95%" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">绑定字段:</td>',
                '<td colspan=3 nowrap>',
                '<select class="webui" id="databind" name="databind" style="width:210px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">默认值表达式:</td>',
                '<td colspan=3>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '	<td nowrap align="right">时间格式:</td>',
                '	<td nowrap colspan=3><select class="webui" style="width:120px;" id="datetype" name="datetype">',
                '			<option value="yy-MM-dd">yy-MM-dd</option>',
                '			<option value="yy-MM-dd HH:ii">yy-MM-dd HH:ii</option>',
                '		</select></td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">最小值:</td>',
                '<td colspan=3>',
                '<input class="webui customtext" id="min_value" name="sTime" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">最大值:</td>',
                '<td colspan=3>',
                '<input class="webui customtext" id="max_value" name="eTime" style="width:210px;">',
                '</td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editornn.createDialog({
                name: name,
                width: 300,
                height: 340,
                body: html,
                title: editornn.lang(name),
                yesBtn: {
                    name: editornn.lang('yes'),
                    click: function (e) {
                        var datetype = document.getElementById('datetype').checked;
                        var _title = title.val(),
                            _databind = databind.val(),
                            _sTime = sTime.val(),
                            _eTime = eTime.val(),
                            _default_value = default_value.val();
                        var htm = $("<span />").append($("<input />").attr({
                            "class": "flow phonetime",
                            "ctrlname": "FlowPhonetime",
                            "type": "text",
                            "title": _title,
                            "default_value": _default_value,
                            "sTime":_sTime,
                            "eTime":_eTime,
                            "eiis-datetype": datetype,
                            "id": _databind,
                            "name": _databind,
                            "value": _databind,
                            "style": style
                        })).html();
                        editornn.insertHtml(htm).hideDialog().focus();
                    }
                }
            });

            var div = dialog.div,
                plugins = K('[name="plugins"]', div),
                title = K('[name="title"]', div),
                databind = K('[name="databind"]', div),
                trueBound = K('[name="trueBound"]', div),
                falseBound = K('[name="falseBound"]', div),
                default_value = K('[name="default_value"]', div),
                sTime = K('[name="sTime"]', div),
                eTime = K('[name="eTime"]', div);
            var style = "";

            $("#default_value,#max_value,#min_value", dialog.bodyDiv).on("custclick", function () {
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

                var jqDV = $(this);
                if (String.isNullOrWhiteSpace(jqDV.val())) {
                    jqDV.val(result[0]);
                } else {
                    jqDV.val(jqDV.val() + " + " + result[0]);
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

            //得到当前选择的控件  赋值  也就是右键条件
            var str = editornn.plugin.getSelectedflow_phonetime();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                sTime.val(str.attr('sTime'));
                eTime.val(str.attr('eTime'));
                if ("none".equals(str.attr('eiis-datetype'))) {
                    document.getElementById('datetype').checked = '';
                } else {
                    str.attr('eiis-datetype') == 'yy-MM-dd' ? document.getElementById('datetype').checked = "yy-MM-dd" : document.getElementById('datetype').checked = "yy-MM-dd HH:ii";
                }
                datetype.value = str.attr('eiis-datetype');
                style = str.attr('style') == '' ? '' : str.attr('style');
            }
        }
    };
    editornn.clickToolbar(name, function () {
        if (judge()) {
            editornn.plugin.flow_phonetime.edit();
        }
    });
});


