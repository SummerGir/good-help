/**
 * 暂只针对特定查询以及多选还存在一些问题如要扩展多选，自行补全问题
 */
!function($,window,undefined){
    var jQtemplate={
        container : $('<div>'+
                        '<div class="pickContainer">'+
                            '<label class="pickInput">'+
                                '<input type="text" size="20"/>'+
                            '</label>'+
                            '<div class="pickMenu" style="display: none;">'+
                                '<ul class="meuUl"></ul>'+
                                '<div class="meuButton">'+
                                    '<span class="pickFindMsg">找到 <span>0</span> 个</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="pickMask" style="display: none;"><span></span></div>'+
                        '</div>'+
                    '</div>'),
        meuItem : $('<li>' +
                        '<a tabindex="-1" href="javascript:void(0)">' +
                            '<span class="itemIcon"></span>&nbsp;&nbsp;' +
                            '<span class="itemContent">' +
                                '<b></b>&nbsp;&nbsp;' +
                                '<span></span>' +
                            '</span>'+
                        '</a>' +
                    '</li>'),
        noMsg : $('<div class="pickNoFound">' +
                        '<i class="fa fa-exclamation-circle"></i>' +
                        '<span>未搜索到相关信息</span>' +
                    '</div>'),
        buts : {
            add : $('<span class="pickAdd"><a href="#">+添加</a></span>'),
            pageUp : $('<span class="pickUp"><a href="#">上一页</a></span>'),
            pageDown : $('<span class="pickDown"><a href="#">下一页</a></span>')
        }

    },$window=$(window);

    var PickMem=function(ele,paramter){
        var self=this;
        ele.data("pickInstance",self);
        self.paramter=$.extend(true,{},self.defaultParamter,paramter);
        if(!self.paramter.placeholder && self.paramter.attribute.placeholder){
            self.paramter.placeholder=self.paramter.attribute.placeholder;
        }
        if(!self.paramter.exclude && self.paramter.attribute.exclude){
            self.paramter.exclude=self.paramter.attribute.exclude;
        }
        if(self.paramter.exclude){
            self.paramter.exclude=self.paramter.exclude.split(";");
        }else{
            self.paramter.exclude=[];
        }
        if(self.paramter.cache){
            self.cache={};
        }
        self.page=self.paramter.page;
        if(self.page<=0){
            self.page=1;
        }
        self.rows=self.paramter.rows;
        self.paging=self.rows>0;
        self.searchXHR=undefined;
        self.isShow=false;
        self.readonly=false;
        self.value=[];
        self.containerKey=[];
        self.jqElement={
            target : ele,
            container : jQtemplate.container.clone()
        };
        // the main need
        self.jqElement.pickInputContainer=self.jqElement.container.find(".pickInput");
        self.jqElement.pickInput=self.jqElement.pickInputContainer.find("input");
        self.jqElement.pickMenu=self.jqElement.container.find(".pickMenu");
        self.jqElement.meuUl=self.jqElement.pickMenu.find(".meuUl");
        self.jqElement.meuButton=self.jqElement.pickMenu.find(".meuButton");
        self.jqElement.msgNum=self.jqElement.meuButton.find(".pickFindMsg>span");
        self.jqElement.pickMask=self.jqElement.container.find(".pickMask");

        if(self.paramter.separate!=="" && self.paramter.separate!==undefined && self.paramter.separate!==null){
            self.jqElement.separate = $('<span class="separate">'+self.paramter.separate+'</span>');
        }
        ele.hide().after(self.jqElement.container);
        self.init();
    };

    PickMem.prototype={
        defaultParamter : {
            page : 1,
            rows : -1,
            height : "auto",
            width : "auto",
            menuHeight : 200,
            idField : "id",
            textField : "text",
            explaField : "expla",
            searchKeyName : "searchKey",
            searchOneKeyName : undefined,
            exclude : undefined, //todo 未实现
            cache : true,
            cacheTime : -1,//毫秒单位
            repeat : false,
            multiple : false,
            newLine : false,
            placeholder : null,
            searchLength : 2,
            showExpla : true,
            separate : "&nbsp;&nbsp;，",
            itemStyle : "",
            menuDisplay : "bottom",// auto top bottom,auto基于输入框对于整个屏幕上方或下方谁剩余多朝哪方显示
            icon : {
                className : "fa fa-bookmark",
                color : {
                    enable : "#6bbbd5",
                    disable : "#b1b1b1"
                }
            },
            urls : {
                list : {
                    url : "",
                    extendParam : {}
                },
                item : {
                    url : "",
                    extendParam : {}
                }
            },
            buts : {
                add : {
                    show : false,
                    onClick : function(){

                    }
                },
                pageUp : { // todo 未实现
                    show : false,
                    onClick : function(){

                    }
                },
                pageDown : { // todo 未实现
                    show : false,
                    onClick : function(){

                    }
                }
            },
            onInit : function(){

            },
            onDestroy : function(){
                //集成datagrid后使用单独使用不触发
            },
            onSelect : function(){

            },
            onUnSelect : function(){

            },
            onInput : function(){//监听输入框

            }
        },
        init : function(){
            var self=this;

            if(typeof self.paramter.menuHeight==="string"){
                var menuHeight=Number(self.paramter.menuHeight);
                if(isNaN(menuHeight) && self.paramter.menuHeight.indexOf("px")!==0){
                    self.jqElement.meuUl.css("max-height",self.paramter.menuHeight);
                    self.jqElement.menuHeight=Number(self.paramter.menuHeight.replace("px",""));
                    self.jqElement.pickMask.css("height",(self.paramter.menuHeight+30)+"px").find("span").css("margin",((self.paramter.menuHeight+30)/2+10)+"px auto");
                }else{
                    self.jqElement.meuUl.css("max-height",menuHeight+"px");
                    self.jqElement.pickMask.css("height",(menuHeight+30)+"px").find("span").css("margin",((menuHeight+30)/2+10)+"px auto");
                    self.jqElement.menuHeight=menuHeight;
                }
            }else{
                self.jqElement.meuUl.css("max-height",self.paramter.menuHeight+"px");
                self.jqElement.pickMask.css("height",(self.paramter.menuHeight+30)+"px").find("span").css("margin",(self.paramter.menuHeight/2+10)+"px auto");
            }
            var parent=self.jqElement.container.parent();
            parent.resize(function(){
                self.jqElement.pickInputContainer.css("width",(parent.width())+"px");
            });
            if(parent.width()>0){
                self.jqElement.pickInputContainer.css("width",(parent.width())+"px");
            }
            self.setPlaceholder();
            if(self.paramter.height!=="auto"){
                if(typeof self.paramter.height==="string"){
                    var height=Number(self.paramter.height);
                    if(isNaN(height)){
                        if(self.paramter.height.indexOf("px")!==-1){
                            self.jqElement.pickInput.css("height",(Number(self.paramter.height.replace("px",""))-2)+"px");
                        }else if(self.paramter.height.indexOf("%")!==-1){
                            self.jqElement.pickInput.css("height",self.paramter.height);
                        }
                    }else{
                        self.jqElement.pickInput.css("height",(height-2)+"px");
                    }
                }else if(typeof self.paramter.height==="number"){
                    self.jqElement.pickInput.css("height",(self.paramter.height-2)+"px");
                }
            }else{
                self.jqElement.pickInput.css("height","100%");
            }
            if(self.paramter.width!=="auto"){
                if(typeof self.paramter.width==="string"){
                    var width=Number(self.paramter.width);
                    if(isNaN(width)){
                        if(self.paramter.width.indexOf("px")!==-1 || self.paramter.width.indexOf("%")!==-1){
                            self.jqElement.container.css("width",self.paramter.width);
                        }
                    }else{
                        self.jqElement.container.css("width",width+"px");
                    }
                }else if(typeof self.paramter.width==="number"){
                    self.jqElement.container.css("width",self.paramter.width+"px");
                }
            }
            // 事件绑定
            self.jqElement.pickInput.on({
                focus : function(){
                    self.jqElement.pickInputContainer.addClass("pickInputFocus");
                },
                blur : function(){
                    self.jqElement.pickInputContainer.removeClass("pickInputFocus");
                },
                input : function(){
                    self.jqElement.meuUl.empty();
                    self.jqElement.msgNum.text(0);
                    self.page=1;
                    self.search();
                    self.paramter.onInput(self.jqElement.pickInput.val());
                },
                propertychange : function(){
                    self.jqElement.meuUl.empty();
                    self.jqElement.msgNum.text(0);
                    self.page=1;
                    self.search();
                    self.paramter.onInput(self.jqElement.pickInput.val());
                }
            });
            self.jqElement.pickInputContainer.on({
                click : function(){
                    if(self.jqElement.meuUl.find("li").length>0){
                        self.showMenu();
                    }else{
                        if(!self.readonly){
                            self.search();
                        }
                    }
                },
                keydown : function(event){
                    var code=event.code || event.key;
                    var itemActive,pickItems,temp;
                    var activeTop,butTop,minus;
                    if(code==="Backspace"){
                        if(self.getCursortPosition(self.jqElement.pickInput[0])===0){
                            var prev=self.jqElement.pickInput.prev();
                            if(prev.length!==0){
                                self.unSelect(prev);
                            }
                        }
                    }else if(code==="ArrowDown" || code==="Down"){
                        itemActive=self.jqElement.meuUl.find(".itemActive");
                        if(itemActive.length===0){
                            pickItems=self.jqElement.meuUl.find(".pickItem");
                            if(pickItems.length>0){
                                pickItems.eq(0).addClass("itemActive");
                            }
                        }else{
                            temp=itemActive.nextAll(".pickItem");
                            if(temp.length>0){
                                itemActive.removeClass("itemActive");
                                activeTop=temp.eq(0).addClass("itemActive").offset().top+26;
                                butTop=self.jqElement.meuButton.offset().top;
                                minus=activeTop-butTop;
                                if(minus>0){
                                    self.jqElement.meuUl.scrollTop(self.jqElement.meuUl.scrollTop()+minus);
                                }
                            }
                        }
                    }else if(code==="ArrowUp" || code==="Up"){
                        itemActive=self.jqElement.meuUl.find(".itemActive");
                        if(itemActive.length===0){
                            pickItems=self.jqElement.meuUl.find(".pickItem");
                            if(pickItems.length>0){
                                pickItems.eq(0).addClass("itemActive");
                            }
                        }else{
                            temp=itemActive.prevAll(".pickItem");
                            if(temp.length>0){
                                itemActive.removeClass("itemActive");
                                activeTop=temp.eq(0).addClass("itemActive").offset().top;
                                if(self.menuDirection){
                                    activeTop-=30;
                                }else{
                                    activeTop+=(30+self.jqElement.meuUl.height());
                                }
                                butTop=self.jqElement.pickInputContainer.offset().top;
                                minus=butTop-activeTop;
                                if(minus>0){
                                    self.jqElement.meuUl.scrollTop(self.jqElement.meuUl.scrollTop()-minus);
                                }
                            }
                        }
                    }else if(code==="NumpadEnter" || code==="Enter"){
                        itemActive=self.jqElement.meuUl.find(".itemActive");
                        if(itemActive.length>0){
                            itemActive.click();
                        }
                    }
                }
            });
            if(self.rows>0){
                self.jqElement.meuUl.on("scroll",function(){
                    var scrollHeight=self.jqElement.meuUl[0].scrollHeight;
                    if(self.searchState && scrollHeight>0 && self.jqElement.meuUl.scrollTop()+self.paramter.menuHeight>=scrollHeight){
                        self.page++;
                        self.search(self.beforeSearchStr);
                    }
                });
            }
            self.jqElement.meuUl.delegate("li",{
                mouseover : function(){
                    var active=$(this);
                    if(active.attr("class").indexOf("pickItemReadonly")===-1){
                        active.addClass("itemActive").siblings().removeClass("itemActive");
                    }else{
                        active.children("a").addClass("itemReadonlyActive");
                    }
                },
                mouseout : function(){
                    var active=$(this);
                    if(active.attr("class").indexOf("pickItemReadonly")!==-1){
                        active.children("a").removeClass("itemReadonlyActive");
                    }
                },
                click : function(){
                    var active=$(this);
                    if(active.attr("class").indexOf("pickItemReadonly")===-1){
                        var val=active.data("value");
                        if(val && val[self.paramter.idField] && (!self.containerKey.contains(val[self.paramter.idField]) || (self.paramter.multiple && self.paramter.repeat))){
                            self.setValue(val);
                        }
                    }
                }
            });
            $(window).on("click.pickMem",function(event){
                if(self.isShow && $(event.target).parents(".pickContainer,.detailModal").length===0){
                    self.hideMenu();
                }
            });
            self.jqElement.meuUl.preventScroll();
            self.jqElement.pickMask.preventScroll();
            if(self.paramter.buts.pageUp.show){
                jQtemplate.buts.pageUp.clone().appendTo(self.jqElement.meuButton).on("click",function(){
                    if(self.page>1){
                        self.paramter.buts.pageUp.onClick(self);
                    }
                });
            }
            if(self.paramter.buts.pageDown.show){
                jQtemplate.buts.pageDown.clone().appendTo(self.jqElement.meuButton).on("click",function(){
                    self.paramter.buts.pageDown.onClick(self);
                });
            }
            if(self.paramter.buts.add.show){
                jQtemplate.buts.add.clone().appendTo(self.jqElement.meuButton).on("click",function(){
                    self.paramter.buts.add.onClick(self);
                });
            }
            // 绑定结束
            if(self.paramter.menuDisplay==="top"){
                self.jqElement.pickMenu.css("bottom","100%");
                self.jqElement.pickMask.css("bottom","100%");
                self.menuDirection=false;
            }else{
                self.paramter.menuDisplayAuto=self.paramter.menuDisplay==="auto";
                self.menuDirection=!self.paramter.menuDisplayAuto;
            }
            if(!self.paramter.newLine){
                self.jqElement.pickInputContainer.addClass("pickInputNewline");
            }
            if(self.paramter.attribute.value){
                self.setValue(self.paramter.attribute.value);
            }
            if(self.paramter.attribute.disabled){
                self.disable();
            }
            setTimeout(function(){
                self.paramter.onInit(self);
                self.jqElement.target.triggerHandler("init.pickMember",[self]);
            },1);
        },
        destroy : function(keepTarget){
            var self=this;
            self.jqElement.target.next().remove();
            if(keepTarget) {
                self.jqElement.target.data("pickInstance", undefined);
            }else{
                self.jqElement.target.remove();
            }
            setTimeout(function(){
                self.paramter.onDestroy(self.getValues());
                self=undefined;
            },1);
        },
        search : function(searchStr){
            var self=this;
            if(searchStr===undefined){
                searchStr=self.jqElement.pickInput.val().trim();
            }
            if(searchStr.length>=self.paramter.searchLength && self.paramter.urls.list.url){
                if(self.searchXHR!==undefined){
                    self.searchXHR.abort();
                }
                self.showMask();
                var cacheData;
                if(self.cache){
                    cacheData=self.cache[searchStr];
                    if(cacheData===undefined){
                        self.cache[searchStr]={};
                    }else{
                        cacheData=cacheData["_"+self.page];
                    }
                }
                if(cacheData===undefined || (self.paramter.cacheTime>=0 && cacheData.failureTime<new Date().getTime())){
                    var param;
                    if(typeof self.paramter.urls.list.extendParam==="function"){
                        param=$.extend(true,{},(self.paramter.urls.list.extendParam() || {}));
                    }else{
                        param=$.extend(true,{},self.paramter.urls.list.extendParam);
                    }
                    param[self.paramter.searchKeyName]=searchStr;
                    self.beforeSearchStr=searchStr;
                    param.page=self.page;
                    param.rows=self.rows;
                    self.searchXHR=$.ajax({
                        type : "post",
                        url : self.paramter.urls.list.url,
                        data : param,
                        dataType : "json",
                        success : function(msg){
                            if(self.cache){
                                self.cache[searchStr]["_"+self.page]={
                                    failureTime : new Date().getTime()+self.paramter.cacheTime,
                                    data : msg
                                };
                            }
                            self.searchXHR=undefined;
                            var len;
                            if($.isArray(msg)){
                                len=msg.length;
                            }else{
                                len=msg.rows.length;
                            }
                            if(msg && len>0){
                                self.searchState=!(self.paging && len<self.rows);
                                self.put(msg);
                            }else{
                                self.searchState=false;
                                if(!self.paging || self.page===1){
                                    if(self.jqElement.meuUl.find(".pickNoFound").length===0){
                                        jQtemplate.noMsg.clone().appendTo(self.jqElement.meuUl);
                                    }
                                }
                            }
                            self.hideMsk();
                            self.showMenu();
                        }
                    });
                }else{
                    var len,msg=cacheData.data;
                    if($.isArray(msg)){
                        len=msg.length;
                    }else{
                        len=msg.rows.length;
                    }
                    if(msg && len>0){
                        self.searchState=!(self.paging && len<self.rows);
                        self.put(msg);
                    }else{
                        self.searchState=false;
                        if(!self.paging || self.page===1){
                            if(self.jqElement.meuUl.find(".pickNoFound").length===0){
                                jQtemplate.noMsg.clone().appendTo(self.jqElement.meuUl);
                            }
                        }
                    }
                    self.hideMsk();
                    self.showMenu();
                }
            }else{
                self.hideMsk();
                self.hideMenu();
                if(self.searchXHR!==undefined){
                    self.searchXHR.abort();
                }
            }
        },
        put : function(data){
            var temp;
            if($.isArray(data)){
                temp={
                    rows : data
                };
            }else{
                if(data.rows===undefined){
                    temp={
                        rows : [data]
                    };
                }else{
                    temp=data;
                }
            }
            var item,self=this,count=0;
            for(var i=0;i<temp.rows.length;i++){
                item=temp.rows[i];
                if(!self.paramter.exclude.contains(item[self.paramter.idField])){
                    if(!item.readonly){
                        if(!self.paramter.multiple || (self.paramter.multiple && !self.paramter.repeat)){
                            item=$.extend(true,{},item,{readonly:self.containerKey.contains(item[self.paramter.idField])});
                        }
                    }
                    self.buildItem(item);
                    count++;
                }
            }
            if(count===0){
                self.jqElement.msgNum.text(0);
                if(self.jqElement.meuUl.find(".pickNoFound").length===0){
                    jQtemplate.noMsg.clone().appendTo(self.jqElement.meuUl);
                }
            }else{
                self.jqElement.msgNum.text(Number(self.jqElement.msgNum.text())+temp.rows.length);
            }
        },
        buildItem : function(data){
            var self=this;
            var item=jQtemplate.meuItem.clone().attr("data-tag-id",data[self.paramter.idField]);
            if(data.readonly){
                item.addClass("pickItemReadonly");
                item.find(".itemIcon").css("color",self.paramter.icon.color.disable);
            }else{
                if(data.color){
                    var color=data.color;
                    if((color+"").indexOf("#")===-1 && color.indexOf("rba")===-1){
                        color="#"+color;
                    }
                    item.find(".itemIcon").css("color",color);
                }else if(data.style){
                    item.find(".itemIcon").attr("style",data.style);
                }else{
                    item.find(".itemIcon").css("color",self.paramter.icon.color.enable);
                }
                item.addClass("pickItem");
            }
            if(data.classIcon){
                item.find(".itemIcon").addClass(data.classIcon);
            }else{
                item.find(".itemIcon").addClass(self.paramter.icon.className);
            }
            if(self.paramter.itemStyle){
                item.find("a").attr("style",self.paramter.itemStyle);
            }
            var itemContent=item.find(".itemContent");
            itemContent.find("b").text(data[self.paramter.textField]===undefined?"":data[self.paramter.textField]);
            itemContent.find("span").text(data[self.paramter.explaField]===undefined?"":data[self.paramter.explaField]);
            data.target=item;
            item.data("value",data);
            return item.appendTo(self.jqElement.meuUl);
        },
        setValues : function(arr){
            if($.isArray(arr)){
                for(var i=0;i<arr.length;i++){
                    this.setValue(arr[i]);
                }
            }else if(typeof arr==="string"){
                this.setValues(arr.split(";"));
            }
        },
        setValue : function(value){
            if(value===undefined){
                return;
            }
            var self=this;
            if(typeof value==="string" && self.paramter.urls.item.url){
                var param;
                if(typeof self.paramter.urls.item.extendParam==="function"){
                    param=$.extend(true,{},(self.paramter.urls.item.extendParam() || {}));
                }else{
                    param=$.extend(true,{},self.paramter.urls.item.extendParam);
                }
                param[self.paramter.searchOneKeyName || self.paramter.idField]=value;
                $.ajax({
                    type : "post",
                    url : self.paramter.urls.item.url,
                    data : param,
                    dataType : "json",
                    success : function(msg){
                        if($.isArray(msg)){
                            if(msg.length>0){
                                self.setValues(msg);
                            }
                        }else if(!$.isEmptyObject(msg)){
                            self.setValue(msg);
                        }
                    }
                });
                return;
            }
            if(self.paramter.exclude.contains(value[self.paramter.idField])){
                return;
            }
            value=$.extend(true,{},value);
            var id=value[self.paramter.idField];
            if(self.paramter.multiple){
                if(self.containerKey.contains(id) && !self.paramter.repeat){
                    return;
                }
                if(self.containerKey.length>0 && self.jqElement.separate){
                    value.separate=self.jqElement.separate.clone();
                    self.jqElement.pickInput.before(value.separate);
                }
            }else{
                self.clear();
            }
            self.containerKey.push(id);
            self.jqElement.target.val(self.containerKey.join(";"));
            if(value.target){
                if(!self.paramter.multiple || (self.paramter.multiple && !self.paramter.repeat)){
                    value.target.find(".itemIcon").css("color",self.paramter.icon.color.disable);
                    value.target.attr("class","pickItemReadonly");
                }
            }
            if(value.tag===undefined || (self.paramter.multiple && self.paramter.repeat)){
                var expla=value[self.paramter.explaField];
                if(self.paramter.showExpla && expla){
                    value.tag=$('<span data-tag-id="'+id+'" data-uuid="'+$.uuid()+'">'+value[self.paramter.textField]+'（'+expla+'）</span>');
                }else{
                    value.tag=$('<span data-tag-id="'+id+'" data-uuid="'+$.uuid()+'">'+value[self.paramter.textField]+'</span>');
                }
            }
            value.tag.on({
                dblclick : function(){
                    if(!self.readonly){
                        self.unSelect(value.tag);
                    }
                },
                mouseover : function(){
                    if(!self.readonly){
                        var count=1;
                        var interval=setInterval(function(){
                            if(count++===10){
                                value.tag.css("background-color","rgba(178,223,238,1)");
                                clearInterval(interval);
                                return;
                            }
                            value.tag.css("background-color","rgba(178,223,238,"+(count/10)+")");
                        },10);
                    }
                },
                mouseout : function(){
                    if(!self.readonly){
                        var count=9;
                        var interval=setInterval(function(){
                            if(count--===1){
                                value.tag.css("background-color","#ffffff");
                                clearInterval(interval);
                                return;
                            }
                            value.tag.css("background-color","rgba(178,223,238,"+(count/10)+")");
                        },20);
                    }
                }
            }).css("margin-left","2px");
            self.value.push(value);
            self.jqElement.pickInput.before(value.tag);
            if(self.paramter.urls.list.url!=="" && self.paramter.urls.list.url!==undefined){
                self.jqElement.pickInput.val("");
            }
            self.clearPlaceholder();
            if(!self.paramter.multiple){
                self.jqElement.meuUl.empty();
                self.hideMenu();
            }
            self.paramter.onSelect(value);
            self.jqElement.target.triggerHandler("select.pickMember",[value]);
        },
        getValue : function(){
            return this.value[0] || undefined;
        },
        getValues : function(){
            return this.value || [];
        },
        getId : function(){
            return this.containerKey[0] || "";
        },
        getIds : function(){
            return this.containerKey || [];
        },
        unSelect : function(ele){
            var self=this,val;
            var eleState=typeof ele==="object";
            var id=eleState?ele.data("tag-id"):ele;
            var temps=[],temp,tempId,i;
            if(self.paramter.multiple && self.paramter.repeat){
                if(eleState){
                    for(i=0;i<self.value.length;i++){
                        temp=self.value[i];
                        if(temp.tag.data("uuid")===ele.data("uuid")){
                            if(i===0 && self.containerKey.length>1){
                                self.value[1].separate.remove();
                            }
                            self.containerKey.splice(i,1);
                            temp.tag.remove();
                            if(temp.separate){
                                temp.separate.remove();
                            }
                            val=temp;
                        }else{
                            temps.push(temp);
                        }
                    }
                }else{
                    val=[];
                    for(i=0;i<self.value.length;i++){
                        temp=self.value[i];
                        if(id==temp[self.paramter.idField]){
                            if(i===0 && self.containerKey.length>1){
                                self.value[1].separate.remove();
                            }
                            self.containerKey.splice(i,1);
                            temp.tag.remove();
                            if(temp.separate){
                                temp.separate.remove();
                            }
                            val.push(temp);
                        }else{
                            temps.push(temp);
                        }
                    }
                }
            }else{
                for(i=0;i<self.value.length;i++){
                    temp=self.value[i];
                    tempId=temp[self.paramter.idField];
                    if(id==tempId){
                        if(i===0 && self.containerKey.length>1){
                            self.value[1].separate.remove();
                        }
                        if(temp.color){
                            var color=temp.color;
                            if((color+"").indexOf("#")===-1 && color.indexOf("rba")===-1){
                                color="#"+color;
                            }
                            self.jqElement.meuUl.find(".pickItemReadonly[data-tag-id='"+tempId+"']").attr("class","pickItem").find(".itemIcon").css("color",color);
                        }else if(temp.style){
                            self.jqElement.meuUl.find(".pickItemReadonly[data-tag-id='"+tempId+"']").attr("class","pickItem").find(".itemIcon").attr("style",temp.style);
                        }else{
                            self.jqElement.meuUl.find(".pickItemReadonly[data-tag-id='"+tempId+"']").attr("class","pickItem").find(".itemIcon").css("color",self.paramter.icon.color.enable);
                        }
                        self.containerKey.splice(i,1);
                        temp.tag.remove();
                        if(temp.separate){
                            temp.separate.remove();
                        }
                        val=temp;
                    }else{
                        temps.push(temp);
                    }
                }
            }
            self.value=temps;
            self.jqElement.target.val(self.containerKey.join(";"));
            if(self.containerKey.length===0){
                self.setPlaceholder();
            }
            self.paramter.onUnSelect(val);
            self.jqElement.target.triggerHandler("unSelect.pickMember",[val]);
        },
        clear : function(){
            var self=this,item,temp=self.value;
            for(var i=0;i<self.value.length;i++){
                item=self.value[i];
                if(item.target){
                    if(item.color){
                        item.target.attr("class","pickItem").find(".itemIcon").css("color",item.color);
                    }else{
                        item.target.attr("class","pickItem").find(".itemIcon").css("color",self.paramter.icon.color.enable);
                    }
                }
                if(item.separate){
                    item.separate.remove();
                }
                item.tag.remove();
            }
            self.value=[];
            self.containerKey=[];
            self.jqElement.target.val("");
            self.setPlaceholder();
            if(temp.length>0){
                self.paramter.onUnSelect(temp);
                self.jqElement.target.triggerHandler("unSelect.pickMember",[temp]);
            }
        },
        enable : function(){
            var self=this;
            self.jqElement.pickInputContainer.removeClass("pickDisable");
            self.jqElement.pickInput.removeAttr("disabled");
            self.readonly=false;
        },
        disable : function(){
            var self=this;
            self.jqElement.pickInputContainer.addClass("pickDisable");
            self.jqElement.pickInput.attr("disabled",true);
            self.readonly=true;
        },
        showMenu : function(){
            var self=this;
            if(self.paramter.menuDisplayAuto){
                if(($window.height()/2)>self.jqElement.container[0].getBoundingClientRect().y){
                    self.jqElement.pickMenu.css("bottom","auto");
                    self.menuDirection=true;
                }else{
                    self.jqElement.pickMenu.css("bottom","100%");
                    self.menuDirection=false;
                }
            }
            self.jqElement.pickMenu.show();
            self.isShow=true;
        },
        hideMenu : function(){
            var self=this;
            self.jqElement.pickMenu.hide();
            self.isShow=false;
        },
        showMask : function(){
            var self=this;
            if(self.paramter.menuDisplayAuto){
                if(($window.height()/2)>self.jqElement.container[0].getBoundingClientRect().y){
                    self.jqElement.pickMask.css("bottom","auto");
                }else{
                    self.jqElement.pickMask.css("bottom","100%");
                }
            }
            self.jqElement.pickMask.show();
        },
        hideMsk : function(){
            this.jqElement.pickMask.hide();
        },
        setPlaceholder : function(str){
            var self=this;
            str=str!==undefined?str:self.paramter.placeholder;
            if(str!==null && self.value.length===0){
                self.jqElement.pickInput.attr("placeholder",str);
            }
        },
        clearPlaceholder : function(){
            this.jqElement.pickInput.removeAttr("placeholder");
        },
        getCursortPosition : function(ctrl) {
            var CaretPos = 0;
            if (document.selection) {
                ctrl.focus();
                var Sel = document.selection.createRange();
                Sel.moveStart ('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
            }else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;
            return (CaretPos);
        },
        clearCache : function(){
            if(this.cache){
                this.cache={};
            }
            this.jqElement.meuUl.find("li").remove();
        },
        replaceCache : function(str){
            
        },
        changeRequestExtendParam : function(param){
            var self=this;
            if(!$.isFunction(self.paramter.urls.list.extendParam)){
                $.extend(true,self.paramter.urls.list.extendParam,param);
            }
        }
    };
    $.fn.extend({
        pickMem : function(){
            var paramter=typeof arguments[0];
            var instance=this.data("pickInstance");
            if(paramter==="string"){
                if(instance){
                    paramter=instance[arguments[0]];
                    if($.isFunction(paramter)){
                        var params=Arrays.clone(arguments);
                        params.shift();
                        var result=paramter.apply(instance,params);
                        return result===undefined?this:result;
                    }
                }else{
                    return null;
                }
            }else{
                if(instance){
                    return instance;
                }else{
                    return $.pickMem(this,arguments[0]);
                }
            }
        },
        preventScroll : function(){
            $(this).each(function(){
                var _this = this;
                if(navigator.userAgent.indexOf('Firefox') >= 0){   //firefox
                    _this.addEventListener('DOMMouseScroll',function(e){
                        _this.scrollTop += e.detail > 0 ? 60 : -60;
                        e.preventDefault();
                    },false);
                }else{
                    _this.onmousewheel = function(e){
                        e = e || window.event;
                        _this.scrollTop += e.wheelDelta > 0 ? -60 : 60;
                        return false;
                    };
                }
            })
        }
    });
    $.extend({
        pickMem : function(jqEle,paramter){
            if(paramter===undefined){
                paramter={};
            }
            if(paramter.searchLength!==undefined){
                paramter.searchLength=Number(paramter.searchLength);
                if(isNaN(paramter.searchLength)){
                    paramter.searchLength=PickMem.prototype.defaultParamter.searchLength;
                }
            }
            paramter.attribute={
                value : jqEle.val(),
                disabled : !!jqEle.attr("disabled"),
                placeholder : jqEle.attr("placeholder"),
                exclude : jqEle.data("exclude")
            };
            return new PickMem(jqEle,paramter);
        },
        uuid : function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        }
    });
    if(Array.prototype.contains===undefined){
        Array.prototype.indexOf = function (value) {
            var i;
            if (arguments.length > 1 && arguments[1] == true) {
                var tmp = value.toString().toLowerCase();
                for (i = 0, j = this.length; i < j; i++) {
                    if (this[i].toString().toLowerCase() == tmp) return i;
                }
            } else {
                for (i = 0, j = this.length; i < j; i++) {
                    if (this[i] == value) return i;
                }
            }
            return -1;
        };
        Array.prototype.contains = function(_object){
            return this.indexOf(_object) !== -1;
        }
    }
    $window.on("load",function(){
        if($("").datagrid!==undefined || $("").treegrid!==undefined){
            $(window.document.head).append('<style type="text/css">' +
                                                '.gridMemberContainer .tagsinput{border-radius: 0 !important;border: none !important;height: 25px !important;min-height: auto !important;position: initial !important;}'+
                                                '.gridMemberContainer .tags{padding: 2px 2px 2px 0 !important;height: 25px !important;overflow: hidden !important;}'+
                                                '.gridMemberContainer .tags-btn{height: 25px !important;}'+
                                                '.gridMemberContainer .tags-btn>button{border: none !important;padding: 4px 5px 2px !important;border-radius: 0 !important;}'+
                                            '</style>');
        }
        if($("").datagrid!==undefined){
            $.extend($.fn.datagrid.defaults.editors,{
                pickMember : {
                    init : function(container, options){
                        options.onInit=function(pickMember){
                            container.find(".pickContainer").css("position","initial");
                            pickMember.jqElement.pickInput.focus();
                            if(options.searchLength===0){
                                pickMember.search();
                            }
                        };
                        container.parents(".datagrid-editable").parent().css("position","relative");
                        return $("<input type='text' placeholder='输入成员名称'/>").appendTo(container).pickMem(options);
                    },
                    destroy : function(target){
                        target.destroy(true);
                    },
                    getValue : function(target){
                        return target.getIds().join(";");
                    },
                    setValue : function(target, value){
                        target.setValue(value);
                    }
                },
                memberInfo : {
                    init : function(container, options){
                        container.addClass("gridMemberContainer");
                        if(options===undefined || typeof options!=="object" || $.isArray(options)){
                            options={};
                        }
                        var param=$.extend(true,{
                            multiple : true,
                            dept : true,
                            post : true,
                            person : true,
                            selectRoot : true,
                            placeholder : "点击右侧按钮选择字典",
                            onInit : undefined,
                            onPut : undefined,
                            onRemove : undefined,
                            onDestroy : undefined
                        },options);
                        var eventName="gridMemberInfoEditEvent_"+parseInt((Math.random()*1000000));
                        if($.isFunction(param.onInit)){
                            window[eventName]=function(){
                                this.next().tagsinput("setReadOnlyNew");
                                param.onInit.call(this);
                            };
                        }else{
                            window[eventName]=function(){
                                this.next().tagsinput("setReadOnlyNew");
                            };
                        }
                        var input=$("<input type='text' class='eiis-member' data-hideHint='true'/>");
                        input.attr("data-multiple",param.multiple);
                        input.attr("data-dept",param.dept);
                        input.attr("data-post",param.post);
                        input.attr("data-person",param.person);
                        input.attr("data-select-root",param.selectRoot);
                        input.attr("placeholder",param.placeholder);
                        input.attr("data-init",eventName);
                        if($.isFunction(param.put)){
                            input.on("member.put.tagsinput",param.put);
                        }
                        if($.isFunction(param.remove)){
                            input.on("member.remove.tagsinput",param.remove);
                        }
                        input.data("memberDestroy",param.destroy);
                        container.parents(".datagrid-editable").parent().css("position","relative");
                        return input.appendTo(container);
                    },
                    destroy : function(target){
                        setTimeout(function(){
                            var memberDestroy=target.data("memberDestroy");
                            if($.isFunction(memberDestroy)){
                                memberDestroy.call(target);
                            }
                        },1);
                    },
                    getValue : function(target){
                        return target.val();
                    },
                    setValue : function(target, value){
                        if(value){
                            target.val(value);
                        }
                    }
                }
            });
        }
        if($("").treegrid!==undefined){
            $.extend($.fn.treegrid.defaults.editors,{
                pickMember : {
                    init : function(container, options){
                        options.onInit=function(pickMember){
                            container.find(".pickContainer").css("position","initial");
                            pickMember.jqElement.pickInput.focus();
                            if(options.searchLength===0){
                                pickMember.search();
                            }
                        };
                        container.parents(".datagrid-editable").parent().css("position","relative");
                        return $("<input type='text' placeholder='输入成员名称'/>").appendTo(container).pickMem(options);
                    },
                    destroy : function(target){
                        target.destroy(true);
                    },
                    getValue : function(target){
                        return target.getIds().join(";");
                    },
                    setValue : function(target, value){
                        target.setValue(value);
                    }
                },
                memberInfo : {
                    init : function(container, options){
                        container.addClass("gridMemberContainer");
                        if(options===undefined || typeof options!=="object" || $.isArray(options)){
                            options={};
                        }
                        var param=$.extend(true,{
                            multiple : true,
                            dept : true,
                            post : true,
                            person : true,
                            selectRoot : true,
                            placeholder : "点击右侧按钮选择字典",
                            onInit : undefined,
                            onPut : undefined,
                            onRemove : undefined,
                            onDestroy : undefined
                        },options);
                        var eventName="gridMemberInfoEditEvent_"+parseInt((Math.random()*1000000));
                        if($.isFunction(param.onInit)){
                            window[eventName]=function(){
                                this.next().tagsinput("setReadOnlyNew");
                                param.onInit.call(this);
                            };
                        }else{
                            window[eventName]=function(){
                                this.next().tagsinput("setReadOnlyNew");
                            };
                        }
                        var input=$("<input type='text' class='eiis-member' data-hideHint='true'/>");
                        input.attr("data-multiple",param.multiple);
                        input.attr("data-dept",param.dept);
                        input.attr("data-post",param.post);
                        input.attr("data-person",param.person);
                        input.attr("data-select-root",param.selectRoot);
                        input.attr("placeholder",param.placeholder);
                        input.attr("data-init",eventName);
                        if($.isFunction(param.onPut)){
                            input.on("member.put.tagsinput",param.onPut);
                        }
                        if($.isFunction(param.onRemove)){
                            input.on("member.remove.tagsinput",param.onRemove);
                        }
                        input.data("memberDestroy",param.onDestroy);
                        container.parents(".datagrid-editable").parent().css("position","relative");
                        return input.appendTo(container);
                    },
                    destroy : function(target){
                        var values=target.next().tagsinput("getValues");
                        var memberDestroy=target.data("memberDestroy");
                        setTimeout(function(){
                            if($.isFunction(memberDestroy)){
                                memberDestroy.call(target,values);
                            }
                        },1);
                    },
                    getValue : function(target){
                        return target.val();
                    },
                    setValue : function(target, value){
                        if(value){
                            target.val(value);
                        }
                    }
                }
            });
        }
    });
}(jQuery,window,undefined);