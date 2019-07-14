<%@ page import="eiis.app.projectinfo.service.ProjectInfoService" %>
<%@ page import="eiis.app.projectinfo.entity.AppProjectInfoEntity" %>
<%@ page import="java.util.List" %>
<%@ page import="net.sf.json.JSONArray" %><%--
  Created by IntelliJ IDEA.
  User: xiaopeng
  Date: 2019/2/1
  Time: 9:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    List<AppProjectInfoEntity> p_projectOperate = ProjectInfoService.getInstance().getProjectListByAppCode("projectOperate");
%>
<style>
    .capital_p{
        box-shadow:none !important;
        cursor:default;
    }
    .capital_p:hover{
        box-shadow:none !important;;
        top:0 !important;;
    }
    .capital{
        height: 100%;
        display:flex;
    }
    .cap{
        width: 24%;
        display: flex;
        position: relative;
    }
    .cap1{
        width: 100%;height: 100%;
        background-color: #FFFFFF;
        box-shadow: #e1e1e17d 5px 5px 10px 1px;
        position: absolute;
        top: 0;
        left: 0;
        transition: top 500ms;
        -moz-transition: top 500ms;	/* Firefox 4 */
        -webkit-transition: top 500ms;	/* Safari 和 Chrome */
        -o-transition: top 500ms;	/* Opera */
    }
    .cap1:hover {
         top: -3px;
         /*for ie6,7,8*/
         /*filter: progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa',Direction=135, Strength=5)*/
         /*progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa',Direction=225, Strength=5);*/
         -moz-box-shadow:-2px 2px 10px #CCCCCC,2px 2px 10px #CCCCCC;/*firefox*/
         -webkit-box-shadow:-2px 2px 10px #CCCCCC,2px 2px 10px #CCCCCC;/*webkit*/
         box-shadow:-2px 2px 10px #CCCCCC,2px 2px 10px #CCCCCC;/*opera或ie9*/
     }


    .cap .tubiao{
        width: 80px;
        height: 80px;
        text-align: center;
        padding-top: 30px;
        float: left;
        margin-right: 10px;
    }
    .cap .content{
        padding: 3px 0px;
    }
    .cap .content .name{
        font-size: 12px;
        color:#919191;
    }
    .cap i{
        font-size: 50px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 50%;
    }
    .profit{
        font-size: 18px;
        font-weight: bold;
        margin-top: 8px;
        color: black;
    }
    .profit>span{word-wrap: break-word;}
    .profit-ratio{
        font-size: 12px;
        padding-top: 1px;
        color: black;
    }
    .profit-ratio>span{
        font-weight: bold;
        padding-left: 4px;
        word-wrap: break-word;
    }

    .division{
        width: 1.333333333333333%;
    }
</style>
<div class="capital">
    <div class="cap">
        <div class="cap1">
        <div class="tubiao" style="background-color: #2dcc72;">
            <i class="esg-font icon-zijintong1"></i>
        </div>
        <div class="content">
            <span class="name">资金净额</span>
            <div class="profit">¥<span></span></div>
            <div class="profit-ratio" style="display: none;">利润率<span style="color: #03adf3"></span></div>
        </div>
        </div>
    </div>
    <div class="division"></div>
    <div  class="cap">
    <div  class="cap1">
        <div class="tubiao" style="background-color: #03adfa">
            <i class="iconfont icon-chengbenshouru"></i>
        </div>
        <div class="content">
            <span class="name">项目收入</span>
            <div class="profit">¥<span></span></div>
            <div class="profit-ratio">回款率<span style="color: #ffa338"></span></div>
        </div>
    </div>
    </div>
    <div class="division"></div>
    <div  class="cap">
    <div  class="cap1">
        <div class="tubiao" style="background-color: #ffa338">
            <i class="iconfont icon-chengbenzhichu"></i>
        </div>
        <div class="content">
            <div class="name">成本支付</div>
            <div class="profit">¥<span></span></div>
            <div class="profit-ratio">支付率<span style="color: #2dcc72"></span></div>
        </div>
    </div>
    </div>
    <div class="division"></div>
    <div  class="cap">
    <div  class="cap1">
        <div class="tubiao" style="background-color: #ff6238">
            <i class="iconfont icon-jiezhiqita"></i>
        </div>
        <div class="content">
            <span class="name">其他-借支</span>
            <div class="profit">¥<span></span></div>
        </div>
    </div>
    </div>
</div>
<script type="text/javascript">
    var p_projectOperate=<%=JSONArray.fromObject(p_projectOperate).toString()%>;
    var project_ids_operate=[];
    $(function () {
        $('.capital').parent().addClass("capital_p");

        for(var i=0;i<p_projectOperate.length;i++){
            project_ids_operate.add(p_projectOperate[i].projectId);
        }
        $.ajax({
            type : "post",
            url : "/public/homePageReport/getYunYingData.do",
            data : {project_ids : project_ids_operate.join(";")},
            dataType : "json",
            success : function(msg){
                $(".capital .profit:eq(0) span").text(parseFloat(msg[0].toFixed(2)).toLocaleString());
                $(".capital .profit-ratio:eq(0) span").text(msg[1]);
                $(".capital .profit:eq(1) span").text(parseFloat(msg[2].toFixed(2)).toLocaleString());
                $(".capital .profit-ratio:eq(1) span").text(msg[3]);
                $(".capital .profit:eq(2) span").text(parseFloat(msg[4].toFixed(2)).toLocaleString());
                $(".capital .profit-ratio:eq(2) span").text(msg[5]);
                $(".capital .profit:eq(3) span").text(parseFloat(msg[6].toFixed(2)).toLocaleString());
            }
        });
    });
</script>
