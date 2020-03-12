package eiis.app.home.dao;

import eiis.app.home.entity.HomeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.home.dao.homeDao")
public interface homeDao extends JpaSpecificationExecutor<HomeEntity>,JpaRepository<HomeEntity,String> ,GenericDao<HomeEntity,String> {
}
