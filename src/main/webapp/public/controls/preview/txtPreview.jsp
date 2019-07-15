<%@ page import="eiis.context.Context" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.IOException" %>
<%@ page import="eiis.app.mail.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="java.util.List" %>
<%@ page import="java.nio.file.Files" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ taglib prefix="master" uri="eiis.masterpage" %>
<%@ taglib prefix="100%;font-size" uri="http://www.springframework.org/tags/form" %>
<%--
  Created by IntelliJ IDEA.
  User: sk
  Date: 2016/3/25
  Time: 9:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String fileName = request.getParameter("fileName");
    String filePath = request.getParameter("filePath");
    String textContent = "";
    String code=null;
    try {
        eiis.io.Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
        code = getFileCode(attachment.getRealPath());
        List<String> textList = Files.readAllLines(attachment.getPath(), Charset.forName(code)); //虚拟机默认编码格式
        StringBuffer sb = new StringBuffer();
        for (String lt:textList){
            sb.append(lt).append("\r\n");
        }
        textContent = sb.toString();
    } catch (Exception e) {
        e.printStackTrace();
        if(code.equals("ANSI")){
            textContent = "系统不支持该编码格式！需转换文件编码为UTF-8";
        }else {
            textContent = "文件转换出错！";
        }

    }
    String materPageId = "_app";
%>
<%!
    private String getFileCode(String path){
        InputStream inputStream = null;
        byte[] head = null;
        try {
            inputStream = new FileInputStream(path);
            head = new byte[3];
            inputStream.read(head);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String code = "gb2312";
        if (head[0] == -1 && head[1] == -2 ){
            code = "UTF-16";
        }else if (head[0] == -2 && head[1] == -1 ){
            code = "Unicode";
        }else if(head[0]==-17 && head[1]==-69 && head[2] ==-65){
            code = "UTF-8";
        }else if(head[0]==-95 && head[1]==-74 && head[2] ==-73){
            code = "ANSI";
        }
        return code;
    }
%>
<master:ContentPage materPageId="<%=materPageId%>">
    <master:Content contentPlaceHolderId="title"><%=fileName%>
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.form);
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <textarea readonly style="border: 0px;width: 100%;font-size:100%;font-size: 16px;">"<%=textContent%>"</textarea>

        <script type="text/javascript">
            $(function(){
                var h = document.body.scrollHeight;
                $("textarea").css("height", h + "px")
            })
            function back_() {
                window.history.back();
            }
        </script>
    </master:Content>
</master:ContentPage>
