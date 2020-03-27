package eiis.app.disk.service;

import eiis.app.disk.dao.DiskTreeInfoDao;
import eiis.app.disk.entity.DiskTreeInfoEntity;
import org.apache.commons.lang3.StringUtils;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.dataManage.GenericDao;
import util.dataManage.GenericService;
import util.spring.ApplicationContext;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("eiis.app.disk.service.DiskTreeInfoService")
public class DiskTreeInfoService extends GenericService<DiskTreeInfoEntity,String>{

    @Autowired
    protected DiskTreeInfoDao dao;

    @Autowired
    protected DiskFileInfoService fileInfoService;

    @Autowired
    protected EntityManager entityManager;
    @Override
    protected GenericDao<DiskTreeInfoEntity, String> getDaoInstance() {
        return dao;
    }
    public static DiskTreeInfoService getInstance(){
        return ApplicationContext.getCurrent().getBean(DiskTreeInfoService.class);
    }
    @Transactional
    public void save(DiskTreeInfoEntity entity) throws Exception {
        dao.save(entity);
    }
    @Transactional
    public void save(List<DiskTreeInfoEntity> list) throws Exception {
        dao.save(list);
    }
    @Transactional
    public void delete(String treeId) throws Exception {
        dao.delete(treeId);
    }

    public List<Map<String,Object>> getMainInfo(String parentId) throws Exception{
        List<Map<String,Object>> list = new ArrayList<>();
        Map values = new HashMap();
        String basicSql = "";
        if(StringUtils.isBlank(parentId)){
             basicSql = "select dti.TREE_ID,dti.TREE_NAME,dti.PARENT_ID,dti.TREE_LEFT,dti.TREE_RIGHT from disk_tree_info dti where dti.PARENT_ID is null order by dti.TREE_LEFT";
             values = null;
        }else {
             basicSql = "select dti.TREE_ID,dti.TREE_NAME,dti.PARENT_ID,dti.TREE_LEFT,dti.TREE_RIGHT from disk_tree_info dti where dti.PARENT_ID =:parentId order by dti.TREE_LEFT";
            values.put("parentId",parentId);
        }

        String[] fields = {"treeId","text","parentId","treeLeft","treeRight"};
        list = getNativeMapList(entityManager,basicSql,values,fields,0,0);

        for(Map<String,Object> map:list){
            map.put("id",map.get("treeId"));
            map.put("text",map.get("text")+"  ("+map.get("treeLeft")+"-"+map.get("treeRight")+")");
            if((Integer.parseInt(map.get("treeRight").toString())-Integer.parseInt(map.get("treeLeft").toString()))>1){
                if ("root".equalsIgnoreCase(map.get("treeId").toString())) {
                    map.put("children", getMainInfo(map.get("treeId").toString()));
                    map.put("state","open");
                    map.put("isLoad",true);
                }else{
                    map.put("children", new ArrayList<>());
                    map.put("state","closed");
                    map.put("isLoad",false);
                }
            }
        }
        return list;
    }


    //得到子孙
    public List<Map<String,Object>> getSons(DiskTreeInfoEntity fatherEntity) throws Exception{
        List<Map<String,Object>> list = new ArrayList<>();
        Integer fatherleft = fatherEntity.getTreeLeft();
        Integer fatherRight = fatherEntity.getTreeRight();
        Map values = new HashMap();
        String basicSql = "";
         if(StringUtils.isNotBlank(fatherleft.toString()) && StringUtils.isNotBlank(fatherRight.toString())){
             basicSql = "select dti.TREE_ID,dti.TREE_NAME,dti.PARENT_ID,dti.TREE_LEFT,dti.TREE_RIGHT from disk_tree_info dti where dti.TREE_LEFT>:fatherleft and dti.TREE_RIGHT<:fatherRight order by dti.TREE_LEFT";
             values.put("fatherleft",fatherleft);
             values.put("fatherRight",fatherRight);
         }
        String[] fields = {"treeId","text","parentId","treeLeft","treeRight"};
        list = getNativeMapList(entityManager,basicSql,values,fields,0,0);
        return list;
    }

    public DiskTreeInfoEntity getEntityByLeft(String left) throws Exception{
        List<Map<String,Object>> list = new ArrayList<>();
        Map values = new HashMap();
        String basicSql = "";
        basicSql = "select dti.TREE_ID from disk_tree_info dti where dti.TREE_RIGHT = :left-1";
        values.put("left",left);

        String[] fields = {"treeId"};
        list = getNativeMapList(entityManager,basicSql,values,fields,0,0);
        if(list.size()>0){
            return findOne(list.get(0).get("treeId").toString());
        }else {
            return null;
        }
    }

    public DiskTreeInfoEntity getEntityByRight(String right) throws Exception{
        List<Map<String,Object>> list = new ArrayList<>();
        Map values = new HashMap();
        String basicSql = "";
        basicSql = "select dti.TREE_ID from disk_tree_info dti where dti.TREE_LEFT = :right+1";
        values.put("right",right);

        String[] fields = {"treeId"};
        list = getNativeMapList(entityManager,basicSql,values,fields,0,0);
        if(list.size()>0){
            return findOne(list.get(0).get("treeId").toString());
        }else {
            return null;
        }
    }

    @Transactional
    public void saveMainInfo(DiskTreeInfoEntity fatherEntity,DiskTreeInfoEntity newEntity) throws Exception{
        Integer fatherleft = fatherEntity.getTreeLeft();
        Integer fatherRight = fatherEntity.getTreeRight();
        Integer newleft = newEntity.getTreeLeft();

        String basicSql_1 = "update disk_tree_info d set d.TREE_RIGHT= d.TREE_RIGHT+2 where d.TREE_LEFT <=:left and d.TREE_RIGHT>=:right";//改前面的
        Query query = entityManager.createNativeQuery(basicSql_1);
        query.setParameter("left",fatherleft);
        query.setParameter("right",fatherRight);
        query.executeUpdate();

        String basicSql_2 = "update disk_tree_info d set d.TREE_LEFT = d.TREE_LEFT+2,d.TREE_RIGHT = d.TREE_RIGHT+2 where d.TREE_LEFT>:newleft"; //改后面的
        query = entityManager.createNativeQuery(basicSql_2);
        query.setParameter("newleft",newleft);
        query.executeUpdate();
    }

    @Transactional
    public void deleteMainInfo(DiskTreeInfoEntity deleteEntity)throws Exception{
        List<Map<String,Object>> listSons = getSons(deleteEntity);
        Integer lastSonleft;
        if(listSons.size()>0){
            lastSonleft = Integer.valueOf(listSons.get(listSons.size()-1).get("treeLeft").toString());
        }else {
            lastSonleft = deleteEntity.getTreeLeft();
        }
        Integer n = listSons.size()+1;
        fileInfoService.deleteMainInfo(deleteEntity);

        //删除自己及子孙节点
        String basicSql_3 = "delete dti from disk_tree_info dti where dti.TREE_LEFT>=:fatherleft and dti.TREE_RIGHT<=:fatherRight";
        Query query = entityManager.createNativeQuery(basicSql_3);
        query.setParameter("fatherleft",deleteEntity.getTreeLeft());
        query.setParameter("fatherRight",deleteEntity.getTreeRight());
        query.executeUpdate();



        //改前面的
        String basicSql_1 = "update disk_tree_info d set d.TREE_RIGHT= d.TREE_RIGHT-(:n*2) where d.TREE_LEFT <:left and d.TREE_RIGHT>:right";
        query = entityManager.createNativeQuery(basicSql_1);
        query.setParameter("left",deleteEntity.getTreeLeft());
        query.setParameter("right",deleteEntity.getTreeRight());
        query.setParameter("n",n);
        query.executeUpdate();

        //改后面的
        String basicSql_2 = "update disk_tree_info d set d.TREE_LEFT = d.TREE_LEFT-(:n*2),d.TREE_RIGHT = d.TREE_RIGHT-(:n*2) where d.TREE_LEFT>:lastSonleft";
        query = entityManager.createNativeQuery(basicSql_2);
        query.setParameter("lastSonleft",lastSonleft);
        query.setParameter("n",n);
        query.executeUpdate();





    }
    @Transactional
    public void moveMainInfo(DiskTreeInfoEntity moveEntity,Boolean moveOn) throws Exception{
        DiskTreeInfoEntity neighborEntity = null;
        List<DiskTreeInfoEntity> templist = new ArrayList<>();
        if(moveOn){
            neighborEntity = getEntityByLeft(moveEntity.getTreeLeft().toString());
            if(neighborEntity == null){
                return;
            }
            List<Map<String,Object>> moveEntitySons = getSons(moveEntity);
            List<Map<String,Object>> neighborEntitySons = getSons(neighborEntity);
            String basicSql = "update disk_tree_info d set d.TREE_RIGHT = d.TREE_RIGHT+(:n*2),d.TREE_LEFT = d.TREE_LEFT+(:n*2) where d.TREE_LEFT >=:left and d.TREE_RIGHT<=:right";   //改邻居
            Query query = entityManager.createNativeQuery(basicSql);
            query.setParameter("n",moveEntitySons.size() + 1);
            query.setParameter("left",neighborEntity.getTreeLeft());
            query.setParameter("right",neighborEntity.getTreeRight());
            query.executeUpdate();

            moveEntity.setTreeRight(moveEntity.getTreeRight()- 2*(neighborEntitySons.size()+1));
            moveEntity.setTreeLeft(moveEntity.getTreeLeft()- 2*(neighborEntitySons.size()+1));
            templist.add(moveEntity);
            for(Map<String,Object> map:moveEntitySons){
                DiskTreeInfoEntity entity = findOne(map.get("treeId").toString());
                entity.setTreeRight(entity.getTreeRight()- 2*(neighborEntitySons.size()+1));
                entity.setTreeLeft(entity.getTreeLeft()- 2*(neighborEntitySons.size()+1));
                templist.add(entity);
            }
            save(templist);
        }else {
            neighborEntity = getEntityByRight(moveEntity.getTreeRight().toString());
            if(neighborEntity == null){
                return;
            }
            List<Map<String,Object>> moveEntitySons = getSons(moveEntity);
            List<Map<String,Object>> neighborEntitySons = getSons(neighborEntity);
            String basicSql_2 = "update disk_tree_info d set d.TREE_RIGHT = d.TREE_RIGHT-(:n*2),d.TREE_LEFT = d.TREE_LEFT-(:n*2) where d.TREE_LEFT >=:left and d.TREE_RIGHT<=:right";   //改邻居
            Query query = entityManager.createNativeQuery(basicSql_2);
            query.setParameter("n",moveEntitySons.size() + 1);
            query.setParameter("left",neighborEntity.getTreeLeft());
            query.setParameter("right",neighborEntity.getTreeRight());
            query.executeUpdate();
            moveEntity.setTreeRight(moveEntity.getTreeRight()+ 2*(neighborEntitySons.size()+1));
            moveEntity.setTreeLeft(moveEntity.getTreeLeft()+ 2*(neighborEntitySons.size()+1));
            templist.add(moveEntity);
            for(Map<String,Object> map:moveEntitySons){
                DiskTreeInfoEntity entity = findOne(map.get("treeId").toString());
                entity.setTreeRight(entity.getTreeRight()+ 2*(neighborEntitySons.size()+1));
                entity.setTreeLeft(entity.getTreeLeft()+ 2*(neighborEntitySons.size()+1));
                templist.add(entity);
            }
            save(templist);
        }

    }
}
