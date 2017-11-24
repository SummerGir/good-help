package eiis.controller.core.memberInfo;

import eiis.core.memberInfo.service.CoreMemberInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("eiis.controller.core.memberInfo.CoreMemberInfoController")
@RequestMapping("/core/memberInfo")
public class CoreMemberInfoController {
    @Autowired
    public CoreMemberInfoService service;

}
