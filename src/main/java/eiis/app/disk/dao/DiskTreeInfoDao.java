package eiis.app.disk.dao;

import eiis.app.disk.entity.DiskTreeInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.disk.dao.DiskTreeInfoDao")
public interface DiskTreeInfoDao extends JpaRepository<DiskTreeInfoEntity,String>,JpaSpecificationExecutor<DiskTreeInfoEntity>,GenericDao<DiskTreeInfoEntity,String>{
}
