<%@ page import="eiis.app.projectinfo.service.PlugInService" %>
<%@ page import="eiis.util.mvc.jsp.BaseHandler" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.List" %>
<%@ page import="java.math.BigDecimal" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.app.projectinfo.service.ProjectInfoService" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Arrays" %>
<%--
  Created by IntelliJ IDEA.
  User: 杨锐
  Date: 2015/4/1
  Time: 11:15
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    PlugInService plugInService = PlugInService.getInstance();
    class Action extends BaseHandler {
        // 报文 ids = id,id2,id3
        // 返回 {"name":["a项目","b项目","c项目","d项目"],"value":[12.0,3.2,7.8,5.0]}
        public String projectSumJob()throws  Exception{
            String ids = request.getParameter("ids");
            String str1 = "";
            String str2 = "";
            String str3 = "";
            List<String> projectIds=new ArrayList<String>();
            if(StringUtils.isNotBlank(ids)){
                projectIds= Arrays.asList(ids.split(","));
            }else {
                List<Map<String, Object>> list = ProjectInfoService.getInstance().getProjectList();
                if (list.size() > 0) {
                    for (Map<String, Object> m : list) {
                        projectIds.add(m.get("projectId").toString());
                    }
                }
            }
            List<Object[]> list = plugInService.projectSumJob(projectIds);
            if(list.size()>0) {
                for (Object[] item : list) {
                    String it = item[1].toString();
                    for (int i = 0; i < it.length(); i++) {
                        if (i % 4 == 0) {
                            it = it.substring(0, i) + "\\n" + it.substring(i, it.length());
                        }
                    }
                    it = it.substring(2, it.length());
                    if (str1.equals("")) {
                        str1 += "\"" + it + "\"";
                        str3 += "\"" + item[0] + "\"";
                    } else {
                        str1 += ",\"" + it + "\"";
                        str3 += ",\"" + item[0] + "\"";
                    }

                    if (str2.equals("")) {
                        str2 += "\"" + (item[2] == null ? new BigDecimal("0") : new BigDecimal(item[2].toString())) + "\"";
                    } else {
                        str2 += ",\"" + (item[2] == null ? new BigDecimal("0") : new BigDecimal(item[2].toString())) + "\"";
                    }
                }//-- for - end --
            }
            return "{\"name\":["+str1+"],\"value\":["+str2+"],\"id\":["+str3+"]}";
        }
        public String plugProjectMoneyIn()throws  Exception{
            String ids = request.getParameter("ids");
            String str1 = "";
            String str2 = "";
            String str3 = "";
            List<String> projectIds=new ArrayList<String>();
            if(StringUtils.isNotEmpty(ids)){
                projectIds= Arrays.asList(ids.split(","));
            }else {
                List<Map<String, Object>> list = ProjectInfoService.getInstance().getProjectList();
                for(Map<String,Object> m:list){
                    projectIds.add(m.get("projectId").toString());
                }
            }
            List<Object[]> list = plugInService.projectMoneyInSum(projectIds);
            if(list.size()>0) {
                for (Object[] item : list) {
                    String it = item[1].toString();
                    for (int i = 0; i < it.length(); i++) {
                        if (i % 4 == 0) {
                            it = it.substring(0, i) + "\\n" + it.substring(i, it.length());
                        }
                    }
                    it = it.substring(2, it.length());
                    if (str1.equals("")) {
                        str1 += "\"" + it + "\"";
                        str3 += "\"" + item[0] + "\"";
                    } else {
                        str1 += ",\"" + it + "\"";
                        str3 += ",\"" + item[0] + "\"";
                    }

                    if (str2.equals("")) {
                        str2 += "\"" + (item[2] == null ? new BigDecimal("0") : new BigDecimal(item[2].toString())) + "\"";
                    } else {
                        str2 += ",\"" + (item[2] == null ? new BigDecimal("0") : new BigDecimal(item[2].toString())) + "\"";
                    }
                }//-- for - end --
            }
            return "{\"name\":["+str1+"],\"value\":["+str2+"],\"id\":["+str3+"]}";
        }
        // 报文 ids = id,id2,id3
        // 返回 {"name":["a项目","b项目","c项目","d项目"],"value":[12.0,3.2,7.8,5.0]}
        public String plugProjectMoneyPay()throws  Exception{
            String ids = request.getParameter("ids");
            String str1 = "";
            String str2 = "";
            String str3 = "";
            List<String> projectIds=new ArrayList<String>();
            if(StringUtils.isNotEmpty(ids)){
                projectIds= Arrays.asList(ids.split(","));
            }else {
                List<Map<String, Object>> list = ProjectInfoService.getInstance().getProjectList();
                for(Map<String,Object> m:list){
                    projectIds.add(m.get("projectId").toString());
                }
            }
            List<Object[]> list = plugInService.projectMoneyPaySum(projectIds);
            BigDecimal theTotal = new BigDecimal("0");
            BigDecimal tempTotal = new BigDecimal("0");
            if(list.size()>0){
                for (Object[] item : list){
                    String it = item[1].toString();
                    for(int i=0;i<it.length();i++){
                        if(i%4==0){
                            it = it.substring(0,i)+"\\n"+it.substring(i,it.length());
                        }
                    }
                    it = it.substring(2,it.length());
                    if (str1.equals("")){
                        str1 += "\""+it+"\"";
                        str3 += "\""+item[0]+"\"";
                    }else {
                        str1 += ",\""+it+"\"";
                        str3 += ",\""+item[0]+"\"";
                    }
                    if (str2.equals("")){
                        tempTotal = item[2]==null?new BigDecimal("0"):new BigDecimal(item[2].toString());
                        theTotal = tempTotal;
                        tempTotal = item[3]==null?new BigDecimal("0"):new BigDecimal(item[3].toString());
                        theTotal = theTotal.add(tempTotal);
                        str2 += "\""+theTotal+"\"";
                    }else {
                        tempTotal = item[2]==null?new BigDecimal("0"):new BigDecimal(item[2].toString());
                        theTotal = tempTotal;
                        tempTotal = item[3]==null?new BigDecimal("0"):new BigDecimal(item[3].toString());
                        theTotal = theTotal.add(tempTotal);
                        str2 += ",\""+theTotal+"\"";
                    }
                }//-- for - end --
            }
            return "{\"name\":["+str1+"],\"value\":["+str2+"],\"id\":["+str3+"]}";
        }
    }
%>
<%
    new Action().action(request, response);
%>