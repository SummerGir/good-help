package util.io.file;

import com.google.common.base.Strings;
import com.google.common.base.Throwables;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import util.context.Context;
import util.io.WebPathUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;
import java.util.Map;

public class StaticFileHandler {

    private static final boolean isForwardFile;

    static {
        isForwardFile = WebPathUtils.getAttachRootPath().startsWith(WebPathUtils.getWebAppRootPath());
    }

    public static void processRequestInternal(javax.servlet.http.HttpServletRequest request,
                                              HttpServletResponse response) throws IOException {
        processRequestInternal(request, response, null, null);
    }

    public static void processRequestInternal(javax.servlet.http.HttpServletRequest request,
                                              HttpServletResponse response,
                                              String overrideVirtualPath,
                                              String overrideReadPath) throws IOException {
        processRequestInternal(request, response, overrideVirtualPath, overrideReadPath, null, null);
    }

    public static void processRequestInternal(javax.servlet.http.HttpServletRequest request,
                                              HttpServletResponse response,
                                              String overrideVirtualPath,
                                              String overrideReadPath,
                                              String contentType,
                                              Map<String, String> headers) throws IOException {
        String virtualPath;
        String readPath;
        if (StringUtils.isBlank(overrideVirtualPath)) {
            virtualPath = Context.getRequestPath();
        } else {
            virtualPath = overrideVirtualPath;
        }
        if (StringUtils.isBlank(overrideReadPath)) {
            readPath = WebPathUtils.getWebAppRealPath(virtualPath).toString();
        } else {
            readPath = overrideReadPath;
        }

        if (isForwardFile) {
            if (StringUtils.endsWithIgnoreCase(readPath, ".jsp")) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            if (!Strings.isNullOrEmpty(contentType)) {
                response.setContentType(contentType);
            }

            if (headers != null && !headers.isEmpty()) {
                for (Map.Entry<String, String> entry : headers.entrySet()) {
                    response.setHeader(entry.getKey(), entry.getValue());
                }
            }

            try {
                request.getRequestDispatcher(WebPathUtils.resolveRelativePath(WebPathUtils.getWebAppRootPath().relativize(Paths.get(readPath)).toString()))
                        .forward(request, response);
                return;
            } catch (ServletException e) {
                System.out.println(String.format("StaticFileHandler: exception=%s;\r\n\tpath=%s\n\n\tremoteAddr=%s;\r\n\trequestPath=%s;\r\n\tuser-Agent=%s",
                        Throwables.getRootCause(e).getMessage(),
                        readPath,
                        request.getRemoteAddr(),
                        request.getRequestURI(),
                        request.getHeader("User-Agent")));
                throw new UnsupportedOperationException(e);
            }
        } else {
            Path thePath = Paths.get(readPath);
            response.reset(); // 非常重要

            if (Strings.isNullOrEmpty(contentType)) {
                response.setContentType(Support.getContentType(thePath.toString()));
            } else {
                response.setContentType(contentType);
            }

            if (headers != null && !headers.isEmpty()) {
                for (Map.Entry<String, String> entry : headers.entrySet()) {
                    response.setHeader(entry.getKey(), entry.getValue());
                }
            }

            response.setHeader("Accept-Ranges", "none");
            response.setHeader("Cache-Control", "no-cache");
            //response.setHeader("Cache-Control", "public");
            response.addDateHeader("Expires", DateUtils.addDays(new Date(System.currentTimeMillis()), 1).getTime());
            long lastModifiedTime = Files.getLastModifiedTime(thePath).toMillis();
            response.addDateHeader("Last-Modified", lastModifiedTime);
            String eTag = Long.toString(lastModifiedTime);
            response.setHeader("ETag", eTag);
            response.setContentLength((int) Files.size(thePath));

            if (eTag.equals(request.getHeader("If-None-Match"))) {
                response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
                return;
            }

            try (InputStream inputStream = Files.newInputStream(thePath, StandardOpenOption.READ)) {
                OutputStream outputStream = response.getOutputStream();
                Support.copyStream(inputStream, outputStream, Files.size(thePath));
            } catch (Exception e) {
                System.out.println(String.format("StaticFileHandler: exception=%s;\r\n\tpath=%s\n\n\tremoteAddr=%s;\r\n\trequestPath=%s;\r\n\tuser-Agent=%s",
                        e.getMessage() == null ? e.getCause().getMessage() : e.getMessage(),
                        thePath.toString(),
                        request.getRemoteAddr(),
                        request.getRequestURI(),
                        request.getHeader("User-Agent")));
                throw e;
            }
        }
    }
}
