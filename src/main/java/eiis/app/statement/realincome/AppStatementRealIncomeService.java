package eiis.app.statement.realincome;

import eiis.app.statement.StatementBase;
import net.sf.json.JSONObject;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("eiis.app.statement.realincome.AppStatementRealIncomeService")
public class AppStatementRealIncomeService extends StatementBase {
    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Autowired
    protected EntityManager entityManager;


    public Map<String,Object> loadTableData(int year)throws Exception{
        int type = 2;
        String col = "a.SYS_TIME";
        Calendar c = Calendar.getInstance();
        c.set(year + 1,0,1,23,59,59);
        c.set(Calendar.DAY_OF_MONTH,c.get(Calendar.DAY_OF_MONTH) - 1);
        String startTime = year + "-01-01 00:00:00";
        String endTime = sdf.format(c.getTime());
        String str = getTimeFormat(col,type);

        String sql = "select c.dt,group_concat(concat(c.MAIN_TYPE,'_',c.total,'_',c.num)) from (select b.dt,b.MAIN_TYPE,sum(d.MONEY) total,count(1) num from (select "+ str +" dt,0 MAIN_TYPE,a.INPUT_ID from app_meterial_input a where "+ col +">=:startTime and "+ col +"<=:endTime union all select if(a.MONTH<10,concat(a.YEAR,'年','0',a.MONTH,'月'),concat(a.YEAR,'年',a.MONTH,'月')) dt,1 MAIN_TYPE,a.INPUT_ID from app_meterial_input a where a.IS_VALID=1 and a.YEAR=:myYear) b join app_meterial_input_detail d on b.INPUT_ID=d.INPUT_ID group by b.dt,b.MAIN_TYPE) c group by c.dt";
        List list = entityManager.createNativeQuery(sql).setParameter("startTime",startTime).setParameter("endTime",endTime).setParameter("myYear",year).getResultList();


        JSONObject jbTypes = getMainTypes();
        Map<String,Object> result=new HashMap<String,Object>();
        Map<String,Map<String,Object>> map = new HashMap<>();
        for(Object obj:list){
            Object[] objs=(Object[]) obj;
            Map<String,Object> item=new HashMap<String,Object>();

            item.put("cycle",objs[0]);
            String[] tp = objs[1].toString().split(",");
            for(String t : tp){
                String[] tc = t.split("_");
                item.put("count_" + tc[0],tc[1]);
                item.put("num_" + tc[0],tc[2]);
            }

            map.put(item.get("cycle").toString(),item);
        }

        String minTime = "",maxTime = "";
        c = Calendar.getInstance();
        Map<String,Object> thisMap = null;
        List<Map<String,Object>> rows = new ArrayList<>();

        for (int i = TIME_SPACE; i > 0; i--) {
            if(thisMap == null){
                String thisKey = year + "年" + (i > 9 ? i : "0"+i) + "月";
                thisMap = map.get(thisKey);
                if(thisMap == null){
                    thisMap = new HashMap<>();
                    thisMap.put("cycle",thisKey);
                }
            }

            int ii = i - 1;
            String prevKey = year + "年" + (ii > 9 ? ii : "0"+ii) + "月";
            Map<String,Object> prevMap = map.get(prevKey);
            if(prevMap == null){
                prevMap = new HashMap<>();
                prevMap.put("cycle",prevKey);
            }

            for(Object t : jbTypes.keySet()){
                double count = 0;
                if(thisMap.get("count_"+t) != null){
                    count = Double.parseDouble(thisMap.get("count_" + t).toString());
                }

                double prevCount = 0;
                if(prevMap != null && prevMap.get("count_" + t) != null){
                    prevCount = Double.parseDouble(prevMap.get("count_" + t).toString());
                }

                double add = count - prevCount;//增长量
                double ratio = 0;//同比增长 = 增长量 / 上一个单位的总量 * 100%
                if(prevCount != 0){
                    ratio = (add + 0.00) / prevCount * 100;
                }else{
                    ratio = add * 100;
                }
                thisMap.put("count_" + t,String.format("%.2f",count));
                thisMap.put("add_" + t,String.format("%.2f",add));
                thisMap.put("ratio_" + t,String.format("%.2f",ratio) + "%");
            }

            if(i == TIME_SPACE){
                maxTime = thisMap.get("cycle").toString();
            }else if(i == 1){
                minTime = thisMap.get("cycle").toString();
            }
            rows.add(thisMap);
            thisMap = prevMap;
        }
        result.put("rows",rows);
        result.put("maxTime",maxTime);
        result.put("minTime",minTime);
        return result;
    }

    public Map<String,Object> loadDetailTableData(String type,String cycle)throws Exception{
        Map<String,Object> values = new HashedMap();
        String baseSql = "";
        if("0".equals(type)){
            //根据编制时间查询
            Calendar c = Calendar.getInstance();
            c.set(Integer.parseInt(cycle.substring(0,4)),Integer.parseInt(cycle.substring(5,7)) - 1,1,0,0,0);
            values.put("startTime",sdf.format(c.getTime()));
            c.set(Calendar.MONTH,c.get(Calendar.MONTH) + 1);
            values.put("endTime",sdf.format(c.getTime()));
            baseSql = "select d.myTime,sum(d.myMoney),group_concat(d.dicInfo SEPARATOR  ' ; ') from (select date_format(a.SYS_TIME,'%Y年%m月%d日') myTime,sum(b.MONEY) myMoney,concat(c.DIC_NAME,'：',count(b.DETAIL_NUM),c.UNIT_NAME) dicInfo from app_meterial_input a join app_meterial_input_detail b on a.INPUT_ID=b.INPUT_ID join app_dic_info c on b.DIC_ID=c.DIC_ID where a.SYS_TIME>=:startTime and a.SYS_TIME<:endTime group by myTime,b.DIC_ID order by c.PRIORITY_LEVEL) d group by d.myTime order by d.myTime";
        }else{
            values.put("myYear",cycle.substring(0,4));
            values.put("myMonth",cycle.substring(5,7));
            baseSql = "select d.myTime,sum(d.myMoney),group_concat(d.dicInfo SEPARATOR  ' ; ') from (select a.INPUT_CODE myTime,sum(b.MONEY) myMoney,concat(c.DIC_NAME,'：',count(b.DETAIL_NUM),c.UNIT_NAME) dicInfo from app_meterial_input a join app_meterial_input_detail b on a.INPUT_ID=b.INPUT_ID join app_dic_info c on b.DIC_ID=c.DIC_ID where a.YEAR=:myYear and a.MONTH=:myMonth group by myTime,b.DIC_ID order by c.PRIORITY_LEVEL ) d group by d.myTime order by d.myTime";
        }

        String[] fields = {"myTime", "myMoney","dicInfo"};

        List<Map<String, Object>> list = getNativeMapList(entityManager, baseSql, values, fields, 1, -1);

        for (Map<String, Object> m : list) {
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (e.getValue() == null) {
                    if("myMoney".equals(e.getKey().toString())){
                        m.put(e.getKey(), "0.00");
                    }else{
                        m.put(e.getKey(), "");
                    }
                }else if("myMoney".equals(e.getKey().toString())){
                    m.put(e.getKey(),String.format("%.2f",Double.parseDouble(e.getValue().toString())));
                }
            }
        }

        Map<String,Object> result = new HashMap<>();
        result.put("rows",list);
        return result;
    }

    public static JSONObject getMainTypes(){
        JSONObject jb = new JSONObject();
        jb.put("0","录入");
        jb.put("1","对账");
        return jb;
    }

    public static StringBuffer getYearOption(Boolean isHave,Boolean defSel){
        Calendar c = Calendar.getInstance();
        int n =  10;
        StringBuffer sb = new StringBuffer();
        if(isHave){
            sb.append("<option value='' style='display:\'none\''>全部</option>");
        }

        while (n > 0){
            String sel = "";
            if(defSel){
                sel = "selected='selected'";
                defSel = Boolean.FALSE;
            }
            int y = c.get(Calendar.YEAR);
            sb.append("<option value='" + y +"' "+ sel +">" + y + "年</option>");
            c.set(Calendar.YEAR,c.get(Calendar.YEAR) - 1);
            n--;
        }
        return sb;
    }

    public AppStatementRealIncomeService(){}
    public static AppStatementRealIncomeService getInstance(){
        return ApplicationContext.getCurrent().getBean(AppStatementRealIncomeService.class);
    }
}
