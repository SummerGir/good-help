<%@ page import="eiis.context.Context" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page import="eiis.app.memberarchives.service.MemberPersonArchivesService" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.app.memberarchives.entity.AppMemberPersonArchivesEntity" %>
<%
  String usertel="";
  MemberPersonArchivesService service= MemberPersonArchivesService.getInstance();
  List<AppMemberPersonArchivesEntity> list=service.getPerson(Context.getCurrent().getId().toString());
  if(list!=null && list.size()>0 && list.get(0)!=null && list.get(0).getMemberPhone()!=null){
    usertel = list.get(0).getMemberPhone();
  }
%>
<style>
  .richengList a{font-size: 13px;height: 26px;width: 100%;background-color: #f9f9f9;margin-top: 10px;line-height: 26px;}
  .richengList .r_left{float: left;background-color: #f9f9f9;text-align: left;height: 29px;line-height: 29px;border-left: 1px solid #2ac68d;color:#000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;font-size: 12px;font-weight: bold;}
  .richengList .r_right{float: left;text-align: left;height: 29px;line-height: 29px;color: #000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;background-color: #f9f9f9;word-break:keep-all;white-space:nowrap;overflow: hidden;  text-overflow:ellipsis;}
  .richengList .col-md-6{padding-left: 10px;padding-right: 10px;}
  .biaoshi{border:1px solid #1093ed;}
  .calendar{border: none;}
  .a_rili_i .calendar-date .checkedDay{
    background-color: #ff6238;
    border:1px solid #ff6238 !important;
    color: #fff;
    font-weight: 700;
  }
  .a_rili_i .calendar-title span{padding: 0 1px;}
</style>
<div class="panel panel-default charsOrRicheng" style="height: 100%;">
  <link href="/public/home/homePageNew/fonts/iconfont.css" rel="stylesheet">
  <link href="/public/home/homePageNew/css/calendar.css" rel="stylesheet">
  <script src="/public/home/homePageNew/js/calendar.js"></script>
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading" style="height: 30px;background-color: white;">
    <h3 class="panel-title" style="padding: 0;line-height: 7px;">
      <span style="font-size: 14px;font-weight: normal;cursor: default;">日程信息</span>
    </h3>
  </div>
  <!-- 日程 start-->
  <div class="panel-body pbau only_this" style="position: relative;padding: 4px 15px;">
    <div style="padding: 0;">
      <div class="a_left a_rili_i" style="overflow: hidden;">
        <div id="calendar" class="calendar"></div>
      </div>
      <div class="a_right a_richeng_i">
        <p style="color: #166de4;font-weight: bold;font-size: 15px;cursor: default;">日程安排</p>
        <ul class="richengList" id="ul_content">
        </ul>
        <div style="height: 25px;width:100%;background-color: #FFFFFF;padding-left: 15px;padding-right: 15px;">
          <div class="add_last">
            <a class="ex2" href="#" style="margin-left: 0;width: 100%">
              <div class="_name" style="font-size: 12px;line-height: 25px;margin-left: 40px;">添加</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="viewDetail" class="modal fade" tabindex="-1" data-width="60%" aria-hidden="true" data-backdrop="static" >
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
      <h4 class="modal-title">日程详细</h4>
    </div>
    <div class="modal-body form-horizontal">
      <div class="form-group">
        <div class="col-md-2 control-div">日程信息:</div>
        <div class="col-md-10" id="scheduleContent_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">开始时间:</div>
        <div class="col-md-4" id="dateTimeStrS_">
        </div>
        <div class="col-md-2 control-div">结束时间:</div>
        <div class="col-md-4" id="dateTimeStrE_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">地址:</div>
        <div class="col-md-10" id="scheduleAdd_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">日程说明:</div>
        <div class="col-md-10" id="comment_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">创建人:</div>
        <div class="col-md-4" id="createMemberName_">
        </div>
        <div class="col-md-2 control-div">创建时间:</div>
        <div class="col-md-4" id="sysTime_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">提醒时间:</div>
        <div class="col-md-10" id="stepNumbers_">
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-2 control-div">提醒方式:</div>
        <div class="col-md-10" id="alarmKind_">
        </div>
      </div>
      <div id="onlyOne">
        <div class="form-group">
          <div class="col-md-2 control-div">所属人:</div>
          <div class="col-md-4" id="memberName_">
          </div>
          <div class="col-md-2 control-div">状态:</div>
          <div class="col-md-4" id="isComplete_">
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-2 control-div">重要:</div>
          <div class="col-md-4" id="importance_">
          </div>
          <div class="col-md-2 control-div">紧急:</div>
          <div class="col-md-4" id="scheduleUrgent_">
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-2 control-div">公开:</div>
          <div class="col-md-4" id="isPublic_">
          </div>
          <div class="col-md-2 control-div">日程类型:</div>
          <div class="col-md-4" id="scheduleKind_">
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-2 control-div">完成说明:</div>
          <div class="col-md-10" id="comment2_">
          </div>
        </div>
      </div>
      <table class="table table-striped table-bordered table-hover" id="memberTable" style="display: none">
        <thead>
        <tr role="row">
          <th>所属人</th>
          <th>重要</th>
          <th>紧急</th>
          <th>公开</th>
          <th>类型</th>
          <th>状态</th>
          <th>完成说明</th>
        </tr>
        </thead>
        <tbody id="memberBody">
        </tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button type="button" class="eiis-button btn-default" data-dismiss="modal" >关闭</button>
    </div>
  </div>
  <div id="add_edit_div" class="modal fade" data-width="60%" tabindex="-1" aria-hidden="true" data-backdrop="static" >
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
      <h4 class="modal-title" id="add_edit_title"></h4>
    </div>
    <div class="modal-body form-horizontal">
      <form id="saveForm">
        <input type="hidden" id="scheduleId" name="scheduleId"/>

        <div class="row">
          <div class="col-xs-12 col-md-12">
            <h5>日程信息:</h5>
            <textarea rows="2" class="eiis-text" placeholder="必填" onfocus="changeBorder(this)" name="scheduleContent" id="scheduleContent" ></textarea>
          </div>
        </div>
        <div class="row" style="margin-top: 8px;">
          <div class="col-xs-12 col-md-6" >
            <h5 id="dateTimeStrSLabel">开始时间:</h5>
            <input type="text" class="eiis-datetime" name="dateTimeStrS" onfocus="changeBorder(this)" id="dateTimeStrS" />
          </div>
          <div class="col-xs-12 col-md-6" id="dateTimeStrELabel" style="top: 4px">
            <h5 style="margin-top:-3px;">结束时间:</h5>
            <input type="text" class="eiis-datetime" name="dateTimeStrE" id="dateTimeStrE" />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-6 col-md-3">
            <h5>重要:</h5>
            <input type="checkbox" data-off-text="否" data-on-text="是" name="importance" id="importance">
          </div>
          <div class="col-xs-6 col-md-3">
            <h5>紧急:</h5>
            <input type="checkbox" data-off-text="否" data-on-text="是" name="scheduleUrgent" id="scheduleUrgent">
          </div>
          <div class="col-xs-6 col-md-3">
            <h5>是否公开:</h5>
            <input type="checkbox" data-off-text="否" data-on-text="是" id="isPublic">
          </div>
          <div class="col-xs-6 col-md-3">
            <h5>日程类型:</h5>
            <div class="input-group">
              <input type="text" class="form-control" id="scheduleKind" name="scheduleKind">
              <div class="input-group-btn">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"> <span class="caret"></span></button>
                <ul class="dropdown-menu dropdown-menu-right" role="menu" id="scheduleKindLi">
                  <li><a href="#scheduleKind" onclick="$('#scheduleKind').val('会议');">会议</a></li>
                  <li><a href="#scheduleKind" onclick="$('#scheduleKind').val('活动');">活动</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-12">
            <h5>提醒时间:</h5>
            <select class='select2' data-input='false' id="stepNumbers" name="stepNumbers" style='width:100%;'  multiple required='required' onchange="changeThisVal(this)">
              <option value="NoRemind">不提醒</option>
              <option value="0">立即提醒</option>
              <option value="-10">提前10分钟</option>
              <option value="-30">提前30分钟</option>
              <option value="-60">提前1小时</option>
              <option value="-120">提前2小时</option>
              <option value="-180">提前3小时</option>
              <option value="-1440">提前1天</option>
              <option value="-2880">提前2天</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-12">
            <h5>提醒方式:</h5>
            <select class="eiis-combobox" id="alarmKind" name="alarmKind">
              <option value="1">系统消息</option>
              <option value="2">其他</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-12">
            <h5>关联人:</h5>
            <input class="eiis-member" name="appScheduleMembers" id="appScheduleMembers" data-multiple='true' data-person="true" data-dept="true" data-post="true" />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <h5>地址:</h5>
            <input type="text" class="eiis-text" name="scheduleAdd" id="scheduleAdd" />
          </div>
          <div class="col-xs-12 col-md-6">
            <h5>备注:</h5>
            <input type="text" class="eiis-text" name="comment" id="comment" />
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" id="button_ok" onclick="add_edit_onsubmit()" >确定</button>
      <button type="button" class="eiis-button btn-default" data-dismiss="modal" >取消</button>
    </div>
  </div>
  <!-- 日程 end-->
</div>

<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.bootstrap.bswitch);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
    var richengList=$(".richengList");
    var stepNumber = "";
    var getScheduleInfoList=function(time){
      richengList.empty();
      if(time==undefined){
        time="";
      }
      $.ajax({
        type : "post",
        url : "/public/homePage/getScheduleInfoList.do",
        data : {
          beginTime : time
        },
        dataType : "json",
        success : function(msg){//<li><span>09:04 AM</span><a href="#">去开会上东汇到</a></li>
          if(msg.length==0){
            if(richengList.hasClass("richengTemp")){
              richengList.removeClass("richengTemp");
            }
            $(".a_richeng_i>ul").css("border-left","none");
            richengList.append("<li style='text-align: center;cursor: default;'>今日无日程安排</li>");
          }else{
              $(".a_richeng_i>ul").css("border-left","2px solid #eee");
            var num=0;
            var timeStr;
            var nowDateNum=getNowDateNum();
            var self;
            var _self;
            for(var i=0;i<msg.length;i++){
              self=msg[i];
              for(var k=0;k<self.scheduleMemberList.length;k++){
                _self=self.scheduleMemberList[k];
                !function(id){
                  if(_self.scheduleInfoEntity.startDay==_self.scheduleInfoEntity.endDay){
                    timeStr=_self.scheduleInfoEntity.dateTimeStrS;
                  }else{
                    if(_self.scheduleInfoEntity.startDay<nowDateNum && _self.scheduleInfoEntity.endDay>nowDateNum){
                        timeStr="00:00";
                    }else if(nowDateNum==_self.scheduleInfoEntity.startDay){
                      timeStr=_self.scheduleInfoEntity.dateTimeStrS;
                    }else{
                      timeStr="00:00";
                    }
                  }
                  richengList.append($("<li></li>").append($("<a></a>").append($("<div class='col-md-5 r_left'></div>").text(timeStr)).append($("<div class='col-md-7 r_right'></div>").text(_self.scheduleInfoEntity.scheduleContent)).attr("href","#").attr("title",_self.scheduleInfoEntity.scheduleContent).bind("click",function(){
                    viewDetail(id);
                  })));
                  num++;
                }(_self.scheduleId);
              }
            }
            if(num>3){
              if(!richengList.hasClass("richengTemp")){
                richengList.addClass("richengTemp");
              }
            }else{
              if(richengList.hasClass("richengTemp")){
                richengList.removeClass("richengTemp");
              }
            }
          }
        }
      });
    };
    var getNowDateNum=function(){
      var xuanzhong=$(".xuanzhong");
      if(xuanzhong.length==0){
        xuanzhong=$(".item-curDay");
      }
      var day=Number(xuanzhong.attr("data"));
      return day;
    };
    var add_edit_onsubmit=function(){
      var scheduleDetail = $("#scheduleContent").val();
      if (scheduleDetail.length == 0) {
        $("#scheduleContent").css("border","1px solid red");
        $.message("请填写日程信息");
        return false;
      }
      var create_time_str = $("#dateTimeStrS").val();
      if (create_time_str.length == 0) {
        $("#dateTimeStrS").css("border","1px solid red");
        $.message("请填写开始时间");
        return false;
      }
      var create_time_end = $("#dateTimeStrE").val();
      if(create_time_end.length != 0){
        if(create_time_end <= create_time_str){
          $.message("结束时间必须大于开始时间！");
          return false;
        }
      }else{
        $.message("请填写结束时间");
        return false;
      }
      var stepNumbers = $("#stepNumbers").val();
      if(stepNumbers==null){
        $.message("请选择提醒时间");
        return
      }
      if(stepNumbers[0]=="NoRemind"){
        $.message({
          button:$.message.button.yesNo
          ,text:"当前设置的提醒时间包含了'不提醒',继续保存'提醒时间'将不会生效,是否继续保存?"
          ,result:function(result){
            if(result == 6){
              var postData ={
                scheduleId:$("#scheduleId").val(),
                scheduleContent:$("#scheduleContent").val(),
                dateTimeStrS:$("#dateTimeStrS").val(),
                dateTimeStrE :$("#dateTimeStrE").val(),
                scheduleAdd:$("#scheduleAdd").val(),
                comment:$("#comment").val(),
                memberId:"<%=Context.getCurrent().getId().toString()%>",
                scheduleUrgent:$("#scheduleUrgent").bootstrapSwitch("state")? 1:0,
                importance:$("#importance").bootstrapSwitch("state")? 1:0,
                alarmKind:$("#alarmKind").val(),
                stepNumbers:"TiQian;"+$("#stepNumbers").val()+";",
                appScheduleMembers:$("#appScheduleMembers").val(),
                isPublic:$("#isPublic").bootstrapSwitch("state")? 1:0,
                scheduleKind:$("#scheduleKind").val(),
                createMemberTel:"<%=usertel%>"
              };
              $.post("/public/homePage/saveScheduleInfo.do",postData,function(rs){
                $.message(rs.msg);
                if(rs.flag){
                  $("#add_edit_div").modal("hide");
                  getScheduleInfoList(getSelectDate());
                }
              },"json");
            }
          }
        });
      }else {
        var postData ={
          scheduleId:$("#scheduleId").val(),
          scheduleContent:$("#scheduleContent").val(),
          dateTimeStrS:$("#dateTimeStrS").val(),
          dateTimeStrE :$("#dateTimeStrE").val(),
          scheduleAdd:$("#scheduleAdd").val(),
          comment:$("#comment").val(),
          memberId:"<%=Context.getCurrent().getId().toString()%>",
          scheduleUrgent:$("#scheduleUrgent").bootstrapSwitch("state")? 1:0,
          importance:$("#importance").bootstrapSwitch("state")? 1:0,
          alarmKind:$("#alarmKind").val(),
          stepNumbers:"TiQian;"+$("#stepNumbers").val()+";",
          appScheduleMembers:$("#appScheduleMembers").val(),
          isPublic:$("#isPublic").bootstrapSwitch("state")? 1:0,
          scheduleKind:$("#scheduleKind").val(),
          createMemberTel:"<%=usertel%>"
        };
        $.post("/public/homePage/saveScheduleInfo.do",postData,function(rs){
          $.message(rs.msg);
          if(rs.flag){
            $("#add_edit_div").modal("hide");
            getScheduleInfoList(getSelectDate());
          }
        },"json");
      }
    };
    var add_onclick=function(time){
      $("#add_edit_div input,#add_edit_div textarea").val("").attr("readonly",false).prop("disabled",false);
      $("#dateTimeStrS").attr("readonly","readonly").attr("placeholder","必填").val(time+" 00:00");
      $("#dateTimeStrE").attr("readonly","readonly");
      $("input[type=\"checkbox\"]").not("[data-switch-no-init]").bootstrapSwitch("state",false);
      $("#stepNumbers").val("NoRemind");
      stepNumber="NoRemind";
      $("#stepNumbers").select2();
      $("#alarmKind").val(1);
      $("#appScheduleMembers").val("").prop("disabled",false);
      $("#scheduleKind").val("");
      $("#add_edit_title").html("新增日程");
      $("#add_edit_div input,#add_edit_div textarea").each(function(){
        var name=$(this).attr("name");
        if(name=="scheduleContent" || name=="dateTimeStrS"){
          $(this).css("border","1px solid #ccc");
        }
      });
      $("#add_edit_div").modal();
    };
    var getText1=function(t,v){
      switch (t){
        case "sf":
        {
          switch (v){
            case 1:
              return "是";
            case 0:
              return "否";
            default:
              return "";
          }
        }
        case "sc":
        {
          var str="";
          if(v!="" && v.split(";").length>1){
            var rs= v.replaceAll("-","").split(";")[1].split(",");
            for(var i=0;i< rs.length;i++){
              if(rs[i]==""){
                continue;
              }
              switch (rs[i]){
                case "0":
                  str+= "立即提醒，";
                  break;
                case "NoRemind":
                  str+= "不提醒，";
                  break;
                case "60":
                  str+= "提前 1 小时，";
                  break;
                case "120":
                  str+= "提前 2 小时，";
                  break;
                case "180":
                  str+= "提前 3 小时，";
                  break;
                case "1440":
                  str+= "提前 1 天，";
                  break;
                case "2880":
                  str+= "提前 2 天，";
                  break;
                default :
                  str+= "提前 "+rs[i]+" 分钟，";
                  break;
              }
            }
          }else{
            str="不提醒";
          }
          return str;

        }
        case "fs":
        {
          switch (v){
            case 1:
              return "系统消息";
            case 2:
              return "其他";
            default :
              return "";
          }
        }
        case "zt":
        {
          switch (v){
            case true:
              return "完成";
            case false:
              return "";
            default :
              return"";
          }
        }

      }
    };
    var getSelectDate=function(){
      var time;
      $(".item").each(function(){
        if($(this).hasClass("xuanzhong")){
          time=$(this).attr("data").substring(0,4)+"-"+$(this).attr("data").substring(4,6)+"-"+$(this).attr("data").substring(6);
          return false;
        }
      });
      if(!time){
        var date=new Date();
        var month=date.getMonth()+1;
        var day=date.getDate();
        if(month<10){
          month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        time=date.getFullYear()+"-"+month+"-"+day;
      }
      return time;
    };
    var viewDetail=function(id){
      $.getJSON("/public/homePage/getScheduleInfoById.do",{scheduleId:id},function(res){
        $("#scheduleContent_").text(res.scheduleContent);
        $("#dateTimeStrS_").html(res.dateTimeStrS);
        $("#dateTimeStrE_").html(res.dateTimeStrE);
        $("#scheduleAdd_").html(res.scheduleAdd);
        $("#comment_").html(res.comment);
        $("#createMemberName_").html(res.createMemberName+"（"+res.createMemberTel+"）");
        $("#sysTime_").html(new Date(res.sysTime.time).format("yyyy-MM-dd HH:mm:ss"));
        $("#stepNumbers_").html(getText1("sc",res.stepNumbers));
          stepNumber = res.stepNumbers;
        $("#alarmKind_").html(getText1("fs",res.appScheduleMemberEntities[0].alarmKind));
        if(res.appScheduleMemberEntities.length > 1){
          $("#memberBody").empty();
          $("#onlyOne").hide();
          $("#memberTable").show();
          res.appScheduleMemberEntities.forEach(function(v,i){
            var tr = $("<tr />");
            var tds = "<td>"+ v.memberName +"</td><td>"+ getText1("sf",v.importance) +"</td><td>"+ getText1("sf",v.scheduleUrgent) +"</td><td>"+ getText1("sf",v.isPublic) +"</td><td>"+ v.scheduleKind +"</td>" +
                    "<td>"+ getText1("zt",v.isComplete) +"</td><td>"+ v.comment +"</td>";
            tr.append(tds);
            $("#memberBody").append(tr);
          });
        }else{
          $("#onlyOne").show();
          $("#memberTable").hide();
          var member = res.appScheduleMemberEntities[0];
          $("#memberName_").html(member.memberName);
          $("#importance_").html(getText1("sf",member.importance));
          $("#scheduleUrgent_").html(getText1("sf",member.scheduleUrgent));
          $("#isComplete_").html(getText1("zt",member.isComplete));
          $("#comment2_").html(member.comment);
          $("#isPublic_").html(getText1("sf",member.isPublic));
          $("#scheduleKind_").html(member.scheduleKind);
        }
        $("#viewDetail").modal("show");
      });
    };
    $(function(){
        require(["jquery.select240","/public/home/homePageNew/js/nicescroll.js"], function (select2) {
            $('select.select2').select2();
            $('#ul_content').niceScroll({
                cursorcolor: "#ccc",//#CC0071 光标颜色
                cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                cursorwidth: "3px", //像素光标的宽度
                cursorborder: "0", //     游标边框css定义
                cursorborderradius: "5px",//以像素为光标边界半径
                autohidemode: false //是否隐藏滚动条
            });
      });
        $(".arrow>span[class='arrow-prev']").empty().append('<i class="iconfont icon-riqiqiehuanzuo" style="font-size: 22px;color:#ff6238;"></i>').on("click",function () {
            mark_schedule('',true);
        });
        $(".arrow>span[class='arrow-next']").empty().append('<i class="iconfont icon-riqiqiehuan" style="font-size: 22px;color:#ff6238;"></i>').on("click",function () {
            mark_schedule('',true);
        });
      $(".item").on("click",function(){
          $(".calendar-date").find(".checkedDay").removeClass("checkedDay");
          $(this).addClass("checkedDay");
        var time=$(this).attr("data");
          checkedDay = time;
          if(time.length==7){
          if(Number(time.substring(6))<10){
            time=time.substring(0,4)+"-"+time.substring(4,6)+"-0"+time.substring(6);
          }else{
            time=time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6);
          }
        }else{
          time=time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6);
        }
        getScheduleInfoList(time);
        if($(this).hasClass("item-curDay")){
          $(this).removeClass("checkedDay");
          $("#backToday").hide();
          $(this).siblings(".item").removeClass("xuanzhong");
        }else{
          $("#backToday").show();
          if($(this).hasClass("before")){
            var data=$(this).attr("data");
            $(".arrow>span[class='arrow-prev']").trigger("click");
            $(".item[data='"+data+"']").addClass("xuanzhong").siblings(".item").removeClass("xuanzhong");
          }else if($(this).hasClass("last")){
            var data=$(this).attr("data");
            $(".arrow>span[class='arrow-next']").trigger("click");
            $(".item[data='"+data+"']").addClass("xuanzhong").siblings(".item").removeClass("xuanzhong");
          }else{
            $(this).addClass("xuanzhong").siblings(".item").removeClass("xuanzhong");
          }
        }
        mark_schedule('',false);
      });
      getScheduleInfoList();
      $("#backToday").bind("click",function(){
        checkedDay = "";
        $(".calendar-date").find(".checkedDay").removeClass("checkedDay");
        var date=new Date();
        var month=date.getMonth()+1;
        var day=date.getDate();
        if(month<10){
          month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        getScheduleInfoList(date.getFullYear()+"-"+month+"-"+day);
        mark_schedule('',true);
      });
      $(".add_last").bind("click",function(){
        var date = getSelectDate();
        $("#dateTimeStrS").datetimepicker('setStartDate', date);
        $("#dateTimeStrE").datetimepicker('setStartDate', date);
        add_onclick(date);
      });

        mark_schedule('',false);
    });

    var checkedDay = "";
    function mark_schedule(type,isRemove) {
       var text =  $('.calendar-title>.title').text();
       var calendar = text.substring(0,4)+"-"+text.substring(5,7);
        $.ajax({
            type : "post",
            url : "/public/homePageWork/getScheduleDates.do",
            data : {
                tempDate:calendar,
                type : type
            },
            dataType : "json",
            success : function(res){
                if(isRemove) $(".item").removeClass("xuanzhong");
                if(!isRemove){
                    var isHave = $(".calendar-date").find("li[data='"+checkedDay+"']").hasClass("item-curDay");
                    if(!isHave) $(".calendar-date").find("li[data='"+checkedDay+"']").addClass("checkedDay");
                }
                if(res && res.length>0){
                    for(var i=0;i<res.length;i++){
                        var day_s = res[i];
                        $(".calendar-date").find("li[data='"+day_s+"']").addClass("xuanzhong");
                    }
                }
            },error:function () {
                if(isRemove) $(".item").removeClass("xuanzhong");
            }
        });
    }
    
  var changeBorder=function (id){
    $(id).css("border","1px solid #ccc");
  };

  function changeThisVal(thisId) {
     var values = $(thisId).val();
     if(values && values.length>0){
         if(stepNumber.indexOf("NoRemind")>=0 && values.length>=2){
             for(var i=0;i<values.length;i++){
                 if(values[i]!="NoRemind"){
                     $("#stepNumbers").val(values[i]);
                     $("#stepNumbers").select2();
                     stepNumber=values[i];
                     break;
                 }
             }
         }else{
             var isHave = false;
             for(var i=0;i<values.length;i++){
                 if(values[i]=="NoRemind"){
                     isHave = true;
                     break;
                 }
             }
             if(isHave){
                 $("#stepNumbers").val("NoRemind");
                 $("#stepNumbers").select2();
                 stepNumber="NoRemind";
             }else{
                 for(var i=0;i<values.length;i++){
                     if(i==0) stepNumber=values[i];
                     else stepNumber+=";"+values[i];
                 }
             }
         }

     }else{
         stepNumber = "";
     }

  }
</script>