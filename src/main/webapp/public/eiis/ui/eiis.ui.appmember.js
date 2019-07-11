(function ($, undefined) {
    EIIS.UI.register("appmember", {
        _jqElement: null,
        _jqTagElement: null,
        _params: null,
        create: function () {
            var self = this;
            self._jqElement = $(self.element);
            if (self.element.tagName.toLowerCase() != "input") throw ("初始化标签不是input!");
            var params = {
                readonly: self._jqElement.prop('disabled'),
                multiple: self._jqElement.attr('data-multiple') ? Boolean.parse(self._jqElement.attr('data-multiple')) : true,
                dept: self._jqElement.attr("data-dept") ? Boolean.parse(self._jqElement.attr('data-dept')) : true,
                post: self._jqElement.attr("data-post") ? Boolean.parse(self._jqElement.attr('data-post')) : true,
                person: self._jqElement.attr("data-person") ? Boolean.parse(self._jqElement.attr('data-person')) : true,
                freeze: self._jqElement.attr("data-freeze") ? Boolean.parse(self._jqElement.attr("data-freeze")) : false,
                selectRoot: self._jqElement.attr("data-select-root") ? Boolean.parse(self._jqElement.attr('data-select-root')) : true,
                attrCode: self._jqElement.attr("data-attr-code") ? self._jqElement.attr('data-attr-code') : '',
                attrValue: self._jqElement.attr("data-attr-value") ? self._jqElement.attr('data-attr-value') : '',
                roots: self._jqElement.attr("data-id") ? self._jqElement.attr('data-id') : '',
                exclude:self._jqElement.attr("data-exclude") ? self._jqElement.attr('data-exclude') : '',
                hideHint:self._jqElement.attr("data-hideHint") ? self._jqElement.attr('data-hideHint') : false,  //是否隐藏提示消息
                placeholder:self._jqElement.attr("placeholder") || "选择成员"  //加号下面显示文本：如“分享给”
            };

            self._params = params;
            self._jqElement.hide();
            var excludes = params.exclude.split(";");

            self._jqTagElement = $("<div/>").insertAfter(self._jqElement);

            var tempHtml = '<div class="row" style="padding-bottom: 5px;">'
                +'<div class="col-md-12">'
                +'<div class="header_div header_add">'
                +'<span class="header_pic" style=""><i class="fa fa-plus"></i></span>'
                +'<span class="p_name">选择成员</span>'
                +'</div>'
                +'<div class="member_s">'
                +'<div class="mdiv">'
                +'</div>'
                +'</div>'
                +'</div>'
                +'</div>';
            self._headerObj = $('<div class="header_div">'
                +'<span class="header_pic">'
                +'</span>'
                +'<span class="p_name">'
                +'</span>'
                +'<span class="header_del">'
                +'<i class="fa fa-times-circle"></i>'
                +'</span>'
                +'</div>');

            self._jqTagElement.append(tempHtml);
            self._jqTagElement.find("span.p_name").text(self._params.placeholder);
            self._jqTagElement.find("div.header_add").on("click",function(){
                self._openSelector();
            });
            var defaultValues = self._jqElement.val();
            if (defaultValues) {
                params.term = null;
                params.ids = self._jqElement.val();
                $.ajax({
                    url: '/public/controls/selector/member/selector.member.query.jsp',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: params,
                    success: function (data) {
                        if (data) {
                            self._putMember(data);
                        }
                    }
                });
            }

            if (params.readonly) {
                self._jqTagElement.find("div.header_add").hide(); //不显示加号
                self._jqTagElement.find("div.member_s").css("margin-left","2px");
            }

            if(!params.hideHint){ //不隐藏则显示出来
                self._jqElement.find("span.p_name").hide(); //头像下面不显示名字
            }
        },
        setDisabled: function (value) {
            this._jqTagElement.find("div.header_add").hide();
        },
        destroy: function () {
            this._jqTagElement.remove();
            this._jqElement.show();
        },
        _openSelector: function(){
            var self = this;
            var pyts = [];
            if(self._params.dept) pyts.push(1);
            if(self._params.post) pyts.push(2);
            if(self._params.person) pyts.push(4);
            var fz = self._params.freeze ? 1 : 0;
            var mt = self._params.multiple ? 9999 : 1;
            var vals = self._jqElement.val().split(";");
            window.getPerson("",{isFrozen:fz},
                //拼音栏配置
                {
                    pinyinType: pyts, //拼音栏展示类型:1部门 2岗位 4人员 对应数据中的type
                    defaultdata :vals
                },
                //树形栏配置
                {
                    isCheckDep: self._params.dept,	//部门是否可选 type=1
                    isCheckPost: self._params.post,	//岗位是否可选 type=2
                    isCheckperson: self._params.person, //人员是否可选 type=4
                    defaultdata :vals
                },
                mt,
                null,
                //回调方法
                function(data){
                    self._putMember(data);
                }
            );
        },
        _putMember: function(datas){
            var self = this;
            self.clearMember(); //先清空
            var mdiv= self._jqTagElement.find("div.mdiv");
            mdiv.empty();
            var vals = [];
            if(datas.length > 0){
                $.each(datas,function(i,v){
                    var data = v;
                    vals.push(data.id);
                    //添加头像
                    var mem = self._headerObj.clone();
                    var img="<img class='img-circle' src='/app/userinfo/member_outphoto.jsp?personId="+data.id+"' />";
                    mem.find("span.header_pic").append(img);
                    mem.find("span.p_name").text(data.text || data.title);
                    mem.attr("mem_id",data.id);
                    mdiv.append(mem);
                    if (self._params.readonly){
                        mem.find("span.header_del").hide();
                    }else {
                        mem.find("span.header_del").click(function(){
                            self.removeMember(data.id);
                        });
                    }
                });
            }
            mdiv.width(mdiv.children().length * 56);
            mdiv.parent()[0].scrollLeft=mdiv.parent()[0].scrollWidth;
            var valStr = vals.join(";");
            self._jqElement.val(valStr);
            self._jqElement.triggerHandler("putvalue.appmember", valStr);
        },
        removeMember: function(id){
            var self = this;
            $.each(self._jqTagElement.find("div.header_div"),function(i,v){
                var header = $(v);
                if(header.attr("mem_id") == id){
                    header.remove();
                    var mdiv= self._jqTagElement.find("div.mdiv");
                    mdiv.width(mdiv.width()-56);
                }
            });
            var vals = self._jqElement.val().split(";");
            vals.remove(id);
            self._jqElement.val(vals.join(";"));
            self._jqElement.triggerHandler("removevalue.appmember", id);
        },
        clearMember: function(){
            var self = this;
            self._jqElement.val("");
            self._jqTagElement.find("div.mdiv").empty();
            self._jqElement.triggerHandler("clearvalue.appmember");
        },
        getValue: function(){
            return this._jqElement.val();
        },
        isDisabled: function () {
            return this._jqTagElement.find("div.header_add").isVisible();
        }
    });
})(jQuery);