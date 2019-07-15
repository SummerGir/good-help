<%@ page import="com.google.common.base.Predicate" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page import="com.google.common.collect.Collections2" %>
<%@ page import="com.google.common.collect.Sets" %>
<%@ page import="eiis.membership.*" %>
<%@ page import="eiis.sys.contact.PlatContactFactory" %>
<%@ page import="eiis.sys.contact.entity.PlatContactDetailsEntity" %>
<%@ page import="eiis.sys.contact.entity.PlatContactEntity" %>
<%@ page import="eiis.sys.contact.service.IPlatContactService" %>
<%@ page import="eiis.util.UUIDUtils" %>
<%@ page import="eiis.util.jquery.TreeNodeData" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="org.jdom2.Content" %>
<%@ page import="org.jdom2.Element" %>
<%@ page import="java.util.*" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    private static final Dept topDept = eiis.membership.Dept.getTopDept();
    private static Element _memberXml = null;
    private static Collection<UUID> _memberIds = null;

    private static void updateMemberXml() {
        _memberXml = eiis.membership.Helper.toXml(topDept.getId(), false, false);
        _memberIds = null;
    }

    private static Element getMemberXml() {
        if (_memberXml == null) {
            updateMemberXml();
            eiis.membership.Helper.addMembershipListener(new MembershipListener() {
                @Override
                public void removeMember(Element beforeXml) {
                    updateMemberXml();
                }

                @Override
                public void addMember(Member afterMember) {
                    updateMemberXml();
                }

                @Override
                public void changeMemberInfo(Element beforeXml, Member afterMember) {
                    updateMemberXml();
                }

                @Override
                public void frozenMember(boolean beforeFrozen, Member afterMember) {
                    updateMemberXml();
                }

                @Override
                public void moveMember(Element beforeXml, Member afterMember) {
                    updateMemberXml();
                }

                @Override
                public void changeMemberOrder(int beforeOrder, int afterOrder, Member destMember, Member forMember) {
                    updateMemberXml();
                }
            });
        }
        return _memberXml;
    }

    private static Collection<UUID> getMemberIds() {
        if (_memberIds == null) {
            Collection<UUID> tmpUUIDs = Sets.newLinkedHashSet();
            tmpUUIDs.add(topDept.getId());

            for (Content content : getMemberXml().getDescendants()) {
                if (content instanceof Element) {
                    Element element = (Element) content;
                    if (element.getName().equals("person")) {
                        if (!element.getAttributeValue("postInPersonOrder").equals("1")) {
                            continue;
                        }
                    } else if (element.getName().equals("post")) {
                        if (element.getParentElement().getName().equals("person")) {
                            continue;
                        }
                    }
                    try {
                        tmpUUIDs.add(UUIDUtils.parse(element.getAttributeValue("id")));
                    } catch (Exception e) {
                    }
                }
            }
            _memberIds = tmpUUIDs;
        }
        return _memberIds;
    }

    private static Collection<UUID> formatMemberOrder(final Collection<UUID> memberIds) {
        return Collections2.filter(getMemberIds(), new Predicate<UUID>() {
            @Override
            public boolean apply(UUID uuid) {
                return memberIds.contains(uuid);
            }
        });
    }

    class SelectorParams {
        public boolean DEPT = true;
        public boolean POST = true;
        public boolean PERSON = true;
        public boolean FREEZE = false;
        public boolean ROOT_SELECTED = true;
        public boolean MULTIPLE = true;
        public String ATTR_CODE = "";
        public String ATTR_VALUE = "";
        public String TREE_TYPE = "person";
        public String[] ROOTS = new String[0];
        public String nodeId = "";
        public boolean attrTypeIsMember = false;
        //排除（exclude中包含的成员不允许选择）
        public String exclude = "";
        //如果通过扩展属性（ATTR_CODE、ATTR_VALUE）无法获取查询结果，当notResultIsShowAll为true时显示所有成员，为false时不显示任何成员
        public boolean notResultIsShowAll = true;

        public SelectorParams(HttpServletRequest request) {
            String isDept = request.getParameter("dept");
            String isPost = request.getParameter("post");
            String isPerson = request.getParameter("person");
            String roots = request.getParameter("roots");
            String freeze = request.getParameter("freeze");
            String selectRoot = request.getParameter("selectRoot");
            String attr = request.getParameter("attrCode");
            String attrValue = request.getParameter("attrValue");
            String multiple = request.getParameter("multiple");
            String nodeId = request.getParameter("nodeId");
            String exclude = request.getParameter("exclude");

//            String type = request.getParameter("type");

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
            boolean tmpMultiple = false;
            if (multiple != null && (multiple.equalsIgnoreCase("true") || multiple.equalsIgnoreCase("1") || multiple.equalsIgnoreCase("yes")))
                tmpMultiple = true;

            this.DEPT = tmpDept;
            this.POST = tmpPost;
            this.PERSON = tmpPerson;
            this.FREEZE = tmpFreeze;
            this.ROOT_SELECTED = tmpSelectRoot;
            this.ATTR_CODE = attr;
            this.ATTR_VALUE = attrValue;
            this.MULTIPLE = tmpMultiple;
            this.nodeId = nodeId;
            this.exclude = exclude;
//            if(StringUtils.isNotBlank(type)) this.TREE_TYPE = type;
            if (!Strings.isNullOrEmpty(roots)) {
                this.ROOTS = StringUtils.split(roots, ";");
            }
        }
    }

    /**
     * 加载子集成员
     * @param parent
     * @param current
     * @param params
     * @param isRoot
     * @param nodes
     */
    private void recursionNode(TreeNodeData parent, Member current, SelectorParams params, boolean isRoot, List<TreeNodeData> nodes, Collection<UUID> attrMember) {

        List<TreeNodeData> childrens = new ArrayList<TreeNodeData>();
        if (MemberType.Dept.equals(current.getType())) {//是部门
            Dept[] depts = ((Dept) current).getChildDepts();//加子部门
            if (depts.length > 0) {
                for (Dept dept : depts) {
                    if (attrMember.size() > 0 && !attrMember.contains(dept.getId())) {
                        continue;
                    }
                    TreeNodeData node = createNode(dept, params, attrMember);
                    if (node != null) {
                        node.setFolder(true);
                        childrens.add(node);
                    }
                }
            }
            if (params.POST || params.PERSON) {
                Post[] posts = ((Dept) current).getChildPosts();//加子岗位
                if (posts.length > 0) {
                    for (Post post : posts) {
                        if (attrMember.size() > 0 && !attrMember.contains(post.getId())) {
                            continue;
                        }
                        TreeNodeData node = createNode(post, params, attrMember);
                        if (node != null) {
                            node.setFolder(true);
                            childrens.add(node);
                        }
                    }
                }
            } else {
                if (params.PERSON) {
                    Person[] persons = ((Dept) current).getChildPersons();//加子人员
                    if (persons.length > 0) {
                        for (Person person : persons) {
                            if (attrMember.size() > 0 && !attrMember.contains(person.getId())) {
                                continue;
                            }
                            TreeNodeData node = createNode(person, params, attrMember);
                            if (node != null) {
                                node.setFolder(true);
                                childrens.add(node);
                            }
                        }
                    }
                }
            }
            if (isRoot) {
                parent.setChildren(childrens);
                if (childrens.size() == 0) {
                    parent.setLazy(false);
                }
                nodes.add(parent);
            } else {
                nodes.addAll(childrens);
            }

        } else if (MemberType.Post.equals(current.getType())) {
            if(params.PERSON){
                Person[] persons = ((Post) current).getPersons();//加子人员
                if (persons.length > 0) {
                    for (Person person : persons) {
                        if (attrMember.size() > 0 && !attrMember.contains(person.getId())) {
                            continue;
                        }
                        TreeNodeData node = createNode(person, params, attrMember);
                        if (node != null) {
                            node.setFolder(true);
                            childrens.add(node);
                        }
                    }
                    if (isRoot) {
                        parent.setChildren(childrens);
                        if (childrens.size() == 0) {
                            parent.setLazy(false);
                        }
                        nodes.add(parent);
                    } else {
                        nodes.addAll(childrens);
                    }
                }
            }else if(params.POST && isRoot){
                nodes.add(parent);
            }
        } else if (MemberType.Person.equals(current.getType()) && params.PERSON) {
            Person person = (Person) current;
            if (attrMember.size() > 0 && !attrMember.contains(person.getId())) {
                return;
            }
            TreeNodeData node = createNode(current, params, attrMember);
            if (node != null) {
                node.setFolder(false);
                nodes.add(node);
            }
        }
    }

    /**
     * 创建节点并控制节点是否能被选择
     * @param m
     * @param params
     * @return
     */
    private TreeNodeData createNode(Member m, SelectorParams params, Collection<UUID> attrMember) {
        boolean isExclude = false;
        if(m==null){//项目部id在成员树中不存在
            return null;
        }
        if (!Strings.isNullOrEmpty(params.exclude) && params.exclude.indexOf(m.getId().toString()) != -1) {
            isExclude = true;
        }
        TreeNodeData node = new TreeNodeData();
        node.setTitle(m.getName());
//        node.setKey(m.getId().toString());
        node.setRefKey(m.getId().toString());
        if (MemberType.Person.equals(m.getType())) {
            node.setFolder(false);
            node.setExpanded(false);
            node.setIconclass("fa fa-user");
            if (!params.PERSON || attrMember.size() > 0 && !attrMember.contains(m.getId()) && !params.attrTypeIsMember || isExclude) {
                node.setUnselectable(true);
                node.setHideCheckbox(true);
            }
        }
        if (MemberType.Post.equals(m.getType())) {
            node.setFolder(false);
            node.setIconclass("fa fa-reddit-square");
//            node.setIcon("/public/controls/selector/member/icons/post.png");
            if (!params.POST || attrMember.size() > 0 && !attrMember.contains(m.getId()) && !params.attrTypeIsMember || isExclude) {
                node.setUnselectable(true);
                node.setHideCheckbox(true);
            }
            if (params.PERSON && ((Post) m).getPersons().length > 0) {
                node.setLazy(true);
            }
        }
        if (MemberType.Dept.equals(m.getType())) {
            node.setFolder(true);
            node.setIconclass("fa fa-users");
            if (!params.DEPT || attrMember.size() > 0 && !attrMember.contains(m.getId()) && !params.attrTypeIsMember || isExclude) {
                node.setUnselectable(true);
                node.setHideCheckbox(true);
            }
            if (((Dept) m).getChildDepts().length > 0 || (params.POST && ((Dept) m).getChildPosts().length > 0) || (params.PERSON && ((Dept) m).getChildPersons().length > 0)) {
                node.setLazy(true);
            }
        }
        //if(!params.ROOT_SELECTED) node.setUnselectable(true);
        if (params.FREEZE) {
            if (m.isFrozen()) node.setExtraClasses("ui-state-disabled");
        } else {
            if (m.isFrozen()) return null;
        }
        return node;
    }

    /**
     *获取所有子孙成员
     * @param roots
     * @return
     */
    private List<Member> getRootChild(String[] roots) {
        List<Member> memberList = new ArrayList<Member>();
        if (roots.length > 0) {
            if (StringUtils.join(roots).indexOf(Dept.getTopDept().getId().toString()) == -1) {
                for (String root : roots) {
                    Member rootMember = Member.get(UUID.fromString(root));
                    memberList.add(rootMember);
                    if (rootMember != null) {
                        if (rootMember.getType().equals(MemberType.Dept)) {
                            memberList.addAll(Arrays.asList(((Dept) rootMember).getDescendantDepts()));
                            memberList.addAll(Arrays.asList(((Dept) rootMember).getDescendantPosts()));
                            memberList.addAll(Arrays.asList(((Dept) rootMember).getDescendantPersons()));
                        } else if (rootMember.getType().equals(MemberType.Post)) {
                            memberList.addAll(Arrays.asList(((Post) rootMember).getPersons()));
                        } else if (rootMember.getType().equals(MemberType.Person)) {
                            memberList.add(rootMember);
                        }
                    }
                }
            } else {
                return null;
            }
        }
        return memberList;
    }
%>
<%
    response.setContentType("text/plain");

    String pageNum = request.getParameter("page");
    String find = request.getParameter("term");
    boolean isRoot = true;
    SelectorParams params = new SelectorParams(request);
    boolean isLazyAttr = false;

    List<TreeNodeData> nodes = new ArrayList<TreeNodeData>();
    Member topDept = null;
    Collection<UUID> attrMember = new LinkedHashSet<UUID>();
    Set<UUID> attrValueMember = new HashSet<UUID>();
    AttributeDefinition attr = null;
    String valueType = "";
    if (!Strings.isNullOrEmpty(params.ATTR_CODE)) {
        attr = AttributeDefinition.get(params.ATTR_CODE);
        valueType = attr.getValueType() + "";
        if (Strings.isNullOrEmpty(params.ATTR_VALUE)) {
            attrMember.addAll(Helper.memberToId(Helper.findHasAttribute(params.ATTR_CODE)));
        } else {
            attrMember.addAll(Helper.memberToId(Helper.findAttributeValue(params.ATTR_CODE, params.ATTR_VALUE)));
        }
        attrMember = formatMemberOrder(attrMember);
    }

    if (attrMember.size() > 0) {//存在符合扩展属性的成员
        //扩展属性值类型为成员
        if ((("dept").equalsIgnoreCase(valueType) || ("post").equalsIgnoreCase(valueType) || ("person").equalsIgnoreCase(valueType) || ("member").equalsIgnoreCase(valueType))) {
            params.attrTypeIsMember = true;
            for (UUID uuid : attrMember) {
                String attrValue = Member.get(uuid).getAttributeSingleValue(params.ATTR_CODE);
                Member m = Member.get(UUID.fromString(attrValue));
                attrValueMember.addAll(Helper.memberToId(Helper.getAncestorsAndSelf(m.getId())));
                if (m.getType().equals(MemberType.Dept)) {
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildDepts()));
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPosts()));
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPersons()));
                } else if (m.getType().equals(MemberType.Post)) {
                    attrValueMember.addAll(Helper.memberToId(((Post) m).getPersons()));
                } else if (m.getType().equals(MemberType.Person)) {
                    attrValueMember.add(m.getId());
                }
            }
        } else {
            for (UUID uuid : attrMember) {
                Member m = Member.get(uuid);
                attrValueMember.addAll(Helper.memberToId(Helper.getAncestorsAndSelf(m.getId())));
                if (m.getType().equals(MemberType.Dept)) {
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildDepts()));
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPosts()));
                    attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPersons()));
                } else if (m.getType().equals(MemberType.Post)) {
                    attrValueMember.addAll(Helper.memberToId(((Post) m).getPersons()));
                } else if (m.getType().equals(MemberType.Person)) {
                    attrValueMember.add(m.getId());
                }
            }
        }
    }
    //获取根目录
    if (Strings.isNullOrEmpty(params.nodeId) && params.ROOTS.length > 0) {
        for (String id : params.ROOTS) {
            topDept = Member.get(UUID.fromString(id));
            TreeNodeData treeRoot = createNode(topDept, params, attrMember);
            if (treeRoot != null) {
                //            treeRoot.setKey(topDept.getId().toString());
                treeRoot.setRefKey(topDept.getId().toString());
                treeRoot.setTitle(topDept.getName());
                treeRoot.setFolder(true);
                treeRoot.setExpanded(true);
                treeRoot.setLazy(true);
                if (!params.ROOT_SELECTED || attrMember.size() > 0 && !attrMember.contains(topDept.getId())) {
                    treeRoot.setUnselectable(true);
                    treeRoot.setHideCheckbox(true);
                }
                recursionNode(treeRoot, topDept, params, isRoot, nodes, attrMember);
            }
        }
    } else {
        if (Strings.isNullOrEmpty(params.nodeId)) {
            if (attrValueMember != null && attrValueMember.size() > 0) {
                isLazyAttr = true;
                TreeNodeData<Map<String, String>> treeRootParent = new TreeNodeData<Map<String, String>>();
                Map<String, String> map = new HashMap<String, String>();
                map.put("type", "noMember");
                treeRootParent.setData(map);
                treeRootParent.setRefKey(UUID.randomUUID().toString());
                treeRootParent.setTitle(attr.getTitle());
                treeRootParent.setFolder(true);
                treeRootParent.setExpanded(true);
                treeRootParent.setLazy(true);
                treeRootParent.setIconclass("fa fa-users");
//                if (!params.ROOT_SELECTED || !params.MULTIPLE) {
                treeRootParent.setUnselectable(true);
                treeRootParent.setHideCheckbox(true);
//                }
                List<TreeNodeData> childrens = new ArrayList<TreeNodeData>();
                for (UUID uuid : attrMember) {
                    topDept = Member.get(uuid);
                    TreeNodeData treeRoot = createNode(topDept, params, attrValueMember);
                    if (treeRoot != null) {
                        //                        treeRoot.setKey(pcd.getMemberId());
                        treeRoot.setRefKey(uuid.toString());
                        treeRoot.setTitle(topDept.getName());
                        treeRoot.setFolder(true);
                        treeRoot.setExpanded(false);
                        if(topDept.getType().equals(MemberType.Dept) && !params.POST && !params.PERSON){
                            treeRoot.setLazy(false);
                        }else if(topDept.getType().equals(MemberType.Post) && !params.PERSON){
                            treeRoot.setLazy(false);
                        }else{
                            treeRoot.setLazy(true);
                        }

                        if (attrMember.size() > 0 && !attrMember.contains(topDept.getId())) {
                            treeRoot.setUnselectable(true);
                            treeRoot.setHideCheckbox(true);
                        }
                        recursionNode(treeRoot, topDept, params, isRoot, childrens, attrValueMember);
                    }
                }
                if (childrens.size() != 0) {
                    treeRootParent.setChildren(childrens);
                    nodes.add(treeRootParent);
                }
            } else if (Strings.isNullOrEmpty(params.ATTR_CODE) || params.notResultIsShowAll) {
                topDept = Dept.getTopDept();
            }
        } else if (Strings.isNullOrEmpty(params.ATTR_CODE) || params.notResultIsShowAll) {
            isRoot = false;
            topDept = Member.get(UUID.fromString(params.nodeId));
        }
        if (!isLazyAttr && topDept != null) {
            TreeNodeData treeRoot = createNode(topDept, params, attrMember);
            if (treeRoot != null) {
                //        treeRoot.setKey(topDept.getId().toString());
                treeRoot.setRefKey(topDept.getId().toString());
                treeRoot.setTitle(topDept.getName());
                treeRoot.setFolder(true);
                treeRoot.setExpanded(true);
                treeRoot.setLazy(true);
                if (!params.ROOT_SELECTED || attrMember.size() > 0 && !attrMember.contains(topDept.getId())) {
                    treeRoot.setUnselectable(true);
                    treeRoot.setHideCheckbox(true);
                }
                recursionNode(treeRoot, topDept, params, isRoot, nodes, attrMember);
            }
        }
    }

    if (Strings.isNullOrEmpty(params.nodeId)) {//只有第一次加载tree时加载常用组的一、二级目录
        List<Member> rootChildList = null;
        Collection<UUID> rootChildId = new LinkedHashSet<UUID>();
        if (params.ROOTS.length > 0) {
            rootChildList = getRootChild(params.ROOTS);
            if (rootChildList != null) {
                rootChildId = Helper.memberToId(rootChildList.toArray(new Member[rootChildList.size()]));
            }
        }
        PlatContactFactory platContactFactory = new PlatContactFactory();
        IPlatContactService platContactService = platContactFactory.getPlatContactService();
        List<PlatContactEntity> list = platContactFactory.getPlatContactService().selCurrentPlatContact();
        if (list != null) {
            for (PlatContactEntity platContactEntity : list) {
                PlatContactEntity platContact = platContactService.selPlatContactAll(platContactEntity.getContactId());
                List<PlatContactDetailsEntity> pcdList = platContact.getPlatContactDetails();
                if (pcdList != null) {
                    TreeNodeData<Map<String, String>> treeRootParent = new TreeNodeData<Map<String, String>>();
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("type", "noMember");
                    treeRootParent.setData(map);
                    //treeRootParent.setKey(platContact.getContactId());
                    treeRootParent.setRefKey(platContact.getContactId());
                    treeRootParent.setTitle(platContact.getContactName());
                    treeRootParent.setFolder(true);
                    treeRootParent.setExpanded(false);
                    treeRootParent.setLazy(true);
                    treeRootParent.setIconclass("fa fa-users");
                    if (!params.ROOT_SELECTED || !params.MULTIPLE) {
                        treeRootParent.setUnselectable(true);
                        treeRootParent.setHideCheckbox(true);
                    }
                    List<TreeNodeData> childrens = new ArrayList<TreeNodeData>();
                    for (PlatContactDetailsEntity pcd : pcdList) {
                        if (rootChildId == null || rootChildId != null && rootChildId.size() != 0 && !rootChildId.contains(UUID.fromString(pcd.getMemberId()))) {
                            continue;
                        }
                        topDept = Member.get(UUID.fromString(pcd.getMemberId()));
                        TreeNodeData treeRoot = createNode(topDept, params, attrMember);
                        if (treeRoot != null) {
                            //                        treeRoot.setKey(pcd.getMemberId());
                            treeRoot.setRefKey(pcd.getMemberId());
                            treeRoot.setTitle(pcd.getMemberName());
                            treeRoot.setFolder(true);
                            treeRoot.setExpanded(false);
                            treeRoot.setLazy(true);
                            if (attrMember.size() > 0 && !attrMember.contains(topDept.getId())) {
                                treeRoot.setUnselectable(true);
                                treeRoot.setHideCheckbox(true);
                            }
                            recursionNode(treeRoot, topDept, params, isRoot, childrens, attrMember);
                        }
                    }
                    if (childrens.size() != 0) {
                        treeRootParent.setChildren(childrens);
                        nodes.add(treeRootParent);
                    }
                }
            }
        }
    }

    if ((nodes == null || nodes.size() == 0) && Strings.isNullOrEmpty(params.nodeId)) {
        TreeNodeData<Map<String, String>> treeRootParent = new TreeNodeData<Map<String, String>>();
        treeRootParent.setRefKey("");
        if (Strings.isNullOrEmpty(params.ATTR_CODE)) {
            treeRootParent.setTitle("数据加载失败，请联系管理员！");
        } else {
            treeRootParent.setTitle("请求数据不存在，请联系管理员！");
        }
        treeRootParent.setFolder(false);
        treeRootParent.setExpanded(false);
        treeRootParent.setLazy(false);
        treeRootParent.setIconclass("fa fa-exclamation-circle");
        treeRootParent.setUnselectable(true);
        treeRootParent.setHideCheckbox(true);
        nodes.add(treeRootParent);
    }
    out.print(TreeNodeData.toJSON(nodes));
%>