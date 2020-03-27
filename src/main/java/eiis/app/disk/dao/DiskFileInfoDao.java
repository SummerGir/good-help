package eiis.app.disk.dao;

import eiis.app.disk.entity.DiskFileInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.disk.dao.DiskFileInfoDao")
public interface DiskFileInfoDao extends JpaRepository<DiskFileInfoEntity,String>,JpaSpecificationExecutor<DiskFileInfoEntity>,GenericDao<DiskFileInfoEntity,String>{
}
