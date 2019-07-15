<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<master:ContentPage>
    <master:Content contentPlaceHolderId="title">
        测试页面
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
        </script>
        <script src="ace.js" type="text/javascript"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
<pre id="editor" style="width: 600px;height: 400px">function foo(items) {
    var i;
    for (i = 0; i &lt; items.length; i++) {
        alert("Ace Rocks " + items[i]);
    }
}</pre>
        <script type="text/javascript">
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/chrome");
            editor.getSession().setMode("ace/mode/jsp");
        </script>

    </master:Content>
</master:ContentPage>
