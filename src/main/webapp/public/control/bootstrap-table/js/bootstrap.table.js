/**
 * Created by xiucai on 2017/10/30.
 */
//定义一个匿名函数
(function ($,undefined){
    if($.ghTable == undefined){
        $.ghTable = {};
    }
    //默认表格控件参数
    var defaultOpt = {
        id:"",//需要绑定的Id或class
        url:"",//表格请求的路径
        type:"post",//请求方式
        data:"",//请求的参数
        dataType:"json",//请求的返回格式
        toolbar:"",//表格上面的工具栏用哪个容器
        isPage:true,//是否分页
        haveHead:false,//是否需要工具栏上方的面板头部
        page:1,//加载数据的初始页
        rows:10,//每页默认条数
        columns:[]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
    };
    $.ghTable.set_table = function(){
        //定义表格对象
        var myDiv = $(defaultOpt.id);
        if(defaultOpt.data == undefined || defaultOpt.data == null || defaultOpt.data == ""){
            defaultOpt.data = {};
        }
        defaultOpt.data["page"] = defaultOpt.page;
        defaultOpt.data["rows"] = defaultOpt.rows;
        $.ajax({
            url: defaultOpt.url,
            data: defaultOpt.data,
            type:defaultOpt.type,
            async: true,
            dataType: defaultOpt.dataType,
            success: function (rs) {
                if(rs == null){
                    return;
                }
                var r = rs.rows;
                if(r.length > 0){

                    //设置表格的表头
                    var col = defaultOpt.columns;
                    //组建tbody中的行
                    var myTd = '';
                    for(var m = 0;m < r.length;m++){
                        var row = r[m];
                        myTd += '<tr>';
                        for(var i = 0 ;i < col.length;i++){
                            var c = col[i];
                            var val = row[c.name];
                            var tem = c.template;
                            if(tem != undefined && tem != null && typeof tem === 'function'){
                                val = tem(val);
                            }
                            myTd += '<td style="'+((c.align==null ||c.align=="")?"":("text-align:"+c.align+";"))+'">'+val+'</td>';
                        }
                        myTd += '</tr>';
                    }

                    myDiv.find(".table-responsive table>tbody").empty();
                    myDiv.find(".table-responsive table>tbody").append(myTd);
                }

                defaultOpt.page = rs.page;
                var p = defaultOpt.page;
                var records = rs.records;//总条数
                var s = (p-1)*defaultOpt.rows;
                s = s < 1?1:s;
                s = records < 1?0:s;
                var e = p*defaultOpt.rows;
                e = e > records?records:e;
                //生成页
                myDiv.find(".table-footer .table-info").html("第&nbsp;"+s+"&nbsp;至&nbsp;"+e+"&nbsp;项,共&nbsp;"+records+"&nbsp;项");
                var total = rs.total;//总页数
                //第一页时，不能点首页和上一页
                myDiv.find(".table-footer li").removeClass("disabled");
                if(defaultOpt.page == 1){
                    myDiv.find(".table-footer .table-page-first").addClass("disabled");
                    myDiv.find(".table-footer .table-page-prev").addClass("disabled");
                }
                //最后一页时，不能再点下一页和尾页
                if(defaultOpt.page == total){
                    myDiv.find(".table-footer .table-page-next").addClass("disabled");
                    myDiv.find(".table-footer .table-page-last").addClass("disabled");
                }
                console.log(defaultOpt.page);
                var ts = defaultOpt.page-2<1?1:defaultOpt.page-2;
                var te = defaultOpt.page+2>total?total:defaultOpt.page+2;
                var myLi = '';
                for(var i = ts;i <= te;i++){
                    myLi += '<li class="table-page-number '+(i == defaultOpt.page?"active":"hidden-xs")+'"><a data-page-number="'+i+'" href="#this">'+i+'</a></li>';
                }
                myDiv.find(".table-page-number").remove();
                myDiv.find(".table-footer .table-page-prev").after(myLi);
                myDiv.find(".table-footer li").unbind("click");
                myDiv.find(".table-footer li").bind("click",function(){
                    if($(this).hasClass("disabled")){
                       return;
                    }
                    console.log($(this).html());
                    if($(this).hasClass("table-page-first")){
                        //首页
                        defaultOpt.page = 1;
                    }else if($(this).hasClass("table-page-last")){
                        //尾页
                        defaultOpt.page = total;
                    }else if($(this).hasClass("table-page-prev")){
                        //上一页
                        defaultOpt.page--;
                    }else if($(this).hasClass("table-page-next")){
                        //下一页
                        defaultOpt.page++;
                    }else if($(this).hasClass("table-page-number")){
                        //下一页
                        defaultOpt.page = $(this).find("a").attr("data-page-number");
                    }
                    $.ghTable.set_table();
                });

            },error:function(){
                console.log("加载表格失败")
            }
        });
    };
    $.ghTable.set_div= function(options){

        //覆盖默认参数
        if(options != null && options != undefined){
            for(var opt in options){
                defaultOpt[opt] = options[opt];
            }
        }
        //定义表格对象
        var myDiv = $(defaultOpt.id);
        myDiv.empty();
        $.ajax({
            url: "/public/control/bootstrap-table/templet.jsp",
            data: {isPage:defaultOpt.isPage,haveHead:defaultOpt.haveHead},
            async: false,
            cache: false,
            dataType: "html",
            success: function (data, textStatus, jqXHR) {
                console.log(defaultOpt);
                $(defaultOpt.id).html(data);
            }
        });
        //设置每页条数
        myDiv.find(".table-toolbar .pull-left select").val(defaultOpt.rows);
        //绑定工具栏
        myDiv.find(".table-toolbar .table-custom-ribbon").empty();
        if(defaultOpt.toolbar != ""){
            myDiv.find(".table-toolbar .table-custom-ribbon").html($(defaultOpt.toolbar).html());
            $(defaultOpt.toolbar).remove();
        }

        //设置表格的表头
        var col = defaultOpt.columns;
        if(col.length < 1){
           console.log("请设置表格");
           return;
        }
        // [{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
        var myTh = '<tr>';
        for(var i = 0 ;i < col.length;i++){
            var c = col[i];
            myTh += '<th style="'+((c.align==null ||c.align=="")?"":("text-align:"+c.align+";"))+((c.width==null ||c.width=="")?"":("width:"+c.width+";"))+'">'+c.title+'</th>';
        }
        myTh += '</tr>';
        myDiv.find(".table-responsive table>thead").empty();
        myDiv.find(".table-responsive table>thead").append(myTh);
        $.ghTable.set_table();

    };
})(jQuery);