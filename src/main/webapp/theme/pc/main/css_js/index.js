
$(window).load(function(){
    createLeftItem();
    //左侧导航栏点击事件
    selectMenu();
});
//创建左侧导航栏
function createLeftItem(){
    var isC = true;
    var maxW = 992;
    var t_w = $(".web-top-center").width();
    var jg = t_w >= maxW ? 120 : 90;
    var maxN = parseInt(t_w / jg) - 1;

    $(".web-top-center").empty();
    while (menuList.length > 0){
        var menuList1 = [];
        for(var i = 0;i < menuList.length;i++){
            var obj = menuList[i];

            if(obj.children != undefined && obj.children != null){
                menuList1 = menuList1.concat(obj.children);
            }
            //是否存在上级菜单
            var parentLevel = obj.outlineLevel.substring(0,obj.outlineLevel.lastIndexOf(".")).replaceAll(".","-");

            var thisN = obj.outlineLevel.substring(0,obj.outlineLevel.indexOf("."));
            // console.log(obj.outlineLevel)
            // console.log(parentLevel)
            // console.log(thisN)
            // console.log("---------------------------------")

            var str = '';
            if(thisN <= maxN){
                if(obj.type){//是应用
                    str +='<div class="'+ (parentLevel == "1" ? "menu-item":"menu-item2") +'" id="item_'+ obj.menuId +'" onClick="click_item(\''+ (obj.url==""?"#":obj.url) +'\',\''+ obj.menuId +'\')">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '</div>';
                }else{
                    str +='<div class="menu-item dropdown" id="item_'+ obj.menuId +'">';
                    str += '<div id="item_'+ obj.menuId +'" class="dropdown-toggle" data-toggle="dropdown">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '<b class="caret"></b>';
                    str += '</div>';
                    str += '<ul class="dropdown-menu" id="'+ obj.outlineLevel.replaceAll(".","-") +'"></ul>';
                    str += '</div>';
                }
            }else{
                parentLevel = "other";
                if(obj.type){//是应用
                    str +='<div class="menu-item2" id="item_'+ obj.menuId +'" onClick="click_item(\''+ (obj.url==""?"#":obj.url) +'\',\''+ obj.menuId +'\')">';
                    str += '<i class="icon esg-font '+ (obj.icon?obj.icon:"icon-wenben") +'"></i>';
                    str += obj.title;
                    str += '</div>';
                }
            }
            $("#"+parentLevel).append(str);


            str = '';
            if(thisN == maxN && menuList.length > maxN && isC){
                str +='<div class="menu-item dropdown" id="item_other">';
                str += '<div class="dropdown-toggle" data-toggle="dropdown">';
                str += '<i class="icon esg-font icon-gerenyingyon"></i>更多<b class="caret"></b>';
                str += '</div>';
                str += '<ul class="dropdown-menu" id="other"></ul>';
                str += '</div>';
                $("#accordion").append(str);
                isC = false;
            }
        }
        menuList = menuList1;
    }

    if($("#other>div").length < 1)
        $("#item_other").remove();
}

function selectMenu(){
    var mId = menuTreeId;
    if(mId != ""){
        $("#item_"+mId).addClass("list-group-item-click2");

        if($("#item_"+mId).parents(".menu-item").length > 0){
            $("#item_"+mId).parents(".menu-item").addClass("list-group-item-click");
        }
    }
}

function click_item(url,menuId){
    $.post("/core/menuTree/setMenuTree.do",{menuId:menuId},function(){
        window.location.href=url;
    },"json");
}

function clone_my_nav(clas){
    var h = $("."+clas).clone();
    $("."+clas).remove();
    $(".main-center-nav").empty().append(h);

    $(".main-center").css({"margin-top": $(".main-center-nav").height() + 15 + "px"});
}