<%@ page import="eiis.context.Context" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ taglib prefix="master" uri="eiis.masterpage" %>
<%--
  Created by IntelliJ IDEA.
  User: sk
  Date: 2016/3/25
  Time: 9:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String random = Long.toString(System.currentTimeMillis());
    String fileName = request.getParameter("fileName");
    String htmldisplayUri = request.getParameter("displayUri");
    String quarry = request.getParameter("quarry");
    String mainId = request.getParameter("mainId");
    String mainName = request.getParameter("mainName");
    if(StringUtils.isBlank(mainId)){
        mainId ="";
    }
    if(StringUtils.isBlank(mainName)){
        mainName ="";
    }
    //判断是否添加打印邮箱
    int emailCount = eiis.util.print.printutil.emailCount();

    //打印设备列表
    StringBuffer deviceOp = new StringBuffer();
    deviceOp = eiis.util.print.printutil.printDeviceOption();
    String materPageId = null;
    if (eiis.context.Context.getCurrent().getApplication().getTemplateItem() == null) {
        materPageId = "_blank";
    }
    if(Context.getCurrent().isPhone()){
        materPageId = "_app";
    }
%>
<style type="text/css">
    .box {
        height: 100%;
    }
</style>
<master:ContentPage materPageId="<%=materPageId%>">
    <master:Content contentPlaceHolderId="title"><%=fileName%>
    </master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            EIIS.Common.loadComponent(EIIS.Common.UI);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.message);
            EIIS.Common.loadComponent(EIIS.Common.jQuery.form);
        </script>
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <div class="box">
            <iframe id="pc_view<%=random%>" src="<%=htmldisplayUri%>" scrolling="auto" frameborder="0" width="100%"
                    height="100%"></iframe>
        </div>

        <%--邮箱列表弹出框--%>
        <div id="select_email_column<%=random%>" class="modal" data-width="300px" tabindex="-1" aria-hidden="true"
             data-backdrop="static">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h3 class="modal-title">
                    <span style="font-weight: bold;">请选择打印设备</span>
                </h3>
            </div>
            <div class="panel-body form-horizontal" id="email_form<%=random%>">
                <div class="row">
                    <div class="col-xs-12 col-md-11">
                        <h5>打印设备：</h5>
                        <select class="form-control" id="email_list<%=random%>">
                            <%=deviceOp.toString()%>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="email_submit();" type="button" class="btn btn-info">
                    <i class="fa fa-check"></i> 打印
                </button>
                <button type="button" class="eiis-button btn-default" data-dismiss="modal">
                    <i class="fa fa-times"></i> 取消
                </button>
            </div>
        </div>
        <script type="application/javascript">
            $(document).ready(function () {

                //根据打印类型来显示需要的按钮
                //pc端
                if(!EIIS.browser.phone){
                    $(".container").css("width", "100%");
                    var printBtn = $("<button type='button' id='print<%=random%>' class='btn' style='background-color: #F8F8F8'> <i class='glyphicon glyphicon-print' style='font-size: 20px;' ></i> </button>");
                    var closeBtn = $("<button type='button' id='close<%=random%>' class='btn'style='background-color: #F8F8F8'> <i class='fa fa-times' style='font-size: 25px;' ></i> </button>");
                    $(".btn-danger").hide();
                    $(".navbar-right-ribbon").append(printBtn).append(closeBtn);
                    printBtn.on("click", function () {
                        output_type('networkPrint');
                    });
                    closeBtn.on("click",function(){
                        javascript:closeSelf();
                    })
                }else {
                    if('<%=quarry%>' != "attachment"){ //判断是否为附件的预览
                        $("#master_option").show()
                        $("#master_option").find("i").removeClass().addClass("glyphicon glyphicon-print");
                        $("#master_option").html("打印").on("click", function () {
                            output_type('networkPrint');
                        });
                    }
                }
                var data = {
                    code:"esgApp_function",
                    fname:"window_resize"
                };
                sendRequest(data);
            });

            //横屏竖屏，宽高调节
            function onWindowResize(param){
                var width = param.width;
                var height = parseInt(param.height)-51;

                //列表页
                $(".contain").height(height);
                $(".container").width(width);

            }
            //移动端的返回
            function back_(){
                window.history.back();
            }
            function output_type(type) {
                if (type == "networkPrint") {
                    if ("<%=emailCount%>" == 0) {
                        $.message("请先添加打印设备！");
                        return;
                    }
                    $("#select_email_column<%=random%>").modal();
                } else {
                    $.message.loader.open();
                    $.post("/anon/changefiletype/getUriFromPreView.do", {
                        htmldisplayUri: '<%=htmldisplayUri%>',
                        email: "",
                    }, function (rs) {
                        $.message.loader.close();
                        if (rs.flag) {
                            window.location.href = rs.downloadUri;
                        } else {
                            $.message("操作失败");
                        }
                    }, "json");
                }
            }

            // 选择邮箱
            function email_submit() {
                var email = $("#email_list<%=random%>").find("option:selected").val();
                if (email == "") {
                    $.message("请选择打印设备！")
                    return;
                }
                $.message.loader.open();
                $.post("/anon/changefiletype/getUriFromPreView.do", {
                    htmldisplayUri: '<%=htmldisplayUri%>',
                    email: email,
                }, function (rs) {
                    $.message.loader.close();
                    if (rs.flag) {
                        //保存打印信息
                        if('<%=mainId%>' != "" && '<%=mainName%>' != ""){
                            $.post("/file/printstate/saveStateInfo.do",{
                                mainId:'<%=mainId%>',
                                mainName:'<%=mainName%>',
                            },function(res){},"json");
                        }

                        $("#select_email_column<%=random%>").modal("hide");
                        $.message("操作成功");
                    } else {
                        $.message("操作失败");
                    }
                }, "json");
            }
        </script>

    </master:Content>
</master:ContentPage>
