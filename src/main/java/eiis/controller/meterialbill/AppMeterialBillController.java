package eiis.controller.meterialbill;

import eiis.app.meterialbill.AppMeterialBillService;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller("eiis.controller.meterialbill.AppMeterialBillController")
@RequestMapping("/app/meterialBill")
public class AppMeterialBillController {
    @Autowired
    protected AppMeterialBillService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        String inputCode = request.getParameter("inputCode");
        String beginTime = request.getParameter("beginTime");
        String endTime = request.getParameter("endTime");
        String time = request.getParameter("month");
        String isValid = request.getParameter("isValid");
        String month = "";
        String year = "";
        if(StringUtils.isNotBlank(time)){
            String[] t = time.split("-");
            if(t.length == 2){
                month = t[1];
                year = t[0];
            }
        }

        List<Map<String, Object>> list = service.getMainInfo(inputCode,beginTime,endTime,year,month,isValid,page, rows);

        int count = service.getMainCount(inputCode,beginTime,endTime,year,month,isValid);
        return GenericController.getTable(list,count,page, rows);
    }

    @RequestMapping("getDetailInfo")
    @ResponseBody
    public String getDetailInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        String time = request.getParameter("month");
        String month = "";
        String year = "";
        if(StringUtils.isNotBlank(time)){
            String[] t = time.split("-");
            if(t.length == 2){
                month = t[1];
                year = t[0];
            }
        }

        List<Map<String, Object>> list = service.getDetailInfo(year,month,1, -1);

        return GenericController.getTable(list,list.size(),page, rows);
    }
    @RequestMapping("getMainMoneyInfo")
    @ResponseBody
    public String getMainMoneyInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        String inputCode = request.getParameter("inputCode");
        String beginTime = request.getParameter("beginTime");
        String endTime = request.getParameter("endTime");
        String time = request.getParameter("month");
        String isValid = request.getParameter("isValid");
        String month = "";
        String year = "";
        if(StringUtils.isNotBlank(time)){
            String[] t = time.split("-");
            if(t.length == 2){
                month = t[1];
                year = t[0];
            }
        }

        Map<String, Object> map = service.getMainMoneyInfo(inputCode,beginTime,endTime,year,month,isValid);

        return JSONObject.fromObject(map).toString();
    }
}
