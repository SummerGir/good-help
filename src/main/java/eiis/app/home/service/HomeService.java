package eiis.app.home.service;

import eiis.app.home.dao.homeDao;
import eiis.app.home.entity.HomeEntity;
import eiis.app.menstrual.dao.AppMenstrualInfoDao;
import eiis.app.menstrual.entity.AppMenstrualInfoEntity;
import eiis.app.menstrual.service.AppMenstrualInfoService;
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

@Service("eiis.app.home.service.HomeService")
public class HomeService extends GenericService<HomeEntity, String>{

    @Autowired
    private homeDao dao;

    @Autowired
    protected EntityManager entityManager;

    protected HomeService() {}

    public static AppMenstrualInfoService getInstance() {return ApplicationContext.getCurrent().getBean(AppMenstrualInfoService.class);}

    @Transactional
    public void save(HomeEntity entity) throws Exception {
        dao.save(entity);
    }
    @Transactional
    public void save(List<HomeEntity> list) throws Exception {
        dao.save(list);
    }
    @Transactional
    public void delete(String mainId) throws Exception {
        dao.delete(mainId);
    }

    @Override
    protected GenericDao<HomeEntity, String> getDaoInstance() {
        return null;
    }


    public List<Map<String,Object>> getMainInfo(int page, int rows)throws Exception{
        String sql = "select h.id,h.home_index,h.home_max from home h where 1=1 order by h.home_index";
        String[] fields = {"id" ,"homeIndex","homeMax",};
        List<Map<String, Object>> list = getNativeMapList(entityManager, sql, null, fields, page, rows);

        for(int i = 0;i<list.size();i++){
            Map<String, Object> map = list.get(i);
            map.put("order",i+1);
        }

        return list;
    }

    public int getMainCount(){
        String baseSql = "select count(1) from home main";
        Query query = entityManager.createNativeQuery(baseSql);

        int count = 0;
        List list = query.getResultList();
        if(list != null && list.size() > 0){
            count = Integer.parseInt(list.get(0).toString());
        }
        return count;
    }













}
