<%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 2020/3/11
  Time: 10:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="master" uri="util.masterPage" %>

<%
    String title = "房屋";
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.bootstrap.BootstrapTable);

        </script>
        <%--<link href="/app/cost/css_js/index.css" rel="stylesheet"/>--%>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row" id="info">
                    <div class="col-md-6" style="text-align: left;">
                        <h5>楼层总数</h5>
                        <input type="text" class="form-control" required="required" id="i"/>
                    </div>
                    <div class="col-md-6" style="text-align: left;">
                        <h5>每层户数</h5>
                        <input type="text" class="form-control" onblur="leave()" required="required" id="j"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default need-nav">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12" style="text-align: left;" id="test">

                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12" style="text-align: center;">
                        <button type="submit" id="sub" class="btn btn-primary" onclick="save_main()" ><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
                    </div>
                </div>
            </div>
        </div>



        <div name="modal_home" style="display: none" class="aa">
            <h5></h5>
            <input type="text" class="form-control" data-attr="">
        </div>


        <div class="col-md-12">
            <!--表格-->
            <div id="myTableTest"></div>
        </div>
        <script src="css_js/index.js" type="text/javascript"></script>
    </master:Content>
</master:ContentPage>
