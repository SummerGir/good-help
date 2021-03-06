package eiis.app.meterialbill;

import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.dataManage.StatementGenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.meterialbill.AppMeterialBillService")
public class AppMeterialBillService extends StatementGenericService {


	@Autowired
	protected EntityManager entityManager;

	protected AppMeterialBillService() {}

	//得到列表
	public List<Map<String,Object>> getDetailInfo(String year, String month, int page,int rows) throws Exception{
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(year)){
			values.put("year",year);
		}if(StringUtils.isNotBlank(month)){
			values.put("month",month);
		}

		String baseSql = "select ami.INPUT_ID,ami.INPUT_CODE,sum(amid.MONEY),ami.BILL_MONEY,group_concat(concat(dic.DIC_NAME,'：',amid.DETAIL_NUM,dic.UNIT_NAME) SEPARATOR  ' ; '),if(ami.BILL_MONEY > 0,1,0) isN from app_meterial_input ami left join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID left join app_dic_info dic on amid.DIC_ID=dic.DIC_ID where ami.BILL_MONEY is not null " +
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				" group by ami.INPUT_ID order by isN,ami.YEAR,ami.MONTH,(ami.NUMBER+0),ami.EXCEPTION";

		String[] fields = {"inputId","inputCode", "money","billMoney","dicInfo","isN"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("money".equals(e.getKey().toString())){
						m.put(e.getKey(),"0.00");
					}else{
						m.put(e.getKey(), "");
					}
				}else if("money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}
			}

			if(StringUtils.isNotBlank(m.get("billMoney").toString())){
				double billMoney = Double.parseDouble(m.get("billMoney").toString());
				m.put("billMoney",String.format("%.2f",billMoney));

				double cy = billMoney - Double.parseDouble(m.get("money").toString());
				m.put("cy",String.format("%.2f",billMoney) + "&nbsp;&nbsp;（" + (cy > 0 ? "<span class='cy-d'>多" : "<span class='cy-c'>差") + String.format("%.2f",Math.abs(cy)) + "元</span>）");
			}else{
				m.put("cy","");
			}
		}
		return list;
	}

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

		String baseSql = "select ami.INPUT_ID,ami.INPUT_CODE,sum(amid.MONEY),ami.BILL_MONEY,ami.IS_VALID from app_meterial_input ami left join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"")+
				" group by ami.INPUT_ID order by ami.YEAR,ami.MONTH,(ami.NUMBER+0),ami.EXCEPTION";

		String[] fields = {"inputId","inputCode", "money","billMoney","isValid"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("money".equals(e.getKey().toString())){
						m.put(e.getKey(),"0.00");
					}else{
						m.put(e.getKey(), "");
					}
				}else if("money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}
			}

			if(StringUtils.isNotBlank(m.get("billMoney").toString())){
				double billMoney = Double.parseDouble(m.get("billMoney").toString());
				m.put("billMoney",String.format("%.2f",billMoney));

				double cy = billMoney - Double.parseDouble(m.get("money").toString());
				m.put("cy",String.format("%.2f",billMoney) + "&nbsp;&nbsp;（" + (cy > 0 ? "<span class='cy-d'>多" : "<span class='cy-c'>差") + String.format("%.2f",Math.abs(cy)) + "元</span>）");
			}else{
				m.put("cy","");
			}
		}
		return list;
	}

	public int getMainCount(String searchKey,String beginTime, String endTime, String year, String month, String isValid){
		String baseSql = "select count(1) from app_meterial_input ami where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"");
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

	//得到列表
	public Map<String,Object> getMainMoneyInfo(String searchKey,String beginTime, String endTime, String year, String month, String isValid) throws Exception{

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

		String baseSql = "select ami.IS_VALID,sum(amid.MONEY) from app_meterial_input ami left join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"")+
				" group by ami.IS_VALID order by ami.IS_VALID";

		String[] fields = {"isValid", "money"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, 1, -1);

		double isValid_0 = 0;
		double isValid_1 = 0;
		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("money".equals(e.getKey().toString())){
						m.put(e.getKey(),"0.00");
					}else{
						m.put(e.getKey(), "");
					}
				}
			}
			if("true".equals(m.get("isValid").toString())){
				isValid_1 = Double.parseDouble(m.get("money").toString());
			}else if("false".equals(m.get("isValid").toString())){
				isValid_0 = Double.parseDouble(m.get("money").toString());
			}
		}

		baseSql = "select adi.DIC_NAME,adi.UNIT_NAME,sum(amid.DETAIL_NUM) from app_meterial_input ami join app_meterial_input_detail amid on ami.INPUT_ID=amid.INPUT_ID join app_dic_info adi on amid.DIC_ID=adi.DIC_ID where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"")+
				" group by amid.DIC_ID order by adi.PRIORITY_LEVEL";

		String[] fields2 = {"dicName", "unitName", "detailNum"};

		list = getNativeMapList(entityManager, baseSql, values, fields2, 1, -1);

		String str = "";
		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					if("detailNum".equals(e.getKey().toString())){
						m.put(e.getKey(),"0.00");
					}else{
						m.put(e.getKey(), "");
					}
				}
			}
			str += m.get("dicName").toString() + "：" + m.get("detailNum").toString() + " " + m.get("unitName").toString() + "； ";
		}

		if(StringUtils.isBlank(str)){
			str = "暂无数据！";
		}


		baseSql = "select count(1) from app_meterial_input ami where 1=1 " +
				(StringUtils.isNotBlank(searchKey)?" and locate(:searchKey,ami.INPUT_CODE)>0 ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ami.SYS_TIME >= :beginTime ":"")+
				(StringUtils.isNotBlank(endTime)?" and ami.SYS_TIME <= :endTime ":"")+
				(StringUtils.isNotBlank(year)?" and ami.YEAR = :year":"")+
				(StringUtils.isNotBlank(month)?" and ami.MONTH = :month":"")+
				(StringUtils.isNotBlank(isValid)?" and ami.IS_VALID = :isValid":"");

		String[] fields3 = {"inputNum"};

		list = getNativeMapList(entityManager, baseSql, values, fields3, 1, -1);

		int inputNum = 0;
		if(list.size() > 0 && list.get(0) != null){
			inputNum = Integer.parseInt(list.get(0).get("inputNum").toString());
		}
		Map<String,Object> map = new HashMap<>();
		map.put("isValid_0",String.format("%.2f",isValid_0));
		map.put("isValid_1",String.format("%.2f",isValid_1));
		map.put("allMoney",String.format("%.2f",isValid_0 + isValid_1));
		map.put("inputNum",inputNum);
		map.put("dicInfo",str);
		return map;
	}

	//得到差的总金额
	public String getCMoney(String year, String month) throws Exception{

		List<Map<String, Object>> list = getDetailInfo(year, month,1,-1);

		double c = 0;
		for (Map<String, Object> m : list) {
			if(StringUtils.isNotBlank(m.get("billMoney").toString())){
				double cy = Double.parseDouble(m.get("billMoney").toString()) - Double.parseDouble(m.get("money").toString());
				if(cy < 0){
					c += cy;
				}
			}
		}

		return String.format("%.2f",Math.abs(c));
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
			sb.append("<option value='" + y + "-" + m +"' "+ sel +">" + String.valueOf(y).substring(2) + "年" + (m > 9 ? m : ("0" + m)) +"月</option>");
			c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 1);
			n--;
		}
		return sb;
	}

	public static AppMeterialBillService getInstance() {return ApplicationContext.getCurrent().getBean(AppMeterialBillService.class);}


}