<%@ page import="eiis.util.mvc.jsp.BaseHandler" %>
<%@ page import="eiis.app.schedule.service.AppScheduleInfoService" %>
<%@ page import="eiis.app.schedule.entiry.AppScheduleInfoEntity" %>
<%@ page import="java.util.List" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="org.apache.james.mime4j.dom.datetime.DateTime" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%!
    public class Action extends BaseHandler {
        AppScheduleInfoService appProjectMoneyService = AppScheduleInfoService.getInstance();

        public int getCounts() throws Exception{
            String memberId = Context.getCurrent().getName();
            String beginTime = new SimpleDateFormat("yyyy-MM-dd hh:mm;ss").format(new Date());
            List<AppScheduleInfoEntity>  list= appProjectMoneyService.findCounts(memberId,beginTime);
            return list.size();
        }
    }
%>

<%
    new Action().action(request, response);
%>
