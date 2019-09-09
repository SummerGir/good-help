/**
 * Created by wy on 2014-7-21.
 */
KindEditor.plugin('flow_sign', function (K) {
    var editor = this, name = 'flow_sign';
    editor.plugin.flow_sign = {
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
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 300,
                height: 340,
                title: '工作流意见框',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var tag = $("<div>意见签署框</div>")
                            .addClass("flow sign")
                            .attr({
                                "ctrlName":"FlowSign"
                                ,"id":databind.val()
                                ,"name":databind.val()
                                ,"title":"意见签署框"
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
            var str = editor.plugin.getSelectedflow_sign();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                style=str.attr('style')==''?'':str.attr('style');
            }
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_sign.edit();
        }
    });
});