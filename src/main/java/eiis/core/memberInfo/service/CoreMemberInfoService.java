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





    //得到菜单列表
    public List<Map<String,Object>> getMainInfo(String mainId, String searchKey, int page, int rows)throws Exception{
        Map<String,Object> values = new HashedMap();
        if(StringUtils.isNotBlank(mainId)){
            values.put("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            values.put("searchKey",searchKey);
        }

        String baseSql = "select cmi.MEMBER_ID,cmi.MEMBER_NAME,cmi.PHOTO,cmi.ACCOUNT,cmi.PASSWORD,cmi.IS_FROZEN  from core_member_info cmi where 1=1 " +
                (StringUtils.isNotBlank(mainId)?" and cmi.MEMBER_ID=:mainId ":"");

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
                (StringUtils.isNotBlank(mainId)?" and cmi.MEMBER_ID=:mainId ":"");
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
        memberList.append("<li class='active' role='presentation' onclick = \"click_type('").append("-1").append("',this)\" ><a href='javascript:void(0)'>").append("显示全部").append("</a></li>");
        for (CoreMemberInfoEntity entity : list ){
            memberList.append("<li class role='presentation' onclick = \"click_type('").append(entity.getMemberId()).append("',this)\" ><a href='javascript:void(0)'>").append(entity.getMemberName()).append("</a></li>");
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
