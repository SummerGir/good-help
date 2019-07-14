function getDicName(dic_code,item_code){
	//首先从本地windows对象中取字典内容，若存在，则直接从本地缓存中读取，若没有，则从服务器中获得
	//1服务器中以json格式返回对象，若对象的type=1，树型结构，则不在本地保存，且返回值就一个名称
	//若对象type=2，列表结构，则本地保存，返回值是一个json对象
	//2本地保存的格式为:window[dic_code]=JSONObjectList；使用for循环可以找到item_code对应的名称
	var result="";	
	if (window[dic_code])
	{
		var bdotFlag = (item_code.indexOf(",") >= 0);
		var dics=window[dic_code];
		if (!bdotFlag){
			$.each(dics.items,function(idx,item){
				if (item.item_code == item_code){
					result=item.item_name;
					return false;
				}
			});
		}
		else{
			var tmpArr = item_code.split(",");
			for(var i=0;i < tmpArr.length;i++){
				$.each(dics.items,function(idx,item){
					if (item.item_code == tmpArr[i]){
						if (result == ""){
							result=item.item_name;
						}
						else{
							result=result + "," + item.item_name;
						}
						return false;
					}
				});
			}
		}
		return result;
	}
	else
	{
		    var xmlHttp=GetXmlHttpObject();
			if (xmlHttp==null){
				alert ("您的浏览器不支持AJAX！");
				return;
			}
			var url="/public/get_dic_name.jsp?dic_code="+dic_code + "&item_code="+item_code+"&sid="+Math.random();
			xmlHttp.open("POST",url,false);
			xmlHttp.send(null);
			result=xmlHttp.responseText;
			var dics= jQuery.parseJSON(result);
			result="";
			if (dics)
			{
				if (dics.type==2)
				{//树型结构
					return dics.item_name;
				}
				else
				{
					window[dic_code]=dics;
					if (window[dic_code]){
						return getDicName(dic_code, item_code);
					}
					/*$.each(dics.items,function(idx,item){
						if (item.item_code==item_code)
						{
						    result=item.item_name;
						    return false;
					    }
					});
					return result;*/
				}
			}
			result=item_code;
	}	
	return result; 
}

function GetXmlHttpObject(){
	var xmlHttp=null;
	try{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest();
	}catch (e){
		// Internet Explorer
		try{
    		xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    	}catch (e){
    		xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
   		}
	}
	return xmlHttp;
}

function getDic(dic_code) {
	var xmlHttp = GetXmlHttpObject();
	if (xmlHttp == null) {
		alert("您的浏览器不支持AJAX！");
		return;
	}
	var url = "/public/get_dic.jsp?dic_code=" + dic_code  + "&sid=" + Math.random();
	xmlHttp.open("POST", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

