var Form = {
		load: function (id, jsonData, isReadOnly){
			if(isReadOnly == undefined) isReadOnly = false;
			for(var key in jsonData){
                if ($("#" + key).length > 0){
                switch($("#" + key).get(0).type){
                    case 'checkbox':
                    case 'radio':
                        var tmpValue = jsonData[key].toLowerCase();
                        if ((tmpValue == this.value) || (tmpValue == "yes") || (tmpValue == "true") || (tmpValue == "1")){
                            $("#" + key).get(0).checked = true;
                        }else{
                            $("#" + key).get(0).checked = false;
                        }
                        this.disabled = (isReadOnly ? "disabled" : "");
                        break;
                    default:
                        $("#" + key).val(jsonData[key]);
                        if(isReadOnly){
                            $("#" + key).attr("readonly", "readonly");
                        }else{
                            $("#" + key).removeAttr("readonly");
                        }
                        break;
                }


                }
			}
		},
		setReadOnly: function(objForm, readOnly){
			
			$(objForm).find(':input').each(
					function(){
						switch(this.type){
							case 'passsword':
							case 'text':
							case 'textarea':
								if(readOnly){
									$(this).attr("readonly", "readonly");
								} else{
									$(this).removeAttr("readonly");
								}
							 	break;
							case 'select-multiple':
							case 'select-one':
								if(readOnly){
									$(this).attr("disabled", "disabled");
								} else{
									$(this).removeAttr("disabled");
								}
								break;
							case 'checkbox':
							case 'radio':
								this.disabled = (readOnly ? "disabled" : "");
						}
					}	
				);
		},
		clear: function(objForm){// form对象
			$(objForm).find(':input').each(
				function(){
					switch(this.type){
						case 'passsword':
						case 'select-multiple':
						case 'select-one':
						case 'text':
						case 'textarea':
							$(this).val(null);
						 	break;
						case 'checkbox':
						case 'radio':
							this.checked = false;
					}
				}	
			);
		},
		setAction: function(objForm ,url){
			objForm.attr("action", url);
		}
} 