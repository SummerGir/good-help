KindEditor.plugin('flow_jqgrid',function(K) {
	var editor = this, name = 'flow_jqgrid';
	var tablexml=null;//jqGrid XML数据对象
	editor.plugin.flow_jqgrid = {
		edit : function() {
			var html = [
					'<center>',
					'<fieldset  style="width: 95%; text-align: left;">',
					'<legend>主表设置</legend>',
					'<table style="width:100%" border="0">',
					'<tr>',
					'<td width="106px"  nowrap>',
					'绑定字段：',
					'</td>',
					'<td>',
					'<select class="webui" id="databind" name="databind" style="width:439px;">',
					'<option></option>',
	                '</select>',
					'</td>',
					'</tr>', '</table>',
					'</fieldset>',
					'<fieldset  style="width: 95%; text-align: left;">',
					'<legend>从表设置</legend>',
					'<table style="width:100%" border="0">',
					'<tr>',
					'<td width="106px" style="border:1px solid #fff;" nowrap>',
					'数据库：',
					'</td>',
					'<td>',
					//'<input id="sTable" name="sTable" style="width:100%" readonly  />',
					'<select class="webui" id="sTable" name="sTable" style="width:439px;">',
					'<option></option>',
					'</select>',
					'</td>',
					'</tr>',
					'<tr>',
					'<td nowrap>关键字段：</td>',
					'<td><input class="webui" type="text" style="width:428px;" id="sKey" name="sKey" readonly /></td>',
					'</tr>',
					'<tr>',
					'<td nowrap>',
					'与主表关联的字段：',
					'</td>',
					'<td>',
					//'<input style="width:100%" id="sAssociated" name="sAssociated" readonly />',
					'<select class="webui" id="sAssociated" name="sAssociated" style="width:439px;">',
					'<option value=""></option>',
					'</select>',
					'</td>',
					'</tr>',
					'<tr>',
					'<td nowrap>',
					'查询的附加条件：',
					'</td>',
					'<td>',
					'<input class="webui" type="text" style="width:428px;" name="sCondition" id="sCondition">',
					'</td>',
					'</tr>',
					'<tr>',
					'<td nowrap>',
					'查询的 SQL 语句：',
					'</td>',
					'<td>',
					'<textarea class="webui" id="sSQL" name="sSQL" readonly style="width:436px;"></textarea>',
					'</td>', '</tr>', '<tr>', '<td>序 号：</td>',
					'<td>',
					'<input type="checkbox" id="SN" />',
					'</td>', '</tr>', '</table>',
					'</fieldset>', '</center>' ].join('');
			var dialog = editor.createDialog({
				name : name,
				width : 580,
				height :340,
				title : '数据表格控件',
				body : html,
				previewBtn: {
					name:'表格列设置',
					click:function(){
						if(sTable.options[sTable.selectedIndex].value==""){
							alert("请选择子表！");
							return;
						}
						var object = new Object();
						object.databind=databind.val();
						object.stable=stablename;
						object.stableid=stableid;
						object.skey=skey.val();
						object.sas=stablename+"."+sas.val();
						object.scondition=scondition.val();
						object.tablexml=tablexml;
						object.fields = fields;
						//alert(stableid);
						var str = window.showModalDialog("/workflow/pagedesigner/jsp/rows.jsp",object,"dialogWidth:690px; dialogHeight:400px; status:0 ;center: yes; help: no;scroll:0;edge:sunken");
						if(str!=null){
							tablexml=str;
						}
						
					}
	            },
				yesBtn:{
					name : editor.lang('yes'),
					click : function() {
						
						if(stableid==null || stableid==''){
							alert('请设定从表！');
							return;
						}
						//alert(tablexml.xml);
						var xmlDoc = tablexml;
				        var dataElement = xmlDoc.selectSingleNode('/jqGrid/Database');
				        for(var i=dataElement.childNodes.length-1;i>=0;i--){
					        dataElement.removeChild(dataElement.childNodes.item(i));
				        }
				        
				        dataElement.setAttribute('sn',document.getElementById('SN').checked);//序列
				        
				        var tmpElement = xmlDoc.createElement('databind');
				        tmpElement.text = databind.val();
				        dataElement.appendChild(tmpElement);
				        
				        var tmpElement = xmlDoc.createElement('sTable');
				        tmpElement.text = stablename;
				        tmpElement.setAttribute('id',stableid); //保存从表id
				        dataElement.appendChild(tmpElement);

				        var tmpElement = xmlDoc.createElement('sKey');
				        tmpElement.text = skey.val();
				        dataElement.appendChild(tmpElement);
				        
				        var tmpElement = xmlDoc.createElement('sAssociated');
				        tmpElement.text = sas.val();
				        dataElement.appendChild(tmpElement);
				        
				        var tmpElement = xmlDoc.createElement('sCondition');
				        tmpElement.text = scondition.val();
				        dataElement.appendChild(tmpElement);
				        
				        var colElement = xmlDoc.selectNodes('/jqGrid/Col');
				        
				        var str = Encrypt(xmlDoc.xml,0);
						var htm =
							'<div><span class="flow grid" stableid="'+stableid+'" databind="'+databind.val()+'" type="JqGrid" ctrlname="FlowDataGrid">';
						htm+='<table style="'+style+'" border="1" cellspacing="0" cellpadding="0" type="jqGrid" stablexml="'+str+'">';
						htm+='<tbody>';
						htm+='<tr>';
						for(i=0;i<colElement.length;i++) {
							var tmpElement = colElement[i];
							htm+='<td>'+tmpElement.selectSingleNode('FieldType').text+'</td>';
						}
						htm+='</tr>';
						htm+='<tr>';
						for(i=0;i<colElement.length;i++) {
							var tmpElement = colElement[i];
							htm+='<td>'+tmpElement.selectSingleNode('ShowName').text+'</td>';
						}
						htm+='</tr>';
						htm+='</tbody>';
						htm+='</table>';
						htm+='</span></div>';
						tablexml=null;
						editor.insertHtml(htm).hideDialog().focus();
					}
				},
				noBtn:{
	            	name:'取消',
	            	click:function(){
	            		tablexml=null;
	            		editor.hideDialog();
	            	}
	            }
			});
			
			$("#sKey").input();
			
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
			
			$.ajax({
	    		type: "POST",
	    		async:false,//同步加载
	    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getTables.do",
	    		data:{table_uuid:page.getTable_uuid()==''?'0':page.getTable_uuid()},
	    		//data:{table_uuid:'402880e43d62e98c013d630e6186005a'},
	    		success: function(data){
	    			if(data.tables!=null){
						for ( var i= 0; i < data.tables.length; i++) {
							if(data.tables[i].table_uuid!=page.getTable_uuid()){
								$("#sTable").append("<option value=\""+data.tables[i].table_uuid+","+data.tables[i].table_name_en+"\">"+data.tables[i].table_name_cn+"</option>");
							}
						}
					}else{
						$("#sTable").append("<option value=\"\">请先打开或者创建一个页面！</option>");
					}
	    		}
	    	});
			
			sTable.onchange=function(){
				var value = sTable.options[sTable.selectedIndex].value;
				//alert(value);
				if(value!=''){
					var strs= new Array();
					strs=value.split(",");
					stableid=strs[0];
					stablename=strs[1];
					createsql();
					sAssociated.length=0;
					$.ajax({
			    		type: "POST",
			    		async:false,//同步加载
			    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getfieldskeyname.do",
			    		data: "table_uuid="+stableid,
			    		success: function(msg){
			    			skey.val(msg.tableskey);
			    		}
			    	});
					
					$.ajax({
			    		type: "POST",
			    		async:false,//同步加载
			    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getfields.do",
			    		data: "table_uuid="+stableid,
			    		success: function(data){
			    			if(data.fields!=null){
			    				for ( var i= 0; i < data.fields.length; i++) {
			    					$("#sAssociated").append("<option value=\""+data.fields[i].column_name_en+"\">"+data.fields[i].column_name_cn+"</option>");
			    				}
							}
			    		}
			    	});
					
					$.ajax({
			    		type: "POST",
			    		async:false,//同步加载
			    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getfields.do",
			    		data: "table_uuid="+stableid,
			    		success: function(msg){
			    			//alert(msg.fields);
			    			fields = msg.fields;
			    		}
			    	});
					
				}else{
					//stable.val('');
					skey.val('');
					sAssociated.length=0;
					fields=null;
					createsql();
				}
			}
			
			sAssociated.onchange=function(){
				var value = sAssociated.options[sAssociated.selectedIndex].value;
				//alert(value);
				if(value !='' && value!=null){
					//sas.val(stable.val()+'.'+str);
					createsql();
		        }else{
		        	//sas.val('');
		        	createsql();
		        }
			}
			
			 
			var div = dialog.div,
				databind=K('[name="databind"]',div),
				stable=K('[name="sTable"]',div),
				skey=K('[name="sKey"]',div),
				sas=K('[name="sAssociated"]',div),
				scondition=K('[name="sCondition"]',div),
				ssql=K('[name="sSQL"]',div);
			
			var stableid=null;//从表id
			var stablename=null;
			var fields = [];// 字段数组
			ssql.val('Select * From Where = 主表关键字段值');
			
			//初始化xml对象
			if(tablexml==null){
				var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	            var rootElement = xmlDoc.createElement('jqGrid');
	            var tmpElement = xmlDoc.createElement('Database');
	            rootElement.appendChild(tmpElement);
	            xmlDoc.appendChild(rootElement);
	            tablexml = xmlDoc;
	            //alert(xmlDoc.xml);
			}
			
			var sconn = document.getElementById('sCondition');//失去焦点事件
			sconn.onblur = function(){
				createsql();
			}
			function createsql(){
				var scon = K.trim(scondition.val());
				if(scon!=''){
					ssql.val('Select * From '+stablename+' Where '+stablename+'.'+sas.val()+' = 主表关键字段值  and ('+scon+')');
				}else{
					ssql.val('Select * From '+stablename+' Where '+stablename+'.'+sas.val()+' = 主表关键字段值');
				}
			}
			
			var style="";
			//恢复值
			var str = editor.plugin.getSelectedflow_jqgrid();
			
			if(str){
				editor.cmd.range.selectNode(str[0]);
            	//editor.cmd.select();
				var table = $('table',str);
				style=table.attr('style')==''?'':table.attr('style');
				var stablexml = table.attr('stablexml');
				//得到解密后的字符串
				var strr = Encrypt(stablexml,1);
				//alert(strr);
				//将字符串转化成xml
				var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");  
		        xmlDoc.async="false";  
		        xmlDoc.loadXML(strr);
		        //将转化得到的xml对象 赋给全局xml对象
		        tablexml = xmlDoc;
		        //alert(tablexml.xml);
		        var databindxml = xmlDoc.selectSingleNode('/jqGrid/Database/databind').text;
		        var stablexml = xmlDoc.selectSingleNode('/jqGrid/Database/sTable').text;
		        var tableidxml = xmlDoc.selectSingleNode('/jqGrid/Database/sTable').getAttribute('id');
		        var skeyxml = xmlDoc.selectSingleNode('/jqGrid/Database/sKey').text;
		        var sasxml = xmlDoc.selectSingleNode('/jqGrid/Database/sAssociated').text;
		        var sconxml = xmlDoc.selectSingleNode('/jqGrid/Database/sCondition').text;
		        var sn = xmlDoc.selectSingleNode('/jqGrid/Database').getAttribute('sn');
		        if(sn==-1){
		        	document.getElementById('SN').checked=true;
		        }else{
		        	document.getElementById('SN').checked=false;
		        }
		        databind.val(databindxml);
				stable.val(tableidxml+','+stablexml);
		        //alert(stablexml);
				skey.val(skeyxml);
				
				scondition.val(sconxml);
				stableid = tableidxml;
				var strs= new Array();
				strs=stablexml.split(",");
				stablename = strs[0];
				$.ajax({
		    		type: "POST",
		    		async:false,//同步加载
		    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getfields.do",
		    		data: "table_uuid="+stableid,
		    		success: function(msg){
		    			//alert(msg.fields);
		    			fields = msg.fields;
		    		}
		    	});
				$.ajax({
		    		type: "POST",
		    		async:false,//同步加载
		    		url: basePath+"flowPageDesigner/core_flowPageDesigner_getfields.do",
		    		data: "table_uuid="+stableid,
		    		success: function(data){
		    			if(data.fields!=null){
		    				for ( var i= 0; i < data.fields.length; i++) {
		    					$("#sAssociated").append("<option value=\""+data.fields[i].column_name_en+"\">"+data.fields[i].column_name_cn+"</option>");
		    				}
						}
		    		}
		    	});
				sas.val(sasxml);
				createsql();
			}
		}
	};
	editor.clickToolbar(name,function(){
		if(judge()){
			editor.plugin.flow_jqgrid.edit();
		}
	});
});