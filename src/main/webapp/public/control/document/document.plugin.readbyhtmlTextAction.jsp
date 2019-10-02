<%@ page import="eiis.io.Attachment" %>
<%@ page import="eiis.io.AttachmentUtils" %>
<%@ page import="eiis.util.json.JsonUtils" %>
<%@ page import="java.nio.charset.Charset" %>
<%@ page import="java.nio.file.Files" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.io.*" %>
<%@ page import="java.nio.charset.MalformedInputException" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    String filePath = request.getParameter("filePath");
    Map<String,Object> outMap = new HashMap<String, Object>();
    String code=null;
    try {
        Attachment attachment = AttachmentUtils.getAttachByUri(filePath);
        code = getFileCode(attachment.getRealPath());
        StringBuffer sb = new StringBuffer();
        BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(attachment.getPath().toString()),"utf-8"));
        String temp=null;
//        List<String> textList = Files.readAllLines(attachment.getPath(), Charset.forName(code)); //虚拟机默认编码格式
//        for (String lt:textList){
//            sb.append(lt).append("\r\n");
//        }
        while ((temp=br.readLine())!=null){
            sb.append(temp).append("\r\n");
        }
        br.close();
        outMap.put("textContent",sb.toString());
        outMap.put("flag",true);
    } catch (Exception e) {
        e.printStackTrace();
        if(code.equals("ANSI")){
            outMap.put("textContent","系统不支持该编码格式！需转换文件编码为UTF-8");
            outMap.put("flag",true);
        }else {
            outMap.put("flag",false);
        }
    }

    JsonUtils.write(out,outMap);

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
        }else if(head[0]==-17 && head[1]==-69 && head[2] ==-65) {
            code = "UTF-8";
        }else if(head[0]==-95 && head[1]==-74 && head[2] ==-73){
            code = "ANSI";
        }
        return code;
    }
%>
