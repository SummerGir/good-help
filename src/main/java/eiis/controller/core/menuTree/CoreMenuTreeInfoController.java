package eiis.controller.core.menuTree;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import eiis.core.menuTree.service.CoreMenuTreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.context.Context;
import util.dataManage.GenericController;

@Controller("eiis.controller.core.menuTree.CoreMenuTreeInfoController")
@RequestMapping("/core/menuTree")
public class CoreMenuTreeInfoController {
    @Autowired
    public CoreMenuTreeService service;

    //保存当前访问的菜单
    @RequestMapping("setMenuTree")
    @ResponseBody
    public ObjectNode setMenuTree(@RequestParam(defaultValue = "") String menuId){
        CoreMenuTreeInfoEntity entity = service.findOne(menuId);
        Context.menuTree = entity;
        System.out.println("记录当前访问菜单："+entity.getTitle());
        return GenericController.returnSuccess(null);
    }
}
