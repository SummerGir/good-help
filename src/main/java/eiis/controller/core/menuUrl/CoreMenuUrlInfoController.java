package eiis.controller.core.menuUrl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import eiis.core.menuTree.service.CoreMenuTreeService;
import eiis.core.menuUrl.service.CoreMenuUrlService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import util.context.Context;
import util.dataManage.GenericController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller("eiis.controller.core.menuUrl.CoreMenuUrlInfoController")
@RequestMapping("/core/menuUrl")
public class CoreMenuUrlInfoController {
    @Autowired
    public CoreMenuUrlService mainService;

    @RequestMapping("getMainInfo")
    @ResponseBody
    public String getMainInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        String mainId = request.getParameter("mainId");
        String searchKey = request.getParameter("searchKey");

        List<Map<String,Object>> list =  mainService.getMainInfo(mainId,searchKey,page,rows);
        int count = mainService.getMainCount(mainId,searchKey);

        return GenericController.getTable(list,count,page,rows);
    }

}
