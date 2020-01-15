package eiis.app.typeinfo.service;

import eiis.app.typeinfo.dao.AppTypeInfoDao;
import eiis.app.typeinfo.entity.AppTypeDetailEntity;
import eiis.app.typeinfo.entity.AppTypeInfoEntity;
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

@Service("eiis.app.typeinfo.service.AppTypeInfoService")
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
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,int page,int rows)throws Exception{
		String baseSql = "select main.TYPE_ID,main.TYPE_NAME,main.TYPE_CODE from app_type_info main where 1=1 ";
		Map<String,Object> values = new HashedMap();
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
			baseSql += " and main.TYPE_ID=:mainId ";
		}if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
			baseSql += " and (locate(:searchKey,main.TYPE_NAME)>0 or locate(:searchKey,main.TYPE_CODE)>0) ";
		}

		baseSql += " order by main.SYS_TIME desc ";

		String[] fields = {"typeId","typeName","typeCode"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}
			}
		}
		return list;
	}


	public int getMainCount(String mainId,String searchKey){
		String baseSql = "select count(1) from app_type_info main where 1=1 ";
		if(StringUtils.isNotBlank(mainId)){
			baseSql += " and main.TYPE_ID=:mainId ";
		}if(StringUtils.isNotBlank(searchKey)){
			baseSql += " and (locate(:searchKey,main.TYPE_NAME)>0 or locate(:searchKey,main.TYPE_CODE)>0) ";
		}
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

	public AppTypeInfoEntity findOneByTypeCode(String typeCode){
		List<AppTypeInfoEntity> list = entityManager.createQuery("select en from AppTypeInfoEntity en where en.typeCode=:typeCode").setParameter("typeCode",typeCode).getResultList();
		if(list != null && list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}
}