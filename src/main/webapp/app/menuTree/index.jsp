<%@ page import="eiis.app.type.entity.TypeSelectEntity" %>
<%@ page import="eiis.app.type.service.AppTypeDetailService" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ page import="eiis.core.menuUrl.service.CoreMenuUrlService" %>
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

    StringBuffer sb = CoreMenuUrlService.getInstance().getMenuUrlOptions(false);
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
                                <button onclick="add_main()" type="button" class="btn btn-success" id="add_main">
                                    <i class="glyphicon glyphicon-plus"></i> 新增
                                </button>
                                <button onclick="edit_main()" type="button" class="btn btn-warning" id="edit_main">
                                    <i class="glyphicon glyphicon-edit"></i>修改
                                </button>
                                <button onclick="delete_main()" type="button" class="btn btn-danger" id="delete_main">
                                    <i class="glyphicon glyphicon-trash"></i> 删除
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body" id="my_modal">
                        <input name="parentId" type="hidden"/>
                        <input name="menuId" type="hidden"/>
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-12">
                                <div>标题：</div>
                                <div>
                                    <input class="form-control" name="title" type="text" placeholder="请输入标题" required="required" />
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12">
                                <div>菜单路径：</div>
                                <div>
                                    <select class="form-control" name="year" required="required" onfocus="sz_border(this)" required="required">
                                        <%=sb.toString()%>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12">
                                <div>菜单图标：</div>
                                <div>
                                    <input class="form-control" name="icon" type="text" />
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12">
                                <div>是否显示：</div>
                                <div>
                                    <input class="form-control" name="isShow" type="checkbox" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer">
                        <button type="button" class="btn btn-primary" onclick="save_main()"><i class="glyphicon glyphicon-floppy-save"></i>保存</button>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="js/index.js"></script>
    </master:Content>
</master:ContentPage>
