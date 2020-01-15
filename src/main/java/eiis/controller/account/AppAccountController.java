package eiis.controller.account;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.account.entity.AppAccountInfoEntity;
import eiis.app.account.service.AppAccountInfoService;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.loader.plan.spi.Return;
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
import java.util.concurrent.Callable;

@Controller("eiis.controller.account.AppAccountController")
@RequestMapping("/app/account")
public class AppAccountController {
    @Autowired
    protected AppAccountInfoService service;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws  Exception {
        String accountId = request.getParameter("accountId");
        String memberId = request.getParameter("memberId");
        String searchKey = request.getParameter("searchKey");
        List<Map<String,Object>> list = service.getMainInfo(accountId,memberId,searchKey,page,rows);
        int count = service.getMainCount(accountId,memberId,searchKey);
        return GenericController.getTable(list,count,page, rows);
    }

    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request)throws Exception{
         String accountId = request.getParameter("accountId");
         String accountType= request.getParameter("accountType");
         String accountName= request.getParameter("accountName");
         String accountPassword= request.getParameter("accountPassword");
         String memberId= request.getParameter("memberId");
         String comment= request.getParameter("comment");

        AppAccountInfoEntity entity = new AppAccountInfoEntity();
        if (StringUtils.isBlank(accountId)) {
            entity.setAccountId(UUID.randomUUID().toString());
        } else {
            entity = service.findOne(accountId);
        }
        entity.setAccountName(accountType);
        entity.setAccountName(accountName);
        entity.setAccountPassword(accountPassword);
        entity.setMemberId(memberId);
        entity.setComment(comment);

        try {
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
        String mainId = request.getParameter("accountId");
        try {
            service.delete(mainId);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }

}
