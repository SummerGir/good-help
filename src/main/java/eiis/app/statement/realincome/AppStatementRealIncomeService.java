package eiis.app.statement.realincome;

import eiis.app.statement.StatementBase;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import java.util.*;

@Service("eiis.app.statement.realincome.AppStatementRealIncomeService")
public class AppStatementRealIncomeService extends StatementBase {

    @Autowired
    protected EntityManager entityManager;

    public Map<String,Object> loadTableData(int type)throws Exception{
        String col = "a.SYS_TIME";
        String startTime = getStartTime(type);
        String str = getTimeFormat(col,type);

        String sql = "select c.dt,group_concat(concat(c.MAIN_TYPE,'_',c.total)) from (select b.dt,b.MAIN_TYPE,sum(d.MONEY) total from (select "+ str +" dt,1 MAIN_TYPE,a.INPUT_ID from app_meterial_input a where "+ col +">=:startTime and "+ col +"<=now() order by "+ col +" desc) b join app_meterial_input_detail d on b.INPUT_ID=d.INPUT_ID group by b.dt) c group by c.dt";
        List list = entityManager.createNativeQuery(sql).setParameter("startTime",startTime).getResultList();

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
            }

            map.put(item.get("cycle").toString(),item);
        }

        String minTime = "",maxTime = "";
        Calendar c = Calendar.getInstance();
        Map<String,Object> thisMap = null;
        List<Map<String,Object>> rows = new ArrayList<>();
        for (int i = 0; i < TIME_SPACE; i++) {
            if(thisMap == null){
                String thisKey = getTimeFormat(c,type);
                thisMap = map.get(thisKey);
                if(thisMap == null){
                    thisMap = new HashMap<>();
                    thisMap.put("cycle",thisKey);
                }
            }

            String prevKey = getTimeFormat(c,type);
            Map<String,Object> prevMap = map.get(prevKey);
            if(prevMap == null){
                prevMap = new HashMap<>();
                prevMap.put("cycle",prevKey);
            }

            int t = 0;
            int count = 0;
            if(thisMap.get("count_"+t) != null){
                count = Integer.parseInt(thisMap.get("count_" + t).toString());
            }

            int prevCount = 0;
            if(prevMap != null && prevMap.get("count_" + t) != null){
                prevCount = Integer.parseInt(prevMap.get("count_" + t).toString());
            }

            int add = count - prevCount;//增长数量
            double ratio = 0;//同比增长 = 增长数量 / 上一个单位的总量 * 100%
            if(prevCount != 0){
                ratio = (add + 0.00) / prevCount * 100;
            }else{
                ratio = add * 100;
            }
            thisMap.put("count_" + t,count);
            thisMap.put("add_" + t,add);
            thisMap.put("ratio_" + t,String.format("%.2f",ratio) + "%");

            if(i == 0){
                maxTime = thisMap.get("cycle").toString();
            }else if(i == TIME_SPACE -1){
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


    public AppStatementRealIncomeService(){}
    public static AppStatementRealIncomeService getInstance(){
        return ApplicationContext.getCurrent().getBean(AppStatementRealIncomeService.class);
    }
}
