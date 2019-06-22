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
import java.util.*;

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

	//检查code是否存在
	public boolean checkInputCode(String mainId,String inputCode){
		String baseSql = "select count(1) from app_meterial_input main where main.INPUT_CODE=:inputCode " +
				(StringUtils.isNotBlank(mainId)?" and main.INPUT_ID<>:mainId ":"");
		Query query = entityManager.createNativeQuery(baseSql).setParameter("inputCode",inputCode);
		if(StringUtils.isNotBlank(mainId)){
			query.setParameter("mainId",mainId);
		}
		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count > 0;
	}

	public static StringBuffer getYearOption(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 5;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:none'>-请选择年份-</option>");
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
			sb.append("<option value='' style='display:none'>-请选择月份-</option>");
		}
        int m = c.get(Calendar.MONTH) + 1 ;
        for (int i = 1; i <= n; i++) {
            String sel = "";
            if(m == i){
                sel = "selected='selected'";
            }
            sb.append("<option value='"+ i +"' "+ sel +">"+ (i > 9 ? i : ("0" + i)) +"月</option>");
        }
		return sb;
	}

	public static StringBuffer getExcOption(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 12;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:none'>-请选择字母-</option>");
		}

		String[] z = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
		for(String s : z){
			sb.append("<option value='"+ s +"'>"+ s +"</option>");
		}
		return sb;
	}
}