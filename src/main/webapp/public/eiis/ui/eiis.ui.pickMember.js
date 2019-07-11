(function ($) {
    EIIS.UI.register("materialPickMember", {
        _jqElement: null,
        _jqButton: null,
        _jqTagElement: null,
        _innerVal: false,
        _params: null,
        create: function () {
            var self = this;
            self._jqElement = $(self.element);
            if (self.element.tagName.toLowerCase() !== "input") throw ("初始化标签不是input!");
            self._jqElement.pickMem({
                height : 30,
                multiple : true,
                placeholder : "选择领料人员或合同",
                urls : {
                    list : {
                        url : "/public/selectPlutIn/searchEiisPick.do",
                        extendParam : {}
                    },
                    item : {
                        url : "/public/selectPlutIn/getEiisPickById.do",
                        extendParam : {}
                    }
                },
                onInit : function(pickMember){
                    pickMember.jqElement.container.find(".pickContainer").append('<span class="tags-btn" style="right: 1px; top: 4px;">' +
                        '<button type="button" class="btn btn-default" style="border: none; padding: 2px 5px; height: 100%;"> <i class="glyphicon glyphicon-option-vertical"></i></button>' +
                        '</span>');
                    pickMember.jqElement.pickInput.attr("size",20);
                    pickMember.jqElement.container.find(".pickContainer button").on("click",function(){
                        $.selector.materialPickMember($.extend(true, {}, {projectId : pickMember.paramter.urls.list.extendParam.projectId,values : pickMember.getIds()}, {
                            ok: function (data) {
                                pickMember.clear();
                                pickMember.setValues(data);
                            }
                        }));
                    });
                }
            });
        }
    });
})(jQuery);