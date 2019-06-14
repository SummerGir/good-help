!function($,sonic,window,undefined){
    var jQTemplate={
        container : $('<div class="treeSelectContainer">' +
                        '<div class="inputContainer">' +
                            '<div class="selectInput">' +
                                '<input type="text" readonly="readonly"/>'+
                            '</div>'+
                            '<div class="presentation">' +
                                '<b class="presentationIcon"></b>' +
                            '</div>'+
                        '</div>'+
                        '<div class="treeSelectPane">' +
                            '<div class="_treeSelectPane">'+
                                '<div class="title"></div>'+
                                '<div class="grid"></div>'+
                                '<div class="mask"></div>'+
                                '<span class="noData">无数据来源</span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'),
        $window : $(window),
        maskOption : {
            width: 60,
            height: 60,
            stepsPerFrame: 3,
            trailLength: 1,
            pointDistance: .01,
            fps: 30,
            step: 'fader',
            strokeColor: '#4de2ff',
            setup: function () {
                this._.lineWidth = 4;
            },
            path: [
                ['arc', 30, 30, 15, 360, 0]
            ]
        }
    };

    var Select=function(ele,option){
        var self=this;
        self.ids=[];
        self.texts=[];
        self.values=[];
        self.souceRows=undefined;
        self.id="select-"+parseInt(Math.random()*100000);
        self.option=$.extend(true,{},self.defaultOption,option);
        self.jqElement={
            container : jQTemplate.container.clone().data("select-id",self.id)
        };
        self.state={
            focused : false,
            open : false
        };
        self.ele=ele;
        ele.after(self.jqElement.container).hide();
        self.jqElement.inputContainer=self.jqElement.container.find(">.inputContainer");
        self.jqElement.treeSelectPane=self.jqElement.container.find(">.treeSelectPane");
        self.jqElement.input=self.jqElement.inputContainer.find("input");
        self.jqElement.noData=self.jqElement.treeSelectPane.find(".noData");
        self.jqElement.mask=self.jqElement.treeSelectPane.find(".mask");
        self.scInstance=new sonic(jQTemplate.maskOption);
        self.scInstance.stop();
        self.init();
    };

    Select.prototype={
        init : function(){
            var self=this;
            self.bind();
            if(self.option.multiple){
                self.ele.attr("multiple",true);
            }
            self.jqElement.mask.append(self.scInstance.canvas);
            self.jqElement.input.attr("placeholder",self.option.placeholder || "");
            self.jqElement.inputContainer.height(self.option.inputHeight);
            if(typeof self.option.paneHeight==="number"){
                self.jqElement.treeSelectPane.height(self.option.paneHeight);
            }else{
                self.jqElement.treeSelectPane.css("height",self.option.paneHeight);
            }
            if(self.option.type==="input"){
                self.jqElement.treeSelectPane.detach().appendTo($("body")).addClass("_input").data("select-id",self.id);
            }else{
                self.jqElement.treeSelectPane.addClass("_pane").data("select-id",self.id).find(".title").text(self.option.paneTitle);
                self.jqElement.inputContainer.hide();
            }
            self.grid=self.jqElement.treeSelectPane.find(".grid").tree({
                checkbox : true,
                onClick : function(node){
                    if(self.contains(node.id) && self.option.multiple){
                        self.unSelect(node,true,true);
                    }else{
                        self.select(node,true,true,true);
                    }
                    $(node.target).removeClass("tree-node-selected");
                }
            });
            if(self.option.data!==undefined && self.option.data.length>0){
                self.loadData(self.option.data);
                self.selectByType(self.option.value);
            }else if(self.option.initLoadState){
                self.reLoad(true);
            }
            setTimeout(function(){
                self.option.onInit.apply(self);
            },1);
        },
        bind : function(){
            var self=this;
            if(self.option.type==="input"){
                self.jqElement.inputContainer.on("click",function(){
                    if(!self.state.focused){
                        self.jqElement.inputContainer.addClass("focused");
                        self.state.focused=true;
                    }
                    self.changePane();
                });
                jQTemplate.$window.on("click."+self.id,function(event){
                    if(self.state.focused){
                        var target=$(event.target);
                        if(target && target.length>0){
                            var classStr=target.attr("class") || "";
                            if(classStr.indexOf("treeSelectContainer")!==-1){
                                if(target.data("select-id")!==self.id){
                                    self.jqElement.inputContainer.removeClass("focused");
                                    self.state.focused=false;
                                    self.closePane();
                                }
                            }else if(classStr.indexOf("treeSelectPane")!==-1){
                                if(target.data("select-id")!==self.id){
                                    self.jqElement.inputContainer.removeClass("focused");
                                    self.state.focused=false;
                                    self.closePane();
                                }
                            }else{
                                var _target1=target.parents(".treeSelectContainer");
                                if(_target1.length>0 && _target1.data("select-id")===self.id){
                                    return;
                                }
                                _target1=target.parents(".treeSelectPane");
                                if(_target1.length===0 || _target1.data("select-id")!==self.id){
                                    self.jqElement.inputContainer.removeClass("focused");
                                    self.state.focused=false;
                                    self.closePane();
                                }
                            }
                        }
                    }
                });
                self.jqElement.container.resize(function(){
                    self.jqElement.treeSelectPane.width(self.jqElement.inputContainer.width());
                });
            }
        },
        changePane : function(){
            var self=this;
            if(self.state.open){
                self.closePane();
            }else{
                self.openPane();
            }
        },
        openPane : function(){
            var self=this;
            if(!self.state.open){
                self.resizePane();
                self.jqElement.treeSelectPane.show();
                self.jqElement.inputContainer.addClass("open");
                self.state.open=true;
            }
        },
        closePane : function(){
            var self=this;
            if(self.state.open){
                self.jqElement.treeSelectPane.hide();
                self.jqElement.inputContainer.removeClass("open");
                self.state.open=false;
            }
        },
        resizePane : function(){
            var self=this;
            var offset=self.jqElement.inputContainer.offset();
            self.jqElement.treeSelectPane.css({
                left : offset.left+"px",
                top : offset.top+self.option.inputHeight+4+"px"
            });
        },
        reLoad : function(){
            var self=this;
            if(self.option.url){
                self.showMask();
                var params=self.option.params,_params;
                if($.isFunction(params)){
                    _params=params.apply(self);
                }else{
                    _params=params || {};
                }
                $.ajax({
                    type : "post",
                    url : self.option.url,
                    data : _params,
                    async : self.option.async,
                    dataType : "json",
                    success : function(msg){
                        self.loadData(msg);
                        self.selectByType(self.option.value);
                        self.hideMask();
                    },
                    error : function(){
                        self.hideMask();
                    }
                });
            }
        },
        loadData : function(data) {
            var self = this,_rows;
            self.souceRows=[];
            self.ids=[];
            self.texts=[];
            self.values=[];
            self.grid.tree("loadData",[]);
            if(data===undefined){
                self.jqElement.noData.show();
                return;
            }
            if($.isArray(data)){
                _rows=data;
            }else{
                _rows=data.rows;
            }
            if(_rows===undefined || _rows.length===0){
                self.jqElement.noData.show();
                return;
            }
            self.jqElement.noData.hide();
            var rows=buildData(undefined,self.option.idField,self.option.textField,_rows);
            self.grid.tree("loadData",rows);
            self.jqElement.treeSelectPane.find(".tree-checkbox").on("click",function(event){
                event.stopPropagation();
                $(this).parents(".tree-node").click();
            });
            var options='';
            buildTree(rows,function(data){
                if(data.readonly===true){
                    $(self.grid.tree("find",data.id).target).addClass("_readonly").data("readonly",true).find(">.tree-checkbox").attr("class","tree-checkbox tree-checkbox3");
                }else if(!self.option.multiple && data.children!==undefined && data.children.length>0){
                    $(self.grid.tree("find",data.id).target).addClass("_disabled").data("disabled",true).find(">.tree-checkbox").hide();
                }
                options+='<option value="'+data.id+'" data-readonly="'+(data.readonly===true)+'">'+data.text+'</option>';
            });
            self.ele.empty().append(options);
            self.souceRows=rows;
            setTimeout(function(){
                self.option.onLoad.apply(self,[data]);
            },1);
        },
        contains : function(id){
            var self=this;
            var ids=self.ids;
            for(var i=0;i<ids.length;i++){
                if(ids[i]===id){
                    return true;
                }
            }
            return false;
        },
        select : function(id,eventState,childState,parentState){
            if(id===undefined){
                return;
            }
            childState=childState===undefined?true:childState;
            parentState=parentState===undefined?true:parentState;
            var self=this,data;
            if(typeof id==="object"){
                data=id;
                id=data.id;
            }else{
                data=self.grid.tree("find",id);
            }
            if(self.contains(id)){
                return;
            }
            var target=$(data.target);
            if(target.data("readonly") || target.data("disabled")){
                return;
            }
            if(!self.option.multiple){
                self.clear(false);
                self.closePane();
            }
            target.find(">.tree-checkbox").attr("class","tree-checkbox tree-checkbox1");
            self.ids.push(id);
            self.texts.push(data.text);
            self.values.push(data);
            if(self.option.multiple){
                var _parentId=data._parentId;
                if(parentState && _parentId!==undefined){
                    var parent=self.grid.tree("find",_parentId);
                    if(!parent.readonly){
                        var state=0,children=parent.children,child;
                        for(var i=0;i<children.length;i++){
                            child=children[i];
                            if(!self.contains(child.id) && !child.readonly){
                                state=1;
                                break;
                            }
                        }
                        if(state===0){
                            self.select(parent,false,false,true);
                        }else{
                            var _parent=parent;
                            while(_parent!==undefined){
                                $(_parent.target).find(">.tree-checkbox").attr("class","tree-checkbox tree-checkbox2");
                                if(_parent._parentId!==undefined){
                                    _parent=self.grid.tree("find",_parent._parentId);
                                }else{
                                    _parent=undefined;
                                }
                            }
                        }
                    }
                }
                if(childState){
                    self.selects(data.children,false,childState,false);
                }
            }
            self.ele.val(self.option.multiple?self.ids:(self.ids[0] || ""));
            self.jqElement.input.val(self.texts);
            if(eventState){
                self.option.onSelect.apply(self,[data]);
                self.option.onChange.apply(self);
                self.ele.triggerHandler("change");
            }
        },
        selects : function(ids,eventState,childState,parentState){
            if(ids!==undefined && $.isArray(ids)){
                var self=this,id;
                if(self.option.multiple){
                    for(var i=0;i<ids.length;i++){
                        id=ids[i];
                        if(typeof id==="object"){
                            if(id.id!==undefined){
                                id=id.id;
                            }else{
                                id=id[self.option.idField];
                            }
                        }
                        self.select(id,eventState,childState,parentState);
                    }
                }else{
                    self.select(ids[0],eventState,childState,parentState);
                }
            }
        },
        selectFirst : function(){
            var self=this;
            if(self.souceRows){
                if(self.option.multiple){
                    var row=self.souceRows[0];
                    if(row!==undefined){
                        self.select(row.id,true,true,true);
                    }
                }else{
                    self.selectFirstChild();
                }
            }
        },
        selectFirstChild : function(){
            var self=this;
            if(self.souceRows){
                buildTree(self.souceRows,function(data){
                    if(!data.readonly && (data.children===undefined || data.children.length===0)){
                        self.select(data.id,true,true,true);
                        return false;
                    }
                });
            }
        },
        selectAll : function(){
            this.selects(this.souceRows);
        },
        selectByType : function(value){
            if(value!==undefined){
                var self=this;
                if($.isArray(value)){
                    self.selects(value,true,true,true);
                }else if(value==="first"){
                    self.selectFirst();
                }else if(value==="firstChild"){
                    self.selectFirstChild();
                }else if(value==="all"){
                    if(self.option.multiple){
                        self.selectAll();
                    }else{
                        self.selectFirstChild();
                    }
                }else{
                    self.select(value,true,true,true);
                }
            }
        },
        unSelect : function(id,eventState,childState,parentState){
            if(id===undefined){
                return;
            }
            childState=childState===undefined?true:childState;
            parentState=parentState===undefined?true:parentState;
            if(typeof id==="object"){
                id=id.id;
            }
            var self=this,result;
            var values=self.values,value;
            self.ids=[];
            self.texts=[];
            self.values=[];
            for(var i=0;i<values.length;i++){
                value=values[i];
                if(value.id===id){
                    continue;
                }
                self.ids.push(value.id);
                self.texts.push(value.text);
                self.values.push(value);
            }
            result=self.grid.tree("find",id);
            $(result.target).find(">.tree-checkbox").attr("class","tree-checkbox tree-checkbox0");
            if(self.option.multiple){
                var _parentId=result._parentId;
                if(parentState && _parentId!==undefined){
                    var parent=self.grid.tree("find",_parentId);
                    if(!parent.readonly){
                        var state=0,children=parent.children,child;
                        for(var k=0;k<children.length;k++){
                            child=children[k];
                            if(!child.readonly && self.contains(child.id)){
                                state=1;
                                break;
                            }
                        }
                        self.unSelect(_parentId,false,false,true);
                        if(state===1) {
                            $(parent.target).find(">.tree-checkbox").attr("class","tree-checkbox tree-checkbox2");
                        }
                    }
                }
                if(childState){
                    self.unSelects(result.children,false,childState,false);
                }
            }
            self.ele.val(self.option.multiple?self.ids:(self.ids[0] || ""));
            self.jqElement.input.val(self.texts);
            if(eventState){
                self.option.onUnSelect.apply(self,[result]);
                self.option.onChange.apply(self);
                self.ele.triggerHandler("change");
            }
        },
        unSelects : function(ids,eventState,childrenState,parentState){
            if(ids!==undefined && $.isArray(ids)){
                var self=this,id;
                for(var i=0;i<ids.length;i++){
                    id=ids[i];
                    if(typeof id==="object"){
                        if(id.id!==undefined){
                            id=id.id;
                        }else{
                            id=id[self.option.idField];
                        }
                    }
                    self.unSelect(id,eventState,childrenState,parentState);
                }
            }
        },
        clear : function(eventState){
            eventState=eventState===undefined?true:eventState;
            var self=this;
            var values=self.values;
            for(var i=0;i<values.length;i++){
                $(values[i].target).find(">.tree-checkbox").removeClass("tree-checkbox1").addClass("tree-checkbox0");
            }
            self.ids=[];
            self.texts=[];
            self.values=[];
            self.jqElement.input.val("");
            if(eventState){
                self.option.onChange.apply(self);
                self.ele.triggerHandler("change");
            }
        },
        getId : function(){
            return this.ids[0] || "";
        },
        getIds : function(defaultAll,needParent){
            var self=this,ids;
            if(defaultAll && self.ids.length===0){
                ids=[];
                var children;
                buildTree(self.souceRows,function(data){
                    children=data.children;
                    if(children!==undefined && children.length>0){
                        if(needParent && !data.readonly){
                            ids.push(data.id);
                        }
                    }else{
                        if(!data.readonly){
                            ids.push(data.id);
                        }
                    }
                });
            }else{
                ids=self.ids;
            }
            return ids;
        },
        getText : function(separator){
            return this.texts.join(separator || ",");
        },
        getValue : function(){
            return this.values[0] || undefined;
        },
        getValues : function(defaultAll,needParent){
            var self=this,values;
            if(defaultAll && self.values.length===0){
                values=[];
                var children;
                buildTree(self.souceRows,function(data){
                    children=data.children;
                    if(children!==undefined && children.length>0){
                        if(needParent && !data.readonly){
                            values.push(data);
                        }
                    }else{
                        if(!data.readonly){
                            values.push(data);
                        }
                    }
                });
            }else{
                values=self.values;
            }
            return values;
        },
        getData : function(){
            return this.souceRows;
        },
        showMask : function(){
            var self=this;
            self.scInstance.play();
            self.jqElement.mask.show();
        },
        hideMask : function(){
            var self=this;
            self.scInstance.stop();
            self.jqElement.mask.hide();
        },
        defaultOption : {//所有参数都在这 不可选取项在数据源上加参数 readonly=true 或者在option元素上加 data-readonly="true"
            type : "input",//input pane
            inputHeight : 29,
            paneHeight : 200,//可以写 auto 表示自适应不出现滚动条
            idField : "id",
            textField : "text",
            multiple : false,
            initLoadState : true,//装载完后是否请求url
            paneTitle : "项目部",
            data : undefined,//该参数不为空时，加载完成后将不发启url请求，reLoad方法不使用此参数。参数为空时加载开始会将option元素对应的值封装成此参数（无法封装成 tree 集合）
            url : "",
            async : true,//请求 异/同 步
            value : undefined, //配置url参数后有效，手动加载无效 值类型：单个id值 id值数组 固定字符串类型（“first”，“firstChild”，“all”）,手动加载可使用对应接口来达到相应效果
            placeholder : "",
            params : { //url参数 object || function

            },
            onInit : function(){

            },
            onLoad : function(data){

            },
            onSelect : function(data){

            },
            onUnSelect : function(data){

            },
            onChange : function(){

            }
        }
    };

    function buildData(parentId,idField,textField,data){
        if(data===undefined || data.length===0){
            return;
        }
        var children,rows=[],row;
        for(var i=0;i<data.length;i++){
            row=data[i];
            if(parentId!==undefined){
                row._parentId=parentId;
            }
            row.id=row[idField];
            row.text=row[textField];
            children=buildData(row.id,idField,textField,row.children);
            if(children!==undefined){
                row.children=children;
            }
            rows.push(row);
        }
        return rows;
    }

    function buildTree(data,handle){
        var children,row,result;
        for(var i=0;i<data.length;i++){
            row=data[i];
            result=handle(row);
            if(result===false){
                return false;
            }
            children=row.children;
            if(children===undefined || children.length===0){
                continue;
            }
            result=buildTree(children,handle);
            if(result===false){
                return false;
            }
        }
    }

    $.fn.extend({
        treeSelect : function(){
            if(this[0].tagName==="SELECT"){
                var temp=arguments[0];
                var instance=this.data("treeSelectInstance");
                if(typeof temp==='string'){
                    if(instance!==undefined){
                        var fun=instance[temp];
                        if($.isFunction(fun)){
                            var params=Arrays.clone(arguments);
                            params.shift();
                            var result=fun.apply(instance,params);
                            if(result!==undefined){
                                return result;
                            }
                            return this;
                        }
                    }
                }else if(temp===undefined || typeof temp==='object'){
                    if(instance===undefined){
                        var rows=[],option;
                        this.find(">option").each(function(){
                            option=$(this);
                            rows.push({
                                id : option.attr("value"),
                                text : option.text(),
                                readonly : option.data("readonly")==="true"
                            });
                        });
                        if(temp===undefined){
                            temp={};
                        }
                        if(!temp.data){
                            temp.data=rows;
                        }
                        instance=new Select(this,temp);
                        this.data("treeSelectInstance",instance);
                    }
                    return instance;
                }
            }
        }
    });
}(jQuery,Sonic,window,undefined);