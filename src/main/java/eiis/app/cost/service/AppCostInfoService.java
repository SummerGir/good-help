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
        if(StringUtils.isNotBlank(typeDetailId)){
            values.put("typeDetailId",typeDetailId);
        }if(StringUtils.isNotBlank(mainId)){
            values.put("mainId",mainId);
        }if(StringUtils.isNotBlank(searchKey)){
            values.put("searchKey",searchKey);
        }if(StringUtils.isNotBlank(beginTime)){
            values.put("beginTime",beginTime);
        }if(StringUtils.isNotBlank(overTime)){
            values.put("overTime",overTime);
        }
        String baseSql = "select main.COST_ID,main.TITLE,main.COST_TIME,main.COST_NUM,main.COST_PRICE,main.PAY_MONEY,main.TYPE_DETAIL_ID,atd.DETAIL_NAME,main.SYS_TIME from app_daily_cost_info main left join app_type_detail atd on main.TYPE_DETAIL_ID=atd.TYPE_DETAIL_ID  where 1=1 " +
                (StringUtils.isNotBlank(typeDetailId)?" and main.TYPE_DETAIL_ID=:typeDetailId ":"")+
                (StringUtils.isNotBlank(mainId)?" and main.COST_ID=:mainId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,mani.TITLE)>0 or locate(:searchKey,mani.CONTENT)>0) ":"")+
                (StringUtils.isNotBlank(beginTime)?" and main.SYS_TIME>=:beginTime ":"")+
                (StringUtils.isNotBlank(overTime)?" and main.SYS_TIME<=:overTime ":"")+
                " order by main.COST_TIME desc";
        String[] fields = {"costId", "title", "costTime","costNum","costPrice", "payMoney", "typeDetailId","typeDetailName","sysTime"};

        List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

        for (Map<String, Object> m : list) {
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (e.getValue() == null) {
                    m.put(e.getKey(), "");
                }
                if("sysTime".equals(e.getKey().toString()) || "costTime".equals(e.getKey().toString())){
                    m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
                }else if("payMoney".equals(e.getKey().toString())){
                    m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
                }
            }
        }
        return list;
    }


    public int getMainCount(String mainId,String searchKey,String beginTime,String overTime,String typeDetailId){
        String baseSql = "select count(1) from app_daily_cost_info main where 1=1 " +
                (StringUtils.isNotBlank(typeDetailId)?" and main.TYPE_DETAIL_ID=:typeDetailId ":"")+
                (StringUtils.isNotBlank(mainId)?" and main.NOTE_ID=:mainId ":"")+
                (StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,ani.TITLE)>0 or locate(:searchKey,ani.CONTENT)>0) ":"")+
                (StringUtils.isNotBlank(beginTime)?" and main.SYS_TIME>=:beginTime ":"")+
                (StringUtils.isNotBlank(overTime)?" and main.SYS_TIME<=:overTime ":"");
        Query query = entityManager.createNativeQuery(baseSql);
        if(StringUtils.isNotBlank(typeDetailId)){
            query.setParameter("typeDetailId",typeDetailId);
        }if(StringUtils.isNotBlank(mainId)){
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
