<%@ taglib prefix="master" uri="eiis.masterpage" %>
<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ page import="java.nio.file.Files" %>
<%@ page import="java.util.List" %>
<%--
  Created by txy on 2016/3/2 17:23.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>

<%
    String displayUri = "";
    if (request.getAttribute("displayUri") != null) {
        displayUri = request.getAttribute("displayUri").toString();
    }
    String flag = request.getAttribute("flag").toString();
%>
<head>
    <link rel="stylesheet" href="public/esg-font/iconfont.css"/>
</head>

<master:ContentPage materPageId="_app">
    <master:Content contentPlaceHolderId="title">
        图片查看
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
        </script>
        <script type="text/javascript">
            $(function(){
                $("header").remove();
            });
            function back_(){
                window.history.back();
            }
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

    </master:Content>
</master:ContentPage>
        <%
            if ("1".equals(flag)){
        %>
        <iframe src="<%=displayUri%>" width="100%" height="100%"
                style="position: relative; top: 0px; left: 0px; right: 0px; bottom: 0px" frameborder="0" marginwidth="0"
                marginheight="0"></iframe>
        <%

            }else if("2".equals(flag)){
                out.print("<textarea readonly style=\"border: 0px;width: 100%;height: 100%;font-size: 16px;\">");
                String filePath = request.getAttribute("filePath").toString();
                Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
                String code = getFileCode(attachment.getRealPath());
                List<String> textList = Files.readAllLines(attachment.getPath(), Charset.forName(code)); //虚拟机默认编码格式
                StringBuffer sb = new StringBuffer();
                for (String lt:textList){
                    sb.append(lt).append("\r\n");
                }
                out.print(sb.toString());
                out.print("</textarea>");
            }else if ("3".equals(flag)){
                String filePath = request.getAttribute("filePath").toString();
                Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
                String imgUri = attachment.getDisplayUri();
                out.print("<img width='100%' src='"+imgUri+"'/>");
            }else {
                out.print("文件转换读取出错！");
            }

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
        }
        return code;
    }
%>
