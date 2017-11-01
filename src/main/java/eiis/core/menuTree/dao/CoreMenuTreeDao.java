package eiis.core.menuTree.dao;

import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.core.menuTree.dao.CoreMenuTreeDao")
public interface CoreMenuTreeDao  extends
        JpaRepository<CoreMenuTreeInfoEntity, String>,
        JpaSpecificationExecutor<CoreMenuTreeInfoEntity>,
        GenericDao<CoreMenuTreeInfoEntity, String> {

}
