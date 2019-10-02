
//获取提醒
function get_remind_by_id(mainId){
    $.post("/public/controls/remind/action.jsp?action=getRemindById", {mainId:mainId}, function (rs) {
        var v=rs.trim();
        set_remind_value(v);
        submit_remind();
    }, "text");
}

//提醒 提交 暂时未用
//return  true(失败)/false(成功)
function remind_submit(data){
    var retu="";
    $.ajax({
        async:false,
        type:"POST",
        url:"/app/remind/AddRemind.do",
        data:data,
        dataType:'json',
        success:function(rs){
            retu=rs;
        },
        error:function(e){
            retu=e;
        }
    });
    return retu;
}

//提醒 提交 暂时未用
//return  true(失败)/false(成功)
function remind_delete(mainId){
    $.post("/app/remind/deleteRemind.do", {mainId:mainId}, function (rs) {

    }, "text");
}