!function($,datagrid,window,undefined){
    var jQTemplate=$('<div class="modal fade in businessView" tabindex="-1" role="dialog" aria-hidden="false" data-backdrop="static" data-width="90%" data-height="450px">' +
                        '<div class="modal-header" style="cursor: auto;">' +
                            '<h4 class="modal-title" style="display: inline">字典选择器</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<div class="bodyWrapper">' +
                                '<div class="pickMember">' +
                                    '<input type="text" placeholder="输入拼音"/>'+
                                '</div>'+
                                '<div class="selectAll">' +
                                    '<button type="button" class="eiis-button btn-primary">' +
                                        '选择全部有效行' +
                                    '</button>' +
                                '</div>'+
                                '<div class="dataGrid">' +
                                    '<div></div>'+
                                '</div>'+
                                '<div class="paging">' +
                                    '<div style="background:#f4f4f4;border:1px solid #ccc;width: 100%;margin: 0;border-radius:0;"></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="eiis-button btn-default" data-dismiss="modal">' +
                                '<i class="fa fa-times"></i> 取消' +
                            '</button>' +
                            '<button type="button" class="eiis-button btn-info">' +
                                '<i class="fa fa-check"></i> 确认' +
                            '</button>' +
                        '</div>' +
                    '</div>');

    var BusinessView=function(option){
        var self=this;
        self.option=$.extend(true,{},self.defaultOption,option);
        self.jqElement={
            container : jQTemplate.clone()
        };
        self.activePageData=[];
        if ($.fn.pagination){
            $.fn.pagination.defaults.beforePageText = '第';
            $.fn.pagination.defaults.afterPageText = '共{pages}页';
            $.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}记录';
        }
        if ($.fn.datagrid){
            $.fn.datagrid.defaults.loadMsg = '加载中，请稍等...';
        }
        self.refreshState=true;
        self.jqElement.pickMember=self.jqElement.container.find(".pickMember>input").pickMem({
            height : 31,
            multiple : true,
            idField : self.option.idField,
            textField : self.option.textField,
            onUnSelect : function(data){
                if(data!==undefined){
                    var id=data[self.option.idField];
                    for(var i=0;i<self.activePageData.length;i++){
                        if(id===self.activePageData[i][self.option.idField]){
                            self.jqElement.dataGrid.datagrid("unselectRow",i);
                            break;
                        }
                    }
                }
            },
            onInput : function(value){
                self.refreshState=true;
                self.extendOption.searchKey=value;
                self.jqElement.paging.pagination("select",1);
            }
        });
        var columns=self.option.columns
            ,column,_columns=[{field:"checkState",title:"",width : "2%",align : "center",checkbox:true}]
            ,index,maxWidth=0,width;
        for(var i=0;i<columns.length;i++){
            column=columns[i];
            width=column.width;
            if(width){
                width=Number(width.match(/\d+\.\d+|\d+/g)[0]);
            }
            if(maxWidth<width){
                maxWidth=width;
                index=i;
            }
            _columns.push(column);
        }
        _columns[index+1].width=(maxWidth-2)+"%";
        self.jqElement.dataGrid=self.jqElement.container.find(".dataGrid>div").datagrid({
            height : "100%",
            width: '100%',
            singleSelect: false,
            scrollbarSize: 10,
            loadMsg : "加载中，请稍等...",
            columns:[_columns],
            onLoadSuccess : function(data){
                if($.isArray(data)){
                    self.activePageData=data;
                }else{
                    self.activePageData=data.rows;
                }
                var ids=self.jqElement.pickMember.getIds()
                    ,checkbox,id,i,c,len=ids.length;
                for(i=0;i<self.activePageData.length;i++){
                    data=self.activePageData[i];
                    id=data[self.option.idField];
                    for(c=0;c<len;c++){
                        if(id===ids[c]){
                            self.jqElement.dataGrid.datagrid("selectRow",i);
                            break;
                        }
                    }
                    if(data.readonly===true || data.readonly===0){
                        checkbox=self.jqElement.container.find(".datagrid-row[datagrid-row-index=" + i + "] input[type='checkbox']");
                        checkbox.hide();
                        checkbox.parents("tr").css("background-color","#e2e2e2").css("color","#a1a1a1");
                        checkbox.after('<i class="esg-font icon-jujue"></i>');
                    }
                }
            },
            onSelect : function(rowIndex, rowData){
                if(rowData.readonly!==true && rowData.readonly!==0){
                    self.jqElement.pickMember.setValue(rowData);
                }
            },
            onUnselect : function(rowIndex, rowData){
                self.jqElement.pickMember.unSelect(rowData[self.option.idField]);
            },
            onSelectAll : function(rows){
                var row;
                for(var i=0;i<rows.length;i++){
                    row=rows[i];
                    if(row.readonly!==true && row.readonly!==0){
                        self.jqElement.pickMember.setValue(row);
                    }
                }
            },
            onUnselectAll : function(rows){
                for(var i=0;i<rows.length;i++){
                    self.jqElement.pickMember.unSelect(rows[i][self.option.idField]);
                }
            }
        });
        self.extendOption={
            page : 1,
            rows : 20
        };
        self.XHR=undefined;
        self.eventState=true;
        self.jqElement.paging=self.jqElement.container.find(".paging>div").pagination({
            pageSize:20,
            pageNumber:1,
            onSelectPage : function(pageNumber, pageSize){
                if(self.eventState){
                    self.extendOption.page=pageNumber;
                    self.extendOption.rows=pageSize;
                    self.setData();
                }
            },
            onChangePageSize : function(){
                self.eventState=false;
                self.jqElement.paging.pagination("select",1);
                self.eventState=true;
            }
        });
        self.init();
    };

    BusinessView.prototype={
        init : function(){
            var self=this;
            self.setData();
            if(self.option.selectAll){
                self.jqElement.container.find(".pickMember").css("padding-right","140px");
                var clickAllState=true;
                self.jqElement.container.find(".selectAll").show().on("click",function(){
                    if(clickAllState){
                        clickAllState=false;
                        var listParams=self.option.request.list.params;
                        if($.isFunction(listParams)){
                            listParams=listParams();
                        }else if(listParams===undefined){
                            listParams={};
                        }
                        $.extend(true,listParams,self.extendOption);
                        listParams.page=1;
                        listParams.rows=-1;
                        self.jqElement.dataGrid.datagrid("loading");
                        $.ajax({
                            type : "post",
                            url : self.option.request.list.url,
                            data : listParams,
                            dataType : "json",
                            success : function(msg){
                                var rows,row,c;
                                if($.isArray(msg)){
                                    rows=msg;
                                }else{
                                    rows=msg.rows;
                                }
                                for(var i=0;i<rows.length;i++){
                                    row=rows[i];
                                    if(row.readonly!==true && row.readonly!==0){
                                        for(c=0;c<self.activePageData.length;c++){
                                            if(row[self.option.idField]===self.activePageData[c][self.option.idField]){
                                                self.jqElement.dataGrid.datagrid("selectRow",c);
                                                break;
                                            }
                                        }
                                        self.jqElement.pickMember.setValue(row);
                                    }
                                }
                                clickAllState=true;
                                self.jqElement.dataGrid.datagrid("loaded");
                            }
                        });
                    }
                });
            }
            var clickState=true;
            self.jqElement.container.find(".modal-footer .btn-info").on("click",function(){
                if(clickState){
                    clickState=false;
                    self.option.callback(self.jqElement.pickMember.getValues());
                    self.jqElement.container.modal("hide");
                }
            });
            self.jqElement.container.modal();
            self.option.onInit();
        },
        setData : function(){
            var self=this;
            if(self.XHR!==undefined){
                self.XHR.abort();
            }
            var listParams=self.option.request.list.params;
            if($.isFunction(listParams)){
                listParams=listParams();
            }else if(listParams===undefined){
                listParams={};
            }
            $.extend(true,listParams,self.extendOption);
            self.jqElement.dataGrid.datagrid("loading");
            self.XHR=$.ajax({
                type : "post",
                url : self.option.request.list.url,
                data : listParams,
                dataType : "json",
                success : function(msg){
                    self.XHR=undefined;
                    var total=msg.total;
                    if(total===undefined || total===null || total==="null") {
                        if(self.refreshState && self.option.request.count.url){
                            var countParams=self.option.request.count.params;
                            if($.isFunction(countParams)){
                                countParams=countParams();
                            }else if(countParams===undefined){
                                countParams={};
                            }
                            $.extend(true,countParams,self.extendOption);
                            self.jqElement.paging.pagination("loading");
                            $.ajax({
                                type : "post",
                                url : self.option.request.count.url,
                                data : countParams,
                                dataType : "json",
                                success : function(count){
                                    self.jqElement.paging.pagination("refresh",{
                                        total : count[0]
                                    });
                                    self.jqElement.paging.pagination("loaded");
                                    self.jqElement.dataGrid.datagrid("loadData",msg);
                                    self.jqElement.dataGrid.datagrid("loaded");
                                }
                            });
                            self.refreshState=false;
                        }
                    }else{
                        if(typeof total==="number"){
                            if(total<0){
                                total=0;
                            }
                            total=parseInt(total);
                        }else if(typeof total==="string"){
                            total=Number(total);
                            if(isNaN(total)){
                                total=0;
                            }
                        }else{
                            total=0;
                        }
                    }
                    self.jqElement.paging.pagination("refresh",{
                        total : total
                    });
                    self.jqElement.dataGrid.datagrid("loadData",msg);
                    self.jqElement.dataGrid.datagrid("loaded");
                }
            });
        },
        defaultOption : {
            url : "",
            idField:"",
            textField:"",
            selectAll:false,
            columns : [],
            onInit : function(){

            },
            callback : function(){

            }
        }
    };

    $.extend({
        selector : {
            businessView : function(option){
                new BusinessView(option);
            }
        }
    });
}(jQuery,$.fn.datagrid,window,undefined);