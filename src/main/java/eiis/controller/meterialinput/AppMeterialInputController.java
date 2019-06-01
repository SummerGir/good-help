package eiis.controller.meterialinput;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.meterialinput.service.AppMeterialInputService;
import eiis.app.note.entity.AppNoteInfoEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller("eiis.controller.meterialinput.AppMeterialInputController")
@RequestMapping("/app/meterialinput")
public class AppMeterialInputController {
    @Autowired
    protected AppMeterialInputService mainService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");

        List<Map<String,Object>> list =  mainService.getMainInfo(mainId,searchKey,page,rows);
        int count = mainService.getMainCount(mainId,searchKey);

        return GenericController.getTable(list,count,page,rows);
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String mainId = request.getParameter("noteId");
        String typeDetailId = request.getParameter("typeDetailId");
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String memberId = "张三";
        AppNoteInfoEntity entity = new AppNoteInfoEntity();
        if(StringUtils.isBlank(mainId)){
            entity.setNoteId(UUID.randomUUID().toString());
            entity.setTypeDetailId(typeDetailId);
        }else{
//            entity = mainService.findOne(mainId);
        }
        entity.setTitle(title);
        entity.setContent(content);
        entity.setSysTime(new Timestamp(new Date().getTime()));
        entity.setMemberId(memberId);

        try{
//            mainService.save(entity);
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
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }
}
