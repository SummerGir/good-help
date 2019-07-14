<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.UI);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
</script>
<style>
  ._left .line{width: 100%;height: 30px;line-height: 30px;border-bottom: 1px solid #eee;}
  ._left .line .r_1{width: 40%;color: #5e5e5e;font-size: 12px;float: left;padding-left: 10px;border-right:1px solid #eee;text-overflow: ellipsis;overflow: hidden;cursor: pointer; }
  ._left .line .r_2{width: 60%;float: left;border-right:1px solid #eee;padding: 6px 8px;cursor: default;}
  ._left .p_1{background-color: #ffe48d;}
  ._left .line .r_2 .r_y{height: 18px;float: left;font-size: 12px;font-weight: bold;background-color: #2dcc72;color: #fff;text-align: center;line-height: 18px;}
  ._left .line .r_2 .r_n{height: 18px;float: left;font-size: 12px;font-weight: bold;background-color: #eee;color: #008cc6
  ;text-align: center;line-height: 18px;}
  .right_h{height: 24px;width: 100%;line-height: 24px;font-size: 12px;color:#000;font-weight: bold;background-color:#daf0ff; overflow: hidden;}
  .a_label .a_c{height: 48px;width:14.1%;border-radius: 4px;text-align: center;float: left;overflow: hidden;cursor: default;}
  .a_label .a_c .context{width: 100%;height: 22px;color: #fff;font-size: 12px;line-height: 20px; }
  .a_label .a_c .num{width: 100%;height: 25px;font-size: 20px;font-weight: bold;line-height: 24px;}
  ._right .r_left{float: left;background-color: #f9f9f9;text-align: left;height: 29px;line-height: 29px;border-left: 1px solid #1093ed;color:#5e5e5e;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;font-size: 12px;overflow: hidden;text-overflow: ellipsis; }
  ._right .r_right{float: left;text-align: right;height: 29px;line-height: 29px;color: #000;border-top: 1px solid #f9f9f9;border-bottom: 1px solid #f9f9f9;background-color: #f9f9f9;overflow: hidden;}

</style>
<div class="panel panel-default" style="height: 100%;">
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading" style="background-color:#fff;padding: 1px 15px;line-height: 30px;">
    <h3 class="panel-title">
      <span style="font-size: 14px;cursor: default;">今日考勤统计</span>
    </h3>
  </div>
  <div class="panel-body" style="height: auto;padding: 4px 15px !important;border: none;">
    <div class="a_label" style="height: 50px;width: 100%;">
      <div class="a_c" style="border: 1px solid #2dcc72;">
        <div class="num normal" style="color:#2dcc72 ;">0</div>
        <div class="context" style="background-color:#2dcc72;">正常签到</div>
      </div>
      <div class="a_c" style="border: 1px solid #ff6238;margin-left: 3%;">
        <div class="num signDone" style="color:#ff6238;">0</div>
        <div class="context" style="background-color:#ff6238;">上班缺卡</div>
      </div>
      <div class="a_c" style="border: 1px solid #ff6238;margin-left: 3%;">
        <div class="num signOutDone" style="color:#ff6238;">0</div>
        <div class="context" style="background-color:#ff6238;">下班缺卡</div>
      </div>
      <div class="a_c" style="border: 1px solid #2dcc72;margin-left: 3%;">
        <div class="num WorkOutside" style="color:#2dcc72;">0</div>
        <div class="context" style="background-color:#2dcc72;">人员外出</div>
      </div>
      <div class="a_c" style="border: 1px solid #2dcc72;margin-left: 3%;">
        <div class="num Leave" style="color:#2dcc72;">0</div>
        <div class="context" style="background-color:#2dcc72;">人员出差</div>
      </div>
      <div class="a_c" style="border: 1px solid #2dcc72;margin-left: 3%;">
        <div class="num travel" style="color:#2dcc72;">0</div>
        <div class="context" style="background-color:#2dcc72;">人员请假</div>
      </div>
    </div>
    <div style="margin-top: 4px;">
      <div class="col-md-6" style="padding: 0 !important;">
        <div class="_left" style="border: 1px solid #eee;height: 140px;overflow-y: scroll;"></div>
      </div>
      <div class="col-md-6" style="padding-right: 0 !important;">
        <div style="width: 100%;">
          <div class="right_h" style="margin-bottom: 6px;">
            <div class="col-md-6" style="cursor: default;float: left;text-align: center;">部门</div>
            <div class="col-md-6" style="cursor: default;float: left;text-align: center;">异常人员</div>
          </div>
          <div class="_right" style="height: 105px;cursor: default;"></div>
        </div>
      </div>
    </div>

  </div>

  <script type="text/javascript">
    var notSign;
      $(function(){
          getAttendanceToday();
      });
      function getAttendanceToday() {
          $.ajax({
              type : "post",
              url : "/public/homePageWork/getAttendanceToday.do",
              data : {},
              dataType : "json",
              success : function(data){
                if(data){
                    var remindContents = data.remindContents;
                    if(remindContents){
                        $(".normal").text(remindContents.normal);
                        $(".signDone").text(remindContents.signNotDone);
                        $(".signOutDone").text(remindContents.signOutNotDone);
                        $(".WorkOutside").text(remindContents.WorkOutside);
                        $(".Leave").text(remindContents.Leave);
                        $(".travel").text(remindContents.travel);
                    }
                    var deptAttendance = data.deptAttendance;
                    if(deptAttendance){
                        var max = parseFloat(deptAttendance.maxNum);
                        var rResult = deptAttendance.rResult;
                        var width = 0,maxNum=0;
                        var res="",r_y_w="",r_n_w="",text="";
                        var r_y=0,r_n=0,thisWidth=0;
                        if(rResult &&rResult.length>0){
                            for(var i=0;i<rResult.length;i++){
                                res = rResult[i];
                                if(width == 0) width = $("._left").width()*0.57-30;
                                r_y = parseFloat(res[1]);
                                r_n = parseFloat(res[2]);
                                if((r_y+r_n)<(max/2)) maxNum = max/2;
                                else maxNum = max;
                                thisWidth = width*((r_y+r_n)/maxNum);
                                 r_y_w = r_y/(r_y+r_n)*thisWidth+"px";
                                r_n_w = r_n/(r_y+r_n)*thisWidth+"px";
                                text = "<div class='line'><div class='r_1' onclick='showThis(this)'><nobr>"+res[0]+"</nobr></div><div class='r_2'><div class='r_y' style='width: "+r_y_w+"'>"+res[1]+"</div><div class='r_n' style='width: "+r_n_w+"'>"+(r_n>0?r_n:'')+"</div></div></div>";

                                $("._left").append(text);
                            }
                        }
                    }
                    var notSignPerson = data.notSignPerson;
                    notSign = data.notSignPerson;
                    if(notSignPerson && notSignPerson.length>0){
                        for(var i=0;i<notSignPerson.length;i++){
                            $("._right").append('<div class="line_div"><div class="col-md-7 r_left">'+notSignPerson[i].deptName+'</div><div class="col-md-5 r_right" title="" onmouseover="show_explain(this,\''+notSignPerson[i].memberId+'\')">'+notSignPerson[i].memberName+'</div></div>');
                        }
                        if(notSignPerson.length>3)
                            $("._right").css("overflow-y","scroll");
                    }else {
                        $("._right").append('<div class="line_div"><div class="col-md-7 r_left">无数据</div><div class="col-md-5 r_right"></div></div>');
                    }
                }
              }
          })
      };

      function showThis(thisId) {
          $(thisId).parent().siblings().find(".r_1").removeClass("p_1");
          if(notSign && notSign.length>0){
              $("._right").empty();
              var is = $(thisId).hasClass("p_1");
              var text = $(thisId).text().trim();
              if(is){
                  $(thisId).removeClass("p_1");
                  for(var i=0;i<notSign.length;i++){
                      $("._right").append('<div class="line_div"><div class="col-md-7 r_left">'+notSign[i].deptName+'</div><div class="col-md-5 r_right" title="" onmouseover="show_explain(this,\''+notSign[i].memberId+'\')">'+notSign[i].memberName+'</div></div>');
                  }
                  if(notSign.length>3)
                      $("._right").css("overflow-y","scroll");
              }else{
                  $(thisId).addClass("p_1");
                  var a=0;
                  for(var i=0;i<notSign.length;i++){
                      if(notSign[i].deptName==text){
                          $("._right").append('<div class="line_div"><div class="col-md-7 r_left">'+notSign[i].deptName+'</div><div class="col-md-5 r_right" title="" onmouseover="show_explain(this,\''+notSign[i].memberId+'\')">'+notSign[i].memberName+'</div></div>');
                          ++a;
                      }
                  }
                  if(a>3)
                      $("._right").css("overflow-y","scroll");
              }
          }else{
              $("._right").empty();
              $("._right").append('<div class="line_div"><div class="col-md-7 r_left">无数据</div><div class="col-md-5 r_right"></div></div>');
          }

      }

    function show_explain(thisId,memberId) {
        var isTrue = $(thisId).hasClass("e_1");
        if(!isTrue){
            $(thisId).addClass("e_1");
            $.ajax({
                type : "post",
                url : "/public/homePageWork/showExplain.do",
                data : {memberId:memberId},
                dataType : "json",
                success : function(res){
                    if(res) $(thisId).attr("title",res.result);
                }
            });
        }
        }
  </script>
</div>