package util;

import net.sourceforge.pinyin4j.PinyinHelper;

public class Utils {

    //根据中文得到拼音
    public static String getPinYins(String str){
        char[] charArray = str.toCharArray();
        StringBuilder pinyin = new StringBuilder();
        for(int i=0; i<charArray.length; i++){
            if(Character.toString(charArray[i]).matches("[\\u4E00-\\u9FA5]+")){
                pinyin.append(PinyinHelper.toHanyuPinyinStringArray(charArray[i])[0]);
            }else{
                pinyin.append(charArray[i]);
            }
        }
        return pinyin.toString();
    }
}
