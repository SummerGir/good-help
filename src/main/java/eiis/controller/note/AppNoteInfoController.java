package eiis.controller.note;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.note.service.AppNoteInfoService;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller("eiis.controller.app.note.AppNoteInfoController")
@RequestMapping("/app/note/info")
public class AppNoteInfoController {
    @Autowired
    protected AppNoteInfoService mainService;

    //得到甘特图
    @RequestMapping("getDetailInfo")
    @ResponseBody
    public String getDetailInfo(HttpServletRequest request, @RequestParam(defaultValue = "1") Integer page, @RequestParam(defaultValue = "10") Integer rows) throws Exception {
        Map<String, Object> table = new HashMap<String, Object>();

        List<Map<String,Object>> list =  new ArrayList<>();

        int count = list.size();
        int total = count / rows;
        if (total == 0) {
            total = 1;
        } else {
            if ((count % rows) != 0) {
                total++;
            }
        }
        table.put("page", page);
        table.put("records", count);
        table.put("total", total);
        table.put("rows", list);
        JSONObject jsonObject = JSONObject.fromObject(table);
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
