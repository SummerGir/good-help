<%@ page import="eiis.app.im.util.ImAppInfo" %>
<%@ page import="eiis.membership.Person" %>
<%@ page import="eiis.context.Context" %>
<%@ page import="eiis.app.im.service.AppImService" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="eiis.membership.Dept" %>
<%
    out.clear();
    String account = request.getParameter("account");
    Person person = Person.get(account);
    JSONObject jsonObject = new JSONObject();
    String fl_acct = person.getAccount()+"@"+ Dept.getTopDept().getAttributeSingleValue("server_code");
    jsonObject.put("sdkAppID" , ImAppInfo.getAppId().toString());
    jsonObject.put("accountType", ImAppInfo.getAccountType());
    jsonObject.put("identifier", fl_acct);
    jsonObject.put("identifierNick", person.getName());
    jsonObject.put("userSig", AppImService.getInstance().getSig(fl_acct));
    out.print("esg("+jsonObject.toString()+")");
%>