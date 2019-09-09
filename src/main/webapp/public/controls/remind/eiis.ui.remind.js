(function ($, undefined) {
	/*
	 * 提醒 选择器input标签
	 */
    EIIS.Common.loadComponent(EIIS.Common.UI, function () {
        EIIS.Common.loadComponent({
            js: ["/public/controls/remind/selector.remind.js"]
        }, function () {
            EIIS.UI.addControl({
                selector: ":text.eiis-remind",
                _jqElement: null,
                _jqButton: null,
                _jqTagElement: null,
                _innerVal: false,
                _params: null,
                create: function () {
                    var self = this;
                    self._jqElement = $(self.element);
                    if (self.element.tagName.toLowerCase() != "input") throw ("初始化标签不是input!");
                    var params = {
                        disabled: self._jqElement.prop('disabled'),//是否只读
                        readonly: self._jqElement.prop('readonly'),//是否只读
                        remindKind: self._jqElement.attr("data-remindKind") ? self._jqElement.attr('data-remindKind') : '',//可选类型
                    };
                    self._params = params;
                    self._jqElement.hide();
                    self._jqTagElement = $("<div/>").insertAfter(self._jqElement);

                    var random = new Date().valueOf();
                    var selectorId = 'eiis-selectorRemindModal' + random;
                    var selectorOkBtn = 'eiis-selectorRemindOKBtn' + random;

                    var str = "<div id='" + selectorId + "_div_div' style='margin: 10px 0px;'>";
                    str += "<div style='padding-bottom: 5px;font-size:14px; '>";
                    str += "<input type='hidden' class='remindKind'/>";
                    str += "<b>提醒：</b>";
                    str += "<span name='shifou_remind' style='color:#999;'>不提醒</span>";
                    str += "<button id='" + selectorId + "_button' type='button' style='border:1px solid #2dcc70;color:#fff; background-color: #2dcc70;border-radius: 4px;margin-left: 10px;padding: 2px 5px;font-size: 14px;'><i class='esg-font icon-xinzeng' style='margin-right: 3px;'></i>添加</button>";
                    str += "</div>";
                    str += "<div id='" + selectorId + "_value_div' style='min-height: 32px;border-radius: 4px;border:1px solid #ccc;background-color: #fff;font-size: 14px;padding: 0px 3px;display:none;'>";
                    str += "<label id='" + selectorId + "_value_label' style='position:relative;box-sizing: content-box;margin-bottom: 0px;margin-top:4px;font-weight: 400;'>";
                    str += "</label>";
                    str += "</div>";
                    str += "</div>";
                    self._jqElement.after(str);

                    if (params.readonly || params.disabled) {
                        $("#" + selectorId + "_button").hide();
                    }
                    if (params.remindKind) {
                        $("#" + selectorId + "_div_div").find("input[class='remindKind']").val(params.remindKind);
                    }

                    //点击 “添加” 按钮达到点击右边按钮功能
                    $("#" + selectorId + "_button").on("click", function () {
                        var v = $("body input[class='eiis-remind eiis-loaded']").val();
                        set_remind_value(v);
                        remind_changeType(c_type);
                        $("#" + selectorId).modal();

                    });
                    //$("#"+selectorId+"_value_div").on("click",function(){
                    //    $("#"+selectorId).modal();
                    //});
                    $.ajax({
                        url: "/public/controls/remind/selector.remind.jsp",
                        data: {random: random, extendParam: '{}'}, //这里只能加载列表界面，不能加载异步查询的数据
                        async: false,
                        cache: false,
                        dataType: "html",
                        success: function (data, textStatus, jqXHR) {
                            $("body").append(data);

                            //测试代码
                            //$("#"+selectorId).modal();
                            //结束
                        }
                    });


                }
            });
        });
    });
})(jQuery);
