/**
 * Created by wy on 2014-7-21.
 */
KindEditor.plugin('flow_archive', function (K) {
    var editor = this, name = 'flow_archive';
    editor.plugin.flow_archive = {
        edit:function(){
            var html = [
                '<table width="294" border="0" cellspacing="2" cellpadding="0">',
                '<tr>',
                '<td height="26px" width="80px" align="right">显示名称：</td>',
                '<td>',
                '<input class="webui" style="width:200px;" id="title" name="title" type="text" /></td>',
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
                '<td height="26px" width="90px" align="right">插入附件：</td>',
                '<td align="left"><input checked="checked" type="checkbox" id="attachment" name="attachment" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" width="90px" align="right">插入印章：</td>',
                '<td align="left"><input checked="checked" type="checkbox" id="seal" name="seal" /></td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '工作流红头文件制作框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var attachment = document.getElementById('attachment').checked;
                        var seal = document.getElementById('seal').checked;
                        var tag = $("<div>红头文件制作框</div>")
                            .addClass("flow archive")
                            .attr({
                                "ctrlName":"FlowArchive"
                                ,"id":databind.val()
                                ,"name":databind.val()
                                ,attachment:attachment
                                ,seal:seal
                                ,"title":"红头文件制作框"
                                ,"style":style
                            })
                        editor.insertHtml(tag[0].outerHTML).hideDialog().focus();
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
            var div = dialog.div,
                title = K('[name="title"]', div),
                databind = K('[name="databind"]', div);

            var style="";
            var str = editor.plugin.getSelectedflow_archive();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                str.attr('attachment') == 'true' ? document.getElementById('attachment').checked = true : document.getElementById('attachment').checked = false;
                str.attr('seal') == 'true' ? document.getElementById('seal').checked = true : document.getElementById('seal').checked = false;
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_archive.edit();
        }
    });
});