/*
使用说明：
    在需要转语音的input标签的class属性添加need_listen。
    并添加自定义属性val_type，输入int、double、string，对输入的值进行对应的验证
*/

$(".need_listen").keyup(function(event){
    //监听键盘按下时的事件
    // console.log(event.keyCode); //按下不同的按键，对应的event.keyCode也不同

    /*
    *字母与数字
    * A-Z：65-90
    * 0-9：48-57
    *
    *数字键盘
    * 0-9：96-105
    * *、+、enter、-、.、/：106-111
    *
    * 功能键
    *F1-F12：112-123
    *
    * */
    check_text(event,this);
});

function check_text(event,e){
    var code = event.keyCode;
    var text = $(e).val();
    var val_type = $(e).attr("val_type");//类型
    if(code == 8 || code == 46){//按了删除按钮
        text = "删除";
        play_pronunciation(text)
    }else if((text != '' && text != null && text != undefined) && ((code >=48 && code <= 57) || (code >=65 && code <= 90) || (code >=96 && code <= 111))){
        //如果表示类型为double，需要进行数字验证
        if(("double" == val_type && !$.isNumeric(text)) || ("int" == val_type && !isInteger(text))){
            $(e).val(text.substr(0,text.length - 1));
//                        text = "输入错误";
            return;
        }else{
            if(code >=106 && code <= 111){
                //特殊符号，需要转换成中文
                var ct = {106:"乘", 107:"加", 108:"回车", 109:"减", 110:"点", 111:"除"};
                text = ct[code];
            }else{
                text = text.substr(text.length - 1);
            }
        }
        play_pronunciation(text);
    }
}
function play_pronunciation(text){
    if(text == '' || text == null || text == undefined)
        return;
    var id = "my_auto";
    $("body>#my_auto").remove();

    var src = "http://tts.baidu.com/text2audio";
    var spd = '5';//语速，0-9
    var pit = '5';//语调，0-9
    var vol = '15';//音量，0-15
    var per = '3';//发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声

    var str = '';
    str += '<audio id="'+ id +'" autoplay="autoplay">';
    str += '<source type="audio/mpeg" src="'+ src +'?lan=zh&amp;ie=UTF-8&amp;spd='+ spd +'&amp;pit='+ pit  +'&amp;vol='+ vol +'&amp;per='+ per +'&amp;text='+ text +'">';
    str += '</source>';
    str += '</audio>';
    $("body").append(str);

    try{
        $("body>#"+ id)[0].play();
    }catch (e){
        console.log("文本：“"+ text + "”无法识别")
        console.log(e);
    }
}

function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}