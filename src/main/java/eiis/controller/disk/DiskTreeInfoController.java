package eiis.controller.disk;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.disk.entity.DiskTreeInfoEntity;
import eiis.app.disk.service.DiskFileInfoService;
import eiis.app.disk.service.DiskTreeInfoService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.NoUniqueBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;
import util.dataManage.GenericDao;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller("eiis.controller.disk.DiskTreeInfoController")
@RequestMapping("/app/disk")
public class DiskTreeInfoController {
    @Autowired
    protected DiskTreeInfoService service;


    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request){
        try {
            String parentId = request.getParameter("parentId");
            List<Map<String,Object>> list = service.getMainInfo(parentId);
            return JSONArray.fromObject(list).toString();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping("editMainInfo")
    @ResponseBody
    public ObjectNode editMainInfo(HttpServletRequest request){
        String treeId = request.getParameter("treeId");
        String text = request.getParameter("text");
        DiskTreeInfoEntity entity = service.findOne(treeId);
        entity.setTreeName(text);
        try {
            service.save(entity);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            return GenericController.returnFaild(null);
        }

    }

    @RequestMapping("saveMainInfo")
    @ResponseBody
    public ObjectNode saveMainInfo(HttpServletRequest request){
        DiskTreeInfoEntity newEntity = new DiskTreeInfoEntity();
        String treeId = request.getParameter("treeId");
        String text = request.getParameter("text");
        DiskTreeInfoEntity fatherEntity = service.findOne(treeId);
        newEntity.setTreeId(UUID.randomUUID().toString());
        newEntity.setParentId(treeId);
        newEntity.setTreeName(text);
        try {
            newEntity.setTreeLeft(fatherEntity.getTreeRight());
            newEntity.setTreeRight(newEntity.getTreeLeft()+1);
            service.save(newEntity);
            service.saveMainInfo(fatherEntity,newEntity);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }

    @RequestMapping("deleteMainInfo")
    @ResponseBody
    public ObjectNode deleteMainInfo(HttpServletRequest request){
        String treeId = request.getParameter("treeId");
        try {
            DiskTreeInfoEntity deleteEntity = service.findOne(treeId);
            service.deleteMainInfo(deleteEntity);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }


    @RequestMapping("move")
    @ResponseBody
    public ObjectNode move(HttpServletRequest request){
        boolean moveOn = Boolean.parseBoolean(request.getParameter("moveOn"));
        String treeId = request.getParameter("treeId");
        try {
            DiskTreeInfoEntity moveEntity = service.findOne(treeId);
            service.moveMainInfo(moveEntity,moveOn);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }


}
