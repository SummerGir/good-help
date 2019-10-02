KindEditor.plugin('flow_netdisk', function (K) {
    var editornn = this, name = 'flow_netdisk';
    editornn.plugin.flow_netdisk = {
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
                '<td nowrap align="right">项目部id:</td>',
                '<td colspan=3>',
                '<input class="webui" style="width:95%" id="projectId" name="projectId">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">文件类型:</td>',
                '<td colspan=3>',
                '<input class="webui" style="width:95%" id="sourceKind" name="sourceKind">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td nowrap align="right">文件编码:</td>',
                '<td colspan=3>',
                '<input class="webui" style="width:95%" id="formCode" name="formCode">',
                '</td>',
                '</tr>',
                '<tr>',
                '	<td nowrap align="right">业务关系:</td>',
                '	<td nowrap colspan=3><select class="webui" style="width:120px;" id="isSource" name="isSource">',
                '			<option value="none">无</option>',
                '			<option value="true">与业务有关</option>',
                '			<option value="false">与业务无关</option>',
                '		</select></td>',
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
                        var _isSource = document.getElementById('isSource').checked;
                        var _title = title.val(),
                            _databind = databind.val(),
                            _default_value = default_value.val(),
                            _projectId = projectId.val(),
                            _sourceKind = sourceKind.val(),
                            _formCode = formCode.val();
                        var htm = $("<span />").append($("<input />").attr({
                            "class": "flow netdisk",
                            "ctrlname": "FlowNetdisk",
                            "type": "text",
                            "title": _title,
                            "default_value": _default_value,
                            "id": _databind,
                            "name": _databind,
                            "data-dir-code": "001",
                            "data-isSource": _isSource,
                            "data-projectId":_projectId,
                            "data-sourceKind":_sourceKind,
                            "data-formCode":_formCode,
                            "value": "网盘(" + _databind + ")",
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
                projectId = K('[name="projectId"]', div),
                sourceKind = K('[name="sourceKind"]', div),
                formCode = K('[name="formCode"]', div);
            var style="";

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
            var str = editornn.plugin.getSelectedflow_netdisk();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                projectId.val(str.attr('data-projectId'));
                sourceKind.val(str.attr('data-sourceKind'));
                formCode.val(str.attr('data-formCode'));
                if("none".equals(str.attr('data-isSource'))){
                    document.getElementById('isSource').checked = '';
                }else{
                    str.attr('data-isSource') == 'true' ? document.getElementById('isSource').checked = true : document.getElementById('isSource').checked = false;
                }
                isSource.value = str.attr('data-isSource');
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editornn.clickToolbar(name, function () {
        if (judge()) {
            editornn.plugin.flow_netdisk.edit();
        }
    });
});


