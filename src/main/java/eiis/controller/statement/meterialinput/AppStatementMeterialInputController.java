package eiis.controller.statement.meterialinput;

import eiis.app.statement.meterialinput.service.AppStatementMeterialInputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller("eiis.controller.statement.meterialinput.AppStatementMeterialInputController")
@RequestMapping("/statement/meterialInput")
public class AppStatementMeterialInputController {
    @Autowired
    protected AppStatementMeterialInputService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {

        String inputCode = request.getParameter("inputCode");
        String beginTime = request.getParameter("beginTime");
        String endTime = request.getParameter("endTime");
        String month = request.getParameter("month");

        List<Map<String, Object>> list = service.getMainInfo(inputCode,beginTime,endTime,month,page, rows);

        int count = service.getMainCount(inputCode,beginTime,endTime,month,page, rows);
        return GenericController.getTable(list,count,page, rows);
    }
}
