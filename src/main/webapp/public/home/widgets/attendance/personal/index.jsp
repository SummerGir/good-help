<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%
  SimpleDateFormat format = new SimpleDateFormat("yyyy年MM月");
  String currentMonthCn = format.format(new Date());
%>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.UI);
        EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
    </script>
    <style>
      .current_month{font-size: 15px;padding-top: 1px;padding-bottom: 1px;color: #166de4;font-weight: bold;cursor: default;}
      .left_table{cursor: default;}
      .left_table td{border:solid #e2e2e2; border-width:0px 1px 1px 0px;}
      .left_table table{border:solid #e2e2e2; border-width:1px 0px 0px 1px;}
      .left_table ._result_d{font-size: 12px;color: #ababab;height: 22px;font-weight: bold;text-align: center;}
      .left_table ._result{font-size: 12px;color: #ababab;height: 22px;font-weight: bold;}
      .left_table ._result .att_res{padding-left: 25%;}
      .left_table ._result .ci{color: #000;float: right;margin-right: 20%;}
      .left_table ._title{text-align: center;font-size: 12px;color: #5e5e5e;background-color: #f9f9f9;height: 22px;}
      .left_table ._time{text-align: center;font-size: 12px;color: #919191;height: 22px;background-color: #f9f9f9;letter-spacing:3px;}
      .left_table .table_title{padding-left:10px;padding-top: 2px;padding-bottom:1px;color:#000;font-size: 12px;font-weight: bold;height: 23px;}
      .line_div{font-size: 13px;height: 26px;width: 100%;background-color: #f9f9f9;margin-bottom: 4px;line-height: 26px;overflow: hidden;text-overflow:ellipsis;  white-space: nowrap;}
      .right_title{text-align: center;font-size: 15px;padding-top: 4px;padding-bottom: 4px;color: #ffa338;font-weight: bold;height: 26px;cursor: default;}
      .right_head{height: 24px;width: 100%;line-height: 24px;font-size: 12px;color:#000;font-weight: bold;margin-top: 6px;background-color: #ffefdd;margin-bottom: 6px;overflow: hidden;cursor: default;}
      .right_context .r_left{float: left;background-color: #f9f9f9;text-align: left;height: 26px;line-height: 26px;border-left: 1px solid #f39c12;color:#5e5e5e;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;font-size: 12px;cursor: default;}
      .right_context .r_right{float: left;text-align: right;height: 26px;line-height: 26px;color: #000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;background-color: #f9f9f9;overflow: hidden;cursor: pointer;}
    </style>
    <div class="panel panel-default" style="height: 100%;">
      <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
      <div class="panel-heading" style="background-color:#fff;padding: 1px 15px;line-height: 30px;">
        <h3 class="panel-title">
          <span style="font-size: 14px;cursor: default;">考勤月度统计</span>
        </h3>
      </div>
        <div class="panel-body" style="height: auto;padding: 0px 15px!important;">
          <div class="col-md-6" style="padding-left: 0 !important;padding-right: 6px!important;border-right: 4px solid #ddd;">
            <div>
              <div class="col-md-3" style="padding: 1px 0 1px 0 !important;">
                <div style="float: left;">
                  <a  href="javascript:void(0);" style="text-decoration: none;" onclick="getPersonAttendance('reduce')"><i class="iconfont icon-riqiqiehuanzuo" style="font-size: 20px;color:#ff6238;"></i></a>
                </div>
                <div style="float: left;">
                  <a href="javascript:void(0);" style="text-decoration: none;" onclick="getPersonAttendance('add')"><i class="iconfont icon-riqiqiehuan" style="font-size: 20px;color:#ff6238;"></i></a>
                </div>
              </div>
              <div class="col-md-9 current_month"><%=currentMonthCn%></div>
              <input hidden class="currentMonth"/>
            </div>
            <div class="left_table">
              <table style="width: 100%;">
                <tr>
                  <td colspan="4" class="table_title">今日考勤</td>
                </tr>
                <tr>
                  <td width="25%" class="_time startTime"></td>
                  <td width="25%" class="_result_d signResult"></td>
                  <td width="25%" class="_time endTime"></td>
                  <td width="25%" class="_result_d signOutResult"></td>
                </tr>
                <tr>
                  <td colspan="4" class="table_title">本月统计</td>
                </tr>
                <tr>
                  <td width="25%" class="_title">应签考勤</td>
                  <td width="25%" class="_result counts"></td>
                  <td width="25%" class="_title">正常考勤</td>
                  <td width="25%" class="_result normalAttendance"></td>
                </tr>
                <tr>
                  <td width="25%" class="_title">上班缺卡</td>
                  <td width="25%" class="_result signNotDone"></td>
                  <td width="25%" class="_title">下班缺卡</td>
                  <td width="25%" class="_result signOutNotDone"></td>
                </tr>
                <tr>
                  <td width="25%" class="_title">迟&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到</td>
                  <td width="25%" class="_result late"></td>
                  <td width="25%" class="_title">早&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;退</td>
                  <td width="25%" class="_result leaveEarly"></td>
                </tr>
                <tr>
                  <td width="25%" class="_title">全天旷工</td>
                  <td width="25%" class="_result absenteeismNotDone"></td>
                  <td width="25%" class="_title">迟到旷工</td>
                  <td width="25%" class="_result lateAbsenteeism"></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="col-md-6" style="padding-right: 0 !important;padding-left: 9px !important;">
            <div class="right_title">考勤异常动态</div>
            <div style="width: 100%;">
              <div class="right_head">
                <div class="col-md-6" style="float: left;text-align: center;">异常时间</div>
                <div class="col-md-6" style="float: left;text-align: center;">处理状态</div>
              </div>
              <div class="right_context" style="height: 128px;"></div>
            </div>
          </div>
        </div>

      <div id="explain_main" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3 class="modal-title">
            <span style="font-weight: bold;" id="explain_main_span"></span>
          </h3>
        </div>
        <div class="panel-body form-horizontal" style="margin-left: 15px;margin-right: 15px;border: none;">
          <div name="next_m">
            <h5>下一步处理者：</h5>
            <div name="next_m_labels" style="padding-top: 5px;">

            </div>
          </div>
          <h5>申述理由：</h5>
          <textarea id="content" class="form-control" rows="5"></textarea>
          <input type="hidden" id="explain_resultId"/>
        </div>
        <div class="modal-footer">
          <button onclick="beforeexplain_main();" type="button" class="btn btn-info">
            <i class="fa fa-check"></i> 发送流程
          </button>
          <button type="button" class="btn btn-default" data-dismiss="modal">
            <i class="fa fa-times"></i> 取消
          </button>
        </div>
      </div>

      <script type="text/javascript">
          var flow_postData;
          var clickCount = 0;
          var thisDiv;
            $(function(){
                getPersonAttendance();
            });
            function getPersonAttendance(type) {
                var currentMonth = $(".currentMonth").val();
                $.ajax({
                    type : "post",
                    url : "/public/homePageWork/getPersonAttendance.do",
                    data : {
                        currentMonth : currentMonth,
                        type:type
                    },
                    dataType : "json",
                    success : function(data){
                      if(data){
                          $(".current_month").text(data.currentMonthCn);
                          $(".currentMonth").val(data.currentMonth);
                          $(".right_context").empty();
                          if(data.todayAttendance){
                              var todayAttendance = data.todayAttendance;
                              $(".startTime").text(todayAttendance.startTime);
                              $(".signResult").text(todayAttendance.signResult);
                              $(".endTime").text(todayAttendance.endTime);
                              $(".signOutResult").text(todayAttendance.signOutResult);
                          }
                          if(data.currentMonthAttendance){
                              var currentMonthAttendance = data.currentMonthAttendance;
                              var counts =  currentMonthAttendance.counts;
                              if(parseInt(counts)>0)
                                  counts = "<span class='att_res' style='color: #166de4;'>"+counts+"</span>";
                              else counts = "<span class='att_res'>"+counts+"</span>";
                              $(".counts").html(counts+"<span class='ci'>次</span>");
                              var normalAttendance = currentMonthAttendance.normalAttendance;
                              if(parseInt(normalAttendance)>0)
                                  normalAttendance = "<span class='att_res' style='color: #13c054;'>"+normalAttendance+"</span>";
                              else normalAttendance = "<span class='att_res'>"+normalAttendance+"</span>";
                              $(".normalAttendance").html(normalAttendance+"<span class='ci'>次</span>");
                              var signNotDone = currentMonthAttendance.signNotDone;
                              if(parseInt(signNotDone)>0)
                                  signNotDone = "<span class='att_res' style='color: #ffa338;'>"+signNotDone+"</span>";
                              else signNotDone = "<span class='att_res'>"+signNotDone+"</span>";
                              $(".signNotDone").html(signNotDone+"<span class='ci'>次</span>");
                              var signOutNotDone = currentMonthAttendance.signOutNotDone;
                              if(parseInt(signOutNotDone)>0)
                                  signOutNotDone = "<span class='att_res' style='color: #ffa338;'>"+signOutNotDone+"</span>";
                              else signOutNotDone = "<span class='att_res'>"+signOutNotDone+"</span>";
                              $(".signOutNotDone").html(signOutNotDone+"<span class='ci'>次</span>");
                              var late = currentMonthAttendance.late;
                              if(parseInt(late)>0)
                                  late = "<span class='att_res' style='color: #ff3600;'>"+late+"</span>";
                              else late = "<span class='att_res'>"+late+"</span>";
                              $(".late").html(late+"<span class='ci'>次</span>");
                              var leaveEarly = currentMonthAttendance.leaveEarly;
                              if(parseInt(leaveEarly)>0)
                                  leaveEarly = "<span class='att_res' style='color: #ff3600;'>"+leaveEarly+"</span>";
                              else leaveEarly = "<span class='att_res'>"+leaveEarly+"</span>";
                              $(".leaveEarly").html(leaveEarly+"<span class='ci'>次</span>");
                              var absenteeismNotDone = currentMonthAttendance.absenteeismNotDone;
                              if(parseInt(absenteeismNotDone)>0)
                                  absenteeismNotDone = "<span class='att_res' style='color: #ff3600;'>"+absenteeismNotDone+"</span>";
                              else absenteeismNotDone = "<span class='att_res'>"+absenteeismNotDone+"</span>";
                              $(".absenteeismNotDone").html(absenteeismNotDone+"<span class='ci'>次</span>");
                              var lateAbsenteeism = currentMonthAttendance.lateAbsenteeism;
                              if(parseInt(lateAbsenteeism)>0)
                                  lateAbsenteeism = "<span class='att_res' style='color: #ff3600;'>"+lateAbsenteeism+"</span>";
                              else lateAbsenteeism = "<span class='att_res'>"+lateAbsenteeism+"</span>";
                              $(".lateAbsenteeism").html(lateAbsenteeism+"<span class='ci'>次</span>");
                          }
                          if(data.explain.length>0){
                              var explain = data.explain;
                              for(var i=0;i<explain.length;i++){
                                  var flowResult = explain[i].flowResult;
                                  var index = flowResult.indexOf("审核中");
                                  if(index>0){
                                      var p = flowResult.substring(0,index);
                                      var s = flowResult.substring(index);
                                      flowResult = "<span style='color: #166de4;'>"+p+"</span>"+s;
                                  }
                                  $(".right_context").append('<div class="line_div"><div class="col-md-6 r_left">'+explain[i].explainTime+'</div><div class="col-md-6 r_right" style="cursor: pointer;" onclick="explainFlow(this,\''+explain[i].timeState+'\',\''+explain[i].resultId+'\',\''+explain[i].explainContent+'\',\''+explain[i].startTime+'\',\''+explain[i].endTime+'\',\''+explain[i].resultKind+'\')">'+flowResult+'</div></div>');
                              }
                              if(explain.length>4)
                                  $(".right_context").css("overflow-y","scroll");
                          }else {
                              $(".right_context").append('<div class="line_div"><div class="col-md-6 r_left">无数据</div><div class="col-md-6 r_right"></div></div>');
                          }
                      }
                    }
                });
            }

          function explainFlow(thisId,timeState,resultId,explainContent,startTime,endTime,resultKind) {
              thisDiv = thisId;
              if(timeState=="WorkOutside"||timeState=="OverTime"||timeState=="Travel"||timeState=="Leave"||timeState=="ChangeRest"){
                  var tempTime = startTime;
                  if(resultKind=="SignOut") tempTime = endTime;
                  $.ajax({
                      type : "post",
                      url : "/public/homePageWork/getUrl.do",
                      data : {
                          tempTime : tempTime,
                          flowType:timeState
                      },
                      dataType : "json",
                      success : function(data){
                          if(data.url!=""){
                              window.open(data.url);
                          }else{
                              $.message("当前申述无对应流程！")
                          }
                      }
                  });
              }else{
                  $.post("/app/attendance/record/action.jsp?action=getUrl",{resultId:resultId},function(res){
                      if(res.url!=""){
                          window.open(res.url);
                      }else{
                          $.post("/app/attendance/record/action.jsp?action=getNextMemberId",{},function(rs){
                              flow_postData = rs;
                              if(rs.nextMemberId && rs.nextMemberId.length > 0 && "line"==rs.flowDzqk){
                                  if(flow_postData.nextMemberId.split(";").length>1) {
                                      $("#explain_main div[name='next_m']").show();
                                      $("#explain_main div[name='next_m_labels']").empty();
                                      rs.nameJson = JSON.parse(rs.nameJson);
                                      $.each(flow_postData.nextMemberId.split(";"), function (i, o) {
                                          var lable = $('<label style="padding-right: 15px;">'
                                              +'<strong style="font-size: 16px;">'
                                              +'<input name="nextMember" id="nextMember" type="radio" value=""/>'
                                              +'<span style="margin-left: 5px;"></span>'
                                              +'</strong>'
                                              +'</label>');
                                          lable.find("input").val(o);
                                          lable.find("span").text(rs.nameJson[o]);
                                          if(i==0){
                                              lable.find("input").attr("checked","checked");
                                          }
                                          $("#explain_main div[name='next_m_labels']").append(lable);
                                      });
                                  }else{
                                      $("#explain_main div[name='next_m_labels']").empty().append('<input name="nextMember" id="nextMember" type="eiis-text" value="'+flow_postData.nextMemberId+'" />');
                                      $("#explain_main div[name='next_m']").hide();
                                  }
                                  $("#explain_main div[name='next_m']").show();
                                  $("#explain_main div[name='next_m_labels']").empty();
                                  $("#explain_main div[name='next_m_labels']").empty().append('<input  class="eiis-member" data-dept="false" data-post="false" data-person="true"  value="" placeholder="选择人员" name="nextMember" id="nextMember"/>');
                                  $("#explain_main input[name='nextMember']").val(rs.nextMemberId);
                              } else { //默认处理人不存在或者为自由流程时提供人员选择器
                                  $("#explain_main div[name='next_m_labels']").empty().append('<input  class="eiis-member" data-dept="false" data-post="false" data-person="true"  value="" placeholder="选择人员" name="nextMember" id="nextMember"/>');
                                  $("#explain_main input[name='nextMember']").val(rs.defaultPerson); //流程记忆功能提供人员选择器
                              }
                              $("#explain_main_span").html("发起申述");
                              $("#content").val(explainContent);
                              $("#explain_resultId").val(resultId);
                              $("#explain_main").modal();
                          },"json");
                      }
                  },"json");
              }
          }

          function beforeexplain_main() {
              var nextMember=$("#nextMember").val();
              if(nextMember==null|| nextMember.length<=0){
                  $.message("下一步处理者不能为空");
                  return;
              }else {
                  explain_main();
              }
          }

          function explain_main(){
              ++clickCount;
              var content=$("#content").val();
              var resultId=$("#explain_resultId").val();
              $.post("/app/attendance/record/action.jsp?action=newSign", {resultId: resultId,content:content}, function (rs) {
                  if (flow_postData.nextMemberId !="" && flow_postData.nextMemberId.split(";").length > 0) {
                      if(flow_postData.nextMemberId.split(";").length > 1){
                          flow_postData.nextMemberId = $("#nextMember").val();
                      }else{
                          flow_postData.nextMemberId = $("#nextMember").val();
                      }
                  }else{
                      flow_postData.nextMemberId = $("#nextMember").val();
                  }
                  $.message.loader.open("正在发起流程...");
                  if(clickCount==1){
                      auto_start_flow(rs.explainId,flow_postData.nextMemberId,flow_postData.nodes,flow_postData.actUuid,flow_postData.flowKey);
                  }
              }, "json");
          }

          function auto_start_flow(explainId,nextMemberId,nodes,actUuid,flowKey){
              var postData = {
                  "nextMemberId":nextMemberId,
                  "flowKey":flowKey,
                  "tableName":"APP_LBS_EXPLAIN",
                  "idFieldName":"EXPLAIN_ID",
                  "mainId":explainId,
                  "nextStep":nodes,
                  "actUuid":actUuid
              };
              $.post("/app/sqkjflows/autoStart.do",postData,function(rs){
                  if(rs.error==0){
                      $(thisDiv).html("<span style='color: #166de4;'>"+rs.memberName+"</span>审核中");
                  }
                  clickCount =0;
                  $.message.loader.close();
                  $.message(rs.msg);
                  $("#explain_main").modal("hide");
              },"json");
          }
      </script>
    </div>