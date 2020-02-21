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
	public static int DEF_CYCLE = 30;


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
	public List<Map<String,Object>> getMainInfo(String year,String month,int page,int rows)throws Exception{
		String baseSql = "SELECT ami.MENS_ID,ami.PLAN_START_TIME,ami.ACT_START_TIME,ami.PLAN_MENS_CYCLE,ami.ACT_MENS_CYCLE,ami.PLAN_OVE_TIME,ami.ACT_OVE_TIME,ami.PLAN_OVE_CYCLE,ami.ACT_OVE_CYCLE,ami.IS_VALID,ami.SYS_TIME FROM app_menstrual_info ami where 1=1";

		String[] fields = {"mensId", "planStartTime","actStartTime","planMensCycle","actMensCycle","planOveTime","actOveTime","planOveCycle","actOveCycle","isValid","sysTime"};

		Map values = new HashMap();
		if(StringUtils.isNotBlank(year)){
			baseSql += " and year(ami.ACT_START_TIME) = :year";
			values.put("year",year);

			if(StringUtils.isNotBlank(month)){
				baseSql += " and month(ami.ACT_START_TIME) = :month or (year(ifnull(ami.ACT_OVE_TIME,ami.PLAN_OVE_TIME)) = :year  and  month(ifnull(ami.ACT_OVE_TIME,ami.PLAN_OVE_TIME)) = :month)";
				values.put("month",month);
			}
		}

		baseSql += " order by ami.ACT_START_TIME asc";
		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if(e.getValue() == null) {
					if("planMensCycle".equals(e.getKey().toString()) || "planMensCycle".equals(e.getKey().toString()) || "planOveCycle".equals(e.getKey().toString()) || "actOveCycle".equals(e.getKey().toString()) ){
						m.put(e.getKey(), "0");
					}else{
						m.put(e.getKey(), "");
					}
				}else if("planStartTime".equals(e.getKey().toString()) || "actStartTime".equals(e.getKey().toString()) || "planOveTime".equals(e.getKey().toString()) || "actOveTime".equals(e.getKey().toString()) || "sysTime".equals(e.getKey().toString())){
					m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
				}
			}
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
		List<AppMenstrualInfoEntity> list = entityManager.createQuery("select en from AppMenstrualInfoEntity en where en.valid=false ").getResultList();

		if(list.size() == 0){
			 list = entityManager.createQuery("select en from AppMenstrualInfoEntity en order by en.actStartTime desc").getResultList();
		}
		if(list.size() > 0)
			return list.get(0);
		return null;
	}

	//得到实际平均周期
	public int getActMensCycleAvergeCycle(){
		String sql = "select ceil(sum(ifnull(main.ACT_MENS_CYCLE,main.PLAN_MENS_CYCLE))/count(1)) from app_menstrual_info main";
		List list = entityManager.createNativeQuery(sql).getResultList();
		int cycle = 0;
		if(list.size() > 0 && list.get(0) != null){
			cycle = Integer.parseInt(list.get(0).toString());
		}
		if(cycle == 0){
			cycle = DEF_CYCLE;
		}
		return cycle;
	}

	//得到实际平均周期getActOveCycleAvergeCycle
	public int getActOveCycleAvergeCycle(){
		String sql = "select floor(sum(ifnull(main.ACT_OVE_CYCLE,main.PLAN_OVE_CYCLE))/count(1)) from app_menstrual_info main";
		List list = entityManager.createNativeQuery(sql).getResultList();
		int cycle = 0;
		if(list.size() > 0 && list.get(0) != null){
			cycle = Integer.parseInt(list.get(0).toString());
		}
		if(cycle == 0){
			cycle = 14;
		}
		return cycle;
	}



	//返回两个日期的相差天数
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


	public StringBuffer getYearList(){
		String basicSql = "select DISTINCT year(ami.ACT_START_TIME) from app_menstrual_info ami order by ami.ACT_START_TIME desc";
		Query query = entityManager.createNativeQuery(basicSql);
		List<Object> list = query.getResultList();
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<list.size();i++){
			sb.append("<option val='"+list.get(i)+"'>"+list.get(i)+"</option>");
		}
		return sb;
	}
}