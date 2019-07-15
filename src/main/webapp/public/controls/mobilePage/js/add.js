
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
    for(var i=0;i< v.split("-").length;i++){
        var v_n=v.lastIndexOf("-");
        if(v_n>0)
            v= v.substring(0,v_n);
    }
    return v;
}
//下拉框改变颜色
function changeFontColor(e) {
    if ($(e).find("option:selected").val() == "") {
        $(e).css("color", "#ccc");
    } else {
        $(e).css("color", "#555");
    }
}

//发送流程
function trggerFlowButton() {
    $.ajax({
        async: true,
        dataType: 'html',
        type: 'post',
        url: '/public/workflow/sqkj/flow_suggestions/app_suggestion.jsp',
        data: {
            mainId: initializeParams.mainId,    //主表ID
            bodyHeight: ($("#detail_main_form").height() - 57),             //流程信息框高
            "flowKey": initializeParams.flowKey,                                   //流程KEY
            "bussTableName": initializeParams.bussTableName,                         //主表名
            "idFieldName": initializeParams.idFieldName,                                     //主表PK字段名
            "backFunctionName": "back_(true);",                             //提交流程后返回主表页面并刷新主表列表的方法
            "submitIsValidFunName": "submit_save(true,'save','detail_main_form','detl');",
            "mainSave": "save_detail();",      //发送流程时保存从表信息
            "isValid": false,
            "projectId": initializeParams.projectId
        },
        success: function (res, state) {
            $("#flow_suggestions_div").html(res);
            $("#flow_suggestions_div button:eq(0)").trigger("click");
        }
    });
}

//返回
function back_(type) {
    if (type) {
        window.location.href = initializeParams.url;
    } else {
        $.message({
            button: $.message.button.yesNo
            , text: "需要保存当前内容吗？"
            , result: function (result) {
                if (result == $.message.result.yes) {
                    submit_main('detail_main_form');
                } else {
                    window.location.href = initializeParams.url;
                }
            }
        })
    }
}

//改变input 边框颜色
function changeBorder(id) {
    $(id).css("border", "none");
}
function trim(str) { //删除左右两端的空格
    if (str != undefined) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
}

// 获取当前系统时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}