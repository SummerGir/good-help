package eiis.app.note.dao;

import eiis.app.note.entity.AppNoteInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.note.dao.AppNoteInfoDao")
public interface AppNoteInfoDao   extends
        JpaRepository<AppNoteInfoEntity, String>,
        JpaSpecificationExecutor<AppNoteInfoEntity>,
        GenericDao<AppNoteInfoEntity, String> {

}
