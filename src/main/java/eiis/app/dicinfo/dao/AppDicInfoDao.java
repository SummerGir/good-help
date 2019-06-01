package eiis.app.dicinfo.dao;


import eiis.app.dicinfo.entity.AppDicInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.dicinfo.dao.AppDicInfoDao")
public interface AppDicInfoDao extends JpaRepository<AppDicInfoEntity,String>,JpaSpecificationExecutor<AppDicInfoEntity>,GenericDao<AppDicInfoEntity,String>{
}
