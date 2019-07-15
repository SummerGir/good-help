<%@ page import="eiis.membership.*" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.util.*" %>
<%@ page import="eiis.util.UUIDUtils" %>
<%@ page import="com.google.common.base.Strings" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
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
            String type = request.getParameter("type");
            String exclude = request.getParameter("exclude");

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
            this.exclude = exclude;
            if (!Strings.isNullOrEmpty(type)) this.TREE_TYPE = type;
            if (!Strings.isNullOrEmpty(roots)) {
                this.ROOTS = StringUtils.split(roots, ";");
            }
        }
    }

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

    private Map<String, Object> createTag(Member m, SelectorParams params) {
        if(!Strings.isNullOrEmpty(params.exclude) && params.exclude.indexOf(m.getId().toString())!=-1){
            return null;
        }
        boolean addFlag = false;
        if (MemberType.Dept.equals(m.getType()) && params.DEPT) addFlag = true;
        if (MemberType.Post.equals(m.getType()) && params.POST) addFlag = true;
        if (MemberType.Person.equals(m.getType()) && params.PERSON) addFlag = true;
        if (addFlag) {
            Map<String, Object> tag = new HashMap<String, Object>();
            tag.put("text", m.getName());
            tag.put("id", m.getId().toString());
            //tag.put("disabled",false);
            //tag.put("locked",false);
            if (MemberType.Person.equals(m.getType())) {
                Person person = (Person) m;
                Dept dept = person.getDept();
                String path = getPath(dept);
                tag.put("parentId", person.getPost().getId().toString());
                tag.put("path", path);
                tag.put("classIcon", "fa fa-user");
                tag.put("style","color:#31b0d5;");
            }
            if (MemberType.Post.equals(m.getType())) {
                Dept dept = ((Post) m).getDept();
                String path = getPath(dept);
                tag.put("path", path);
                tag.put("classIcon", "fa fa-reddit-square");
                tag.put("style","color:#ec971f;");
            }
            if (MemberType.Dept.equals(m.getType())) {
                String path = getPath(m);
                tag.put("path", path);
                tag.put("classIcon", "fa fa-users");
                tag.put("style","color:#449d44;");
            }
            if (m.isFrozen()) tag.put("style","color:#666;");
            return tag;
        }
        return null;
    }

    private String getPath(Member m) {
        String _return = "";
        Member[] members = Helper.getAncestorsAndSelf(m.getId());
        int loop = members.length > 1 ? 1 : 0;
        List<String> names = new ArrayList<String>();
        for (int i = members.length - 1; i >= 0; i--) {
            if (i < loop) break;
            names.add(members[i].getName());
        }
        if (names.size() == 1 && m.getName().equalsIgnoreCase(names.get(0))) {
            _return = m.getName();
        } else {
            _return = StringUtils.join(names, " / ");
        }
        return _return.substring(0, _return.length());
    }
%>
<%
    out.clear();
    out = pageContext.pushBody();
    response.setContentType("text/plain");

    String ids = request.getParameter("ids");
    String pageNum = request.getParameter("page");
    String find = request.getParameter("term");
    SelectorParams params = new SelectorParams(request);

    String json = "[]";
    List<Map<String, Object>> tags = new ArrayList<Map<String, Object>>();

    if (!Strings.isNullOrEmpty(find)) {//成员选择器输入值计算
//        Member[] memberByName = null;
        List<Member> members = new ArrayList<Member>();
        Set<UUID> attrMember = new HashSet<UUID>();
        Set<UUID> attrValueMember = new HashSet<UUID>();
        try {
            Map<String, Map<String, Integer>> pinyin = eiis.sys.member.PinYin.getInstance().getPinYin();
            Collection<String> uids = eiis.util.pinyin.Utils.findData(find, pinyin);
            if(!Strings.isNullOrEmpty(params.ATTR_CODE)){
                if(Strings.isNullOrEmpty(params.ATTR_VALUE)){
                    attrMember.addAll(Helper.memberToId(Helper.findHasAttribute(params.ATTR_CODE)));
                    AttributeDefinition attr = AttributeDefinition.get(params.ATTR_CODE);
                    String valueType = attr.getValueType()+"";
                    if(attrMember.size()>0 && (("dept").equalsIgnoreCase(valueType) || ("post").equalsIgnoreCase(valueType) || ("person").equalsIgnoreCase(valueType) || ("member").equalsIgnoreCase(valueType))) {
                        for(UUID uuid : attrMember){
                            String attrValue = Member.get(uuid).getAttributeSingleValue(params.ATTR_CODE);
                            Member m = Member.get(UUID.fromString(attrValue));
                            attrValueMember.add(m.getId());
                            if(m.getType().equals(MemberType.Dept)){
                                attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildDepts()));
                                attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPosts()));
                                attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPersons()));
                            }else if(m.getType().equals(MemberType.Post)){
                                attrValueMember.addAll(Helper.memberToId(((Post) m).getPersons()));
                            }else if(m.getType().equals(MemberType.Person)){
                                attrValueMember.add(m.getId());
                            }
                        }
                        attrMember.addAll(attrValueMember);
                    }
                }else{
                    attrMember.addAll(Helper.memberToId(Helper.findAttributeValue(params.ATTR_CODE,params.ATTR_VALUE)));
                }
            }
            if(!Strings.isNullOrEmpty(params.ATTR_CODE)){
                if(attrMember.size()==0){
                    if(params.notResultIsShowAll){
                        for (String id : uids) {
                            members.add(Member.get(UUID.fromString(id)));
                        }
                    }
                }else{
                    for (String id : uids) {
                        if(!attrMember.contains(UUID.fromString(id))){
                            continue;
                        }
                        members.add(Member.get(UUID.fromString(id)));
                    }
                }
            }else{
                for (String id : uids) {
                    members.add(Member.get(UUID.fromString(id)));
                }
            }
//            Member _m = Person.get(find);
//            if(_m == null){
//                memberByName = Helper.findByName(find);
//            }else{
//                memberByName = new Member[1];
//                memberByName[0] = _m;
//            }
        } catch (Exception e) {
//            memberByName = Helper.findByName(find);
        }

//        for(Member m : memberByName){
        List<Member> rootChildList = getRootChild(params.ROOTS);
        Collection<UUID> rootChildId = new LinkedHashSet<UUID>();
        if (rootChildList != null) {
            rootChildId = Helper.memberToId(rootChildList.toArray(new Member[rootChildList.size()]));
        }
        for (Member m : members) {
            if (rootChildId == null || rootChildId != null && rootChildId.size() > 0 && !rootChildId.contains(m.getId())) {
                continue;
            }
            if (params.FREEZE) {
                Map<String, Object> tag = createTag(m, params);
                if (tag != null) tags.add(tag);
            } else {
                if (m.isFrozen()) continue;
                Map<String, Object> tag = createTag(m, params);
                if (tag != null) tags.add(tag);
            }
        }
    }else{
        Set<UUID> attrMember = new LinkedHashSet<UUID>();
        Set<UUID> attrValueMember = new LinkedHashSet<UUID>();
        Collection<UUID> values = new LinkedHashSet<UUID>();
        if(!Strings.isNullOrEmpty(ids) && !Strings.isNullOrEmpty(params.ATTR_CODE)){
            values = UUIDUtils.parses(StringUtils.split(ids, ";"));
            if(Strings.isNullOrEmpty(params.ATTR_VALUE)){
                attrMember.addAll(Helper.memberToId(Helper.findHasAttribute(params.ATTR_CODE)));
                AttributeDefinition attr = AttributeDefinition.get(params.ATTR_CODE);
                String valueType = attr.getValueType()+"";
                if(attrMember.size()>0 && (("dept").equalsIgnoreCase(valueType) || ("post").equalsIgnoreCase(valueType) || ("person").equalsIgnoreCase(valueType) || ("member").equalsIgnoreCase(valueType))) {
                    for(UUID uuid : attrMember){
                        String attrValue = Member.get(uuid).getAttributeSingleValue(params.ATTR_CODE);
                        Member m = Member.get(UUID.fromString(attrValue));
                        attrValueMember.add(m.getId());
                        if(m.getType().equals(MemberType.Dept)){
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildDepts()));
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPosts()));
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPersons()));
                        }else if(m.getType().equals(MemberType.Post)){
                            attrValueMember.addAll(Helper.memberToId(((Post) m).getPersons()));
                        }else if(m.getType().equals(MemberType.Person)){
                            attrValueMember.add(m.getId());
                        }
                    }
                    attrMember.addAll(attrValueMember);
                }
            }else{
                attrMember.addAll(Helper.memberToId(Helper.findAttributeValue(params.ATTR_CODE,params.ATTR_VALUE)));
            }
        }else if(!Strings.isNullOrEmpty(ids)){
            values = UUIDUtils.parses(StringUtils.split(ids, ";"));
        }else if(!Strings.isNullOrEmpty(params.ATTR_CODE)){
            if(Strings.isNullOrEmpty(params.ATTR_VALUE)){
                values = Helper.memberToId(Helper.findHasAttribute(params.ATTR_CODE));
                AttributeDefinition attr = AttributeDefinition.get(params.ATTR_CODE);
                String valueType = attr.getValueType()+"";
                if(attrMember.size()>0 && (("dept").equalsIgnoreCase(valueType) || ("post").equalsIgnoreCase(valueType) || ("person").equalsIgnoreCase(valueType) || ("member").equalsIgnoreCase(valueType))) {
                    for(UUID uuid : attrMember){
                        String attrValue = Member.get(uuid).getAttributeSingleValue(params.ATTR_CODE);
                        Member m = Member.get(UUID.fromString(attrValue));
                        attrValueMember.add(m.getId());
                        if(m.getType().equals(MemberType.Dept)){
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildDepts()));
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPosts()));
                            attrValueMember.addAll(Helper.memberToId(((Dept) m).getChildPersons()));
                        }else if(m.getType().equals(MemberType.Post)){
                            attrValueMember.addAll(Helper.memberToId(((Post) m).getPersons()));
                        }else if(m.getType().equals(MemberType.Person)){
                            attrValueMember.add(m.getId());
                        }
                    }
                    values.addAll(attrValueMember);
                }
            }else{
                values = Helper.memberToId(Helper.findAttributeValue(params.ATTR_CODE, params.ATTR_VALUE));
            }
        }

        if (values!=null && values.size()!=0) {//只用于成员选择器初始值计算
            for (UUID id : values) {
                if(attrMember.size()>0 && !attrMember.contains(id)){
                    continue;
                }
                Member m = Member.get(id);
                if(m!=null){
                    Map<String, Object> tag = new HashMap<String, Object>();
                    tag.put("text", m.getName());
                    tag.put("id", m.getId().toString());
                    if (MemberType.Dept.equals(m.getType())) {
                        tag.put("path", getPath(m));
                    } else if (MemberType.Post.equals(m.getType())) {
                        tag.put("path", getPath(((Post) m).getDept()));
                    } else if (MemberType.Person.equals(m.getType())) {
                        tag.put("path", getPath(((Person) m).getDept()));
                    }
                    Map<String, Object> map = createTag(m, params);
                    if (map != null) {
                        tags.add(map);
                    }
                }
            }
        }

    }

    JsonUtils.write(response.getOutputStream(), tags);
%>