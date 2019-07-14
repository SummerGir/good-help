/**
 * 			使用easyui进行表单验证
 * 				作者: wukai 
 * 				时间:2011-06-13
 * 
 */
$.extend($.fn.validatebox.defaults.rules, {
  	length : {
		validator : function(_2fc, _2fd) {
			var len = $.trim(_2fc).length;
			return len >= _2fd[0] && len <= _2fd[1];
		},
		message : "长度必须在{0}到{1}个字符之间"
	},
	decimal:{
		validator : function(value, number) {
			return decimal(value,number);
		},
		message : "保留{0}位小数"
	},
	rpt_decimal:{
		validator : function(value, number) {
			return decimal(value.replace(/,/g,""),number);
		},
		message : "保留{0}位小数"
	},
	numeric:{
		validator : function(value) {
			return isNumeric(value,'+')||parseFloat(value).toFixed(2)==0.00;
		},
		message : "只能输入数字，可以输入小数"
	},
	rpt_numeric:{
		validator : function(value) {
			return isNumeric(value.replace(/,/g,""),'+')||parseFloat(value).toFixed(2)==0.00;
		},
		message : "只能输入数字，可以输入小数"
	},
	rpt_numeric_fs:{//可以为负数
		validator : function(value) {
			return isNumeric(value.replace(/,/g,""),'')||parseFloat(value).toFixed(2)==0.00;
		},
		message : "只能输入数字，可以输入小数"
	},
	integer:{
		validator : function(value) {
			return isInteger(value,'+')||parseInt(value)==0;
		},
		message : "只能输入整数"
	},
	rpt_integer:{
		validator : function(value) {
			return isInteger(value.replace(/,/g,""),'+')||parseInt(value)==0;
		},
		message : "只能输入整数"
	},
	maxlength:{
		validator : function(value,len) {
			return getBytesLength(value)<=len;
		},
		message : "最多{0}个字符"
	},
	minlength:{
		validator : function(value,len) {
			return getBytesLength(value)>=len;
		},
		message : "至少{0}个字符"
	},
	identificationCard:{
		validator : function(value) {
			return checkIdCard(value);
		},
		message : "请输入合法的身份证号"
	},
	phone:{
		validator : function(value) {
			return checkPhone(value);
		},
		message : "请输入合法的电话号码"
	},
	mobile:{
		validator : function(value) {
			return checkMobile(value);
		},
		message : "请输入合法的手机号码"
	},
	minvalue:{
		validator : function(value,num) {
			return parseFloat(value)>=num;
		},
		message : "当前值应>={0}"
	},
	maxvalue:{
		validator : function(value,num) {
			return parseFloat(value)<=num;
		},
		message : "当前值应<={0}"
	},
	rpt_minvalue:{
		validator : function(value,num) {
			return parseFloat(value.replace(/,/g,""))>=num;
		},
		message : "当前值应>={0}"
	},
	rpt_maxvalue:{
		validator : function(value,num) {
			return parseFloat(value.replace(/,/g,""))<=num;
		},
		message : "当前值应<={0}"
	},
	cn:{
		validator : function(value) {
			return isCN(value);
		},
		message : "只能输入中文"
	},
	_number:{
		validator : function(value) {
			return isNumber(value);
		},
		message : "只能输入数字"
	},
	_zipcod:{
		validator : function(value) {
			return isZipcod(value);
		},
		message : "请输入正确的邮政编码格式"
	}
});
