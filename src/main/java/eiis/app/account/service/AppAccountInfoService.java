package eiis.app.account.service;

import eiis.app.account.dao.AppAccountInfoDao;
import eiis.app.account.entity.AppAccountInfoEntity;
import eiis.app.cost.entity.AppDailyCostInfoEntity;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.xml.transform.Result;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.cost.service.AppAccountInfoService")
public class AppAccountInfoService extends GenericService<AppAccountInfoEntity,String> {

    @Autowired
    protected AppAccountInfoDao dao;

    @Autowired
    protected EntityManager entityManager;

    @Override
    protected GenericDao<AppAccountInfoEntity, String> getDaoInstance() {
        return dao;
    }

    @Transactional
    public void save(AppAccountInfoEntity entity) throws Exception {
        dao.save(entity);
    }

    @Transactional
    public void delete(String accountId) throws Exception {
        dao.delete(accountId);
    }


    public List<Map<String,Object>> getMainInfo(String accountId, String searchKey, int page, int rows)throws Exception{
        Map<String,Object> values = new HashMap();

        if (StringUtils.isNotBlank(accountId)){
            values.put("accountId",accountId);
        }

        String basicSql = "select aai.ACCOUNT_ID,aai.ACCOUNT_NAME,aai.ACCOUNT_PASSWORD,aai.MEMBER_ID,aai.`COMMENT` from app_account_info aai where 1=1 " +
                (StringUtils.isNotBlank(accountId)?"and aai.ACCOUNT_ID=:accountId ":"");

        String[] fields = {"accountId","accountName","accountPassword","memberId","comment"};

        List<Map<String,Object>> list = getNativeMapList(entityManager,basicSql,values,fields,page,rows);

        for (Map<String,Object> m:list){
            for (Map.Entry<String,Object> e: m.entrySet()){
                if (e.getValue() == null){
                    m.put(e.getKey(),"");
                }
            }
        }
        return list;
    }

    public int getMainCount(String accountId){
        String baseSql = "select count(1) from app_account_info aai  where 1=1 "+
                (StringUtils.isNotBlank(accountId)?"and aai.ACCOUNT_ID=:accountId ":"");
        Query query = entityManager.createNativeQuery(baseSql);
        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }

}
