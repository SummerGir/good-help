//========取得键盘的键值=============//

function getIcode(str) {
    if (str != "" && str != null) {
        var icode;
        switch (str) {
            case "A":
                icode = 65;
                break;
            case "B":
                icode = 66;
                break;
            case "C":
                icode = 67;
                break;
            case "D":
                icode = 68;
                break;
            case "E":
                icode = 69;
                break;
            case "F":
                icode = 70;
                break;
            case "G":
                icode = 71;
                break;
            case "H":
                icode = 72;
                break;
            case "I":
                icode = 73;
                break;
            case "J":
                icode = 74;
                break;
            case "K":
                icode = 75;
                break;
            case "L":
                icode = 76;
                break;
            case "M":
                icode = 77;
                break;
            case "N":
                icode = 78;
                break;
            case "O":
                icode = 79;
                break;
            case "P":
                icode = 80;
                break;
            case "Q":
                icode = 81;
                break;
            case "R":
                icode = 82;
                break;
            case "S":
                icode = 83;
                break;
            case "T":
                icode = 84;
                break;
            case "U":
                icode = 85;
                break;
            case "V":
                icode = 86;
                break;
            case "W":
                icode = 87;
                break;
            case "X":
                icode = 88;
                break;
            case "Y":
                icode = 89;
                break;
            case "Z":
                icode = 90;
                break;
            case "B0":
                icode = 48;
                break;
            case "B1":
                icode = 49;
                break;
            case "B2":
                icode = 50;
                break;
            case "B3":
                icode = 51;
                break;
            case "B4":
                icode = 52;
                break;
            case "B5":
                icode = 53;
                break;
            case "B6":
                icode = 54;
                break;
            case "B7":
                icode = 55;
                break;
            case "B8":
                icode = 56;
                break;
            case "B9":
                icode = 57;
                break;
            case "S0":
                icode = 96;
                break;
            case "S1":
                icode = 97;
                break;
            case "S2":
                icode = 98;
                break;
            case "S3":
                icode = 99;
                break;
            case "S4":
                icode = 100;
                break;
            case "S5":
                icode = 101;
                break;
            case "S6":
                icode = 102;
                break;
            case "S7":
                icode = 103;
                break;
            case "S8":
                icode = 104;
                break;
            case "S9":
                icode = 105;
                break;
            case "UP":
                icode = 38;
                break;
            case "DOWN":
                icode = 40;
                break;
            case "LEFT":
                icode = 37;
                break;
            case "RIGHT":
                icode = 39;
                break;
            case "F1":
                icode = 112;
                break;
            case "F2":
                icode = 113;
                break;
            case "F3":
                icode = 114;
                break;
            case "F4":
                icode = 115;
                break;
            case "F5":
                icode = 116;
                break;
            case "F6":
                icode = 117;
                break;
            case "F7":
                icode = 118;
                break;
            case "F8":
                icode = 119;
                break;
            case "F9":
                icode = 120;
                break;
            case "F10":
                icode = 121;
                break;
            case "F11":
                icode = 122;
                break;
            case "F12":
                icode = 123;
                break;
            case "ENTER":
                icode = 13;
                break;
            case "HOME":
                icode = 36;
                break;
            case "END":
                icode = 35;
                break;
            case "PAGEUP":
                icode = 33;
                break;
            case "PAGEDOWN":
                icode = 34;
                break;
            case "INSERT":
                icode = 45;
                break;
            case "DELETE":
                icode = 46;
                break;
            case "B-":
                icode = 189;
                break;
            case "=":
                icode = 187;
                break;
            case "B/":
                icode = 191;
                break;
            case "\\":
                icode = 220;
                break;
            case ",":
                icode = 188;
                break;
            case "B.":
                icode = 190;
                break;
            case "S/":
                icode = 111;
                break;
            case "S-":
                icode = 109;
                break;
            case "S.":
                icode = 110;
                break;
            default:
                break;
        }
        return icode;
    }
    else
        alert("没有传递要取得的键值的参数！");
}

function isCN(str) {
    var reg = /^[\u0391-\uFFE5]+$/gi;     //只中文
    return reg.test(str);
}

//=================================//

//=========控制字符串的最短和最长值========//
function checkByteLength(str, minlen, maxlen) {
    if (str == null) return false;
    var l = str.length;
    var blen = 0;
    for (i = 0; i < l; i++) {
        if ((str.charCodeAt(i) & 0xff00) != 0) {
            blen++;
        }
        blen++;
    }
    if (blen > maxlen || blen < minlen) {
        return false;
    }
    return true;
}

//====================================//
function pressSpNa() //输入金额,不能输入第二个小数点
{
    var iCode = event.keyCode;
    var inputobj = window.event.srcElement;
    if (((iCode > 95 && iCode < 106) || (iCode > 47 && iCode < 59)) || ((iCode == 8) || (iCode == 46) || (iCode == 37) || (iCode == 39)) || (iCode == 9)) {
        event.returnValue = true;
    }
    else if (((iCode == 190) || (iCode == 110)) && (event.shiftKey == false)) {
        if ((inputobj.value) && (inputobj.value.indexOf(".") != -1)) {
            event.returnValue = false;
        }
        else {
            event.returnValue = true;
        }
    }
    else {
        event.returnValue = false;
    }
}
//========================================//

//===================选择日期==================//
function showDate(obj) {
    //obj.onFocus=obj.blur();//失去焦点
    var dateValue = obj.value;//得到里面的值
    var sj;
    var tag;
    if (dateValue == "" || dateValue == " ") {//如果值为空
        sj = new Date();
        tag = "-1";
    }
    else {
        //dateValue是"2004-4-4"
        sj = new Date(changeDate(dateValue, "/"));
        tag = "1";

    }
    var arg = new Array(sj, tag);
    var url = '';
    //if (BASE_URL) {
        url = '/admini/common/date.html';
    //}
    var dt = showModalDialog(url, arg, "dialogWidth:14; dialogHeight:20; status:no;help:no");
    switch (dt) {
        case "cancle":
            break;
        case "del":
            obj.value = "";
            break;
        default:
            if (isDate(dt))
                obj.value = dt;
            break;
    }
}

function changeDate(sj, gs) {
    var oldgs = "";//字符串本来的格式
    if (gs == "/")
        oldgs = "-";
    else
        oldgs = "/";

    var array = sj.split(oldgs);//分成数组
    return array[0] + gs + array[1] + gs + array[2];
}

//======================================================//


//========根据某个输入框的名称判断其内容是否为空=======//
//fieldCode:输入框的名称
//fieldName:提示的名称
//IsMoreTable:是否是主从表
//TableAll:主从表中共有几个表
//TableId:当前表的值
//返回一个布尔型值
function isNull(fieldCode, fieldName) {
    try {
        if (document.all(fieldCode).value == '') {
            alert(fieldName + '不能为空!');
            document.all(fieldCode).focus();
            return true;
        }
        return false;
    }
    catch (e) {
        alert('不存在的对象!');
        return false;
    }
}
//=======================================================//
//============判断是否保留2位小数===================//
//str：待测字符串
function isN2(str) {
    var reg = /^([0-9]|[0-9]|(0[.])|((0[.])))[0-9]{0,}(([.]*\d{1,2})|[0-9]{0,})$/;
    return reg.test(str);
}
//=====判断字符串str是否为num为小数	
function decimal(str, num) {
    var l = str.indexOf(".");
    if (l != -1) {
        if (str.split(".")[1].length > num)
            return false;
    }
    return true;
}
//=======================================================//
//============判断一个字符串是否是整数===================//
//str：待测字符串
//sign	: 符号，“+”，表示正整数 >0的整数，“-”表示负整数<0的整数，没有表示所有整数
function isInteger(str, sign) {
    var reg = /^-?\d*$/gi;
    if (arguments.length == 2 && sign == '+') {
        reg = /^[0-9]*[1-9][0-9]*$/gi;
    }
    else if (arguments.length == 2 && sign == '-') {
        reg = /^-[0-9]*[1-9][0-9]*$/gi;
    }
    return reg.test(str);
}
//==============判断一个字符串是否是数字======================//
function isNumber(str) {
    var reg = /^\d+$/;
    return reg.test(str);
}
//==============判断一个字符串是否是浮点数===================//
//str		：待测字符串
//sign	: 符号，“+”，表示正浮点数 >0的浮点数，“-”表示负浮点数<0的浮点数，没有表示所有浮点数
function isNumeric(str, sign) {
    var reg = /^(-?\d+)(\.\d+)?$/gi;
    if (arguments.length == 2 && sign == '+') {
        reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/gi;
    }
    else if (arguments.length == 2 && sign == '-') {
        reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/gi;
    }
    return reg.test(str);
}
//=======================================================//

//=============判断一个字符串是否是日期型================//
//value:待测字符串
//返回一个布尔型值
function isDate(value) {
    try {
        while (value.indexOf('-') > 0) {
            value = value.replace('-', '/');
        }
        var compDate = new Date(value);
        var index = value.indexOf('/');
        var year = value.substring(0, index) * 1;
        value = value.substring(index + 1, 100);
        index = value.indexOf('/');
        var month = value.substring(0, index) - 1;
        var date = value.substring(index + 1, 100) * 1;
        if (compDate.getFullYear() != year | compDate.getMonth() != month | compDate.getDate() != date) {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true;
}
//=======================================================//

//==============判断一个字符串是否是邮件格式===============//
//str:待测字符串
//返回一个布尔型值
function isEmail(str) {
    var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/gi;
    return reg.test(str);
}
//=========================================================//

//==============判断一个字符串是否是一个网站格式===============//
//str:待测字符串
//返回一个布尔型值
function isURL(url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
        + "[a-z]{2,6})" // first level domain- .com or .museum  
        + "(:[0-9]{1,4})?" // 端口- :80  
        + "((/?)|" // a slash isn't required if there is no file name  
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);

    if (re.test(url)) {
        return (true);
    } else {
        return (false);
    }
}
//=========================================================//

//==============判断一个页面是否是在框架中===============//
//返回一个布尔型值
function isInFrame() {
    return (top != self);
}
//=========================================================//

//======判断一个在框架中的页面是否与主框架来自同一站点====//
//返回一个布尔型值
function isInSameSite() {
    return (top.location == self.location);
}
//=========================================================//

//====得到一个字符串的字节数，一个中文算两字节=====//
//str:待测字符串
//返回一个整数
function getBytesLength(str) {
    var re = /[\x00-\xff]/g;
    var len = str.length;
    var array = str.match(re);
    if (array == null) {
        array = "";
    }
    return len * 2 - array.length;
}
//===============================================//

//=========返回已添加指定时间间隔的日期==========//
//interval:字符串表达式，表示要添加的时间间隔。“yyyy”表示年数，“m”表示月数，“d”表示天数
//number:数值表达式，表示要添加的时间间隔的个数。数值表达式可以是正数（得到未来的日期）或负数（得到过去的日期）。
//date:日期或表示日期的文字
//返回：字符串yyyy/m/d
function DateAdd(interval, number, date) {
    try {
        if (typeof(date) != object) {
            date = new Date(date);
        }
        if (interval.toLowerCase() == 'yyyy') {
            date.setFullYear(date.getFullYear() * 1 + number);
        }
        else if (interval.toLowerCase() == 'm') {
            date.setMonth(date.getMonth() * 1 + number);
        }
        else if (interval.toLowerCase() == 'd') {
            date.setDate(date.getDate() * 1 + number);
        }
        return date.getFullYear() + "/" + (date.getMonth() * 1 + 1) + "/" + date.getDate();
    }
    catch (e) {
        return "";
    }
}
//===============================================================//
function popwin(url, wid, hei) {
    window.open(url, "", "width=" + wid + ",height=" + hei + ",left=" + (screen.availWidth - wid) / 2 + ",top=" + (screen.availHeight - hei) / 2 + ",resizable=no,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no");
}
//=============================================================//

//==================清空表单信息==========================//
//ThisForm:要清空的表单名称
function isreset(thisform) {
    if (confirm("你确认要清空所有信息吗？")) {
        thisform.reset();
    }
    return;
}
//==========================================================//

//=================人民币小写转为大写=================//
function convertCurrency(currencyDigits) {
    var MAXIMUM_NUMBER = 99999999999.99;
    // Predefine the radix characters and currency symbols for output:
    var CN_ZERO = "零";
    var CN_ONE = "壹";
    var CN_TWO = "贰";
    var CN_THREE = "叁";
    var CN_FOUR = "肆";
    var CN_FIVE = "伍";
    var CN_SIX = "陆";
    var CN_SEVEN = "柒";
    var CN_EIGHT = "捌";
    var CN_NINE = "玖";
    var CN_TEN = "拾";
    var CN_HUNDRED = "佰";
    var CN_THOUSAND = "仟";
    var CN_TEN_THOUSAND = "万";
    var CN_HUNDRED_MILLION = "亿";
    var CN_SYMBOL = "人民币";
    var CN_DOLLAR = "元";
    var CN_TEN_CENT = "角";
    var CN_CENT = "分";
    var CN_INTEGER = "整";

    // Variables:
    var integral; // Represent integral part of digit number.
    var decimal; // Represent decimal part of digit number.
    var outputCharacters; // The output result.
    var parts;
    var digits, radices, bigRadices, decimals;
    var zeroCount;
    var i, p, d;
    var quotient, modulus;

    // Validate input string:
    currencyDigits = currencyDigits.toString();
    if (currencyDigits == "") {
        alert("Empty input!");
        return "";
    }
    if (currencyDigits.match(/[^,.\d]/) != null) {
        alert("Invalid characters in the input string!");
        return "";
    }
    if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
        alert("Illegal format of digit number!");
        return "";
    }

    // Normalize the format of input digits:
    currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
    currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
    // Assert the number is not greater than the maximum number.
    if (Number(currencyDigits) > MAXIMUM_NUMBER) {
        alert("Too large a number to convert!");
        return "";
    }

    // Process the coversion from currency digits to characters:
    // Separate integral and decimal parts before processing coversion:
    parts = currencyDigits.split(".");
    if (parts.length > 1) {
        integral = parts[0];
        decimal = parts[1];
        // Cut down redundant decimal digits that are after the second.
        decimal = decimal.substr(0, 2);
    }
    else {
        integral = parts[0];
        decimal = "";
    }
    // Prepare the characters corresponding to the digits:
    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
    // Start processing:
    outputCharacters = "";
    // Process integral part if it is larger than 0:
    if (Number(integral) > 0) {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++) {
            p = integral.length - i - 1;
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0") {
                zeroCount++;
            }
            else {
                if (zeroCount > 0) {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            }
            if (modulus == 0 && zeroCount < 4) {
                outputCharacters += bigRadices[quotient];
            }
        }
        outputCharacters += CN_DOLLAR;
    }
    // Process decimal part if there is:
    if (decimal != "") {
        for (i = 0; i < decimal.length; i++) {
            d = decimal.substr(i, 1);
            if (d != "0") {
                outputCharacters += digits[Number(d)] + decimals[i];
            }
        }
    }
    // Confirm and return the final output string:
    if (outputCharacters == "") {
        outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if (decimal == "") {
        outputCharacters += CN_INTEGER;
    }
    outputCharacters = CN_SYMBOL + outputCharacters;
    return outputCharacters;
}
//========================================================//
/**判断列表是否已经选择*/
function checkHasChoose(objName) {
    var objs = document.all(objName);
    if (objs == null) return false;
    if (objs.length) {
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].checked) return objs[i];
        }
    }
    else {
        if (objs.checked) return objs;
    }
    return false;
}


function CHlength() {
    return getBytesLength(this.toString());
}
String.prototype.CHlength = CHlength;


/**
 功能描述：得到一个字符串的字节数，一个中文算两字节
 参数说明：
 str:待测字符串
 */

function getBytesLength(str) {
    var re = /[\x00-\xff]/g;
    var len = str.length;
    var array = str.match(re);
    if (array == null) {
        array = "";
    }
    return len * 2 - array.length;
}


/****字符串的截空操作----end-----***/
function trim(str) {
    return rtrim(ltrim(str));
}
function ltrim(str) {
    return str.replace(/^\s*/gi, "");
}

function rtrim(str) {
    return str.replace(/\s*$/gi, "");
}

//Select1 -> Select2
function AddItem(parObjSelect1, parObjSelect2) {
    for (var i = 0; i < parObjSelect1.options.length; i++) {
        if (parObjSelect1.options[i].selected) {
            if (checkSelect(parObjSelect2, parObjSelect1.options[i].text, parObjSelect1.options[i].value)) {
                parObjSelect2.options[parObjSelect2.options.length] = new Option(parObjSelect1.options[i].text, parObjSelect1.options[i].value);
            }
        }
    }
    return true;
}


//Select One Item-> Select One Item
function AddSelectOneToSelect(parObjSelect1, parObjSelect2) {
    var j = 0, m = 0, mValue;
    for (var i = 0; i < parObjSelect1.options.length; i++) {
        if (parObjSelect1.options[i].selected) {
            j++;
            m = i;
        }
    }
    if (j != 1) {
        return false;
    }
    parObjSelect2.options[0].value = parObjSelect1.options[m].value;
    parObjSelect2.options[0].text = parObjSelect1.options[m].text;
    return true
}
//================ajax调用===================//
//-----调用send_request函数(传入url地址)---//
//-----返回字符串调用returnFunction函数----//

var http_request = false;
function send_request(url) {//初始化、指定处理函数、发送请求的函数
    http_request = false;
    //开始初始化XMLHttpRequest对象
    if (window.XMLHttpRequest) { //Mozilla 浏览器
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {//设置MiME类别
            http_request.overrideMimeType('text/xml');
        }
    }
    else if (window.ActiveXObject) { // IE浏览器
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
            }
        }
    }
    if (!http_request) { // 异常，创建对象实例失败
        window.alert("不能创建XMLHttpRequest对象实例.");
        return false;
    }
    http_request.onreadystatechange = processRequest;
    // 确定发送请求的方式和URL以及是否同步执行下段代码
    http_request.open("GET", url, true);
    http_request.send(null);
}

// 处理返回信息的函数(返回字符串调用returnFunction函数)
function processRequest() {
    if (http_request.readyState == 4) { // 判断对象状态
        if (http_request.status == 200) { // 信息已经成功返回，开始处理信息
            returnFunction(http_request.responseText);
        } else { //页面不正常
            alert("您所请求的页面有异常。");
        }
    }
}
//给出中文日期 1999年12月12日
//time 1999-12-13 14:53:22
function getCNDate(time) {
    var s = time.split(" ")[0];
    return s.split("-")[0] + "年" + s.split("-")[1] + "月" + s.split("-")[2] + "日";
}

function fileupload(para) {
    parent.fileupload(window.self, '.xls', para, 'rpt', RELOAD_URL);
}
function uploadback(result, msg, filename) {
    if (result == 'success') {//数据上传成功，重载当前页面
        alert('数据上传成功！');
    }
    else {
        alert(msg);
    }
}

function checkIdCard(value) {
    //身份证号位数判断
    var value = this.trim(value);
    if (value.length != 18 && value.length != 15) {
        return false;
    } else if (value.length == 18) {
        return identificationCard(value);
    } else if (value.length == 15) {
        var kk = identificationCard15To18(value);
        if (kk == false) {
            return false;
        } else {
            return identificationCard(kk);
        }
    }
    return true;
}
//身份证验证
function identificationCard(value) {
    value = value.toUpperCase();
    var verifyCode = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");//校验码
    var verifyGene = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);//校验因子
    var temp = value.substring(0, 17);
    if (!isInteger(temp)) {
        return false;
    }
    temp = value.substring(0, 6);
    if (temp * 1 < 100101) {
        return false;
    }
    temp = value.substring(6, 14);
    var birthday = temp.substring(0, 4) + "-" + temp.substring(4, 6) + "-" + temp.substring(6, 8);
    if (!isDate(birthday)) {
        return false;
    }
    if (temp * 1 < 18700101) {
        return false;
    }
    var date = new Date();
    var today = date.getFullYear();
    if (date.getMonth() * 1 + 1 < 10) {
        today += "0";
    }
    today += "" + (date.getMonth() * 1 + 1);
    if (date.getDate() < 10) {
        today += "0";
    }
    today += "" + date.getDate();
    if (temp * 1 > today * 1) {
        return false;
    }
    temp = value.substring(14, 17);
    if (temp == '000') {
        return false;
    }
    var s = 0;
    for (var i = 0; i < 17; i++) {
        s += value.substring(i, i + 1) * verifyGene[i];
    }
    var y = verifyCode[s % 11];
    if (value.substring(17, 18) != y) {
        return false;
    }
    return true;
}

//------将15位转为18位----//
/**
 功能描述：对15位身份证号进行转换
 参数说明：
 value        :待转换的身份证号
 century        :出生年的前两位数
 返回   :18位身份证号码
 */
function identificationCard15To18(value) {
    var verifyCode = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");//校验码
    var verifyGene = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);//校验因子
    var newID;
    var temp = value;
    if (!isInteger(temp)) {
        return false;
    }
    newID = value.substring(0, 6);
    if (newID * 1 < 100101) {
        return false;
    }

    var century = '19';
    newID += century + value.substring(6, 12);

    //第七至十四位为出生日期码，一般认为当前的人出生在1870年以后，今天以前
    temp = value.substring(12, 15);
    if (temp == '000') {
        return false;
    }

    newID += temp;
    var s = 0;
    for (var i = 0; i < 17; i++) {
        s += newID.substring(i, i + 1) * verifyGene[i];
    }
    return newID + verifyCode[s % 11];
}

/* 验证手机号 */
function checkMobile(mobileNum) {
    var mobileNumber = this.trim(mobileNum);
    var regu = /(^[1][3][0-9]{9}$)|(^[1][5][0-9]{9}$)|(^[1][8][0-9]{9}$)|(^[0][1-9]{1}[0-9]{9}$)/;
    var reg = new RegExp(regu);
    return reg.test(mobileNumber);  // 手机验证 13x 15x 18x 以此类推
}

/* 验证电话号码 */
function checkPhone(mobileNum) {
    var mobileNumber = this.trim(mobileNum);
    var regu = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$|(\d{7,8})(-(\d{3,}))?$/;
    var reg = new RegExp(regu);
    return reg.test(mobileNumber); // 电话/小灵通验证
}

function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

//格式化数字
function FormatNumber(s) {
    if (s == null || s == "") {
        return "";
    }
    var num = s.replace(/,/g, '') + "";
    var re;
    if (num.indexOf(".") == -1) {
        re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
    } else {
        re = new RegExp().compile("(\\d)(\\d{3})(,|\\.)");
    }
    while (re.test(num))
        num = num.replace(re, "$1,$2$3");
    return num;
}
//数字自动转换格式
function getNumFormat(obj) {
    var s = trim(obj.value);
    obj.value = FormatNumber(s);
};

//===========================================//
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}
String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
}

//==============判断一个字符串是否是一个邮政编码格式===============//
//str:待测字符串
//返回一个布尔型值
function isZipcod(str) {
    var reg = /^[1-9]\d{5}$/;
    return reg.test(str);
}
//===========================================//