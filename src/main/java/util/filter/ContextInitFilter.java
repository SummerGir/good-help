package util.filter;

import eiis.controller.core.memberInfo.CoreMemberInfoController;
import eiis.core.memberInfo.service.CoreMemberInfoService;
import util.context.Context;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;

public class ContextInitFilter implements Filter {

    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain){
        try{
            HttpServletRequest httpServletRequest = (HttpServletRequest) request;
            httpServletRequest.getSession(); //解决部分浏览器偶尔会丢失session的问题所加的代码 tj
            HttpServletResponse httpServletResponse = (HttpServletResponse) response;

            //设置request与response的编码
            httpServletRequest.setCharacterEncoding("utf-8");
            httpServletResponse.setCharacterEncoding("utf-8");
            httpServletResponse.addHeader("Access-Control-Allow-Origin", httpServletRequest.getHeader("Origin"));
            httpServletResponse.addHeader("Access-Control-Allow-Credentials", "true");//开启 Cookie 支持，但 Origin 不能为 *。
            httpServletResponse.addHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

            if(httpServletRequest.getMethod().equalsIgnoreCase("OPTIONS")){
                return;
            }

            Context.createContext(httpServletRequest,(HttpServletResponse) response);
            if(Context.getMember() == null){
                System.out.println("请登录");
                CoreMemberInfoService.getInstance().setMember();
            }

            chain.doFilter(httpServletRequest, httpServletResponse);
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

}
