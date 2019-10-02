KindEditor.plugin('flow_pageattribute', function (K) {
    var editor = this, name = 'flow_pageattribute';
    editor.plugin.flow_pageattribute = {
        edit: function () {
            editor.plugin.flow_pageattribute.openAttribute(page, Function.emptyFunction, Function.emptyFunction);
        },
        openAttribute: function (attPage, define, cancel) {
            var html = '<div align="center">' +
                    '<table width="280" border="0" cellspacing="2" cellpadding="0">' +
                    '<tr>' +
                    '<td align="right" nowrap>名称：</td>' +
                    '<td align="left" nowrap>' +
                    '<input style="width:90%" class="webui" id="page_name" value="' + attPage.getName() + '" />' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td align="right" nowrap>标识：</td>' +
                    '<td align="left" nowrap>' +
                    '<input style="width:90%" class="webui" id="page_code" value="' + attPage.getCode() + '" />' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td align="right" nowrap>表名：</td>' +
                    '<td align="left">' +
                    '<select class="webui" id="tableName" style="width:200px;">' +
                    '<option value="" selected > - - - - - - </option>' +
                    '</select>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td align="right" nowrap>关键字段：</td>' +
                    '<td align="left" nowrap>' +
                    '<input style="width:90%" class="webui"  id="PK" value="' + attPage.getPK() + '" readonly />' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>'
                ;
            var dialog = editor.createDialog({
                width: 290,
                height: 340,
                title: '页面属性',
                body: html,
                yesBtn: {
                    name: '确定',
                    click: function (e) {
                        if (String.isNullOrWhiteSpace($("#page_name", dialog.bodyDiv).val())) {
                            alert('页面名称不能为空！');
                            return;
                        }
                        if (String.isNullOrWhiteSpace($("#page_code", dialog.bodyDiv).val())) {
                            alert('页面标识不能为空！');
                            return;
                        }
                        if (attPage.isNew()) {
                            var existsflag = false;
                            $.ajax({
                                url: "/workflow/pagedesigner/action/check_pagecode.jsp?srccode=&newcode=" + encodeURIComponent($.trim($("#page_code", dialog.bodyDiv).val())),
                                async: false,
                                dataType: "text",
                                success: function (data) {
                                    if ($.trim(data) == "1") {
                                        existsflag = true;
                                    }
                                }
                            });
                            if (existsflag) {
                                alert("标识[" + $.trim($("#page_code", dialog.bodyDiv).val()) + "]已经存在！");
                                return;
                            }
                        }
                        var strs = new Array();
                        strs = $("#tableName", dialog.bodyDiv).val().split(",");
                        attPage.setTable_uuid(strs[0]);
                        attPage.setTableName(strs[1]);
                        attPage.setCode($.trim($("#page_code", dialog.bodyDiv).val()));
                        attPage.setName($.trim($("#page_name", dialog.bodyDiv).val()));
                        attPage.setPK($("#PK", dialog.bodyDiv).val());
                        //dialog.hideDialog();
                        editor.hideDialog();
                        define(attPage);
                    }
                },
                noBtn: {
                    name: '取消',
                    click: function (e) {
                        editor.hideDialog();
                        cancel();
                    }
                },
                closeBtn: {
                    name: '关闭',
                    click: function (e) {
                        editor.hideDialog();
                        cancel();
                    }
                }
            });

            if (attPage.isNew()) {
                $("#page_code", dialog.bodyDiv).input();
            } else {
                $("#page_code", dialog.bodyDiv).prop("disabled", true);
            }

            $.ajax({
                type: "POST",
                async: false,//同步加载
                url: basePath + "flowPageDesigner/core_flowPageDesigner_getTables.do",
                data: {table_uuid: ''},
                success: function (data) {
                    if (data.tables.length > 0) {
                        for (var i = 0; i < data.tables.length; i++) {
                            $("#tableName", dialog.bodyDiv).append("<option value=\"" + data.tables[i].table_uuid + "," + data.tables[i].table_name_en + "\">" + data.tables[i].table_name_cn + "</option>");
                        }
                        //var bFindFlag = false;
                        var len = $("#tableName", dialog.bodyDiv)[0].length;
                        for (var i = 0; i < len; i++) {
                            if ($("#tableName", dialog.bodyDiv)[0].options[i].value == attPage.getTable_uuid() + "," + attPage.getTableName()) {
                                $("#tableName", dialog.bodyDiv)[0].options[i].selected = true;
                                //bFindFlag = true;
                                break;
                            }
                        }

                        /*if ((!bFindFlag) && (!String.isNullOrWhiteSpace(attPage.getTableName()))) {
                            for (var i = 0; i < len; i++) {
                                if ($("#tableName", dialog.bodyDiv)[0].options[i].value.endsWithIgnoreCase("," + attPage.getTableName())) {
                                    $("#tableName", dialog.bodyDiv)[0].options[i].selected = true;
                                    break;
                                }
                            }
                        } */
                    }
                }
            });

            $("#tableName", dialog.bodyDiv).on("change", function () {
                //表中文名称
                //表table_uuid
                var text = this.options[this.selectedIndex].text;
                var value = this.options[this.selectedIndex].value;
                //alert(value);
                var strs = new Array();
                strs = value.split(",");
                $.ajax({
                    type: "POST",
                    async: true,
                    url: basePath + "flowPageDesigner/core_flowPageDesigner_getfieldskeyname.do",
                    data: "table_uuid=" + strs[0],
                    success: function (msg) {
                        $("#PK", dialog.bodyDiv).val(msg.tableskey);
                    }
                });
            });
        }
    };
    editor.clickToolbar(name, editor.plugin.flow_pageattribute.edit);
});


