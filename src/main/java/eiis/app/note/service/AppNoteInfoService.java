package eiis.app.note.service;

import eiis.app.note.dao.AppNoteInfoDao;
import eiis.app.note.entity.AppNoteInfoEntity;
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

@Service("eiis.app.note.service.AppNoteInfoService")
public class AppNoteInfoService   extends
		GenericService<AppNoteInfoEntity, String> {

	@Autowired
	protected AppNoteInfoDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppNoteInfoService() {}

	@Override
	protected GenericDao<AppNoteInfoEntity, String> getDaoInstance() {return dao;}

	public static AppNoteInfoService getInstance() {return ApplicationContext.getCurrent().getBean(AppNoteInfoService.class);}

	@Transactional
	public void save(AppNoteInfoEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppNoteInfoEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}
	//得到菜单列表
	public List<Map<String,Object>> getMainInfo(String mainId,String searchKey,String memberId,String beginTime,String overTime,String typeDetailId,int page,int rows)throws Exception{
		Map<String,Object> values = new HashedMap();
		values.put("typeDetailId",typeDetailId);
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
		String baseSql = "select ani.NOTE_ID,ani.TITLE,ani.CONTENT,ani.SYS_TIME,ani.MEMBER_ID,cmi.MEMBER_NAME from app_note_info ani left join core_member_info cmi on ani.MEMBER_ID=cmi.MEMBER_ID where ani.TYPE_DETAIL_ID=:typeDetailId " +
				(StringUtils.isNotBlank(mainId)?" and ani.NOTE_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,ani.TITLE)>0 or locate(:searchKey,ani.CONTENT)>0) ":"")+
				(StringUtils.isNotBlank(memberId)?" and ani.MEMBER_ID=:memberId ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ani.SYS_TIME>=:beginTime ":"")+
				(StringUtils.isNotBlank(overTime)?" and ani.SYS_TIME<=:overTime ":"")+
				" order by ani.SYS_TIME desc";
		String[] fields = {"noteId", "title", "content", "sysTime", "memberId","memberName"};

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
	public int getMainCount(String mainId,String searchKey,String memberId,String beginTime,String overTime,String typeDetailId){
		String baseSql = "select count(1) from app_note_info ani where ani.TYPE_DETAIL_ID=:typeDetailId " +
				(StringUtils.isNotBlank(mainId)?" and ani.NOTE_ID=:mainId ":"")+
				(StringUtils.isNotBlank(searchKey)?" and (locate(:searchKey,ani.TITLE)>0 or locate(:searchKey,ani.CONTENT)>0) ":"")+
				(StringUtils.isNotBlank(memberId)?" and ani.MEMBER_ID=:memberId ":"")+
				(StringUtils.isNotBlank(beginTime)?" and ani.SYS_TIME>=:beginTime ":"")+
				(StringUtils.isNotBlank(overTime)?" and ani.SYS_TIME<=:overTime ":"");
		Query query = entityManager.createNativeQuery(baseSql).setParameter("typeDetailId",typeDetailId);
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