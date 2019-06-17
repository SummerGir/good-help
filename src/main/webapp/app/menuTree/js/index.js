var _treeNode = null;

$(window).load(function(){
    initTree();
});

function initTree() {
    $("#member_tree").tree({
        animate: true,
        lines: true,
        url: "/core/menuTree/getMenuTrees.do",
        onSelect: function (node) {
            console.log("onSelect");
            console.log(node);
            _treeNode = node;
        },
        onLoadSuccess: function(node, data){
            console.log("onLoadSuccess");
            console.log(data);
            if(_treeNode != null){
                _treeNode = $('#member_tree').tree('find', _treeNode.id);
                $('#member_tree').tree('select', _treeNode.target);
                $('#member_tree').tree('expandTo', _treeNode.target);
            }
        },
        onLoadError: function(arguments){
            console.log("onLoadError");
            console.log(arguments);
        }
    });
}

function reset_tree() {
    $("#member_tree").tree("reload");
}

function move_tree(type){
    if(_treeNode == null){
        $.message("请选择一个菜单节点！");
    }

    $.ajax({
        url:"/core/menuTree/moveTree.do",  //请求路径
        data:{treeId: _treeNode.id,type: type}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            if(rs.error == 0){
                reset_tree();
            }else{
                $.message(rs.msg);
            }
        }
    });
}


function add_main(){
    if(_treeNode == null){
        $.message("请先选中一行数据！");
        return;
    }
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        var name = $(this).attr("name");
        $(this).val("");
    });
    var parent = $('#member_tree').tree('getParent', _treeNode.target);
    $("#my_modal *[name='parentId']").val(parent.id);

    $('#my_modal').modal('show');
}
function edit_main(){
    if(_treeNode == null){
        $.message("请先选中一行数据！");
        return;
    }
    $.post("/core/menuTree/getMainOne.do", {mainId : _treeNode.id}, function(rs) {
        if (rs != null) {
            $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
                var name = $(this).attr("name");
                $(this).val(rs[name]);
            });
            var parent = $('#member_tree').tree('getParent', _treeNode.target);
            $("#my_modal *[name='parentId']").val(parent.id);
            $('#my_modal').modal('show');
        }else{
            $.message("查询失败")
        }
    }, "json");

}

function delete_main(){
    if(_treeNode == null){
        $.message("请先选中一行数据！");
        return;
    }
    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除此数据?"
        ,result:function(result){
            if(result == $.message.result.yes){
                $.post("/core/menuTree/deleteMain.do", {
                    mainId : _treeNode.id
                }, function(rs) {
                    $.message(rs.msg);
                    if (rs.error == 0) {
                        reset_tree();
                    }
                }, "json");
            }
        }
    });
}

function save_main(){
    var flag = true;
    var postData = {};
    $("#my_modal input,#my_modal select,#my_modal textarea").each(function () {
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag = false;
            $(this).css("border", "1px solid red");
            $.message($(this).prev().text() + " 不能为空!");
            return false;
        }else{
            postData[name] = $(this).val();
        }
    });
    if(!flag) return;
    $.ajax({
        url:"/core/menuTree/saveMain.do",  //请求路径
        data:postData, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            $.message(rs.msg);
            if(rs.error == 0){
                $('#my_modal').modal('hide');
                loadTable();
            }
        }
    });
}
