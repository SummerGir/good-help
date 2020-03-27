package eiis.app.disk.service;

import com.sun.xml.internal.rngom.util.Uri;
import eiis.app.disk.dao.DiskFileInfoDao;
import eiis.app.disk.entity.DiskFileInfoEntity;
import eiis.app.disk.entity.DiskTreeInfoEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.io.AttachmentUtils;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.disk.service.DiskFileInfoService")
public class DiskFileInfoService extends GenericService<DiskFileInfoEntity,String>{
    @Autowired
    protected DiskFileInfoDao dao;
    @Autowired
    protected EntityManager entityManager;
    @Override
    protected GenericDao<DiskFileInfoEntity, String> getDaoInstance() {
        return dao;
    }

    public static DiskFileInfoService getInstance(){
        return ApplicationContext.getCurrent().getBean(DiskFileInfoService.class);
    }

    @Transactional
    public void save(DiskFileInfoEntity entity) throws Exception {
        dao.save(entity);
    }
    @Transactional
    public void save(List<DiskFileInfoEntity> list) throws Exception {
        dao.save(list);
    }
    @Transactional
    public void delete(String fileId) throws Exception {
        dao.delete(fileId);
    }

    public List<Map<String,Object>> getMainInfo(String serachKey,String fileTreeId)throws Exception{
        String sql = "select dfi.FILE_ID,dfi.FILE_TREE_ID,dfi.FILE_NAME,dfi.FILE_PATH,dfi.CREATED_TIME,dfi.SYSTIME,dfi.`COMMENT` from disk_file_info dfi where 1=1";
        Map values = new HashMap();
        if(StringUtils.isNotBlank(serachKey)){
            sql += " and ((locate(:serachKey,dfi.FILE_NAME))>0 or (locate(:serachKey,dfi.`COMMENT`))>0)";
            values.put("serachKey",serachKey);
        }
        if(StringUtils.isNotBlank(fileTreeId)){
            sql += " and dfi.FILE_TREE_ID=:fileTreeId";
            values.put("fileTreeId",fileTreeId);
        }
        sql += " order by dfi.SYSTIME asc";
        String[] fields = {"fileId","fileTreeId","fileName","filePath","createdTime","systime","comment"};
        List<Map<String,Object>> list = getNativeMapList(entityManager,sql,values,fields,0,0);
        for(Map<String,Object> map:list){
            for(Map.Entry<String,Object> entry: map.entrySet()){
                if( "filePath".equals(entry.getKey())){
                    File f = new File(entry.getValue().toString());
                    map.put(entry.getKey(), AttachmentUtils.addPrefix(entry.getValue().toString()));
                }
                if(entry.getValue() == null){
                    map.put(entry.getKey(),"");
                }
                if("createdTime".equals(entry.getKey())){
                    map.put(entry.getKey(),entry.getValue().toString().split(" ")[0]);
                }
            }
        }
        return list;
    }


    @Transactional
    public void deleteMainInfo(DiskTreeInfoEntity treeEntity)throws Exception{
        Integer left = treeEntity.getTreeLeft();
        Integer right = treeEntity.getTreeRight();
        Map values = new HashMap();
        String sql = "select dfi.FILE_ID,dfi.FILE_TREE_ID,dfi.FILE_NAME,dfi.FILE_PATH,dfi.CREATED_TIME,dfi.SYSTIME,dfi.`COMMENT` from disk_file_info dfi where dfi.FILE_TREE_ID in (select t.TREE_ID from disk_tree_info t where t.TREE_LEFT>=:left and t.TREE_RIGHT<=:right)";
        values.put("left",left);
        values.put("right",right);
        String[] fields = {"fileId","fileTreeId","fileName","filePath","createdTime","systime","comment"};
        List<Map<String,Object>> list = getNativeMapList(entityManager,sql,values,fields,0,0);
        for(Map<String,Object> map:list){
            for(Map.Entry<String,Object> entry: map.entrySet()){
                if( "filePath".equals(entry.getKey())){
                    Path path = AttachmentUtils.getAttachRootPath().resolve(entry.getValue().toString());
                    path.toFile().delete();
                }
            }
        }
        String sql_1 = "delete dfi from disk_file_info dfi where dfi.FILE_TREE_ID in (select t.TREE_ID from disk_tree_info t where t.TREE_LEFT>=:left and t.TREE_RIGHT<=:right)";
        Query query = entityManager.createNativeQuery(sql_1);
        query.setParameter("left",left);
        query.setParameter("right",right);
        query.executeUpdate();
    }



}
