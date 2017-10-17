package eiis.controller.note;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.note.service.AppNoteInfoService;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by xsb on 2017/06/23 14:33.
 */
@Controller("eiis.controller.app.note.AppNoteInfoController")
@RequestMapping("/app/note/info")
public class AppNoteInfoController {
    @Autowired
    protected AppNoteInfoService mainService;

    //得到甘特图
    @RequestMapping("getDetailInfo")
    @ResponseBody
    public String getDetailInfo(HttpServletRequest request) throws Exception {
        String mainId = request.getParameter("mainId");
        String openLevel = request.getParameter("openLevel");
        if(StringUtils.isBlank(openLevel))
            openLevel = "1";
        //Map<String,Object> map = detService.getDetailInfo(mainId,Integer.parseInt(openLevel));
        Map<String,Object> map = null;
        JSONObject jsonObject = JSONObject.fromObject(map);
        return jsonObject.toString();
    }

    public ObjectNode returnSuccess(String msg) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode re = mapper.createObjectNode();
        if(StringUtils.isBlank(msg)){
            msg="操作成功！";
        }
        re.put("error", 0);
        re.put("msg", msg);
        return re;
    }

    public ObjectNode returnFaild(String msg) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode re = mapper.createObjectNode();
        if(StringUtils.isBlank(msg)){
            msg="操作失败！";
        }
        re.put("error", 1);
        re.put("msg", msg);
        return re;
    }

}
