package eiis.app.note.service;

import eiis.app.note.dao.AppNoteInfoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;

@Service("eiis.app.note.service.AppNoteInfoService")
public class AppNoteInfoService {

	@Autowired
	protected AppNoteInfoDao dao;

	@Autowired
	protected EntityManager entityManager;

	protected AppNoteInfoService() {}
	public static AppNoteInfoService getInstance() {
		return ApplicationContext.getCurrent().getBean(AppNoteInfoService.class);
	}

	//流程后调用事件
	@Transactional
	public void save_AtFlowOver(String projectId) throws Exception {

	}
}