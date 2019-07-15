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
        <link href="/public/controls/tagsinput/tagsinput.css" type="text/css" rel="stylesheet"/>
        <script src="/public/controls/tagsinput/tagsinput.js" type="text/javascript"></script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div>
            <h3>Example 1</h3>

            <p></p>

            <div>
                <div id="testTagsinput1"/>
                <script type="text/javascript">
                    $(document).ready(function () {
                        $("#testTagsinput1")
                                .tagsinput({
                                    idKey: "id",
                                    displayKey: "text",
                                    menuTemplate: function (value) {
                                        return "<b>" + value["text"] + "</b>&nbsp;&nbsp;" + value["path"];
                                    },
                                    input: {
                                        source: function (value, callback) {
                                            $.ajax({
                                                dataType: 'json',
                                                cache: false,
                                                url: '/public/controls/selector/member/selector.member.query.jsp',
                                                data: {
                                                    "term": value,
                                                    "dept": true,
                                                    "post": true,
                                                    "person": true
                                                },
                                                success: function (results) {
                                                    callback(results);
                                                }
                                            });
                                        }
                                    },
                                    button: {
                                        text: "选择成员",
                                        icon: "glyphicon glyphicon-option-vertical"
                                    }})
                                .tagsinput("putTag", [
                                    {"id": "1", "text": "text1", "path": "path1"},
                                    {"id": "2", "text": "text2", "path": "path2"},
                                    {"id": "1", "text": "text11", "path": "path11"},
                                    {"id": "3", "text": "text3", "path": "path3"}
                                ]);
                    });
                </script>
            </div>
        </div>
        <br/><br/><br/><br/>

        <div>
            <h3>Example 2</h3>

            <p></p>

            <div>
                <div id="testTagsinput2"/>
                <script type="text/javascript">
                    $(document).ready(function () {
                        $("#testTagsinput2")
                                .tagsinput({
                                    idKey: "id",
                                    displayKey: "text",
                                    input: null,
                                    button: "select"})
                                .tagsinput("putMenu", [
                                    {"id": "1", "text": "text1"},
                                    {"id": "2", "text": "text2"},
                                    {"id": "1", "text": "text11"},
                                    {"id": "3", "text": "text3"},
                                    {"id": "4", "text": "text4"},
                                    {"id": "5", "text": "text5"},
                                    {"id": "6", "text": "text6"},
                                    {"id": "7", "text": "text7"},
                                    {"id": "8", "text": "text8"}
                                ]);
                    });
                </script>
            </div>
        </div>
        <br/><br/>
        <button onclick="javascript:$('.eiis-member').prop('disabled',!$('.eiis-member').prop('disabled'))">member
        </button>
        <input class="eiis-member"/>


    </master:Content>
</master:ContentPage>
