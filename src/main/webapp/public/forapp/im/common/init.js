/**
 * Created by Yihu on 2016/8/23.
 */
var im_bubble = $("<div id='im_bubble'onclick='intoIm(this)'"+
    " style='overflow: hidden;background-color:rgba(0, 0, 0, 0.82);width: 100%;height:70px;position: absolute;top: 0;left:0;" +
    "z-index: 3000;display: none;box-sizing:border-box;padding: 10px 15px;'>" +
    "<img src='' style='width: 50px;height: 50px;border-radius: 50%;position: absolute;border: 2px solid #d3d3d3;margin-top: -2px;'>" +
    '<div style="height: 100%;margin-left: 60px;">'+
    '<div name="bubble_name" style="font-size: 18px;line-height: 25px;color: #f2f2f2;"></div>'+
    '<div name="bubble_con" style="line-height: 25px;width: 100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;color: #e8e8e8">' +
    '</div>'+
    '</div>'+
    "</div>");
$("#localframe").before(im_bubble);
var osRun,showPanel, beforeRun = true,msgList,nMsgs , in_Talk = false;

var selType = null;//当前聊天类型
var selToID = null;//当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
var selSess = null;//当前聊天会话对象

//当前用户身份
var loginInfo = {
    'sdkAppID': '', //用户所属应用id,必填
    'appIDAt3rd': '', //用户所属应用id，必填
    'accountType': '', //用户所属应用帐号类型，必填
    'identifier': '', //当前用户ID,必须是否字符串类型，必填
    'identifierNick': null,
    'userSig': '',
    'headurl': null
};
var reqMsgCount =15,friendHeadUrl="";
//监听事件
var listeners ={};
var options={
    'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
    'isLogOn': false//是否开启控制台打印日志,默认开启，选填
};
var getPrePageC2CHistroyMsgInfoMap={};//保留下一次拉取好友历史消息的信息

document.addEventListener('pause', function () {
    beforeRun = false;

    window.clearInterval(osRun);
    $.ajax({
        async: false, dataType: 'jsonp', type: 'post',
        jsonp: "callback",
        jsonpCallback: "esg",
        data: {},
        url: sessionStorage["basePath"]+"/app/im/offline.do",
        success: function (rs) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
},false);

document.addEventListener('resume', function () {
    beforeRun = true;
    keepOnline();
    osRun = window.setInterval(keepOnline, 10000);

    if(!$("#im_bubble").is(':hidden')){
        showPanel = window.setInterval(function(){
            $("#im_bubble").hide();
            window.clearInterval(showPanel);
        },3000);
    }
    sendResult({"code":"im_reLogin_"});

},false);