package eiis.controller.meterialinput;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.meterialinput.entity.AppMeterialInputDetailEntity;
import eiis.app.meterialinput.entity.AppMeterialInputEntity;
import eiis.app.meterialinput.service.AppMeterialInputDetailService;
import eiis.app.meterialinput.service.AppMeterialInputService;
import eiis.app.note.entity.AppNoteInfoEntity;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
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
import java.util.*;

@Controller("eiis.controller.meterialinput.AppMeterialInputController")
@RequestMapping("/app/meterialinput")
public class AppMeterialInputController {
    @Autowired
    protected AppMeterialInputService mainService;
    @Autowired
    protected AppMeterialInputDetailService detailService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");
        String queryData = request.getParameter("queryData");

        List<Map<String,Object>> list =  mainService.getMainInfo(mainId,searchKey,queryData,page,rows);
        int count = mainService.getMainCount(mainId,searchKey,queryData);

        return GenericController.getTable(list,count,page,rows);
    }

    @RequestMapping("getDetailInfo")
    @ResponseBody
    public String getDetailInfo(HttpServletRequest request) throws Exception {
        String mainId = request.getParameter("mainId");

        List<Map<String,Object>> list =  detailService.getDetailInfo(mainId);

        return JSONArray.fromObject(list).toString();
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String postData = request.getParameter("postData");
        if(StringUtils.isBlank(postData))
            return GenericController.returnFaild("没有获取到表单数据");
        try{
            JSONObject jb = JSONObject.fromObject(postData);

            AppMeterialInputEntity entity = new AppMeterialInputEntity();
            JSONObject main = jb.getJSONObject("main");
            String inputId = main.getString("inputId");
            if(StringUtils.isBlank(inputId)){
                entity.setInputId(UUID.randomUUID().toString());
                entity.setSysTime(new Timestamp(new Date().getTime()));
            }else{
                entity = mainService.findOne(inputId);
            }
            entity.setYear(main.getInt("year"));
            entity.setMonth(main.getInt("month"));
            entity.setNumber(main.getString("number"));
            entity.setException(main.getString("exception"));
            entity.setIsValid(false);
//            entity.setComment(main.getString("comment"));
            entity.setInputCode(String.valueOf(entity.getYear()).substring(2) + (entity.getMonth() > 9 ? entity.getMonth() : ("0" + entity.getMonth())) + "-" + entity.getNumber() + (StringUtils.isNotBlank(entity.getException()) ? ("-" + entity.getException()) : ""));

            Boolean isSave = jb.getBoolean("isSave");
            if(isSave){
                List<AppMeterialInputDetailEntity> list = new ArrayList<>();
                JSONArray detail = jb.get("detail") == null ? new JSONArray() : jb.getJSONArray("detail");

                for (int i = 0; i < detail.size(); i++) {
                    JSONObject jd = detail.getJSONObject(i);
                    AppMeterialInputDetailEntity en = new AppMeterialInputDetailEntity();
                    en.setDetailId(UUID.randomUUID().toString());
                    en.setInputId(entity.getInputId());
                    en.setDicId(jd.getString("dicId"));
                    en.setDetailNum(new BigDecimal(jd.getDouble("detailNum")));
                    en.setDetailPrice(new BigDecimal(jd.getDouble("detailPrice")));
                    en.setMoney(new BigDecimal(en.getDetailNum().doubleValue() * en.getDetailPrice().doubleValue()));
                    en.setComment("");
                    list.add(en);
                }
                //删除旧的明细信息
                detailService.delete(entity.getInputId());
                //保存主表信息
                mainService.save(entity);
                //保存全新的明细信息
                if(list.size() > 0){
                    detailService.save(list);
                }
            }else{
                List<Map<String,Object>> list =  mainService.getMainInfo(inputId,entity.getInputCode(),"",1,-1);
                if(list != null && list.size() > 0){
                    return GenericController.returnFaild("编号：" + entity.getInputCode() + "已存在，请检查");
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

    @RequestMapping("saveIsValid")
    @ResponseBody
    public ObjectNode saveIsValid(HttpServletRequest request){
        String mainId = request.getParameter("mainId");
        String isValid = request.getParameter("isValid");
        if(StringUtils.isBlank(mainId))
            return GenericController.returnFaild("没有获取到单据编号");
        try{
            AppMeterialInputEntity entity = mainService.findOne(mainId);
            entity.setIsValid(Boolean.parseBoolean(isValid));
            //保存主表信息
            mainService.save(entity);
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
        try{
            mainService.delete(mainId);
            detailService.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }
}
