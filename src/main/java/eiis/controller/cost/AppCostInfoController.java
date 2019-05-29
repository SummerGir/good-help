package eiis.controller.cost;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.org.apache.regexp.internal.REUtil;
import eiis.app.cost.entity.AppDailyCostInfoEntity;
import eiis.app.cost.service.AppCostInfoService;
import eiis.app.note.entity.AppNoteInfoEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.plugin2.util.SystemUtil;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;

@Controller("eiis.controller.cost.AppCostInfoController")
@RequestMapping("/app/cost")
public class AppCostInfoController {
    @Autowired
    protected AppCostInfoService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {

        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");
        String beginTime = request.getParameter("beginTime");
        String endTime = request.getParameter("endTime");
        String typeDetailId = request.getParameter("typeDetailId");
        if (StringUtils.isBlank(typeDetailId)) {
            return GenericController.getTable(null, 0, page, rows);
        }
        List<Map<String, Object>> list = service.getMainInfo(mainId, searchKey, beginTime, endTime, typeDetailId, page, rows);

        int count = service.getMainCount(mainId, searchKey, beginTime, endTime, typeDetailId);
        return GenericController.getTable(list,count,page, rows);
    }
    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request)throws Exception{

        String costId = request.getParameter("costId");
        String typeDetailId = request.getParameter("typeDetailId");
        String title = request.getParameter("title");
        String payMoney = request.getParameter("price");
        AppDailyCostInfoEntity entity = new AppDailyCostInfoEntity();
        if (StringUtils.isBlank(costId)) {
            entity.setCostId(UUID.randomUUID().toString());
            entity.setTypeDetailId(typeDetailId);
        }else {
            entity = service.findOne(costId);
        }
        entity.setTitle(title);
        entity.setPayMoney(new BigDecimal(payMoney));
        entity.setSysTime(new Timestamp(new Date().getTime()));
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

        String mainId = request.getParameter("mainId");
        try {
           service.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }


}
