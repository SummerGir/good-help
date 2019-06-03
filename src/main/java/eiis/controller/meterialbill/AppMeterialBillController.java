package eiis.controller.meterialbill;

import eiis.app.meterialbill.AppMeterialBillService;
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
}
