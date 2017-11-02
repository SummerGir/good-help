package eiis.app.type.dao;

import eiis.app.type.entity.AppTypeInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import util.dataManage.GenericDao;

import java.util.List;

@Repository("eiis.app.type.dao.AppTypeInfoDao")
public interface AppTypeInfoDao extends
        JpaRepository<AppTypeInfoEntity, String>,
        JpaSpecificationExecutor<AppTypeInfoEntity>,
        GenericDao<AppTypeInfoEntity, String> {

    //根据typeCode,得到类型对象
    @Query("select ati from AppTypeInfoEntity ati where ati.typeCode=:typeCode")
    AppTypeInfoEntity findByTypeCode(@Param("typeCode") String typeCode);
}
