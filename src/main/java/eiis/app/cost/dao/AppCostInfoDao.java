package eiis.app.cost.dao;


import eiis.app.cost.entity.AppDailyCostInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.cost.dao.AppCostInfoDao")
public interface AppCostInfoDao extends JpaRepository<AppDailyCostInfoEntity,String>,JpaSpecificationExecutor<AppDailyCostInfoEntity>,GenericDao<AppDailyCostInfoEntity,String>{
}
