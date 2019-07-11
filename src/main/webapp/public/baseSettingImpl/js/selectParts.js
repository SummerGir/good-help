
!function($,window,undefined){
    var jqTemplate={
        container : undefined,
        selectGridModal : {
            singleSelect: true,
            width: "100%",
            scrollbarSize: 0,
            loadMsg : "加载中，请稍等...",
            autoRowHeight: true,
            showFooter: false,
            fitColumns: true,
            height : "500px",
            columns : [
                [
                    {field:"name",title:"",width : '100%',readonly:true,align : "left",formatter: function (value, row, index) {
                        return '<div style="margin-right : 20px;">' +
                            '<div style="font-weight: bolder;">'+value+'</div>'+
                            '<div style="color: #acacac;" class="textOverPoints">'+row.text+'&nbsp;</div>'+
                            '</div>';
                    }}
                ]
            ]
        },
        rowGridModal : {
            singleSelect: true,
            width: "100%",
            scrollbarSize: 0,
            loadMsg : "加载中，请稍等...",
            autoRowHeight: false,
            showFooter: false,
            fitColumns: true,
            height : "500px",
            rowStyler : function(index,row){
                if (row.mainId===undefined){
                    return 'background-color:#f0f0f0';
                }
            }
        }
    };
    $.ajax({
        type : "post",
        url : "/public/baseSettingImpl/partsTemplate.jsp",
        async : false,
        dataType : "html",
        success : function(msg){
            jqTemplate.container=$(msg);
        }
    });

    function arrContains(arr,item){
        if(!arr){
            return false;
        }
        for(var i=0;i<arr.length;i++){
            if(arr[i].equalsIgnoreCase(item)){
                return true;
            }
        }
        return false;
    }

    var selectParts=function(parameter){
        var self=this;
        self.parameter=$.extend(true,{},self.defaultParameter,(parameter || {}));
        self.jqElement={
            container : jqTemplate.container.clone()
        };
        self.cache={};
        self.XHR1=undefined;
        self.XHR2=undefined;
        self.saveing=false;
        self.editIndex=undefined;
        self.beforeSelectId=undefined;
        self.jqElement.partContainer=self.jqElement.container.find(".partContainer");
        self.jqElement.select=self.jqElement.partContainer.find("select");
        self.jqElement.selectGrid=$('<div></div>').appendTo(self.jqElement.partContainer.find(".selectGrid")).datagrid($.extend(true,{},jqTemplate.selectGridModal,{onSelect : function(rowIndex, rowData){
            if(self.endRowEdit(false)) {
                if(self.beforeSelectId!==undefined){
                    self.putCache(self.beforeSelectId);
                }
                self.putRows(rowData.id);
            }
        }}));
        self.jqElement.rowGrid=$('<div></div>').appendTo(self.jqElement.partContainer.find(".rowGrid")).datagrid(jqTemplate.rowGridModal);
        self.init();
    };

    selectParts.prototype={
        init : function(){
            var self=this;
            self.jqElement.container.find(".closeParts").on("click",function(){
                self.jqElement.container.modal("hide");
                self.parameter.callback(false);
            });
            self.jqElement.container.find(".confirmParts").on("click",function(){
                self.saveing=true;
                if(self.endRowEdit(false)){
                    self.putCache();
                    self.submit();
                }
            });
            if($.isArray(self.parameter.appId)){
                if(self.parameter.appId.length>0){
                    var item;
                    var option=self.jqElement.select.find("option");
                    self.jqElement.select.empty();
                    $.each(option,function(){
                        item=$(this);
                        if(arrContains(self.parameter.appId,item.val())){
                            self.jqElement.select.append(item);
                        }
                    });
                }
            }else{
                if(self.parameter.appId){
                    var appIds=self.parameter.appId.split(";");
                    option=self.jqElement.select.find("option");
                    self.jqElement.select.empty();
                    $.each(option,function(){
                        item=$(this);
                        if(arrContains(appIds,item.val())){
                            self.jqElement.select.append(item);
                        }
                    });
                }else{
                    if($.isArray(self.parameter.kindStr)){
                        if(self.parameter.kindStr.length>0){
                            option=self.jqElement.select.find("option");
                            self.jqElement.select.empty();
                            $.each(option,function(){
                                item=$(this);
                                if(arrContains(self.parameter.kindStr,item.data("en"))){
                                    self.jqElement.select.append(item);
                                }
                            });
                        }
                    }else{
                        if(self.parameter.kindStr){
                            var kindStrs=self.parameter.kindStr.split(";");
                            option=self.jqElement.select.find("option");
                            self.jqElement.select.empty();
                            $.each(option,function(){
                                item=$(this);
                                if(arrContains(kindStrs,item.data("en"))){
                                    self.jqElement.select.append(item);
                                }
                            });
                        }
                    }
                }
            }
            self.jqElement.select.on("change",function(){
                self.putSelectItems();
            }).change();
            self.jqElement.container.on("shown.bs.modal",function(){
                self.jqElement.selectGrid.datagrid("resize");
                self.jqElement.rowGrid.datagrid("resize");
            });
            self.jqElement.container.modal();
        },
        putSelectItems : function(appId){
            var self=this;
            if(self.XHR1!==undefined){
                self.XHR1.abort();
                self.jqElement.selectGrid.datagrid("loaded");
            }
            appId=appId || self.jqElement.select.val();
            if(!appId){
                self.XHR1=undefined;
                self.jqElement.selectGrid.datagrid("loadData",[]);
                self.jqElement.rowGrid.datagrid("loadData",[]);
                return;
            }
            self.updateRowGrid(appId);
            self.jqElement.selectGrid.datagrid("loading");
            self.XHR1=$.ajax({
                type : "post",
                url : "/public/baseSet/impl/parts/getSelectItems.do",
                data : {
                    appId : appId,
                    projectId : self.parameter.projectId
                },
                dataType : "json",
                success : function(msg){
                    self.jqElement.selectGrid.datagrid("loadData",msg);
                    self.jqElement.selectGrid.datagrid("loaded");
                    if(msg.rows.length>0){
                        if(self.beforeSelectId){
                            var rows=msg.rows;
                            for(var i=0;i<rows.length;i++){
                                if(self.beforeSelectId===rows[i].id){
                                    self.jqElement.selectGrid.datagrid("selectRow",i);
                                    return;
                                }
                            }
                            self.jqElement.selectGrid.datagrid("selectRow",0);
                        }else{
                            self.jqElement.selectGrid.datagrid("selectRow",0);
                        }
                    }
                }
            });
        },
        updateRowGrid : function(appId){
            var self=this;
            self.editIndex=undefined;
            var extendModal;
            var pickMember={
                type : "pickMember",
                options : {
                    height : 37,
                    idField : "buildId",
                    textField : "buildName",
                    explaField : "detailName",
                    searchLength : 0,
                    itemStyle : "padding : 0",
                    menuDisplay : "auto",
                    placeholder : "",
                    urls : {
                        list : {
                            url : "/public/baseSet/impl/parts/getProjectBuild.do",
                            extendParam : {
                                projectId : self.parameter.projectId
                            }
                        },
                        item : {
                            url : "/public/baseSet/impl/parts/getProjectBuild.do"
                        }
                    },
                    onDestroy : function(values){
                        var hasEdit=self.editIndex!==undefined;
                        if(hasEdit){
                            self.editIndex=undefined;
                        }
                        var value=values[0];
                        if(value){
                            var detailName=value.detailName || "";
                            var rows=self.jqElement.rowGrid.datagrid("getRows");
                            if(rows[self.beforeEditIndex].mainId){
                                self.jqElement.rowGrid.datagrid("updateRow",{
                                    index : self.beforeEditIndex,
                                    row : {
                                        buildName : value.buildName,
                                        detailName : detailName
                                    }
                                });
                            }else{
                                for(var i=self.beforeEditIndex+1;i<rows.length;i++){
                                    if(rows[i].mainId===undefined){
                                        break;
                                    }
                                    self.jqElement.rowGrid.datagrid("updateRow",{
                                        index : i,
                                        row : {
                                            buildId : value.buildId,
                                            buildName : value.buildName,
                                            detailName : detailName
                                        }
                                    });
                                }
                            }
                        }
                        if(hasEdit){
                            self.putCache(self.beforeSelectId);
                            if(self.saveing){
                                self.submit();
                            }else{
                                self.putRows();
                            }
                        }
                    }
                }
            };
            if(appId==="0ee87799-479d-49df-a0e5-070ffda3ebb5"){//材料
                extendModal={columns : [
                    [
                        {field:"indexNum",title:"序号",width : '5%',readonly:true,align : "left"},
                        {field:"dicName",title:"材料名称",width : '15%',readonly:true,align : "left",formatter: function (value, row, index) {
                            return '<div class="textOverPoints">'+value+'</div>';
                        }},
                        {field:"dicDes",title:"规格型号",width : '15%',readonly:true,align : "left",formatter: function (value, row, index) {
                            return '<div class="textOverPoints">'+value+'</div>';
                        }},
                        {field:"unitName",title:"计量单位",width : '10%',readonly:true,align : "center"},
                        {field:"num",title:"数量",width : '10%',readonly:true,align : "right"},
                        {field:"price",title:"单价",width : '10%',readonly:true,align : "right"},
                        {field:"money",title:"金额",width : '10%',readonly:true,align : "right"},
                        {field:"buildId",title:"施工部位",width : '15%',align : "left",editor : pickMember,formatter: function (value, row, index) {
                            if(value){
                                if(row.detailName){
                                    return row.buildName+"（"+row.detailName+"）";
                                }else{
                                    return row.buildName;
                                }
                            }
                        }},
                        {field:"url",title:"查看单据",width : '10%',readonly:true,align : "center",formatter: function (value, row, index) {
                            if(value){
                                return '<a href="javascript:void(0)" onclick="javascript:window.open(\''+value+'\')">点击追溯</a>';
                            }
                        }}
                    ]
                ]};
            }else if(appId==="1d7ad560-98e8-4a8e-80b0-03f57b85101c"){//劳务
                extendModal={columns : [
                    [
                        {field:"indexNum",title:"序号",width : '5%',readonly:true,align : "left"},
                        {field:"dicName",title:"字典名称",width : '15%',readonly:true,align : "left",formatter: function (value, row, index) {
                            return '<div class="textOverPoints">'+value+'</div>';
                        }},
                        {field:"dicDes",title:"工作内容",width : '15%',readonly:true,align : "left",formatter: function (value, row, index) {
                            return '<div class="textOverPoints">'+value+'</div>';
                        }},
                        {field:"unitName",title:"计量单位",width : '10%',readonly:true,align : "center"},
                        {field:"num",title:"数量",width : '10%',readonly:true,align : "right"},
                        {field:"price",title:"单价",width : '10%',readonly:true,align : "right"},
                        {field:"money",title:"金额",width : '10%',readonly:true,align : "right"},
                        {field:"buildId",title:"施工部位",width : '15%',align : "left",editor : pickMember,formatter: function (value, row, index) {
                            if(value){
                                if(row.detailName){
                                    return row.buildName+"（"+row.detailName+"）";
                                }else{
                                    return row.buildName;
                                }
                            }
                        }},
                        {field:"url",title:"查看单据",width : '10%',readonly:true,align : "center",formatter: function (value, row, index) {
                            if(value){
                                return '<a href="javascript:void(0)" onclick="javascript:window.open(\''+value+'\')">点击追溯</a>';
                            }
                        }}
                    ]
                ]};
            }else if(appId==="28b50401-1ba2-4b68-bbbd-a5e545d1982b"){//租赁

            }else if(appId==="38a5a14d-11f6-4294-ad24-b7350a8acca5"){//机械

            }else{//间接费

            }
            extendModal.onDblClickCell=function(rowIndex, field, value){
                if(field==="buildId"){
                    self.editIndex=rowIndex;
                    self.jqElement.rowGrid.datagrid("beginEdit",rowIndex);
                }
            };
            extendModal.onClickCell=function(){
                self.endRowEdit(true);
            };
            self.jqElement.rowGrid.datagrid(extendModal);
        },
        endRowEdit : function(state){
            var self=this;
            if(self.editIndex!==undefined){
                var tempId=self.editIndex;
                if(state){
                    self.editIndex=undefined;
                }
                self.beforeEditIndex=tempId;
                self.jqElement.rowGrid.datagrid("endEdit",tempId);
                return false;
            }else{
                return true;
            }
        },
        putRows : function(id,appId){
            var self=this;
            if(self.XHR2!==undefined){
                self.XHR2.abort();
                self.jqElement.rowGrid.datagrid("loaded");
            }
            if(!id){
                var rowData=self.jqElement.selectGrid.datagrid("getSelected");
                if(rowData===null){
                    self.XHR2=undefined;
                    self.jqElement.rowGrid.datagrid("loadData",[]);
                    return;
                }
                id=rowData.id;
            }
            self.beforeSelectId=id;
            appId=appId || self.jqElement.select.val();
            self.jqElement.rowGrid.datagrid("loading");
            self.XHR2=$.ajax({
                type : "post",
                url : "/public/baseSet/impl/parts/getSelectRows.do",
                data : {
                    id : id,
                    appId : appId,
                    projectId : self.parameter.projectId
                },
                dataType : "json",
                success : function(msg){
                    if(self.cache[appId]!==undefined && self.cache[appId][id]!==undefined){
                        var rows=$.isArray(msg)?msg:msg.rows;
                        if(rows && rows.length>0){
                            var finalRows=[];
                            var cache=self.cache[appId][id];
                            var detailId,build,item;
                            for(var i=0;i<rows.length;i++){
                                item=rows[i];
                                detailId=item.detailId;
                                if(detailId!==undefined){
                                    build=cache[item.detailType];
                                    if(build){
                                        build=build[detailId];
                                        if(build){
                                            item.buildId=build.buildId;
                                            item.buildName=build.buildName;
                                            item.detailName=build.detailName;
                                        }
                                    }
                                }
                                finalRows.push(item);
                            }
                        }
                        msg={rows : finalRows};
                    }
                    self.jqElement.rowGrid.datagrid("loadData",msg);
                    self.jqElement.rowGrid.datagrid("loaded");
                }
            });
        },
        putCache : function(id){
            var self=this;
            id=id || self.beforeSelectId;
            var rows=self.jqElement.rowGrid.datagrid("getRows");
            var detailType,buildId,item,detailId,detailData={};
            for(var i=0;i<rows.length;i++){
                item=rows[i];
                detailId=item.detailId;
                if(detailId!==undefined){
                    detailType=item.detailType;
                    buildId=item.buildId;
                    if(buildId){
                        if(detailData[detailType]===undefined){
                            detailData[detailType]={};
                        }
                        detailData[detailType][detailId]={buildId : buildId,buildName : item.buildName,detailName : item.detailName};
                    }
                }
            }
            if(!$.isEmptyObject(detailData)){
                var appId=self.jqElement.select.val();
                if(self.cache[appId]===undefined){
                    self.cache[appId]={};
                }
                self.cache[appId][id]=detailData;
            }
        },
        clearCache : function(){
            this.cache={};
        },
        submit : function(){
            var self=this;
            self.saveing=false;
            if(!$.isEmptyObject(self.cache)){
                // $.message.loader.open();
                var cache=self.cache;
                var node,typeData,detailData;
                var params=[],param,details;
                for(var appId in cache){
                    param={appId : appId,detailTypes : []};
                    node=cache[appId];
                    for(var id in node){
                        typeData=node[id];
                        for(var detailType in typeData){
                            detailData=typeData[detailType];
                            details=[];
                            for(var detailId in detailData){
                                details.push({detailId : detailId,buildId : detailData[detailId].buildId});
                            }
                            param.detailTypes.push({detailType : detailType,details : details});
                        }
                    }
                    params.push(param);
                }
                var appIds=[];
                appId=self.jqElement.select.val();
                var options=self.jqElement.select.find("option");
                $.each(options,function(){
                    appIds.push($(this).val());
                });
                $.ajax({
                    type : "post",
                    url : "/public/baseSet/impl/parts/saveProjectParts.do",
                    data : JSON.stringify({params : params,appIds : appIds,projectId : self.parameter.projectId}),
                    dataType : "json",
                    contentType : 'application/json;charset=utf-8',
                    success : function(msg){
                        $.message.loader.close();
                        if(msg.errorCode===0){
                            $.message("保存成功");
                            var tempId,optionsIndexs=[];
                            for(var i=0;i<appIds.length;i++){
                                tempId=appIds[i];
                                if(!msg[tempId]){
                                    optionsIndexs.push(i);
                                }
                            }
                            if(optionsIndexs.length===appIds.length){
                                self.jqElement.container.modal("hide");
                                self.parameter.callback(true);
                            }else{
                                self.clearCache();
                                for(i=0;i<optionsIndexs.length;i++){
                                    options.eq(optionsIndexs[i]).remove();
                                }
                                options=self.jqElement.select.find("option");
                                var lastVal,option;
                                $.each(options,function(i,o){
                                    option=$(this);
                                    if(i===0){
                                        lastVal=option.val();
                                    }
                                    if(appId===option.val()){
                                        lastVal=appId;
                                        return false;
                                    }
                                    appIds.push();
                                });
                                self.jqElement.select.val(lastVal);
                                self.jqElement.select.change();
                            }
                        }else{
                            $.message("保存失败");
                        }
                    }
                });
            }else{
                $.message("无修改项");
            }
        },
        defaultParameter : {
            callback : function(state){

            }
        }
    };

    $.extend({
        selectParts : function(parameter){
            new selectParts(parameter);
        }
    });

    if($.pickMem===undefined){
        EIIS.Common.loadJavaScript("/public/controls/selector/pickMember/pickMember.js");
        EIIS.Common.loadCss("/public/controls/selector/pickMember/pickMember.css");
    }
}(jQuery,window,undefined);