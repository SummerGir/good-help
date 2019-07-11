<%@ page import="eiis.core.workflow.db.schema.Flow_ins_baseinfo" %>
<%@ page import="org.hibernate.Query" %>
<%@ page import="org.hibernate.Session" %>
<%@ page import="org.hibernate.SessionFactory" %>
<%@ page import="java.util.*" %>
<%@ page import="eiis.app.archives.ArchiveDirectoryFactory" %>
<%@ page import="eiis.app.archives.ArchiveFlowInstFactory" %>
<%@ page import="eiis.app.archives.ArchiveFlowInst" %>
<%@ page import="eiis.util.UUIDUtils" %>
<%@ page import="eiis.core.workflow.EiisProcessInsExt" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!


    SessionFactory sessionFactory = null;

    SessionFactory getSessionFactory(){
        if (sessionFactory == null)
        {
            sessionFactory = eiis.util.spring.ApplicationContext.getCurrent().getBean(SessionFactory.class);
        }
        return sessionFactory;
    }

    void resetArchiveFlow() throws Exception {
        Session session = getSessionFactory().openSession();
        try{
            Query query = session.createQuery("from Flow_ins_baseinfo where curr_state=:curr_state") //and flow_name=:flow_name") //and flow_sn=:flow_sn")
                    .setParameter("curr_state", "2")
//                .setParameter("flow_name","行政审批流程")
//                .setParameter("flow_sn", "94CA4E7D-6FB4-11E4-BAFA-005056AD9303")
                    ;
            List<Flow_ins_baseinfo> flowInsList = query.list();
            for(Flow_ins_baseinfo instance : flowInsList){
                insertArchiveFlow(instance);
            }
        }finally {
            session.close();
        }
    }

    void insertArchiveFlow(Flow_ins_baseinfo instance) throws Exception {
        //保存栏目
        ArchiveDirectoryFactory archiveDirectoryFactory = ArchiveDirectoryFactory.getUnlimited();
        archiveDirectoryFactory.save(instance.getFlow_key(),instance.getFlow_name());
        //保存归档实例
        ArchiveFlowInstFactory archiveFlowInstFactory = ArchiveFlowInstFactory.getUnlimited();
        ArchiveFlowInst archiveFlowInst = archiveFlowInstFactory.create(UUIDUtils.parse(instance
                .getFlow_sn()));
        //阅读范围设置，只有局机关、信息中心人员可阅读所有归档文件
        List<UUID> readList = new ArrayList<UUID>();
        EiisProcessInsExt processInstHelper = new EiisProcessInsExt();
        readList.addAll(processInstHelper.getMemberIds(instance.getAbs_sn()));
        readList.add(UUID.fromString("525ce44f-e78e-4f20-9fce-ebdf9791291c"));//局机关
        readList.add(UUID.fromString("623afde2-825c-4e2a-9f71-c2a1c7af7174"));//信息中心
        archiveFlowInst.setReadAuthorized(readList);
        archiveFlowInst.save(instance);
    }

%>
<%


    try {
        org.apache.commons.lang3.time.StopWatch apacheSW = new org.apache.commons.lang3.time.StopWatch();
        apacheSW.start();
        //重新填充流程归档数据
        resetArchiveFlow();
        apacheSW.stop();
        out.print("<script type=\"text/javascript\">alert(\"成功导入流程归档信息！（耗时：" + apacheSW.toString() + "）\");location.href='/app/archives/archive_main.jsp'</script>");
    } catch (Exception e) {
        out.print("<script type=\"text/javascript\">alert(\"导入流程归档信息异常！\");</script>");
    }


%>