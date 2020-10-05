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


    public String getFatherNodeName(String treeId){
        DiskTreeInfoEntity fatherEntity = findOne(treeId);
        if(StringUtils.isNotBlank(fatherEntity.getParentId())){
            return getFatherNodeName(fatherEntity.getParentId())+">"+fatherEntity.getTreeName();
        }else {
            return fatherEntity.getTreeName();
        }
    }

    public List<Map<String,Object>> getMainInfo(String parentId,String loadnum) throws Exception{
        List<Map<String,Object>> list = new ArrayList<>();
        List<Map<String,Object>> list_1;

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
//            map.put("text",map.get("text")+"  ("+map.get("treeLeft")+"-"+map.get("treeRight")+")");
            map.put("text",map.get("text"));
            if((Integer.parseInt(map.get("treeRight").toString())-Integer.parseInt(map.get("treeLeft").toString()))>1){
//                if ("root".equalsIgnoreCase(map.get("treeId").toString())) {
                    map.put("children", getMainInfo(map.get("treeId").toString(),"1"));
                    map.put("state","open");
                    map.put("isLoad",true);
//                }else{
//                    map.put("children", new ArrayList<>());
//                    map.put("state","closed");
//                    map.put("isLoad",false);
//                }
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
    public void changeFather(DiskTreeInfoEntity entity,String fatherId)throws Exception{
        List<Map<String,Object>> listSons = getSons(entity);
        DiskTreeInfoEntity fatherEntity = findOne(fatherId);
        Integer n = listSons.size()+1;
        //改后面的左右值
        String basicSql_1 = "update disk_tree_info dti set dti.TREE_LEFT = dti.TREE_LEFT-(:n*2),dti.TREE_RIGHT = dti.TREE_RIGHT-(:n*2) where dti.TREE_LEFT > :right";
        entityManager.createNativeQuery(basicSql_1).setParameter("n",n).setParameter("right",entity.getTreeRight()).executeUpdate();

        //改后面的左右值
        String basicSql_2 = "update disk_tree_info dti set dti.TREE_LEFT = dti.TREE_LEFT+(:n*2),dti.TREE_RIGHT = dti.TREE_RIGHT+(:n*2) where dti.TREE_LEFT > :left";
        entityManager.createNativeQuery(basicSql_2).setParameter("n",n).setParameter("left",fatherEntity.getTreeLeft()).executeUpdate();

        String basicSql_4 = "update disk_tree_info dti set dti.TREE_RIGHT = dti.TREE_RIGHT+(:n*2) where dti.TREE_ID = :fatherId";
        entityManager.createNativeQuery(basicSql_4).setParameter("n",n).setParameter("fatherId",fatherId).executeUpdate();

        fatherId = entity.getParentId();
        String basicSql_5 = "update disk_tree_info dti set dti.TREE_RIGHT = dti.TREE_RIGHT-(:n*2) where dti.TREE_ID = :fatherId";
        entityManager.createNativeQuery(basicSql_5).setParameter("n",n).setParameter("fatherId",fatherId).executeUpdate();

        List<String> list = new ArrayList<>();
        for(Map<String,Object> map:listSons){
            for(Map.Entry<String,Object> entry:map.entrySet()){
                if("treeId".equals(entry.getKey())){
                    list.add(entry.getValue().toString());
                }
            }
        }
        list.add(entity.getTreeId());
        n = fatherEntity.getTreeLeft() - entity.getTreeLeft() + 1 ;
        //改后面的左右值
        String basicSql_3 = "update disk_tree_info dti set dti.TREE_LEFT = dti.TREE_LEFT+(:n),dti.TREE_RIGHT = dti.TREE_RIGHT+(:n) where dti.TREE_ID in (:list)";
        entityManager.createNativeQuery(basicSql_3).setParameter("n",n).setParameter("list",list).executeUpdate();
    }

    public void moveParent(DiskTreeInfoEntity thisEn,String newParentId){
        //得到旧节点的所有上级节点，倒序
        List<String> old_li = getParentIds(thisEn.getParentId());
        //得到新节点的所有上级节点，倒序
        List<String> new_li = getParentIds(newParentId);
        //得到公共最小节点
        String re_treeId = "";
        for(String id : old_li){
            if(new_li.contains(id)){
                re_treeId = id;
                break;
            }
        }

        //得到公共节点的对象
        DiskTreeInfoEntity re_en = dao.findOne(re_treeId);
        //得到的集合
        List<DiskTreeInfoEntity> list = entityManager.createQuery("select en from DiskTreeInfoEntity en where en.treeLeft>=:treeLeft and en.treeRight<=:treeRight order by en.treeLeft").setParameter("treeLeft",re_en.getTreeLeft()).setParameter("treeRight", re_en.getTreeRight()).getResultList();

        //根据parentId将list分组
        Map<String,List<DiskTreeInfoEntity>> map = new HashMap<>();
        for(DiskTreeInfoEntity entity : list){
            //在这里将节点的父Id改变
            if (thisEn.getTreeId().equals(entity.getTreeId())) {
                entity.setTreeName(thisEn.getTreeName());
                entity.setParentId(newParentId);
            }
            List<DiskTreeInfoEntity> li = map.get(entity.getParentId());
            if(li == null){
                li = new ArrayList<>();
            }
            li.add(entity);
            map.put(entity.getParentId(), li);
        }

        //更新左右值
        setNum(map,list.get(0));

        //结果输出验证
//        for(DiskTreeInfoEntity en : list){
//            System.out.println(en.toString());
//        }
//        System.out.println("原始List集合结果");
//        for(String key : map.keySet()){
//            List<DiskTreeInfoEntity> li = map.get(key);
//            for(DiskTreeInfoEntity en : li){
//                System.out.println(en.toString());
//            }
//        }
//        System.out.println("新的map集合结果");

        //保存
        dao.save(list);
    }

    private int setNum(Map<String,List<DiskTreeInfoEntity>> map,DiskTreeInfoEntity parent){
        List<DiskTreeInfoEntity> li = map.get(parent.getTreeId());
        int leftVal = parent.getTreeLeft();
        int return_rightVal = -1;//返回给parent最后一个子节点的右值。如果没有子节点，则返回-1
        if(li != null && li.size() > 0){
            for(DiskTreeInfoEntity entity : li){
                entity.setTreeLeft(++leftVal);
                int rightVal = setNum(map,entity);
                //有下级节点，
                if(rightVal != -1){
                    leftVal = rightVal;
                }
                entity.setTreeRight(++leftVal);
            }
            return_rightVal = li.get(li.size() - 1).getTreeRight();
        }
        return return_rightVal;
    }

    private List<String> getParentIds(String parentId){
        String sql = "select a.TREE_ID from disk_tree_info a join (select b.TREE_NAME,b.TREE_LEFT,b.TREE_RIGHT from disk_tree_info b where b.TREE_ID=:parentId) c on a.TREE_LEFT<=c.TREE_LEFT and a.TREE_RIGHT>=c.TREE_RIGHT order by a.TREE_LEFT desc";
        return entityManager.createNativeQuery(sql).setParameter("parentId",parentId).getResultList();
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
