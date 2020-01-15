var myDetailTable = $("#myDetailTable");
var selectedDetailRow;
var option_detail = {
    id:"#myDetailTable",//需要绑定的Id或class
    url:"/app/typeinfo/getDetailInfo.do",//表格请求的路径
    rows:10,
    columns:[
        {name:'detailName',title:"标题",align:'left',width:'15%'},
        {name:'detailCode',title:'编码',align:'left',width:'15%'},
        {name:'detailValue',title:'值',align:'center',width:'18%'},
        {name:'detailLevel',title:"顺序",align:'center',width:'18%'},
        {name:'isValid',title:"是否有效",align:'center',width:'10%'},
        {name:'comment',title:"备注",align:'center'}
    ]
};

$(window).load(function(){
    myDetailTable.ghTable(option_detail);
    myDetailTable.on("table.row.selected", function(event,eventData) {
        selectedDetailRow = eventData.row;
    });
    myDetailTable.on("table.column.isValid.foramt", function (a, eventData) {
        var row = eventData.row;
        if(row.isValid == "true"){
            eventData.ed.html("<span style='color:#5cb85c'>有效</span>");
        }else{
            eventData.ed.html("<span style='color:#d9534f'>无效</span>");
        }

    });
});

function move_type_detail(type){
    if(selectedDetailRow == null){
        $.message("请选择一条数据！");
    }

    $.ajax({
        url:"/app/typeinfo/moveTypeDetail.do",  //请求路径
        data:{typeDetailId: selectedDetailRow.typeDetailId,type: type}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            if(rs.error == 0){
                loadDetTable();
            }else{
                $.message(rs.msg);
            }
        }
    });
}

function add_det(){
    if(selectedRow == null){
        $.message("请在左侧选择一项类型数据")
    }
    $("#my_det_modal input,#my_det_modal select,#my_det_modal textarea").each(function () {
        var name = $(this).attr("name");
        $(this).val("");
    });
    $("#my_det_modal *[name='typeId']").val(selectedRow.typeId);
    $("#my_det_modal *[name='isValid']").val("true");
    $('#my_det_modal').modal('show');
}

function edit_det(){
    if(selectedDetailRow == null){
        $.message("请先选中一行数据！");
        return;
    }

    $("#my_det_modal input,#my_det_modal select,#my_det_modal textarea").each(function () {
        var name = $(this).attr("name");
        $(this).val(selectedDetailRow[name]);
    });

    $('#my_det_modal').modal('show');
}

function save_det(){
    var postData = get_det_data();

    if(postData){
        $.ajax({
            url:"/app/typeinfo/saveDet.do",  //请求路径
            data:postData, //请求参数
            type:"post", //请求方式
            async:true,  //是否异步，默认值true
            dataType:'json',
            success:function(rs){ ////成功之后回调
                $.message(rs.msg);
                if(rs.error == 0){
                    loadDetTable();
                    $('#my_det_modal').modal('hide');
                }
            }
        });
    }
}

function get_det_data(){
    var flag = true;
    var postData = {};

    $("#my_det_modal input,#my_det_modal select,#my_det_modal textarea").each(function () {
        $(this).css("border", "1px solid #ccc");
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag = false;
            $(this).css("border", "1px solid red");
            var text = "请输入" + $(this).prev().text();
            text = text.replaceAll(":","");
            $.message(text);
            return false;
        }else{
            postData[name] = $(this).val();
        }
    });
    console.log(postData);
    if(!flag) return;
    return postData;
}

function delete_det(){
    if(selectedDetailRow == null){
        $.message("请先选中一行数据！");
        return;
    }

    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除类型："+ selectedDetailRow.detailName + "吗" +"?"
        ,result:function(result){
            if(result == $.message.result.yes){
                $.post("/app/typeinfo/deleteDet.do", {
                    typeDetailId : selectedDetailRow.typeDetailId
                }, function(rs) {
                    $.message(rs.msg);
                    if (rs.error == 0) {
                        loadDetTable();
                    }
                }, "json");
            }
        }
    });
}

function loadDetTable(){
    selectedDetailRow = null;//刷新列表前，把选中行设置为空
    myDetailTable.ghTable();//刷新列表，可以不传参
}