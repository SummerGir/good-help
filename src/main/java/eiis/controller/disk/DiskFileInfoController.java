package eiis.controller.disk;

import com.fasterxml.jackson.databind.node.ObjectNode;
import eiis.app.disk.entity.DiskFileInfoEntity;
import eiis.app.disk.service.DiskFileInfoService;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.net.URL;
import java.nio.file.Path;
import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import util.dataManage.GenericController;
import util.io.AttachmentUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller("eiis.controller.disk.DiskFileInfoController")
@RequestMapping("/app/file")
public class DiskFileInfoController {
    @Autowired
    protected DiskFileInfoService service;

    @RequestMapping("getMainInfo")
    @ResponseBody

    public List<Map<String,Object>> getMainInfo(HttpServletRequest request){
        try {
            return service.getMainInfo(request.getParameter("searchKye"),request.getParameter("fileTreeId"));
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


    @RequestMapping("saveMain")
    @ResponseBody
    public ObjectNode saveMain(HttpServletRequest request){
        //消息提示
        boolean isNew = true;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat simpleDateFormat1 = new SimpleDateFormat("yyyy-MM");
        Date date = new Date();
        DiskFileInfoEntity entity;
        try {
            //使用Apache文件上传组件处理文件上传步骤：
            //1、创建一个DiskFileItemFactory工厂
            DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();
            //2、创建一个文件上传解析器
            ServletFileUpload fileUpload = new ServletFileUpload(diskFileItemFactory);
            //解决上传文件名的中文乱码
            fileUpload.setHeaderEncoding("UTF-8");
            //3、判断提交上来的数据是否是上传表单的数据
            if(!ServletFileUpload.isMultipartContent(request)){
                //按照传统方式获取数据
                return GenericController.returnFaild(null);
            }
            //4、使用ServletFileUpload解析器解析上传数据，解析结果返回的是一个List<FileItem>集合，每一个FileItem对应一个Form表单的输入项
            List<FileItem> list = fileUpload.parseRequest(request);

            //处理fileitem中的普通输入项的数据
            Map<String,String> map = new HashMap();
            for(FileItem item : list){
                if(item.isFormField()){
                    String name = item.getFieldName();
                    String value = item.getString("UTF-8");
//                    String value1 = new String(value.getBytes("iso8859-1"),"UTF-8");
                    map.put(name,value);
                }
            }
            String fileId = map.get("fileId");
            if(StringUtils.isNotBlank(fileId)){
                entity = service.findOne(fileId);
                isNew = false;
            }else {
                entity = new DiskFileInfoEntity();
                entity.setFileId(UUID.randomUUID().toString());
                isNew = true;
            }
            entity.setFileTreeId(map.get("fileTreeId"));
            entity.setFileName(map.get("fileName"));
            if(map.get("createdTime") != null ){
                entity.setCreatedTime(new Timestamp(simpleDateFormat.parse(map.get("createdTime")).getTime()));
            }
            entity.setSystime(new Timestamp(System.currentTimeMillis()));
            entity.setComment(map.get("comment"));
            //处理fileitem中的文件
            if(!isNew){
                service.save(entity);
                //修改信息成功
                return GenericController.returnSuccess(null);
            }
            for (FileItem item : list) {
                if(!item.isFormField()) {
                    //如果fileitem中封装的是上传文件，得到上传的文件名称，
                    String fileName = item.getName();
                    if (fileName == null || fileName.trim().equals("")) {
                        continue;
                    }
                    //注意：不同的浏览器提交的文件名是不一样的，有些浏览器提交上来的文件名是带有路径的，如：  c:\a\b\1.txt，而有些只是单纯的文件名，如：1.txt
                    //处理获取到的上传文件的文件名的路径部分，只保留文件名部分
                    fileName = fileName.substring(fileName.lastIndexOf(File.separator) + 1);
                    fileName = System.currentTimeMillis()+"_"+fileName;
                    //获取item中的上传文件的输入流
                    InputStream is = item.getInputStream();


                    entity.setFilePath("disk"+File.separator+simpleDateFormat1.format(date)+ File.separator+fileName);

                    Path path = AttachmentUtils.getAttachRootPath().resolve("disk").resolve(simpleDateFormat1.format(date));

                    if (!path.toFile().exists()) {
                        path.toFile().mkdirs();
                    }
                    //创建一个文件输出流
                    FileOutputStream fos = new FileOutputStream(path.toString() + File.separator + fileName);
                    //创建一个缓冲区
                    byte buffer[] = new byte[1024];
                    //判断输入流中的数据是否已经读完的标识
                    int length = 0;
                    //循环将输入流读入到缓冲区当中，(len=in.read(buffer))>0就表示in里面还有数据
                    while ((length = is.read(buffer)) > 0) {
                        //使用FileOutputStream输出流将缓冲区的数据写入到指定的目录(savePath + "\\" + filename)当中
                        fos.write(buffer, 0, length);
                    }
                    //关闭输入流
                    is.close();
                    //关闭输出流
                    fos.close();
                    //删除处理文件上传时生成的临时文件
                    item.delete();
                }
            }
            service.save(entity);
        } catch (Exception e) {
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
        return GenericController.returnSuccess(null);
    }


    @RequestMapping("deleteMain")
    @ResponseBody
    public ObjectNode deleteMain(HttpServletRequest request){
        String fileId = request.getParameter("fileId");
        DiskFileInfoEntity entity = service.findOne(fileId);
        Path path = AttachmentUtils.getAttachRootPath().resolve(entity.getFilePath());
        try {
            path.toFile().delete();
            service.delete(request.getParameter("fileId"));
            return GenericController.returnSuccess(null);
        }catch (Exception e){
            e.printStackTrace();
            return GenericController.returnFaild(null);
        }
    }


    @RequestMapping("downLoadMain")
    @ResponseBody
    public void downLoadMain(HttpServletRequest request,HttpServletResponse response){
        String fileId = request.getParameter("fileId");
//        String targetPath = request.getParameter("targetPath");
        DiskFileInfoEntity entity = service.findOne(fileId);
        Path sourcePath = AttachmentUtils.getAttachRootPath().resolve(entity.getFilePath());
        File sourceFile = sourcePath.toFile();
        String fileName = sourceFile.getName();
        //取得文件后缀名
        String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
        try {
            //以流的形式下载文件
            InputStream in = new BufferedInputStream(new FileInputStream(sourceFile));
            byte[] bytes = new byte[in.available()];
            in.read(bytes);
            in.close();
            //清空response
            response.reset();
            //设置response的header
            response.addHeader("Content-Disposition","attachment;filename=" + new String(fileName.getBytes()));
            response.addHeader("Content-Length", "" + sourceFile.length());
            OutputStream out = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/octet-stream");
            out.write(bytes);
            out.flush();
            out.close();
//            return response;
        }catch (Exception e){
            e.printStackTrace();
//            return response;
        }
    }
}
