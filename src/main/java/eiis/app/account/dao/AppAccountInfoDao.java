package eiis.app.account.dao;

import eiis.app.account.entity.AppAccountInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.account.dao.AppAccountInfoDao")
public interface AppAccountInfoDao extends JpaRepository<AppAccountInfoEntity,String>,JpaSpecificationExecutor<AppAccountInfoEntity>,GenericDao<AppAccountInfoEntity,String> {
}
