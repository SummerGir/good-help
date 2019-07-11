//获取历史消息(c2c或者group)成功回调函数
//msgList 为消息数组，结构为[Msg]
function getHistoryMsgCallback(msgList , isPrePage) {
    var data = {
        code:"im_function",
        fname:"getHistoryMsgCallback",
        param:{msgList:msgList,isPrePage:isPrePage}
    };
    sendResult(data);
    for (var j in msgList) {
        var msg = msgList[j];
        if (msg.getSession().id() == selToID) {
            selSess = msg.getSession();
            break;
        }
    }
    webim.setAutoRead(selSess, true, true);
}

//获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
var getLastC2CHistoryMsgs = function () {

    if (selType == webim.SESSION_TYPE.GROUP) {
        alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
        return;
    }
    var lastMsgTime = Math.round(new Date().getTime() / 1000);//默认取当前时间
    var msgKey = '';
    var options = {
        'Peer_Account': selToID, //好友帐号
        'MaxCnt': reqMsgCount, //拉取消息条数
        'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
    };
    webim.getC2CHistoryMsgs(
            options,
            function (resp) {
                getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
                    'LastMsgTime': resp.LastMsgTime,
                    'MsgKey': resp.MsgKey
                };
                getHistoryMsgCallback(resp.MsgList);
            },
            null
            );
};

//向上翻页，获取更早的好友历史消息
var getPrePageC2CHistoryMsgs = function () {
    if (selType == webim.SESSION_TYPE.GROUP) {
        alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
        return;
    }
    var tempInfo = getPrePageC2CHistroyMsgInfoMap[selToID];//获取下一次拉取的c2c消息时间和消息Key
    var lastMsgTime;
    var msgKey;
    if (tempInfo) {
        lastMsgTime = tempInfo.LastMsgTime;
        msgKey = tempInfo.MsgKey;
    } else {
        return;
    }
    var options = {
        'Peer_Account': selToID, //好友帐号
        'MaxCnt': reqMsgCount, //拉取消息条数
        'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
    };
    webim.getC2CHistoryMsgs(
            options,
            function (resp) {
                getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
                    'LastMsgTime': resp.LastMsgTime,
                    'MsgKey': resp.MsgKey
                };
                getHistoryMsgCallback(resp.MsgList , true);
            },
            null
            );
};


//把消息转换成Html
function convertMsgtoHtml_text(msg) {
    var html = "", elems, elem, type, content;
    elems = msg.getElems();//获取消息包含的元素数组
    for (var i in elems) {
        elem = elems[i];
        type = elem.getType();//获取元素类型
        content = elem.getContent();//获取元素对象
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += content.getText();
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                html += "[表情]";
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE:
                html += "[图片]";
                break;
            case webim.MSG_ELEMENT_TYPE.SOUND:
                html += "[语音]";
                break;
            case webim.MSG_ELEMENT_TYPE.FILE:
                html += "[文件]";
                break;
            case webim.MSG_ELEMENT_TYPE.LOCATION://暂不支持地理位置
                //html += convertLocationMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.CUSTOM:
                html += "["+content.getDesc()+"]";
                break;
            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                html += "[群提示]";
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }
    }
    return html;
}

//监听新消息事件
//newMsgList 为新消息数组，结构为[Msg]
var onMsgNotify = function (newMsgList) {
    if(in_Talk){
        var unreadMap={};
        var sessMap = webim.MsgStore.sessMap();
        for (var i in sessMap) {
            sess = sessMap[i];
            unreadMap[sess.id()] = sess.unread();
        }
        var data = {
            code:"im_function",
            fname:"onMsgNotify",
            param:{newMsgList:newMsgList,unreadMap:unreadMap}
        };
        sendResult(data);
    }
    /*任何时候都走这里*/
    if(true){
        var sessMap = webim.MsgStore.sessMap();
        for (var i in sessMap) {
            var sess = sessMap[i];
            if(sess.unread()>0){
                if(nMsgs.indexOf(sess.id())>-1){
                    nMsgs.splice(nMsgs.indexOf(sess.id()), 1);
                }
                nMsgs.push(sess.id());
            }
        }

        for (var i in newMsgList) {
            var msg = newMsgList[i];
            if (parseInt(i) < newMsgList.length - 1) {
                var nextMsg = newMsgList[parseInt(i) + 1];
                if (msg.getSession().id() == nextMsg.getSession().id()) {
                    continue;
                }
            }
            var html = convertMsgtoHtml_text(msg);
            var fromAcc = msg.getFromAccount();
            if(msg.getSession().id() != selToID && parseInt(i)===newMsgList.length-1){
                !function(html1,fromAcc1,msg1){
                    $.ajax({
                        async: true, dataType: 'jsonp', type: 'post',
                        jsonp: "callback",
                        jsonpCallback: "esg",
                        data: {account:fromAcc1},
                        cache:true,
                        url: sessionStorage["basePath"]+"/app/im/getMemberName.do",
                        success: function (rs) {
                            if(rs && rs.name){
                                $("#im_bubble img").off("load").on("load",function(){
                                    $("#im_bubble div[name='bubble_name']").text(rs.name+"("+msg1.getSession().unread()+"条新消息)");
                                    $("#im_bubble div[name='bubble_con']").text(html1);
                                    $("#im_bubble").attr("to_id", fromAcc1);
                                    $("#im_bubble").show();
                                    if (showPanel) {
                                        window.clearInterval(showPanel);
                                    }
                                    if (beforeRun) {
                                        showPanel = window.setInterval(function () {
                                            $("#im_bubble").hide();
                                            window.clearInterval(showPanel);
                                        }, 3000);
                                    }
                                }).attr("src", sessionStorage["basePath"]+"/app/userinfo/member_outphoto.jsp?account="+ fromAcc1.split("@")[0]);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                }(html,fromAcc,msg);
            }

            /*首页*/
            var item = {
                "to_id": fromAcc,
                "con": html,
                "time": msg.getTime(),
                "unread": msg.getSession().unread()
            };
            msgList[fromAcc] = item;

            var sdMsg = {
                "code": "im_oneMsg",
                "msg": item
            };
            sendResult(sdMsg);

        }
    }

    if(selSess){
        webim.setAutoRead(selSess, true, true);
    }
};

var syncMsgs = function(){
    webim.syncMsgs(onMsgNotify);
};
