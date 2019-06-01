package eiis.app.meterialinput.dao;

import eiis.app.meterialinput.entity.AppMeterialInputDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.meterialinput.dao.AppMeterialInputDetailDao")
public interface AppMeterialInputDetailDao extends
        JpaRepository<AppMeterialInputDetailEntity, String>,
        JpaSpecificationExecutor<AppMeterialInputDetailEntity>,
        GenericDao<AppMeterialInputDetailEntity, String> {

}
