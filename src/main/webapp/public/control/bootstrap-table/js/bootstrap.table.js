/**
 * Created by xiucai on 2017/10/30.
 */
//定义一个匿名函数
(function ($,undefined){
    if($.ghTable == undefined){
        $.ghTable = {};
    }
    $.ghTable.list = function(options){
        //默认表格控件参数
        var defaultOpt = {
            id:"",//需要绑定的Id或class
            url:"",//表格请求的路径
            type:"post",//请求方式
            data:"",//请求的参数
            dataType:"json",//请求的返回格式
            toolbar:"",//表格上面的工具栏用哪个容器
            isPage:true,//是否分页
            page:1,//加载数据的初始页
            rows:10,//每页默认条数
            columns:[]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
        };
        //覆盖默认参数
        if(options != null && options != undefined){
            for(var opt in options){
                defaultOpt[opt] = options;
            }
        }
        //定义表格对象
        var myDiv = $(defaultOpt.id);
        $.ajax({
            url: "/public/control/bootstrap-table/templet.jsp",
            data: {toolbar:defaultOpt.toolbar,isPage:defaultOpt.isPage,rows: defaultOpt.rows,columns:defaultOpt.columns},
            async: false,
            cache: false,
            dataType: "html",
            success: function (data, textStatus, jqXHR) {
                myDiv.append(data);
            }
        });
        //创建表格样式：斑马条纹、全边框、鼠标悬停特效、紧凑
        myDiv.addClass("panel panel-default");
        var myHead = $("<div/>").addClass("panel-heading").append('<div class="row"><div class="col-xs-6 table-panel-caption"></div><div class="col-xs-6"><div class="pull-right table-panel-ribbon"></div></div></div>');
        //工具栏
        var mytoolbar = '' +
            '<div class="row table-toolbar">' +
                '<div class="col-xs-12" style="padding: 0px 5px;">' +
                    '<div class="pull-left">' +
                        '<select class="eiis-combobox input-sm table-page-size form-control eiis-loaded">' +
                            '<option value="5">显示5项</option>' +
                            '<option value="10">显示10项</option>' +
                            '<option value="25" selected="selected">显示25项</option>' +
                            '<option value="50">显示50项</option>' +
                            '<option value="100">显示100项</option>' +
                            '<option value="-1">显示所有</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="table-custom-ribbon"></div>' +
                '</div>'+
            '</div>';
        //分页栏
        var myFooter = '' +
            '<div class="row" style="margin: 0px 0px 10px 0px;">' +
                '<div class="col-sm-3 col-xs-12" style="min-height: 31px;line-height: 31px;padding: 0px 5px;"><div class="table-info">第 0 至 0 项，共 0 项</div></div>' +
                '<div class="col-sm-9 col-xs-12" style="padding: 0px 5px;">' +
                    '<ul class="pagination table-pagination pull-right">' +
                        '<li class="table-page-first hidden-xs disabled"><a href="#this" data-page-number="1">首页</a></li>' +
                        '<li class="table-page-prev  disabled"><a href="#this" data-page-number="0">上页</a></li>' +
                        '<li class="table-page-next"><a href="#this" data-page-number="2">下页</a></li>' +
                        '<li class="table-page-last hidden-xs"><a href="#this" data-page-number="3">尾页</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>';
        myDiv.addClass("table table-striped table-bordered table-hover table-condensed").append(myHead).append($("<div/>").addClass("panel-body table-panel-body").append(mytoolbar).append($("<div/>").addClass("table-responsive")).append(myFooter));
        //
    };
})(jQuery);