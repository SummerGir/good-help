package util.filter;

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
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

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

        //if (Files.isDirectory(WebPathUtils.getWebAppRealPath(httpServletRequest.getRequestURI()))) {
        //    if (httpServletRequest.getRequestURI().equals("/")) {
        //        httpServletResponse.sendRedirect("/theme/current/index.jsp");
        //    } else {
        //        httpServletResponse.sendRedirect(WebPathUtils.resolveRelativePath(httpServletRequest.getRequestURI(), "index.jsp"));
        //    }
        //    return;
        //}

        //创建当前用户的上下文
        //Context.createContext(
        //        new EIISHttpServletRequest(httpServletRequest),
        //        new EIISHttpServletResponse(httpServletResponse));

        chain.doFilter(httpServletRequest, httpServletResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

}
