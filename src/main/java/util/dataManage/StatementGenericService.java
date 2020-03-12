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

public class StatementGenericService{
	protected StatementGenericService() { }
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
		if(rows>0) {
            query.setMaxResults(rows);
        }
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();

		if(fieldNames.length > 1){
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
		}else{
			List<Object> list = query.getResultList();
			for(int i = 0 ; i < list.size() ; i++){
				Object row = list.get(i);

				Map<String,Object> map = new HashMap<String, Object>();
				map.put(fieldNames[0],row);
				result.add(map);
			}
		}
		return result;
	}
}
