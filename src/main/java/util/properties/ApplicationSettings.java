package util.properties;


import java.util.Properties;

public class ApplicationSettings {
    private static Properties properties = null;

    public ApplicationSettings() {
    }

    private static Properties getProperties() {
        if (properties == null) {
            properties = (Properties)ApplicationContext.getCurrent().getBean("applicationSettings", Properties.class);
        }

        return properties;
    }

    public static String get(String key) {
        return getProperties().getProperty(key);
    }

    public static String get(String key, String defaultValue) {
        return getProperties().getProperty(key, defaultValue);
    }
}
