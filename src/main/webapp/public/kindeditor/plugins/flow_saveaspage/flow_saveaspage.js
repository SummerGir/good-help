KindEditor.plugin('flow_saveaspage', function () {
    var editor = this, name = 'flow_saveaspage';
    editor.plugin[name] = {
        edit: function () {
            var html = '<div align="center">' +
                    '<table width="280" border="0" cellspacing="2" cellpadding="0">' +
                    '<tr>' +
                    '<td align="right" nowrap>新的名称：</td>' +
                    '<td align="left" nowrap><INPUT class="webui" id="fileName" value="' + page.getName() + '"/></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td align="right" nowrap>新的标识：</td>' +
                    '<td align="left" nowrap><INPUT class="webui" id="fileCode" value="' + page.getCode() + '"/></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>'
                ;
            var dialog = editor.createDialog({
                width: 290,
                height: 120,
                title: '页面另存为',
                body: html,
                yesBtn: {
                    name: '确定',
                    click: function (e) {
                        var jqFileName = $("#fileName", dialog.bodyDiv);
                        if (String.isNullOrWhiteSpace(jqFileName.val())) {
                            alert('页面名称不能为空！');
                            return;
                        }
                        var jqFileCode = $("#fileCode", dialog.bodyDiv);
                        if (String.isNullOrWhiteSpace(jqFileCode.val())) {
                            alert('页面标识不能为空！');
                            return;
                        }
                        var tmpName = jqFileName.val();
                        var tmpCode = jqFileCode.val();
                        
                        var existsflag = false;
                    	$.ajax({
                    			url:"/workflow/pagedesigner/action/check_pagecode.jsp?srccode=&newcode=" + encodeURIComponent($.trim(tmpCode)),
                    			async: false,
                    			dataType:"text",
                    			success: function(data){
                    				if ($.trim(data) == "1"){
                    					existsflag = true;
                    				}
                    			}
                    		});
                    	if (existsflag){
                    		alert("标识[" + $.trim(tmpCode) + "]已经存在！");
                    		return;
                    	}

                        editor.loadPlugin('flow_savepage', function () {
                            editor.plugin['flow_savepage']['save'](tmpCode,
                                true,
                                page,
                                editor.html(),
                                function (data, textStatus, jqXHR) {
                                    page.setNew(false);
                                    page.setName(tmpName);
                                    page.setCode(tmpCode);
                                    editor.hideDialog();
                                }
                            );
                        });
                    }
                },
                noBtn: {
                    name: '取消',
                    click: function (e) {
                        editor.hideDialog();
                    }
                }
            });
        }
    }
    ;
    editor.clickToolbar(name, editor.plugin[name].edit);
})
;
