KindEditor.plugin('flow_selectlist', function (K) {
    var editor = this, name = 'flow_selectlist';
    editor.plugin.flow_selectlist = {
        edit: function () {
            var html = ['<table width="360" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="80px" align="right">显示名称：</td>',
                '<td>',
                '<input class="webui" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="80px" align="right">绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind" name="databind" style="width:270px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="85px" align="right" nowrap>默认值表达式：</td>',
                '<td>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="80px" align="right">数据来源：</td>',
                '<td>',
                '<input id="datasource" name="datasource" style="width:269px;" readonly />',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="80px" align="right">是否可输入</td>',
                '<td><INPUT type="checkbox" id="enter" name="enter"></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="80px" align="right">选择内容列表：</td>',
                '<td>&nbsp;标题：<INPUT id="ListTitle" class="webui" style="WIDTH: 55px" size=7 name="ListTitle" />',
                '&nbsp;值：<INPUT id="ListText" class="webui" style="WIDTH: 45px" size=4 name="ListText" />',
                '&nbsp;&nbsp;&nbsp;&nbsp;<input class="webui" type="Button" value="添加"  name="btnadd" />',
                '<BR><select id="listvalue" style="WIDTH: 178px;border:1px solid #99CCFF" size=4 name="listvalue" ></select>',
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="webui" type="Button" value="删除"  name="btndel" /></td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 370,
                height: 340,
                title: '流程属性下拉列表',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var enter = document.getElementById('enter').checked;
                        /*var htm = '<select data-code="' + dictionary_code + '" dcode="' + datasource.val() + '" data-input="' + enter + '" class="webui" title="' + title.val() + '" name="' + databind.val() + '" id="' + databind.val() + '"  default_value="' + default_value.val() + '" ctrlname="FlowSelectList">';
                        for (var i = 0; i < listvalue.options.length; i++) {
                            htm += '<option value="' + listvalue.options[i].value + '">' + listvalue.options[i].text + '</option>';
                        }
                        htm += '</select>';*/
                        var sel = $("<select />").attr({
                            "class": "flow select",
                            "ctrlname": "FlowSelectList",
                            "type": "radio",
                            "title": title.val(),
                            "default_value": default_value.val(),
                            "id": databind.val(),
                            "name": databind.val(),
                            "data-code": dictionary_code,
                            "dcode": datasource.val(),
                            "data-input":enter,
                            "style":style
                        });
                        for (var i = 0; i < listvalue.options.length; i++) {
                            sel.append($("<option />").val(listvalue.options[i].value).text(listvalue.options[i].text));
                        }
                        var htm = $("<span />").append(sel).html();
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
                datasource = K('[name="datasource"]', div),
                listTitle = K('[name="ListTitle"]', div),
                listText = K('[name="ListText"]', div),
                default_value = K('[name="default_value"]', div),
                btnadd = K('[name="btnadd"]', div),
                btndel = K('[name="btndel"]', div);
            var dictionary_code = "";
            var style="";
            var str = editor.plugin.getSelectedflow_selectlist();
            //alert(str);
            if (str != undefined) {
                var strr = $(str);
                title.val(strr.attr('title'));
                databind.val(strr.attr('name'));
                default_value.val(strr.attr('default_value'));
                dictionary_code = strr.attr('data-code');
                $("#datasource").val(strr.attr('dcode'));
                style=strr.attr('style')==''?'':strr.attr('style');
                strr.attr('data-input') == 'true' ? document.getElementById('enter').checked = true : document.getElementById('enter').checked = false;
                for (var i = 0; i < str.options.length; i++) {
                    listvalue.options.add(new Option(str.options[i].text, str.options[i].value));
                }
            }
            btnadd.click(function () {
                if (K.trim(listTitle.val()) == '')return;
                listvalue.options.add(new Option(K.trim(listTitle.val()), K.trim(listText.val()))); //这个兼容IE与firefox
                listTitle.val('');
                listText.val('');
            });
            btndel.click(function () {
                listvalue.options.remove(listvalue.selectedIndex);
            });
            //下拉列表选中事件
            listvalue.onchange = function () {
                var text = listvalue.options[listvalue.selectedIndex].text;
                var value = listvalue.options[listvalue.selectedIndex].value;
                listTitle.val(text);
                listText.val(value);
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_selectlist.edit();
        }
    });
});