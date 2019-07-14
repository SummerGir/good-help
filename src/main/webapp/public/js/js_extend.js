/**
 * js全局方法
 */
//js获取UUID
window.uuid = function () {
	return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	})
};
//正则判断UUID
String.prototype.isUUID = function () {
	return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(this);
};
//数组去重
Array.prototype.delRepeatArray = function(){
	var res = [];
	var json = {};
	for(var i = 0; i < this.length; i++){
		if(!json[this[i]]){
			res.push(this[i]);
			json[this[i]] = 1;
		}
	}
	return res;
};
//数组删除指定元素
Array.prototype.removeByValue = function(val) {
	for(var i=0; i<this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
	return this;
};
//日期格式化
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
//js toFixed BUG(四舍五入后整数部分多一位)
// Number.prototype.toFixed = function(s) {
//     var res = (parseInt(this * Math.pow(10, s) + 0.5)/Math.pow(10,s)).toString();
//     if(res.indexOf(".")==-1){
//         for(var v=0;v<s;v++) {
//             if(v==0)res +=".";
//             res += "0";
//         }
//     }
//     return res;
// }
jQuery.fn.isChildAndSelfOf = function(b){ return (this.closest(b).length > 0); };

//验证值是否为数字
function inputNumKeyUp(e){
    var v=$(e).val();
    if (v != null) {
        $(e).val(clearNoNum(v));
    }
}
function clearNoNum(v) {
    //先把非数字的都替换掉，除了数字、小数点和负号
    v = v.replace(/[^\d.-]/g, "");
    //必须保证第一个不是小数点，且小数点只出现一次
    v = v.replace(/^\./g, "").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //保证负号只出现一次，且在最前面
    for (var i = 0; i < v.split("-").length; i++) {
        var v_n = v.lastIndexOf("-");
        if (v_n > 0)
            v = v.substring(0, v_n);
    }
    return v;
}

function two_num(e) {
	if($.trim($(e).val()).length>0&&!isNaN($.trim($(e).val())))
		$(e).val(Number($(e).val()).toFixed(2));
}