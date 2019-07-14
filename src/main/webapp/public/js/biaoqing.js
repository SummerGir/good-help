// 文本中的emoji表情处理
$(document).ready(function(){
    //$("textarea,input").on("keyup",function(){
    //    //$.message("aaa！");
    //    var data=removeExpression($(this).val());
    //    if(data.have==true){
    //        alert("请勿输入无法识别的表情符号！");
    //        $(this).val(data.str);
    //    }
    //});
    $("textarea,input").on("blur",function(){
        var data=removeExpression($(this).val());
        if(data.have==true){
            $.message("检测到无法识别的表情符号，已自动去除！");
            $(this).val(data.str);
        }
    });

});
//去除表情
function removeExpression(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    var have=false;
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            have=true;
            return "";
        } else {
            return char;
        }
    });
    //if(have==true)
    //    $.message("请勿输入无法识别的表情符号！");
    return {"have":have,"str":str};
}

//将表情转换成字符串
function transformationExpression (str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0); // 取出高位
            L = char.charCodeAt(1); // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}
