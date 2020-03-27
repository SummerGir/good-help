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
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.account.service.AppAccountInfoService")
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


    public List<Map<String,Object>> getMainInfo(String accountId,String memberId, String searchKey, int page, int rows)throws Exception{
        Map<String,Object> values = new HashMap();

        if (StringUtils.isNotBlank(accountId)){
            values.put("accountId",accountId);
        }if (StringUtils.isNotBlank(memberId)){
            values.put("memberId",memberId);
        }if (StringUtils.isNotBlank(searchKey)){
            values.put("searchKey",searchKey);
        }

        String basicSql = "select aai.ACCOUNT_ID,aai.ACCOUNT_TYPE,aai.ACCOUNT_NAME,aai.ACCOUNT_PASSWORD,aai.MEMBER_ID,cmi.MEMBER_NAME,aai.COMMENT from app_account_info aai join core_member_info cmi on aai.MEMBER_ID = cmi.MEMBER_ID where 1=1 " +
                (StringUtils.isNotBlank(accountId)?" and aai.ACCOUNT_ID=:accountId ":"") +
                (StringUtils.isNotBlank(memberId)?" and aai.MEMBER_ID=:memberId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,aai.ACCOUNT_TYPE)>0) OR (locate(:searchKey,aai.COMMENT)>0) ":"");

        String[] fields = {"accountId","accountType","accountName","accountPassword","memberId","memberName","comment"};

        List<Map<String,Object>> list = getNativeMapList(entityManager,basicSql,values,fields,page,rows);

        for (Map<String,Object> m:list){
            for (Map.Entry<String,Object> e: m.entrySet()){
                if (e.getValue() == null){
                    m.put(e.getKey(),"");
                }
                if("accountPassword".equals(e.getKey())){
                    byte[] decode = Base64.getDecoder().decode(e.getValue().toString());
                    m.put(e.getKey(),new String(decode, "UTF-8"));
                }
            }
        }
        return list;
    }

    public int getMainCount(String accountId,String memberId, String searchKey){
        String baseSql = "select count(1) from app_account_info aai  where 1=1 "+
                (StringUtils.isNotBlank(accountId)?" and aai.ACCOUNT_ID=:accountId ":"") +
                (StringUtils.isNotBlank(memberId)?" and aai.MEMBER_ID=:memberId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,aai.ACCOUNT_TYPE)>0) OR (locate(:searchKey,aai.COMMENT)>0) ":"");
        Query query = entityManager.createNativeQuery(baseSql);
        if (StringUtils.isNotBlank(accountId)){
            query.setParameter("accountId",accountId);
        }if (StringUtils.isNotBlank(memberId)){
            query.setParameter("memberId",memberId);
        }if (StringUtils.isNotBlank(searchKey)){
            query.setParameter("searchKey",searchKey);
        }
        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }

}
