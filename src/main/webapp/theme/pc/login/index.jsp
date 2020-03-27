<%@ page import="com.google.common.base.Strings" %>
<%@ page import="com.google.common.escape.Escaper" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%!
    private static final Escaper JavascriptEscaper = SourceCodeEscapers.javascriptEscaper();
    public boolean JudgeIsMoblie(HttpServletRequest request) {
        boolean isMoblie = false;
        String[] mobileAgents = { "iphone", "android", "phone", "mobile", "wap", "netfront", "java", "opera mobi",
                "opera mini", "ucweb", "windows ce", "symbian", "series", "webos", "sony", "blackberry", "dopod",
                "nokia", "samsung", "palmsource", "xda", "pieplus", "meizu", "midp", "cldc", "motorola", "foma",
                "docomo", "up.browser", "up.link", "blazer", "helio", "hosin", "huawei", "novarra", "coolpad", "webos",
                "techfaith", "palmsource", "alcatel", "amoi", "ktouch", "nexian", "ericsson", "philips", "sagem",
                "wellcom", "bunjalloo", "maui", "smartphone", "iemobile", "spice", "bird", "zte-", "longcos",
                "pantech", "gionee", "portalmmm", "jig browser", "hiptop", "benq", "haier", "^lct", "320x320",
                "240x320", "176x220", "w3c ", "acs-", "alav", "alca", "amoi", "audi", "avan", "benq", "bird", "blac",
                "blaz", "brew", "cell", "cldc", "cmd-", "dang", "doco", "eric", "hipt", "inno", "ipaq", "java", "jigs",
                "kddi", "keji", "leno", "lg-c", "lg-d", "lg-g", "lge-", "maui", "maxo", "midp", "mits", "mmef", "mobi",
                "mot-", "moto", "mwbp", "nec-", "newt", "noki", "oper", "palm", "pana", "pant", "phil", "play", "port",
                "prox", "qwap", "sage", "sams", "sany", "sch-", "sec-", "send", "seri", "sgh-", "shar", "sie-", "siem",
                "smal", "smar", "sony", "sph-", "symb", "t-mo", "teli", "tim-", "tosh", "tsm-", "upg1", "upsi", "vk-v",
                "voda", "wap-", "wapa", "wapi", "wapp", "wapr", "webc", "winw", "winw", "xda", "xda-",
                "Googlebot-Mobile" };
        if (request.getHeader("User-Agent") != null) {
            for (String mobileAgent : mobileAgents) {
                if (request.getHeader("User-Agent").toLowerCase().indexOf(mobileAgent) >= 0) {
                    isMoblie = true;
                    break;
                }
            }
        }
        return isMoblie;
    }
%>
<%
    // response.sendRedirect("http://www.e-sg.cn");
    if (SecurityUtils.getSubject().isAuthenticated()) {
        response.sendRedirect("/theme/current/index.jsp");
    }
    String topDeptName = eiis.membership.Dept.getTopDept().getName();

    String successUrl = "";
    try {
        successUrl = URLDecoder.decode(Strings.nullToEmpty(eiis.context.Context.getCurrent().getRequest().getCookieValue(SSOFilter.LOGIN_SUCCESS_URL)), eiis.context.Context.getCharset().name());
    } catch (Exception e) {
    }
    if (Strings.isNullOrEmpty(successUrl)) {
        successUrl = "/theme/current/index.jsp";
    }

    String loginAccount = "";
    String loginPassword = "";

    /*try {
        loginAccount = URLDecoder.decode(Strings.nullToEmpty(eiis.context.Context.getCurrent().getRequest().getCookieValue(LoginServlet.SAVE_LOGIN_ACCOUNT)), eiis.context.Context.getCharset().name());
    } catch (Exception e) {
    }
    if (!Strings.isNullOrEmpty(loginAccount)) {
        try {
            loginPassword = eiis.util.crypto.SimpleCrypto.decrypto(eiis.context.Context.getCurrent().getRequest().getCookieValue(LoginServlet.SAVE_LOGIN_PASSWORD), loginAccount);
        } catch (Exception e) {
        }
        if (Strings.isNullOrEmpty(loginPassword)) {
            loginAccount = "";
        }
    }*/



    if (Strings.isNullOrEmpty(loginAccount)) {
        try {
            loginAccount = URLDecoder.decode(Strings.nullToEmpty(eiis.context.Context.getCurrent().getRequest().getCookieValue(LoginServlet.LAST_LOGIN_ACCOUNT)), eiis.context.Context.getCharset().name());
            if(!Strings.isNullOrEmpty(loginAccount))loginPassword = eiis.util.crypto.SimpleCrypto.decrypto(eiis.context.Context.getCurrent().getRequest().getCookieValue(LoginServlet.SAVE_LOGIN_PASSWORD), loginAccount);
        } catch (Exception e) {
        }
    }


%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge">
    <title>登录 - EIIS 平台</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script type="text/javascript" src="/public/eiis/eiis.js"></script>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.bootstrap.font_awesome);
    </script>

    <link rel="stylesheet" href="/theme/current/css/base.css"/>
    <link rel="stylesheet" href="/theme/current/login/login.css"/>

    <!-- HTML5 Support for IE -->
    <!--[if lt IE 9]>
    <script src="/public/old-ie/html5shiv.min.js"></script>
    <script src="/public/old-ie/respond.min.js"></script>
    <![endif]-->

    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.form);
        EIIS.Common.loadComponent(EIIS.Common.UI);
    </script>
    <style type="text/css">
        .padd{
            color:#333;
            font-size: 14px;
        }
        #appDownload{ text-align: right; position: absolute;right: 0;top: -65px;height: 64px;}
    </style>
    <script type="text/javascript">
        var successUrl = "<%=JavascriptEscaper.escape(successUrl)%>";

        $(document).ready(function () {

            var formData = {
                "username": "",
                "password": "",
                "save": "-1"
            };

            $(".loginForm").on("submit", function () {
                var savePassword = $("input[name='savePassword']:checked").length > 0 ? "true" : "false";
                formData.username = $(":text.username").val();
                var name = formData.username.split("@");
                formData.username = name;
                if (String.isNullOrWhiteSpace(formData.username)) {
                    $.message({
                        caption: '错误',
                        text: '用户名不能为空！',
                        button: $.message.button.ok,
                        icon: $.message.icon.warning,
                        result: null
                    });
                    return false;
                }
                formData.password = $(":password.password").val();
                if (String.isNullOrWhiteSpace(formData.password)) {
                    $.message({
                        caption: '错误',
                        text: '用户密码不能为空！',
                        button: $.message.button.ok,
                        icon: $.message.icon.warning,
                        result: null
                    });
                    return false;
                }
                $.message.loader.open("正在登录中...");

                if( savePassword == "true") {
                    formData.save = "12";
                }

                $.ajax({
                    url: "/anon/loginservlet",
                    dataType: 'json',
                    type: "POST",
                    data: formData,
                    error: function (jqXHR) {
                        $.message({
                            caption: '错误',
                            text: '用户名或密码不正确.',
                            button: $.message.button.ok,
                            icon: $.message.icon.warning,
                            result: null
                        });
                        //$.message.ajaxError(jqXHR);
                        setTimeout(function () {
                            $.message.loader.close();
                        }, 300);
                    },
                    success: function (data) {
                        if (data.error) {
                            $.message({
                                caption: '错误',
                                text: data.mes,
                                button: $.message.button.ok,
                                icon: $.message.icon.error,
                                result: null
                            });
                            setTimeout(function () {
                                $.message.loader.close();
                            }, 300);
                        } else {
                            $("body").html("<script type=\"text/javascript\">$.message.loader.open(\"正在登录中...\");window.location.href = successUrl;<\/script>");
                        }
                    }
                });
                //$("#account").focus();
                return false;
            });

//            var createPassword = function (pas) {
//                var t = pas;
//                do {
//                    t = Math.floor(Math.random() * 9999999999 + 1000000000).toString();
//                } while (t.equalsIgnoreCase(pas));
//                return t;
//            };

//            $(":password.password").on("change", function () {
//                formData.password = $(this).val();
            //$(this).val(createPassword());
//            });
            /*$(":password.password").on("focus", function () {
             $(this).val(formData.password);
             });*/

            $(":text.username").val("<%=JavascriptEscaper.escape(loginAccount)%>");

            $(":password.password").val("<%=JavascriptEscaper.escape(loginPassword)%>");
            if (String.isNullOrWhiteSpace($(":text.username").val())) {
                $(":text.username").focus();
            } else {
                $(":password.password").focus();
            }

        });

        var rand1 = 0;
        var useRand = 0;
        images = new Array;
        images[1] = new Image();
        images[1].src = "images/01.png";
        images[2] = new Image();
        images[2].src = "images/02.png";
        images[3] = new Image();
        images[3].src = "images/03.png";
        images[4] = new Image();
        images[4].src = "images/datupian_03.png";
        function swapPic() {
            var imgnum = images.length - 1;
            do {
                var randnum = Math.random();
                rand1 = Math.round((imgnum - 1) * randnum) + 1;
            } while (rand1 == useRand);
            useRand = rand1;
            console.log(images[useRand].src);
            document.randimg.src = images[useRand].src;
        }
    </script>

</head>

<body style="background:repeat;" OnLoad="swapPic()">

<!-- Form area -->
<div class="container">
    <div class="row">
        <a href="http://www.shuqingkeji.com"><img src="images/logo_03.png"></a>
    </div>
    <div class="row">
        <div class="col-xs-12 col-md-7 hidden-xs hidden-sm" style="padding-top: 10px;" align="center">
            <%-- <img align="right" src="images/datupian_03.png"/>--%>
            <img name="randimg" align="center" src="">
        </div>
        <div class="col-xs-12 col-md-4" style="padding:0px;" id="center_right">
            <div class="row" style="padding-top: 15%">
                <div id="appDownload" class="hidden-xs">
                    <table style="height: 64px;">
                        <tbody><tr>
                            <td style="font-size: 16px;color: #919191;font-weight:bold;text-align: center;vertical-align: bottom;padding-right: 10px;">下载安装</td>
                            <td rowspan="2">
                                <img style="height: 64px;width: 64px;" src="images/appDownload.png">
                            </td>



                        </tr>
                        <tr>
                            <td style="font-size: 12px;color: black;padding-right: 10px;">e施工APP</td>



                        </tr>
                        </tbody></table>

                </div>
                <div class="admin-form" style="float: right;border:1px #aaa solid;border-top: 2px #28468c solid;width:80%;margin: 0 auto;">
                    <div class="row" style="margin-left: 0;margin-right:0;padding:0;">
                        <div class="col-md-12">
                            <!-- Widget starts -->
                            <div class="widget worange" style="background: repeat;margin-top: 0; margin-bottom: 0;border: 0;">
                                <!-- Widget head -->
                                <div class="widget-head" style="background: repeat;text-align: center;border-bottom:0;">
                                    企业登录
                                    <hr style="border-top:1px solid;width:97%;margin-top:3px;">
                                </div>

                                <div class="widget-content">
                                    <div class="padd">
                                        <!-- Login form -->
                                        <form class="form-horizontal loginForm" method="post">
                                            <!-- Email -->
                                            <div class="form-group">
                                                <label class="col-xs-4 col-sm-3 col-md-3" for="inputAccount" style="float: left;padding-top: 7px;">账号：</label>

                                                <div class="col-xs-8 col-sm-9 col-md-9" style="float: right;padding-left: 0px;">
                                                    <input type="text" name="username" class="form-control username"
                                                           id="inputAccount"
                                                           placeholder="输入账号或手机号">
                                                </div>
                                            </div>
                                            <!-- Password -->
                                            <div class="form-group">
                                                <label class="col-xs-4 col-sm-3 col-md-3" for="inputPassword" style="float: left;padding-top: 7px;">密码：</label>

                                                <div class="col-xs-8 col-sm-9 col-md-9" style="float: right;padding-left: 0px;">
                                                    <input type="password" class="form-control password"
                                                           id="inputPassword"
                                                           placeholder="输入密码">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="control-label col-lg-3" for="savePassword" style="width:90px;text-align: left;">记住密码：</label>
                                                <input type="checkbox" id="savePassword" checked name="savePassword">
                                            </div>
                                            <div class="row" style="margin-bottom: 15px;font-size: 12px;">
                                                <div class="col-md-12">
                                                    登录即同意《<a href="userServiceAgreement.jsp" target="_blank">用户服务协议</a>》、《<a
                                                        href="confidentialityAgreement.jsp" target="_blank">保密协议</a>》
                                                </div>
                                            </div>
                                            <!-- button -->
                                            <div class="col-xs-12 col-md-12 " style="padding-right:0;padding-left: 0;margin-left:0;width: 100%;height: 46px;font-size:18px;">
                                                <button type="submit" class="btn btn-lg btn-success  btn-block" data-type="submit" style="width: 100%;background-color:#28468c;border-color: #28468c;height: 100%;font-size:18px !important;">登录</button>
                                            </div>
                                            <div class="col-xs-6 col-sm-6 col-md-6"  style="padding-top: 10px;padding-left: 0;">
                                                <a href="http://www.shuqingkeji.com" id="sy">返回首页</a>
                                            </div>
                                            <br/>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="line-height: 24px;padding-left: 23%;color: #000000;">
                下载Chrome(谷歌浏览器)请
                <a href="chrome_48.zip" target="_blank">点击此处</a>
            </div>
        </div>
    </div>
</div>
<span id="exceptionContent" style="display: none">登录错误：您未登录系统或登录的用户信息已丢失，请重新登录。</span>
<%
    response.addHeader("not_login", "true");
%>
</body>
</html>