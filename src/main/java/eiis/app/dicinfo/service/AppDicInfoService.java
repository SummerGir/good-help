package eiis.app.dicinfo.service;

import eiis.app.dicinfo.dao.AppDicInfoDao;
import eiis.app.dicinfo.entity.AppDicInfoEntity;
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
import java.util.Set;

@Service("eiis.app.dicinfo.service.AppDicInfoService")
public class AppDicInfoService extends GenericService<AppDicInfoEntity,String>{

    @Autowired
    protected AppDicInfoDao dao;

    @Autowired
    protected EntityManager entityManager;

    @Override
    protected GenericDao<AppDicInfoEntity, String> getDaoInstance() {
        return dao;
    }

   public static AppDicInfoService getInstance(){
        return ApplicationContext.getCurrent().getBean(AppDicInfoService.class);
   }

    @Transactional
    public void save(AppDicInfoEntity entity) throws Exception {
        dao.save(entity);
    }
    @Transactional
    public void save(List<AppDicInfoEntity> list) throws Exception {
        dao.save(list);
    }
    @Transactional
    public void delete(String costID) throws Exception {
        dao.delete(costID);
    }

    @Transactional
    public void saveDicLevel(String dicId) throws Exception {
        AppDicInfoEntity entity = dao.findOne(dicId);
        entity.setPriorityLevel(entity.getPriorityLevel() + 1);
        save(entity);
    }
    @Transactional
    public void saveDicLevel(Set<String> set) throws Exception {
        List<AppDicInfoEntity> list = dao.findAll(set);
        for(AppDicInfoEntity entity : list){
            entity.setPriorityLevel(entity.getPriorityLevel() + 1);
        }
        save(list);
    }

    //得到菜单列表
    public List<Map<String,Object>> getMainInfo(int page,int rows) throws Exception{

        String baseSql = "select adi.DIC_ID,adi.DIC_NAME,adi.DIC_CODE,adi.UNIT_NAME,adi.PRICE,adi.PRIORITY_LEVEL,adi.SYS_TIME,adi.`COMMENT` from app_dic_info adi order by adi.PRIORITY_LEVEL desc,adi.DIC_NAME";
        String[] fields = {"dicId", "dicName", "dicCode","unitName", "price", "priorityLevel","sysTime","comment"};

        List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, null, fields, page, rows);
        for (Map<String, Object> m : list) {
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (e.getValue() == null) {
                    m.put(e.getKey(), "");
                }else if("sysTime".equals(e.getKey().toString())){
                    m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
                }else if ("price".equals(e.getKey().toString())){
                    m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
                }

            }
        }
        return list;
    }

    public int getMainCount(){
        String baseSql = "select count(1) from app_dic_info";
        Query query = entityManager.createNativeQuery(baseSql);
        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }

    public StringBuffer getDicOption(Boolean isHave)throws Exception{
        List<Map<String,Object>> list = getMainInfo(1,-1);
        StringBuffer sb = new StringBuffer();
        if(isHave){
            sb.append("<option value='' style='display:\'none\''>-请选择材料-</option>");
        }

        for(Map<String,Object> map : list){
            sb.append("<option value='"+ map.get("dicId").toString() +"' pr='"+ map.get("price").toString() +"' un='" + map.get("unitName").toString() +"'>"+ map.get("dicName").toString() +"</option>");
        }

        return sb;
    }
}
