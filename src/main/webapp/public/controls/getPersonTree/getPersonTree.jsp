<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="eiis.membership.*" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.UUID" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Dept root = Dept.getTopDept();
    String rootId = request.getParameter("root");
    if(StringUtils.isNotBlank(rootId) && rootId.length()==36){
        root = Dept.get(UUID.fromString(rootId));
    }

    List<JSONObject> list =new ArrayList<JSONObject>();
    for (Dept d1 :root.getDescendantDepts()){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id",d1.getId().toString());
        jsonObject.put("title",d1.getName());
        jsonObject.put("pid", d1.getParentDept().getId().toString());
        jsonObject.put("type", 1);
        list.add(jsonObject);
    }
    for(Post p1 : root.getDescendantPosts()){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id",p1.getId().toString());
        jsonObject.put("title",p1.getName());
        jsonObject.put("pid", p1.getDept().getId().toString());
        jsonObject.put("type", 2);
        list.add(jsonObject);
    }
    for(Person person : root.getDescendantPersons()){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", person.getId().toString());
        jsonObject.put("title",person.getName());
        jsonObject.put("type", 4);

        String pid ="";
        String post_name ="";
        String dept_path ="";
        for(Post post : person.getPosts()){
            pid += "," +post.getId().toString();
            post_name +="," +  post.getName();

            Member[] depts = eiis.membership.Helper.getAncestorsDepts(person.getId());
            String dNames ="";
            for(Member dept : depts){
                dNames +=">"+dept.getName();
            }
            dept_path += ","+dNames.substring(1);
        }
        jsonObject.put("pid",pid.substring(1));
        jsonObject.put("post",post_name.substring(1));
        jsonObject.put("dept",dept_path.substring(1));

        list.add(jsonObject);
    }

    JSONObject jsonObject = new JSONObject();
    jsonObject.put("id",root.getId().toString());
    jsonObject.put("title",root.getName());
    jsonObject.put("pid", "0");
    jsonObject.put("type",1);
    list.add(jsonObject);

    String k = JSONArray.fromObject(list).toString();
    out.clear();
    out.print(k);
%>