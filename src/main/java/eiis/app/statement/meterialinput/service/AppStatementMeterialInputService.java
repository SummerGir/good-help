package eiis.app.statement.meterialinput.service;

import eiis.app.meterialinput.dao.AppMeterialInputDao;
import eiis.app.meterialinput.entity.AppMeterialInputEntity;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.dataManage.StatementGenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Service("eiis.app.statement.meterialinput.service.AppStatementMeterialInputService")
public class AppStatementMeterialInputService extends StatementGenericService {


	@Autowired
	protected EntityManager entityManager;

	protected AppStatementMeterialInputService() {}


	//得到列表
	public List<Map<String,Object>> getMainInfo(String searchKey,String beginTime, String endTime, String year, String month, String isValid, int page,int rows) throws Exception{

		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
		}if(StringUtils.isNotBlank(beginTime)){
			beginTime += " 00:00:00";
			values.put("beginTime",beginTime);
		}if(StringUtils.isNotBlank(endTime)){
			endTime += " 23:59:59";
			values.put("endTime",endTime);
		}if(StringUtils.isNotBlank(year)){
			values.put("year",year);
		}if(StringUtils.isNotBlank(month)){
			values.put("month",month);
		}if(StringUtils.isNotBlank(isValid)){
			values.put("isValid",isValid);
		}

		String baseSql = "select ami.INPUT_ID,ami.INPUT_CODE,sum(amid.MONEY),ami.IS_VALID from app_meterial_input ami join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"")+
				" group by ami.INPUT_ID order by ami.INPUT_CODE";

		String[] fields = {"inputId","inputCode", "money","isValid"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}else if("money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}
			}
		}
		return list;
	}

	public int getMainCount(String searchKey,String beginTime, String endTime, String year, String month, String isValid){
		String baseSql = "select count(1) from app_meterial_input ami join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"")+
				" group by ami.INPUT_ID";
		Query query = entityManager.createNativeQuery(baseSql);

		if(StringUtils.isNotBlank(searchKey)){
			query.setParameter("searchKey",searchKey);
		}if(StringUtils.isNotBlank(beginTime)){
			query.setParameter("beginTime",beginTime);
		}if(StringUtils.isNotBlank(beginTime)){
			query.setParameter("endTime",endTime);
		}if(StringUtils.isNotBlank(year)){
			query.setParameter("year",year);
		}if(StringUtils.isNotBlank(month)){
			query.setParameter("month",month);
		}if(StringUtils.isNotBlank(isValid)){
			query.setParameter("isValid",isValid);
		}
		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count;
	}


	public static StringBuffer getYearAndMonthOption(Boolean isHave,Boolean defSel){
		Calendar c = Calendar.getInstance();
		int n = 12 * 3;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:\'none\''>全部</option>");
		}

		while (n > 0){
			String sel = "";
			if(defSel){
				sel = "selected='selected'";
				defSel = Boolean.FALSE;
			}
			int y = c.get(Calendar.YEAR);
			int m = c.get(Calendar.MONTH) + 1 ;
			sb.append("<option value='" + y + "-" + m +"' "+ sel +">" + y + "年" + (m > 9 ? m : ("0" + m)) +"月</option>");
			c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 1);
			n--;
		}
		return sb;
	}

	public static AppStatementMeterialInputService getInstance() {return ApplicationContext.getCurrent().getBean(AppStatementMeterialInputService.class);}


}