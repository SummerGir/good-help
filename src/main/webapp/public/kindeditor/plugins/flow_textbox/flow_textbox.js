KindEditor.plugin('flow_textbox', function (K) {
    var editornn = this, name = 'flow_textbox';
    editornn.plugin.flow_textbox = {
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
                /*'<tr >',
                 '<td nowrap align="right">宽&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</td>',
                 '<td nowrap colspan=3 ><input class="webui number" data-min=0 style="width:90px;" maxlength="4" id="txtSize" name="txtSize"></td>',
                 '</tr>',*/
                /*'<tr >',
                 '	<td nowrap align="right" >最大字符数:</td>',
                 '	<td nowrap colspan=3 ><input class="webui number" data-min=0 style="width:90px;" maxlength="4" id="txtMax" name="txtMax"></td>',
                 '</tr>',*/
                '<tr>',
                '	<td nowrap align="right">控件类型:</td>',
                '	<td nowrap colspan=3><select class="webui" style="width:120px;" id="txtType" name="txtType">',
                '			<option value="text">明文类型</option>',
                '			<option value="password">密码类型</option>',
                '		</select></td>',
                '</tr>',
                '<tr>',
                '	<td nowrap align="right">取值类型:</td>',
                '	<td nowrap colspan=3><select class="webui" style="width:120px;" id="valueType" name="valueType">',
                '			<option value="">字符串</option>',
                '			<option value="integer">整数</option>',
                '			<option value="float">浮点数</option>',
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
                        var _title = title.val(),
                            _databind = databind.val(),
                            _default_value = default_value.val(),
                        //_txtSize = txtSize.val(),
                        //_txtMax = txtMax.val(),
                        //select 取值
                            _txtType = txtType.value,
                            _valueType = valueType.value;
                        /*if (_valueType == '') {
                         var htm = '<input class="webui" ';
                         }
                         if (_valueType == 'integer') {
                         var htm = '<input class="webui number" ';
                         htm += 'data-min="0"';
                         }
                         if (_valueType == 'decimal') {
                         var htm = '<input class="webui number" ';
                         htm += 'data-max="0"';
                         }
                         if (txtSize.val() != "") {
                         htm += 'style="width: ' + txtSize.val() + '" ';
                         }
                         htm += 'title="' + _fileName + '" ';
                         //								htm+='contenteditable="true" ';
                         htm += 'id="' + _databind + '" ';
                         htm += 'name="' + _databind + '" ';
                         htm += 'default_value="' + _default_value + '" ';
                         //htm += 'maxlength="' + _txtMax + '" ';
                         htm += 'type="' + _txtType + '" ';
                         htm += 'valuetype="' + _valueType + '" ';
                         htm += 'ctrlname="FlowTextBox" ';
                         //htm+='value="字段:'+_databind+'" ';
                         htm += 'value="文本(' + _databind + ')" ';
                         htm += '/>';*/
                        var htm = $("<span />").append($("<input />").attr({
                            "class": "flow text",
                            "ctrlname": "FlowTextBox",
                            "type": "text",
                            "title": _title,
                            "default_value": _default_value,
                            "id": _databind,
                            "name": _databind,
                            "text_type": _txtType,
                            "value_type": _valueType,
                            "value": "文本(" + _databind + ")",
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

            /*txtSize = K('[name="txtSize"]', div),
             txtMax = K('[name="txtMax"]', div),*/

                trueBound = K('[name="trueBound"]', div),
                falseBound = K('[name="falseBound"]', div),
                default_value = K('[name="default_value"]', div);

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

            //self.cmd.selection();
            //得到当前选择的控件  赋值  也就是右键条件
            var str = editornn.plugin.getSelectedflow_textbox();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                /*var sty = str.attr('style');
                //alert(sty.substring(6,sty.indexOf('p')));
                txtSize.val(sty.substring(6, sty.indexOf('p')));
                if (str.attr('maxlength') != 2147483647) {
                    txtMax.val(str.attr('maxlength'));
                }*/
                //select 列表赋值
                txtType.value = str.attr('text_type') == 'password' ? 'password' : 'text';
                if (str.attr('value_type') != '') {
                    valueType.value = str.attr('value_type');
                }
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editornn.clickToolbar(name, function () {
        if (judge()) {
            editornn.plugin.flow_textbox.edit();
        }
    });
});


