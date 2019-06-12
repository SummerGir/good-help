package eiis.controller.statement.realincome;

import eiis.app.statement.realincome.AppStatementRealIncomeService;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/app/statement/realincome")
@Controller("eiis.controller.statement.realincome.AppStatementRealIncomeController")
public class AppStatementRealIncomeController {
    @Autowired
    private AppStatementRealIncomeService service;

    @ResponseBody
    @RequestMapping("/loadTableData")
    public String loadTableData(HttpServletRequest request){
        String cycleType = request.getParameter("cycleType");
        Map<String,Object> map = new HashMap<>();
        try{
            if(StringUtils.isNotBlank(cycleType)){
                map = service.loadTableData(Integer.parseInt(cycleType));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return JSONObject.fromObject(map).toString();
    }
}
