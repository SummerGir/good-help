var _treeNode = null;
var _data = null;
var moduleTree = null;
$(window).load(function () {
    initTree();
});
function initTree() {
     moduleTree  = $("#disk_tree").tree({
        animate: true,
        lines: true,
        url: "/app/disk/getMainInfo.do",
        queryParams: { "parentId":""},
        onBeforeExpand:function(node){
            moduleTree.tree("options").queryParams = {"parentId":node.treeId};
            if(node.isLoad){
                node.isLoad = false;
                moduleTree.tree("reload",node.target);
            }
        },
        onSelect:function (node) {
            _treeNode = node;
         }
    })
}

function reset_tree() {
    if(_treeNode == null){
        initTree();
    }else {
        moduleTree.tree("reload",_treeNode.target);
    }

}
function move_tree(bool) {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }
    $.ajax({
        url:"/app/disk/move.do",
        data:{"moveOn":bool,"treeId":_treeNode.treeId},
        type:"post",
        dataType:"json",
        success:function (rs) {
            // $.message(rs.msg);
            if(rs.error == 0){
                var node = moduleTree.tree("getParent",_treeNode.target);
                moduleTree.tree("reload",node.target);
                moduleTree.tree("select",_treeNode.target);
            }
        }
    })
}
function add_main() {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }
    $('#member_tree').tree('expandTo', _treeNode.target);
    $("#my_modal input").each(function () {
        $(this).val("");
    });
    $("#my_modal input[type='hidden']").val(_treeNode[$("#my_modal input[type='hidden']").attr("name")]);
    $("#my_modal input[type='hidden']").attr("data-val","add");
    $('#my_modal').modal('show');
}

function edit_main() {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }
    $('#member_tree').tree('expandTo', _treeNode.target);
    $("#my_modal input").each(function () {
        $(this).val(_treeNode[$(this).attr("name")])
    });
    $("#my_modal input[type='hidden']").attr("data-val","edit");
    $('#my_modal').modal('show');
}

function save_main() {
    var flag = true;
    var postData = {};
    var dataVal = $("#my_modal input[type='hidden']").attr("data-val");
    $("#my_modal input").each(function () {
        var name = $(this).attr("name");
        if ($(this).attr("required") && !$(this).val()) {
            flag=false;
            $(this).css ("border","1px,solid,red");
            $.message($(this).prev().text() + "不能为空");
            return false;
        }
        else {
            postData[name] = $(this).val();
        }
    });
    console.log(postData);
    if(!flag)  return;
    if(dataVal == "add"){
        $.ajax({
            url:"/app/disk/saveMainInfo.do",
            data:postData,
            type:"post",
            dataType:"json",
            success:function (rs) {
                $.message(rs.msg);
                if(rs.error == 0){
                    // var node = moduleTree.tree("getParent",_treeNode.target);
                    moduleTree.tree("reload",_treeNode.target);
                }
            }
        })

    }else if(dataVal == "edit"){
        $.ajax({
            url:"/app/disk/editMainInfo.do",
            data:postData,
            type:"post",
            dataType:"json",
            success:function (rs) {
                $.message(rs.msg);
                if(rs.error == 0){
                    var node = moduleTree.tree("getParent",_treeNode.target);
                    moduleTree.tree("reload",node.target);
                }

            }
        })
    }
    $('#my_modal').modal('hide');
}

function delete_main() {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }
    if(_treeNode.treeId == "ROOT"){
        $.message("此为根节点，不允许删除！");
        return;
    }
    $.ajax({
        url:"/app/disk/deleteMainInfo.do",
        data:{"treeId":_treeNode.treeId},
        type:"post",
        dataType:"json",
        success:function (rs) {
            $.message(rs.msg);
            if(rs.error == 0){
                var node = moduleTree.tree("getParent",_treeNode.target);
                moduleTree.tree("reload",node.target);
            }

        }
    });


}
