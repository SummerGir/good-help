<%@ page import="eiis.membership.AttributeDefinition" %>
<%@ page import="eiis.membership.Helper" %>
<%@ page import="eiis.membership.Member" %>
<%@ page import="eiis.membership.MemberType" %>
<%@ page import="eiis.util.jquery.DynatreeChildren" %>
<%@ page import="eiis.util.jquery.DynatreeChildrenComparator" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Collection" %>
<%@ page import="java.util.Collections" %>
<%@ page import="java.util.List" %>
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 13-4-23
  Time: 下午3:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("json");

    String isDept = request.getParameter("dept");
    String isPost = request.getParameter("post");
    String isPerson = request.getParameter("person");
    String isAttr = request.getParameter("attr");
    //String isAttrChild = request.getParameter("attrChild");
    String selectRoot = request.getParameter("selectRoot");
    String freeze = request.getParameter("freeze");

    String attrCode = request.getParameter("attrCode");
    String attrValue = request.getParameter("attrValue");

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
    boolean tmpAttr = false;
    if (isAttr != null && (isAttr.equalsIgnoreCase("true") || isAttr.equalsIgnoreCase("1") || isAttr.equalsIgnoreCase("yes")))
        tmpAttr = true;
    //boolean tmpAttrChild = false;
    //if(isAttrChild != null && (isAttrChild.equalsIgnoreCase("true") || isAttrChild.equalsIgnoreCase("1") || isAttrChild.equalsIgnoreCase("yes"))) tmpAttrChild = true;
    boolean tmpSelectRoot = false;
    if (selectRoot != null && (selectRoot.equalsIgnoreCase("true") || selectRoot.equalsIgnoreCase("1") || selectRoot.equalsIgnoreCase("yes")))
        tmpSelectRoot = true;

    Collection<DynatreeChildren> nodes = new ArrayList<DynatreeChildren>();
    if (!StringUtils.isBlank(attrCode) && !StringUtils.isBlank(attrValue)) {//显示拥有指定属性值的成员
        AttributeDefinition a = AttributeDefinition.get(attrCode);
        DynatreeChildren node = new DynatreeChildren();
        node.setKey(a.getCode());
        node.setTitle(a.getTitle());
        node.setIsFolder(true);
        node.setUnselectable(true);
        node.setExpand(true);
        //if(!tmpSelectRoot) node.setUnselectable(true);

        List<DynatreeChildren> childrens = new ArrayList<DynatreeChildren>();
        Member[] members = Helper.findAttributeValue(attrCode, attrValue);
        for (Member m : members) {
            if (!tmpFreeze && m.isFrozen()) continue;
            DynatreeChildren sub = new DynatreeChildren();
            sub.setKey(m.getId().toString());
            sub.setTitle(m.getName());
            childrens.add(sub);
        }
        Collections.sort(childrens, new DynatreeChildrenComparator());
        node.setChildren(childrens);
        nodes.add(node);
    } else {
        if (tmpAttr) {//显示属性列表
            Collection<MemberType> types = new ArrayList<MemberType>();
            if (tmpDept) types.add(MemberType.Dept);
            if (tmpPost) types.add(MemberType.Post);
            if (tmpPerson) types.add(MemberType.Person);
            if (tmpDept && tmpPost && tmpPerson) types.add(MemberType.Member);
            AttributeDefinition[] attrs = AttributeDefinition.getAll(types.toArray(new MemberType[0]));
            for (AttributeDefinition a : attrs) {
                DynatreeChildren node = new DynatreeChildren();
                node.setKey(a.getCode());
                node.setTitle(a.getTitle());
                //if(!tmpSelectRoot) node.setUnselectable(true);

                nodes.add(node);
            }
        }
    }
    JsonUtils.write(response.getOutputStream(), nodes);
%>