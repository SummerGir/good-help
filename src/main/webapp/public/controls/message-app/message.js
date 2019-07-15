(function ($, undefined) {

    var _dialogHTML = null;
    var getDialogHTML = function () {
        if (_dialogHTML == null) {
            $.ajax({
                url: "/public/controls/message-app/message.jsp",
                async: false,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    _dialogHTML = data;
                }
            });
        }
        return _dialogHTML;
    };

    $.appmessage = function (opt) {
        var option = opt;
        if ($.type(opt) === 'string') {
            option = {
                text: opt
            };
        }
        if(!option.text && option.msg){
            option.text = option.msg;
        }
        var defaultOption = $.extend(true, {}, $.appmessage.option, {verify: null});
        option = $.extend(true, {}, defaultOption, option);

        var dialog = $(getDialogHTML());
        var logoObj = $.appmessage.paramer;
        var flag = option.flag;
        if(flag){
            dialog.find("i").removeClass().addClass(option.icon || logoObj[flag].clas).css("color",option.color || logoObj[flag].colo).parent().show();
            dialog.find("h3").css("color",option.color || logoObj[flag].colo).text(option.text || logoObj[flag].tex);
        }else {
            dialog.find("i").parent().hide();
            dialog.find("h3").css("color","#111222").text(option.text);
        }
        var rc = dialog.find("div.row").children();
        if(option.func){
            rc.eq(0).show().find("button").unbind("click").on("click",function(){
                option.func(option);
                dialog.modal("hide");
            });
            rc.eq(1).hide();
        }else {
            rc.eq(0).hide();
            rc.eq(1).show().removeClass().addClass("col-xs-12").find("button").text("关闭");
        }
        if(flag == "inquiry"){
            rc.eq(0).show().removeClass().addClass("col-xs-6");
            rc.eq(1).show().removeClass().addClass("col-xs-6").find("button").text("取消");
        }else {
            rc.eq(0).removeClass().addClass("col-xs-12");
        }
        dialog.modal("show");
    };

    $.appmessage.paramer = {
        error:{clas:"esg-font icon-jujue",colo:"#ff0e0e",tex:"操作出错"},
        "false":{clas:"esg-font icon-jujue",colo:"#ff0e0e",tex:"操作出错"},
        ok:{clas:"esg-font icon-chenggong",colo:"#09ea8b",tex:"操作成功"},
        "true":{clas:"esg-font icon-chenggong",colo:"#09ea8b",tex:"操作成功"},
        warning:{clas:"esg-font icon-jinggao",colo:"#ff7615",tex:"警告"},
        nothing:{clas:"esg-font icon-weisousuodao",colo:"#ff0e0e",tex:"未搜索到相关结果"},
        info:{clas:"esg-font icon-xinxi",colo:"#9ec6ff",tex:"信息"},
        hint:{clas:"esg-font icon-tishi",colo:"#9ec6ff",tex:"提示"},
        inquiry:{clas:"esg-font icon-bangzhu",colo:"#ff0e0e",tex:"确认删除"}
    };

    /**
     *
     * @type {{flag: string, text: string, icon: string, color: string, func: null}}
     */
    $.appmessage.option = {
        flag: null, //消息框类型
        text: '', //消息框的内容文本 也可以用msg
        icon: null, //图标
        color: null, //图标颜色
        func: null //function ($.appmessage.func){}
    };

    $.appmessage.loader = {
        open: function (text, fu) {

        },
        close: function () {

        }
    };

})(jQuery);
