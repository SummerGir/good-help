package eiis.core.menuUrl.dao;

import eiis.core.menuUrl.entity.CoreMenuUrlInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.core.menuUrl.dao.CoreMenuUrlDao")
public interface CoreMenuUrlDao extends
        JpaRepository<CoreMenuUrlInfoEntity, String>,
        JpaSpecificationExecutor<CoreMenuUrlInfoEntity>,
        GenericDao<CoreMenuUrlInfoEntity, String> {

}
