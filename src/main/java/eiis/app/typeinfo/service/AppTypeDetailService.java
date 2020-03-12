package eiis.app.typeinfo.service;

import eiis.app.typeinfo.dao.AppTypeDetailDao;
import eiis.app.typeinfo.dao.AppTypeInfoDao;
import eiis.app.typeinfo.entity.AppTypeDetailEntity;
import eiis.app.typeinfo.entity.AppTypeInfoEntity;
import eiis.app.typeinfo.entity.TypeSelectEntity;
import net.sourceforge.pinyin4j.PinyinHelper;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.Utils;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.*;

@Service("eiis.app.typeinfo.service.AppTypeDetailService")
public class AppTypeDetailService extends
		GenericService<AppTypeDetailEntity, String> {

	@Autowired
	protected AppTypeDetailDao dao;
	@Autowired
	protected AppTypeInfoDao mainDao;
	@Autowired
	protected AppTypeInfoService mainService;

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
	public void delete(String detailId) throws Exception {
		dao.delete(detailId);
	}
	@Transactional
	public void deleteByMainId(String mainId) throws Exception {
		entityManager.createQuery("delete from AppTypeDetailEntity where typeId=:mainId").setParameter("mainId",mainId).executeUpdate();
	}

	@Transactional
	public AppTypeDetailEntity saveOne(String menuCode,String typeName){
		try{
			AppTypeInfoEntity en = mainService.findOneByTypeCode(menuCode);

			AppTypeDetailEntity entity = new AppTypeDetailEntity();
			entity.setTypeDetailId(UUID.randomUUID().toString());
			entity.setTypeId(en.getTypeId());
			entity.setDetailLevel(1);

			entity.setDetailName(typeName);
			entity.setDetailCode(Utils.getPinYins(typeName));
			entity.setDetailValue(entity.getDetailCode());
			entity.setComment("自动新增项");
			entity.setIsValid(true);
			save(entity);

			return entity;
		}catch (Exception e){
			e.printStackTrace();
		}
		return null;
	}
	//得到菜单列表
	public List<Map<String,Object>> getDetailInfo(String mainId,String searchKey,int page,int rows)throws Exception{
		String baseSql = "select det.TYPE_DETAIL_ID,det.DETAIL_NAME,det.DETAIL_CODE,det.DETAIL_VALUE,det.DETAIL_LEVEL,det.`COMMENT`,det.IS_VALID from app_type_detail det where det.TYPE_ID=:mainId ";
		Map<String,Object> values = new HashedMap();
		values.put("mainId",mainId);
		if(StringUtils.isNotBlank(searchKey)){
			values.put("searchKey",searchKey);
			baseSql += " and (locate(:searchKey,det.DETAIL_NAME)>0 or locate(:searchKey,det.DETAIL_CODE)>0 or locate(:searchKey,det.DETAIL_VALUE)>0) ";
		}

		baseSql += " order by det.IS_VALID desc,det.DETAIL_LEVEL ";

		String[] fields = {"typeDetailId","detailName","detailCode","detailValue","detailLevel","comment","isValid"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, page, rows);

		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {

					m.put(e.getKey(), "");
				}else{
					m.put(e.getKey(),e.getValue().toString());
				}
			}
		}
		return list;
	}

	public int getDetailCount(String mainId,String searchKey){
		String baseSql = "select count(1) from app_type_info main join app_type_detail det on main.TYPE_ID=det.TYPE_ID where main.TYPE_ID=:mainId ";
		if(StringUtils.isNotBlank(searchKey)){
			baseSql += " and (locate(:searchKey,det.DETAIL_NAME)>0 or locate(:searchKey,det.DETAIL_CODE)>0 or locate(:searchKey,det.DETAIL_VALUE)>0) ";
		}

		Query query = entityManager.createNativeQuery(baseSql).setParameter("mainId",mainId);
		if(StringUtils.isNotBlank(searchKey)){
			query.setParameter("searchKey",searchKey);
		}

		int count = 0;
		List list = query.getResultList();
		if(list != null && list.size() > 0){
			count = Integer.parseInt(list.get(0).toString());
		}
		return count;
	}

	@Transactional
	public void moveTypeDetail(String typeDetailId,boolean type) throws Exception {
		AppTypeDetailEntity entity = dao.findOne(typeDetailId);
		if(entity == null) {
            return;
        }
		int level = entity.getDetailLevel();

		if(type){
			level--;
		}else{
			level++;
		}

		AppTypeDetailEntity entity2 = findOneByLevel(level);
		if(entity2 == null) {
            return;
        }

		entity2.setDetailLevel(entity.getDetailLevel());
		entity.setDetailLevel(level);

		List<AppTypeDetailEntity> list = new ArrayList<>();
		list.add(entity);
		list.add(entity2);

		save(list);
	}

	public AppTypeDetailEntity findOneByLevel(int level){
		List<AppTypeDetailEntity> list = entityManager.createQuery("select en from AppTypeDetailEntity en where en.detailLevel=:level").setParameter("level",level).getResultList();
		if(list != null && list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}

	//根据上级，得到子级下一个排序数字
	public int getLevelByMainId(String mainId){
		String sql = "select max(a.DETAIL_LEVEL) from app_type_detail a where a.TYPE_ID=:mainId";
		List list = entityManager.createNativeQuery(sql).setParameter("mainId",mainId).getResultList();

		int n = 1;
		if(list != null && list.size() > 0 && list.get(0) != null){
			n = Integer.parseInt(list.get(0).toString()) + 1;
		}
		return n;
	}



	//类型选项
	public TypeSelectEntity getTypeSelect(String typeCode, String selectedTypeId) {
		TypeSelectEntity pse=new TypeSelectEntity();
		StringBuffer listOp = new StringBuffer();
		StringBuffer finishedProOp = new StringBuffer();
		StringBuffer doingProOp = new StringBuffer();
		List<AppTypeDetailEntity> finishedList = new ArrayList<>(); //已竣工项目部ID及NAME List
		List<AppTypeDetailEntity> doingList = new ArrayList<>(); //在建工项目部ID及NAME List

		AppTypeInfoEntity main = mainDao.findByTypeCode(typeCode);
		if(main==null){
			listOp.append("<option value=''>--暂无分类--</option>");
			doingProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>暂无分类</a></li>");
			finishedProOp.append("<li role='resentation' onclick = \"click_type('").append("00000000-0000-0000-000000000000").append("',this);\" ><a href='javascript:void(0)'>暂无分类</a></li>");
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
					listOp.append("<option "+selected+" value='"+m.getTypeDetailId()+"' data-val='"+m.getDetailValue()+"'>"+m.getDetailName()+"</option>");
					if (m.getIsValid()){
						doingProOp.append("<li class='"+cls+"' role='resentation' onclick = \"click_type('").append(m.getTypeDetailId()).append("',this);\" ><a href='javascript:void(0)'>").append(m.getDetailName()).append("</a></li>");
						doingList.add(m);
					} else{
						finishedProOp.append("<li class='"+cls+"' role='presentation' onclick = \"click_type('").append(m.getTypeDetailId()).append("',this);\" ><a href='javascript:void(0)'>").append(m.getDetailName()).append("</a></li>");
						finishedList.add(m);
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