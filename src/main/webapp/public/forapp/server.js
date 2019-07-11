var server ={
    init: function () {
        document.addEventListener('deviceready', function () {
            try{
                if(window.orientation ==0 || window.orientation ==180){
                    screen.lockOrientation('portrait');
                }else{
                    entryIsHengp = true;
                }
            }catch(e){}

            window.addEventListener('message',function(e){
                var data = e.data;
                if(data.code=='setIndexData'){
                    setIndexData(data);
                }else if(data.code=='getIndexData'){
                    getIndexData();
                }else if(data.code=='setValue'){
                    setValue(data);
                }else if(data.code=='getValue'){
                    getValue(data.key);
                }else if(data.code=='watchPosition'){
                    try{
                        esg.gps.watchPosition (false,success,fail);
                    }catch(e){
                        esg = reLoadGps();
                        esg.gps.watchPosition (false,success,fail);
                    }
                }else if(data.code=='clearWatch'){
                    try{
                        esg.gps.clearWatch();
                    }catch(e){
                        //alert("clearWatch:"+JSON.stringify(e));
                    }

                }else if(data.code=='getDeviceCode'){
                    var re={};
                    re.code = 'returnDeviceCode';
                    re.deviceCode = device.uuid;
                    sendResult(re);
                }else if(data.code=='iframe_center'){
                    if($("#localframe").height()>window.innerHeight){
                        window.scrollTo(0,($("#localframe").height()-window.innerHeight)/2);
                    }
                }else if(data.code=='iframe_bottom'){
                    if($("#localframe").height()>window.innerHeight){
                        window.scrollTo(0,($("#localframe").height()-window.innerHeight)+1000);
                    }
                }else if (data.code == 'esgApp_function') {
                    try {
                        var fname = eval(data.fname);
                        if (typeof fname === 'function') {
                            fname.call(this, data.param);
                        }
                    } catch (error) {
                        alert("抱歉，出错了。esgApp_function:["+data.fname+"]"+JSON.stringify(error));
                    }
                }

            },false);

            lf_height = window.innerHeight;
            cordova.getAppVersion.getVersionNumber(function (version) {
                app_version = parseInt(version.split(".").join(''));
                var ver_num;
                if (device.platform == "iPhone"
                    || device.platform == "iPad"
                    || device.platform == "iPod touch"
                    || device.platform == "iOS") {
                    ver_num = parseInt(device.version.split(".")[0]);
                }
                if(ver_num<11 && ver_num>=7 && app_version >=171){
                    iosGe7 = true;
                    $("#localframe").before("<div name='signal' style='background-color: #2dcc70;height: 20px;width: 100%'> </div>");
                    if(entryIsHengp){
                        $("div[name='signal']").hide();
                    }else{
                        lf_height = lf_height -20;
                    }
                }
                var url;
                if(sessionStorage.getItem("url")!="undefined" && sessionStorage.getItem("url")!=null && sessionStorage.getItem("url")!=""){
                    url=sessionStorage["basePath"]+"/anon/loginservlet?autoRedirect=true&username="+sessionStorage["username"]
                        +"&password="+sessionStorage["password"]+"&successUrl="+encodeURIComponent(sessionStorage.getItem("url"));
                }else {
                    url=sessionStorage["basePath"]+"/anon/loginservlet?autoRedirect=true&username="+sessionStorage["username"]
                        +"&password="+sessionStorage["password"]+"&successUrl=%2Ftheme%2Fcurrent%2Findex.jsp";
                }
                $("#local").hide();
                $("#localframe").attr("src",url);
                $("#localframe").css({"border":"0px","display":"block"});
                $("#localframe").css("height", lf_height+ 'px');
                $("#localframe").show();
                sessionStorage.setItem("islogin","true");
            });

            document.addEventListener("backbutton", function(){
                var re={
                    code : "esgWeb_function",
                    fname : "sys_backbutton_click",
                    param : {}
                };
                sendResult(re);
                e.preventDefault();
            }, false);
            window.addEventListener("orientationchange", function(e){
                window_resize();
            });
        },false);

        getImJS();
    }
};

var iosGe7 = false, lf_height,app_version,entryIsHengp=false;
server.init();
function success(re){
    re.code ='returnLocation';
    re.error = 0;
    sendResult(re);
}
function fail(re){
    re.code = 'returnLocation';
    re.error = 1;
    sendResult(re);
}
function sendResult( data){
    document.getElementById("localframe").contentWindow.postMessage(data,sessionStorage["basePath"]);
}
var indexData={};
function setIndexData(data){
    indexData[data.key] = data.value;
}
function getIndexData(){
    var re={};
    re.code ='returnIndexData';
    re.data = indexData;
    sendResult(re);
}

var app={};
function setValue(data){
    app[data.key] = data.value;
}
function getValue(key){
    var re={}
    re.code = 'returnValue';
    try{
        re.value = eval(key);
        re.key = key;
        re.error = 0;
    }catch(ee){
        re.error = 1;
    }
    sendResult(re);
}

function getImJS(){
    var b1,b2,b3,b4,b5,b6,b7;
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/sdk/json2.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b1=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/sdk/webim.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b2=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/sdk/spark-md5.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b3=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/msg/get_history_and_new_msg.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b4=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/msg/upload_and_send_msg.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b5=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/common/base.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b6=true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
    $.ajax({
        url: sessionStorage["basePath"]+"/public/forapp/im/common/init.js",
        type: "POST",dataType:'script',async: true,cache:true,
        success:function(rs){
            b7 = true;
            if(b1 && b2 && b3 && b4 && b5 && b6 && b7){
                try{
                    init_im();
                }catch(e){
                    console.log("init:"+e);
                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        }
    });
}

function callFriend(param){
    var tel = param.tel;
    window.open('tel:' + tel,'_system');
}
function sendSms(param) {
    var number = param.number;
    var message = param.message;
    window.open('sms:' + number,'_system');
    //window.open('sms:' + number+"?body="+message);
}

function logout(){
    try {
        webim.logout();
    } catch (e) {
    }
    sessionStorage.clear();
    menu.logout();
}
function chenageAccount(){
    sessionStorage.clear();
    localStorage.clear();
    logout();
}

function openInBrowser(param){
    var url = param.url;
    var target = param.target;
    var options = param.options;
    cordova.InAppBrowser.open(url, target, options);
}

var oldSize={};
function window_resize(){
    var height = window.innerHeight;
    var width = window.innerWidth;
    if(height ==oldSize.height || width == oldSize.width
        || ((window.orientation ==90 || window.orientation ==-90) && height>width)
        || ((window.orientation ==0 || window.orientation ==180) && height<width)
    ){
        setTimeout(function(){
            window_resize();
        },100);
        return;
    }
    if(width > height){ //横屏
        if(iosGe7){
            $("div[name='signal']").hide();
        }
        $("#localframe").css("height", height+ 'px');
    }else{ //竖屏
        if(iosGe7){
            $("div[name='signal']").show();
        }
        if(entryIsHengp){ //重新计算默认高度
            if(iosGe7){
                lf_height =  height-20;
            }else{
                lf_height =  height;
            }
            entryIsHengp = false;
        }

        $("#localframe").css("height", lf_height+ 'px');
        height = lf_height;
    }
    var data = {
        code : "esgWeb_function",
        fname : "onWindowResize",
        param : {width:width,height:height}
    };
    sendResult(data);
}
function screenChange(param){
    var s = window.orientation;
    if(param.unlock){ //再锁定 苹果会闪退
        screen.unlockOrientation();
    }else if(param.hengping){
        if(window.orientation ==90 || window.orientation ==-90) return;
        oldSize={
            width:window.innerWidth,
            height:window.innerHeight
        };
        screen.lockOrientation('landscape');
    }else{
        if(window.orientation ==0 || window.orientation ==180) return;
        oldSize={
            width:window.innerWidth,
            height:window.innerHeight
        };
        screen.lockOrientation('portrait');
    }
}
function reLoadGps(){
    var esg = {
        key:"234BZ-JL33X-NXH4R-7KLLX-QII6Q-NGFMX"
    };
    esg.mapconvertor = {
        PI : 3.14159265358979324,
        x_pi : 3.14159265358979324 * 3000.0 / 180.0,
        delta : function (lat, lon) {
            // Krasovsky 1940
            //
            // a = 6378245.0, 1/f = 298.3
            // b = a * (1 - f)
            // ee = (a^2 - b^2) / a^2;
            var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
            var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
            var dLat = this.transformLat(lon - 105.0, lat - 35.0);
            var dLon = this.transformLon(lon - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * this.PI;
            var magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
            return {'lat': dLat, 'lon': dLon};
        },

        //WGS-84 to GCJ-02
        gcj_encrypt : function (wgsLat, wgsLon) {
            if (this.outOfChina(wgsLat, wgsLon))
                return {'lat': wgsLat, 'lon': wgsLon};

            var d = this.delta(wgsLat, wgsLon);
            return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
        },
        //GCJ-02 to WGS-84
        gcj_decrypt : function (gcjLat, gcjLon) {
            if (this.outOfChina(gcjLat, gcjLon))
                return {'lat': gcjLat, 'lon': gcjLon};

            var d = this.delta(gcjLat, gcjLon);
            return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
        },
        //GCJ-02 to WGS-84 exactly
        gcj_decrypt_exact : function (gcjLat, gcjLon) {
            var initDelta = 0.01;
            var threshold = 0.000000001;
            var dLat = initDelta, dLon = initDelta;
            var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
            var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
            var wgsLat, wgsLon, i = 0;
            while (1) {
                wgsLat = (mLat + pLat) / 2;
                wgsLon = (mLon + pLon) / 2;
                var tmp = this.gcj_encrypt(wgsLat, wgsLon)
                dLat = tmp.lat - gcjLat;
                dLon = tmp.lon - gcjLon;
                if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                    break;

                if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
                if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

                if (++i > 10000) break;
            }
            //console.log(i);
            return {'lat': wgsLat, 'lon': wgsLon};
        },
        //GCJ-02 to BD-09
        bd_encrypt : function (gcjLat, gcjLon) {
            var x = gcjLon, y = gcjLat;
            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
            bdLon = z * Math.cos(theta) + 0.0065;
            bdLat = z * Math.sin(theta) + 0.006;
            return {'lat' : bdLat,'lon' : bdLon};
        },
        //BD-09 to GCJ-02
        bd_decrypt : function (bdLat, bdLon) {
            var x = bdLon - 0.0065, y = bdLat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
            var gcjLon = z * Math.cos(theta);
            var gcjLat = z * Math.sin(theta);
            return {'lat' : gcjLat, 'lon' : gcjLon};
        },
        //WGS-84 to Web mercator
        //mercatorLat -> y mercatorLon -> x
        mercator_encrypt : function(wgsLat, wgsLon) {
            var x = wgsLon * 20037508.34 / 180.;
            var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
            y = y * 20037508.34 / 180.;
            return {'lat' : y, 'lon' : x};
        },
        // Web mercator to WGS-84
        // mercatorLat -> y mercatorLon -> x
        mercator_decrypt : function(mercatorLat, mercatorLon) {
            var x = mercatorLon / 20037508.34 * 180.;
            var y = mercatorLat / 20037508.34 * 180.;
            y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
            return {'lat' : y, 'lon' : x};
        },
        // two point's distance
        distance : function (latA, lonA, latB, lonB) {
            var earthR = 6371000.;
            var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
            var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
            var s = x + y;
            if (s > 1) s = 1;
            if (s < -1) s = -1;
            var alpha = Math.acos(s);
            var distance = alpha * earthR;
            return distance;
        },
        outOfChina : function (lat, lon) {
            if (lon < 72.004 || lon > 137.8347)
                return true;
            if (lat < 0.8293 || lat > 55.8271)
                return true;
            return false;
        },
        transformLat : function (x, y) {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
            return ret;
        },
        transformLon : function (x, y) {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
            return ret;
        }
    };
    esg.gps = {
        _watchid: null,
        _lat: "",
        _lng: "",
        clearWatch: function () {
            if (null != esg.gps._watchid) {
                navigator.geolocation.clearWatch(esg.gps._watchid);
            }
            esg.gps._lat="";
            esg.gps._lng="";
            esg.gps._gpsStop();
        },
        watchPosition: function (manual, success, fail) {
            esg.gps.clearWatch();

            esg.gps._getGPSLocation(manual,success, function(){
                esg.gps.clearWatch();
                esg.gps._h5WatchPosition(manual, success, fail);
            });

        },
        _h5WatchPosition: function(manual, success, fail){
            var posOptions = {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000};
            var _watchid = navigator.geolocation.watchPosition(function (org_pos) {
                var position = {
                    coords: {}
                };
                var convertobj = esg.mapconvertor.gcj_encrypt(org_pos.coords.latitude, org_pos.coords.longitude);

                position.coords.lat = convertobj.lat;
                position.coords.lng = convertobj.lon;
                if (!manual) {
                    if (esg.gps._lat != convertobj.lat && esg.gps._lng != convertobj.lon) {
                        esg.gps._lat = convertobj.lat;
                        esg.gps._lng = convertobj.lon;
                        esg.callBackFunction(success, position);
                    }
                } else {
                    esg.gps.clearWatch();
                    esg.callBackFunction(success, position);
                }

            }, fail, posOptions);
            esg.gps._watchid = _watchid;
        },
        /*
         * 安卓 对应 腾讯sdk
         * ios  原生 gps —> 火星
         * */
        _getGPSLocation: function (manual, success, fail) {
            window.gps.getLocation(function (arraydata) {
                var position = {
                    coords: {}
                };
                if (window.device.platform == "Android") {
                    position.coords.lat = arraydata[0];
                    position.coords.lng = arraydata[1];
                } else {
                    var convertobj = esg.mapconvertor.gcj_encrypt(arraydata[0], arraydata[1]);
                    position.coords.lat = convertobj.lat;
                    position.coords.lng =  convertobj.lon;
                }
                if (!manual) {
                    if (esg.gps._lat != position.coords.lat && esg.gps._lng != position.coords.lng) {
                        esg.gps._lat = position.coords.lat;
                        esg.gps._lng = position.coords.lng;
                        esg.callBackFunction(success, position);
                    }
                } else {
                    esg.gps._gpsStop();
                    esg.callBackFunction(success, position);
                }
            }, function (err) {
                esg.callBackFunction(fail, err);
            },manual);
        },
        _gpsStop: function () {
            if (window.gps) {
                window.gps.stopLocation();
            }
        }

    };
    esg.callBackFunction = function (func, data) {
        if (typeof (func) == "function") {
            if (null != data) {
                func.apply(this, [data]);
            } else {
                func.apply(this);
            }
        }
    };
    return esg;
}

function clearCache() {
    if(!window.cache){
        var data = {
            code : "esgWeb_function",
            fname : "clearCacheCallback",
            param : {error:true,msg:"请升级到最新版APP再使用本功能。"}
        };
        sendResult(data);
        return;
    }
    var success = function(status) {
        var data = {
            code : "esgWeb_function",
            fname : "clearCacheCallback",
            param : {error:false}
        };
        sendResult(data);
    };
    var error = function(status) {
        var data = {
            code : "esgWeb_function",
            fname : "clearCacheCallback",
            param : {error:true,msg:"出错了。"}
        };
        sendResult(data);
    };

    window.cache.clear(success, error);
}

var delSessByTypeId = function(param){
    webim.MsgStore.delSessByTypeId(param.type,param.id);
};

//语音播报
function startSpeak(param) {
    if(xunfeiListenSpeaking && xunfeiListenSpeaking.startSpeak )
        xunfeiListenSpeaking.startSpeak(null,null,param.str);
}

//语音暂停播报
function pauseSpeaking() {
    if(xunfeiListenSpeaking && xunfeiListenSpeaking.pauseSpeaking )
        xunfeiListenSpeaking.pauseSpeaking();
}

//语音暂停之后继续播报
function resumeSpeaking () {
    if(xunfeiListenSpeaking && xunfeiListenSpeaking.resumeSpeaking  )
        xunfeiListenSpeaking.resumeSpeaking();
}

//语音停止播报
function stopSpeak() {
    if(xunfeiListenSpeaking && xunfeiListenSpeaking.stopSpeak )
        xunfeiListenSpeaking.stopSpeak();
}

function zbarScanner() {
    if(typeof Wechat == undefined || !Wechat){
        var re={
            code : "esgWeb_function",
            fname : "scanner_callback",
            param : {error:true,data:"请更新到最新版App再使用此功能"}
        };
        sendResult(re);
        return;
    }
    if(!Wechat.MINI_TYPE){
        Wechat.MINI_TYPE = {
                RELEASE: 0,
                TEST:    1,
                PREVIEW: 2
        };
        Wechat.my_MINI_USERNAME={
                esg: "gh_f932b518f5c0",//esg小程序原始id
                cff: "gh_b60ae0123c65" //cff小程序原始id
        };
    }
    Wechat.launchMiniProgram({
        mini_type:Wechat.MINI_TYPE.RELEASE ,
        mini_username:Wechat.my_MINI_USERNAME.esg,
        url:""
    },function (res) {
        // alert(JSON.stringify(res))
        var re={
            code : "esgWeb_function",
            fname : "scanner_callback",
            param : {error:false,data:res.data}
        };
        sendResult(re);
    }, function (reason) {
        // alert(JSON.stringify(reason))
        var re={
            code : "esgWeb_function",
            fname : "scanner_callback",
            param : {error:true,data:reason}
        };
        sendResult(re);
    })
}

function wechat_share(param) {
    try{
        // alert(param);eval('$.extend(true,{},'+param+')')
        Wechat.share(param, function (res) {
            // alert("share_success");
            var re={
                code : "esgWeb_function",
                fname : "wechat_share_callback",
                param : {error:false,data:res}
            };
            sendResult(re);
        }, function (reason) {
            // alert("share_failed: " + reason);
            var re={
                code : "esgWeb_function",
                fname : "wechat_share_callback",
                param : {error:true,data:reason}
            };
            sendResult(re);
        });
    }catch (error){
        var re={
            code : "esgWeb_function",
            fname : "wechat_share_callback",
            param : {error:true,data:error}
        };
        sendResult(re);
        alert(JSON.stringify(error));
    }

}


function exitApp() {
   if(confirm("您确定要退出吗？","提示")){
       navigator.app.exitApp();
   }
}

if(!window.menu){
    window.menu = {
        exitApp: function(){
            navigator.app.exitApp();
        },
        logout: function(){
            sessionStorage["basePath"]="";
            sessionStorage["username"]="";
            sessionStorage["password"]="";
            sessionStorage["globalaccount"]="";
            localStorage["savePassword"]="";
            localStorage["saveCheck"]="false";
            window.location.href = 'index.html';
        }
    };
}
