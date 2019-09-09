<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="java.util.Calendar" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
    String random = request.getParameter("random");
    String selectorId = "eiis-selectorRemindModal" + random;
    String selectorOkBtn = "eiis-selectorRemindOKBtn" + random;

    JSONObject weekType=new JSONObject();
    weekType.put("1","周一");
    weekType.put("2","周二");
    weekType.put("3","周三");
    weekType.put("4","周四");
    weekType.put("5","周五");
    weekType.put("6","周六");
    weekType.put("7","周日");
%>

<style type="text/css">

    .my-footer{
        /*          position:fixed;  */
        /*          bottom: 0px;  */
        /*z-index: 99999;*/
        /*          width:400px;  */
        text-align:left;
        background-color: #f8f8f8;
        background: -webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#f2f2f2));
        background: -webkit-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -moz-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -ms-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: -o-linear-gradient(top, #f8f8f8, #f2f2f2);
        background: linear-gradient(top, #f8f8f8, #f2f2f2);
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        /*text-shadow: 0px 1px #fff;*/
        border-bottom: 1px solid #fff;
        border-top: 1px solid #ccc;
        box-shadow: inset 0px 1px 1px #fff;
    }

    #<%=selectorId%>-body{
        overflow-y:auto !important;
        /*background-image: -ms-linear-gradient(rgb(248, 248, 248), rgb(242, 242, 242));*/
        padding-top: 0px;
    }
    #<%=selectorId%>-body a{
        border-radius: 0px;
        margin-bottom: 1px;
    }
    #<%=selectorId%>-body i{
        font-size: 12px;;
    }
    .list_span_span{
        margin-right: 15px;
    }
    .TiQian_weixuanzhong{
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 3px;
        border: 1px solid #ddd;
        text-align: center;
    }
    .TiQian_xuanzhong{
        background-color: #2dca70;
    }
    .remind_value_span{
        border: 1px solid #eee;border-radius: 6px;width: auto;padding: 3px 8px;box-sizing: border-box;white-space: nowrap;float: left;margin: 3px;background-color: #2dcc70;color: #fff;
    }
    .remind_value_span i{
        margin-left: 4px;
    }

    .remind_mode_EveryMonth .box{
        position: relative;width: 84%;height: 40px;
        float: left;
        overflow: hidden;

    }
    .remind_mode_EveryMonth .box ul,.box li,.remind_mode_EveryWeek .box ul,.remind_mode_EveryWeek .box li{
        list-style: none;
        margin: 0px;
        padding: 0px;
    }
    .remind_mode_EveryMonth .box ul{
        position: absolute;
        width:1240px;
        height:40px;
        top:0px;
        left: 0px;
    }
    .remind_mode_EveryMonth .box li{
        float: left;
        width:40px;
        height:40px;
        line-height: 40px;
        text-align: center;
    }
    .li_xz{
        border-right: #fff solid 1px;
        background-color: #2dca70;
        color: #fff;
        border-radius: 4px;
    }
    .remind_mode_EveryMonth .remind_zuo,.remind_mode_EveryMonth .remind_you{
        float: left;
        width: 8%;
        height: 40px;
        line-height: 40px;
        color: #2dca70;
        text-align: center;
    }
    .remind_mode_EveryWeek .box li{
        float: left;
        width:14%;
        height:40px;
        line-height: 40px;
        text-align: center;
    }

</style>
<div class="modal container fade" id="<%=selectorId%>" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-width="90%" data-height="450px" style="margin-bottom:0px;overflow: visible;">
    <div class="modal-header" id="<%=selectorId%>-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">添加提醒</h4>
        <div style="text-align: right;"></div>
    </div>
    <div class="modal-body" id="<%=selectorId%>-body" >
        <div class="row" id="<%=selectorId%>_div" style="padding: 0px;">
                <!--初始页面-->
                <div class="col-xs-12 col-md-12" name="remind_mode_NoRemind" style="display: none;padding: 0px;">
                    <div  class="zhiding_remind_div">
                        <div style="padding: 15px;text-align: center;">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                                    指定提醒
                                </a>
                            </h4>
                        </div>
                        <div id="collapseOne" class="panel-collapse collapse in">
                            <div class="panel-body" style="padding: 0px;">
                                <ul class="list-group" style="margin-bottom: 0px;">
                                    <li style="border-radius: 0px;" class="list-group-item remind_TiQian_li" onclick="remind_changeType('TiQian')">提前时间<span class="pull-right remind_right"><span class="list_span_span"></span><i class="esg-font icon-you"></i></span></li>
                                    <li style="border-radius: 0px;" class="list-group-item remind_SpecifiedDate_li" style="position:relative;"  onclick="remind_changeType('SpecifiedDate')">
                                        指定时间<span class="pull-right remind_right"><span class="list_span_span"></span><i class="esg-font icon-you"></i></span>
                                        <input onfocus="g_s_time('SpecifiedDate')" name="zhiding_time" type="text" eiis-dateType="yy-MM-dd HH:ii" style="position:absolute;top: 0px;right:60px;width:55%;height: 39px;margin:1px 0px;opacity:1;border:0px;"/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;" class="zhouqi_remind_div">
                        <div style="padding: 15px;text-align: center;">
                            <h4 class="panel-title">
                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
                                    周期提醒
                                </a>
                            </h4>
                        </div>
                        <div id="collapseTwo" class="panel-collapse collapse in">
                            <div class="panel-body" style="padding: 0px;">
                                <ul class="list-group">
                                    <li style="border-radius: 0px;" class="list-group-item remind_EveryMonth_li" onclick="remind_changeType('EveryMonth')">每月定时<span class="pull-right remind_right"><span class="list_span_span"></span><i class="esg-font icon-you"></i></span></li>
                                    <li style="border-radius: 0px;" class="list-group-item remind_EveryWeek_li" onclick="remind_changeType('EveryWeek')">每周定时<span class="pull-right remind_right"><span class="list_span_span"></span><i class="esg-font icon-you"></i></span></li>
                                    <li style="border-radius: 0px;" class="list-group-item remind_EveryDay_li" style="position:relative;"  onclick="remind_changeType('EveryDay')">
                                        每天定时<span class="pull-right remind_right"><span class="list_span_span"></span><i class="esg-font icon-you"></i></span>
                                        <input onfocus="g_s_time('EveryDay')" name="meitian_time" type="text"  eiis-dateType="HH:ii" style="position:absolute;top: 0px;right:60px;width:55%;height: 39px;margin:1px 0px;opacity:1;border:0px;"/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!--提前时间-->
                <div class="col-xs-12 col-md-12" name="remind_mode_TiQian" style="display: none;padding: 0px;">
                    <%--<div class="row" style="margin: 0px;">--%>
                        <%--<div class="col-md-12" style="height: 40px;line-height: 40px;padding: 0px 10px;">--%>
                            <%--<span>提前时间</span>--%>
                            <%--<span class="pull-right remind_right"><i class="fa fa-chevron-down" style="color:#2dca70;"></i></span>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                    <div class="row" style="margin: 0px;">
                        <div class="col-md-12" style="padding: 0px;">
                            <a name="0" class="list-group-item" onclick="remind_changeType_2(0)">立即提醒<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-10" class="list-group-item" onclick="remind_changeType_2(-10)">提前10分<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-30" class="list-group-item" onclick="remind_changeType_2(-30)">提前30分<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-60" class="list-group-item" onclick="remind_changeType_2(-60)">提前1小时<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-120" class="list-group-item" onclick="remind_changeType_2(-120)">提前2小时<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-180" class="list-group-item" onclick="remind_changeType_2(-180)">提前3小时<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-1440" class="list-group-item" onclick="remind_changeType_2(-1440)">提前1天<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                            <a name="-2880" class="list-group-item" onclick="remind_changeType_2(-2880)">提前2天<span class="pull-right remind_right"><div class="TiQian_weixuanzhong"></div></span></a>
                        </div>
                    </div>

                </div>
                <!--每月定时-->
                <div class="col-xs-12 col-md-12 remind_mode_EveryMonth" name="remind_mode_EveryMonth" style="display: none;padding: 0px;">
                    <div class="row" style="margin: 0px;">
                        <div class="col-md-12" style="height: 40px;line-height: 40px;padding: 0px 10px;">
                            <span>每月定时</span>
                            <span class="pull-right remind_right"><i class="fa fa-chevron-down" style="color:#2dca70;"></i></span>
                        </div>
                    </div>
                    <div class="row" style="margin: 0px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;">
                        <div class="col-md-12" style="padding: 0px;">
                            <div class="scroll">
                                <div class="remind_zuo" onclick="mode_3_zuo_you('zuo')"><i class="esg-font icon-zuo"></i></div>
                                <div class="box">
                                    <ul>

                                        <%for(int i=1;i<=31;i++){%>
                                        <li name="<%=i%>" onclick="remind_changeType_2(<%=i%>)"><%=i%>号</li>
                                        <%}%>
                                    </ul>
                                </div>

                                <div class="remind_you" onclick="mode_3_zuo_you('you')"><i class="esg-font icon-you"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin: 0px;height: 40px;line-height: 40px;padding: 0px 10px;" onclick="remind_month_time()">
                        <div style="padding: 0px;float: left;width: 80px;">
                            <span><i class="fa fa-clock-o" style="padding-right: 5px;"></i>提醒时间：</span>
                        </div>
                        <div style="padding: 0px;margin-left: 80px;">
                            <input name="month_time" type="text" eiis-dateType="HH:ii" style="opacity:1;border: 0px;padding-left: 5px;"/>
                        </div>
                    </div>
                </div>
                <!--每周定时-->
                <div class="col-xs-12 col-md-12 remind_mode_EveryWeek" name="remind_mode_EveryWeek" style="display: none;padding: 0px;">
                    <div class="row" style="margin: 0px;">
                        <div class="col-md-12" style="height: 40px;line-height: 40px;padding: 0px 10px;">
                            <span>每周定时</span>
                            <span class="pull-right remind_right"><i class="fa fa-chevron-down" style="color:#2dca70;"></i></span>
                        </div>
                    </div>
                    <div class="row" style="margin: 0px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;">
                        <div class="col-md-12" style="padding: 0px 5px;">
                            <div class="box">
                                <ul>
                                    <%for(int i=1;i<=7;i++){%>
                                    <li name="<%=i%>" onclick="remind_changeType_2(<%=i%>)"><%=weekType.get(i+"")%></li>
                                    <%}%>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin: 0px;height: 40px;line-height: 40px;padding: 0px 10px;" onclick="remind_month_time()">
                        <div style="padding: 0px;float: left;width: 80px;">
                            <span><i class="fa fa-clock-o" style="padding-right: 5px;"></i>提醒时间：</span>
                        </div>
                        <div style="padding: 0px;margin-left: 80px;">
                            <input name="week_time" type="text" eiis-dateType="HH:ii" style="opacity:1;border: 0px;padding-left: 5px;"/>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <div class="modal-footer my-footer" id="<%=selectorId%>-footer" >
        <div style="text-align: right;">
            <button type="button" style="margin-top: 10px" class="btn btn-primary modalOk" onclick="submit_remind()">确 定</button>
            <button type="button" style="margin-top: 10px" class="btn btn-default" onclick="clost_remind()">取 消</button>
        </div>
    </div>
</div>

<script type="text/javascript">
    var weekType=<%=weekType%>;
    var selectorId="<%=selectorId%>";
    var c_type="NoRemind";
    var readonly=null;
    var x_type = new Array();
    var x_time="";
    var flag=true;
    var onlyOne=false;
    $(document).ready(function () {
        opt_show_and_hide();
        time_1();
        remind_changeType(c_type);
    });

    function opt_show_and_hide(){
        var remindKind=$("#"+selectorId+"_div_div").find("input[class='remindKind']").val();
        if(remindKind!="" && remindKind!=null){
            var remindKinds=remindKind.split(";");
            if(remindKinds.length>0){
                $("#"+selectorId+"_div div[class='zhiding_remind_div']").hide();
                $("#"+selectorId+"_div div[class='zhouqi_remind_div']").hide();
                $("#"+selectorId+"_div div[name='remind_mode_NoRemind']").find("li").hide();

                for(var i=0;i<remindKinds.length;i++){
                    if(remindKinds[i]=="TiQian" || remindKinds[i]=="SpecifiedDate"){
                        $("#"+selectorId+"_div div[class='zhiding_remind_div']").show();
                    }else if(remindKinds[i]=="EveryMonth" || remindKinds[i]=="EveryWeek" || remindKinds[i]=="EveryDay"){
                        $("#"+selectorId+"_div div[class='zhouqi_remind_div']").show();
                    }
                    $("#"+selectorId+"_div li[class='list-group-item remind_"+remindKinds[i]+"_li']").show();
                }

            }
        }
    }


    //选择提醒类型
    function remind_changeType(type){
        c_type=type;
        $(".eiis-remind").each(function(){
            var kind=$(this).attr("data-remindkind");
            if(kind!="" && kind!=undefined && kind.split(";").length==1){
                c_type=kind;
                onlyOne=true;
            }
        });
        $("#"+selectorId+"_div>div").hide();
        if(c_type=="SpecifiedDate" || c_type=="EveryDay"){//指定时间
            remind_month_time();
        }else{
            if(c_type=="EveryMonth"){//每月定时
                $("#"+selectorId+"_div").find("div[name='remind_mode_EveryMonth']").find("input[name='month_time']").val(x_time==""?def_time():x_time);
            }else if(c_type=="EveryWeek"){//每月定时
                $("#"+selectorId+"_div").find("div[name='remind_mode_EveryWeek']").find("input[name='week_time']").val(x_time==""?def_time():x_time);
            }
            if(x_type.length>0){
                for(var i=0;i<x_type.length;i++){
                    remind_change_xz(false,x_type[i]);
                }
            }
        }
        $("#"+selectorId+"_div").find("div[name='remind_mode_"+((c_type=="SpecifiedDate" || c_type=="EveryDay")?"NoRemind":c_type)+"']").show();
    }

    //绑定时间控件
    function time_1(){
        var opt = {
            dateattr: 'eiis-dateType', //遍历属性名
            week: ['周日','周一','周二','周三','周四','周五','周六'],

            //显示弹出框
            onShow: function (html, valueText, inst) {
                var format = valueText.format;
                var text = html.valueText;
                var yy = format.match(/yy/gi);
                var mm = format.match(/mm/gi);
                var dd = format.match(/dd/gi);
                if(yy && mm && dd){
                    var year = text.substr(format.indexOf(yy),4);
                    var month = '', da = '';
                    if(format.indexOf(yy)<format.indexOf(mm))
                        month = text.substr(format.indexOf(mm)+2,2);
                    else
                        month = text.substr(format.indexOf(mm),2);
                    if(format.indexOf(yy)<format.indexOf(dd))
                        da = text.substr(format.indexOf(dd)+2,2);
                    else
                        da = text.substr(format.indexOf(dd),2);
                    var weeknum = new Date(year+'-'+month+'-'+da).getDay();
                    text += ' '+opt.week[weeknum];
                }
                var checktime = $('<div></div>').addClass('timetopdesc').addClass('title-alert-b').html('已选：' + text);
                var titletime = $('<div></div>').addClass('title-alert-t').html('— 选择时间 —');

                $(html.target).find('.mbsc-fr-w .mbsc-fr-c').before(checktime);
                $(checktime).before(titletime);
            },
            //滑动后值^+$
            onChange: function (valueText, inst) {
                var format = inst.format;
                var text = valueText.valueText;
                var yy = format.match(/yy/gi);
                var mm = format.match(/mm/gi);
                var dd = format.match(/dd/gi);
                if(yy && mm && dd){
                    var year = text.substr(format.indexOf(yy),4);
                    var month = '', da = '';
                    if(format.indexOf(yy)<format.indexOf(mm))
                        month = text.substr(format.indexOf(mm)+2,2);
                    else
                        month = text.substr(format.indexOf(mm),2);
                    if(format.indexOf(yy)<format.indexOf(dd))
                        da = text.substr(format.indexOf(dd)+2,2);
                    else
                        da = text.substr(format.indexOf(dd),2);
                    var weeknum = new Date(year+'-'+month+'-'+da).getDay();
                    text += ' '+opt.week[weeknum];
                }
                $('.timetopdesc').html('已选：' + text);
            }
        };
        $('input[name="zhiding_time"]').mobiscroll().datetime(opt);
        $('input[name="meitian_time"]').mobiscroll().time(opt);
        $('input[name="month_time"]').mobiscroll().time(opt);
        $('input[name="week_time"]').mobiscroll().time(opt);
    }

    //选中或取消选中
    function remind_changeType_2(v){
        var is_have=false;
        var len=-1;
        for(var i=0;i<x_type.length;i++){
            if(x_type[i]==v){
                len=i;
                is_have=true;
            }
        }
        if(is_have==true){//已经选中的项，取消选中
            x_type.splice(len,1);//指定位置开始删除，删除N个
        }else{//该项位未选中，选中
            x_type.push(v);
        }
        remind_change_xz(is_have,v);
    }

    //选中或取消选中的样式
    function remind_change_xz(type,v){
        if(type==true){//已经选中的项，取消选中
            if(c_type=="TiQian"){
                $("#"+selectorId+"_div div[name='remind_mode_TiQian']").find("a[name='"+v+"']").find("div").empty().removeClass("TiQian_xuanzhong");
            }else if(c_type=="EveryMonth"){
                $("#"+selectorId+"_div div[name='remind_mode_EveryMonth'] li[name='"+v+"']").removeClass("li_xz");
            }else if(c_type=="EveryWeek"){
                $("#"+selectorId+"_div div[name='remind_mode_EveryWeek'] li[name='"+v+"']").removeClass("li_xz");
            }
        }else{//该项位未选中，选中
            if(c_type=="TiQian"){
                $("#"+selectorId+"_div div[name='remind_mode_TiQian']").find("a[name='"+v+"']").find("div[class='TiQian_weixuanzhong']").addClass("TiQian_xuanzhong").append('<i class="fa fa-check" style="color:#fff;"></i>');
            }else if(c_type=="EveryMonth"){
                $("#"+selectorId+"_div div[name='remind_mode_EveryMonth'] li[name='"+v+"']").addClass("li_xz");
            }else if(c_type=="EveryWeek"){
                $("#"+selectorId+"_div div[name='remind_mode_EveryWeek'] li[name='"+v+"']").addClass("li_xz");
            }

        }
    }

    //左右翻页
    function mode_3_zuo_you(type){
        //ul宽度为1120
        var l_s=31//小格数量
        var l_w=parseInt($(".remind_mode_EveryMonth .box li").css("width"));//每小格宽度
        var p_w=parseInt($(".remind_mode_EveryMonth .box").css("width"));//总宽度
        var s=parseInt(p_w/l_w);//每次跳动数量
        var v=s*l_w;//每次跳动距离
        var p=parseInt(l_s*l_w/v)-1;//总页数
        var t_left=parseInt($(".remind_mode_EveryMonth .box ul").css("left").replaceAll("px",""));
        if(isNaN(t_left))t_left=0;
        if(type=="zuo"){
            if(t_left<=-v){
                t_left=t_left+v;
            }
        }else{
            if(t_left>=-v*p){
                t_left=t_left-v;
            }
        }
        if(t_left+(l_s*l_w-v)==0 ||(t_left>-v && t_left!=0)){//第一页
            t_left=0;
        }else if(t_left<=-v*p || t_left==0){
            t_left=-(l_s*l_w-v);
        }

        $(".remind_mode_EveryMonth .box ul").css("left",t_left+"px");
    }

    //确认
    function submit_remind(){
        div_s_h(true);
        if(c_type=="NoRemind"){
            if($("#"+selectorId+"_div").find("input[name='zhiding_time']").val()!=""){
                c_type="SpecifiedDate";
            }else if($("#"+selectorId+"_div").find("input[name='meitian_time']").val()!=""){
                c_type="EveryDay";
            }
        }
        var shifou_remind="不提醒";
        if(c_type!="NoRemind"){
            var zhiding_time="";
            if(x_type.length>0){
                x_type.sort(function(a,b){
                    return a-b;
                });
            }
            $("#"+selectorId+"_value_label").empty();
            if(c_type=="TiQian" && x_type.length>0){
                x_type.sort(function(a,b){
                    return b-a;
                });
                zhiding_time=x_type.join(",")+",;";
                shifou_remind="提前提醒";
                for(var i=0;i<x_type.length;i++){
                    var v=-parseInt(x_type[i]);
                    if(v<60) v="提前"+v+"分钟";
                    else if(v<1440)v="提前"+(v/60)+"小时";
                    else v="提前"+(v/1440)+"天";
                    setDivVal(v,x_type[i]+",");
                }
            }else if(c_type=="SpecifiedDate"){
                zhiding_time=$("#"+selectorId+"_div").find("input[name='zhiding_time']").val();
                if(zhiding_time!=""){
                    shifou_remind="指定时间";
                    setDivVal(zhiding_time,zhiding_time);
                    zhiding_time+=";";
                }else{
                    div_s_h(false);
                }
            }else if(c_type=="EveryMonth"){
                zhiding_time=x_type.join(",");
                if(zhiding_time!=""){
                    var t=$("#"+selectorId+"_div").find("div[name='remind_mode_EveryMonth']").find("input[name='month_time']").val();
                    zhiding_time+=",;"+t;
                    shifou_remind="每月定时";
                    for(var i=0;i<x_type.length;i++){
                        var v=x_type[i]+"号 "+t;
                        setDivVal(v,x_type[i]+",");
                    }
                }else{
                    div_s_h(false);
                }
            }else if(c_type=="EveryWeek"){
                zhiding_time=x_type.join(",");
                if(zhiding_time!=""){
                    var t=$("#"+selectorId+"_div").find("div[name='remind_mode_EveryWeek']").find("input[name='week_time']").val();
                    zhiding_time+=",;"+t;
                    shifou_remind="每周定时";
                    for(var i=0;i<x_type.length;i++){
                        var v=weekType[x_type[i]]+" "+t;
                        setDivVal(v,x_type[i]+",");
                    }
                }else{
                    div_s_h(false);
                }
            }else if(c_type=="EveryDay"){
                zhiding_time=$("#"+selectorId+"_div").find("input[name='meitian_time']").val();
                if(zhiding_time!=""){
                    shifou_remind="每天定时";
                    setDivVal("每天"+zhiding_time,zhiding_time);
                    zhiding_time+=";";
                }else{
                    div_s_h(false);
                }
            }else{
                div_s_h(false);
            }
            $("body input[class='eiis-remind eiis-loaded']").val(zhiding_time==""?"":(c_type+";"+zhiding_time));
        }else{
            $("body input[class='eiis-remind eiis-loaded']").val("");
            $("#"+selectorId+"_value_label").empty();
            div_s_h(false);
        }
        $("#"+selectorId+"_div_div").find("span[name='shifou_remind']").text(shifou_remind);
        $("#"+selectorId).modal("hide");
    }

    function div_s_h(type){
        if(type){//true 显示
            $("#" + selectorId + "_value_div").show();
        }else{//false 隐藏
            $("#" + selectorId + "_value_div").hide();
        }
    }

    //为全局变量设值
    function set_remind_value(v){
        if(v=="" || v.split(";")[1]==""){
            c_type="NoRemind";
            div_s_h(false);
        }else{
            div_s_h(true);
            c_type=v.split(";")[0];
            var x=v.split(";")[1];
            if(c_type=="TiQian" || c_type=="EveryMonth" || c_type=="EveryWeek"){
                x_type = new Array();
                var t=x.split(",");
                for(var i=0;i<t.length;i++){
                    if(t[i]!=""){
                        x_type.push(t[i]);
                    }
                }
                if(c_type=="EveryMonth" || c_type=="EveryWeek"){
                    x_time=v.split(";")[2];
                    $("#"+selectorId+"_div").find("div[name='remind_mode_EveryMonth']").find("input[name='month_time']").val(x_time);
                    $("#"+selectorId+"_div").find("div[name='remind_mode_EveryWeek']").find("input[name='week_time']").val(x_time);
                }

            }else if(c_type=="SpecifiedDate"){
                $("#"+selectorId+"_div").find("input[name='zhiding_time']").val(x);
                flag=false;
            }else if(c_type=="EveryDay"){
                $("#"+selectorId+"_div").find("input[name='meitian_time']").val(x);
                flag=false;
            }
        }
    }

    //选择器的结果显示
    function setDivVal(v,k){
        var str="<span class='remind_value_span'>";
        str+=v;
        str+="<i name='"+k+"' class='esg-font icon-guanbi' onclick='delete_remind(this)'></i>";
        str+="</span>";
        $("#"+selectorId+"_value_label").append(str);
        if("disabled"==$("body input[class='eiis-remind eiis-loaded']").attr("disabled") || "readonly"==$("body input[class='eiis-remind eiis-loaded']").attr("readonly")){
            $("#"+selectorId+"_value_label").find("i").hide();
        }
    }

    //删除值
    function delete_remind(e){
        var inp=$("body input[class='eiis-remind eiis-loaded']").val();
        var k=$(e).attr("name");
        inp=inp.replaceAll(k,"");
        var l_i=inp.indexOf(";")+1;
        var r_i=inp.lastIndexOf(";");
        if(inp.substring(l_i,r_i)=="" || l_i>r_i) {
            inp="";
            $("#"+selectorId+"_div_div").find("span[name='shifou_remind']").text("不提醒");
            div_s_h(false);
        }
        $("body input[class='eiis-remind eiis-loaded']").val(inp);
        k= k.replaceAll(",","");
        if(c_type=="TiQian" || c_type=="EveryMonth" || c_type=="EveryWeek"){
            remind_changeType_2(k);
        }else if(c_type=="NoRemind" || c_type=="SpecifiedDate" || c_type=="EveryDay"){
            $("#"+selectorId+"_div").find("input[name='zhiding_time']").val("")
            $("#"+selectorId+"_div").find("input[name='meitian_time']").val("")
        }
        $(e).parent().remove();
    }

    //取消选择
    function clost_remind(){

        //取消 提前时间 的值
        x_type = new Array();
        x_time="";
        $("#"+selectorId+"_div").find("div[name='remind_mode_TiQian'] div").removeClass("TiQian_xuanzhong");
        $($("#"+selectorId+"_div").find("div[name='remind_mode_TiQian']").find("div[class='TiQian_weixuanzhong']")).empty();
        //取消 指定时间 的值
        $("#"+selectorId+"_div").find("input[name='zhiding_time']").val("");
        //每月定时
        $("#"+selectorId+"_div div[name='remind_mode_EveryMonth'] li").removeClass("li_xz");
        $("#"+selectorId+"_div").find("div[name='remind_mode_EveryMonth']").find("input[name='month_time']").val(def_time());
        //每周定时
        $("#"+selectorId+"_div div[name='remind_mode_EveryWeek'] li").removeClass("li_xz");
        $("#"+selectorId+"_div").find("div[name='remind_mode_EveryWeek']").find("input[name='week_time']").val(def_time());
        //取消 每天定时 的值
        $("#"+selectorId+"_div").find("input[name='meitian_time']").val("");
        if(c_type=="NoRemind" || c_type=="SpecifiedDate" || c_type=="EveryDay" || onlyOne==true){
            $("#"+selectorId).modal("hide");
            c_type="NoRemind";
        }else{
            c_type="NoRemind";
            remind_changeType(c_type);
        }
    }

    //默认时间
    function def_time(){
        var d=new Date();
        var n_d= (d.getHours()<10?("0"+d.getHours()):d.getHours())+":"+ (d.getMinutes()<10?("0"+d.getMinutes()):d.getMinutes());
        return n_d;
    }

    //单击一行，显示时间控件
    function remind_month_time(){
        if(flag){
            flag=false;
            if(c_type=="SpecifiedDate"){
                g_s_time(c_type)
                $("#"+selectorId+"_div").find("div[name='remind_mode_NoRemind']").find("input[name='zhiding_time']").trigger('click');
            }else if(c_type=="EveryMonth"){
                $("#"+selectorId+"_div").find("div[name='remind_mode_EveryMonth']").find("input[name='month_time']").trigger('click');
            }else if(c_type=="EveryWeek"){
                $("#"+selectorId+"_div").find("div[name='remind_mode_EveryWeek']").find("input[name='week_time']").trigger('click');
            }else if(c_type=="EveryDay"){
                g_s_time(c_type)
                $("#"+selectorId+"_div").find("div[name='remind_mode_NoRemind']").find("input[name='meitian_time']").trigger('click');
            }
        }else
            flag=true;
    }

    //取消时间控件的输入框的值
    function g_s_time(type){
        if(type=="SpecifiedDate"){
            $("#"+selectorId+"_div").find("div[name='remind_mode_NoRemind']").find("input[name='meitian_time']").val("");
        }else if(type=="EveryDay"){
            $("#"+selectorId+"_div").find("div[name='remind_mode_NoRemind']").find("input[name='zhiding_time']").val("");
        }
    }
</script>

