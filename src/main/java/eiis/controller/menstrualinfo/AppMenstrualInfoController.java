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
import java.time.Year;
import java.util.*;

@Controller("eiis.controller.menstrualinfo.AppMenstrualInfoController")
@RequestMapping("/app/menstrualinfo")
public class AppMenstrualInfoController {
    @Autowired
    private AppMenstrualInfoService mainService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        List<Map<String, Object>> list = mainService.getMainInfo(year,month, page, rows);
        int count = mainService.getMainCount();

        AppMenstrualInfoEntity oldEntity = mainService.getLastEntity();
        if(StringUtils.isNotBlank(month) && StringUtils.isNotBlank(year) && oldEntity!=null){
            Calendar actStartCalendar = Calendar.getInstance();
            actStartCalendar.setTime( new Date(oldEntity.getActStartTime().getTime()));
            Calendar paramCalendar = Calendar.getInstance();
            paramCalendar.set(Calendar.YEAR,Integer.parseInt(year));
            paramCalendar.set(Calendar.MONTH,Integer.parseInt(month));
            paramCalendar.set(Calendar.DATE,1);
            List<AppMenstrualInfoEntity> tempEntityList = new ArrayList<>();
            tempEntityList.add(oldEntity);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            if(paramCalendar.after(actStartCalendar)){
                while (paramCalendar.after(actStartCalendar)){
                    actStartCalendar.set(Calendar.DATE,actStartCalendar.get(Calendar.DATE)+oldEntity.getPlanMensCycle());
                    AppMenstrualInfoEntity tempEntity = new AppMenstrualInfoEntity();
                    tempEntity.setPlanStartTime(new Timestamp(actStartCalendar.getTime().getTime()));
                    actStartCalendar.set(Calendar.DATE,actStartCalendar.get(Calendar.DATE)+oldEntity.getPlanMensCycle()-oldEntity.getPlanOveCycle());
                    tempEntity.setPlanOveTime(new Timestamp(actStartCalendar.getTime().getTime()));
                    actStartCalendar.set(Calendar.DATE,actStartCalendar.get(Calendar.DATE)+oldEntity.getPlanOveCycle()-oldEntity.getPlanMensCycle());
                    tempEntityList.add(tempEntity);

                }
                for(int i=0; i<tempEntityList.size();i++){
                    boolean flag = false;
                    Map map = new HashMap();
                    AppMenstrualInfoEntity tempEntity = tempEntityList.get(i);
                    Calendar tempCalendar = Calendar.getInstance();

                    if(tempEntity.getActStartTime() != null){
                        tempCalendar.setTime(new Date(tempEntity.getActStartTime().getTime()));
                        if((tempCalendar.get(Calendar.YEAR) == Integer.parseInt(year)) && (tempCalendar.get(Calendar.MONTH) == Integer.parseInt(month)-1)){
                            map.put("actStartTime",simpleDateFormat.format(tempCalendar.getTime()));
                            flag = true;
                        }
                    }
                    if(tempEntity.getPlanStartTime() != null){
                        tempCalendar.setTime(new Date(tempEntity.getPlanStartTime().getTime()));
                        if((tempCalendar.get(Calendar.YEAR) == Integer.parseInt(year)) && (tempCalendar.get(Calendar.MONTH) == Integer.parseInt(month)-1)){
                            map.put("planStartTime",simpleDateFormat.format(tempCalendar.getTime()));
                            flag = true;
                        }
                    }
                    if(tempEntity.getActOveTime() != null){
                        tempCalendar.setTime(new Date(tempEntity.getActOveTime().getTime()));
                        if((tempCalendar.get(Calendar.YEAR) == Integer.parseInt(year)) && (tempCalendar.get(Calendar.MONTH) == Integer.parseInt(month)-1)){
                            map.put("actOveTime",simpleDateFormat.format(tempCalendar.getTime()));
                            flag = true;
                        }
                    }
                    if(tempEntity.getPlanOveTime() != null){
                        tempCalendar.setTime(new Date(tempEntity.getPlanOveTime().getTime()));
                        if((tempCalendar.get(Calendar.YEAR) == Integer.parseInt(year)) && (tempCalendar.get(Calendar.MONTH) == Integer.parseInt(month)-1)){
                            map.put("planOveTime",simpleDateFormat.format(tempCalendar.getTime()));
                            flag = true;
                        }
                    }

                    if(flag){
                        list.add(map);
                    }
                }
            }
        }

        return GenericController.getTable(list, count, page, rows);
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request) {
        String startTime = request.getParameter("startTime");
        return saveMain(startTime);
    }

    private ObjectNode saveMain(String startTime) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            int diver = 0;
            //如果能够找到上一次的数据，完善上一次的数据
            AppMenstrualInfoEntity oldEntity = mainService.getLastEntity();
            if (oldEntity != null) {
                //结束时间是本次开始时间的前一天
                Calendar c = Calendar.getInstance();
                c.setTime(sdf.parse(startTime));
                c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) - 1);

                //根据结束时间和开始时间计算周期
                int newCycle = mainService.getDateSpace(oldEntity.getActStartTime(), c.getTime());


                //如果超过两次的周期长度，默认为中间有几次没有记录
                int oldCycle = oldEntity.getPlanMensCycle();
                if(newCycle<0){
                    return GenericController.returnFaild("不能选择上一次的经期之前");
                }
                if (newCycle > oldCycle * 2) {
                    newCycle = oldCycle;
                }
                oldEntity.setActMensCycle(newCycle);
                oldEntity.setValid(true);
                mainService.save(oldEntity);
            }

            Calendar c = Calendar.getInstance();
            c.setTime(sdf.parse(startTime));
            AppMenstrualInfoEntity entity = new AppMenstrualInfoEntity();
            entity.setMensId(UUID.randomUUID().toString());
            entity.setActStartTime(new Timestamp(c.getTime().getTime()));
            entity.setPlanMensCycle(mainService.getActMensCycleAvergeCycle());
            entity.setPlanOveCycle(mainService.getActOveCycleAvergeCycle());

            //计算计划排卵日
            c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) + entity.getPlanMensCycle() - entity.getPlanOveCycle());
            entity.setPlanOveTime(new Timestamp(c.getTime().getTime()));
            entity.setSysTime(new Timestamp(new Date().getTime()));
            entity.setValid(false);

            //保存主表信息
            mainService.save(entity);
            return GenericController.returnSuccess(null);
        } catch (Exception e) {
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }

    @RequestMapping("deleteMain")
    @ResponseBody
    public ObjectNode deleteMain(HttpServletRequest request){
        try{
            AppMenstrualInfoEntity oldEntity = mainService.getLastEntity();
            if(oldEntity == null){
                return GenericController.returnFaild("暂无数据");
            }
            mainService.delete(oldEntity.getMensId());
            oldEntity = mainService.getLastEntity();
            if(oldEntity != null){
                oldEntity.setValid(false);
                mainService.save(oldEntity);
            }
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }


    @RequestMapping("setOveTime")
    @ResponseBody
    public ObjectNode setOveTime(HttpServletRequest request){
        String oveTime = request.getParameter("oveTime");
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(simpleDateFormat.parse(oveTime));
            AppMenstrualInfoEntity oldEntity = mainService.getLastEntity();

            if(calendar.getTime().before(new Date(oldEntity.getActStartTime().getTime()))){
                return GenericController.returnFaild("不能设置在经期开始之前！");
            }

            oldEntity.setActOveTime(new Timestamp(calendar.getTime().getTime()));
            int n =  mainService.getDateSpace(new Date(oldEntity.getPlanOveTime().getTime()),calendar.getTime());
            oldEntity.setActOveCycle(oldEntity.getPlanOveCycle() - n +1);
            mainService.save(oldEntity);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            return GenericController.returnFaild(null);
        }
    }

}
