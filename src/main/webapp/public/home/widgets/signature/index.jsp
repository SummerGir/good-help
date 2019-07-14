<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Calendar" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  SimpleDateFormat format = new SimpleDateFormat("MM/dd");
  String[] weekDays = {"周日", "周一", "周二", "周三", "周四", "周五", "周六"};
  StringBuffer headWeeks = new StringBuffer();  //表头时间
  StringBuffer headTitles = new StringBuffer();  //表头名称
  int w=0;
  Calendar c= Calendar.getInstance();
  c.setTime(new Date());
  for (int i=0;i<7;i++){
    w = c.get(Calendar.DAY_OF_WEEK) - 1;
    if (w < 0) w = 0;
    headWeeks.append("week"+w+(i==6?"":";"));
    headTitles.append(weekDays[w]+" "+format.format(c.getTime())+(i==6?"":";"));
    c.add(Calendar.DATE,1);
  }
%>
<style type="text/css">
  .signature{
    border-top: 2px solid rgba(16,147,237,0.3);
  }
  .signature .sign_table{
    height: 192px;
    cursor: default;
  }
  .signature .homeTable .tableBody{background-color: #fff;}
  .signature .homeTable .tableBody td{padding: 0;}
  .signature .homeBody {padding: 38px 4px 10px 3px}
  .signature .homeHead{cursor: default;}
</style>
<div class="signature homeModule">
  <div class="homeHead">
    <span class="title">签/章 外出公告</span>
  </div>
  <div class="homeBody">
    <div class="sign_table"></div>
  </div>
</div>
<script type="application/javascript">
  var headWeeks = "<%=headWeeks.toString()%>";
  var headTitles = "<%=headTitles.toString()%>";
    !function(){
        var screenWidth = window.screen.width;
        var headWeek = headWeeks.split(";");
        var headTitle = headTitles.split(";");
        var signature;
        var table;
        var columns;
        var maxColumns = [
            {field:'memberName',title:"<span style='cursor: default;'>章/人员</span>",width:'9%',align:'center',formatter: function (value, row){
                return "<span style='color: #5e5e5e;'>"+value+"</span>";
            }},
            {field:headWeek[0],title:"<span style='cursor: default;'>"+headTitle[0].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[0].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;'>--</span>";
            }},
            {field:headWeek[1],title:"<span style='cursor: default;'>"+headTitle[1].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[1].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[2],title:"<span style='cursor: default;'>"+headTitle[2].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[2].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[3],title:"<span style='cursor: default;'>"+headTitle[3].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[3].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[4],title:"<span style='cursor: default;'>"+headTitle[4].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[4].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[5],title:"<span style='cursor: default;'>"+headTitle[5].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[5].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[6],title:"<span style='cursor: default;'>"+headTitle[6].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[6].split(" ")[1]+"</span>",width:'13%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }}
        ];
        var minColumns = [
            {field:'memberName',title:"<span style='cursor: default;'>章/人员</span>",width:'15%',align:'center',formatter: function (value, row){
                return "<span style='color: #5e5e5e;'>"+value+"</span>";
            }},
            {field:headWeek[0],title:"<span style='cursor: default;'>"+headTitle[0].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[0].split(" ")[1]+"</span>",width:'17%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;'>--</span>";
            }},
            {field:headWeek[1],title:"<span style='cursor: default;'>"+headTitle[1].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[1].split(" ")[1]+"</span>",width:'17%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[2],title:"<span style='cursor: default;'>"+headTitle[2].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[2].split(" ")[1]+"</span>",width:'17%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[3],title:"<span style='cursor: default;'>"+headTitle[3].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[3].split(" ")[1]+"</span>",width:'17%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }},
            {field:headWeek[4],title:"<span style='cursor: default;'>"+headTitle[4].split(" ")[0]+"</span><span style='cursor: default;color: #919191;'> "+headTitle[4].split(" ")[1]+"</span>",width:'17%',align:'center',formatter: function (value, row){
                if(value){
                    value = value.replaceAll("|","</br>");
                    return "<span style='color: #166de4;'>"+value+"</span>";
                }
                return "<span style='color: #43cbfe;font-size: 14px;''>--</span>";
            }}
        ];
        if(screenWidth<=1366) columns = minColumns;
        else  columns = maxColumns;
        $(function(){

            signature=$(".signature");
            table=signature.find(".sign_table").homeTable({
                headBGColor : '#eee',
                columns : columns
            });
            table.loading();
            $.ajax({
                type : "post",
                url : "/public/homePageWork/getSignatureOut.do",
                data : {},
                dataType : "json",
                success : function(data){
                    table.setData(data.rows);
                    table.loaded();
                }
            });
        });
    }();
</script>