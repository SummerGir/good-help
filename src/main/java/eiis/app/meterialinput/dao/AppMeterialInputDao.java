package eiis.app.meterialinput.dao;

import eiis.app.meterialinput.entity.AppMeterialInputEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

@Repository("eiis.app.meterialinput.dao.AppMeterialInputDao")
public interface AppMeterialInputDao extends
        JpaRepository<AppMeterialInputEntity, String>,
        JpaSpecificationExecutor<AppMeterialInputEntity>,
        GenericDao<AppMeterialInputEntity, String> {

}
