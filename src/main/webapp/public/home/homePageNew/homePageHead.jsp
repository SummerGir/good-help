<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<div class="welcome_mss bgf clearfix" style="cursor:default;">
  <p class="a_left headMessage" style="color: #f7881f"></p>
  <p class="a_right"><em class="a_time"></em> <em class="a_week"></em></p>
</div>
<style>
  em, strong { font-style: normal;}
</style>
<script type="text/javascript">
  !function(){
    var a_today = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
    var myDate;
    var year;
    var month;
    var date;
    var aTime=$(".a_time");
    var aWeel=$(".a_week");
    var p=function(s) {
      return s < 10 ? '0' + s: s;
    };
    var plusSecond=function(){
      myDate = new Date();
      //获取当前年
      year=myDate.getFullYear();
      //获取当前月
      month=myDate.getMonth()+1;
      //获取当前日
      date=myDate.getDate();
      aTime.text(year+'年'+p(month)+"月"+p(date)+"日 "+p(myDate.getHours())+':'+p(myDate.getMinutes())+":"+p(myDate.getSeconds()));
      //组织判断周几格式月/日/年
      aWeel.text(a_today[new Date(Date.parse(p(month)+'/'+p(date)+'/'+year)).getDay()]);
    };
    setInterval(plusSecond,1000);
    var setWxtx=function() {
      var htmlArr  = ["最浪费不起的是时间。",
        "抛弃时间的人，时间也抛弃他。",
        "利用时间是一个极其高级的规律。",
        "完成工作的方法是爱惜每一分钟。",
        "任何节约归根到底是时间的节约。",
        "只要我们能善用时间，就永远不愁时间不够用。"
      ];
      var idx = Math.ceil(Math.random() * 5);
      $(".headMessage").text(htmlArr[idx]);
    };
    setWxtx();
  }();
</script>