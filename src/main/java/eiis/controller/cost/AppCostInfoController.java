package eiis.controller.cost;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.org.apache.regexp.internal.REUtil;
import eiis.app.cost.entity.AppDailyCostInfoEntity;
import eiis.app.cost.service.AppCostInfoService;
import eiis.app.note.entity.AppNoteInfoEntity;
import eiis.app.typeinfo.entity.AppTypeDetailEntity;
import eiis.app.typeinfo.service.AppTypeDetailService;
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
import java.text.SimpleDateFormat;
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
    @Autowired
    protected AppTypeDetailService TypeDetService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");
        String myYear = request.getParameter("myYear");
        String beginTime = request.getParameter("beginTime");
        String endTime = request.getParameter("endTime");
        String typeDetailId = request.getParameter("typeDetailId");
        List<Map<String, Object>> list = service.getMainInfo(mainId, searchKey,myYear, beginTime, endTime, typeDetailId, page, rows);

        int count = service.getMainCount(mainId, searchKey,myYear, beginTime, endTime, typeDetailId);
        return GenericController.getTable(list,count,page, rows);
    }
    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request)throws Exception{
        String menuCode = request.getParameter("menuCode");
        String costId = request.getParameter("costId");
        String typeDetailId = request.getParameter("typeDetailId");
        String typeName = request.getParameter("typeName");
        String title = request.getParameter("title");
        String costNum = request.getParameter("costNum");
        String costPrice = request.getParameter("costPrice");
        String payMoney = request.getParameter("payMoney");
        String addType = request.getParameter("addType");
        String costTime = request.getParameter("costTime");

        AppDailyCostInfoEntity entity = new AppDailyCostInfoEntity();
        if (StringUtils.isBlank(costId)) {
            entity.setCostId(UUID.randomUUID().toString());
        }else {
            entity = service.findOne(costId);
        }
        if(Boolean.parseBoolean(addType)){
            AppTypeDetailEntity en = TypeDetService.saveOne(menuCode,typeName);
            if(en == null){
                return GenericController.returnFaild("新增新类型 "+ typeName +" 失败");
            }
            typeDetailId = en.getTypeDetailId();
        }
        entity.setTypeDetailId(typeDetailId);
        entity.setTitle(title);
        if(StringUtils.isNotBlank(costTime)){
            entity.setCostTime(new Timestamp(new SimpleDateFormat("yyyy-MM-dd").parse(costTime).getTime()));
        }else{
            entity.setCostTime(new Timestamp(new Date().getTime()));
        }
        if(StringUtils.isNotBlank(costNum)) {
            entity.setCostNum(new BigDecimal(costNum));
        }
        if(StringUtils.isNotBlank(costPrice)) {
            entity.setCostPrice(new BigDecimal(costPrice));
        }
        if(StringUtils.isNotBlank(payMoney)) {
            entity.setPayMoney(new BigDecimal(payMoney));
        }
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


    @RequestMapping("getYearList")
    @ResponseBody
    public String getYearList(HttpServletRequest request){
        String typeDetailId =  request.getParameter("typeDetailId");
        try {
            return service.getYearList(typeDetailId).toString();
        }catch (Exception e){
            e.printStackTrace();
            return "";
        }
    }


}
