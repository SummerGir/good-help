package eiis.controller.core.menuTree;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import eiis.core.menuTree.service.CoreMenuTreeService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.context.Context;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.*;

@Controller("eiis.controller.core.menuTree.CoreMenuTreeInfoController")
@RequestMapping("/core/menuTree")
public class CoreMenuTreeInfoController {
    @Autowired
    public CoreMenuTreeService mainService;

    //保存当前访问的菜单
    @RequestMapping("setMenuTree")
    @ResponseBody
    public ObjectNode setMenuTree(@RequestParam(defaultValue = "") String menuId){
        CoreMenuTreeInfoEntity entity = mainService.findOne(menuId);
        Context.setMenuTree(entity);
        System.out.println("记录当前访问菜单："+entity.getTitle());
        return GenericController.returnSuccess(null);
    }

    @RequestMapping("getMenuTrees")
    @ResponseBody
    public String getMenuTrees() throws Exception {
        List<Map<String,Object>> list = mainService.getMainInfo(null,null);
        List<Map<String,Object>> list1 = mainService.getMenuTree(list);
        //return JSONObject.fromObject(map).toString();
        return JSONArray.fromObject(list1).toString();
    }

    @RequestMapping("getMainOne")
    @ResponseBody
    public String getMainOne(HttpServletRequest request) throws Exception {
        String mainId = request.getParameter("mainId");
        List<Map<String,Object>> list = mainService.getMainInfo(mainId,null);
        return JSONObject.fromObject(list.get(0)).toString();
    }

    //保存当前访问的菜单
    @RequestMapping("moveTree")
    @ResponseBody
    public ObjectNode moveTree(HttpServletRequest request) throws Exception {
        String treeId = request.getParameter("treeId");
        String type = request.getParameter("type");

        try{
            mainService.moveTree(treeId,Boolean.parseBoolean(type));
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
        }
        return GenericController.returnFaild(null);
    }


    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String parentId = request.getParameter("parentId");
        String mainId = request.getParameter("menuId");
        String title = request.getParameter("title");
        String urlId = request.getParameter("urlId");
        String icon = request.getParameter("icon");
        String isShow = request.getParameter("isShow");

        List<CoreMenuTreeInfoEntity> list = new ArrayList<>();
        CoreMenuTreeInfoEntity entity = new CoreMenuTreeInfoEntity();
        if(StringUtils.isBlank(mainId)){

            //如果是新增，需要调整上级菜单
            CoreMenuTreeInfoEntity entityP = mainService.findOne(parentId);
            entityP.setType(false);
            list.add(entityP);

            entity.setMenuId(UUID.randomUUID().toString());
            entity.setMenuLevel(mainService.getMenuLevelByParLevel(entityP.getOutlineLevel()));
            entity.setOutlineLevel(entityP.getOutlineLevel() + "." + String.valueOf(entity.getMenuLevel()));
            entity.setType(true);
        }else{
            entity = mainService.findOne(mainId);
        }
        entity.setTitle(title);
        entity.setUrlId(urlId);

        entity.setIcon(icon);
        entity.setIsShow(Boolean.parseBoolean(isShow));
        list.add(entity);

        try{
            mainService.save(list);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
        }
        return GenericController.returnFaild(null);
    }

    @RequestMapping("deleteMain")
    @ResponseBody
    public ObjectNode deleteMain(HttpServletRequest request){
        String mainId = request.getParameter("mainId");
        try{
            mainService.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }
}
