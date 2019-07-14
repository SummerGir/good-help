(function($,undefined){
    $.widget('eiis.checkbox',{
        options:{
            code:'',
            name:'',
            source:[],// json数据格式 [{text:'',value:''},{text:'':value:''},.....]
            url:'', //返回json数据格式 [{text:'',value:''},{text:'':value:''},.....]
            checkedValue:null
        },
        _wrap:null,
        _buttons:[],
        _setOption:function(key,value){
            if(key == 'disabled'){
                $(this._buttons).each(function(i,o){
                    //$(o).button('option',key,value);
                    $(o).prop(key,value);
                });
            }
            if("hide".equalsIgnoreCase(key)){
                if(value){
                    this._wrap.hide();
                }else{
                    this._wrap.show();
                }
            }
            this._super(key,value);
        },
        _create:function(){
            if(String.isNullOrEmpty(this.element.attr("name"))){
                if(String.isNullOrEmpty(this.options.name)){
                    alert("必须设置name属性！");
                    return;
                }else{
                    this.element.attr("name",this.options.name);
                }
            }else{
                this.options.name = this.element.attr("name");
            }
            this._wrap = $("<span/>");//this.element;
            this.element.wrap(this._wrap);
            var self = this;
//            if(this.element.attr('type') == 'checkbox'){
//                //self._buttons.push(this.element.button());
//                self._buttons.push(this.element);
//                self._setOption("disabled",self.options.disabled);
//                return;
//            }
//            this.element.children('input:checkbox').each(function(i,o){
//                self._buttons.push($(o));
//                self._setOption("disabled",self.options.disabled);
//                return;
//            });
//            if(this.element.children('input:checkbox').length > 0){
//                self._buttons.push(this.element.buttonset());
//                self._setOption("disabled",self.options.disabled);
//                return;
//            }
            this._source();
//            this.element.children('input:checkbox').each(function(i,o){
//                self._buttons.push($(o));
//            });
//            this.element.buttonset().children("input:checkbox").each(function(i,o){
//                self._buttons.push($(o));
//            });
            this._buttons = this.element.parent().find("input[name='"+ this.options.name +"']");
            self._setOption("disabled",self.options.disabled);
        },
        _source:function(){
            var me = this;
            if(!String.isNullOrEmpty(this.options.code)){
                $.ajax({
                    async:false,
                    dataType:'json',
                    type:'post',
                    url:'/public/dictionary/getdictionarynode.jsp',
                    data:{dictcode:me.options.code,childOnly:true,typeOnly:false,valueOnly:true},
                    success:function(data,state){
                        if(data && data.length > 0){
                            me.options.source = [];
                            $.each(data,function(i,o){
                                me.options.source.push({text: o.title,value: o.key});
                            });
                        }
                    }
                });
            }
            if(!String.isNullOrEmpty(this.options.url)){
                $.ajax({
                    url:this.options.url
                    ,dataType:"json"
                    ,type:"post"
                    //,async:false
                    ,success :function(data){
                        if(data && data.length > 0){
                            me.options.source = data;
                        }
                    }
                    ,error :function(){}
                });
            }
            if(me.options.source.length > 0){
                var data = this.options.source;//$.parseJSON(this.options.source);
                $(data).each(function(i,o){
                    if(i > 0) me._newItem(i,me.options.name, o.text, o.value);
                });
            }
            if(String.isNullOrEmpty(this.element.attr("id"))){
                this.element.attr("id",name+id);
            }
            this.element.val(this.options.source[0].value);
            if(this.options.checkedValue){
                if(this.options.checkedValue.contains(this.element.val())){
                    this.element.prop("checked",true);
                }
            }
            $('<label for="'+this.element.attr("id")+'">'+this.options.source[0].text+'</label>').insertAfter(this.element);
        },
        _newItem:function(id,name,text,value){
            var checked = "";
            if(this.options.checkedValue){
                if(this.options.checkedValue.contains(value)){
                    checked = "checked";
                }
            }
            var html = String.format(
                '<input type="checkbox" id="{1}{0}" name="{1}" value="{2}" {3} /><label for="{1}{0}">{4}</label>'
                ,id,name,value,checked,text
            );
            //$(html).insertAfter(this.element);
            this.element.parent().append(html);
        },
        show:function(){
            this._setOption("hide",false);
        },
        hide:function(){
            this._setOption("hide",true);
        },
        value:function(value){
            if(arguments.length == 0){
                var values = [];
                $(this._buttons).each(function(i,o){
                    if(o.checked){
                        values.push(o.value);
                    }
                });
                return values;
            }
            $(this._buttons).each(function(i,o){
                if(o.value == value){
                    $(o).prop('checked',true);
                    //$(o).button('refresh');
                    return false;
                }
            });
        },
        widget:function(){
            return this._wrap;
        },
        _destroy:function(){
//            $(this._buttons).each(function(i,o){
//                $(o).button("destroy");
//            });
        }
    });
})(jQuery);