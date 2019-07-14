//得到一个提示信息对象
function getMsgObj() {
	var imgstr = "";
	var msgstr = "";
	var msgClass = "";
	if (arguments[0] && arguments[0] != "") {
		switch (arguments[0]) {
		case "loading":
			imgstr = "admini/common/images/config/loading.gif";
			msgstr = arguments[1] && arguments[1] != "" ? arguments[1] : "数据加载中，请稍等...";
			msgClass = "message_normal";
			break;
		case "saveing":
			imgstr = "admini/common/images/config/loading.gif";
			msgstr = arguments[1] && arguments[1] != "" ? arguments[1] : "数据保存中，请稍等...";
			msgClass = "message_normal";
			break;
		case "success":
			imgstr = "admini/common/images/config/yes.gif";
			msgstr = arguments[1] && arguments[1] != "" ? arguments[1] : "操作成功！";
			msgClass = "message_normal";
			break;
		case "error":
			imgstr = "admini/common/images/config/error.gif";
			msgstr = arguments[1] && arguments[1] != "" ? arguments[1] : "操作失败！";
			msgClass = "message_error";
			break;
		}
	}
	var obj = $("#msgDiv");
	if (obj.length == 0) {
		var msgStr = '<div id="msgDiv" class="message_normal" style="z-index:11000;width:250px;display:none;" align="center">';
		msgStr += '<div align="center">';
		msgStr += '<img src="admini/common/images/config/loading.gif"><span>数据加载中，请稍等...</span>';
		msgStr += '</div></div>';
		$("body").append(msgStr);
		obj = $("#msgDiv");
	}
	if (imgstr != "") {
		obj.css(msgClass);
		obj.children(0).children(0).attr("src", imgstr)
		obj.children(0).children("span").html(msgstr);
	}
	obj.width(250);
	obj.css('left', ($(window).width() - obj.width()) / 2);
	obj.css('top', $(window).scrollTop() + ($(window).height() - obj.height()) / 2);
	return obj;
}
//得到一个灰色背景
function getDisabledBg() {
	var h = document.body.scrollHeight > $(window).height() ? document.body.scrollHeight
			: $(window).height();
	var obj = $("#disabledBgDiv");
	if (obj.length == 0) {
		$("body")
				.append(
						'<div id="disabledBgDiv" style="display:none;position:absolute;background-color:#777;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60);opacity:0.6;top:0px;left:0px;width:100%;height:' + h + ';z-index:10000;"></div>');
		obj = $("#disabledBgDiv");
	}
	obj.css('top', 0);
	obj.css('left', 0);
	obj.css('height', h);
	return obj;
}