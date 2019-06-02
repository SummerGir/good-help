package eiis.app.meterialinput.service;

import eiis.app.meterialinput.dao.AppMeterialInputDetailDao;
import eiis.app.meterialinput.entity.AppMeterialInputDetailEntity;
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

@Service("eiis.app.meterialinput.service.AppMeterialInputDetailService")
public class AppMeterialInputDetailService extends
		GenericService<AppMeterialInputDetailEntity, String> {

	@Autowired
	protected AppMeterialInputDetailDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppMeterialInputDetailService() {}

	@Override
	protected GenericDao<AppMeterialInputDetailEntity, String> getDaoInstance() {return dao;}

	public static AppMeterialInputDetailService getInstance() {return ApplicationContext.getCurrent().getBean(AppMeterialInputDetailService.class);}

	@Transactional
	public void save(AppMeterialInputDetailEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppMeterialInputDetailEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		entityManager.createQuery("delete from AppMeterialInputDetailEntity where inputId=:mainId").setParameter("mainId",mainId).executeUpdate();
	}
	//得到列表
	public List<Map<String,Object>> getDetailInfo(String mainId)throws Exception{
		Map<String,Object> values = new HashedMap();
		values.put("mainId",mainId);

		String baseSql = "select det.DIC_ID,det.DETAIL_NUM,det.DETAIL_PRICE,det.MONEY from app_meterial_input_detail det where det.INPUT_ID=:mainId order by det.MONEY desc";
		String[] fields = {"dicId", "detailNum", "detailPrice", "money"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, 1, -1);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}else if("detailNum".equals(e.getKey().toString()) || "detailPrice".equals(e.getKey().toString()) || "money".equals(e.getKey().toString())){
					m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
				}
			}
		}
		return list;
	}
}