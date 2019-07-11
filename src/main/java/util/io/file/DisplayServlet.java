package util.io.file;

import net.coobird.thumbnailator.Thumbnails;
import util.io.Attachment;
import util.io.AttachmentUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class DisplayServlet extends javax.servlet.http.HttpServlet {

    @Override
    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws IOException {
        Attachment attach = AttachmentUtils.getAttachByUri(request.getRequestURI());
        if (!Support.hasContent(attach.getPath())) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        String extension = FileName.getExtension(attach.getPath()).toLowerCase();
        if (extension.equals("gif") || extension.equals("png") || extension.equals("jpg") || extension.equals("bmp")) {
            int width = 0;
            int height = 0;
            try {
                width = Integer.parseInt(request.getParameter("width"));
                height = Integer.parseInt(request.getParameter("height"));
            } catch (Exception ignore) {
            }
            if (width > 0 && height > 0) {
                Path tmpJPG = attach.getPath().getParent().resolve("thumbnail/" + FileName.getFileNameWithoutExtension(attach.getPath()) + "_thumbnail_"
                        + String.valueOf(width) + "x" + String.valueOf(height) + ".jpg");
                if (Files.notExists(tmpJPG)) {
                    Files.createDirectories(tmpJPG.getParent());
                    try {
                        Thumbnails.of(attach.getPath().toString())
                                .size(width, height)
                                .outputFormat("jpg")
                                //.toOutputStream(response.getOutputStream());
                                .toFile(tmpJPG.toString());
                    } catch (javax.imageio.IIOException e) {
                        Files.deleteIfExists(tmpJPG);
                        throw e;
                    }
                }
                attach = AttachmentUtils.getAttachByPath(tmpJPG);
            }
        }

        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Content-Disposition", "inline; filename=\"" + URLEncoder.encode(FileName.getFileName(attach.getPath()), "utf-8") + "\"");
        StaticFileHandler.processRequestInternal(request,
                response,
                attach.getRelativePath(),
                attach.getPath().toAbsolutePath().toString(),
                null,
                headers
        );
    }
}
