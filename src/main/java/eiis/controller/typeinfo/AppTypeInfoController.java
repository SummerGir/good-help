package eiis.controller.typeinfo;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.typeinfo.entity.AppTypeDetailEntity;
import eiis.app.typeinfo.entity.AppTypeInfoEntity;
import eiis.app.typeinfo.service.AppTypeDetailService;
import eiis.app.typeinfo.service.AppTypeInfoService;
import org.apache.commons.lang3.StringUtils;
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

@Controller("eiis.controller.typeinfo.AppTypeInfoController")
@RequestMapping("/app/typeinfo")
public class AppTypeInfoController {
    @Autowired
    protected AppTypeInfoService mainService;
    @Autowired
    protected AppTypeDetailService detailService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");

        List<Map<String,Object>> list =  mainService.getMainInfo(mainId,searchKey,page,rows);
        int count = mainService.getMainCount(mainId,searchKey);

        return GenericController.getTable(list,count,page,rows);
    }

    @RequestMapping("getDetailInfo")
    @ResponseBody
    public String getDetailInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");

        if(StringUtils.isNotBlank(mainId)){
            List<Map<String,Object>> list =  detailService.getDetailInfo(mainId,searchKey,page,rows);
            int count = detailService.getDetailCount(mainId,searchKey);

            return GenericController.getTable(list,count,page,rows);
        }else{
            return GenericController.getTable(new ArrayList<>(),0,page,rows);
        }
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String mainId = request.getParameter("typeId");
        String typeName = request.getParameter("typeName");
        String typeCode = request.getParameter("typeCode");
        AppTypeInfoEntity entity = new AppTypeInfoEntity();
        if(StringUtils.isBlank(mainId)){
            entity.setTypeId(UUID.randomUUID().toString());
        }else{
            entity = mainService.findOne(mainId);
        }
        entity.setTypeName(typeName);
        entity.setTypeCode(typeCode);
        entity.setSysTime(new Timestamp(new Date().getTime()));
        entity.setMemberId(Context.getMember().getMemberId());

        try{
            mainService.save(entity);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

    @RequestMapping("saveDet")
    @ResponseBody
    public ObjectNode saveDet(HttpServletRequest request){
        String typeDetailId = request.getParameter("typeDetailId");
        String typeId = request.getParameter("typeId");
        String detailName = request.getParameter("detailName");
        String isValid = request.getParameter("isValid");
        AppTypeDetailEntity entity = new AppTypeDetailEntity();
        if(StringUtils.isBlank(typeDetailId)){
            entity.setTypeDetailId(UUID.randomUUID().toString());
            entity.setTypeId(typeId);
            entity.setDetailLevel(detailService.getLevelByMainId(typeId));
        }else{
            entity = detailService.findOne(typeDetailId);
        }
        entity.setDetailName(detailName);
        entity.setDetailCode(request.getParameter("detailCode"));
        entity.setDetailValue(request.getParameter("detailValue"));
        entity.setComment(request.getParameter("comment"));
        entity.setIsValid(Boolean.parseBoolean(isValid));

        try{
            detailService.save(entity);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

    //保存当前访问的菜单
    @RequestMapping("moveTypeDetail")
    @ResponseBody
    public ObjectNode moveTypeDetail(HttpServletRequest request) throws Exception {
        String typeDetailId = request.getParameter("typeDetailId");
        String type = request.getParameter("type");

        try{
            detailService.moveTypeDetail(typeDetailId,Boolean.parseBoolean(type));
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
            detailService.deleteByMainId(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

    @RequestMapping("deleteDet")
    @ResponseBody
    public ObjectNode deleteDet(HttpServletRequest request){
        String typeDetailId = request.getParameter("typeDetailId");
        try{
            detailService.delete(typeDetailId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }
}
