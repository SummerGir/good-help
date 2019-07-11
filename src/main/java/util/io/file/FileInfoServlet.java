package util.io.file;

import util.context.Context;
import util.io.Attachment;
import util.io.AttachmentUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;

public class FileInfoServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Collection<Attachment> fileInfos = AttachmentUtils.getAttachByMultiUri(request.getParameter("files"));

        if (fileInfos.isEmpty()) {
            fileInfos.add(AttachmentUtils.getAttachByUri(Context.getRequestPath()));
        }

        response.setContentType("text/plain");
        response.getWriter().print(AttachmentUtils.getJsonByAttach(fileInfos));
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        processRequest(request, response);
    }

}
