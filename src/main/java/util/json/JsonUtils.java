package util.json;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonUtils {

    private static final ObjectMapper mapper = new MoreAwareObjectMapper();

    public static ObjectMapper getObjectMapper() {
        return mapper;
    }

    public static String toString(Object value) throws IOException {
        return mapper.writeValueAsString(value);
    }

    public static void write(java.io.Writer w, Object value) throws IOException {
        mapper.writeValue(w, value);
    }

    public static void write(java.io.OutputStream out, Object value) throws IOException {
        mapper.writeValue(out, value);
    }

    public static <T> T reader(String content, Class<T> valueType) throws IOException {
        return mapper.readValue(content, valueType);
    }
}
