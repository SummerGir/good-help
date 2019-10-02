KindEditor.plugin('flow_member', function (K) {
    var editor = this, name = 'flow_member';
    editor.plugin.flow_member = {
        edit: function () {
            var html = [
                '<table width="440" >',
                '<tr>',
                '<td height="26px" width="90px" align="right">显示名称：</td>',
                '<td colspan=3>',
                '<input class="webui" id="title" name="title" type="text" /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" align="right">绑定字段：</td>',
                '<td colspan=3>',
                '<select class="webui" id="databind" name="databind" style="width:335px;">',
                '<option></option>',
                '</select>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right" >默认值表达式：</td>',
                '<td colspan=3>',
                '<input class="webui customtext" id="default_value" name="default_value" style="width:210px;">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right">选择范围：</td>',
                '<td colspan="3">',
                '<input type="radio" id="SelectRoot" name="SelectRoot" value="-2" />发起者部门',
                '<input type="radio" id="SelectRoot" name="SelectRoot" value="-1" />使用者部门',
                '<input type="radio" id="SelectRoot" name="SelectRoot" value="0" checked />指定部门',
                '<input type="radio" id="SelectRoot" name="SelectRoot" value="-3" />指定岗位',
                '<div id="SelectMember" name="SelectMember" style="display: block">',
                '<input style="width:98%" name="root" id="root" />',
                '</div>',
                '<div id="SelectRoles" name="SelectRoles" style="display:none">',
                '<input style="width:98%" name="role" id="role" />',
                '</div>',
                '</td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right">允许选择根：</td>',
                '<td><input class="webui" type="checkbox" id="AllowRoot" name="AllowRoot"  /></td>',
                '<td height="26px" nowrap align="right">是否多选：</td>',
                '<td><input class="webui" type="checkbox" id="multiple" name="multiple"  /></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right">允许选择部门：</td>',
                '<td><input class="webui" type="checkbox" id="isDept" name="isDept" checked></td>',
                '<td height="26px" nowrap align="right">允许选择岗位：</td>',
                '<td><input class="webui" type="checkbox" id="isStation" name="isStation" checked ></td>',
                '</tr>',
                '<tr>',
                '<td height="26px" nowrap align="right">允许选择人员：</td>',
                '<td><input calss="webui" type="checkbox" id="isUser" name="isUser" checked></td>',
                '<td height="26px" align="right"></td>',
                '<td></td>',
                '</tr>',
                '</table>'].join('');
            var dialog = editor.createDialog({
                name: name,
                width: 450,
                height: 340,
                title: '插入/编辑 流程组织机构选择控件',
                body: html,
                yesBtn: {
                    name: editor.lang('yes'),
                    click: function () {
                        var selectedroot = document.getElementById('AllowRoot').checked;
                        var isDept = document.getElementById('isDept').checked;
                        var isStation = document.getElementById('isStation').checked;
                        var isUser = document.getElementById('isUser').checked;
                        var multiple = document.getElementById('multiple').checked;
                        switch (stype) {
                            case -2:
                                //发起者部门
                                root.val('<%=Person.get(UUIDUtils.parse(applyUser)).getDept().getId().toString()%>');
                                break;
                            case -1:
                                //使用者部门
                            	root.val('<%=Person.get(UUIDUtils.parse(userId)).getDept().getId().toString()%>');
                                break;
                            case 0:
                            	//...
                            	break;
                            case -3:
                                root.val(role.val());
                                break;
                            case '-3':
                                root.val(role.val());
                                break;
                        }

                        /*var htm='<input class="webui member" '+
                         //									'contenteditable="true" '+
                         'ctrlname="FlowMember" type="text" ' +
                         'title="'+title.val()+'" ' +
                         'id="'+databind.val()+'" ' +
                         'name="'+databind.val()+'" ' +
                         'data-select-root="'+selectedroot+'" ' +
                         'data-dept="'+isDept+'" ' +
                         //'data-freeze="'+isStation+'" ' +
                         'data-multiple="'+multiple+'"'+
                         'data-person="'+isUser+'" ' +
                         'data-post="'+isStation+'" ' +
                         'data-id="'+root.val()+'" ' +
                         'default_value="'+default_value.val()+'" ' +
                         'stype="'+stype+'" ' +
                         'value="成员("'+databind.val()+') ' +
                         '/>';*/
                        var htm = $("<span />").append($("<input />").attr({
                            "class": "flow member",
                            "ctrlname": "FlowMember",
                            "type": "text",
                            "title": title.val(),
                            "default_value": default_value.val(),
                            "id": databind.val(),
                            "name": databind.val(),
                            "data-select-root": selectedroot,
                            "data-dept": isDept,
                            "data-multiple": multiple,
                            "data-person": isUser,
                            "data-post": isStation,
                            "data-id": root.val(),
                            "stype": stype,
                            "value": "成员(" + databind.val() + ")",
                            "style":style
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

            $("#root").member({
                multiple: false,//是否可多选
                root: '',
                freeze: true,//成员搜索
                dept: true,//部门
                post: false,//岗位
                person: false,//人员
                attr: '',
                selectRoot: false,//是否选择跟
                ok: function (event, values, formatValue) {

                },
                cancel: function (event) {

                }
            });

            $("#role").member({
                multiple: false,//是否可多选
                root: '',
                freeze: true,//成员搜索
                dept: false,//部门
                post: true,//岗位
                person: false,//人员
                attr: '',
                selectRoot: false,//是否选择跟
                ok: function (event, values, formatValue) {

                },
                cancel: function (event) {

                }
            });

            var div = dialog.div,
                title = K('[name="title"]', div),
                databind = K('[name="databind"]', div),
                default_value = K('[name="default_value"]', div),
                selectroot = K('[name="SelectRoot"]', div),
                root = K('[name="root"]', div),
                role = K('[name="role"]', div);
            var style="";
            var data_id;
            var stype = 0;

            //恢复初始值
            var str = editor.plugin.getSelectedflow_member();
            if (str) {
                title.val(str.attr('title'));
                databind.val(str.attr('name'));
                default_value.val(str.attr('default_value'));
                str.attr('data-select-root') == 'true' ? document.getElementById('AllowRoot').checked = true : document.getElementById('AllowRoot').checked = false;
                str.attr('data-dept') == 'true' ? document.getElementById('isDept').checked = true : document.getElementById('isDept').checked = false;
                str.attr('data-person') == 'true' ? document.getElementById('isUser').checked = true : document.getElementById('isUser').checked = false;
                str.attr('data-post') == 'true' ? document.getElementById('isStation').checked = true : document.getElementById('isStation').checked = false;
                str.attr('data-multiple') == 'true' ? document.getElementById('multiple').checked = true : document.getElementById('multiple').checked = false;
                //alert(str.attr('data-id'));
                data_id = str.attr('data-id');
                stype = str.attr('stype');
                style=str.attr('style')==''?'':str.attr('style');
                switch (str.attr('stype')) {
                    case '-1':
                        for (var i = 0; i < selectroot.length; i++) {
                            if (selectroot[i].value == -1) {
                                selectroot[i].checked = true;
                                document.getElementById('SelectRoles').style.display = "none";
                                document.getElementById('SelectMember').style.display = "none";
                            }
                        }
                        break;
                    case '-2':
                        for (var i = 0; i < selectroot.length; i++) {
                            if (selectroot[i].value == -2) {
                                selectroot[i].checked = true;
                                document.getElementById('SelectRoles').style.display = "none";
                                document.getElementById('SelectMember').style.display = "none";
                            }
                        }
                        break;
                    case '0':
                        for (var i = 0; i < selectroot.length; i++) {
                            if (selectroot[i].value == 0) {
                                selectroot[i].checked = true;
                                $("#root").val(data_id);
                                document.getElementById('SelectRoles').style.display = "none";
                                document.getElementById('SelectMember').style.display = "block";
                            }
                        }
                        break;
                    case '-3':
                        for (var i = 0; i < selectroot.length; i++) {
                            if (selectroot[i].value == -3) {
                                selectroot[i].checked = true;
                                $("#role").val(data_id);
                                document.getElementById('SelectRoles').style.display = "block";
                                document.getElementById('SelectMember').style.display = "none";
                            }
                        }
                        break;
                }
            }

            selectroot.click(function () {
                //alert(document.getElementById('SelectRoot').value);
                for (var i = 0; i < selectroot.length; i++) {
                    if (selectroot[i].checked == true) {
                        //alert(selectroot[i].value);
                        if (selectroot[i].value == 0) {
                            stype = 0;
                            //root.val('');
                            document.getElementById('SelectRoles').style.display = "none";
                            document.getElementById('SelectMember').style.display = "block";
                        }
                        if (selectroot[i].value == -3) {
                            stype = -3;
                            //root.val(role.val());
                            document.getElementById('SelectRoles').style.display = "block";
                            document.getElementById('SelectMember').style.display = "none";
                        }
                        if (selectroot[i].value == -2) {
                            stype = -2;
                            //root.val(-2);
                            document.getElementById('SelectRoles').style.display = "none";
                            document.getElementById('SelectMember').style.display = "none";
                        }
                        if (selectroot[i].value == -1) {
                            stype = -1;
                            //root.val(-1);
                            document.getElementById('SelectRoles').style.display = "none";
                            document.getElementById('SelectMember').style.display = "none";
                        }
                    }
                }
            });
        }
    };
    editor.clickToolbar(name, function () {
        if (judge()) {
            editor.plugin.flow_member.edit();
        }
    });

});