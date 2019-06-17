var _treeNode = null;

$(window).load(function(){
    initTree();
});

//------------------------成员树----------------------------
//创建成员树
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
            }
        },
        onLoadError: function(arguments){
            console.log("onLoadError");
            console.log(arguments);
        }
    });
}
//重置
function reset_tree() {
    $("#member_tree").tree("reload");
}

function move_tree(type){
    if(_treeNode == null){
        $.message("请选择一个菜单节点！");
    }

    $.ajax({
        url:"/core/menuTree//moveTree.do",  //请求路径
        data:{treeId: _treeNode.id,type: type}, //请求参数
        type:"post", //请求方式
        async:true,  //是否异步，默认值true
        dataType:'json',
        success:function(rs){ ////成功之后回调
            $.message(rs.msg);
            if(rs.error == 0){
                reset_tree();
            }
        }
    });
}
