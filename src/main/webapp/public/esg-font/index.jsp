<%@ page import="util.context.Context" %>
<%@ page import="eiis.core.menuTree.entity.CoreMenuTreeInfoEntity" %>
<%@ taglib prefix="master" uri="util.masterPage" %>
<%--
  Created by IntelliJ IDEA.
  User: xiucai
  Date: 2017/10/23
  Time: 16:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String menuCode = "xtgl_esgtbk";
    CoreMenuTreeInfoEntity menuTree = Context.getMenuTree(menuCode);
    String title = menuTree.getTitle();
%>
<master:ContentPage>
    <master:Content contentPlaceHolderId="title"><%=title%></master:Content>
    <master:Content contentPlaceHolderId="head">
        <link rel="stylesheet" href="demo.css">
        <style type="text/css">
        </style>
    </master:Content>
    <master:Content contentPlaceHolderId="body">
        <div class="panel panel-default">
            <div class="panel-body main markdown">
                <h3>Esg 图标</h3><hr>
                <ul class="icon_lists clear">

                    <li>
                        <i class="icon esg-font icon-yasuo"></i>
                        <div class="name">文件</div>
                        <div class="fontclass">.icon-yasuo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shipin"></i>
                        <div class="name">文件格式-avi</div>
                        <div class="fontclass">.icon-shipin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yinpin"></i>
                        <div class="name">文件格式-mp3</div>
                        <div class="fontclass">.icon-yinpin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-word"></i>
                        <div class="name">WORD</div>
                        <div class="fontclass">.icon-word</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-excel"></i>
                        <div class="name">EXCLE</div>
                        <div class="fontclass">.icon-excel</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-ppt"></i>
                        <div class="name">PPT</div>
                        <div class="fontclass">.icon-ppt</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-pdf"></i>
                        <div class="name">PDF</div>
                        <div class="fontclass">.icon-pdf</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fenxiang"></i>
                        <div class="name">分享</div>
                        <div class="fontclass">.icon-fenxiang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jinggao"></i>
                        <div class="name">警告</div>
                        <div class="fontclass">.icon-jinggao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xinxi"></i>
                        <div class="name">信息</div>
                        <div class="fontclass">.icon-xinxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-txt"></i>
                        <div class="name">TXT格式</div>
                        <div class="fontclass">.icon-txt</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-logo"></i>
                        <div class="name">e施工Logo</div>
                        <div class="fontclass">.icon-logo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shuqingkejilogo"></i>
                        <div class="name">shuqingkejilogo</div>
                        <div class="fontclass">.icon-shuqingkejilogo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouye"></i>
                        <div class="name">首页</div>
                        <div class="fontclass">.icon-shouye</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shezhi"></i>
                        <div class="name">设置</div>
                        <div class="fontclass">.icon-shezhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-guanbi"></i>
                        <div class="name">关闭</div>
                        <div class="fontclass">.icon-guanbi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zaixian"></i>
                        <div class="name">在线</div>
                        <div class="fontclass">.icon-zaixian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiaoxi"></i>
                        <div class="name">消息</div>
                        <div class="fontclass">.icon-xiaoxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendang"></i>
                        <div class="name">文档</div>
                        <div class="fontclass">.icon-wendang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shangchu"></i>
                        <div class="name">删除</div>
                        <div class="fontclass">.icon-shangchu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-sousuo"></i>
                        <div class="name">搜索</div>
                        <div class="fontclass">.icon-sousuo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xieyoujian"></i>
                        <div class="name">写邮件</div>
                        <div class="fontclass">.icon-xieyoujian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jichubangong"></i>
                        <div class="name">基础办公</div>
                        <div class="fontclass">.icon-jichubangong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jihua"></i>
                        <div class="name">计划</div>
                        <div class="fontclass">.icon-jihua</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-hetongguanli"></i>
                        <div class="name">合同管理</div>
                        <div class="fontclass">.icon-hetongguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shengpi"></i>
                        <div class="name">审批</div>
                        <div class="fontclass">.icon-shengpi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-daiban"></i>
                        <div class="name">待办</div>
                        <div class="fontclass">.icon-daiban</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongzhi"></i>
                        <div class="name">通知</div>
                        <div class="fontclass">.icon-tongzhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-baobiaoguanli"></i>
                        <div class="name">报表管理</div>
                        <div class="fontclass">.icon-baobiaoguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yewuzhongxin"></i>
                        <div class="name">业务中心</div>
                        <div class="fontclass">.icon-yewuzhongxin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-guanliyuancaozuo"></i>
                        <div class="name">管理员操作</div>
                        <div class="fontclass">.icon-guanliyuancaozuo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xialatubiao"></i>
                        <div class="name">下拉图标</div>
                        <div class="fontclass">.icon-xialatubiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xinzeng"></i>
                        <div class="name">新增</div>
                        <div class="fontclass">.icon-xinzeng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-caidan"></i>
                        <div class="name">菜单</div>
                        <div class="fontclass">.icon-caidan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiugai"></i>
                        <div class="name">修改</div>
                        <div class="fontclass">.icon-xiugai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiazaibaocun"></i>
                        <div class="name">下载保存</div>
                        <div class="fontclass">.icon-xiazaibaocun</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shangchuanwenjian"></i>
                        <div class="name">上传文件</div>
                        <div class="fontclass">.icon-shangchuanwenjian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongxunlu"></i>
                        <div class="name">通讯录</div>
                        <div class="fontclass">.icon-tongxunlu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-guanliyuan"></i>
                        <div class="name">管理员</div>
                        <div class="fontclass">.icon-guanliyuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yonhu"></i>
                        <div class="name">用户</div>
                        <div class="fontclass">.icon-yonhu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongjifenxi"></i>
                        <div class="name">统计分析</div>
                        <div class="fontclass">.icon-tongjifenxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wodegongzuoliu"></i>
                        <div class="name">我的工作流</div>
                        <div class="fontclass">.icon-wodegongzuoliu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gerenxinxi"></i>
                        <div class="name">个人信息</div>
                        <div class="fontclass">.icon-gerenxinxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongzhigonggao"></i>
                        <div class="name">通知公告</div>
                        <div class="fontclass">.icon-tongzhigonggao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhuanxierizhi"></i>
                        <div class="name">撰写日志</div>
                        <div class="fontclass">.icon-zhuanxierizhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rizhi"></i>
                        <div class="name">日志</div>
                        <div class="fontclass">.icon-rizhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chayuerizhi"></i>
                        <div class="name">查阅日志</div>
                        <div class="fontclass">.icon-chayuerizhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chengyuanguanli"></i>
                        <div class="name">成员管理</div>
                        <div class="fontclass">.icon-chengyuanguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wodericheng"></i>
                        <div class="name">我的日程</div>
                        <div class="fontclass">.icon-wodericheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richenganpai"></i>
                        <div class="name">日程安排</div>
                        <div class="fontclass">.icon-richenganpai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richeng"></i>
                        <div class="name">日程</div>
                        <div class="fontclass">.icon-richeng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chayuericheng"></i>
                        <div class="name">查阅日程</div>
                        <div class="fontclass">.icon-chayuericheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-huiyijiyao"></i>
                        <div class="name">会议纪要</div>
                        <div class="fontclass">.icon-huiyijiyao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-qita"></i>
                        <div class="name">其他</div>
                        <div class="fontclass">.icon-qita</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yibanrenwu"></i>
                        <div class="name">一般任务</div>
                        <div class="fontclass">.icon-yibanrenwu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-daibanrenwu"></i>
                        <div class="name">待办任务</div>
                        <div class="fontclass">.icon-daibanrenwu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaopinpai"></i>
                        <div class="name">材料平台</div>
                        <div class="fontclass">.icon-cailiaopinpai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chengyuanyingyonchakanqi"></i>
                        <div class="name">成员应用查看器</div>
                        <div class="fontclass">.icon-chengyuanyingyonchakanqi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chuchai"></i>
                        <div class="name">出差</div>
                        <div class="fontclass">.icon-chuchai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yonhuxinxipingtai"></i>
                        <div class="name">用户信息平台</div>
                        <div class="fontclass">.icon-yonhuxinxipingtai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laiwangdanweipingtai"></i>
                        <div class="name">来往单位平台</div>
                        <div class="fontclass">.icon-laiwangdanweipingtai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xitonggongju"></i>
                        <div class="name">系统工具</div>
                        <div class="fontclass">.icon-xitonggongju</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zaixianyonhu"></i>
                        <div class="name">在线用户</div>
                        <div class="fontclass">.icon-zaixianyonhu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xuexiyuandi"></i>
                        <div class="name">学习园地</div>
                        <div class="fontclass">.icon-xuexiyuandi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongsilei"></i>
                        <div class="name">公司类</div>
                        <div class="fontclass">.icon-gongsilei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidian"></i>
                        <div class="name">字典</div>
                        <div class="fontclass">.icon-zidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weituoguanxiguanli"></i>
                        <div class="name">委托关系管理</div>
                        <div class="fontclass">.icon-weituoguanxiguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kuaijieyingyon"></i>
                        <div class="name">快捷应用</div>
                        <div class="fontclass">.icon-kuaijieyingyon</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yoncheguanli"></i>
                        <div class="name">用车管理</div>
                        <div class="fontclass">.icon-yoncheguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqinliuchengtongji"></i>
                        <div class="name">考勤流程统计</div>
                        <div class="fontclass">.icon-kaoqinliuchengtongji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yingyonchengxumuban"></i>
                        <div class="name">应用程序模板</div>
                        <div class="fontclass">.icon-yingyonchengxumuban</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiaban"></i>
                        <div class="name">加班</div>
                        <div class="fontclass">.icon-jiaban</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weizhi"></i>
                        <div class="name">位置</div>
                        <div class="fontclass">.icon-weizhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongyi"></i>
                        <div class="name">同意</div>
                        <div class="fontclass">.icon-tongyi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jujue"></i>
                        <div class="name">拒绝</div>
                        <div class="fontclass">.icon-jujue</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouhui"></i>
                        <div class="name">收回</div>
                        <div class="fontclass">.icon-shouhui</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xingzhengbangongguanli"></i>
                        <div class="name">行政办公管理</div>
                        <div class="fontclass">.icon-xingzhengbangongguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-dayinchulijian"></i>
                        <div class="name">打印处理笺</div>
                        <div class="fontclass">.icon-dayinchulijian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidianxinxipingtai"></i>
                        <div class="name">字典信息平台</div>
                        <div class="fontclass">.icon-zidianxinxipingtai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongwen"></i>
                        <div class="name">公文</div>
                        <div class="fontclass">.icon-gongwen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangmu"></i>
                        <div class="name">项目</div>
                        <div class="fontclass">.icon-xiangmu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaochangjia"></i>
                        <div class="name">材料厂家</div>
                        <div class="fontclass">.icon-cailiaochangjia</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-suishoupai"></i>
                        <div class="name">随手拍</div>
                        <div class="fontclass">.icon-suishoupai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-mima"></i>
                        <div class="name">密码</div>
                        <div class="fontclass">.icon-mima</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wodejihua"></i>
                        <div class="name">我的计划</div>
                        <div class="fontclass">.icon-wodejihua</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-huiyijiyao1"></i>
                        <div class="name">会议纪要</div>
                        <div class="fontclass">.icon-huiyijiyao1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-ziyuanxinxipingtai"></i>
                        <div class="name">资源信息平台</div>
                        <div class="fontclass">.icon-ziyuanxinxipingtai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-liuchengchaoqitongji"></i>
                        <div class="name">流程超期统计</div>
                        <div class="fontclass">.icon-liuchengchaoqitongji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaokufang"></i>
                        <div class="name">材料库房</div>
                        <div class="fontclass">.icon-cailiaokufang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhiduliucheng"></i>
                        <div class="name">制度流程</div>
                        <div class="fontclass">.icon-zhiduliucheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-moban"></i>
                        <div class="name">权限设置</div>
                        <div class="fontclass">.icon-moban</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-moban1"></i>
                        <div class="name">申请加班</div>
                        <div class="fontclass">.icon-moban1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-suishouji"></i>
                        <div class="name">随手记</div>
                        <div class="fontclass">.icon-suishouji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaotong"></i>
                        <div class="name">材料通</div>
                        <div class="fontclass">.icon-cailiaotong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowutong"></i>
                        <div class="name">劳务通</div>
                        <div class="fontclass">.icon-laowutong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixietong"></i>
                        <div class="name">机械通</div>
                        <div class="fontclass">.icon-jixietong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulintong"></i>
                        <div class="name">租赁通</div>
                        <div class="fontclass">.icon-zulintong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijintong"></i>
                        <div class="name">资金通</div>
                        <div class="fontclass">.icon-zijintong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefei"></i>
                        <div class="name">间接费</div>
                        <div class="fontclass">.icon-jianjiefei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijinbaobiao"></i>
                        <div class="name">资金报表</div>
                        <div class="fontclass">.icon-zijinbaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaobaobiao"></i>
                        <div class="name">材料报表</div>
                        <div class="fontclass">.icon-cailiaobaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowubaobiao"></i>
                        <div class="name">劳务报表</div>
                        <div class="fontclass">.icon-laowubaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinbaobiao"></i>
                        <div class="name">租赁报表</div>
                        <div class="fontclass">.icon-zulinbaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiebaobiao"></i>
                        <div class="name">机械报表</div>
                        <div class="fontclass">.icon-jixiebaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeibaobiao"></i>
                        <div class="name">间接费报表</div>
                        <div class="fontclass">.icon-jianjiefeibaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhengcefagui"></i>
                        <div class="name">政策法规</div>
                        <div class="fontclass">.icon-zhengcefagui</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaohetong"></i>
                        <div class="name">材料合同</div>
                        <div class="fontclass">.icon-cailiaohetong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowuhetong"></i>
                        <div class="name">劳务合同</div>
                        <div class="fontclass">.icon-laowuhetong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiehetong"></i>
                        <div class="name">机械合同</div>
                        <div class="fontclass">.icon-jixiehetong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinhetong"></i>
                        <div class="name">租赁合同</div>
                        <div class="fontclass">.icon-zulinhetong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-qitafei"></i>
                        <div class="name">其他费</div>
                        <div class="fontclass">.icon-qitafei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-guanlifei"></i>
                        <div class="name">管理费</div>
                        <div class="fontclass">.icon-guanlifei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-guifei"></i>
                        <div class="name">规费</div>
                        <div class="fontclass">.icon-guifei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongwenyinzhangguanli"></i>
                        <div class="name">公文印章管理</div>
                        <div class="fontclass">.icon-gongwenyinzhangguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-sanyuan"></i>
                        <div class="name">三圆</div>
                        <div class="fontclass">.icon-sanyuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-baobiaozhouqishezhi"></i>
                        <div class="name">报表周期设置</div>
                        <div class="fontclass">.icon-baobiaozhouqishezhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gerenyingyon"></i>
                        <div class="name">个人应用</div>
                        <div class="fontclass">.icon-gerenyingyon</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-anniuguanli"></i>
                        <div class="name">按钮管理</div>
                        <div class="fontclass">.icon-anniuguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendangbianhaoshiyonjilu"></i>
                        <div class="name">文档编号使用记录</div>
                        <div class="fontclass">.icon-wendangbianhaoshiyonjilu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendangziguanli"></i>
                        <div class="name">文档字管理</div>
                        <div class="fontclass">.icon-wendangziguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianqie"></i>
                        <div class="name">剪切</div>
                        <div class="fontclass">.icon-jianqie</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouquanguanli"></i>
                        <div class="name">授权管理</div>
                        <div class="fontclass">.icon-shouquanguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fuzhi"></i>
                        <div class="name">复制</div>
                        <div class="fontclass">.icon-fuzhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chongmingming"></i>
                        <div class="name">重命名</div>
                        <div class="fontclass">.icon-chongmingming</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shangyi"></i>
                        <div class="name">上移</div>
                        <div class="fontclass">.icon-shangyi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiayi"></i>
                        <div class="name">下移</div>
                        <div class="fontclass">.icon-xiayi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shujukuyunxingqingkuang"></i>
                        <div class="name">数据库运行情况</div>
                        <div class="fontclass">.icon-shujukuyunxingqingkuang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tiaomu"></i>
                        <div class="name">条目</div>
                        <div class="fontclass">.icon-tiaomu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yidongweizhi"></i>
                        <div class="name">移动位置</div>
                        <div class="fontclass">.icon-yidongweizhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-baocun"></i>
                        <div class="name">保存</div>
                        <div class="fontclass">.icon-baocun</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yulan"></i>
                        <div class="name">预览</div>
                        <div class="fontclass">.icon-yulan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-quanjudaibantongji"></i>
                        <div class="name">全局待办统计</div>
                        <div class="fontclass">.icon-quanjudaibantongji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-dingeduibiaoxiang"></i>
                        <div class="name">定额对标项</div>
                        <div class="fontclass">.icon-dingeduibiaoxiang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiliangdanwei"></i>
                        <div class="name">计量单位</div>
                        <div class="fontclass">.icon-jiliangdanwei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangxixinxi"></i>
                        <div class="name">详细信息</div>
                        <div class="fontclass">.icon-xiangxixinxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-bianji"></i>
                        <div class="name">编辑</div>
                        <div class="fontclass">.icon-bianji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhipai"></i>
                        <div class="name">指派</div>
                        <div class="fontclass">.icon-zhipai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-liuchenggenzon"></i>
                        <div class="name">流程跟踪</div>
                        <div class="fontclass">.icon-liuchenggenzon</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yingyonchengxuku"></i>
                        <div class="name">应用程序库</div>
                        <div class="fontclass">.icon-yingyonchengxuku</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-liuchengshejiqi"></i>
                        <div class="name">流程设计器</div>
                        <div class="fontclass">.icon-liuchengshejiqi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-mobaner"></i>
                        <div class="name">页面设计器</div>
                        <div class="fontclass">.icon-mobaner</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaozidian"></i>
                        <div class="name">材料字典</div>
                        <div class="fontclass">.icon-cailiaozidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowuzidian"></i>
                        <div class="name">劳务字典</div>
                        <div class="fontclass">.icon-laowuzidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinzidian"></i>
                        <div class="name">租赁字典</div>
                        <div class="fontclass">.icon-zulinzidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiangchengzidian"></i>
                        <div class="name">奖惩字典</div>
                        <div class="fontclass">.icon-jiangchengzidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeiyonzidian"></i>
                        <div class="name">间接费用字典</div>
                        <div class="fontclass">.icon-jianjiefeiyonzidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixieshebeizidian"></i>
                        <div class="name">机械设备字典</div>
                        <div class="fontclass">.icon-jixieshebeizidian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidiandaoru"></i>
                        <div class="name">字典导入</div>
                        <div class="fontclass">.icon-zidiandaoru</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chengbenkemu"></i>
                        <div class="name">成本科目</div>
                        <div class="fontclass">.icon-chengbenkemu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shourukemu"></i>
                        <div class="name">收入科目</div>
                        <div class="fontclass">.icon-shourukemu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yewubaobiaoguanli"></i>
                        <div class="name">业务报表管理</div>
                        <div class="fontclass">.icon-yewubaobiaoguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongzuoriliguanli"></i>
                        <div class="name">工作日历管理</div>
                        <div class="fontclass">.icon-gongzuoriliguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-liuchengshiliguanli"></i>
                        <div class="name">流程实例管理</div>
                        <div class="fontclass">.icon-liuchengshiliguanli</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zaixianxitongfenxi"></i>
                        <div class="name">在线系统分析</div>
                        <div class="fontclass">.icon-zaixianxitongfenxi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-moban-copy"></i>
                        <div class="name">工作流</div>
                        <div class="fontclass">.icon-moban-copy</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-renshidangan-copy"></i>
                        <div class="name">人事档案</div>
                        <div class="fontclass">.icon-renshidangan-copy</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chengyuanshuxing-copy"></i>
                        <div class="name">成员属性</div>
                        <div class="fontclass">.icon-chengyuanshuxing-copy</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-dayinzhuangtai"></i>
                        <div class="name">打印状态</div>
                        <div class="fontclass">.icon-dayinzhuangtai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yueduhuizong"></i>
                        <div class="name">月度汇总 </div>
                        <div class="fontclass">.icon-yueduhuizong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-anjihuaruku"></i>
                        <div class="name">按计划入库</div>
                        <div class="fontclass">.icon-anjihuaruku</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wujihuaruku"></i>
                        <div class="name">无计划入库</div>
                        <div class="fontclass">.icon-wujihuaruku</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqin"></i>
                        <div class="name">签到</div>
                        <div class="fontclass">.icon-kaoqin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-dayin"></i>
                        <div class="name">打印状态</div>
                        <div class="fontclass">.icon-dayin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chengbenfeiyongtongji"></i>
                        <div class="name">成本费用统计</div>
                        <div class="fontclass">.icon-chengbenfeiyongtongji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaosuishouji"></i>
                        <div class="name">材料随手记</div>
                        <div class="fontclass">.icon-cailiaosuishouji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowusuishouji"></i>
                        <div class="name">劳务随手记</div>
                        <div class="fontclass">.icon-laowusuishouji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangmuzijinshourubaobiao"></i>
                        <div class="name">项目资金收入报表</div>
                        <div class="fontclass">.icon-xiangmuzijinshourubaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangmuzijinzhichubaobiao"></i>
                        <div class="name">项目资金支出报表</div>
                        <div class="fontclass">.icon-xiangmuzijinzhichubaobiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rukudanzigou"></i>
                        <div class="name">入库单（自购）</div>
                        <div class="fontclass">.icon-rukudanzigou</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rukudanjiagou"></i>
                        <div class="name">入库单（甲供）</div>
                        <div class="fontclass">.icon-rukudanjiagou</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-bangzhu"></i>
                        <div class="name">帮助</div>
                        <div class="fontclass">.icon-bangzhu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gouwuche1"></i>
                        <div class="name">购物车1</div>
                        <div class="fontclass">.icon-gouwuche1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gouwuche2"></i>
                        <div class="name">购物车2</div>
                        <div class="fontclass">.icon-gouwuche2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chenggong"></i>
                        <div class="name">成功</div>
                        <div class="fontclass">.icon-chenggong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rili"></i>
                        <div class="name">日历</div>
                        <div class="fontclass">.icon-rili</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tishi"></i>
                        <div class="name">提示</div>
                        <div class="fontclass">.icon-tishi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gengduo"></i>
                        <div class="name">更多</div>
                        <div class="fontclass">.icon-gengduo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fanhui"></i>
                        <div class="name">返回</div>
                        <div class="fontclass">.icon-fanhui</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-you"></i>
                        <div class="name">右</div>
                        <div class="fontclass">.icon-you</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zuo"></i>
                        <div class="name">左</div>
                        <div class="fontclass">.icon-zuo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-sousuo1"></i>
                        <div class="name">搜索</div>
                        <div class="fontclass">.icon-sousuo1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tianjia"></i>
                        <div class="name">添加</div>
                        <div class="fontclass">.icon-tianjia</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xuanzhong"></i>
                        <div class="name">选中</div>
                        <div class="fontclass">.icon-xuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weixuanzhong"></i>
                        <div class="name">未选中</div>
                        <div class="fontclass">.icon-weixuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weidu"></i>
                        <div class="name">未读</div>
                        <div class="fontclass">.icon-weidu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yidu"></i>
                        <div class="name">已读</div>
                        <div class="fontclass">.icon-yidu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weisousuodao"></i>
                        <div class="name">未搜索到</div>
                        <div class="fontclass">.icon-weisousuodao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tixingshijian"></i>
                        <div class="name">提醒时间</div>
                        <div class="fontclass">.icon-tixingshijian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cuicu"></i>
                        <div class="name">催促</div>
                        <div class="fontclass">.icon-cuicu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jinji"></i>
                        <div class="name">紧急</div>
                        <div class="fontclass">.icon-jinji</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zaiban"></i>
                        <div class="name">在办</div>
                        <div class="fontclass">.icon-zaiban</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fangzi"></i>
                        <div class="name">房子</div>
                        <div class="fontclass">.icon-fangzi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqinshensu"></i>
                        <div class="name">考勤申诉</div>
                        <div class="fontclass">.icon-kaoqinshensu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-qingjia"></i>
                        <div class="name">请假</div>
                        <div class="fontclass">.icon-qingjia</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-diaoxiu"></i>
                        <div class="name">调休</div>
                        <div class="fontclass">.icon-diaoxiu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-waichushenqing"></i>
                        <div class="name">外出申请</div>
                        <div class="fontclass">.icon-waichushenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongsigongwen"></i>
                        <div class="name">公司公文</div>
                        <div class="fontclass">.icon-gongsigongwen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangshang"></i>
                        <div class="name">向上</div>
                        <div class="fontclass">.icon-xiangshang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangxia"></i>
                        <div class="name">向下</div>
                        <div class="fontclass">.icon-xiangxia</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-bumen"></i>
                        <div class="name">部门</div>
                        <div class="fontclass">.icon-bumen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gangwei"></i>
                        <div class="name">岗位</div>
                        <div class="fontclass">.icon-gangwei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidiansousuo"></i>
                        <div class="name">字典搜索</div>
                        <div class="fontclass">.icon-zidiansousuo</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jihuadangouwuche"></i>
                        <div class="name">计划单-购物车</div>
                        <div class="fontclass">.icon-jihuadangouwuche</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-diannao"></i>
                        <div class="name">电脑</div>
                        <div class="fontclass">.icon-diannao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiayixiang"></i>
                        <div class="name">加一项</div>
                        <div class="fontclass">.icon-jiayixiang</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-weiwancheng"></i>
                        <div class="name">未完成</div>
                        <div class="fontclass">.icon-weiwancheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-dayin1"></i>
                        <div class="name">打印</div>
                        <div class="fontclass">.icon-dayin1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wancheng"></i>
                        <div class="name">完成</div>
                        <div class="fontclass">.icon-wancheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rizhi1"></i>
                        <div class="name">日志</div>
                        <div class="fontclass">.icon-rizhi1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiaolian"></i>
                        <div class="name">笑脸</div>
                        <div class="fontclass">.icon-xiaolian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-youjian"></i>
                        <div class="name">邮件</div>
                        <div class="fontclass">.icon-youjian</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gonggao"></i>
                        <div class="name">公告</div>
                        <div class="fontclass">.icon-gonggao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-renwu"></i>
                        <div class="name">任务</div>
                        <div class="fontclass">.icon-renwu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhongzhi"></i>
                        <div class="name">重置</div>
                        <div class="fontclass">.icon-zhongzhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongsi"></i>
                        <div class="name">公司</div>
                        <div class="fontclass">.icon-gongsi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-bumen1"></i>
                        <div class="name">部门1</div>
                        <div class="fontclass">.icon-bumen1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gangwei1"></i>
                        <div class="name">岗位1</div>
                        <div class="fontclass">.icon-gangwei1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouqi"></i>
                        <div class="name">收起</div>
                        <div class="fontclass">.icon-shouqi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhankai"></i>
                        <div class="name">展开</div>
                        <div class="fontclass">.icon-zhankai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidiankongxin"></i>
                        <div class="name">字典空心</div>
                        <div class="fontclass">.icon-zidiankongxin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zidianshixin"></i>
                        <div class="name">字典实心</div>
                        <div class="fontclass">.icon-zidianshixin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-renwu1"></i>
                        <div class="name">任务</div>
                        <div class="fontclass">.icon-renwu1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richeng1"></i>
                        <div class="name">日程</div>
                        <div class="fontclass">.icon-richeng1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shenpi"></i>
                        <div class="name">审批</div>
                        <div class="fontclass">.icon-shenpi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-youjian1"></i>
                        <div class="name">邮件</div>
                        <div class="fontclass">.icon-youjian1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tixing"></i>
                        <div class="name">提醒</div>
                        <div class="fontclass">.icon-tixing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiaoxixuanzhong"></i>
                        <div class="name">消息-选中</div>
                        <div class="fontclass">.icon-xiaoxixuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiaoxiweixuan"></i>
                        <div class="name">消息-未选</div>
                        <div class="fontclass">.icon-xiaoxiweixuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijin"></i>
                        <div class="name">资金</div>
                        <div class="fontclass">.icon-zijin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-feiyong"></i>
                        <div class="name">费用</div>
                        <div class="fontclass">.icon-feiyong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wangpan"></i>
                        <div class="name">网盘</div>
                        <div class="fontclass">.icon-wangpan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowu"></i>
                        <div class="name">劳务</div>
                        <div class="fontclass">.icon-laowu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jihua1"></i>
                        <div class="name">计划</div>
                        <div class="fontclass">.icon-jihua1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rizhi2"></i>
                        <div class="name">日志</div>
                        <div class="fontclass">.icon-rizhi2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shenqing"></i>
                        <div class="name">申请</div>
                        <div class="fontclass">.icon-shenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yingyong"></i>
                        <div class="name">应用</div>
                        <div class="fontclass">.icon-yingyong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongzuoweixuan"></i>
                        <div class="name">工作-未选</div>
                        <div class="fontclass">.icon-gongzuoweixuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongzuoxuanzhong"></i>
                        <div class="name">工作-选中</div>
                        <div class="fontclass">.icon-gongzuoxuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tubiaoweixuan"></i>
                        <div class="name">图表-未选</div>
                        <div class="fontclass">.icon-tubiaoweixuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tubiaoxuanzhong"></i>
                        <div class="name">图表-选中</div>
                        <div class="fontclass">.icon-tubiaoxuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-lianxirenweixuan"></i>
                        <div class="name">联系人-未选</div>
                        <div class="fontclass">.icon-lianxirenweixuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-lianxirenxuanzhong"></i>
                        <div class="name">联系人-选中</div>
                        <div class="fontclass">.icon-lianxirenxuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-woweixuan"></i>
                        <div class="name">我-未选</div>
                        <div class="fontclass">.icon-woweixuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-woxuanzhong"></i>
                        <div class="name">我-选中</div>
                        <div class="fontclass">.icon-woxuanzhong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongwen1"></i>
                        <div class="name">公文</div>
                        <div class="fontclass">.icon-gongwen1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xialashixin"></i>
                        <div class="name">下拉实心</div>
                        <div class="fontclass">.icon-xialashixin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiao"></i>
                        <div class="name">材料</div>
                        <div class="fontclass">.icon-cailiao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixie"></i>
                        <div class="name">机械</div>
                        <div class="fontclass">.icon-jixie</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulin"></i>
                        <div class="name">租赁</div>
                        <div class="fontclass">.icon-zulin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fawen"></i>
                        <div class="name">发文</div>
                        <div class="fontclass">.icon-fawen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouwen"></i>
                        <div class="name">收文</div>
                        <div class="fontclass">.icon-shouwen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqin1"></i>
                        <div class="name">考勤</div>
                        <div class="fontclass">.icon-kaoqin1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chayueliucheng"></i>
                        <div class="name">查阅流程</div>
                        <div class="fontclass">.icon-chayueliucheng</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-youpizhudayin"></i>
                        <div class="name">有批注打印</div>
                        <div class="fontclass">.icon-youpizhudayin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-churuku"></i>
                        <div class="name">出入库</div>
                        <div class="fontclass">.icon-churuku</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-bangzhu1"></i>
                        <div class="name">帮助</div>
                        <div class="fontclass">.icon-bangzhu1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gouwuche"></i>
                        <div class="name">购物车</div>
                        <div class="fontclass">.icon-gouwuche</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shenpi1"></i>
                        <div class="name">审批</div>
                        <div class="fontclass">.icon-shenpi1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendang1"></i>
                        <div class="name">文档</div>
                        <div class="fontclass">.icon-wendang1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yonghu"></i>
                        <div class="name">邮件</div>
                        <div class="fontclass">.icon-yonghu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-yonghu1"></i>
                        <div class="name">用户</div>
                        <div class="fontclass">.icon-yonghu1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-lcon"></i>
                        <div class="name">财务占位</div>
                        <div class="fontclass">.icon-lcon</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiahao"></i>
                        <div class="name">加号</div>
                        <div class="fontclass">.icon-jiahao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianhao"></i>
                        <div class="name">减号</div>
                        <div class="fontclass">.icon-jianhao</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wenben"></i>
                        <div class="name">文本</div>
                        <div class="fontclass">.icon-wenben</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-sanjiaoxing"></i>
                        <div class="name">三角形</div>
                        <div class="fontclass">.icon-sanjiaoxing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-sanjiaoxingshixin"></i>
                        <div class="name">三角形</div>
                        <div class="fontclass">.icon-sanjiaoxingshixin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wenjianjia"></i>
                        <div class="name">文件夹</div>
                        <div class="fontclass">.icon-wenjianjia</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wenjianjiadakai"></i>
                        <div class="name">文件夹打开</div>
                        <div class="fontclass">.icon-wenjianjiadakai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-daishenhe"></i>
                        <div class="name">待审核</div>
                        <div class="fontclass">.icon-daishenhe</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jin"></i>
                        <div class="name">进</div>
                        <div class="fontclass">.icon-jin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chu"></i>
                        <div class="name">出</div>
                        <div class="fontclass">.icon-chu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jihua11"></i>
                        <div class="name">计划</div>
                        <div class="fontclass">.icon-jihua11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqin11"></i>
                        <div class="name">考勤</div>
                        <div class="fontclass">.icon-kaoqin11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-renwu11"></i>
                        <div class="name">任务</div>
                        <div class="fontclass">.icon-renwu11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richeng11"></i>
                        <div class="name">日程</div>
                        <div class="fontclass">.icon-richeng11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-rizhi11"></i>
                        <div class="name">日志</div>
                        <div class="fontclass">.icon-rizhi11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shenpi2"></i>
                        <div class="name">审批</div>
                        <div class="fontclass">.icon-shenpi2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wangpan1"></i>
                        <div class="name">网盘</div>
                        <div class="fontclass">.icon-wangpan1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendang2"></i>
                        <div class="name">文档</div>
                        <div class="fontclass">.icon-wendang2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wendangzhongxin"></i>
                        <div class="name">文档中心</div>
                        <div class="fontclass">.icon-wendangzhongxin</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-pingyuejihua"></i>
                        <div class="name">评阅计划</div>
                        <div class="fontclass">.icon-pingyuejihua</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wodejihua1"></i>
                        <div class="name">我的计划</div>
                        <div class="fontclass">.icon-wodejihua1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoheshenpi"></i>
                        <div class="name">考核审批</div>
                        <div class="fontclass">.icon-kaoheshenpi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqinjilu"></i>
                        <div class="name">考勤记录</div>
                        <div class="fontclass">.icon-kaoqinjilu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wodeshensu"></i>
                        <div class="name">我的申诉</div>
                        <div class="fontclass">.icon-wodeshensu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chayuericheng1"></i>
                        <div class="name">查阅日程</div>
                        <div class="fontclass">.icon-chayuericheng1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richeng2"></i>
                        <div class="name">日程</div>
                        <div class="fontclass">.icon-richeng2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richenganpai1"></i>
                        <div class="name">日程安排</div>
                        <div class="fontclass">.icon-richenganpai1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongjifenxi1"></i>
                        <div class="name">统计分析</div>
                        <div class="fontclass">.icon-tongjifenxi1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chucha"></i>
                        <div class="name">出差</div>
                        <div class="fontclass">.icon-chucha</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongwen11"></i>
                        <div class="name">公文</div>
                        <div class="fontclass">.icon-gongwen11</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-kaoqin2"></i>
                        <div class="name">考勤</div>
                        <div class="fontclass">.icon-kaoqin2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-qita1"></i>
                        <div class="name">其它</div>
                        <div class="fontclass">.icon-qita1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fawen1"></i>
                        <div class="name">发文</div>
                        <div class="fontclass">.icon-fawen1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shouwen1"></i>
                        <div class="name">收文</div>
                        <div class="fontclass">.icon-shouwen1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-huanxiu"></i>
                        <div class="name">换休</div>
                        <div class="fontclass">.icon-huanxiu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiaban1"></i>
                        <div class="name">加班1</div>
                        <div class="fontclass">.icon-jiaban1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-qingjia1"></i>
                        <div class="name">请假</div>
                        <div class="fontclass">.icon-qingjia1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-waichu"></i>
                        <div class="name">外出</div>
                        <div class="fontclass">.icon-waichu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gerenwangpan"></i>
                        <div class="name">个人网盘</div>
                        <div class="fontclass">.icon-gerenwangpan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongsilei1"></i>
                        <div class="name">公司类</div>
                        <div class="fontclass">.icon-gongsilei1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-wangpan2"></i>
                        <div class="name">网盘</div>
                        <div class="fontclass">.icon-wangpan2</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xiangmubu"></i>
                        <div class="name">项目部</div>
                        <div class="fontclass">.icon-xiangmubu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zhinengbumen"></i>
                        <div class="name">职能部门</div>
                        <div class="fontclass">.icon-zhinengbumen</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijintong1"></i>
                        <div class="name">资金通</div>
                        <div class="fontclass">.icon-zijintong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowutong1"></i>
                        <div class="name">劳务通</div>
                        <div class="fontclass">.icon-laowutong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaotong1"></i>
                        <div class="name">材料通</div>
                        <div class="fontclass">.icon-cailiaotong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulintong1"></i>
                        <div class="name">租赁通</div>
                        <div class="fontclass">.icon-zulintong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-suishoupai1"></i>
                        <div class="name">随手拍</div>
                        <div class="fontclass">.icon-suishoupai1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixietong1"></i>
                        <div class="name">机械通</div>
                        <div class="fontclass">.icon-jixietong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefei1"></i>
                        <div class="name">间接费</div>
                        <div class="fontclass">.icon-jianjiefei1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-caigouhejiadan"></i>
                        <div class="name">采购核价单</div>
                        <div class="fontclass">.icon-caigouhejiadan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chukulingliaodan"></i>
                        <div class="name">出库领料单</div>
                        <div class="fontclass">.icon-chukulingliaodan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jiagongcairuku"></i>
                        <div class="name">甲供材入库</div>
                        <div class="fontclass">.icon-jiagongcairuku</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-chukubaosundan"></i>
                        <div class="name">出库报损单</div>
                        <div class="fontclass">.icon-chukubaosundan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-daorucailiaorukuliushui"></i>
                        <div class="name">导入材料入库流水</div>
                        <div class="fontclass">.icon-daorucailiaorukuliushui</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-xianjincairukudan"></i>
                        <div class="name">现金材入库单</div>
                        <div class="fontclass">.icon-xianjincairukudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaoduizhangdan"></i>
                        <div class="name">材料对账单</div>
                        <div class="fontclass">.icon-cailiaoduizhangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zigoucairukudan"></i>
                        <div class="name">自购材入库单</div>
                        <div class="fontclass">.icon-zigoucairukudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaojihuadan"></i>
                        <div class="name">材料计划单</div>
                        <div class="fontclass">.icon-cailiaojihuadan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaohetong1"></i>
                        <div class="name">材料合同</div>
                        <div class="fontclass">.icon-cailiaohetong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaotuikudan"></i>
                        <div class="name">材料退库单</div>
                        <div class="fontclass">.icon-cailiaotuikudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaotuihuodan"></i>
                        <div class="name">材料退货单</div>
                        <div class="fontclass">.icon-cailiaotuihuodan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaopancundan"></i>
                        <div class="name">材料盘存单</div>
                        <div class="fontclass">.icon-cailiaopancundan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaotiaobodan"></i>
                        <div class="name">材料调拨单</div>
                        <div class="fontclass">.icon-cailiaotiaobodan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiechuchangdan"></i>
                        <div class="name">机械出场单</div>
                        <div class="fontclass">.icon-jixiechuchangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixieduizhangdan"></i>
                        <div class="name">机械对账单</div>
                        <div class="fontclass">.icon-jixieduizhangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiefeiyongdan"></i>
                        <div class="name">机械费用单</div>
                        <div class="fontclass">.icon-jixiefeiyongdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiehetong1"></i>
                        <div class="name">机械合同</div>
                        <div class="fontclass">.icon-jixiehetong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiejinchangdan"></i>
                        <div class="name">机械进场单</div>
                        <div class="fontclass">.icon-jixiejinchangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiejiliangdan"></i>
                        <div class="name">机械计量单</div>
                        <div class="fontclass">.icon-jixiejiliangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-hangzhengguifei"></i>
                        <div class="name">行政规费</div>
                        <div class="fontclass">.icon-hangzhengguifei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeihuizong"></i>
                        <div class="name">间接费汇总</div>
                        <div class="fontclass">.icon-jianjiefeihuizong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-richangfeiyong"></i>
                        <div class="name">日常费用</div>
                        <div class="fontclass">.icon-richangfeiyong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jingyingfeiyong"></i>
                        <div class="name">经营费用</div>
                        <div class="fontclass">.icon-jingyingfeiyong</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-lingxingshoufangdan"></i>
                        <div class="name">零星收方单</div>
                        <div class="fontclass">.icon-lingxingshoufangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-gongchengjiliangdan"></i>
                        <div class="name">工程计量单</div>
                        <div class="fontclass">.icon-gongchengjiliangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jishiyonggongdan"></i>
                        <div class="name">计时用工单</div>
                        <div class="fontclass">.icon-jishiyonggongdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowujiangfadan"></i>
                        <div class="name">劳务奖罚单</div>
                        <div class="fontclass">.icon-laowujiangfadan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowuhetong1"></i>
                        <div class="name">劳务合同</div>
                        <div class="fontclass">.icon-laowuhetong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowuduizhangdan"></i>
                        <div class="name">劳务对账单</div>
                        <div class="fontclass">.icon-laowuduizhangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowusuishoupai"></i>
                        <div class="name">劳务随手拍</div>
                        <div class="fontclass">.icon-laowusuishoupai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaosuishoupai"></i>
                        <div class="name">材料随手拍</div>
                        <div class="fontclass">.icon-cailiaosuishoupai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-feiyongsuishoupai"></i>
                        <div class="name">费用随手拍</div>
                        <div class="fontclass">.icon-feiyongsuishoupai</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-hetongjiekuanshenqingdan"></i>
                        <div class="name">合同借款申请单</div>
                        <div class="fontclass">.icon-hetongjiekuanshenqingdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijinjihuaquerendan"></i>
                        <div class="name">资金计划确认单</div>
                        <div class="fontclass">.icon-zijinjihuaquerendan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-feichengbenshouzhi"></i>
                        <div class="name">非成本收支</div>
                        <div class="fontclass">.icon-feichengbenshouzhi</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jihuazijinshenqingdan"></i>
                        <div class="name">计划资金申请单</div>
                        <div class="fontclass">.icon-jihuazijinshenqingdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijinshijizhifudan"></i>
                        <div class="name">资金实际支付单</div>
                        <div class="fontclass">.icon-zijinshijizhifudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zijinshourudan"></i>
                        <div class="name">资金收入单</div>
                        <div class="fontclass">.icon-zijinshourudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zongzijinfenpei"></i>
                        <div class="name">总资金分配</div>
                        <div class="fontclass">.icon-zongzijinfenpei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-shoukuandan"></i>
                        <div class="name">收款单</div>
                        <div class="fontclass">.icon-shoukuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-fukuandan"></i>
                        <div class="name">付款单</div>
                        <div class="fontclass">.icon-fukuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowujiekuandan"></i>
                        <div class="name">劳务借款单</div>
                        <div class="fontclass">.icon-laowujiekuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinjiekuandan"></i>
                        <div class="name">租赁借款单</div>
                        <div class="fontclass">.icon-zulinjiekuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaojiekuandan"></i>
                        <div class="name">材料借款单</div>
                        <div class="fontclass">.icon-cailiaojiekuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeijiekuan"></i>
                        <div class="name">间接费借款</div>
                        <div class="fontclass">.icon-jianjiefeijiekuan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiejiekuandan"></i>
                        <div class="name">机械借款单</div>
                        <div class="fontclass">.icon-jixiejiekuandan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaofeishenqing"></i>
                        <div class="name">材料费申请</div>
                        <div class="fontclass">.icon-cailiaofeishenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinfeishenqing"></i>
                        <div class="name">租赁费申请</div>
                        <div class="fontclass">.icon-zulinfeishenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiefeishenqing"></i>
                        <div class="name">机械费申请</div>
                        <div class="fontclass">.icon-jixiefeishenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowufeishenqing"></i>
                        <div class="name">劳务费申请</div>
                        <div class="fontclass">.icon-laowufeishenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeishenqing"></i>
                        <div class="name">间接费申请</div>
                        <div class="fontclass">.icon-jianjiefeishenqing</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaofeiqueren"></i>
                        <div class="name">材料费确认</div>
                        <div class="fontclass">.icon-cailiaofeiqueren</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowufeiqueren"></i>
                        <div class="name">劳务费确认</div>
                        <div class="fontclass">.icon-laowufeiqueren</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinfeiqueren"></i>
                        <div class="name">租赁费确认</div>
                        <div class="fontclass">.icon-zulinfeiqueren</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeiqueren"></i>
                        <div class="name">间接费确认</div>
                        <div class="fontclass">.icon-jianjiefeiqueren</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiefeiqueren"></i>
                        <div class="name">机械费确认</div>
                        <div class="fontclass">.icon-jixiefeiqueren</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-laowufeizhifu"></i>
                        <div class="name">劳务费支付</div>
                        <div class="fontclass">.icon-laowufeizhifu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-cailiaofeizhifu"></i>
                        <div class="name">材料费支付</div>
                        <div class="fontclass">.icon-cailiaofeizhifu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinfeizhifu"></i>
                        <div class="name">租赁费支付</div>
                        <div class="fontclass">.icon-zulinfeizhifu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jianjiefeizhifu"></i>
                        <div class="name">间接费支付</div>
                        <div class="fontclass">.icon-jianjiefeizhifu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-jixiefeizhifu"></i>
                        <div class="name">机械费支付</div>
                        <div class="fontclass">.icon-jixiefeizhifu</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinhetong1"></i>
                        <div class="name">租赁合同</div>
                        <div class="fontclass">.icon-zulinhetong1</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinjinchangdan"></i>
                        <div class="name">租赁进场单</div>
                        <div class="fontclass">.icon-zulinjinchangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinduizhangdan"></i>
                        <div class="name">租赁对账单</div>
                        <div class="fontclass">.icon-zulinduizhangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinchuchangdan"></i>
                        <div class="name">租赁出场单</div>
                        <div class="fontclass">.icon-zulinchuchangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinpeichangdan"></i>
                        <div class="name">租赁赔偿单</div>
                        <div class="fontclass">.icon-zulinpeichangdan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulinqitafei"></i>
                        <div class="name">租赁其它费</div>
                        <div class="fontclass">.icon-zulinqitafei</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-zulintingzudan"></i>
                        <div class="name">租赁停租单</div>
                        <div class="fontclass">.icon-zulintingzudan</div>
                    </li>

                    <li>
                        <i class="icon esg-font icon-tongyong"></i>
                        <div class="name">通用</div>
                        <div class="fontclass">.icon-tongyong</div>
                    </li>

                </ul>

                <h2 id="font-class-">font-class引用</h2>
                <hr>

                <p>font-class是unicode使用方式的一种变种，主要是解决unicode书写不直观，语意不明确的问题。</p>
                <p>与unicode使用方式相比，具有如下特点：</p>
                <ul>
                    <li>兼容性良好，支持ie8+，及所有现代浏览器。</li>
                    <li>相比于unicode语意明确，书写更直观。可以很容易分辨这个icon是什么。</li>
                    <li>因为使用class来定义图标，所以当要替换图标时，只需要修改class里面的unicode引用。</li>
                    <li>不过因为本质上还是使用的字体，所以多色图标还是不支持的。</li>
                </ul>
                <p>使用步骤如下：</p>
                <h3 id="-fontclass-">第一步：引入项目下面生成的fontclass代码：</h3>


                <pre><code class="lang-js hljs javascript"><span class="hljs-comment">&lt;link rel="stylesheet" type="text/css" href="./iconfont.css"&gt;</span></code></pre>
                <h3 id="-">第二步：挑选相应图标并获取类名，应用于页面：</h3>
                <pre><code class="lang-css hljs">&lt;<span class="hljs-selector-tag">i</span> <span class="hljs-selector-tag">class</span>="<span class="hljs-selector-tag">esg-font</span> <span class="hljs-selector-tag">icon-xxx</span>"&gt;&lt;/<span class="hljs-selector-tag">i</span>&gt;</code></pre>
                <blockquote>
                    <p>"esg-font"是你项目下的font-family。可以通过编辑项目查看，默认是"iconfont"。</p>
                </blockquote>
            </div>
        </div>
    </master:Content>
</master:ContentPage>
