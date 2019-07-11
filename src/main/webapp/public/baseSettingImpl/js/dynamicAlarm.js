//searchkey判断当前搜索与上次搜索是否一样;issenior判断搜索框的版本;isajax判断是否处于请求中
var size;var isSearch=false; var flag = true; var issenior;var isajax=false; var searchkey;
$(document).ready(function () {
    $.ajax({
        type : "post",
        url : "/public/baseSet/impl/alarm/getAlarmTypes.do",
        data : {},
        async : false,
        dataType : "json",
        success : function(msg){
            var rows = msg.rows;
            var html1="",html2="",html3="",self;
            if(rows.length>0){
                for(var i=0;i<rows.length;i++){
                    self=rows[i];
                    html1+='<div class="btn-group btn-title">'+
                        '<button type="button" code="'+self.alarmTypeCode+'" DOC_PUBLISH="false" class="navBtn" data-title="'+self.alarmTypeName+'" id="'+self.alarmTypeCode+'">'+self.alarmTypeName+(self.unReadNum?'<span>('+self.unReadNum+')</span>':'')+'</button>'+
                        '</div>';
                    html2+='<div class="content" code="'+self.alarmTypeCode+'">'+
                        '<div class="item_container"></div>'+
                        '</div>';
                    html3+='<div code="'+self.alarmTypeCode+'" page="0" rows="10" maxPage="10"><h2>暂无数据!</h2></div>';
                }
                $("#wrap_title_child").append(html1);
                $("#wrap_child").append(html2);
                $("#model_4").append(html3);
            }
        }
    });
    bindSwiper();
    if(mainId!=""){
        viewItem(null,mainId);
    }else{
        //加载导航栏
        initOption();
        size = getWindowSize();
        $(".content").height(size.y-92);
        $(".kind_label button").on("click",changeKind);
        if( $(".kind_label button").length*85 > size.x ){
            $(".kind_label>div").width($(".kind_label button").length*85);
        }
        //getCodeInRemember();
        window.setTimeout(function(){
            if(flag){
                if(nowCode && nowCode!='null') {
                    $(".kind_label button").each(function (i) {
                        if($(this).attr('code')==nowCode) {
                            $(".kind_label button:eq(" + i + ")").trigger("click");
                            scrollfun(i);
                        }
                    })
                }else{
                    $(".kind_label button:eq(0)").trigger("click");
                }
            }
        },500);
        getNaxtPage();
        clearDetail_MainId();
    }
});
//导航栏切换
function changeKind(){
    $(".kind_label .active").removeClass("active");
    $(this).addClass("active");
    var code = $(this).attr("code");
    $("#wrap_child>[code='"+code+"']>.item_container").empty();
    $("#master_title").text($(this).data("title"));
    var div = $("#model_4>div[code='"+code+"']");
    isSearch=false;
    if(div.attr("page")=="0"){
        getList(code);
        // getIds(code);
    }else{
        $("#model_4>div[code='"+code+"']").clone(true).appendTo("#wrap_child>[code='"+code+"']>.item_container");
        rememberInfocenterIds();
    }

    if("true".equalsIgnoreCase( $(this).attr("DOC_PUBLISH") )){
        $("span[name='DOC_PUBLISH']").show();
    }else{
        $("span[name='DOC_PUBLISH']").hide();
    }
    clearSearch();
    rememberCode(code);
    //左右滑动
    var itemNum = $(this).parent().index();
    sunX = -itemNum*wrapWidth;
    $('#wrap_child').animate({left: sunX},300);
}
//获取下一页
function getNaxtPage(){
    $(".content").scroll(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(isSearch) {
            //当搜索内容滚动到底部时加载新的内容
            if ($(this).scrollTop() + $(".content").height()  >= $(".item_container").height() && $(this).scrollTop() > 0) {
                var code =$(".kind_label .active").attr("code");
                console.log("搜索滚动调用");
                    search_submit("");
            }
        }else {
            //当内容滚动到底部时加载新的内容
            if ($(this).scrollTop() + $(".content").height()  >= $(".item_container").height() && $(this).scrollTop() > 0) {
                var code =$(".kind_label .active").attr("code");
                console.log("滚动调用");
                getList(code);
            }
        }
    });
}
//获取列表
function getList(code,b){
    var c = $("#wrap_child>[code='"+code+"']>.item_container").children().length;
    if(b && c>0)return false;
    var postData ={};
    var div = $("#model_4>div[code='"+code+"']");
    postData.page = div.attr("page");
    var maxPage = parseInt(div.attr("maxPage"));
    if(postData.page==maxPage) return;
    postData.page = 1+ parseInt(postData.page);
    postData.rows = div.attr("rows");
    postData.alarmTypeCode = code;
//                $.message.loader.open("加载中...");

    $.post(
        "/public/baseSet/impl/alarm/getAlarmItems.do", postData,
        function(res){
            div.attr("maxPage", res.total);
            div.attr("page", res.page);
            if(res.records>0){
                div.find("h2").remove();
            }else if(postData.page==1){
                div.find("h2").clone(true).appendTo("#wrap_child>[code='"+code+"']>.item_container");
            }
            $.each(res.rows,function(i,o){
                var item= makeItem(o) ;
                div.append(item);
                if($(".kind_label .active").attr("code").equals(code)){
                    item.clone(true).appendTo("#wrap_child>[code='"+code+"']>.item_container");
                }
            });
            if(res.records>0 && div.attr("page").equals( div.attr("maxPage"))){
                var text = "到底了！";
                if(res.total>maxPage){
                    text = "到底了，更多请用搜索功能！";
                }
                var bottom_ts = $("<h4 align='center'>"+text+"</h4>");
                div.append(bottom_ts);
                if($(".kind_label .active").attr("code").equals(code)){
                    bottom_ts.clone(true).appendTo("#wrap_child>[code='"+code+"']>.item_container");
                }
            }
//                            $.message.loader.close();
        },'json'
    );
}
//生成列表div item
function makeItem(o){
    var item = $($("#model_3").html());
    item.attr("data_id", o.alarmId);
    // item.find("span[name='publishPersonName']").text(o.memberName);
    item.find("span[name='time']").text(o.alarmTime);
    item.find("span[name='title']").text(o.alarmTitle);
    item.find("span[name='content']").text(o.alarmContent);
    item.find("span[name='yidu']").html('<font style="color:#fe3600;">'+o.readCount.yidu+'</font> 已读');
    item.find("span[name='weidu']").html('<font style="color:#fe3600;">'+o.readCount.weidu+'</font> 未读');
    item.find("span[name='fileCount']").html('<font style="color:#fe3600;">'+o.fileCount+'</font> 附件');
    // item.find(".item_1 img").attr('src',"/app/userinfo/member_outphoto.jsp?personId="+ o.memberId);
    item.find("input[name='mainId']").val(o.alarmId);
    item.find("input[name='yidu']").val(o.readCount.yidu);
    item.find("input[name='weidu']").val(o.readCount.weidu);
    if(o.readState){
        item.find(".new").css("display","none");
        if(o.fileCount>0){
            item.find("span[name='title']").css("width", "54%");
            item.find("span[name='title']").css("margin-left", "8%");
        }else {
            item.find(".attachImg").css("display","none");
            item.find(".tit span").css('width', '92%');
            item.find(".tit span").css('margin-left', '8%');
        }
    }
    if(o.attachment!="") {
        var attachUrl="";
        if(o.attachment.indexOf("display")>0){
            attachUrl=o.attachment.substring(14,o.attachment.length);
        }else if(o.attachment.indexOf("download")>0){
            attachUrl=o.attachment.substring(15,o.attachment.length);
        }
        if(attachUrl.IsPicture()){
            attachUrl="/file/display/"+attachUrl;
            if(o.title.length>30){
                var tit= o.title.substring(0,30)+"...";
                item.find("span[name='title']").text(tit);
            }else{
                item.find("span[name='content']").text(o.content);
            }
            item.find(".tit img").attr("src",attachUrl);
            item.find(".tit img").addClass("img-responsive");
        }else{
            item.find(".attachImg").css("display","none");
            if(o.readState==true){
                item.find(".tit span").css('width', '57%');
                item.find(".tit span").css('margin-left', '8%');
            }else{
                item.find(".tit span").css('width', '88%');
            }
        }
    }else{
        item.find(".attachImg").remove();
        if(o.readState==true){
            item.find(".tit span").css('width', '92%');
            item.find(".tit span").css('margin-left', '8%');
        }else{
            item.find(".tit span").css('width', '88%');
        }
    }
    return item;
}
String.prototype.IsPicture = function()
{
    //判断是否是图片 - strFilter必须是小写列举
    var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
    if(this.indexOf(".")>-1)
    {
        var p = this.lastIndexOf(".");
        var strPostfix=this.substring(p,this.length) + '|';
        strPostfix = strPostfix.toLowerCase();
        if(strFilter.indexOf(strPostfix)>-1)
        {
            return true;
        }
    }
    return false;
}
//查看文档
function viewItem(e,id){
    var data_id=id;
    var pubTime="";
    var isReaded=false;
    if(e!=null){
        data_id= $(e).parents(".item").attr("data_id");
        pubTime=$(e).parents(".item").find("span[name='time']").text();
    }
    var code=$(".kind_label .active").attr("code");
    var url = "/public/baseSettingImpl/dynamicAlarm.jsp";
    window.location.href="detail.jsp?mainId="+data_id+"&pubTime="+pubTime+"&dir_code="+code+"&url="+url + '&uuidStr=' + uuidStr;
}
//分享
function share(e){
    var mainId = $(e).parents(".item").attr("data_id");
    window.location.href="/app/share/mob/index.jsp?mainId="+mainId+"&shareType=infocenter&ran="+Math.random;
}
//添加文档
function add_doc(){
    var code=$(".kind_label .active").attr("code");
    window.location.href='write.jsp?type=add&dir_code='+code;
}
//弹出搜索
function show_search(){
    $("#search_modal").modal();
}
//弹出搜索
function show_search1(){
    $("#search_modal").modal("hide");
    $("#search_modal1").modal();
}
//搜索
function search_submit(is){
    var search_modal;
    if(is!=""){
        issenior=is;
    }
    if(issenior=="issenior"){
        search_modal=$('#search_modal1');
    }else if (issenior=="isprimary"){
        search_modal=$('#search_modal');
    }
    var postData={};
    var  flag = true;
    var startTime=search_modal.find("input[name='startTime']").val();
    var endTime=search_modal.find("input[name='endTime']").val();
    var code= $(".kind_label .active").attr("code");
    var div = $("#model_4>div[code='"+code+"']");
    var maxPage = parseInt(div.attr("maxPage"));
    postData.rows = div.attr("rows");
    if (isSearch){
        if(isajax){
            return false;
        }
        if (is==""){
            postData.page = 1+ parseInt(div.attr("page"));
        }else {
            postData.page = 1;
        }
        if(postData.page>maxPage && is=="") return;
        if (searchkey!=search_modal.find("input[name='masterKey']").val() || is!=""){
            $(".item_container").empty();
            $(".item_container").append("<h3>搜索结果：</h3>")
        }
    }
    if(startTime){
        postData["begin_publish_date"]=startTime;
        flag=false;
    }
    if(endTime){
        postData["end_publish_date"]=endTime;
        flag=false;
    }
    var key = search_modal.find("input[name='masterKey']").val();
    searchkey=key;
    if(key){
        postData.key = key;
        flag=false;
    }
    if(flag){
        if(search_modal.attr("id")=="search_modal"){
            $.message("请输入文档标题关键字。");
        }else{
            $.message("至少输入一个条件。");
        }
        return;
    }
    isajax=true;
    postData["alarmTypeCode"]=$(".kind_label .active").attr("code");
    $.ajax({
        async: true, dataType: 'json', type: 'post',
        data: postData,
        url: '/public/baseSet/impl/alarm/getAlarmItems.do',
        success: function (rs) {
            isajax=false;
                div.attr("maxPage", rs.total);
                div.attr("page", rs.page);
            search_modal.modal("hide");
            if(rs.rows && rs.rows.length>0){
                if (!isSearch){
                    $(".item_container").empty();
                    $(".item_container").append("<h3>搜索结果：</h3>")
                }
                $.each(rs.rows,function(i,o){
                    var item = makeItem(o);
                    $(".item_container").append(item);
                });
                isSearch=true;
                rememberInfocenterIds();
            }else{
                $(".item_container").empty();
                var text = "未搜索到相关结果！";
                var bottom_ts = $("<h4 align='center'>"+text+"</h4>");
                $(".item_container").append(bottom_ts);
                $("#search_none").modal();
                setTimeout(function(){$("#search_none").modal("hide")} ,1500);
            }
            if(rs.records>0 && div.attr("page").equals( div.attr("maxPage"))){
                var text = "到底了！";
                var bottom_ts = $("<h4 align='center'>"+text+"</h4>");
                $(".item_container").append(bottom_ts);
            }
            var html1="";
            var datatitle=$(".kind_label .active").attr("data-title");
            html1+= datatitle+(rs.unReadNum?'<span>('+rs.unReadNum+')</span>':'');
            var id="#"+code;
            $(id).empty();
            $(id).append(html1);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            isajax=false;
            search_modal.modal("hide");
            $.message("搜索失败！");
        }
    });
}
//清楚搜索内容
function clearSearch(){
    $("#search_modal input,#search_modal1 input").each(function(){
        $(this).val("");
    });
}
//返回文档id数组
var idsMap={};
function getIds(code){
    $.post("action.jsp?action=getIdsByCode",{dir_code:code},function(re){
        if($.isArray(re)){
            idsMap[code] = re;
            rememberInfocenterIds();
        }
    },"json");
}
//返回文档id数组
function rememberInfocenterIds(){
    if(window.parent) {
        var ids = [];
        if(isSearch && $(".item_container .item[data_id]").length>0){
            $(".item_container .item[data_id]").each(function(){
                ids.push($(this).attr("data_id"));
            });
        }else if(!isSearch){
            var code =$(".kind_label .active").attr("code");
            if(idsMap[code] && idsMap[code].length>0){
                ids = idsMap[code];
            }
        }
        var action = {
            code: "setValue",
            key: "infoIds",
            value:ids
        };
        window.parent.postMessage(action, '*');
    }
}
//传递导航栏信息
function rememberCode(code){
    if(window.parent) {
        var action = {
            code: "setValue",
            key: "infoCode",
            value:code
        };
        window.parent.postMessage(action, '*');
    }
}
//获取选中的导航栏并触发选中事件
function getCodeInRemember(){
    window.addEventListener('message',function(e){
        var data = e.data;
        if(data.code=='returnValue'){
            if(!data.error && "app.infoCode".equals(data.key)){
                flag = false;
                if(data.value){
                    var code = data.value;
                    $(".kind_label button[code='"+code+"']").trigger("click");
                }else{
                    $(".kind_label button:eq(0)").trigger("click");
                }
            }
        }
    },false);

    if(window.parent){
        var action={
            code:"getValue",
            key:"app.infoCode"
        };
        window.parent.postMessage(action,'*');
    }
}

function clearDetail_MainId(){
    if(window.parent) {
        var action = {
            code: "setValue",
            key: "infoMainId",
            value:false
        };
        window.parent.postMessage(action, '*');
    }
}
//加载右侧搜索框和当前nav
function initOption(){
    var opBtn = $("#master_option").parent();
    opBtn.empty().append($("#model_1").html());
    opBtn.show();
}
function back_(){
    //history.back();
    window.location.href = '/theme/current/master/phone_home/infocenter.jsp';
}
function readState(e){
    var docId=$(e).parents(".item_1").find("input[name='mainId']").val();
    var yidu=$(e).parents(".item_1").find("input[name='yidu']").val();
    var weidu=$(e).parents(".item_1").find("input[name='weidu']").val();
    window.location.href="readState.jsp?mainId="+docId+"&yidu="+yidu+"&weidu="+weidu;
}

/*左右滑动事件*/
var wrapWidth;
var contentNum;
var beforeY,leftState;
var newTouch = {}, oldTouch = {}, sunX = 0, itemNum = 0, itemyu = 0;
function bindSwiper(){
    wrapWidth = document.getElementById('wrap').offsetWidth;
    contentNum = $('#wrap_child>.content').length;
    $('#wrap_child').css('width',wrapWidth*contentNum);
    var content=$('#wrap_child>.content');
    content.css('width',wrapWidth);
    document.getElementById('wrap_child').addEventListener('touchstart', function (event) {
        newTouch = event.targetTouches[0];
        beforeY=newTouch.clientY;
        leftState=false;
    });
    document.getElementById('wrap_child').addEventListener('touchmove', function (event) {
        if(leftState){
            event.preventDefault();
            event.stopPropagation();
        }
        if (event.targetTouches.length == 1) {
            oldTouch = newTouch;
            newTouch = event.targetTouches[0];
            if((newTouch.clientY>=beforeY-10 && newTouch.clientY<=beforeY+10) && Math.abs(newTouch.clientX-oldTouch.clientX)>Math.abs(newTouch.clientY-oldTouch.clientY)) {
                content.css("overflow-y","hidden");
                leftState=true;
                sunX += newTouch.clientX - oldTouch.clientX;
                document.getElementById('wrap_child').style.left = sunX + 'px';
            }
        }
    })
    document.getElementById('wrap_child').addEventListener('touchend', function (event) {
        itemNum = Math.floor(Math.abs(sunX)/wrapWidth);
        itemyu = Math.abs(sunX%wrapWidth);
        if(sunX<0 && itemyu>wrapWidth/3 && itemNum<contentNum-1 && newTouch.clientX<oldTouch.clientX)itemNum++;
        if(itemNum>contentNum-1)itemNum = contentNum-1;
        sunX = -itemNum*wrapWidth;
        $('#wrap_child').animate({left: sunX},300);
        scrollfun(itemNum);
        $('.kind_label .btn-title .navBtn').removeClass('active');
        $('.kind_label .btn-title').eq(itemNum).find('button.navBtn').addClass('active');
        var code = $('.kind_label .btn-title').eq(itemNum).find('button.navBtn').attr('code');
        var titleDesc = $('.kind_label .btn-title').eq(itemNum).find('button.navBtn').data("title");
        $('#master_title').text(titleDesc);
        if(code)getList(code,true);

        //添加按钮
        if("true".equalsIgnoreCase( $('button.navBtn.active').attr("DOC_PUBLISH") )){
            $("span[name='DOC_PUBLISH']").show();
        }else{
            $("span[name='DOC_PUBLISH']").hide();
        }
        content.css("overflow-y","auto");
    })
}
function scrollfun(itemNum) {
    var wrapTitleWidth = document.getElementById('wrap_title_child').offsetWidth;
    if(itemNum==0){
        $('#wrap_title').animate({scrollLeft: '0px'},300);
    }else{
        var w = (itemNum+1)*(wrapTitleWidth-wrapWidth)/(contentNum-1);
        $('#wrap_title').animate({scrollLeft: w+'px'},300);
    }
}
