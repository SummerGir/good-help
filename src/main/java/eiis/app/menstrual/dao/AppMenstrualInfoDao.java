package eiis.app.menstrual.dao;

import eiis.app.menstrual.entity.AppMenstrualInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.menstrual.dao.AppMenstrualInfoDao")
public interface AppMenstrualInfoDao extends
        JpaRepository<AppMenstrualInfoEntity, String>,
        JpaSpecificationExecutor<AppMenstrualInfoEntity>,
        GenericDao<AppMenstrualInfoEntity, String> {

}
