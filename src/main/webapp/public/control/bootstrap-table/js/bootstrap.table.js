/**
 * Created by xiucai on 2017/10/30.
 */
//定义一个匿名函数
(function ($,undefined){
    //默认表格控件参数
    var defaultOpt = {
        isCreate:false,
        id:"",//需要绑定的Id或class
        url:"",//表格请求的路径
        type:"post",//请求方式
        data:"",//请求的参数
        dataType:"json",//请求的返回格式
        toolbar:"",//表格上面的工具栏用哪个容器
        allowSelected:true,//表格上面的工具栏用哪个容器
        isPage:true,//是否分页
        haveHead:false,//是否需要工具栏上方的面板头部
        page:1,//加载数据的初始页
        rows:10,//每页默认条数
        columns:[]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
    };
    var set_table = function(){
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
                //首先清空表格中的内容
                myDiv.find(".table-responsive table>tbody").empty();
                //定义表格产生事件
                myDiv.triggerHandler("table.created");
                if(r != null && r.length > 0){

                    var col = defaultOpt.columns;
                    //组建tbody中的行
                    for(var m = 0;m < r.length;m++){
                        var row = r[m];
                        var myTd = $("<tr/>").attr("data-num",m);
                        for(var i = 0 ;i < col.length;i++){
                            var c = col[i];
                            var val = row[c.name];
                            var tem = c.template;
                            if(tem != undefined && tem != null && typeof tem === 'function'){
                                val = tem(val);
                            }
                            myTd.append('<td style="'+((c.align==null ||c.align=="")?"":("text-align:"+c.align+";"))+'">'+val+'</td>');
                        }
                        myTd.find("td").each(function(i,o){

                            myDiv.triggerHandler("table.column."+ col[i].name +".foramt", [{row: r[m], ed: $(this)}]);
                        });
                        myDiv.find(".table-responsive table>tbody").append(myTd);
                        if(defaultOpt.allowSelected){
                            myTd.bind("click",function(){
                                var m = $(this).attr("data-num");
                                var clas = "info";
                                if(!$(this).hasClass(clas)){
                                    $(this).parent().children().removeClass(clas);
                                    $(this).addClass(clas);
                                    myDiv.triggerHandler("table.row.selected", [{row: r[m], tr: $(this)}]);
                                }else{
                                    $(this).parent().children().removeClass(clas);
                                    myDiv.triggerHandler("table.row.selected", [{row: null, tr: null}]);
                                }

                            });
                        }
                    }

                }

                defaultOpt.page = rs.page;
                var p = defaultOpt.page;
                var records = rs.records;//总条数
                if(defaultOpt.rows > 0){
                    var s = (p-1)*defaultOpt.rows;
                    s = s < 1?1:s;
                    s = records < 1?0:s;
                    var e = p*defaultOpt.rows;
                    e = e > records?records:e;
                    //生成页
                    myDiv.find(".table-footer .table-info").html("第&nbsp;"+s+"&nbsp;至&nbsp;"+e+"&nbsp;项,共&nbsp;"+records+"&nbsp;项");
                }else{
                    myDiv.find(".table-footer .table-info").html("显示所有,共&nbsp;"+records+"&nbsp;项");
                }

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
                    set_table();
                });

            },error:function(){
                console.log("加载表格失败")
            }
        });
    };
    $.fn.ghTable= function(options){

        //覆盖默认参数
        if(options != null && options != undefined){
            for(var opt in options){
                defaultOpt[opt] = options[opt];
            }
        }
        if(!defaultOpt.isCreate){
            defaultOpt.isCreate = true;
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
                    $(defaultOpt.id).html(data);
                }
            });
            //设置每页条数,如果不分页，则显示全部
            if(!defaultOpt.isPage){
                defaultOpt.rows = -1;
                myDiv.find(".table-toolbar .pull-left select").prop("disabled",true);
            }
            myDiv.find(".table-toolbar .pull-left select").val(defaultOpt.rows);
            //绑定工具栏
            myDiv.find(".table-toolbar .table-custom-ribbon").empty();
            if(defaultOpt.toolbar != ""){
                myDiv.find(".table-toolbar .table-custom-ribbon").html($(defaultOpt.toolbar).html());
                $(defaultOpt.toolbar).hide();
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
        }

        set_table();

    };
})(jQuery);