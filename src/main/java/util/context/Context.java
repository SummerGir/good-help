package util.context;

import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import eiis.core.menuTree.service.CoreMenuTreeService;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class Context {
    private static HttpServletRequest request;
    private static HttpServletResponse response;

    private Context(HttpServletRequest request,HttpServletResponse response){
        this.request = request;
        this.response = response;
    }

    public static Context createContext(HttpServletRequest request,HttpServletResponse response){
        return new Context(request,response);
    }

    //-------------------成员相关------------------------------
    private static CoreMemberInfoEntity member = null;//当前登录用户
    private static String MEMBER_SESSION_KEY = "member";
    public static CoreMemberInfoEntity getMember(){
//        if(member == null)
//            member = (CoreMemberInfoEntity) getSession(MEMBER_SESSION_KEY);
        return member;
    }
    public static void setMember(CoreMemberInfoEntity mem){
        member = mem;
//        setSession(MEMBER_SESSION_KEY,member);
    }


    //-------------------菜单相关------------------------------

    private static CoreMenuTreeInfoEntity app = null;//当前访问页面
    private static String APP_SESSION_KEY = "app";
    public static CoreMenuTreeInfoEntity getMenuTree(String code){
//        if(app == null){
//            app = (CoreMenuTreeInfoEntity) getSession(APP_SESSION_KEY);
//        }
        if(app == null){
            app = CoreMenuTreeService.getInstance().findOneByCode(code);
        }if(app == null){
            CoreMenuTreeInfoEntity entity = new CoreMenuTreeInfoEntity();
            entity.setTitle("");
            entity.setMenuId("");
            entity.setIcon("");
            entity.setUrlId("");
            return entity;
        }else{
//            setSession(APP_SESSION_KEY,app);
        }
        return app;
    }
    public static void setMenuTree(CoreMenuTreeInfoEntity entity){
        app = entity;
    }

    //-------------------session相关------------------------------

    public static Object getSession(String key) {
        if(request != null){
            return request.getSession().getAttribute(key);
        }
        return null;
    }
    public static void setSession(String key,Object o){
        if(request != null){
            request.getSession().setAttribute(key,o);
        }
    }
}
