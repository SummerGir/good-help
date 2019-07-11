package util.io.file;

import java.nio.file.Path;

public class FileName {
    public static final char EXTENSION_SEPARATOR = '.';

    public FileName() {
    }

    public static String getExtension(Path path) {
        String filename = getFileName(path);
        return filename.substring(filename.lastIndexOf(46) + 1);
    }

    public static String getFileName(Path path) {
        return path.getFileName().toString();
    }

    public static String getFileNameWithoutExtension(Path path) {
        String filename = getFileName(path);
        return filename.substring(0, filename.lastIndexOf(46));
    }
}
