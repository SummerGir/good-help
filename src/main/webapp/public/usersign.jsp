<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.StaticFileHandler" %>
<%@ page import="eiis.membership.Person" %>
<%@ page import="eiis.util.UUIDUtils" %>
<%@ page import="eiis.util.sign.UserSign" %>
<%@ page import="java.util.UUID" %>

<%
    out.clear();
    out = pageContext.pushBody();

    UUID memId = UUIDUtils.empty;
    try {
        memId = UUIDUtils.parse(request.getParameter("memid"));
    } catch (Exception ex) {

    }
    Person currPerson = null;
    try {
        currPerson = (Person) eiis.membership.Member.get(memId);
    } catch (Exception ex) {
    }
    if (currPerson != null) {
        UserSign sign=new UserSign();

        Attachment currSignAttach = sign.createSign(currPerson);

        StaticFileHandler.processRequestInternal(request, response, currSignAttach.getRelativePath(), currSignAttach.getRealPath());

    }
%>