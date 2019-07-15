//验证值是否为数字
function inputNumKeyUp(e) {
    var v = $(e).val();
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