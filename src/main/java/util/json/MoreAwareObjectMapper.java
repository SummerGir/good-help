package util.json;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.hibernate4.Hibernate4Module;
import com.fasterxml.jackson.datatype.jdk7.Jdk7Module;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import java.text.SimpleDateFormat;

/**
 * Created by Jiong on 2014/9/5.
 */
public class MoreAwareObjectMapper extends ObjectMapper {

    public MoreAwareObjectMapper() {

        this.registerModule(new Hibernate4Module());
        this.registerModule(new GuavaModule());
        this.registerModule(new Jdk7Module());
        this.registerModule(new JodaModule());

        this.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        this.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        this.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        // 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
        this.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }
}
