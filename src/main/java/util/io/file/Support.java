package util.io.file;

import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


public class Support {
    private static final int _bufferSize = 0x1000;
    private static final long _memoryUpperLimit = Runtime.getRuntime().maxMemory() - _bufferSize;
    /*public static int getBufferSize() {
        long half = Runtime.getRuntime().freeMemory() / 2;
        if (half > Integer.MAX_VALUE) {
            half = Integer.MAX_VALUE;
        }
        return half < _bufferSize ? _bufferSize : (int) half;
    }*/

    public static void copyStream(InputStream inputStream, OutputStream outputStream) throws IOException {
        copyStream(inputStream, outputStream, _bufferSize);
    }

    //private static final int MAX_BUFFER_SIZE = Integer.MAX_VALUE;
    private static final int MAX_BUFFER_SIZE = 0x1000;//4k

    public static void copyStream(InputStream inputStream, OutputStream outputStream, long maxBuffer) throws IOException {
        //long a1 = System.currentTimeMillis();

        /*long bufferSize = Runtime.getRuntime().freeMemory();
        if (_memoryUpperLimit < Runtime.getRuntime().totalMemory()) {
            bufferSize = bufferSize / 2;
        }
        if (bufferSize > maxBuffer) {
            bufferSize = maxBuffer;
        }*/
        long bufferSize = maxBuffer;
        if (bufferSize > MAX_BUFFER_SIZE) {
            bufferSize = MAX_BUFFER_SIZE;
        }
        if (bufferSize < 1) {
            bufferSize = _bufferSize;
        }

        byte[] buf = new byte[(int) bufferSize];
        int len = 0;
        while ((len = inputStream.read(buf)) > 0)
            outputStream.write(buf, 0, len);

        //System.out.println("===" + buf.length + "=====" + (System.currentTimeMillis() - a1) + "=============");

        buf = null;
        //Runtime.getRuntime().gc();
    }

    public static boolean hasContent(Path fileInfo) {
        return !(Files.notExists(fileInfo) ||
                Files.isDirectory(fileInfo) ||
                !Files.isReadable(fileInfo));
    }

    public static String getContentType(String filename) {
        //String ct = eiis.context.Context.getCurrent().getRequest().getServletContext().getMimeType(filename);
        String ct = null;
        try {
            ct = Files.probeContentType(Paths.get(filename));
        } catch (IOException ignored) {
        }
        return StringUtils.isBlank(ct) ? "application/octet-stream" : ct;
    }
}
