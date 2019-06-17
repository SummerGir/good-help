package eiis.core.menuTree.service;

import eiis.core.menuTree.dao.CoreMenuTreeDao;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

	//得到菜单列表
	public List<Map<String,Object>> getMainInfo()throws Exception{
		String baseSql = "select a.MENU_ID,a.MENU_LEVEL,a.OUTLINE_LEVEL,a.TITLE,a.ICON,a.TYPE,ui.CODE,ui.URL,ui.PARAMETER from core_menu_tree_info a left join core_menu_url_info ui on a.URL_ID=ui.URL_ID where a.IS_SHOW=1 order by substr(a.OUTLINE_LEVEL,1,instr(a.OUTLINE_LEVEL,'.')-1),a.MENU_LEVEL";
		String[] fields = {"menuId", "menuLevel", "outlineLevel", "title", "icon","type","code", "url", "parameter"};

		List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, null, fields, 1, -1);
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
		List<Map<String,Object>> listMenu = new ArrayList<>();
		Map<String,Object> map = new HashMap<>();
		map.put("id","root");
		map.put("text","好管家");
		map.put("outlineLevel","0");
		map.put("iconCls","");
		map.put("state","open");
		List<Map<String,Object>> lc = getMenuTree(list,"0");
		if(lc.size() > 0)
			map.put("children",lc);

		listMenu.add(map);
		return listMenu;
	}
	private List<Map<String,Object>> getMenuTree(List<Map<String,Object>> list,String pl){
		System.out.println("getMenuTree："+pl);
		List<Map<String,Object>> listChildren = new ArrayList<>();
		for(Map<String,Object> m : list){
			boolean isC = false;
			String outlineLevel = m.get("outlineLevel").toString();
			if(outlineLevel.split("\\.").length > 1){
				String parentLevel = m.get("outlineLevel").toString();
				parentLevel = parentLevel.substring(0,parentLevel.length() - 2);
				if(parentLevel.equals(pl)){
					isC = true;
				}
			}else if("0".equals(pl)){
				isC = true;
			}

			if(isC){
				System.out.println("找到子级："+outlineLevel);
				Map<String,Object> map = new HashMap<>();
				map.put("id",m.get("menuId"));
				map.put("text",m.get("title"));
				map.put("outlineLevel",m.get("outlineLevel"));
				map.put("iconCls","");
				List<Map<String,Object>> lc = getMenuTree(list,outlineLevel);
				if(lc.size() > 0){
					map.put("children",lc);
					map.put("state","closed");
				}
				listChildren.add(map);
			}
		}

		return listChildren;
	}
	public CoreMenuTreeInfoEntity findOneByCode(String code){
		List<CoreMenuTreeInfoEntity> list = entityManager.createQuery("select en from CoreMenuTreeInfoEntity en,CoreMenuUrlInfoEntity en2 where en.urlId=en2.urlId and en2.code=:code").setParameter("code",code).getResultList();
		if(list != null && list.size() > 0){
			if(list.size() > 1)
				System.out.println("菜单code："+code+"重复了。");
			return list.get(0);
		}else{
			System.out.println("菜单code："+code+"没有找到。");
			return null;
		}
	}
}