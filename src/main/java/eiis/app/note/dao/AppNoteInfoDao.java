package eiis.app.note.dao;

import eiis.app.note.entity.AppProjectDetailEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository("eiis.app.note.dao.AppNoteInfoDao")
public interface AppNoteInfoDao extends CrudRepository<AppProjectDetailEntity,String> {

}
