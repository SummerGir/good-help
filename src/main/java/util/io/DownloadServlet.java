package util.io;

import javax.servlet.ServletException;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class DownloadServlet extends javax.servlet.http.HttpServlet {

    @Override
    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws IOException, ServletException {
        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode("bb", "utf-8") + "\"");

        response.setContentType("application/octet-stream");
        if (headers != null && !headers.isEmpty()) {
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                response.setHeader(entry.getKey(), entry.getValue());
            }
        }
        //"/file/download/WEB-INF/fileStorage/disk/2020-03/bb.jpg"
        //"/WEB-INF/fileStorage/disk/2020-03/bb.jpg"
        String url = request.getRequestURI();
        url = "/WEB-INF/fileStorage" + url.replace("/file/download","");
        try{
            request.getRequestDispatcher(url).forward(request, response);
        }catch (Exception e){
            e.printStackTrace();
        }
        return;
    }
}
