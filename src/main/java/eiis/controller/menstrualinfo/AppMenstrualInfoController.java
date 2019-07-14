package eiis.controller.menstrualinfo;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.dicinfo.service.AppDicInfoService;
import eiis.app.menstrual.entity.AppMenstrualInfoEntity;
import eiis.app.menstrual.service.AppMenstrualInfoService;
import eiis.app.meterialinput.entity.AppMeterialInputDetailEntity;
import eiis.app.meterialinput.entity.AppMeterialInputEntity;
import eiis.app.meterialinput.service.AppMeterialInputDetailService;
import eiis.app.meterialinput.service.AppMeterialInputService;
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
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller("eiis.controller.menstrualinfo.AppMenstrualInfoController")
@RequestMapping("/app/menstrualinfo")
public class AppMenstrualInfoController {
    @Autowired
    private AppMenstrualInfoService mainService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        List<Map<String,Object>> list =  mainService.getMainInfo(page,rows);
        int count = mainService.getMainCount();

        return GenericController.getTable(list,count,page,rows);
    }

    @RequestMapping("saveMainWX")
    @ResponseBody
    public ObjectNode saveMainWX(HttpServletRequest request){
        JSONObject result = GenericController.getWXParams(request);
        String startTime = "";
        if(result != null && result.get("startTime") != null){
            startTime = result.getString("startTime");
        }
        return saveMain(startTime);
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String startTime = request.getParameter("startTime");
        return saveMain(startTime);
    }

    private ObjectNode saveMain(String startTime){
        try{
            Map<String,String> map = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            int diver = 0;
            //如果能够找到上一次的数据，完善上一次的数据
            AppMenstrualInfoEntity oldEntity = mainService.getLastEntity();
            if(StringUtils.isNotBlank(startTime)){
                if(oldEntity != null){
                    //结束时间是本次开始时间的前一天
                    Calendar c = Calendar.getInstance();
                    c.setTime(sdf.parse(startTime));
                    c.set(Calendar.DAY_OF_MONTH,c.get(Calendar.DAY_OF_MONTH) - 1);

                    oldEntity.setEndTime(new Timestamp(c.getTime().getTime()));
                    int oldCycle = oldEntity.getMensCycle();
                    //根据结束时间和开始时间计算周期
                    int newCycle = mainService.getDateSpace(oldEntity.getStartTime(),oldEntity.getEndTime());

                    //如果超过两次的周期长度，默认为中间有几次没有记录
                    if(newCycle > AppMenstrualInfoService.DEF_CYCLE * 2){
                        newCycle = AppMenstrualInfoService.DEF_CYCLE;
                    }
                    diver = newCycle - oldCycle;
                    oldEntity.setMensCycle(newCycle);
//                    oldEntity.setMensDiver(diver);
                    oldEntity.setIsValid(true);

                    mainService.save(oldEntity);
                }

                Calendar c = Calendar.getInstance();
                c.setTime(sdf.parse(startTime));

                AppMenstrualInfoEntity entity = new AppMenstrualInfoEntity();
                entity.setMensId(UUID.randomUUID().toString());
                entity.setStartTime(new Timestamp(c.getTime().getTime()));
                entity.setMensCycle(mainService.getAvergeCycle());
                c.set(Calendar.DAY_OF_MONTH,c.get(Calendar.DAY_OF_MONTH) + (entity.getMensCycle() - 1));
                entity.setEndTime(new Timestamp(c.getTime().getTime()));
                entity.setSysTime(new Timestamp(new Date().getTime()));
                entity.setDuration(AppMenstrualInfoService.DEF_DURATION);
                entity.setMensDiver(diver);
                entity.setIsValid(false);

                //保存主表信息
                mainService.save(entity);

                map.put("mensId",entity.getMensId().toString());
                map.put("startTime",entity.getStartTime().toString().split(" ")[0]);
                map.put("mensCycle",String.valueOf(entity.getMensCycle()));
                map.put("duration",String.valueOf(entity.getDuration()));
                map.put("mensDiver",String.valueOf(entity.getMensDiver()));
                return GenericController.returnSuccess(JSONObject.fromObject(map).toString());
            }
            if(oldEntity != null){
                map.put("mensId",oldEntity.getMensId().toString());
                map.put("startTime",oldEntity.getStartTime().toString().split(" ")[0]);
                map.put("mensCycle",String.valueOf(oldEntity.getMensCycle()));
                map.put("duration",String.valueOf(oldEntity.getDuration()));
                map.put("mensDiver",String.valueOf(oldEntity.getMensDiver()));
            }else{
                map = null;
            }

            return GenericController.returnSuccess(JSONObject.fromObject(map).toString());
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
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
