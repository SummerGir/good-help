<%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 2020/2/27
  Time: 15:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script type="text/javascript" src="/public/jquery/jquery.js"></script>
    <script type="text/javascript" src="css_js/template.js"></script>
</head>
<body>
    <div id="test"></div>
    <input type="file"  value=""/>
    <input type="button"  value="上传"/>



    <%--<input type="button" onclick="getValue()" value="获取当前值"/>--%>
    <%--<input type="button" onclick="setValue()" value="设置当前值"/>--%>


    <script>
        var upload = new Upload("#test",{
            url:""
        });
        function getValue() {
            upload.getValue()
        }
        function setValue() {
            var arr = ["https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3890934586,2525313398&fm=58&s=37AAF104D22336A5C63010930300C080"
                , "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2420047149,2850547244&fm=58&s=49099B555E23771B16B104F80300C02F"];

            upload.setValue(arr);
        }
    </script>

</body>
</html>
