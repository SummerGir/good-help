package eiis.controller.home;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.home.entity.HomeEntity;
import eiis.app.home.service.HomeService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller("eiis.controller.home.HomeController")
@RequestMapping("/app/home")
public class HomeController {

    @Autowired
    protected HomeService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        List<Map<String, Object>> list = service.getMainInfo(page, rows);

        int count = service.getMainCount();
        return GenericController.getTable(list,count,page, rows);
    }

    @RequestMapping("saveMainInfo")
    @ResponseBody
    public ObjectNode saveMainInfo(HttpServletRequest request)  {
//        List list  = new ArrayList();
//        String jsonDataStr = request.getParameter("jsonDataToServer");
//        JSONArray jsonArray = JSONArray.fromObject(jsonDataStr);
//        for(int i=0;i<jsonArray.size();i++){
//            HomeEntity entity = new HomeEntity();
//            entity.setId(UUID.randomUUID().toString());
//            jsonArray.getJSONObject(i).get("id");
//            entity.setHomeIndex(jsonArray.getJSONObject(i).get("homeIndex").toString());
//            entity.setHomeMax(jsonArray.getJSONObject(i).get("homeMax").toString());
//            list.add(entity);
//        }
//        System.out.println(list);

        try {

            HomeEntity entity = new HomeEntity();
            entity.setId(UUID.randomUUID().toString());
//            entity.setOrder(service.getMainCount()+1);
            entity.setHomeIndex(request.getParameter("homeIndex"));
            entity.setHomeMax(request.getParameter("homeMax"));

            System.out.println(entity);
            service.save(entity);
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }
}
