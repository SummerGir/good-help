package util.io.file;

import util.io.Attachment;
import util.io.AttachmentUtils;

import javax.servlet.ServletException;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class DownloadServlet extends javax.servlet.http.HttpServlet {

    static final String NOT_DOWNLOAD_RELATIVE = "/anon/error/not_download.txt";
    //private static final String NOT_DOWNLOAD_REAL = WebPathUtils.getWebAppRealPath(NOT_DOWNLOAD_RELATIVE).toString();

    @Override
    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws IOException, ServletException {
        Attachment attachment = AttachmentUtils.getAttachByUri(request.getRequestURI());

        processRequest(request, response, attachment);

        //request.getRequestDispatcher("/public/controls/document/newwindowreadbyhtml.jsp").forward(request,response);
    }

    protected void processRequest(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Attachment attach) throws IOException {
        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Content-Disposition", "attachment; filename=\"" + URLEncoder.encode(FileName.getFileName(attach.getPath()), "utf-8") + "\"");
        StaticFileHandler.processRequestInternal(request,
                response,
                attach.getRelativePath(),
                attach.getPath().toAbsolutePath().toString(),
                "application/octet-stream",
                headers
        );
    }
}
