KindEditor.plugin('flow_docnumber', function (K) {
    var editor = this, name = 'flow_docnumber';
    editor.plugin.flow_docnumber = {
        edit: function () {
            var html = [
                '<table width="294" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="30px"  align="right">字类型：</td>',
                '<td>',
                '<select class="webui" id="wordType" name="wordType" style="width:200px;">',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="30px"  align="right">字绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind1" name="databind1" style="width:200px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="30px"  align="right">年绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind2" name="databind2" style="width:200px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="30px"  align="right">号绑定字段：</td>',
                '<td>',
                '<select class="webui" id="databind3" name="databind3" style="width:200px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '</table>'].join('');
                var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '工作流文档编号输入框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var htm = $("<span />").append($("<input />")
                            .attr({
                                "class": "flow docnumber",
                                "ctrlname": "FlowDocnumber",
                                "type": "text",
                                "databind1": databind1.val(),
                                "databind2": databind2.val(),
                                "databind3": databind3.val(),
                                "wordType": wordType.val(),
                                "value": "文档编号输入框"
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
                            $("#databind1").append("<option value=\"" + data.fields[i].column_name_en + "\">" + data.fields[i].column_name_cn + "</option>");
                            $("#databind2").append("<option value=\"" + data.fields[i].column_name_en + "\">" + data.fields[i].column_name_cn + "</option>");
                            $("#databind3").append("<option value=\"" + data.fields[i].column_name_en + "\">" + data.fields[i].column_name_cn + "</option>");
                        }
                    } else {
                        $("#databind1").append("<option>请选择表！</option>");
                        $("#databind2").append("<option>请选择表！</option>");
                        $("#databind3").append("<option>请选择表！</option>");
                    }
                }
            });
            $.getJSON("/app/docnumber/getWordType.do",function(res){
                $.each(res,function(i,v){
                    $("#wordType").append("<option value='"+v+"'>"+v+"</option>")
                });
            });
            var div = dialog.div,
                databind1 = K('[name="databind1"]', div),
                databind2 = K('[name="databind2"]', div),
                databind3 = K('[name="databind3"]', div),
                wordType = K('[name="wordType"]', div);
            var str = editor.plugin.getSelectedflow_docnumber();
            if (str) {
                databind1.val(str.attr('databind1'));
                databind2.val(str.attr('databind2'));
                databind3.val(str.attr('databind3'));
                wordType.val(str.attr('wordType'));
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_docnumber.edit();
        }
    });
});