<%@ page import="com.google.common.base.Strings" %>
<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="eiis.io.WebPathUtils" %>
<%@ page import="org.apache.batik.transcoder.TranscoderException" %>
<%@ page import="org.apache.batik.transcoder.TranscoderInput" %>
<%@ page import="org.apache.batik.transcoder.TranscoderOutput" %>
<%@ page import="org.apache.batik.transcoder.image.PNGTranscoder" %>
<%@ page import="java.io.ByteArrayInputStream" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.nio.file.Files" %>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    private static void convertToPng(String svgCode, OutputStream outputStream)
            throws TranscoderException, IOException {
        try {
            byte[] bytes = svgCode.getBytes("utf-8");
            PNGTranscoder t = new PNGTranscoder();
            TranscoderInput input = new TranscoderInput(new ByteArrayInputStream(bytes));
            TranscoderOutput output = new TranscoderOutput(outputStream);
            t.transcode(input, output);
            outputStream.flush();
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
%>
<%
    response.setContentType("application/json");

    String svgCode = request.getParameter("svg");
    if (!Strings.isNullOrEmpty(svgCode)) {

        Attachment png = AttachmentUtils.getAttachByPath(WebPathUtils.resolveRelativePath(WebPathUtils.getNewTempRelativePath(), "svg.png"));

        OutputStream outputStream = null;
        try {
            Files.createDirectories(png.getPath().getParent());
            outputStream = Files.newOutputStream(png.getPath());
            convertToPng(svgCode, outputStream);
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        out.print(AttachmentUtils.getJsonByAttach(png));

    } else {
        out.print("[]");
    }
%>
