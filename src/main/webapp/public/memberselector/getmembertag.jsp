<%@page import="eiis.membership.Helper" %>
<%@page import="eiis.membership.Member" %>
<%@page import="eiis.membership.MemberType" %>
<%@page import="eiis.membership.Person" %>
<%@page import="eiis.util.UUIDUtils" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="eiis.util.webui.InputTag" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.UUID" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%!
    private boolean allowAdd(Member m, boolean tmpDept, boolean tmpPost, boolean tmpPerson) {
        boolean addFlag = false;
        if (MemberType.Dept.equals(m.getType()) && tmpDept) {
            addFlag = true;
        }
        if (MemberType.Post.equals(m.getType()) && tmpPost) {
            addFlag = true;
        }
        if (MemberType.Person.equals(m.getType()) && tmpPerson) {
            addFlag = true;
        }
        return addFlag;
    }
%>

<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("json");

    String ids = request.getParameter("ids");
    String find = request.getParameter("find");
    String isDept = request.getParameter("dept");
    String isPost = request.getParameter("post");
    String isPerson = request.getParameter("person");
    String arrt = request.getParameter("attr");
    String root = request.getParameter("root");
    String freeze = request.getParameter("freeze");

    boolean tmpDept = false;
    if (isDept != null && (isDept.equalsIgnoreCase("true") || isDept.equalsIgnoreCase("1") || isDept.equalsIgnoreCase("yes")))
        tmpDept = true;
    boolean tmpPost = false;
    if (isPost != null && (isPost.equalsIgnoreCase("true") || isPost.equalsIgnoreCase("1") || isPost.equalsIgnoreCase("yes")))
        tmpPost = true;
    boolean tmpPerson = false;
    if (isPerson != null && (isPerson.equalsIgnoreCase("true") || isPerson.equalsIgnoreCase("1") || isPerson.equalsIgnoreCase("yes")))
        tmpPerson = true;
    boolean tmpFreeze = false;
    if (freeze != null && (freeze.equalsIgnoreCase("true") || freeze.equalsIgnoreCase("1") || freeze.equalsIgnoreCase("yes")))
        tmpFreeze = true;
    //boolean tmpSelectRoot = false;
    //if(isSelectRoot.equalsIgnoreCase("true") || isSelectRoot.equalsIgnoreCase("1") || isSelectRoot.equalsIgnoreCase("yes")) tmpSelectRoot = true;

    List<InputTag> tagsTemp = new ArrayList<InputTag>();
    if (!StringUtils.isBlank(ids) && StringUtils.isBlank(find)) {
        List<UUID> list = new ArrayList<UUID>();
        for (String id : ids.split(";")) {
            if (!StringUtils.isBlank(id)) {
                list.add(UUIDUtils.parse(id));
            }
        }
        List<InputTag> tags = new ArrayList<InputTag>();
        for (Member m : Member.get(list.toArray(new UUID[1]))) {
            //System.out.println(m.getName() + "..............");
            if (tmpFreeze) {//显示冻结
                boolean addFlag = false;
                if (MemberType.Dept.equals(m.getType()) && tmpDept) {
                    addFlag = true;
                }
                if (MemberType.Post.equals(m.getType()) && tmpPost) {
                    addFlag = true;
                }
                if (MemberType.Person.equals(m.getType()) && tmpPerson) {
                    addFlag = true;
                }
                if (addFlag) {
                    InputTag tag = new InputTag();
                    tag.setLabel(m.getName());
                    tag.setValue(m.getId().toString());
                    tag.setDesc(m.getName());
                    tags.add(tag);
                }
            } else {//不显示冻结
                if (m.isFrozen()) continue; //如果冻结不处理
                boolean addFlag = false;
                if (MemberType.Dept.equals(m.getType()) && tmpDept) {
                    addFlag = true;
                }
                if (MemberType.Post.equals(m.getType()) && tmpPost) {
                    addFlag = true;
                }
                if (MemberType.Person.equals(m.getType()) && tmpPerson) {
                    addFlag = true;
                }
                if (addFlag) {
                    InputTag tag = new InputTag();
                    tag.setLabel(m.getName());
                    tag.setValue(m.getId().toString());
                    tag.setDesc(m.getName());
                    tags.add(tag);
                }
            }
        }
        tagsTemp = tags;
    }

    if (!StringUtils.isBlank(find)) {
        Member[] memberByName = null;
        try {
            Member _m = Person.get(find);
            memberByName = new Member[1];
            memberByName[0] = _m;
        } catch (Exception e) {
            memberByName = Helper.findByName(find);
        }
        List<InputTag> tags = new ArrayList<InputTag>();
        for (Member m : memberByName) {
            //if(m.isFrozen()) continue;
            if (tmpFreeze) {
                boolean addFlag = false;
                if (MemberType.Dept.equals(m.getType()) && tmpDept) {
                    addFlag = true;
                }
                if (MemberType.Post.equals(m.getType()) && tmpPost) {
                    addFlag = true;
                }
                if (MemberType.Person.equals(m.getType()) && tmpPerson) {
                    addFlag = true;
                }
                if (addFlag) {
                    InputTag tag = new InputTag();
                    tag.setLabel(m.getName());
                    tag.setValue(m.getId().toString());
                    tag.setDesc(m.getName());
                    tags.add(tag);
                }
            } else {
                if (m.isFrozen()) continue;
                boolean addFlag = false;
                if (MemberType.Dept.equals(m.getType()) && tmpDept) {
                    addFlag = true;
                }
                if (MemberType.Post.equals(m.getType()) && tmpPost) {
                    addFlag = true;
                }
                if (MemberType.Person.equals(m.getType()) && tmpPerson) {
                    addFlag = true;
                }
                if (addFlag) {
                    InputTag tag = new InputTag();
                    tag.setLabel(m.getName());
                    tag.setValue(m.getId().toString());
                    tag.setDesc(m.getName());
                    tags.add(tag);
                }
            }

        }
        tagsTemp = tags;
    }

    JsonUtils.write(response.getOutputStream(), tagsTemp);

%>