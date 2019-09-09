KindEditor.plugin('flow_createExexutepage', function () {
    var editor = this, name = 'flow_createExexutepage';
	var createArchivesPage = function(objhtml){
		{
			var objhtml = objhtml.clone(false);
			var tableName = page.getTableName();
			var data = {};

			/** 替换子表显示 Grid 标签 */
			objhtml.find(".flow.grid").each(function (j) {
				var jqThis = $(this);
				var id = jqThis.attr("databind");
				var tab = jqThis.find("table");
				var style = $(tab[0]).attr("style") == undefined ? "": $(tab[0]).attr("style");
				var stablexml = $(tab).attr("stablexml");
				//...
				var strr = Encrypt(stablexml,1);
				var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(strr);
				stablexml = Encrypt(xmlDoc.xml,0);
				jqThis.replaceWith('<flow:grid numeric="'+j+'" id="'+id+'" name="'+id+'" style= "' + style + '" stablexml="'+stablexml+'" />');
			});

			/** 替换子表显示 IncludeGrid 标签 */
			objhtml.find(".flow.includeGrid").each(function (j) {
				var jqThis = $(this);
				var id = jqThis.attr("id");
				var title = jqThis.attr("title") == undefined ? "" : jqThis.attr("title");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var style = jqThis.attr("style") == undefined ? "": jqThis.attr("style");
				var archivePageUrl = jqThis.attr("archivePageUrl") == undefined ? "" : jqThis.attr("archivePageUrl");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="includeGrid" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"includeGrid",
					DATA_VALUE:archivePageUrl
				}
			});

			/** 替换网盘选择器标签 */
			objhtml.find(".flow.netdisk").each(function (j) {
				var jqThis = $(this);
				var id = jqThis.attr("id");
				var title = jqThis.attr("title") == undefined ? "" : jqThis.attr("title");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var style = jqThis.attr("style") == undefined ? "": jqThis.attr("style");
				var issource = jqThis.attr("data-issource") == undefined ? "": jqThis.attr("data-issource");
				var dirCode = jqThis.attr("data-dir-code") == undefined ? "001": jqThis.attr("data-dir-code");
				var projectid = jqThis.attr("data-projectid") == undefined ? "": jqThis.attr("data-projectid");
				var sourcekind = jqThis.attr("data-sourceKind") == undefined ? "": jqThis.attr("data-sourceKind");
				var formcode = jqThis.attr("data-formCode") == undefined ? "": jqThis.attr("data-formCode");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="netdisk" data-cloumn="' + id + '" name="'+name+'" title="'+title+'" data-dir-code="'+dirCode+'"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"netdisk"
				}
			});

            /**替换手机版选择时间控件标签*/
            objhtml.find(".flow.phonetime").each(function () {
                var jqThis = $(this);
                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
                var title = jqThis.attr("title")== undefined ? "" : jqThis.attr("title");
                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
                var datetype = jqThis.attr("eiis-datetype") == undefined ? "" : jqThis.attr("eiis-datetype");
                jqThis.replaceWith('<span class="'+tableName+'" data-type="text" eiis-datetype="'+datetype+'" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
                data[id] = {
                    DATA_TITLE:title,
                    DATA_TYPE:"text"
                }
            });

			/**替换人员选择器标签*/
			objhtml.find(".flow.member").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="member" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"member"
				}
			});

			/**替换附件上传标签*/
			objhtml.find(".flow.file").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var multiple_file = jqThis.attr("multiple_file") == "true";
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="file" data-extend="'+multiple_file+'" data-cloumn="' + id + '" name="'+name+'" title="' + title + '" style="' + style + '"/></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"file"
				}
			});

			/**替换 hidden 标签*/
			objhtml.find(".flow.hidden").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="hidden" data-cloumn="' + id + '" name="' + name + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"hidden"
				}
			});

			/**替换下拉列表标签*/
			objhtml.find(".flow.select").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				var dataCode = jqThis.attr("data-code") == undefined ? "" : jqThis.attr("data-code");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="select" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"select",
					DATA_CODE:dataCode
				}
			});

			/**替换日历标签*/
			objhtml.find(".flow.date").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="date" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"date"
				}
			});
			/**替换 checkbox 标签*/
			objhtml.find(".flow.checkbox").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				var dataCode = jqThis.attr("data-code") == undefined ? "" : jqThis.attr("data-code");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="checkbox" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"checkbox",
					DATA_CODE:dataCode
				}
			});
			/**替换 radio 标签*/
			objhtml.find(".flow.radio").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var dataCode = jqThis.attr("data_code") == undefined ? "" : jqThis.attr("data_code");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="radio" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"radio",
					DATA_CODE:dataCode
				}
			});
			/**替换 dictionary 标签*/
			objhtml.find(".flow.dictionary").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="dictionary" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"dictionary"
				}
			});
			/**替换 link 标签*/
			objhtml.find(".flow.link").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var href = jqThis.attr("href") == undefined ? "" : jqThis.attr("href");
				var target = jqThis.attr("target") == undefined ? "" : jqThis.attr("target");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				//TODO 对应的 tag 还没有实现
				jqThis.replaceWith('<a id="' + id + '" name="' + name + '" target="'+target+'" href="'+href+'" style="' + style + '">'+name+'</a>');
				data[id] = {
					DATA_TITLE:"",
					DATA_TYPE:"link"
				}
			});

			/**替换文本、数字框标签*/
			objhtml.find(".flow.text").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="text" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"text"
				}
			});

			/**文本輸入框*/
				//alert(objhtml.html());
			objhtml.find(".flow.textarea").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="textarea" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"textarea"
				}
			});
			//alert(objhtml.html());

			/**替換office标签*/
			objhtml.find(".flow.office").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="office" data-cloumn="' + id + '" name="'+name+'" title="' + title + '" style="' + style + '"/></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"office"
				}
			});

			/**替换html控件标签*/
			objhtml.find(".flow.html").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="html" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"html"
				}
			});

			/**替换意见签署控件标签*/
			objhtml.find(".flow.sign").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var title = jqThis.attr("title");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="sign" data-cloumn="' + id + '" name="' + name + '" title="' + title + '" style="' + style + '"></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"sign"
				}
			});
			/**替换红头制作控件标签*/
			objhtml.find(".flow.archive").each(function () {
				var jqThis = $(this);
				var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
				var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
				var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
				var title = jqThis.attr("title");
				jqThis.replaceWith('<span class="'+tableName+'" data-type="sign" data-cloumn="' + id + '" name="'+name+'" title="' + title + '" style="' + style + '"/></span>');
				data[id] = {
					DATA_TITLE:title,
					DATA_TYPE:"archive"
				}
			});
			/**替换文档编号控件标签*/
			objhtml.find(".flow.docnumber").each(function () {
				var jqThis = $(this);
				var wordType = jqThis.attr("wordType") == undefined ? "" : jqThis.attr("wordType");
				var fieldWord = jqThis.attr("databind1") == undefined ? "" : jqThis.attr("databind1");
				var fieldYear = jqThis.attr("databind2") == undefined ? "" : jqThis.attr("databind2");
				var fieldNumber = jqThis.attr("databind3") == undefined ? "" : jqThis.attr("databind3");
				var title = jqThis.attr("title");
				var dataCloumn = tableName+".docnumber";
				jqThis.replaceWith('<span class="'+tableName+'" data-type="docnumber" name="' + dataCloumn + '" data-cloumn="' + dataCloumn + '"></span>');
				data[tableName+"."+fieldWord] = {
					DATA_TITLE:title,
					DATA_TYPE:"docnumber_word"
				}
				data[tableName+"."+fieldYear] = {
					DATA_TITLE:title,
					DATA_TYPE:"docnumber_year"
				}
				data[tableName+"."+fieldNumber] = {
					DATA_TITLE:title,
					DATA_TYPE:"docnumber_number"
				}
			});

			var page_content = objhtml.html();
			page_content = editor.edit.beforeGetHtml(page_content);
			$.ajax({
				type: "POST",
				async: true,
				url: "/workflow/pagedesigner/action/deploy_archives_page.jsp",
				data: {
					"page_code": page.getCode(),
					"upload_path": editor.uploadPath,
					"page_content": page_content,//jsp_code_sb.toString(),
					"page_data": JSON.stringify(data)
				},
				dataType: "json",
				error: $.message.ajaxError
			});

			return false;
		}
	}
    editor.plugin.flow_createExexutepage={
    		edit:function(flow_type){
    			if (page.isNew()) {
    	            alert("该页面从未保存过，不能进行编译部署。");
    	            return false;
    	        }

    	        if (page.getContent() != page.getSaveContent(editor.html())) {
    	            if (confirm("当前页面经过修改，你需要保存后再编译部署吗？")) {
    	                editor.loadPlugin('flow_savepage', function () {
    	                    editor.plugin['flow_savepage']['edit']();
    	                });
    	                return false;
    	            }
    	        }


    	        /* if (page.getPath() == "") {
    	         alert('请先创建或打开一个页面！');
    	         } else*/
    	        {
    	            /**得到页面类容*/
//    		        var editorhtml ="<div>"+editor.html()+"</div>";
//    		        var objhtml = $(editorhtml);

    	            var obje = document.createElement("div");
    	            obje.innerHTML = editor.html();
    	            var objhtml = $(obje);
					/**创建用于归档查询的页面*/
					createArchivesPage(objhtml);
    	            var jsp_code_sb = new StringBuilder();
    	            objhtml.find("pre.flow_java_code").each(function () {
    	                //var jspCode = $(this).text();
    	                var jspCode = $(this).html();
    	                jspCode = jspCode.replaceAll("&lt;", "<");
    	                jspCode = jspCode.replaceAll("&gt;", ">");
                        jspCode = jspCode.replaceAll("&amp;", "&");
    	                jsp_code_sb.appendLine(jspCode);
    	                $(this).remove();
    	            });
    	            var getDefaultValue = function (jqDOM) {
    	                var value = jqDOM.attr("default_value");
    	                if (String.isNullOrWhiteSpace(value)) {
    	                    return String.Empty;
    	                }
    	                var funName = "getDefaultValue$" + jqDOM.attr("name").replaceAll(".", "$") + "$" + Math.floor(Math.random() * 99999 + 10000);
    	                var dvFun = new StringBuilder();
    	                dvFun.appendLine("<%!");
    	                dvFun.append("private String ")
    	                dvFun.append(funName)
    	                dvFun.appendLine("(PageContext pageContext){");
    	                dvFun.append("    return String.valueOf(");
    	                dvFun.append(value);
    	                dvFun.appendLine(");");
    	                dvFun.appendLine("}");
    	                dvFun.appendLine("%>");
    	                jsp_code_sb.appendLine(dvFun.toString());
    	                return funName;
    	            }

    	            
    	            /** 替换子表显示 Grid 标签 */
    	            objhtml.find(".flow.grid").each(function (j) {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("databind");
    	                var tab = jqThis.find("table");
    	                var style = $(tab[0]).attr("style") == undefined ? "": $(tab[0]).attr("style");
    	                var stablexml = $(tab).attr("stablexml");
    	                //...
    	                var strr = Encrypt(stablexml,1);
    	                var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");  
    			        xmlDoc.async="false";  
    			        xmlDoc.loadXML(strr);
    			        var stable = xmlDoc.selectSingleNode('/jqGrid/Database/sTable').text;
    			        var rootElement = xmlDoc.selectNodes('/jqGrid/Col');
    			        for(var i=0;i<rootElement.length; i++) {
    						var tmpElement = rootElement.item(i);
    						var name = tmpElement.selectSingleNode('FieldType').text;
    						var tmpDataEdit = tmpElement.selectSingleNode('DataEdit');
    						var defaultEdit = tmpDataEdit.selectSingleNode('DefaultValue');
    						if(defaultEdit!=null){
    							var value = defaultEdit.text;
    							//alert(value);
    							var sss = $('<input name="'+stable+'.'+name+'" default_value=\''+value+'\'/>');
    							var defaul = getDefaultValue(sss);
    							defaultEdit.text = defaul;
    						}
    			        }
    			        stablexml = Encrypt(xmlDoc.xml,0);
    			        jqThis.replaceWith('<flow:grid numeric="'+j+'" id="'+id+'" name="'+id+'" style= "' + style + '" stablexml="'+stablexml+'" />');
    	            });

					/** 替换子表显示 IncludeGrid 标签 */
					objhtml.find(".flow.includeGrid").each(function (j) {
						var jqThis = $(this);
						var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
						var title = jqThis.attr("title") == undefined ? "" : jqThis.attr("title");
						var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
						var style = jqThis.attr("style") == undefined ? "": jqThis.attr("style");
						var viewPageUrl = jqThis.attr("viewPageUrl") == undefined ? "" : jqThis.attr("viewPageUrl");
						var editPageUrl = jqThis.attr("editPageUrl") == undefined ? "" : jqThis.attr("editPageUrl");
						jqThis.replaceWith('<flow:include_grid id="'+id+'" name="'+name+'" title="'+title+'" view_page_url="'+viewPageUrl+'" edit_page_url="'+editPageUrl+'"/>');
					});

					/** 替换子表显示 IncludeGrid 标签 */
					objhtml.find(".flow.netdisk").each(function (j) {
						var jqThis = $(this);
						var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
						var title = jqThis.attr("title") == undefined ? "" : jqThis.attr("title");
						var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
						var style = jqThis.attr("style") == undefined ? "": jqThis.attr("style");
						var issource = jqThis.attr("data-issource") == undefined ? "": jqThis.attr("data-issource");
						var dirCode = jqThis.attr("data-dir-code") == undefined ? "": jqThis.attr("data-dir-code");
						var projectid = jqThis.attr("data-projectid") == undefined ? "": jqThis.attr("data-projectid");
						var sourcekind = jqThis.attr("data-sourceKind") == undefined ? "": jqThis.attr("data-sourceKind");
						var formcode = jqThis.attr("data-formCode") == undefined ? "": jqThis.attr("data-formCode");
						jqThis.replaceWith('<flow:netdisk id="'+id+'" name="'+name+'" title="'+title+'" is_source="'+issource+'" dir_code="'+dirCode+'" project_id="'+projectid+'" source_kind="'+sourcekind+'" form_code="'+formcode+'"/>');
					});

                    /**替换手机版选择时间控件*/
                    objhtml.find(".flow.phonetime").each(function () {
                        var jqThis = $(this);
                        var default_value = getDefaultValue(jqThis);
                        var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
                        var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
                        var title = jqThis.attr("title")== undefined ? "" : jqThis.attr("title");
                        var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
                        var datetype = jqThis.attr("eiis-datetype") == undefined ? "" : jqThis.attr("eiis-datetype");
                        jqThis.replaceWith('<flow:phonetime id="' + id + '" name="' + name + '" title="' + title + '" eiis_datetype="'+datetype+'" default_value="' + default_value + '" style="' + style + '"/>');
                    });

                    /**替换人员选择器标签*/
    	            objhtml.find(".flow.member").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var root = jqThis.attr("data-id");
    	                var post = jqThis.attr("data-post");
    	                var person = jqThis.attr("data-person");
    	                var multiple = jqThis.attr("data-multiple");
    	                var dept = jqThis.attr("data-dept");
    	                var selectRoot = jqThis.attr("data-select-root");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                var default_value = getDefaultValue(jqThis);
    	                jqThis.replaceWith('<flow:member id="' + id + '" name="' + name + '" title="' + title + '" person="' + person + '" dept="' + dept + '" post="' + post + '" mulit="' + multiple + '" root="' + root + '" select_root="' + selectRoot + '" style="' + style + '" default_value="' + default_value + '" />');
    	            });

    	            /**替换附件上传标签*/
    	            objhtml.find(".flow.file").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var multiple_file = jqThis.attr("multiple_file") == "true";
    	                var data_editable = jqThis.attr("data_editable") == "true";
    	                var data_extend = jqThis.attr("data_extend") == "true";
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                var default_value = getDefaultValue(jqThis);
    	                jqThis.replaceWith('<flow:file id="' + id + '" name="' + name + '" title="' + title + '" ismultiple="' + multiple_file + '" editable = "'+data_editable+'" style="' + style + '" default_value="' + default_value + '" dataextend="'+data_extend+'" />');
    	            });

    	            /**替换 hidden 标签*/
    	            objhtml.find(".flow.hidden").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                jqThis.replaceWith('<flow:text type="hidden" id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" />');
    	            });

    	            /**替换下拉列表标签*/
    	            objhtml.find(".flow.select").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var input = jqThis.attr("data-input");
    	                var code = jqThis.attr("data-code");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                var optionjson = "";
    	                jqThis.children("option").each(function () {
    	                    optionjson += "{'text':'" + $(this).text() + "','value':'" + $(this).val() + "'},";
    	                });
    	                optionjson = "[" + optionjson.substring(0, (optionjson.length - 1)) + "]";
    	                jqThis.replaceWith('<flow:combobox options="' + optionjson + '" id="' + id + '" name="' + name + '" title="' + title + '" input="' + input + '" code="' + code + '" style="' + style + '" default_value="' + default_value + '"/>');
    	            });

    	            /**替换日历标签*/
    	            objhtml.find(".flow.date").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var istime = jqThis.attr("istime");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                jqThis.replaceWith('<flow:date id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" date="true" time="' + istime + '"  style="' + style + '"/>');
    	                //alert('<flow:date id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" date="true" time="' + istime + '"  style="' + style + '"/>');
    	            });
    	            /**替换 checkbox 标签*/
    	            objhtml.find(".flow.checkbox").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var data_code = jqThis.attr("data_code");
    	                var data_source = jqThis.attr("data_source");
    	                var dcode = jqThis.attr("dcode");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                jqThis.replaceWith('<flow:checkbox id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" source=\''+data_source+'\' dcode="' + data_code + '"  style="' + style + '"/>');
    	            });
    	            /**替换 radio 标签*/
    	            objhtml.find(".flow.radio").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var data_code = jqThis.attr("data_code");
    	                var data_source = jqThis.attr("data_source");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                jqThis.replaceWith('<flow:radio id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" source=\''+data_source+'\'  dcode="' + data_code + '"  style="' + style + '"/>');
    	            });
    	            /**替换 dictionary 标签*/
    	            objhtml.find(".flow.dictionary").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var data_childonly = jqThis.attr("data-childonly");
    	                var data_typeonly = jqThis.attr("data-typeonly");
    	                var data_valuemode = jqThis.attr("data-valuemode");
    	                var ismultiple = jqThis.attr("data-multiple");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                var data_source = jqThis.attr("data-code");
    	                var dcode = jqThis.attr("dcode");
    	                jqThis.replaceWith('<flow:dictionary id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" ismultiple="'+ismultiple+'" valuemode="'+data_valuemode+'" typeonly="'+data_typeonly+'" childonly="'+data_childonly+'"  source="' + data_source + '"  style="' + style + '"/>');
    	            });
    	            /**替换 link 标签*/
    	            objhtml.find(".flow.link").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var default_value = getDefaultValue(jqThis);
    	                var href = jqThis.attr("href") == undefined ? "" : jqThis.attr("href");
    	            	var target = jqThis.attr("target") == undefined ? "" : jqThis.attr("target");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                //TODO 对应的 tag 还没有实现
    	                jqThis.replaceWith('<flow:link id="' + id + '" name="' + name + '" default_value="' + default_value + '" target="'+target+'" href="'+href+'" style="' + style + '"/>');
    	                //$(d).replaceWith('<flow:dictionary id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" data-source="' + data_source + '" dcode="' + dcode + '"  style="' + style + '"/>');
    	                //alert(" link 的 tag 还没有实现");
    	            });

    	            /**替换文本、数字框标签*/
    	            objhtml.find(".flow.text").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var type = jqThis.attr("text_type");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                if (jqThis.attr("value_type") == "integer") {
    	                    /*var min = $(t).attr("data-min") == undefined ? "-2147483647" : $(t).attr("data-min");
    	                     var max = $(t).attr("data-max") == undefined ? "2147483647" : $(t).attr("data-max");*/
    	                    jqThis.replaceWith('<flow:number id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '" float="false" type="' + type + '"/>');
    	                } else if (jqThis.attr("value_type") == "float") {
    	                    jqThis.replaceWith('<flow:number id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '" float="true" type="' + type + '"/>');
    	                } else {
    	                    jqThis.replaceWith('<flow:text id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '"  type="' + type + '"/>');
    	                }
    	            });

    	            /**文本輸入框*/
    	            //alert(objhtml.html());
    	            objhtml.find(".flow.textarea").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                //var p = jqThis.parent();
    	                //alert(p.html());
    	                //alert('<flow:bigtext id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '"/>');
    	                jqThis.replaceWith('<flow:bigtext id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '"/>');
    	                //alert(p.html());
    	            });
    	            //alert(objhtml.html());

    	            /**替換office标签*/
    	            objhtml.find(".flow.office").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var title = jqThis.attr("title");
    	                var default_value = getDefaultValue(jqThis);
    	                var officedd = jqThis.attr("office");
    	                var revisions = jqThis.attr("revisions");
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                jqThis.replaceWith('<flow:office id="' + id + '" name="' + name + '" title="' + title + '" default_value="' + default_value + '" style="' + style + '" extname="' + officedd + '" revisions="'+revisions+'"/>');
    	            });

    	            /**替换html控件标签*/
    	            objhtml.find(".flow.html").each(function () {
    	                var jqThis = $(this);
    	                var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
    	                var default_value = jqThis.attr("default_value");
    	                var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
    	                var default_value = getDefaultValue(jqThis);
    	                var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
    	                jqThis.replaceWith('<flow:html id="' + id + '" name="' + name + '" default_value="' + default_value + '" style="' + style + '" upload_name="' + id + 'uploadpath" />');
    	            });

                    /**替换意见签署控件标签*/
                    objhtml.find(".flow.sign").each(function () {
                        var jqThis = $(this);
                        var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
                        var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
                        var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
                        jqThis.replaceWith('<flow:sign id="' + id + '" name="' + name + '" style="' + style + '" />');
                    });
                    /**替换红头制作控件标签*/
                    objhtml.find(".flow.archive").each(function () {
                        var jqThis = $(this);
                        var id = jqThis.attr("id") == undefined ? "" : jqThis.attr("id");
                        var name = jqThis.attr("name") == undefined ? "" : jqThis.attr("name");
                        var style = jqThis.attr("style") == undefined ? "" : jqThis.attr("style");
                        var attachment = jqThis.attr("attachment") == undefined ? "" : jqThis.attr("attachment");
                        var seal = jqThis.attr("seal") == undefined ? "" : jqThis.attr("seal");
                        jqThis.replaceWith('<flow:archive id="' + id + '" name="' + name + '" style="' + style + '" attachment="'+attachment+'" seal="'+seal+'" />');
                    });
                    /**替换文档编号控件标签*/
                    objhtml.find(".flow.docnumber").each(function () {
                        var jqThis = $(this);
                        var wordType = jqThis.attr("wordType") == undefined ? "" : jqThis.attr("wordType");
                        var fieldWord = jqThis.attr("databind1") == undefined ? "" : jqThis.attr("databind1");
                        var fieldYear = jqThis.attr("databind2") == undefined ? "" : jqThis.attr("databind2");
                        var fieldNumber = jqThis.attr("databind3") == undefined ? "" : jqThis.attr("databind3");
                        var tableName = page.getTableName();
                        jqThis.replaceWith('<flow:ng word_type="'+wordType+'" table_name="'+tableName+'" field_word="'+fieldWord+'" field_year="'+fieldYear+'" field_number="'+fieldNumber+'" word="" year="" number="" ></flow:ng>');
                    });

    	            var page_content = objhtml.html();
    	            page_content = editor.edit.beforeGetHtml(page_content);
    	            jsp_code_sb.append(page_content);

    	            $.ajax({
    	                type: "POST",
    	                async: true,
    	                url: "/workflow/pagedesigner/action/deploy_runtime_page.jsp",
    	                data: {
    	                    "page_code": page.getCode(),
    	                    "page_name": page.getName(),
    	                    "upload_path": editor.uploadPath,
    	                    "page_content": jsp_code_sb.toString(),
    	                    "flow_type":flow_type
    	                },
    	                dataType: "json",
    	                error: $.message.ajaxError,
    	                success: function (data, textStatus, jqXHR) {
    	                	if(flow_type=='flow_print')
    	                		alert("打印文件已生成！");
    	                	else
    	                		alert("编译并部署成功！");
    	                }
    	            });

    	            return false;
    	        }
    		}
    }
    editor.clickToolbar(name, function () {
    	editor.plugin.flow_createExexutepage.edit("");
    });
});