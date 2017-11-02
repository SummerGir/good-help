package eiis.app.type.service;

import eiis.app.type.dao.AppTypeInfoDao;
import eiis.app.type.entity.AppTypeInfoEntity;
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

@Service("eiis.app.type.service.AppTypeInfoService")
public class AppTypeInfoService extends
		GenericService<AppTypeInfoEntity, String> {

	@Autowired
	protected AppTypeInfoDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppTypeInfoService() {}

	@Override
	protected GenericDao<AppTypeInfoEntity, String> getDaoInstance() {return dao;}

	public static AppTypeInfoService getInstance() {return ApplicationContext.getCurrent().getBean(AppTypeInfoService.class);}

	@Transactional
	public void save(AppTypeInfoEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppTypeInfoEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}
	//得到菜单列表
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,String memberId,String beginTime,String overTime,int page,int rows)throws Exception{
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
		}if(StringUtils.isNotBlank(memberId)){
			values.put("memberId",memberId);
		}if(StringUtils.isNotBlank(beginTime)){
			values.put("beginTime",beginTime);
		}if(StringUtils.isNotBlank(overTime)){
			values.put("overTime",overTime);
		}

		String baseSql = "";
		String[] fields = {};

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
	public int getMainCount(String mainId,String searchKey,String memberId,String beginTime,String overTime){
		String baseSql = "";
		Query query = entityManager.createNativeQuery(baseSql);
		if(StringUtils.isNotBlank(mainId)){
			query.setParameter("mainId",mainId);
		}if(StringUtils.isNotBlank(searchKey)){
			query.setParameter("searchKey",searchKey);
		}if(StringUtils.isNotBlank(memberId)){
			query.setParameter("memberId",memberId);
		}if(StringUtils.isNotBlank(beginTime)){
			query.setParameter("beginTime",beginTime);
		}if(StringUtils.isNotBlank(overTime)){
			query.setParameter("overTime",overTime);
		}
		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count;
	}
}