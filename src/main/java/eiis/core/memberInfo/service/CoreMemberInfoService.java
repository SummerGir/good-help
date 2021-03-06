package eiis.core.memberInfo.service;

import eiis.core.memberInfo.dao.CoreMemberInfoDao;
import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.context.Context;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service("eiis.core.memberInfo.service.CoreMemberInfoService")
public class CoreMemberInfoService extends GenericService<CoreMemberInfoEntity, String> {


    @PersistenceContext
    protected EntityManager entityManager;


    @Autowired
    private CoreMemberInfoDao dao;

    public CoreMemberInfoService(){}

    @Override
    protected GenericDao<CoreMemberInfoEntity, String> getDaoInstance() {
        return dao;
    }
    public static CoreMemberInfoService getInstance(){
        return ApplicationContext.getCurrent().getBean(CoreMemberInfoService.class);
    }

    public void setMember(){
        CoreMemberInfoEntity entity = findOne("0dfb8bd5-b87c-11e7-96df-64510645b30a");
        System.out.println("当前登录人："+entity.getMemberName());
        Context.setMember(entity);
    }

    public CoreMemberInfoEntity loginCheck(String username,String pwd){
        String sql = "select cmi.MEMBER_ID,cmi.MEMBER_NAME,cmi.PHOTO,cmi.ACCOUNT,cmi.PASSWORD,cmi.IS_FROZEN from core_member_info cmi where 1=1";
        Map<String,Object> values = new HashedMap();
        if(StringUtils.isNotBlank(username)){
            values.put("username",username);
            sql += " and cmi.ACCOUNT = :username";
        }if(StringUtils.isNotBlank(pwd)){
            values.put("pwd",pwd);
            sql += " and cmi.PASSWORD = :pwd";
        }
        String[] fields = {"memberId","memberName","photo","account","password","isFrozen"};
        List<Map<String, Object>> list = new LinkedList<>();
        try{
             list = getNativeMapList(entityManager, sql, values, fields, 1, 1);
        }catch (Exception e){
            e.printStackTrace();
        }
        if(list != null && list.size()>0){
            CoreMemberInfoEntity entity = new CoreMemberInfoEntity();
            entity.setMemberId(list.get(0).get("memberId").toString());
            entity.setMemberName(list.get(0).get("memberName").toString());
//            entity.setPhoto(list.get(0).get("photo").toString());
            entity.setAccount(list.get(0).get("account").toString());
            entity.setPassword(list.get(0).get("password").toString());
            entity.setIsFrozen(Boolean.parseBoolean(list.get(0).get("isFrozen").toString()));
            return entity;
        }else {
            return null;
        }

    }





    //得到菜单列表
    public List<Map<String,Object>> getMainInfo(String mainId, String searchKey, int page, int rows)throws Exception{
        Map<String,Object> values = new HashedMap();
        if(StringUtils.isNotBlank(mainId)){
            values.put("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            values.put("searchKey",searchKey);
        }

        String baseSql = "select cmi.MEMBER_ID,cmi.MEMBER_NAME,cmi.PHOTO,cmi.ACCOUNT,cmi.PASSWORD,cmi.IS_FROZEN  from core_member_info cmi where 1=1 " +
                (StringUtils.isNotBlank(mainId)?" and cmi.MEMBER_ID=:mainId ":"") +
                (StringUtils.isNotBlank(searchKey)?" and ((locate(:searchKey,cmi.MEMBER_NAME)>0) or(locate(:searchKey,cmi.ACCOUNT))>0 or (locate(:searchKey,cmi.PASSWORD))>0)":"") ;

        String[] fields = {"memberId","memberName","photo","account","password","isFrozen"};

        List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

        for (Map<String, Object> m : list) {
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (e.getValue() == null) {
                    m.put(e.getKey(), "");
                }
            }
        }
        return list;
    }

    public int getMainCount(String mainId,String searchKey){
        String baseSql = "select count(1) from core_member_info cmi where 1=1 " +
                (StringUtils.isNotBlank(mainId)?" and cmi.MEMBER_ID=:mainId ":"") +
                (StringUtils.isNotBlank(searchKey)?" and ((locate(:searchKey,cmi.MEMBER_NAME)>0) or(locate(:searchKey,cmi.ACCOUNT))>0 or (locate(:searchKey,cmi.PASSWORD))>0)":"") ;
        Query query = entityManager.createNativeQuery(baseSql);
        if(StringUtils.isNotBlank(mainId)){
            query.setParameter("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            query.setParameter("searchKey",searchKey);
        }
        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }


    public StringBuffer getOptionMember(){
        StringBuffer optionMember = new StringBuffer();
        List<CoreMemberInfoEntity> list = dao.findAll();
        for (CoreMemberInfoEntity entity : list ){
            optionMember.append("<option selected value='"+entity.getMemberId()+"'>"+entity.getMemberName()+"</option>");
        }
        return optionMember;
    }


    public StringBuffer getLiMember(){
        StringBuffer memberList = new StringBuffer();
        List<CoreMemberInfoEntity> list = dao.findAll();
        for(int i=0; i<list.size();i++){
            CoreMemberInfoEntity entity = list.get(i);
            if(i==0){
                memberList.append("<li class='active' role='presentation' onclick = \"click_type('").append(entity.getMemberId()).append("',this)\" ><a href='javascript:void(0)'>").append(entity.getMemberName()).append("</a></li>");
            }else {
                memberList.append("<li class role='presentation' onclick = \"click_type('").append(entity.getMemberId()).append("',this)\" ><a href='javascript:void(0)'>").append(entity.getMemberName()).append("</a></li>");
            }
        }
        return memberList;
    }



    @Transactional
    public void save(CoreMemberInfoEntity entity) throws Exception {
        dao.save(entity);
    }

    @Transactional
    public void delete(String mainId) throws Exception {
        dao.delete(mainId);
    }




}
