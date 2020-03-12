package util.io;

import org.apache.commons.lang3.StringUtils;
import util.properties.ApplicationSettings;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AttachmentUtils {
    private static Path _rootPath;
    public static Path getAttachRootPath() {
        if (_rootPath == null) {
            String path = ApplicationSettings.get("fileStorage").trim();
            if (StringUtils.isBlank(path)) {
                path = "fileStorage";
            }
            Path tmpRootPath = Paths.get(path);
            //如果不是绝对路径，需要在路径前面加上项目根路径
            if (!tmpRootPath.isAbsolute()) {
                Path classesPath = null;
                try {
                    //classesPath = Paths.get(Thread.currentThread().getContextClassLoader().getResource(_emptyString).toURI());
                    classesPath = new org.springframework.core.io.ClassPathResource("").getFile().toPath();
                } catch (IOException e) {
                    throw new UnsupportedOperationException("获取存储文件路径失败", e);
                }
                tmpRootPath = classesPath.resolveSibling(tmpRootPath);
            }
            _rootPath = tmpRootPath;
        }
        return _rootPath;
    }

    public static String addPrefix(String url){
        if(StringUtils.isBlank(url)) {
            return "";
        }
        String temp = "/file/download";
        url = url.replaceAll("\\\\","/");
        if(!url.startsWith("/")){
           url = "/" + url;
        }
        return temp + url;
    }

    public static String deletePrefix(String url){
        if(StringUtils.isBlank(url)) {
            return "";
        }
        if(url.substring(0,14)=="/file/download/"){
            return url.substring(15);
        }
        return url;
    }
}
