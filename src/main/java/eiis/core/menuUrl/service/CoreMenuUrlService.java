package eiis.core.menuUrl.service;

import eiis.core.menuUrl.dao.CoreMenuUrlDao;
import eiis.core.menuUrl.entity.CoreMenuUrlInfoEntity;
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

@Service("eiis.core.menuUrl.service.CoreMenuUrlService")
public class CoreMenuUrlService extends
		GenericService<CoreMenuUrlInfoEntity, String> {

	@Autowired
	protected CoreMenuUrlDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected CoreMenuUrlService() {}
	@Override
	protected GenericDao<CoreMenuUrlInfoEntity, String> getDaoInstance() {
		return dao;
	}
	public static CoreMenuUrlService getInstance() {
		return ApplicationContext.getCurrent().getBean(CoreMenuUrlService.class);
	}

	@Transactional
	public void save(CoreMenuUrlInfoEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<CoreMenuUrlInfoEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}

	//得到菜单列表
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,int page,int rows)throws Exception{
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
		}
		String baseSql = "select cmui.URL_ID,cmui.TITLE,cmui.CODE,cmui.URL,cmui.PARAMETER,cmui.SYS_TIME from core_menu_url_info cmui where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" and cmui.URL_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,cmui.TITLE)>0 or locate(:searchKey,cmui.CODE)>0) ":"")+
				" order by cmui.SYS_TIME desc";
		String[] fields = {"urlId", "urlTitle", "urlCode", "urlStr", "parameter","sysTime"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}
				if("sysTime".equals(e.getKey().toString())){
					m.put(e.getKey(),e.getValue().toString().split(" ")[0]);
				}
			}
		}
		return list;
	}

	public int getMainCount(String mainId,String searchKey){
		String baseSql = "select count(1) from core_menu_url_info cmui where 1=1 " +
				(StringUtils.isNotBlank(mainId)?" and cmui.URL_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,cmui.TITLE)>0 or locate(:searchKey,cmui.CODE)>0) ":"");
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

	public StringBuffer getMenuUrlOptions(Boolean isHave){
		Calendar c = Calendar.getInstance();
		int n = 5;
		StringBuffer sb = new StringBuffer();
		if(isHave){
			sb.append("<option value='' style='display:none'>-空菜单-</option>");
		}

		try{
			List<Map<String,Object>> list = getMainInfo(null,null,1,-1);
			for(Map<String,Object> m : list){
				sb.append("<option value='"+ m.get("urlId").toString() +"'>"+ m.get("urlTitle").toString() +"</option>");
			}
		}catch (Exception e){
			e.printStackTrace();
		}

		return sb;
	}
}