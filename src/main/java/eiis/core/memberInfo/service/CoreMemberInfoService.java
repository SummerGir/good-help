package eiis.core.memberInfo.service;

import eiis.core.memberInfo.dao.CoreMemberInfoDao;
import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.context.Context;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
        CoreMemberInfoEntity entity = findOne("0df6d960-b87c-11e7-96df-64510645b30f");
        System.out.println("当前登录人："+entity.getMemberName());
        Context.member = entity;
    }
}
