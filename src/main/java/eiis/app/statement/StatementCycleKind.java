package eiis.app.statement;

public enum StatementCycleKind {

    DAY("按天统计",0),
    WEEK("按周统计",1),
    MONTH("按月统计",2),
    QUARTER("按季度统计",3),
    HALF_YEAR("按半年统计",4),
    YEAR("按年统计",5);

    private String name;
    private int type;

    private StatementCycleKind(String name, int type){
        this.name = name;
        this.type = type;
    }

    public static StringBuffer getCycleOption(int def_type){
        StringBuffer sb = new StringBuffer();
        for(StatementCycleKind sc : StatementCycleKind.values()){
            String se = "";
            if(def_type == sc.getType()) {
                se = "selected='selected'";
            }
            sb.append("<option value='"+sc.getType()+"' "+se+" >").append(sc.getName()).append("</option>");
        }
        return sb;
    }

    public String getName() {
        return name;
    }

    public int getType() {
        return type;
    }

}
