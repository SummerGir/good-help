!function($){
    var template=$('<div class="modal" tabindex="-1" aria-hidden="true" data-width="80%" data-backdrop="static">'+
        '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
        '<h4 class="modal-title" style="display: inline">商品信息 </h4>'+
        '</div>'+
        '<div class="panel-body form-horizontal" style="padding: 0;">'+
        '<style>.form-horizontal>div{margin: 0}</style>'+
        '<div class="gridContainer" style="height: 400px"></div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="eiis-button btn-default" data-dismiss="modal">'+
        '<i class="fa fa-times"></i> 关闭'+
        '</button>'+
        '</div>'+
        '</div>'+
        '</div>'),
    option={
        singleSelect : true,
        height : 400,
        width : "100%",
        scrollbarSize : 0,
        columns : [
            [
                {field: "indexNum", title: '序号', width: "5%", align:'left',formatter: function (value, row, index) {
                    return index+1;
                }},
                {field: "goodsName", title: '名称', width: "25%", align:'left'},
                {field: "attrValOne", title: '规格型号', width: "24%", align:'left',formatter: function (value, row, index) {
                    if(value){
                        if(row.attrValTwo){
                            return value+"（"+row.attrValTwo+"）";
                        }else{
                            return value;
                        }
                    }else{
                        if(row.attrValTwo){
                            return row.attrValTwo;
                        }
                    }
                }},
                {field: "brandName", title: '品牌', width: "12%", align:'left'},
                {field: "goodsUnit", title: '单位', width: "12%", align:'center'},
                {field: "noTicketPrice", title: '单价', width: "10%", align:'right'},
                {field: "url", title: '平台商城', width: "12%", align:'center',formatter: function (value, row, index) {
                    return '<a href="javascript:void(0)" onclick="javascript:window.open(\'https://cpy365.com/Jump/jumpGoodsInfo?priceId='+row.priceId+'\')">查看商品</a>';
                }}
            ]
        ]
    };

    var cpyView=function(dicName,dicDes){
        var self=this;
        $.message.loader.open();
        $.cpyData(dicName,dicDes,function(msg){
            $.message.loader.close();
            if(msg.items && msg.items.length>0){
                self.jqElement={
                    container : template.clone()
                };
                self.data=msg.items;
                self.init();
            }
        });
    };

    cpyView.prototype={
        init : function(){
            var self=this;
            self.jqElement.container.modal().find(".gridContainer").datagrid(option).datagrid("loadData",self.data).datagrid("resize");
        }
    };

    $.extend({
        cpyView : function(data){
            new cpyView(data);
        },
        cpyData : function(dicName,dicDes,callback){
            var param;
            if(typeof dicName==="string"){
                param={
                    dicName : dicName,
                    dicDes : dicDes
                }
            }else{
                param=dicName;
                callback=param.callback;
                delete param.callback;
            }
            $.ajax({
                type : "post",
                url : "/public/baseSet/impl/cpyPrice/getCPYPriceByDicName.do",
                data : param,
                dataType : "json",
                success : function(msg){
                    if(typeof callback==="function"){
                        callback(msg);
                    }
                }
            });
        }
    });
}(jQuery);