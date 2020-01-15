package eiis.controller.core.memberInfo;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import eiis.core.memberInfo.service.CoreMemberInfoService;
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
import java.util.UUID;

@Controller("eiis.controller.core.memberInfo.CoreMemberInfoController")
@RequestMapping("/core/memberInfo")
public class CoreMemberInfoController {
    @Autowired
    public CoreMemberInfoService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");

        List<Map<String,Object>> list =  service.getMainInfo(mainId,searchKey,page,rows);
        int count = service.getMainCount(mainId,searchKey);

        return GenericController.getTable(list,count,page,rows);
    }



    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        String memberId = request.getParameter("memberId");
        String memberName = request.getParameter("memberName");
//        String photo = request.getParameter("photo");
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        String isFrozen = request.getParameter("isFrozen");
        CoreMemberInfoEntity entity = new CoreMemberInfoEntity();
        if(StringUtils.isBlank(memberId)){
            entity.setMemberId(UUID.randomUUID().toString());
        }else{
            entity = service.findOne(memberId);
        }
        entity.setMemberName(memberName);
//        entity.setPhoto(photo);
        entity.setAccount(account);
        entity.setPassword(password);
        entity.setIsFrozen(Boolean.parseBoolean(isFrozen));

        try{
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
        String mainId = request.getParameter("memberId");
        try{
            service.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

}
