package eiis.app.statement;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.text.SimpleDateFormat;
import java.util.*;

public class StatementBase {
    public static int TIME_SPACE = 12;

    public String getStartTime(int type){
        return getStartTime(type, 0);
    }
    public String getStartTime(int type,int offset){
        int n = TIME_SPACE - offset;
        Calendar c = Calendar.getInstance();
        if(StatementCycleKind.DAY.getType() == type){
            c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) - n);
        }else if(StatementCycleKind.WEEK.getType() == type){
            c.set(Calendar.WEEK_OF_YEAR, c.get(Calendar.WEEK_OF_YEAR) - n);
        }else if(StatementCycleKind.MONTH.getType() == type){
            c.set(Calendar.MONTH, c.get(Calendar.MONTH) - n);
        }else if(StatementCycleKind.QUARTER.getType() == type){
            c.set(Calendar.MONTH, c.get(Calendar.MONTH) - n * 3);
        }else if(StatementCycleKind.HALF_YEAR.getType() == type){
            c.set(Calendar.MONTH, c.get(Calendar.MONTH) - n * 6);
        }else if(StatementCycleKind.YEAR.getType() == type){
            c.set(Calendar.YEAR, c.get(Calendar.YEAR) - n);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String startTime = sdf.format(c.getTime()) + " 00:00:00";
        return startTime;
    }

    public String getEndTime(){
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    public String getTimeFormat(String col,int type){
        String str = "";
        if(StatementCycleKind.DAY.getType() == type){
            str = "DATE_FORMAT("+col+",'%Y年%m月%d日')";
        }else if(StatementCycleKind.WEEK.getType() == type){
            str = "DATE_FORMAT("+col+",'%Y年%u周')";
        }else if(StatementCycleKind.MONTH.getType() == type){
            str = "DATE_FORMAT("+col+",'%Y年%m月')";
        }else if(StatementCycleKind.QUARTER.getType() == type){
            str = "concat(YEAR("+col+"),'年',QUARTER("+col+"),'季度')";
        }else if(StatementCycleKind.HALF_YEAR.getType() == type){
            str = "concat(YEAR("+col+"),'年',if((QUARTER("+col+")=1 or QUARTER("+col+")=2),'上半年','下半年'))";
        }else if(StatementCycleKind.YEAR.getType() == type){
            str = "DATE_FORMAT("+col+",'%Y年')";
        }
        return str;
    }

    public String getTimeFormat(Calendar c,int type){
        String str = "";
        int m = c.get(Calendar.MONTH) + 1;

        if(StatementCycleKind.DAY.getType() == type){
            int d= c.get(Calendar.DAY_OF_MONTH);
            str = c.get(Calendar.YEAR) + "年" + (m < 10 ? ("0" + m) : m) + "月" + (d < 10 ? ("0" + d) : d) + "日";
            c.set(Calendar.DAY_OF_MONTH,c.get(Calendar.DAY_OF_MONTH) - 1);
        }else if(StatementCycleKind.WEEK.getType() == type){
            m = c.get(Calendar.WEEK_OF_YEAR);
            str = c.get(Calendar.YEAR) + "年" + (m < 10 ? ("0" + m) : m) + "周";
            c.set(Calendar.WEEK_OF_YEAR,c.get(Calendar.WEEK_OF_YEAR) - 1);
        }else if(StatementCycleKind.MONTH.getType() == type){
            str = c.get(Calendar.YEAR) + "年" + (m < 10 ? ("0" + m) : m) + "月";
            c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 1);
        }else if(StatementCycleKind.QUARTER.getType() == type){
            str = c.get(Calendar.YEAR) + "年" + (m < 4 ? 1 : (m < 7 ? 2 : (m < 10 ? 3 : 4))) + "季度";
            c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 3);
        }else if(StatementCycleKind.HALF_YEAR.getType() == type){
            str = c.get(Calendar.YEAR) + "年" + (m < 7 ? "上半年" : "下半年");
            c.set(Calendar.MONTH,c.get(Calendar.MONTH) - 6);
        }else if(StatementCycleKind.YEAR.getType() == type){
            str = c.get(Calendar.YEAR) + "年";
            c.set(Calendar.YEAR,c.get(Calendar.YEAR) - 1);
        }
        return str;
    }


    public List<Map<String, Object>> getNativeMapList(
            EntityManager entityManager, String sql,
            Map<String, Object> values, String[] fieldNames, int page, int rows) throws Exception {
        Query query = entityManager.createNativeQuery(sql);
        if (values != null) {
            for (Map.Entry<String, Object> entry : values.entrySet()) {
                query.setParameter(entry.getKey(), entry.getValue());
            }
        }
        page = page < 1 ? 1 : page;
        query.setFirstResult((page - 1) * rows);
        if(rows>0) {
            query.setMaxResults(rows);
        }
        List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();

        if(fieldNames.length > 1){
            List<Object[]> list = query.getResultList();
            for(int i = 0 ; i < list.size() ; i++){
                Object[] row = list.get(i);
                if( i == 0 && row.length != fieldNames.length){
                    throw new IllegalAccessException("结果集列名 与 字段名数组(fieldNames) 长度不一致!");
                }
                Map<String,Object> map = new HashMap<String, Object>();
                for(int v = 0 ; v < row.length ; v++){
                    map.put(fieldNames[v],row[v]);
                }
                result.add(map);
            }
        }else{
            List<Object> list = query.getResultList();
            for(int i = 0 ; i < list.size() ; i++){
                Object row = list.get(i);

                Map<String,Object> map = new HashMap<String, Object>();
                map.put(fieldNames[0],row);
                result.add(map);
            }
        }

        return result;
    }
}
