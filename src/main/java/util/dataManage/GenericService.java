package util.dataManage;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class GenericService<T, ID extends Serializable> {
	protected GenericService() {
	}
	protected abstract  GenericDao<T, ID> getDaoInstance();
	
	public List<T> findAll() {
		return getDaoInstance().findAll();
	}

	public List<T> findAll(Sort paramSort) {
		return getDaoInstance().findAll(paramSort);
	}

	public List<T> findAll(Iterable<ID> paramIterable) {
		return getDaoInstance().findAll(paramIterable);
	}

	public T getOne(ID paramID) {
		return getDaoInstance().getOne(paramID);
	}

	public long count(Specification<T> paramSpecification) {
		return getDaoInstance().count(paramSpecification);
	}

	public T findOne(ID paramID){
		return getDaoInstance().findOne(paramID);
	}

	public boolean exists(ID paramID){
		return getDaoInstance().exists(paramID);
	}

	public long count(){
		return getDaoInstance().count();
	}
	
	public Page<T> findAll(Pageable paramPageable){
		return getDaoInstance().findAll(paramPageable);
	}
	
	public T findOne(Specification<T> paramSpecification){
		return getDaoInstance().findOne(paramSpecification);
	}

	public List<T> findAll(Specification<T> paramSpecification){
		return getDaoInstance().findAll(paramSpecification);
	}

	public Page<T> findAll(Specification<T> paramSpecification,
			Pageable paramPageable){
		return getDaoInstance().findAll(paramSpecification, paramPageable);
	}

	public List<T> findAll(Specification<T> paramSpecification,
			Sort paramSort){
		return getDaoInstance().findAll(paramSpecification, paramSort);
	}
	
	//public TableJsonData<T> buildJsonData(int records, int page, int rows, List<T> list) {
	//	TableJsonData<T> data = new TableJsonData<T>();
	//	if (page < 0) {
	//		page = 1;
	//	}
	//	int _total = records / rows;
	//	if (_total == 0) {
	//		_total = 1;
	//	} else {
	//		if ((records % rows) != 0) {
	//			_total++;
	//		}
	//	}
	//	data.setPage(page);
	//	data.setRecords(records);
	//	data.setTotal(_total);
	//	data.setRows(list);
	//	return data;
	//}

	public List<Map<String, Object>> getNativeMapList(
			EntityManager entityManager, String sql,
			Map<String, Object> values,String[] fieldNames, int page, int rows) throws Exception {
		Query query = entityManager.createNativeQuery(sql);
		if (values != null) {
			for (Map.Entry<String, Object> entry : values.entrySet()) {
				query.setParameter(entry.getKey(), entry.getValue());
			}
		}
		page = page < 1 ? 1 : page;
		query.setFirstResult((page - 1) * rows);
		if(rows>0)query.setMaxResults(rows);
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		List<Object[]> list = query.getResultList();
		for(int i = 0 ; i < list.size() ; i++){
			Object[] row = list.get(i);
			if( i == 0 && row.length != fieldNames.length){
				throw new IllegalAccessException("结果集列名 与 字段名数组(fieldNames) 长度不一致!");
			}
			Map<String,Object> map = new HashMap<String, Object>();
			for(int v = 0 ; v < row.length ; v++){
				map.put(fieldNames[v],row[v]);
			}
			result.add(map);
		}
		return result;
	}
}
