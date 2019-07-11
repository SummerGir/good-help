var push = function () {
}
push.prototype = {
    init: function (alias) {
        var onOpenNotification = function(event) {
            try {
                var url;
                if(event.successUrl_push!=undefined){
                    url=event.successUrl_push;
                }else {
                    url=event.extras.successUrl_push;
                }
                sessionStorage.setItem("url",url);
                if( sessionStorage.getItem("basePath")!="undefined" && sessionStorage.getItem("basePath")!="" && sessionStorage.getItem("basePath")!=null && sessionStorage.getItem("url")!="undefined" && sessionStorage.getItem("url")!=null && sessionStorage.getItem("url")!=""){
                    for(var i = 1; i <=100 ; i++){
                        if(sessionStorage.getItem("islogin")=="true"){
                            $("#localframe").attr("src",sessionStorage.getItem("basePath")+sessionStorage.getItem("url"));
                            break
                        }
                        sleep(100);
                    }
                }else {
                    index.loginSubmit();//自动登录
                }
            }
            catch (exception) {
                console.log("JPushPlugin:onOpenNotification-->" + exception);
            }
        };
        //点击消息跳转时判断是否登陆时循环验证的休眠方法
        var  sleep= function(numberMillis) {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
            }
        };
        var onReceiveNotification = function(event) {

        };
        var onReceiveMessage = function(event) {
            try {
                var myType=event.extras.myType;
                var myValue=event.extras.myValue;
                if(myType=="badge"){
                    var re = /^[0-9]+.?[0-9]*$/;
                    if (re.test(myValue) && myValue>=0){
                        window.JPush.setBadge(myValue);
                        window.JPush.setApplicationIconBadgeNumber(myValue);
                    }
                }
            } catch (exception) {
                console.log("JPushPlugin:onReceiveMessage-->" + exception);
            }
        };
        //得到注册ID，
        var onGetRegistrationID = function(data) {
            try {
                console.log("JPushPlugin:registrationID is " + data);
                if (data.length == 0) {
                    var t1 = window.setTimeout(getRegistrationID, 1000);
                }
                // alert(data);
                $("#registrationId").html(data);
            } catch (exception) {
                console.log(exception);
            }
        };
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
        if(alias && alias!="undefined"){
            setTimeout(function () {
                var aliass=alias.toLocaleLowerCase().split("@");
                if(aliass.length>1){
                    var nAlias=aliass[0]+"__"+aliass[1];
                    var tags = [aliass[1]];

                    // window.JPush.getRegistrationID(onGetRegistrationID);
                    //设置别名
                    window.JPush.setAlias({ sequence: 1, alias: nAlias },
                        function (result) {
                            // alert("setAlias:"+JSON.stringify(result));
                        }, function (error){
                            // alert("设置别名失败:"+JSON.stringify(error));
                        }
                    );

                    //设置标签
                    window.JPush.setTags({ sequence: 1, tags: tags },
                        function (result) {
                            // alert("setTags:"+JSON.stringify(result));
                        }, function (error) {
                            // alert("设置标签失败："+JSON.stringify(error))
                        }
                    );
                }
            },100);
        }

    }

};

document.addEventListener('deviceready', function(){
    new push().init(localStorage["saveUsername"]);
}, false);
