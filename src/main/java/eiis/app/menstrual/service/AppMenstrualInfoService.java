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
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,String queryData,int page,int rows)throws Exception{
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
		}if(StringUtils.isNotBlank(queryData)){
			values.put("startTime",queryData + " 00:00:00");
			values.put("endTime",queryData + " 23:59:59");
		}
		String baseSql = "select main.INPUT_ID,main.INPUT_CODE,main.YEAR,main.MONTH,main.NUMBER,main.EXCEPTION,main.IS_VALID,main.SYS_TIME,main.`COMMENT`,group_concat(concat(dic.DIC_NAME,'：',det.DETAIL_NUM,dic.UNIT_NAME) SEPARATOR  ' ; '),sum(det.MONEY) from app_meterial_input main left join app_meterial_input_detail det on main.INPUT_ID=det.INPUT_ID left join app_dic_info dic on det.DIC_ID=dic.DIC_ID where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" main.INPUT_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,main.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(queryData)?" and main.SYS_TIME>=:startTime and main.SYS_TIME<=:endTime ":"")+
				" group by main.INPUT_ID order by main.SYS_TIME desc";
		String[] fields = {"inputId", "inputCode","year","month","number","exception", "isValid", "sysTime", "comment","dicName","money"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("money".equals(e.getKey().toString())){
						m.put(e.getKey(), "0.00");
					}else{
						m.put(e.getKey(), "");
					}
				}else if("sysTime".equals(e.getKey().toString())){
					m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
				}else if("money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}else if("isValid".equals(e.getKey().toString())){
					m.put(e.getKey(),"true".equals(e.getValue().toString()) ? "已对账" : "未对账");
				}else if("dicName".equals(e.getKey().toString())){
					List<String> dicNames = new ArrayList<>();
					for(String s : e.getValue().toString().split("[,;]")){
						if(!dicNames.contains(s)){
							dicNames.add(s);
						}
					}

					m.put(e.getKey(),StringUtils.join(dicNames,";"));
				}
			}
		}
		return list;
	}

	public int getMainCount(String mainId,String searchKey,String queryData){
		String baseSql = "select count(1) from app_meterial_input main where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" and main.INPUT_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,main.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(queryData)?" and main.SYS_TIME>=:startTime and main.SYS_TIME<=:endTime ":"");
		Query query = entityManager.createNativeQuery(baseSql);
		if(StringUtils.isNotBlank(mainId)){
			query.setParameter("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			query.setParameter("searchKey",searchKey);
		}if(StringUtils.isNotBlank(queryData)){
			query.setParameter("startTime",queryData + " 00:00:00");
			query.setParameter("endTime",queryData + " 23:59:59");
		}
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