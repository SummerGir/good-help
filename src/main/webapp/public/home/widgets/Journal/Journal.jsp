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
  String memberId = Context.getCurrent().getId().toString();
%>
<style>
  .rizhiList a{font-size: 13px;height: 26px;width: 100%;background-color: #f9f9f9;margin-top: 10px;line-height: 26px;}
  .rizhiList .r_left{float: left;background-color: #f9f9f9;text-align: left;height: 29px;line-height: 29px;border-left: 1px solid #2ac68d;color:#000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;font-size: 12px;font-weight: bold;}
  .rizhiList .r_right{float: left;text-align: left;height: 29px;line-height: 29px;color: #000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;background-color: #f9f9f9;word-break:keep-all;white-space:nowrap;overflow: hidden;  text-overflow:ellipsis;}
  .rizhiList .col-md-6{padding-left: 10px;padding-right: 10px;}
  .biaoshi{border:1px solid #1093ed;}
  .calendars{border: none;}
  .a_rili_rizhi .calendars-dates .checkedDays{
    background-color: #ff6238;
    border:1px solid #ff6238 !important;
    color: #fff;
    font-weight: 700;
  }
</style>
<div class="panel panel-default charsOrRicheng Journal" style="height: 100%;">
  <link href="/public/home/homePageNew/fonts/iconfont.css" rel="stylesheet">
  <link href="/public/home/homePageNew/css/calendar1.css" rel="stylesheet">
  <script src="/public/home/homePageNew/js/calendar1.js"></script>
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading" style="height: 30px;background-color: white;">
    <h3 class="panel-title" style="padding: 0;line-height: 7px;">
      <span style="font-size: 14px;font-weight: normal;cursor: default;">日志信息</span>
    </h3>
  </div>
  <!-- 日志 start-->
  <div class="panel-body pbau only_this" style="position: relative;padding: 4px 15px;">
    <div style="padding: 0;">
      <div class="a_left a_rili_rizhi" style="overflow: hidden;">
        <div id="calendars" class="calendars"></div>
      </div>
      <div class="a_right a_rizhi_i">
        <p style="color: #166de4;font-weight: bold;font-size: 15px;cursor: default;">日志内容</p>
        <ul class="rizhiList" id="rizhiList">
        </ul>
        <div style="height: 25px;width:100%;background-color: #FFFFFF;padding-left: 15px;padding-right: 15px;">
          <div class="add_next">
            <a class="ex1" href="#" style="margin-left: 0;width: 100%">
              <div class="name" style="font-size: 12px;line-height: 25px;margin-left: 40px;">添加</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <input hidden="hidden" id="JournaldayStr"/>
  </div>
  <div id="Journalform1" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
      <h3 class="modal-title">
        <span style="font-weight: bold;" id="Journaladd_edit_title"></span>
      </h3>
    </div>
    <div class="panel-body form-horizontal" style="padding: 15px">
      <input type="hidden" id="JournalitemId" value=""/>
      <div class="row">
        <div class="col-xs-12 col-md-12">
          <h5>工作内容:</h5>
          <textarea rows="3" class="eiis-text" name="Journalitem" id="Journalitem" placeholder="必填" onfocus="changeBorder(this)"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-12">
          <h5>完成情况:</h5>
          <select class="eiis-combobox" name="JournalisChk" id="JournalisChk" data-input="true" placeholder=" ">
            <option selected="selected" value=""></option>
            <option value="true">完成</option>
            <option value="false">未完成</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-12">
          <h5>未完成工作原因:</h5>
          <input type="text" class="eiis-text" name="Journalcomment" id="Journalcomment"/>
        </div>
      </div>
      <div class="row" id="fujian">

      </div>

    </div>
    <div class="modal-footer">
      <button onclick="Journal_add_edit_onsubmit();" id="saveBtn" type="button" class="btn btn-info">
        <i class="fa fa-check"></i>
        保存
      </button>
      <button type="button" class="eiis-button btn-default" data-dismiss="modal">
        <i class="fa fa-times"></i>
        取消
      </button>
    </div>
  </div>
  <!-- 日志 end-->
</div>

<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.bootstrap.bswitch);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
    var rizhiList=$(".rizhiList");
    var getJournalInfoList=function(time){
      rizhiList.empty();
      if(time==undefined){
        time="";
      }
      $.ajax({
        type : "post",
        url : "/app/worknote/mob/action.jsp?action=getCurrList",
        data : {
          memId:"<%=memberId%>",
          dayStr : time
        },
        dataType : "json",
        success : function(msg){
          if(msg.records==0){
            if(rizhiList.hasClass("richengTemp")){
              rizhiList.removeClass("richengTemp");
            }
            $(".a_rizhi_i>ul").css("border-left","none");
            rizhiList.append("<li style='text-align: center;cursor: default;'>今日无日志</li>");
          }else{
              $(".a_rizhi_i>ul").css("border-left","2px solid #eee");
            var num=0;
            var self;
            for(var i=0;i<msg.rows.length;i++){
              self=msg.rows[i];
                !function(id){
                  rizhiList.append($("<li></li>").append($("<a></a>").append($("<div class='col-md-12 r_right' style='border-left:1px solid #2ac68d;'></div>").text(self.item)).attr("href","#").attr("titles",self.item).bind("click",function(){
                    viewJournalDetail(id);
                  })));
                  num++;
                }(self.itemId);
            }
            if(num>3){
              if(!rizhiList.hasClass("richengTemp")){
                rizhiList.addClass("richengTemp");
              }
            }else{
              if(rizhiList.hasClass("richengTemp")){
                rizhiList.removeClass("richengTemp");
              }
            }
          }
        }
      });
    };

    var getNowDateNum=function(){
      var xuanzhong=$(".xuanzhong");
      if(xuanzhong.length==0){
        xuanzhong=$(".items-curDay");
      }
      var day=Number(xuanzhong.attr("data"));
      return day;
    };
    //日志保存
    var Journal_add_edit_onsubmit=function(){
      var theItem = $("#Journalitem").val().trim();
      console.log(theItem);
      if(theItem==""){
        $.message("工作内容不能为空")
        return
      }
      $.message.loader.open("正在保存...");
      $.post("/app/worknote/action.jsp",
              {
                action: "saveItem",
                mainId:$("#main_form input[name='mainId']").val(),
                dayStr: $("#JournaldayStr").val(),
                itemId: $("#JournalitemId").val().trim(),
                item: theItem.trim(),
                comment: $("#Journalcomment").val(),
                isChk: $("#JournalisChk").val(),
                files:$("#Journalfiles").val()
              }, function (rs) {
                if (rs.error == 0) {
                  $.message.loader.close();
                  $("#Journalform1").modal("hide");
                  getJournalInfoList($("#JournaldayStr").val());
                  $.message("保存成功");
                }
              }, "json");
    };
    //新增弹窗方法
    var add_rizhionclick=function(time){
        $("#Journalform1 *").each(function () {
          var name = $(this).attr("name");
          if (name != undefined) {
            $(this).val("");
          }
          $("#fujian").empty().append('<div class="col-xs-12 col-md-12"> <h5>附件:</h5> <input class="eiis-netdisk" id="Journalfiles" data-multiple="true" data-dir-code="001" data-isSource="true" name="Journalfiles" /> </div>');
        });
        $("#JournalitemId").val("");
        $("#JournalisChk").val("");
        $("#Journaladd_edit_title").html("新增工作日志");
        $("#Journalform1 textarea").each(function(){
          $(this).css("border","1px solid #ccc");
        });
        $("#Journalform1").modal();
    };
    //选中某天
    var getJournalSelectDate=function(){
      var time;
      $(".items").each(function(){
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
    //查看明细
    var viewJournalDetail=function(id){
      $.ajax({
        async:false,
        dataType:'json',
        type:'post',
        url:"/app/worknote/mob/action.jsp?action=getOneMain",
        data:{itemId:id},
        success:function(res) {
            $("#fujian").empty().append('<div class="col-xs-12 col-md-12"> <h5>附件:</h5> <input class="eiis-netdisk" id="Journalfiles" data-multiple="true" data-dir-code="001" data-isSource="true" name="Journalfiles" /> </div>');
          $("#Journaladd_edit_title").html("修改工作日志");
          $("#Journalform1 textarea").each(function(){
            $(this).css("border","1px solid #ccc");
          });
          $("#Journalform1 *").each(function () {
            var name = $(this).attr("name");
            if (name != undefined) {
              $(this).val(res[name.slice(7)]);
            }
          });
          var daytime=res.dayId.toFixed(0).slice(0,4)+"-"+res.dayId.toFixed(0).slice(5,6)+"-"+res.dayId.toFixed(0).slice(7,8);
            $("#JournaldayStr").val(daytime);
          $("#JournalitemId").val(id);
          $("Journalitem").val();
          $("#Journalform1").modal();
        }
      });
    };
    $(function(){
        require(["jquery.select240","/public/home/homePageNew/js/nicescroll.js"], function (select2) {
            $('select.select2').select2();
            $('#rizhiList').niceScroll({
                cursorcolor: "#ccc",//#CC0071 光标颜色
                cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                cursorwidth: "3px", //像素光标的宽度
                cursorborder: "0", //     游标边框css定义
                cursorborderradius: "5px",//以像素为光标边界半径
                autohidemode: false //是否隐藏滚动条
            });
      });
        $(".arrow>span[class='arrow-prevs']").empty().append('<i class="iconfont icon-riqiqiehuanzuo" style="font-size: 22px;color:#ff6238;"></i>').on("click",function () {
            mark_Journal('',true);
        });
        $(".arrow>span[class='arrow-nexts']").empty().append('<i class="iconfont icon-riqiqiehuan" style="font-size: 22px;color:#ff6238;"></i>').on("click",function () {
          mark_Journal('',true);
        });
      $(".items").on("click",function(){
        $(".calendars-dates").find(".checkedDays").removeClass("checkedDays");
        $(this).addClass("checkedDays");
        var time=$(this).attr("data");
        checkedDays = time;
        if(time.length==7){
          if(Number(time.substring(6))<10){
            time=time.substring(0,4)+"-"+time.substring(4,6)+"-0"+time.substring(6);
          }else{
            time=time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6);
          }
        }else{
          time=time.substring(0,4)+"-"+time.substring(4,6)+"-"+time.substring(6);
        }
        $("#JournaldayStr").val(time);
        getJournalInfoList(time);
        if($(this).hasClass("items-curDay")){
          $(this).removeClass("checkedDays");
          $("#backTodays").hide();
          $(this).siblings(".items").removeClass("xuanzhong");
        }else{
          $("#backTodays").show();
          if($(this).hasClass("before")){
            var data=$(this).attr("data");
            $(".arrow>span[class='arrow-prevs']").trigger("click");
            $(".items[data='"+data+"']").addClass("xuanzhong").siblings(".items").removeClass("xuanzhong");
          }else if($(this).hasClass("last")){
            var data=$(this).attr("data");
            $(".arrow>span[class='arrow-nexts']").trigger("click");
            $(".items[data='"+data+"']").addClass("xuanzhong").siblings(".items").removeClass("xuanzhong");
          }else{
            $(this).addClass("xuanzhong").siblings(".items").removeClass("xuanzhong");
          }
        }
        mark_Journal('',false);
      });
      getJournalInfoList();
      $("#backTodays").bind("click",function(){
        checkedDays = "";
        $(".calendars-dates").find(".checkedDays").removeClass("checkedDays");
        var date=new Date();
        var month=date.getMonth()+1;
        var day=date.getDate();
        if(month<10){
          month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        getJournalInfoList(date.getFullYear()+"-"+month+"-"+day);
        mark_Journal('',true);
      });
      $(".add_next").bind("click",function(){
        add_rizhionclick();
      });
      var today = new Date();
      var todaytime = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
      $("#JournaldayStr").val(todaytime);
      mark_Journal('',false);
    });
    //标记日历有数据日子
    var checkedDays = "";
    var mark_Journal=function(type,isRemove) {
       var text =  $('.calendars-titles>.titles').text();
       var calendars = text.substring(0,4)+"-"+text.substring(5,7);
        $.ajax({
            type : "post",
            url : "/app/worknote/action.jsp?action=getMainList",
            data : {dayS: getdayStart(),dayE:getdayEnd(),memId:"<%=memberId%>"},
            dataType : "json",
            success : function(res){
                if(isRemove) $(".items").removeClass("xuanzhong");
              if(!isRemove) {
                var isHave = $(".calendars-dates").find("li[data='" + checkedDays + "']").hasClass("items-curDay");
                if (!isHave) $(".calendars-dates").find("li[data='" + checkedDays + "']").addClass("checkedDays");
              }
                if(res && res.rows.length>0){
                    for(var i=0;i<res.rows.length;i++){
                        var day_s = res.rows[i].dayId;
                        $(".calendars-dates").find("li[data='"+day_s+"']").addClass("xuanzhong");
                    }
                }
            },error:function () {
                if(isRemove) $(".items Journal").removeClass("xuanzhong");
            }
        });
    }
    var getdayStart= function() {
      var now = new Date();
      var month = now.getMonth() + 1;//js获取到的是月份是 0-11 所以要加1
      var year = now.getFullYear();
      var tenDay = 1000 * 24 * 60 * 60*10;
      var nowMonthFirstDay = new  Date([year,month,1].join('-')).getTime();
      var daystart = new Date(nowMonthFirstDay - tenDay).getDate();
      var monthstart = new Date(nowMonthFirstDay - tenDay).getMonth()+1;
      var yearstart = new Date(nowMonthFirstDay - tenDay).getFullYear();
      if(daystart<10){
        daystart = "0"+daystart;
      }
      if(monthstart<10){
        monthstart = "0"+monthstart;
      }
      return [yearstart,monthstart,daystart].join('-')
    }
    var getdayEnd= function() {
      var now = new Date();
      var month = now.getMonth() + 1;//js获取到的是月份是 0-11 所以要加1
      var year = now.getFullYear();
      var nextMonthFirstDay = new Date([year,month + 1,1].join('-')).getTime();
      var tenDay = 1000 * 24 * 60 * 60*10;
      var dayLast = new Date(nextMonthFirstDay + tenDay).getDate();
      var monthLast = new Date(nextMonthFirstDay + tenDay).getMonth()+1;
      var yearLast = new Date(nextMonthFirstDay + tenDay).getFullYear();
      if(dayLast<10){
        dayLast = "0"+dayLast;
      }
      if(monthLast<10){
        monthLast = "0"+monthLast;
      }
      return [yearLast,monthLast,dayLast].join('-')
    }
</script>