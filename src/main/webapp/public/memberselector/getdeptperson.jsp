<%@page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@page import="eiis.membership.*" %>
<%@page import="eiis.util.UUIDUtils" %>
<%@page import="eiis.util.jquery.DynatreeChildren" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="java.util.*" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<%!
    private Map<String, String> getAttrs(String attr) {
        if (!StringUtils.isEmpty(attr)) {
            Map<String, String> attrs = new HashMap<String, String>();
            for (String item : attr.split(";")) {
                if (!StringUtils.isEmpty(item)) {
                    String[] tmp = item.split("=");
                    attrs.put(tmp[0], tmp[1]);
                }
            }
            return attrs;
        }
        return null;
    }
    private List<Post> getPostByAttrs(Dept dept, Map<String, String> attrs) {
        List<Post> list = new ArrayList<Post>();
        if (attrs == null || attrs.isEmpty()) {
            for (Post p : dept.getChildPosts()) {
                list.add(p);
            }
        } else {
            for (Post p : dept.getChildPosts()) {
                for (Map.Entry<String, String> entry : attrs.entrySet()) {
                    String[] values = p.getAttributeValue(entry.getKey());
                    for (String value : values) {
                        if (value.equals(entry.getValue())) {
                            list.add(p);
                        }
                    }
                }
            }
        }
        return list;
    }

    private List<Person> getPersonByAttrs(Dept dept, Map<String, String> attrs) {
        List<Person> list = new ArrayList<Person>();
        if (attrs == null || attrs.isEmpty()) {
            for (Person p : dept.getChildPersons()) {
                list.add(p);
            }
        } else {
            for (Person p : dept.getChildPersons()) {
                for (Map.Entry<String, String> entry : attrs.entrySet()) {
                    String[] values = p.getAttributeValue(entry.getKey());
                    for (String value : values) {
                        if (value.equals(entry.getValue())) {
                            list.add(p);
                        }
                    }
                }
            }
        }
        return list;
    }

    private List<Person> getPersonByAttrs(Post post, Map<String, String> attrs) {
        List<Person> list = new ArrayList<Person>();
        if (attrs == null || attrs.isEmpty()) {
            for (Person p : post.getPersons()) {
                list.add(p);
            }
        } else {
            for (Person p : post.getPersons()) {
                for (Map.Entry<String, String> entry : attrs.entrySet()) {
                    String[] values = p.getAttributeValue(entry.getKey());
                    for (String value : values) {
                        if (value.equals(entry.getValue())) {
                            list.add(p);
                        }
                    }
                }
            }
        }
        return list;
    }

    private List<Dept> getDetpByAttrs(Dept dept, Map<String, String> attrs) {
        List<Dept> list = new ArrayList<Dept>();
        if (attrs == null || attrs.isEmpty()) {
            for (Dept d : dept.getChildDepts()) {
                list.add(d);
            }
        } else {
            for (Dept d : dept.getChildDepts()) {
                for (Map.Entry<String, String> entry : attrs.entrySet()) {
                    String[] values = d.getAttributeValue(entry.getKey());
                    for (String value : values) {
                        if (value.equals(entry.getValue())) {
                            list.add(d);
                        }
                    }
                }
            }
        }
        return list;
    }

    private Collection<DynatreeChildren> getSubNodes(Member m, Map<String, String> attrs, boolean dept, boolean post, boolean person, boolean freeze) {
        Collection<DynatreeChildren> nodes = new ArrayList<DynatreeChildren>();
        if (MemberType.Dept.equals(m.getType())) {
            for (Dept d : getDetpByAttrs((Dept) m, attrs)) {
                if (!freeze) {
                    if (d.isFrozen()) continue;
                }
                DynatreeChildren node = createNode(d, dept, post, person, freeze, true);
                node.setIsLazy(true);
                nodes.add(node);
            }
            /*for (Person p : getPersonByAttrs((Dept) m, attrs)) {
                if (!freeze) {
                    if (p.isFrozen()) continue;
                }
                DynatreeChildren node = createNode(p, dept, post, person, freeze, true);
                nodes.add(node);
            }*/
            for (Post p : getPostByAttrs((Dept) m, attrs)) {
                if (!freeze) {
                    if (p.isFrozen()) continue;
                }
                DynatreeChildren node = createNode(p, dept, post, person, freeze, true);
                nodes.add(node);
            }

        }
        if (MemberType.Post.equals(m.getType())) {
            for (Person p : getPersonByAttrs((Post) m, attrs)) {
                if (!freeze) {
                    if (p.isFrozen()) continue;
                }
                DynatreeChildren node = createNode(p, dept, post, person, freeze, true);
                nodes.add(node);
            }
        }
        return nodes;
    }

    private DynatreeChildren createNode(Member m, boolean dept, boolean post, boolean person, boolean freeze, boolean root) {
        DynatreeChildren node = new DynatreeChildren();
        node.setTitle(m.getName());
        node.setKey(m.getId().toString());
        if (MemberType.Person.equals(m.getType())) {
            node.setIsFolder(false);
            node.setExpand(false);
            node.setIcon("/theme/current/icons/person.png");
            if (!person) node.setUnselectable(true);
        }
        if (MemberType.Post.equals(m.getType())) {
            node.setIsFolder(true);
            node.setIcon("/theme/current/icons/post.png");
            if (!post) node.setUnselectable(true);
        }
        if (MemberType.Dept.equals(m.getType())) {
            node.setIsFolder(true);
            node.setIcon("/theme/current/icons/dept.png");
            if (!dept) node.setUnselectable(true);
        }
        if (!root) node.setUnselectable(true);
        if (freeze) {
            if (m.isFrozen()) node.setAddClass("ui-state-disabled");
        }
        return node;
    }

    private String toJson(Object obj) {
        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.writeValue(sw, obj);
        } catch (Exception e) {
        }
        String json = sw.toString();
        return json;
    }
%>

<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("json");

    String isDept = request.getParameter("dept");
    String isPost = request.getParameter("post");
    String isPerson = request.getParameter("person");
    String selectRoot = request.getParameter("selectRoot");
    String attr = request.getParameter("attr");
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
    boolean tmpSelectRoot = false;
    if (selectRoot != null && (selectRoot.equalsIgnoreCase("true") || selectRoot.equalsIgnoreCase("1") || selectRoot.equalsIgnoreCase("yes")))
        tmpSelectRoot = true;

    ArrayList<DynatreeChildren> list = new ArrayList<DynatreeChildren>();

    String boundid = request.getParameter("root");
    String key = request.getParameter("Key");
    Map<String, String> attrs = getAttrs(attr);
    if (!StringUtils.isBlank(key)) {
        Member parent = Member.get(UUIDUtils.parse(key));
        Collection<DynatreeChildren> nodes = getSubNodes(parent, attrs, tmpDept, tmpPost, tmpPerson, tmpFreeze);
        list.addAll(nodes);
    } else {
        if (StringUtils.isBlank(boundid)) {
            Member parent = Dept.getTopDept();
            DynatreeChildren root = createNode(parent, tmpDept, tmpPost, tmpPerson, tmpFreeze, tmpSelectRoot);
            root.setExpand(true);
            Collection<DynatreeChildren> nodes = getSubNodes(parent, attrs, tmpDept, tmpPost, tmpPerson, tmpFreeze);
            root.setChildren(nodes);
            list.add(root);
        } else {
            for (String id : boundid.split(";")) {
                if (!StringUtils.isBlank(id)) {
                    Member parent = Member.get(UUIDUtils.parse(id));
                    if (!tmpFreeze) {
                        if (parent.isFrozen()) continue;
                    }
                    DynatreeChildren root = createNode(parent, tmpDept, tmpPost, tmpPerson, tmpFreeze, tmpSelectRoot);
                    root.setExpand(true);
                    Collection<DynatreeChildren> nodes = getSubNodes(parent, attrs, tmpDept, tmpPost, tmpPerson, tmpFreeze);
                    root.setChildren(nodes);
                    list.add(root);
                }
            }
        }

    }

    JsonUtils.write(response.getOutputStream(), list);

%>