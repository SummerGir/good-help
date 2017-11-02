package eiis.app.type.service;

import eiis.app.type.dao.AppTypeDetailDao;
import eiis.app.type.dao.AppTypeInfoDao;
import eiis.app.type.entity.AppTypeDetailEntity;
import eiis.app.type.entity.AppTypeInfoEntity;
import eiis.app.type.entity.TypeSelectEntity;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.type.service.AppTypeDetailService")
public class AppTypeDetailService extends
		GenericService<AppTypeDetailEntity, String> {

	@Autowired
	protected AppTypeDetailDao dao;
	@Autowired
	protected AppTypeInfoDao mainDao;

	@Autowired
	protected EntityManager entityManager;

	protected AppTypeDetailService() {}

	@Override
	protected GenericDao<AppTypeDetailEntity, String> getDaoInstance() {return dao;}

	public static AppTypeDetailService getInstance() {return ApplicationContext.getCurrent().getBean(AppTypeDetailService.class);}

	@Transactional
	public void save(AppTypeDetailEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<AppTypeDetailEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		dao.delete(mainId);
	}
	//得到菜单列表
	public List<Map<String,Object>> getDetailInfo(String mainId,String searchKey,String memberId,String beginTime,String overTime,int page,int rows)throws Exception{
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
	public int getDetailCount(String mainId,String searchKey,String memberId,String beginTime,String overTime){
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

	//类型选项
	public TypeSelectEntity getTypeSelect(String typeCode, String selectedTypeId) {
		TypeSelectEntity pse=new TypeSelectEntity();
		StringBuffer listOp = new StringBuffer();
		StringBuffer finishedProOp = new StringBuffer();
		StringBuffer doingProOp = new StringBuffer();
		List<Map<String,String>> finishedList = new ArrayList<>(); //已竣工项目部ID及NAME List
		List<Map<String,String>> doingList = new ArrayList<>(); //在建工项目部ID及NAME List

		AppTypeInfoEntity main = mainDao.findByTypeCode(typeCode);
		if(main==null){
			listOp.append("<option value=''>--无此类型--</option>");
			doingProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>无此类型</a></li>");
			finishedProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>无此类型</a></li>");
		}else{
			List<AppTypeDetailEntity> list = dao.findByTypeId(main.getTypeId().toString());
			if(list == null || list.size() < 1){
				listOp.append("<option value=''>--暂无分类--</option>");
				doingProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>暂无分类</a></li>");
				finishedProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>暂无分类</a></li>");
			}else{
				listOp.append("<option value=''>--请选择--</option>");
				int i=0;
				for(AppTypeDetailEntity m:list){
					String selected="";
					String cls="";
					if((StringUtils.isNotBlank(selectedTypeId) && selectedTypeId.equals(m.getTypeDetailId())) || (i==0 && (StringUtils.isBlank(selectedTypeId) || selectedTypeId.equals("00000000-0000-0000-000000000000")) )){
						selected="selected";
						cls="active";
						pse.setSelectedTypeId(m.getTypeDetailId());
						pse.setSelectedTypeName(m.getDetailName());
					}
					listOp.append("<option "+selected+" value='"+m.getTypeDetailId()+"'>"+m.getDetailName()+"</option>");
					if (m.getIsValid()){
						doingProOp.append("<li class='"+cls+"' role='resentation' onclick = \"click_type('").append(m.getTypeDetailId()).append("',this);\" ><a href='javascript:void(0)'>").append(m.getDetailName()).append("</a></li>");
						Map<String,String> doingMap = new HashMap<String,String>();
						doingMap.put("projectId",m.getTypeDetailId());
						doingMap.put("projectName",m.getDetailName());
						doingMap.put("group","有效");
						doingList.add(doingMap);
					} else{
						finishedProOp.append("<li class='"+cls+"' role='presentation' onclick = \"click_type('").append(m.getTypeDetailId()).append("',this);\" ><a href='javascript:void(0)'>").append(m.getDetailName()).append("</a></li>");
						Map<String,String> fishedMap = new HashMap<String,String>();
						fishedMap.put("projectId",m.getTypeDetailId());
						fishedMap.put("projectName",m.getDetailName());
						fishedMap.put("group","失效");
						finishedList.add(fishedMap);
					}
					i++;
				}
			}

		}
		pse.setListOp(listOp);
		pse.setFinishedProOp(finishedProOp);
		pse.setDoingProOp(doingProOp);
		pse.setFinishedList(finishedList);
		pse.setDoingList(doingList);
		return pse;
	}

}