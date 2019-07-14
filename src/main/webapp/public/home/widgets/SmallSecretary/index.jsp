<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="eiis.context.Context"%>
<%@ page import="java.util.Date" %>
<%@ page import="eiis.context.CurrentApplicationTemplate" %>
<%@ page import="eiis.util.jquery.AppTreeNode" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="eiis.app.schedule.service.AppScheduleInfoService" %>
<%@ page import="eiis.app.schedule.entiry.AppScheduleInfoEntity" %>
<%@ page import="java.util.List" %>

<%
  String memberId = Context.getCurrent().getId().toString();
  String beginTime = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
  AppScheduleInfoService appProjectMoneyService = AppScheduleInfoService.getInstance();
  int list= appProjectMoneyService.findCounts(memberId,beginTime);

  AppTreeNode appTreeNode;
  appTreeNode = CurrentApplicationTemplate.getAppTreeNodeByCode("mail");
  String content_url = null;
  if(appTreeNode != null){
    content_url = appTreeNode.getHref();
  }

  AppTreeNode appTreeNode1;
  appTreeNode1 = CurrentApplicationTemplate.getAppTreeNodeByCode("FLOW_TASK_TODO_LIST");
  String content_url1 =null;
  if(appTreeNode1 != null) {
   content_url1 = appTreeNode1.getHref();
  }

  AppTreeNode appTreeNode2;
  appTreeNode2 = CurrentApplicationTemplate.getAppTreeNodeByCode("个人日程管理");
  String content_url2 =null;
  if(appTreeNode2 != null) {
    content_url2 = appTreeNode2.getHref();
  }
  SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日");
  int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
  String hourStr = "";
  if(hour<5){
    hourStr = "凌晨好！";
  }else if(hour<8){
    hourStr = "早上好！";
  }else if(hour<11){
    hourStr = "上午好！";
  }else if(hour<13){
    hourStr = "中午好！";
  }else if(hour<17){
    hourStr = "下午好！";
  }else if(hour<19){
    hourStr = "晚上好！";
  }else if(hour<20){
    hourStr = "半夜好！";
  }else if(hour<24){
    hourStr = "深夜好！";
  }
%>

<div class="panel panel-default bg-navy">
  <div class="panel-heading bg-navy">
    <div class="pull-left" style="font-size: 14px;">
      <i class="widget-icon-i "></i>
      &nbsp;&nbsp;小助手
    </div>
    <div class="widget-icons pull-right">
      <a class="wminimize" href="#">
        <i class="fa fa-chevron-up"></i>
      </a>
    </div>
    <div class="clearfix"></div>
  </div>
  <div class="list-group">
    <div style="height: 40px;width: 100%;background-color:#ffffff;">
      <div style="font-weight: 900;font-size: 18px;color: #0993d3;text-indent: 2em;height: 25px;line-height: 25px;float: left;line-height: 40px;">
        <%=Context.getCurrent().getName()%>&nbsp;&nbsp;<%=hourStr%></div>
      <div style="color: #0993d3;text-indent: 5px;float: right;margin-right: 10px;" id="home_widget_date"><%=sdf.format(new Date())%></div>
    </div>
    <%if(content_url2!=null){%>
    <a title="我的日程" class="list-group-item" href="<%=content_url2%>" id="home_widget_schedule">
      <span style="color: #0993d3;font-size: 14px;">我的日程：今日有 <i id="home_widget_scheduleCount"  style="color: red;font-weight: 800;font-size: 16px;"><%=list %></i> 条日程等待您查阅！</span>
    </a>
    <%}%>
    <%if(content_url1!=null){%>
      <a title="我的流程" class="list-group-item" href="<%=content_url1%>" id="home_widget_flowTask">
        <span style="color: #0993d3;font-size: 14px;">我的流程：共有 <i id="home_widget_flowTaskCount"  style="color: red;font-weight: 800;font-size: 16px;"></i> 个流程等待您审批！</span>
      </a>
    <%}%>
    <%if(content_url!=null){%>
      <a title="我的邮件" class="list-group-item" href="<%=content_url%>" id="home_widget_mail">
        <span style="color: #0993d3;font-size: 14px;">我的邮件：共有 <i id="home_widget_mailCount" style="color: red;font-weight: 800;font-size: 16px;"></i> 条邮件等待您回复！</span>
      </a>
    <%}%>
  </div>
</div>
<script type="text/javascript">
  $(document).ready(function(){
    var scheduleCount = $("#home_widget_scheduleCount").text();
    if(scheduleCount==0 || "0".equals(scheduleCount)){
      $("#home_widget_scheduleCount").css('color','#0993d3');
    }
  });
</script>