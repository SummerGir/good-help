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
            EIIS.Common.loadComponent(EIIS.Common.jQuery.fancytree);
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div>
            <h3>Example 1</h3>

            <p></p>

            <div>
                <div id="testTree1"/>
                <script type="text/javascript">
                    $(document).ready(function () {
                        $("#testTree1")
                                .fancytree({
                                    checkbox: true,
                                    selectMode: 2,
                                    source: {url: "ajax-tree-taxonomy.json", debugDelay: 1000},
                                    lazyLoad: function(event, ctx) {
                                        ctx.result = {url: "ajax-sub2.json", debugDelay: 1000};
                                    }
                                });
                    });
                </script>
            </div>
        </div>
        <br/><br/><br/><br/>

        <input class="eiis-member" />




    </master:Content>
</master:ContentPage>
