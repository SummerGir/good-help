package eiis.core.menuTree.service;

import eiis.core.menuTree.dao.CoreMenuTreeDao;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
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
		String baseSql = "select a.MENU_ID,a.MENU_LEVEL,a.OUTLINE_LEVEL,a.TITLE,a.ICON,a.TYPE,ui.CODE,ui.URL,ui.PARAMETER from core_menu_tree_info a left join core_menu_url_info ui on a.URL_ID=ui.URL_ID order by substr(a.OUTLINE_LEVEL,1,instr(a.OUTLINE_LEVEL,'.')-1),a.MENU_LEVEL";
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
}