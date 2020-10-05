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
            queryParams: {
                "parentId":""
            },
            onBeforeExpand:function(node){
                if(node != null){
                    if(!node.isLoad){
                        node.isLoad = true;
                        moduleTree.tree("options").queryParams = {"parentId":node.treeId};
                        return;
                    }
                }
            },
            onSelect:function (node) {
                _treeNode = node;
                getMainInfo(_treeNode.treeId);
            },
            onLoadSuccess:function (node, data) {
                if(_treeNode != null){
                    if(!_treeNode.isLoad){
                        moduleTree.tree("options").queryParams = {"parentId":_treeNode.treeId};
                        moduleTree.tree("reload",_treeNode.target);
                    }else{
                        var id = _treeNode.treeId;
                        moduleTree.tree("select",moduleTree.tree("find",id).target);
                        moduleTree.tree("expand",moduleTree.tree("find",id).target);
                    }
                }
            }
        });
}

function father_initTree() {
    $("#disk_father_tree").tree({
        animate: true,
        lines: true,
        url: "/app/disk/getMainInfo.do",
        onSelect:function (node) {
            $.ajax({
                url:"/app/disk/getFatherNodeName.do",
                data:{"treeId":node.treeId},
                type:"post",
                dataType:"json",
                success:function (rs) {
                    if(rs.error == 0){
                        console.log(node);
                        $("#fatherName").val(rs.msg);
                        $("#my_modal input[name='fatherId']").val(node.treeId);
                        $("#disk_father_tree").hide();
                    }
                }
            })
        },
    })
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
            if(rs.error == 0){
                var id = _treeNode.treeId;
                var node = moduleTree.tree("getParent",_treeNode.target);
                moduleTree.tree("options").queryParams = {"parentId":node.treeId};
                moduleTree.tree("reload",node.target);
            }
        }
    })
}
function add_main() {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }
    $("#disk_father_tree").hide();
    $('#fatherName').css({"background-color":"#eee","cursor": "not-allowed"});
    $('#fatherName').unbind(); //移除所有
    $('#member_tree').tree('expandTo', _treeNode.target);
    $("#my_modal input").each(function () {
        $(this).val("");
    });
    $(".panel-heading .modal-title span").text("新增节点");
    $("#my_modal input[name='treeId']").val(_treeNode[$("#my_modal input[type='hidden']").attr("name")]);
    $("#my_modal input[name='treeId']").attr("data-val","add");
    getFatherName(_treeNode["treeId"]);
}
function edit_main() {
    if(_treeNode == null){
        $.message("请先选中一个节点数据！");
        return;
    }

    father_initTree();
    $("#disk_father_tree").hide();
    $("#fatherName").on("click",function(){
        $("#disk_father_tree").show();
    });

    $('#fatherName').css({"background-color":"white","cursor":"pointer"});
    $('#member_tree').tree('expandTo', _treeNode.target);
    $("#my_modal input").each(function () {
        $(this).val(_treeNode[$(this).attr("name")])
    });
    $(".panel-heading .modal-title span").text("修改节点");
    $("#my_modal input[name='treeId']").attr("data-val","edit");

    var node = $("#disk_tree").tree('getParent', _treeNode.target);
    getFatherName(node["treeId"]);
}
function getFatherName(nodeID) {
    $.ajax({
        url:"/app/disk/getFatherNodeName.do",
        data:{"treeId":nodeID},
        type:"post",
        dataType:"json",
        success:function (rs) {
            if(rs.error == 0){
                $("#fatherName").val(rs.msg);
                $("#my_modal input[name='fatherId']").val(nodeID);
                $('#my_modal').modal('show');
            }
        }
    })
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
                    if(_treeNode.children == null || _treeNode.children.length  < 1){
                        _treeNode.isLoad = true;
                        var node = moduleTree.tree("getParent",_treeNode.target);
                        moduleTree.tree("options").queryParams = {"parentId":node.treeId};
                        moduleTree.tree("reload",node.target);
                    }else{
                        moduleTree.tree("options").queryParams = {"parentId":_treeNode.treeId};
                        moduleTree.tree("reload",_treeNode.target);
                    }
                }
            }
        })

    }else if(dataVal == "edit"){
        postData["fatherId"] = $("#my_modal input[name='fatherId']").val();
        $.ajax({
            url:"/app/disk/editMainInfo.do",
            data:postData,
            type:"post",
            dataType:"json",
            success:function (rs) {
                $.message(rs.msg);
                if(rs.error == 0){
                    initTree();
                    // var node = moduleTree.tree("getParent",_treeNode.target);
                    // moduleTree.tree("options").queryParams = {"parentId":node.treeId};
                    // moduleTree.tree("reload",node.target);
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
    $.message({
        button:$.message.button.yesNo
        ,text:"确定要删除此数据?"
        ,result:function(result){
            if(result == $.message.result.yes){
                $.ajax({
                    url:"/app/disk/deleteMainInfo.do",
                    data:{"treeId":_treeNode.treeId},
                    type:"post",
                    dataType:"json",
                    success:function (rs) {
                        $.message(rs.msg);
                        if(rs.error == 0){
                            var node = moduleTree.tree("getParent",_treeNode.target);
                            moduleTree.tree("options").queryParams = {"parentId":node.treeId};
                            moduleTree.tree("reload",node.target);
                        }
                    }
                });
            }
        }
    });



}
