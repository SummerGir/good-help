KindEditor.plugin('flow_include_grid',function(K) {
	var editor = this, name = 'flow_include_grid';
	editor.plugin.flow_include_grid = {
		edit : function() {
			var html = [
					'<center>',
					'<fieldset  style="width: 95%; text-align: left;">',
					'<legend>主表设置</legend>',
					'<table style="width:100%" border="0">',
					'<tr>',
					'<td width="85px" nowrap>绑定字段：</td>',
					'<td>',
					'<select class="webui" id="databind" name="databind" style="width:439px;">',
					'<option></option>',
	                '</select>',
					'</td>',
					'</tr>', '</table>',

					'</fieldset>',
					'<fieldset  style="width: 95%; text-align: left;">',
					'<legend>页面设置</legend>',
					'<table style="width:100%" border="0">',

					'<tr>',
					'<td nowrap>列表显示标题：</td>',
					'<td><input class="webui" type="text" style="width:430px;" id="title" name="title"/></td>',
					'</tr>',

					'<tr>',
					'<td nowrap>编辑页地址：</td>',
					'<td><input class="webui" type="text" style="width:438px;" id="editPageUrl" name="editPageUrl"/></td>',
					'</tr>',

					'<tr>',
					'<td nowrap>只读页地址：</td>',
					'<td><input class="webui" type="text" style="width:438px;" id="viewPageUrl" name="viewPageUrl"/></td>',
					'</tr>',

					'<tr>',
					'<td nowrap>归档页地址：</td>',
					'<td><input class="webui" type="text" style="width:438px;" id="archivePageUrl" name="archivePageUrl"/></td>',
					'</tr>',


					'</table>',
					'</fieldset>', '</center>' ].join('');
			var dialog = editor.createDialog({
				name : name,
				width : 580,
				height :340,
				title : '数据表格控件',
				body : html,
				yesBtn:{
					name : editor.lang('yes'),
					click : function() {
						var databind = $("#databind").val();
						var viewPageUrl = $("#viewPageUrl").val();
						var editPageUrl = $("#editPageUrl").val();
						var archivePageUrl = $("#archivePageUrl").val();

						if(String.isNullOrWhiteSpace(databind)){
							alert('请选择绑定字段！');
							return;
						}
						if(String.isNullOrWhiteSpace(viewPageUrl)){
							alert('请录入只读页面地址！');
							return;
						}
						if(String.isNullOrWhiteSpace(editPageUrl)){
							alert('请录入编辑页面地址！');
							return;
						}
						if(String.isNullOrWhiteSpace(archivePageUrl)){
							alert('请录入归档页面地址！');
							return;
						}
						var htm = $("<span />").append($("<input />").attr({
							"class": "flow includeGrid",
							"ctrlname": "FlowIncludeGrid",
							"type": "includeGrid",
							"id": databind,
							"name": databind,
							"viewPageUrl":viewPageUrl,
							"editPageUrl":editPageUrl,
							"archivePageUrl":archivePageUrl,
							"value": "文本(" + databind + ")",
							"title":$("#title").val()
						})).html();
						editor.insertHtml(htm).hideDialog().focus();
					}
				},
				noBtn:{
	            	name:'取消',
	            	click:function(){
	            		editor.hideDialog();
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

			$("#viewPageUrl").input();

			//得到当前选择的控件  赋值  也就是右键条件
			var str = editor.plugin.getSelectedflow_include_grid();
			if (str) {
				$("#databind").val(str.attr('name'));
				$("#title").val(str.attr("title"));
				$("#viewPageUrl").val(str.attr("viewPageUrl"));
				$("#editPageUrl").val(str.attr("editPageUrl"));
				$("#archivePageUrl").val(str.attr("archivePageUrl"));
			}
		}
	};
	editor.clickToolbar(name,function(){
		if(judge()){
			editor.plugin.flow_include_grid.edit();
		}
	});
});