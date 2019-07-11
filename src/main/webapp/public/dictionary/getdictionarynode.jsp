<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="eiis.core.dictionary.EiisDictionary" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.cdtskj.util.Option" %>
<%@ page import="eiis.core.dictionary.EiisDictionaryItem" %>
<%@ page import="com.cdtskj.util.Dictionary" %>
<%@ page import="eiis.core.dictionary.*" %>
<%@ page import="eiis.core.dictionary.db.schema.*" %>
<%@ page import="eiis.core.dictionary.db.schema.Core_dictionary_item" %>
<%@ page import="eiis.util.webui.InputTag" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="eiis.util.jquery.DynatreeChildren" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 13-1-28
  Time: 上午11:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String dictCode = request.getParameter("dictcode");
    String childOnly = request.getParameter("childOnly");
    String typeOnly = request.getParameter("typeOnly");
    String valueOnly = request.getParameter("valueOnly");
    String json = "[]";

    boolean onlyChild = false;
    if(childOnly != null && (childOnly.equalsIgnoreCase("true"))) onlyChild = true;
    boolean onlyType = false;
    if(typeOnly != null && (typeOnly.equalsIgnoreCase("true"))) onlyType = true;
    boolean onlyValue = false;
    if(valueOnly != null && (valueOnly.equalsIgnoreCase("true"))) onlyValue = true;

    //dictCode = "GB/T_4762_1984";

    if(!StringUtils.isBlank(dictCode)){
        List<DynatreeChildren> child = new ArrayList<DynatreeChildren>();
        List<Object> list = new ArrayList<Object>();
        EiisDictionary dict = new EiisDictionary();
        Core_dictionary_type type = dict.getDicByDicCode(dictCode);
        if(onlyType){
            DynatreeChildren root = new DynatreeChildren();
            root.setTitle(type.getType_name());
            root.setKey(type.getType_id().toString());
            //root.setChildren(child);
            root.setExpand(false);
            root.setIsFolder(true);
            list.add(root);
        }else{
            if(onlyChild){
                EiisDictionaryItem it = new EiisDictionaryItem();
                for(Core_dictionary_item item : it.getChildsList(type.getType_id().toString(),null)){
                    DynatreeChildren node = new DynatreeChildren();
                    node.setTitle(item.getItem_name());
                    if(onlyValue){
                        node.setKey(item.getItem_value());
                    }else{
                        node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString()+"|"+item.getType_id().toString());
                    }
                    //node.setKey(item.getItem_value()+"|"+item.getItem_id().toString());
                    //node.setKey(item.getItem_value());
                    list.add(node);
                }
            }else{
                DynatreeChildren root = new DynatreeChildren();
                root.setTitle(type.getType_name());
                root.setKey(type.getType_id().toString());
                root.setChildren(child);
                root.setExpand(true);
                root.setIsFolder(true);
                list.add(root);

                EiisDictionaryItem it = new EiisDictionaryItem();
                for(Core_dictionary_item item : it.getChildsList(type.getType_id().toString(),null)){
                    DynatreeChildren node = new DynatreeChildren();
                    node.setTitle(item.getItem_name());
                    if(onlyValue){
                        node.setKey(item.getItem_value());
                    }else{
                        node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString()+"|"+item.getType_id().toString());
                    }
                    //node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString()+"|"+item.getType_id().toString());
                    //node.setKey(item.getItem_value()+"|"+item.getItem_id().toString());
                    //node.setKey(item.getItem_value());
                    child.add(node);
                }
            }
        }

        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(sw,list);
        json = sw.toString();
    }else{
        List<Object> list = new ArrayList<Object>();
        EiisDictionary dict = new EiisDictionary();
        for(Core_dictionary_type type : dict.getDictionaryList()){
            List<DynatreeChildren> child = new ArrayList<DynatreeChildren>();
            DynatreeChildren root = new DynatreeChildren();
            root.setTitle(type.getType_name());
            root.setKey(type.getType_id().toString());
            //root.setKey(type.getDic_code());
            root.setExpand(true);
            root.setIsFolder(true);
            root.setChildren(child);

            if(onlyType){
                list.add(root);
            }else{
                EiisDictionaryItem it = new EiisDictionaryItem();//取子项
                for(Core_dictionary_item item : it.getChildsList(type.getType_id().toString(),null)){
                    DynatreeChildren node = new DynatreeChildren();
                    node.setTitle(item.getItem_name());
                    if(onlyValue){
                        node.setKey(item.getItem_value());
                    }else{
                        node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString()+"|"+item.getType_id().toString());
                    }
                    //node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString()+"|"+item.getType_id().toString());
                    //node.setKey(item.getItem_value()+ "|" +item.getItem_id().toString());
                    //node.setKey(item.getItem_value());
                    child.add(node);
                }
                if(onlyChild){
                    list.addAll(child);
                }else{
                    list.add(root);
                }
            }
        }

        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(sw,list);
        json = sw.toString();
    }


    //response.setContentType("text/plain");
    response.setContentType("json");
    out.print(json);
%>