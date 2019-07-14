<%@ page import="eiis.context.CurrentApplicationTemplate" %>
<%@ page import="eiis.util.jquery.AppTreeNode" %>
<%@ page import="eiis.sys.userSetting.SysUserSettingData" %>
<%@ page import="eiis.app.projectinfo.service.ProjectInfoService" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String code = "projectReport";//projectReport
    AppTreeNode appTreeNode = CurrentApplicationTemplate.getAppTreeNodeByCode(code);
    String itemId = appTreeNode==null?"":appTreeNode.getTemplateItemId();
    String projectId = SysUserSettingData.getInstance().getData(new String[]{"poto", "todady"});
    if(projectId==null){
        projectId="";
    }
    String projectName = ProjectInfoService.getInstance().getProjectNames(projectId.split(","));
    List<String> nameList = StringUtils.isBlank(projectName)?null:Arrays.asList(projectName.substring(0,projectName.length()-1).split(" "));
%>
<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.jQuery.select240);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.easyui);
    var code = "<%=code%>";
    var itemId_plan = "<%=itemId%>";
    var projectId_todady = "<%=projectId==null?"":projectId%>";
</script>
<style type="text/css">
    .todayNodePlan{
        border-top: 2px solid rgba(30,141,237,0.3);
    }
    .todayNodePlan .contentArea{
        min-height: 179px;
    }
    .todayNodePlan .todayNodeName>span{
        cursor: default;
    }
    .todayNodePlan .project_name{font-size: 12px;color: #919191;padding-left: 10px;font-weight: normal;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;display: block;}
    .todayNodePlan .icon-shezhi1{cursor: pointer;position: absolute;color: #ababab;font-size: 18px;top: 0;right: 5px;}
</style>
<div class="todayNodePlan homeModule">
    <div class="homeHead">
        <span class="title" style="float: left;">今日节点计划</span>
        <span class="project_name"><%=nameList==null?"全部项目部":nameList.get(0)+"等"+nameList.size()+"个项目部"%></span>
        <i class="setting iconfont icon-shezhi1"></i>
    </div>
    <div class="homeBody">
        <div class="contentWrapper">
            <div class="contentArea"></div>
        </div>
    </div>
    <%--弹框--%>
    <div class="modal dialog_todayNodePlan_project" style="display: none;" aria-hidden="true" data-backdrop="static">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3 class="modal-title">项目部</h3>
        </div>
        <div class="panel-body" style="padding: 10px;">
            <div id="poto_todady_tree"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>
            <button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>
        </div>
    </div>
</div>
<script type="application/javascript">
    !function(){
        var todayNodePlan;
        var table;
        var isGet = false;
        var planData;
        $(function(){
            todayNodePlan=$(".todayNodePlan");
            table=todayNodePlan.find(".contentArea").homeTable({
                headBGColor : '#d3f8eb',
                columns : [
                    {field:'taskName',title:'节点计划名称',width:'60%',align:'left',color:'#000000',overflow:true,formatter: function (value, row){
                            var color;
                            if(row.colorState===0){
                                color="#c7c7c7";
                            }else if(row.colorState===1){
                                color="#2dcc72";
                            }else if(row.colorState===2){
                                color="#ffa338";
                            }else{
                                color="#ff6238";
                            }
                            return '<div class="todayNodeName" title="'+row.projectName+'"><div style="background-color: '+color+';display: inline-block;width: 8px;height: 8px;"></div><span style="margin-left: 4px;">'+value+'</span></div>';
                        }},
                    {field:'nodeLevel',title:'节点等级',width:'10%',align:'center',color:'#919191'},
                    {field:'expectTime',title:'预计完成',width:'18%',align:'center',color:'#919191'},
                    {field:'memberName',title:'责任人员',width:'12%',align:'center',color:'#919191'}
                ]
            });
            table.loading();
            $.ajax({
                type : "post",
                url : "/public/homepage/getTodayProgress.do",
                data : {code: code},
                dataType : "json",
                success : function(msg){
                    planData = msg;
                    table.setData(projectId_todady?searchByProject(projectId_todady):msg);
                    table.loaded();
                    if(!projectId_todady)
                        $(".todayNodePlan .project_name").text("全部项目部");
                }
            });
            //项目部收缩弹框
            $(".todayNodePlan .icon-shezhi1").on("click", function () {
                if(typeof contextRight=='function') {
                    var projectArray = [];
                    if (!isGet) projectArray = getProject();
                    $(".modal.dialog_todayNodePlan_project").modal();
                    loadProjectTree($("#poto_todady_tree"), projectArray, projectId_todady);
                    $(".modal.dialog_todayNodePlan_project").modal("hide");
                    $(".modal.dialog_todayNodePlan_project").modal();
                }else{
                    require(["jquery.easyuiJs"], function () {
                        var projectArray = [];
                        if (!isGet) projectArray = getProject();
                        $(".modal.dialog_todayNodePlan_project").modal();
                        loadProjectTree($("#poto_todady_tree"), projectArray, projectId_todady);
                        $(".modal.dialog_todayNodePlan_project").modal("hide");
                        $(".modal.dialog_todayNodePlan_project").modal();
                    })
                }
            })
            $(".todayNodePlan .btn-primary").on("click", function () {
                $(".modal.dialog_todayNodePlan_project").modal("hide");
                var checkedNodes = project_tree.treegrid("getCheckedNodes");
                var projectIds = [], projectName = [];
                if(checkedNodes && checkedNodes.length>0){
                    var all_p = false;
                    for(var v=0;v<checkedNodes.length;v++){
                        if(checkedNodes[v].projectId=="0000"){
                            all_p = true;
                        }else{
                            projectIds.push(checkedNodes[v].projectId);
                            projectName.push(checkedNodes[v].projectName);
                        }
                    }
                    if(all_p)projectName = ["全部项目部"];
                }
                $(".todayNodePlan .project_name").text(projectName.length==0?"":all_p?projectName.join(","):projectName[0]+"等"+projectName.length+"个项目部");
                projectId_todady = projectIds.join(",");
                table.setData(searchByProject(projectId_todady));
                table.loaded();
                $.post("/public/homepage/saveProjectJY.do",{
                    key: "poto,todady",
                    value: projectId_todady
                },function () {

                },"json")
            })
            var project_tree;
            function loadProjectTree(node, dataArray, def) {
                if(!project_tree) {
                    project_tree = node.treegrid({
                        idField: 'projectId',
                        treeField: 'projectName',
                        width: '100%',
                        height: '320px',
                        striped: true,
                        singleSelect: true,
                        checkbox: true,
                        columns: [
                            [{
                                field: "projectName",
                                title: "项目部",
                                width: '100%',
                                align: 'left'
                            }]
                        ],
                        onClickRow: function (row) {
                            project_tree.treegrid("checkNode", row.projectId);
                        }
                    })
                    project_tree.treegrid("loadData", [{projectId: "0000", projectName: "全部项目部", children: dataArray}]);
                    if(def) {
                        var defIdArray = def.split(",");
                        for(var v=0;v<defIdArray.length;v++) {
                            project_tree.treegrid("checkNode", defIdArray[v]);
                        }
                    }else{
                        for(var v=0;v<dataArray.length;v++) {
                            project_tree.treegrid("checkNode", dataArray[v].projectId);
                        }
                    }
                }
            }
            function getProject() {
                var projectArray = [];
                $.ajax({
                    async:false,dataType:'json',type:'post',
                    url: "/app/projectmoney/pay/getProjectByItem.do",
                    data: {itemId: "", code: code},
                    success:function(data){
                        isGet = true;
                        for(var v=0;v<data.projects.length;v++){
                            projectArray.push({projectId: data.projects[v].projectId, projectName: data.projects[v].projectName});
                        }
                    }
                })
                return projectArray;
            }
            function searchByProject(projectId) {
                if(!projectId)return planData;
                var planArray = [];
                for(var v=0;v<planData.rows.length;v++){
                    if(projectId.indexOf(planData.rows[v].projectId)!=-1)
                        planArray.push(planData.rows[v]);
                }
                return {rows: planArray};
            }
        });
    }();
</script>