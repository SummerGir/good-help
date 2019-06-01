package eiis.app.meterialinput.service;

import eiis.app.meterialinput.dao.AppMeterialInputDao;
import eiis.app.meterialinput.entity.AppMeterialInputEntity;
import eiis.app.note.dao.AppNoteInfoDao;
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
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Service("eiis.app.meterialinput.service.AppMeterialInputService")
public class AppMeterialInputService extends
		GenericService<AppMeterialInputEntity, String> {

	@Autowired
	protected AppMeterialInputDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppMeterialInputService() {}

	@Override
	protected GenericDao<AppMeterialInputEntity, String> getDaoInstance() {return dao;}

	public static AppMeterialInputService getInstance() {return ApplicationContext.getCurrent().getBean(AppMeterialInputService.class);}

	@Transactional
	public void save(AppMeterialInputEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppMeterialInputEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}
	//得到列表
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,int page,int rows)throws Exception{
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
		}
		String baseSql = "select main.INPUT_ID,main.INPUT_CODE,main.IS_VALID,main.SYS_TIME,main.`COMMENT`,group_concat(dic.DIC_NAME),sum(det.MONEY) from app_meterial_input main join app_meterial_input_detail det on main.INPUT_ID=det.INPUT_ID join app_dic_info dic on det.DIC_ID=dic.DIC_ID where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" main.INPUT_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,main.INPUT_CODE)>0 ":"")+
				" group by main.INPUT_ID order by main.SYS_TIME desc";
		String[] fields = {"inputId", "inputCode", "isValid", "sysTime", "comment","dicName","money"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}else if("sysTime".equals(e.getKey().toString())){
					m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
				}else if("money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}else if("isValid".equals(e.getKey().toString())){
					m.put(e.getKey(),"true".equals(e.getValue().toString()) ? "已对账" : "未对账");
				}
			}
		}
		return list;
	}

	public int getMainCount(String mainId,String searchKey){
		String baseSql = "select count(1) from app_meterial_input main where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" and ani.INPUT_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ani.INPUT_CODE)>0 ":"");
		Query query = entityManager.createNativeQuery(baseSql);
		if(StringUtils.isNotBlank(mainId)){
			query.setParameter("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			query.setParameter("searchKey",searchKey);
		}
		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count;
	}

	public static StringBuffer getYearOption(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 5;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:\'none\''>-请选择年份-</option>");
		}
		while (n > 0){
			sb.append("<option value='"+ c.get(Calendar.YEAR) +"'>"+ c.get(Calendar.YEAR) +"年</option>");
			c.set(Calendar.YEAR,c.get(Calendar.YEAR) - 1);
			n--;
		}
		return sb;
	}
	public static StringBuffer getMonthOption(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 12;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:\'none\''>-请选择月份-</option>");
		}
		while (n > 0){
			int m = c.get(Calendar.MONTH) + 1 ;
			sb.append("<option value='"+ m +"'>"+ (m > 9 ? m : ("0" + m)) +"月</option>");
			c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 1);
			n--;
		}
		return sb;
	}

	public static StringBuffer getExcOption(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 12;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:\'none\''>-请选择例外-</option>");
		}

		String[] z = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
		for(String s : z){
			sb.append("<option value='"+ s +"'>"+ s +"</option>");
		}
		return sb;
	}
}