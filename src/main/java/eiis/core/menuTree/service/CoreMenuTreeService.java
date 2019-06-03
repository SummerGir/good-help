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