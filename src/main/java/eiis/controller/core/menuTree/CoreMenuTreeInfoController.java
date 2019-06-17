package eiis.controller.core.menuTree;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import eiis.core.menuTree.service.CoreMenuTreeService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.context.Context;
import util.dataManage.GenericController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    //保存当前访问的菜单
    @RequestMapping("getMenuTrees")
    @ResponseBody
    public String getMenuTrees() throws Exception {
        List<Map<String,Object>> list = mainService.getMainInfo();
        List<Map<String,Object>> list1 = mainService.getMenuTree(list);
        //return JSONObject.fromObject(map).toString();
        return JSONArray.fromObject(list1).toString();
    }


    //@RequestMapping("saveMain")
    //@ResponseBody
    //public ObjectNode saveMain(HttpServletRequest request){
    //    String mainId = request.getParameter("urlId");
    //    String urlTitle = request.getParameter("urlTitle");
    //    String urlCode = request.getParameter("urlCode");
    //    String urlStr = request.getParameter("urlStr");
    //    String parameter = request.getParameter("parameter");
    //    CoreMenuTreeInfoEntity entity = new CoreMenuTreeInfoEntity();
    //    if(StringUtils.isBlank(mainId)){
    //        entity.setUrlId(UUID.randomUUID().toString());
    //        entity.setSysTime(new Timestamp(new Date().getTime()));
    //    }else{
    //        entity = mainService.findOne(mainId);
    //    }
    //    entity.setTitle(urlTitle);
    //    entity.setCode(urlCode);
    //    entity.setUrl(urlStr);
    //    entity.setParameter(parameter);
    //
    //    try{
    //        mainService.save(entity);
    //    }catch (Exception e){
    //        e.printStackTrace();
    //        return GenericController.returnFaild(null);
    //    }
    //    return GenericController.returnSuccess(null);
    //}
    //
    //@RequestMapping("deleteMain")
    //@ResponseBody
    //public ObjectNode deleteMain(HttpServletRequest request){
    //    String mainId = request.getParameter("mainId");
    //    try{
    //        mainService.delete(mainId);
    //    }catch (Exception e){
    //        e.printStackTrace();
    //        return GenericController.returnFaild(null);
    //    }
    //    return GenericController.returnSuccess(null);
    //}
}
