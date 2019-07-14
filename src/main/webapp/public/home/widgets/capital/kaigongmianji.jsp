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
    .capital{
        height: 100%;
        display:flex;
    }
    .cap{
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;
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
</style>
<div class="capital" name="kaigongmianji">
    <div class="cap">
        <div class="tubiao" style="background-color: #776dff;">
            <i class="icon iconfont icon-kaigongmianji"></i>
        </div>
        <div class="content">
            <span class="name">年度施工面积</span>
            <div class="profit"><span></span>㎡</div>
        </div>
    </div>
</div>
<script type="text/javascript">
    var p_projectOperate=<%=JSONArray.fromObject(p_projectOperate).toString()%>;
    var project_ids_operate=[];
    $(function () {
        for(var i=0;i<p_projectOperate.length;i++){
            project_ids_operate.add(p_projectOperate[i].projectId);
        }
        $.ajax({
            type : "post",
            url : "/public/homePageReport/getYunYingDataByType.do",
            data : {project_ids : project_ids_operate.join(";"),type:'开工面积'},
            dataType : "json",
            success : function(msg){
                $(".capital[name='kaigongmianji'] .profit span").text(parseFloat(msg[0].toFixed(2)).toLocaleString());
            }
        });
    });
</script>
