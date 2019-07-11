package util.io;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import util.context.Context;
import util.io.file.Directorys;
import util.properties.ApplicationSettings;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class WebPathUtils {
    private static Path _rootPath = null;
    static final String _relativePathSeparator = "/";
    private static String _realPathSeparator = "\\";
    final private static String _tempFolderName = "temp";
    static private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

    static {
        _realPathSeparator = FileSystems.getDefault().getSeparator();
    }

    static String createRelativePath(String... names) {
        StringBuilder sb = new StringBuilder();
        sb.append(_relativePathSeparator);
        for (String n : names) {
            sb.append(n.trim());
            sb.append(_relativePathSeparator);
        }
        return sb.toString();
    }

    public static String getDateFolder(Date date) {
        return dateFormat.format(date);
    }

    /**
     * 从相对路径得到真实路径
     *
     * @param relativePath 文件相对路径
     * @return 返回文件的真实路径
     */
    public static String getRealPath(String relativePath) {
        if (isRelativePath(relativePath)) {
            return getAttachRootPath().resolve(relativePath.startsWith(_relativePathSeparator) ? relativePath.substring(1) : relativePath).toString();
        }
        return relativePath;
    }

    /**
     * 从真实路径得到相对路径
     *
     * @param realPath 文件真实路径
     * @return 返回相对路径
     */
    public static String getRelativePath(String realPath) {
        if (isRealPath(realPath)) {
            return _relativePathSeparator + StringUtils.replace(getAttachRootPath().relativize(Paths.get(realPath)).toString(), _realPathSeparator, _relativePathSeparator);
        }
        if (realPath.startsWith(_relativePathSeparator)) {
            return realPath;
        }
        throw new IllegalArgumentException("错误的真实路径.");
    }

    /**
     * 判断是否是相对路径
     *
     * @param path 文件路径
     * @return 如果是相对路径返回true, 否则返回false
     */
    public static boolean isRelativePath(String path) {
        if (StringUtils.isBlank(path)) {
            return false;
        }
        if (isRealPath(path)) {
            return false;
        }
        return path.startsWith(_relativePathSeparator);
    }

    /**
     * 判断是否是真实路径
     *
     * @param path 文件路径
     * @return 如果是真实路径返回true, 否则返回false
     */
    public static boolean isRealPath(String path) {
        return StringUtils.startsWithIgnoreCase(path, getAttachRootPath().toString());
    }

    /**
     * 得到应用程序数据的附件目录
     *
     * @param date 数据时间
     * @param code 模块编码
     * @param id   数据编号
     * @return 得到应用程序数据的附件目录
     */
    public static String getAttachmentRelativePath(Date date, String code, String id) {
        return createRelativePath("attachment", getDateFolder(date), code, id);
    }

    /**
     * 得到应用程序数据文件存放路径
     *
     * @param code 应用程序目录标识
     * @return
     */
    public static String getDatabaseRelativePath(String code) {
        return createRelativePath("database", code);
    }


    /**
     * 判断是否是一个临时路径
     *
     * @param tmpRelativePath 传入文件相对路径
     * @return 如果是一个临时路径返回true, 否则返回false
     */
    public static boolean isTempRelativePath(String tmpRelativePath) {
        return StringUtils.startsWithIgnoreCase(tmpRelativePath, createRelativePath(_tempFolderName));
    }

    /**
     * 按当前时间根据指定关键字获取一个新的临时相对目录。
     *
     * @param key 指定的目录关键字
     * @return 返回新的临时相对目录
     */
    public static String getNewTempRelativePath(String key) {
        return createRelativePath(_tempFolderName,
                getDateFolder(new Date()),
                key,
                UUID.randomUUID().toString());
    }

    /**
     * 按当前时间根据当前用户获取一个新的临时相对目录。
     *
     * @return 返回新的临时相对目录
     */
    public static String getNewTempRelativePath() {
        try {
            return getNewTempRelativePath(Context.getMember().getMemberId());
        } catch (Exception e) {
            return getNewTempRelativePath(UUID.randomUUID().toString());
        }
    }

    public static void cleanTempFolder() {
        cleanTempFolder(Calendar.DAY_OF_MONTH, -1);//取当前日期的前一天.
    }


    public static void cleanTempFolder(int field, int amount) {
        //String today = getDateFolder(cal.getTime());
        DateTime endDate = DateTime.now();
        Calendar cal = Calendar.getInstance();//使用默认时区和语言环境获得一个日历。
        cal.add(field, amount);
        //String yesterday = getDateFolder(cal.getTime());
        DateTime startDate = new DateTime(cal);
        Path cleanTemp = Paths.get(getRealPath(createRelativePath(_tempFolderName)));
        if (Files.exists(cleanTemp)) {
            try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(cleanTemp)) {
                for (Path tmpPath : directoryStream) {
                    if (Files.isDirectory(tmpPath)) {
                        DateTime targetDate = null;
                        try {
                            targetDate = new DateTime(dateFormat.parse(tmpPath.getFileName().toString()));
                        } catch (ParseException e) {
                        }
                        if (targetDate != null) {
                            if ((targetDate.isAfter(startDate) && targetDate.isBefore(endDate))
                                    || targetDate.isEqual(startDate)
                                    || targetDate.isEqual(endDate)) {
                                continue;
                            }
                        }
                        try {
                            Directorys.delete(tmpPath);
                        } catch (IOException e) {
                            StringWriter sWriter = new StringWriter();
                            PrintWriter pWriter = new PrintWriter(sWriter);
                            pWriter.print("删除文件夹“");
                            pWriter.print(tmpPath.toString());
                            pWriter.println("”出错：");
                            pWriter.println(e.getMessage());
                            pWriter.println();
                            e.printStackTrace(pWriter);
                            String logDate = sWriter.toString();
                            pWriter.close();
                            try {
                                sWriter.close();
                            } catch (IOException ignore) {
                                ignore.fillInStackTrace();
                            }
                        }
                    } else {
                        try {
                            Files.delete(tmpPath);
                        } catch (IOException e) {
                            StringWriter sWriter = new StringWriter();
                            PrintWriter pWriter = new PrintWriter(sWriter);
                            pWriter.print("删除文件“");
                            pWriter.print(tmpPath.toString());
                            pWriter.println("”出错：");
                            pWriter.println(e.getMessage());
                            pWriter.println();
                            e.printStackTrace(pWriter);
                            String logDate = sWriter.toString();
                            pWriter.close();
                            try {
                                sWriter.close();
                            } catch (IOException ignore) {
                                ignore.fillInStackTrace();
                            }
                        }
                    }
                }
            } catch (IOException me) {
                StringWriter sWriter = new StringWriter();
                PrintWriter pWriter = new PrintWriter(sWriter);
                pWriter.println(me.getMessage());
                pWriter.println();
                me.printStackTrace(pWriter);
                String logDate = sWriter.toString();
                pWriter.close();
                try {
                    sWriter.close();
                } catch (IOException ignore) {
                }
            }
            System.out.println(String.format("清理 %s 至 %s 之外的临时文件完成.",
                    dateFormat.format(startDate.toDate()),
                    dateFormat.format(endDate.toDate())));
        }
    }

    /**
     * 得到相对路径的占用空间大小
     *
     * @param relativePath 文件相对路径
     * @return 获取指定目录或文件及子目录下所有文件占用的空间大小
     */
    public static long getSize(String relativePath) {
        long size = 0;
        if (isRelativePath(relativePath)) {
            try {
                size = Directorys.size(Paths.get(getRealPath(relativePath)));
            } catch (IOException ignored) {
            }
        }
        return size;
    }

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


    private static Path _webAppRootPath;

    public static void setWebAppRootPath(Path webAppRootPath) {
        _webAppRootPath = webAppRootPath;
    }

    public static Path getWebAppRootPath() {
        return _webAppRootPath;
    }

    public static Path getWebAppRealPath(String... more) {
        return Paths.get(_webAppRootPath.toString(), more);
    }

    public static String resolveRelativePath(String first,
                                             String... more) {
        Collection<String> names = new LinkedList<>();
        Collections.addAll(names,
                StringUtils.split(
                        StringUtils.replace(first, _realPathSeparator, _relativePathSeparator),
                        _relativePathSeparator));
        for (String m : more) {
            Collections.addAll(names,
                    StringUtils.split(
                            StringUtils.replace(m, _realPathSeparator, _relativePathSeparator),
                            _relativePathSeparator));
        }
        return first.startsWith("\\\\")
                ?"\\\\" + StringUtils.join(names, _relativePathSeparator)
                :_relativePathSeparator + StringUtils.join(names, _relativePathSeparator);
    }
}
