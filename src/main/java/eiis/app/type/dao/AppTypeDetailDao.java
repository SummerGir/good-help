package eiis.app.type.dao;

import eiis.app.type.entity.AppTypeDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

import java.util.List;

@Repository("eiis.app.type.dao.AppTypeDetailDao")
public interface AppTypeDetailDao extends
        JpaRepository<AppTypeDetailEntity, String>,
        JpaSpecificationExecutor<AppTypeDetailEntity>,
        GenericDao<AppTypeDetailEntity, String> {

    @Query("select apd from AppTypeDetailEntity apd where apd.typeId=:typeId")
    List<AppTypeDetailEntity> findByTypeId(@Param("typeId") String typeId);
}
