//切换好友或群组聊天对象
function onSelSess( param) {
    var to_id = param.to_id;
    if(selToID!=null){
        outSelSess();
    }
    selToID = to_id;
    in_Talk=true;
    //清空聊天界面
    if (selType == webim.SESSION_TYPE.GROUP) {
        selType = webim.SESSION_TYPE.C2C;
    }
    selSess = null;
    webim.MsgStore.delSessByTypeId(selType, selToID);
    getLastC2CHistoryMsgs(getHistoryMsgCallback,
        function (err) {
            alert(err.ErrorInfo);
        }
    );
    if(nMsgs.indexOf(to_id)>-1){
        nMsgs.splice(nMsgs.indexOf(to_id), 1);
    }
}
//离开好友聊天窗口
function outSelSess(){
    if(selSess){
        webim.setAutoRead(selSess, false, false);
    }
    selToID = null;
    selSess = null;
    in_Talk=false;
}

/*时间格式化*/
function myDateFormat( date ){
    var tody= new Date();
    var time = date.format("yyyy-MM-dd HH:mm")
    var time_ = time.substring(0,10);
    if( time_== tody.format("yyyy-MM-dd")){
        time = time.substr(11,5);
    }else if(time_ == tody.add("d",-1).format("yyyy-MM-dd")){
        time = "昨天";
    }else if(time_ == tody.add("d",-1).format("yyyy-MM-dd")){
        time = "前天";
    }else if(time_.substring(0,4) == tody.format("yyyy")){
        time =  date.format("M月d日");
    }else{
        time = time_;
    }
    return time;
}

function myDateFormat_HHmm( date ){
    var tody= new Date();
    var time = date.format("yyyy-MM-dd HH:mm")
    var time_ = time.substring(0,10);
    if( time_== tody.format("yyyy-MM-dd")){
        time = time.substr(11,5);
    }else if(time_ == tody.add("d",-1).format("yyyy-MM-dd")){
        time = "昨天 "+time.substr(11,5);
    }else if(time_ == tody.add("d",-1).format("yyyy-MM-dd")){
        time = "前天 "+time.substr(11,5);
    }else if(time_.substring(0,4) == tody.format("yyyy")){
        time =  date.format("M月d日")+" "+time.substr(11,5);
    }
    return time;
}


//监听连接状态回调变化事件
var onConnNotify =function (resp){
    switch(resp.ErrorCode){
        case webim.CONNECTION_STATUS.ON:
            break;
        case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
        default:
            webim.Log.error('未知连接状态,status='+resp.ErrorCode);
            break;
    }
}
//IE9(含)以下浏览器用到的jsonp回调函数
var jsonpCallback = function (rspData) {
    webim.setJsonpLastRspData(rspData);
}

function keepOnline(){
    $.ajax({
        async: true, dataType: 'jsonp', type: 'post',
        jsonp: "callback",
        jsonpCallback: "esg",
        data: {},
        url: sessionStorage["basePath"]+"/app/im/keepOnline.do",
        success: function (rs) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}
function intoIm(e){
    var to_id = $(e).attr("to_id");
    var url=sessionStorage["basePath"]+"/app/im/z/index.jsp?to_id="+to_id;
    $("#localframe").attr("src",url);
}
//sdk登录
function webimLogin() {
    webim.login(
        loginInfo, listeners, options,
        function (resp) {  //获取登录之前收到的未读
            msgList = {};
            nMsgs = [];
            webim.syncMsgs(onMsgNotify);
        },
        function (err) {
        }
    );
}
//获取参数
function init_im(){
    selType = webim.SESSION_TYPE.C2C
    listeners = {
        "onConnNotify": onConnNotify,
        "jsonpCallback": jsonpCallback,//IE9(含)以下浏览器用到的jsonp回调函数
        "onMsgNotify": onMsgNotify,//监听新消息(私聊，群聊，群提示消息)事件
        "onGroupInfoChangeNotify": {},//监听群资料变化事件
        "groupSystemNotifys": {}//监听（多终端同步）群系统消息事件
    };
    $.ajax({
        async: false, dataType: 'jsonp', type: 'post',
        jsonp: "callback",
        jsonpCallback: "esg",
        data: {account:sessionStorage["username"]},
        url: sessionStorage["basePath"]+"/public/forapp/im/getImInfo.jsp",
        success: function (rs) {
            loginInfo.sdkAppID = rs.sdkAppID;
            loginInfo.appIDAt3rd = rs.sdkAppID;
            loginInfo.accountType = rs.accountType;
            loginInfo.identifier = rs.identifier;
            loginInfo.identifierNick = rs.identifierNick;
            loginInfo.userSig = rs.userSig;
            webimLogin();
            keepOnline();
            osRun = window.setInterval(keepOnline, 10000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });

    window.addEventListener('message',function(e){
        var data = e.data;
        if(data.code =='im_function_toApp'){
            try{
                var fname = eval(data.fname);
                if (typeof fname === 'function'){
                    fname.call(this,data.param);
                }
            }catch(e){
                console.log("im_app:["+data.fname+"]"+e);
            }
        }else if(data.code == 'getHomeMsgList'){
            var re ={
                "code":"returnHomeMsgList",
                "nMsgs" : nMsgs,
                "msgList" : msgList
            };
            sendResult(re);
        }
    },false);
}