<%@ page import="eiis.context.Context" %>
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 13-5-21
  Time: 上午11:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String url = request.getParameter("url");
%>
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style>
        html,body{margin: 0;padding:0;overflow: hidden;width:100%;height: 100%}
    </style>
    <script type="text/javascript" src="/public/library/eiis.js"></script>
    <script type="text/javascript">
        EIIS.Common.loadComponent(EIIS.Common.WebUI);
    </script>
    <script type="text/javascript">
        $(document).ready(function () {
            $("#office").height($('body').height() - 36);

            var p = window.dialogArguments;
            var extName = getExtName(p.name);
            $("#office").attr("data-extname",extName);
            $("#office").val(p.uri);

            $("#btnSave").click(function(){
                 var value = save();
                if(value === false){
                }else{
                    window.close();
                }
            });

            $(window).on('beforeunload',function(e){
                if($("#office").officeExt("getDso").IsDirty){
                    if(window.confirm("文件内容发生改变，是否要保存？")){
                        var value = save();
                        if(value === false){
                            e.preventDefault();
                        }
                    }
                }
            });
        });

        var getExtName = function (file) {
            return file.replace(/.*(\/|\\)/, "");
        }

        function save(){
            $("#office").officeExt("buttonEnable","save",true);
            var rtn = $("#office").officeExt("save")
            if(rtn){
                window.returnValue = $("#office").officeExt("getCurrentFileInfo");
                //window.close();
            }
            $("#office").officeExt("buttonEnable","save",false);
            $("#office").officeExt("getDso").Save();
            return rtn;
        }
        function office_afterOpened(e,office){
            $("#office").officeExt("getDso").Save();
            office.buttonEnable("save",false);
//            $("#office").officeExt("addButton","保存","cmdSave",function(e,btnId,office){
//                var rtn = office.save();
//                if(rtn){
//                    window.returnValue = office.getCurrentFileInfo();
//                    window.close();
//                }
//            });
        }
    </script>
</head>
<body>
<div style="text-align: center" class="ui-widget-header">
    <button id="btnSave" class="webui"><span class="webui-icon-save">保 存</span></button>
</div>
<textarea id="office" name="office" class="webui officeext" data-revisions="true" data-username="<%=Context.getCurrent().getName()%>" data-extname="doc" rows="1" cols="1" style="width:100%;height:100%;"><%=url%></textarea>
</body>
</html>