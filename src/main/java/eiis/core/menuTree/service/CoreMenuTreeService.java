package eiis.core.menuTree.service;

import eiis.core.menuTree.dao.CoreMenuTreeDao;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.core.menuTree.service.CoreMenuTreeService")
public class CoreMenuTreeService  extends
		GenericService<CoreMenuTreeInfoEntity, String> {

	@Autowired
	protected CoreMenuTreeDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected CoreMenuTreeService() {}
	@Override
	protected GenericDao<CoreMenuTreeInfoEntity, String> getDaoInstance() {
		return dao;
	}
	public static CoreMenuTreeService getInstance() {
		return ApplicationContext.getCurrent().getBean(CoreMenuTreeService.class);
	}

	@Transactional
	public void save(CoreMenuTreeInfoEntity entity) throws Exception {
		dao.save(entity);
	}
	@Transactional
	public void save(List<CoreMenuTreeInfoEntity> list) throws Exception {
		dao.save(list);
	}
	@Transactional
	public void delete(String mainId) throws Exception {
		String sql = "delete a from core_menu_tree_info a,core_menu_tree_info b where b.MENU_ID=:mainId and left(a.OUTLINE_LEVEL,length(b.OUTLINE_LEVEL))=b.OUTLINE_LEVEL and length(a.OUTLINE_LEVEL)>=length(b.OUTLINE_LEVEL)";
		entityManager.createNativeQuery(sql).setParameter("mainId",mainId).executeUpdate();
	}

	/**
	 * 移动菜单
	 * @param treeId
	 * @param type：true(上移)、false(下移)
	 */
	@Transactional
	public void moveTree(String treeId,boolean type) throws Exception {
		CoreMenuTreeInfoEntity entity = dao.findOne(treeId);
		if(entity == null) {
            return;
        }
		int menuLevel = entity.getMenuLevel();

		if(type){
			menuLevel--;
		}else{
			menuLevel++;
		}
		String outlineLevel = entity.getOutlineLevel();
		if(outlineLevel.split("\\.").length > 1){
			outlineLevel = outlineLevel.substring(0,outlineLevel.lastIndexOf(".")) + "." + menuLevel;
		}else{
			outlineLevel = String.valueOf(menuLevel);
		}

		CoreMenuTreeInfoEntity entity2 = findOneByOutlineLevel(outlineLevel);
		if(entity2 == null) {
            return;
        }

		moveChildren(entity2.getOutlineLevel(),"temp");
		moveChildren(entity.getOutlineLevel(),entity2.getOutlineLevel());
		moveChildren("temp",entity.getOutlineLevel());

		entity2.setMenuLevel(entity.getMenuLevel());
		entity2.setOutlineLevel(entity.getOutlineLevel());

		entity.setMenuLevel(menuLevel);
		entity.setOutlineLevel(outlineLevel);

		List<CoreMenuTreeInfoEntity> list = new ArrayList<>();
		list.add(entity);
		list.add(entity2);

		save(list);
	}

	private void moveChildren(String oldParen,String newParen){
		String sql = "update core_menu_tree_info a set a.OUTLINE_LEVEL=concat(:newParen,a.MENU_LEVEL) where left(a.OUTLINE_LEVEL,length(:oldParen))=:oldParen and length(a.OUTLINE_LEVEL)>length(:oldParen)";
		entityManager.createNativeQuery(sql).setParameter("oldParen",oldParen + ".").setParameter("newParen",newParen + ".").executeUpdate();
	}

	//得到菜单列表
	public List<Map<String,Object>> getMainInfo(String mainId,String isShow)throws Exception{
		Map<String,Object> values = new HashMap<>();
		String baseSql = "select a.MENU_ID,a.MENU_LEVEL,a.OUTLINE_LEVEL,a.TITLE,a.ICON,a.TYPE,ui.CODE,ui.URL_ID,ui.URL,ui.PARAMETER,a.IS_SHOW from core_menu_tree_info a left join core_menu_url_info ui on a.URL_ID=ui.URL_ID where 1=1";
		if(StringUtils.isNotBlank(mainId)){
			values.put("mainId",mainId);
			baseSql += " and a.MENU_ID=:mainId ";
		}
		if(StringUtils.isNotBlank(isShow)){
			values.put("isShow",isShow);
			baseSql += " and a.IS_SHOW=:isShow ";
		}
		baseSql += " order by substr(a.OUTLINE_LEVEL,1,instr(a.OUTLINE_LEVEL,'.')-1),a.MENU_LEVEL ";
		String[] fields = {"menuId", "menuLevel", "outlineLevel", "title", "icon","type","code","urlId", "url", "parameter","isShow"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, 1, -1);
		for (Map<String, Object> m : list) {
			for (Map.Entry<String, Object> e : m.entrySet()) {
				if (e.getValue() == null) {
					m.put(e.getKey(), "");
				}
			}
		}

		return list;
	}

	public List<Map<String,Object>> getMenuTree(List<Map<String,Object>> list){
		CoreMenuTreeInfoEntity entity = findOne("root");
		List<Map<String,Object>> listMenu = new ArrayList<>();
		Map<String,Object> map = new HashMap<>();
		map.put("id",entity.getMenuId());
		map.put("text",entity.getTitle());
		map.put("outlineLevel",entity.getOutlineLevel());
		map.put("iconCls",entity.getIcon());
		map.put("state","open");
		List<Map<String,Object>> lc = getMenuTree(list,entity.getOutlineLevel());
		if(lc.size() > 0) {
            map.put("children", lc);
        }

		listMenu.add(map);
		return listMenu;
	}

	private List<Map<String,Object>> getMenuTree(List<Map<String,Object>> list,String pl){
		List<Map<String,Object>> listChildren = new ArrayList<>();
		for(Map<String,Object> m : list){
			boolean isC = false;
			String outlineLevel = m.get("outlineLevel").toString();
			if(outlineLevel.split("\\.").length > 1){
				String parentLevel = outlineLevel.substring(0,outlineLevel.lastIndexOf("."));
				if(parentLevel.equals(pl)){
					isC = true;
				}
			}else if("0".equals(pl)){
				isC = true;
			}

			if(isC){
				m.put("id",m.get("menuId"));
				m.put("text",m.get("title"));
				List<Map<String,Object>> lc = getMenuTree(list,outlineLevel);
				if(lc.size() > 0){
					m.put("children",lc);
					m.put("state","closed");
				}
				listChildren.add(m);
			}
		}

		return listChildren;
	}

	public CoreMenuTreeInfoEntity findOneByCode(String code){
		List<CoreMenuTreeInfoEntity> list = entityManager.createQuery("select en from CoreMenuTreeInfoEntity en,CoreMenuUrlInfoEntity en2 where en.urlId=en2.urlId and en2.code=:code").setParameter("code",code).getResultList();
		if(list != null && list.size() > 0){
			if(list.size() > 1) {
                System.out.println("菜单code：" + code + "重复了。");
            }
			return list.get(0);
		}else{
			System.out.println("菜单code："+code+"没有找到。");
			return null;
		}
	}

	public CoreMenuTreeInfoEntity findOneByOutlineLevel(String outlineLevel){
		List<CoreMenuTreeInfoEntity> list = entityManager.createQuery("select en from CoreMenuTreeInfoEntity en where en.outlineLevel=:outlineLevel").setParameter("outlineLevel",outlineLevel).getResultList();
		if(list != null && list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}

	//根据上级，得到子级下一个排序数字
	public int getMenuLevelByParLevel(String outlineLevel){
		String sql = "select max(a.MENU_LEVEL) from core_menu_tree_info a where left(a.OUTLINE_LEVEL,length(:outlineLevel))=:outlineLevel and length(a.OUTLINE_LEVEL)>length(:outlineLevel)";
		List list = entityManager.createNativeQuery(sql).setParameter("outlineLevel",outlineLevel).getResultList();

		int n = 1;
		if(list != null && list.size() > 0 && list.get(0) != null){
			n = Integer.parseInt(list.get(0).toString()) + 1;
		}
		return n;
	}
}