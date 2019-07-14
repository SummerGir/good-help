package eiis.app.menstrual.service;

import eiis.app.menstrual.dao.AppMenstrualInfoDao;
import eiis.app.menstrual.entity.AppMenstrualInfoEntity;
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
import java.util.*;

@Service("eiis.app.menstrual.service.AppMenstrualInfoService")
public class AppMenstrualInfoService extends
		GenericService<AppMenstrualInfoEntity, String> {
	public static int DEF_CYCLE = 28;
	public static int DEF_DURATION = 3;


	@Autowired
	private AppMenstrualInfoDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppMenstrualInfoService() {}

	@Override
	protected GenericDao<AppMenstrualInfoEntity, String> getDaoInstance() {return dao;}

	public static AppMenstrualInfoService getInstance() {return ApplicationContext.getCurrent().getBean(AppMenstrualInfoService.class);}

	@Transactional
	public void save(AppMenstrualInfoEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppMenstrualInfoEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}

	//得到列表
	public List<Map<String,Object>> getMainInfo(int page,int rows)throws Exception{
		String baseSql = "select main.MENS_ID,main.START_TIME,main.MENS_CYCLE,main.MENS_DIVER,main.IS_VALID,main.SYS_TIME from app_menstrual_info main order by main.SYS_TIME desc";
		String[] fields = {"mensId", "startTime","mensCycle","mensDiver","isValid","sysTime"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, null, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("mensCycle".equals(e.getKey().toString()) || "mensDiver".equals(e.getKey().toString())){
						m.put(e.getKey(), "0");
					}else{
						m.put(e.getKey(), "");
					}
				}else if("startTime".equals(e.getKey().toString()) || "sysTime".equals(e.getKey().toString())){
					m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
				}
			}
			int mensDiver = Integer.parseInt(m.get("mensDiver").toString());
			String diverStr = "正常";
			if(mensDiver > 0){
				diverStr = "延期 " + mensDiver + " 天";
			}else if(mensDiver < 0){
				diverStr = "提前 " + Math.abs(mensDiver) + " 天";
			}
			m.put("diverStr",diverStr);
		}
		return list;
	}

	public int getMainCount(){
		String baseSql = "select count(1) from app_menstrual_info main";
		Query query = entityManager.createNativeQuery(baseSql);

		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count;
	}

	//得到最后一条数据
	public AppMenstrualInfoEntity getLastEntity(){
		List<AppMenstrualInfoEntity> list = entityManager.createQuery("select en from AppMenstrualInfoEntity en order by en.startTime desc").getResultList();

		if(list.size() > 0)
			return list.get(0);
		return null;
	}

	//得到平均周期
	public int getAvergeCycle(){
		String sql = "select ceil(sum(main.MENS_CYCLE)/count(1)) from app_menstrual_info main";
		List list = entityManager.createNativeQuery(sql).getResultList();
		int cycle = DEF_CYCLE;
		if(list.size() > 0 && list.get(0) != null){
			cycle = Integer.parseInt(list.get(0).toString());
		}
		return cycle;
	}
	public int getDateSpace(Date startData, Date endData) throws Exception{
		int result = 0;

		Calendar calst = Calendar.getInstance();;
		Calendar caled = Calendar.getInstance();

		calst.setTime(startData);
		caled.setTime(endData);

		//设置时间为0时
		calst.set(Calendar.HOUR_OF_DAY, 0);
		calst.set(Calendar.MINUTE, 0);
		calst.set(Calendar.SECOND, 0);
		caled.set(Calendar.HOUR_OF_DAY, 0);
		caled.set(Calendar.MINUTE, 0);
		caled.set(Calendar.SECOND, 0);
		//得到两个日期相差的天数
		int days = ((int)(caled.getTime().getTime()/1000)-(int)(calst.getTime().getTime()/1000))/3600/24;

		if(days >= 0){
			days++;
		}else{
			days--;
		}
		return days;
	}
}