package util.context;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.nio.file.Paths;

public class ContextServletListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        //servletContextEvent.getServletContext().getMajorVersion()
        //System.out.println("ServerInfo: " + servletContextEvent.getServletContext().getServerInfo());
        Context.setServletContext(servletContextEvent.getServletContext());

        String charset = Context.getServletContext().getInitParameter("charset");
        if (StringUtils.isBlank(charset)) {
            charset = "UTF-8";
        }
        Context.setCharset(charset);


//        WebPathUtils.setWebAppRootPath(Paths.get(Context.getServletContext().getRealPath("/")));

        System.out.println("eiis startup ...............");
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }
}
