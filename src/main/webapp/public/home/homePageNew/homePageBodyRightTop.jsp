<%@ page import="eiis.context.Context" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="eiis.app.taskplan.RemindKind" %>
<%@ page import="eiis.app.taskplan.TaskState" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%
  JSONObject taskRKJson = new JSONObject();
  StringBuffer rkOp=new StringBuffer();
  for(RemindKind rk : RemindKind.values()){
    rkOp.append("<option value='"+rk.toString()+"'>"+rk.getKindStrCn().toString()+"</option>");
    taskRKJson.put(rk.toString(),rk.getKindStrCn().toString());
  }

  JSONObject taskPlanJson = new JSONObject();
  JSONObject colorJson = new JSONObject();
  for(TaskState ts : TaskState.values()){
    String color="";
    if("NotStart".equals(ts.toString()))//未开始
      color="#666";
    else if("Processing".equals(ts.toString()))//进行中
      color="#58c1df";
    else if("Stop".equals(ts.toString()))//中止
      color="#f1ad4e";
    else if("Complete".equals(ts.toString()))//已完成
      color="#5cb95c";
    else if("Overdue".equals(ts.toString()))//已超期
      color="#d9524e";

    colorJson.put(ts.toString(),color);
    taskPlanJson.put(ts.toString(),ts.getKindStrCn());
  }
%>
<style>
  .work .panel-body{padding: 0;overflow: hidden;border: 1px solid #ddd;}
  .work .clearfix em{font-style: normal;}
  .work .tabselect_admin .tab-content{padding: 0 !important;}
  .work .tabselect_admin a{margin-right: 5%}
  .work .nav-tabs>a{padding:5px 10px 5px 10px; color: #919191;display: block;float: left; text-decoration: none;font-size: 14px;}
  .work .nav-tabs>a:hover{background:none; border-bottom: 2px solid #ff9800; }
  .work .nav-tabs>a.active{border:none;border-bottom: 2px solid #ff9800; background: none; color: #000}

  .work .tab_content_admin ul{padding-left: 0}
  .work .tab_content_admin ul li{border-bottom: none;height: 30px; line-height: 30px; overflow: hidden; margin-right: 0;padding-left: 6px;padding-right: 20px;}
  .work .tab_content_admin ul li i,.work .tab_content_admin ul li a,.work .tab_content_admin ul li span,.work  .tab_content_admin ul li em{display: block; color: #000; float: left;}
  .work .tab_content_admin ul li i{display: block;width: 5px; height: 5px; border-radius: 50%; margin-top: 12px; margin-right: 5px}
  .work .tab_content_admin ul li span{color: #919191;}
  .work .tab_content_admin ul li em{float: right;color: #919191;}
  .work .tab_content_admin i.i1{background: #fd0100}
  .work .tab_content_admin i.i2{background: #d49703}
  .work .tab_content_admin i.i3{background: #03cd02}
  .work .tab_content_admin ul li a{width: 66%; color: #000}
  #form1 .row{margin:0;}
  #form1 textarea[readonly],#form1 input[disabled]{
    background-color: #FFF;
    color: #000;
    opacity: 1;
  }

</style>
<!--工作助手-->
<div class="panel panel-default work" style="height: 100%;">
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading" style="height: 30px;background-color: white">
    <h3 class="panel-title" style="padding: 0;line-height: 7px;">
      <span style="font-size: 14px;;font-weight: normal;cursor: default;">工作助手</span>
    </h3>
  </div>
  <div style="padding: 8px 15px;">
    <div class="panel-body tabselect_admin" style="height: 188px;">
      <div id="tab_admin" class="nav nav-tabs">
        <a  class="active" href="#liucheng" data-toggle="tab">流程</a>
        <a href="#renwu" data-toggle="tab">任务</a>
        <a href="#youjian" data-toggle="tab">邮件</a>
        <a href="#rizhi" data-toggle="tab">日志</a>
      </div>
      <div class="tab-content tab_content_admin">
        <div class="tab-pane fade in active" id="liucheng">
          <ul class="clearfix">
          </ul>
        </div>
        <div class="tab-pane fade" id="renwu">
          <ul class="clearfix">
          </ul>
        </div>
        <div class="tab-pane fade" id="youjian">
          <ul class="clearfix">
          </ul>
        </div>
        <div class="tab-pane fade" id="rizhi">
          <ul class="clearfix">
          </ul>
        </div>
        <div>
          <div id="form1" class="modal" tabindex="-1" aria-hidden="true" data-backdrop="static">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h3 class="modal-title">
                <span style="font-weight: bold;" id="add_edit_title"></span>
              </h3>
            </div>
            <div class="panel-body form-horizontal">
              <input type="hidden" id="itemId" value=""/>
              <div class="row">
                <div class="col-xs-12 col-md-12">
                  <h5>工作内容:</h5>
                  <textarea rows="3" class="eiis-text" name="information" placeholder="必填" readonly></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-md-12">
                  <h5>完成情况:</h5>
                  <input type="text" class="eiis-text" disabled name="isChk"/>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-md-12">
                  <h5>未完成工作原因:</h5>
                  <input type="text" class="eiis-text" disabled name="comment"/>
                </div>
              </div>
              <div class="row files"></div>

            </div>
            <div class="modal-footer">
              <button type="button" class="eiis-button btn-default" data-dismiss="modal">
                <i class="fa fa-times"></i>
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
      <script>
          var taskId;
          var memberName="<%=Context.getCurrent().getName()%>";
          var taskRKJson=<%=taskRKJson%>;
          var taskPlanJson=<%=taskPlanJson%>;
          $(function () {
              $(".nav-tabs>a").bind("click.temp",function(){
                  var self=$(this);
                  if(!self.hasClass("active")){
                      self.parent().parent().find(".active").removeClass("active");
                      self.addClass("active");
                  }
              });
              $('#tab_admin li:eq(0) a').tab('show');
              $("#jindu_modal_main button[class='close']").bind("click",function(){
                  $("#renwu>ul[class='clearfix']").html("");
                  getTask();
              });
          });
          function showTask(id){
              window.open("/app/taskplan/pc/index.jsp?taskId="+id+"&showType=readonly");
          }
          function showLog(data){
              $("#form1").modal();
              $("#form1 *").each(function () {
                  var name = $(this).attr("name");
                  if (name != undefined) {
                      if(name=="isChk"){
                          if(data[name]=="true") $(this).val("已完成");
                          else if(data[name]=="false") $(this).val("未完成");
                          else  $(this).val("");
                      } else{
                          $(this).val(data[name]);

                      }
                  }
              });
              if(data.files){
                  $(".files").prev().css("margin-bottom","0");
                  $(".files").css("display","block");
                  var div='<div class="col-xs-12 col-md-12"><h5>附件:</h5><input class="eiis-netdisk" id="files" data-multiple="true" data-dir-code="001" data-isSource="true" name="files" disabled/></div>';
                  var _div = $($(div).clone());
                  _div.find("[name='files']").val(data["files"]);
                  $(".files").append(_div);
              }else{
                  $(".files").css("display","none");
                  $(".files").prev().css("margin-bottom","20px");
              }
          }
      </script>

    </div>
  </div>
</div>