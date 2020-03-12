var myTable = $("#myTableTest");
var selectedRow;
var square = {};
var option = {
    id:"#myTableTest",//需要绑定的Id或class
    url:"/app/home/getMainInfo.do",//表格请求的路径
    data:{},//请求的参数
    columns:[
        // {name:'id',title:"序号",align:'left',width:'30%'},
        {name:'order',title:"序号",align:'left',width:'30%'},
        {name:'homeIndex',title:"房号",align:'left',width:'30%'},
        {name:'homeMax',title:"面积",align:'left'}
    ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
};

$(window).load(function(){
    console.log("111");

    myTable.ghTable(option);

    myTable.on("table.created", function() {
        loading = false;
    });
    //行选中
    myTable.on("table.row.selected", function(event,eventData) {
        selectedRow = eventData.row;
    });
});


function leave() {
    $("#test").empty();
    var flag = true;
    $("#info input").each(function () {
        if($(this).attr("required") && !$(this).val()){
            flag = false;
            return;
        }
    });
    if(flag){
        for(var i = 0;i< $("#j").val();i++){
            // console.log("1212");
            var modal_home = $("div[name='modal_home']").clone();
            $(modal_home).find("h5").text("户型"+(i+1));
            $(modal_home).find("input").attr("data-attr",(i));
            $("#test").append($(modal_home).html());
        }

    }
}

function save_main() {
    var data = {};
    $("#test input").each(function () {
        data[$(this).attr("data-attr")] = $(this).val();
    });

    var tempData = {};
    var postData = [];
    var postdata_ = {};
    for(var i=0;i<$("#i").val();i++){
        for(var j=0;j<$("#j").val();j++){
            tempData["homeIndex"] = (i+1)+"-"+(j+1);
            tempData["homeMax"]=data[j];
            console.log(tempData);
            $.ajax({
                url:"/app/home/saveMainInfo.do",
                data:tempData,
                type:"post",
                dataType:"json",
                success:function (rs) {
                    myTable.ghTable(option);
                    if(rs.error == 0){
                        myTable.ghTable
                    }
                }
            });
        }
    }

    myTable.ghTable(option);
}