<%@ page import="com.google.common.html.HtmlEscapers" %>
<%@ page import="java.nio.file.Files" %>
<%@ page import="java.nio.file.Paths" %>
<%@ page import="eiis.io.WebPathUtils" %>
<%@ taglib uri="eiis.masterpage" prefix="master" %>
<%@ taglib uri="eiis.ui" prefix="ui" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<master:ContentPage>
    <master:Content contentPlaceHolderId="title">
        测试页面
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            //            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadJavaScript("/public/controls/codeeditor/codeeditor.js");
        </script>
        <script type="text/javascript">
            $().ready(function () {
                $(":button.create").on("click", function () {
                    $("#example1").addClass("eiis-codeeditor");
                });
                $(":button.destroy").on("click", function () {
                    $("#example1").removeClass("eiis-codeeditor");
                });
                $(":button.isDisabled").on("click", function () {
                    alert($("#example1").prop("disabled"));
                });
                $(":button.setDisabled").on("click", function () {
                    $("#example1").prop("disabled", !$("#example1").prop("disabled"));
                });
                $(":button.eHide").on("click", function () {
                    $("#example1").hide();
                });
                $(":button.eShow").on("click", function () {
                    $("#example1").show();
                });
                $(":button.getValue").on("click", function () {
                    alert($("#example1").val());
                });
                $(":button.setValue").on("click", function () {
                    $("#example1").val("<div>是法律框架</div>");
                });

            });
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <textarea id="example1" class="eiis-codeeditor"
                  style="width: 700px;height: 400px; font-size: 20px;"><%=HtmlEscapers.htmlEscaper().escape(
                new String(Files.readAllBytes(
                        WebPathUtils.getWebAppRealPath(
                                eiis.context.Context.getCurrent().getRequest().getRequestPath())), eiis.context.Context.getCharset()))%>
        </textarea>

        <button type="button" class="create">create</button>
        <button type="button" class="destroy">destroy</button>
        <button type="button" class="isDisabled">isDisabled</button>
        <button type="button" class="setDisabled">setDisabled</button>
        <button type="button" class="eHide">hide</button>
        <button type="button" class="eShow">show</button>
        <button type="button" class="getValue">getValue</button>
        <button type="button" class="setValue">setValue</button>
    </master:Content>
</master:ContentPage>
