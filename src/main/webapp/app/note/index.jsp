<%@ taglib prefix="master" uri="util.masterPage" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/31
  Time: 15:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title">随手记</master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript" src="/public/control/bootstrap-table/js/bootstrap.table.js"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div id="myTableTest"></div>
        <script type="text/javascript">
            $(document).ready(function(){
                var option = {
                    id:"#myTableTest",//需要绑定的Id或class
                    url:"/app/note/info/getMainInfo.do",//表格请求的路径
                    type:"post",//请求方式
                    data:"",//请求的参数
                    dataType:"json",//请求的返回格式
                    toolbar:"",//表格上面的工具栏用哪个容器
                    isPage:true,//是否分页
                    page:1,//加载数据的初始页
                    rows:5,//每页默认条数
                    columns:[
                        {name:'title',title:"菜单",align:'left'},
                        {name:'menuLevel',title:'等级',align:'center',width:'15%'},
                        {name:'outlineLevel',title:"大纲级别",align:'center',width:'25%'}
                        ]//表格列[{field:'name',title:'名称',align:'left',width:80,template:function(){}},{},{}]
                };
                $.ghTable.set_div(option);
            });
        </script>
    </master:Content>
</master:ContentPage>
