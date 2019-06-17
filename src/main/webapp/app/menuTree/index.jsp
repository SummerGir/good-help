<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/31
  Time: 15:09
  To change this template use File | Settings | File Templates.
--%>
<%


    String menuCode = "menu_tree";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <script type="text/javascript">
            GoodHelper.Loading(GoodHelper.Common.EasyUI);
        </script>
        <link rel="stylesheet" type="text/css" href="/app/menuTree/css/tree.css" />
        <link rel="stylesheet" type="text/css" href="/app/menuTree/css/index.css" />
    </master:Content>
    <master:Content contentPlaceHolderId="body">

        <div class="row" style="margin-top: 15px;">
            <div class="col-xs-12 col-sm-4 col-md-4">
                <div class="panel panel-default" id="left_div">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-sm-12">
                                <button onclick="reset_tree()" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-refresh"></i>刷新
                                </button>
                                <button onclick="move_tree(true)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-refresh"></i>上移
                                </button>
                                <button onclick="move_tree(false)" type="button" class="btn btn-primary">
                                    <i class="glyphicon glyphicon-refresh"></i>下移
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <ul id="member_tree" class="easyui-tree"></ul>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-8 col-md-8">
                <div class="panel panel-default " id="right_div">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-sm-12">

                            </div>
                        </div>
                    </div>
                    <div class="panel-body">

                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="js/index.js"></script>
    </master:Content>
</master:ContentPage>
