package eiis.controller.dicinfo;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.cost.entity.AppDailyCostInfoEntity;
import eiis.app.dicinfo.entity.AppDicInfoEntity;
import eiis.app.dicinfo.service.AppDicInfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller("eiis.controller.dicinfo.AppDicInfoController")
@RequestMapping("/app/dicinfo")
public class AppDicInfoController {
    @Autowired
    protected AppDicInfoService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {


        List<Map<String, Object>> list = service.getMainInfo(page, rows);

        int count = service.getMainCount();
        return GenericController.getTable(list,count,page, rows);
    }
    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request)throws Exception{


        String dicId = request.getParameter("dicId");
        String dicName = request.getParameter("dicName");
        String unitName = request.getParameter("unitName");
        String price = request.getParameter("price");
        String priorityLevel = request.getParameter("priorityLevel");
        String sysTime = request.getParameter("sysTime");
        String comment = request.getParameter("comment");

        AppDicInfoEntity entity = new AppDicInfoEntity();
        if (StringUtils.isBlank(dicId)) {
            entity.setDicId(UUID.randomUUID().toString());
        }else {
            entity = service.findOne(dicId);
        }
        entity.setDicName(dicName);
        entity.setDicCode("");
        entity.setUnitName(unitName);
        entity.setPrice(new BigDecimal(price));
        entity.setPriorityLevel(Integer.parseInt(priorityLevel));
        entity.setSysTime(new Timestamp(new Date().getTime()));
        entity.setComment(comment);
        try {
           service.save(entity);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

    @RequestMapping("deleteMain")
    @ResponseBody
    public ObjectNode deleteMain(HttpServletRequest request){

        String mainId = request.getParameter("dicId");
        try {
           service.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }


}
