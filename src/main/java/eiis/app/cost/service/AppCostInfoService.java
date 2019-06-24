package eiis.app.cost.service;

import eiis.app.cost.dao.AppCostInfoDao;
import eiis.app.cost.entity.AppDailyCostInfoEntity;
import eiis.app.note.entity.AppNoteInfoEntity;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Map;

@Service("eiis.app.cost.service.AppCostInfoService")
public class AppCostInfoService extends GenericService<AppDailyCostInfoEntity,String>{

    @Autowired
    protected AppCostInfoDao dao;

    @Autowired
    protected EntityManager entityManager;

    @Override
    protected GenericDao<AppDailyCostInfoEntity, String> getDaoInstance() {
        return dao;
    }

   public static AppCostInfoService getInstance(){
        return ApplicationContext.getCurrent().getBean(AppCostInfoService.class);
   }

    @Transactional
    public void save(AppDailyCostInfoEntity entity) throws Exception {
        dao.save(entity);
    }
    @Transactional
    public void save(List<AppDailyCostInfoEntity> list) throws Exception {
        dao.save(list);
    }
    @Transactional
    public void delete(String costID) throws Exception {
        dao.delete(costID);
    }
    //得到菜单列表
    public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,String beginTime,String overTime,String typeDetailId,int page,int rows)throws Exception{
        Map<String,Object> values = new HashedMap();
        values.put("typeDetailId",typeDetailId);
        if(StringUtils.isNotBlank(mainId)){
            values.put("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            values.put("searchKey",searchKey);
        }if(StringUtils.isNotBlank(beginTime)){
            values.put("beginTime",beginTime);
        }if(StringUtils.isNotBlank(overTime)){
            values.put("overTime",overTime);
        }
        String baseSql = "select adci.COST_ID,adci.TITLE,adci.COST_TIME,adci.PAY_MONEY,adci.TYPE_DETAIL_ID,adci.SYS_TIME from app_daily_cost_info adci left join app_type_info ati on adci.TYPE_DETAIL_ID=ati.TYPE_ID where adci.TYPE_DETAIL_ID=:typeDetailId " +
                (StringUtils.isNotBlank(mainId)?" and adci.COST_ID=:mainId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,ani.TITLE)>0 or locate(:searchKey,ani.CONTENT)>0) ":"")+
                (StringUtils.isNotBlank(beginTime)?" and adci.SYS_TIME>=:beginTime ":"")+
                (StringUtils.isNotBlank(overTime)?" and adci.SYS_TIME<=:overTime ":"")+
                " order by ati.SYS_TIME desc";
        String[] fields = {"costID", "title", "costTime", "payMoney", "typeDetailId","sysTime"};

        List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

        for (Map<String, Object> m : list) {
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (e.getValue() == null) {
                    m.put(e.getKey(), "");
                }
                if("sysTime".equals(e.getKey().toString())){
                    m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
                }
            }
        }
        return list;
    }
    public int getMainCount(String mainId,String searchKey,String beginTime,String overTime,String typeDetailId){
        String baseSql = "select count(1) from app_daily_cost_info adci where adci.TYPE_DETAIL_ID=:typeDetailId " +
                (StringUtils.isNotBlank(mainId)?" and adci.NOTE_ID=:mainId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,ani.TITLE)>0 or locate(:searchKey,ani.CONTENT)>0) ":"")+
                (StringUtils.isNotBlank(beginTime)?" and adci.SYS_TIME>=:beginTime ":"")+
                (StringUtils.isNotBlank(overTime)?" and adci.SYS_TIME<=:overTime ":"");
        Query query = entityManager.createNativeQuery(baseSql).setParameter("typeDetailId",typeDetailId);
        if(StringUtils.isNotBlank(mainId)){
            query.setParameter("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            query.setParameter("searchKey",searchKey);
        }if(StringUtils.isNotBlank(beginTime)){
            query.setParameter("beginTime",beginTime);
        }if(StringUtils.isNotBlank(overTime)){
            query.setParameter("overTime",overTime);
        }
        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }
}
