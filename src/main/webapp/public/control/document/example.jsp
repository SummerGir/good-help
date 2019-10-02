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
            EIIS.Common.loadComponent(EIIS.Common.controls.document);
//            EIIS.Common.loadComponent(EIIS.Common.controls.document.plugins.all);
        </script>

    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div>
            <h3>Example 1</h3>

            <p></p>

            <div>
                <div id="testDocument1"/>
                <script type="text/javascript">
                    $(document).ready(function () {
                        $("#testDocument1")
                                .document({canUpload: true,
                                    canNew: true,
                                    canEdit: true,
                                    canRename: false,
                                    canCancel: false,
                                    canRead: true,
                                    canDownload: true,
                                    multiple: false})
                        ;
                    });
                </script>
            </div>
        </div>
        <br/><br/><br/><br/>

    </master:Content>
</master:ContentPage>
