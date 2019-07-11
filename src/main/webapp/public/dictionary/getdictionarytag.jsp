<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="eiis.core.dictionary.EiisDictionary" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.cdtskj.util.Option" %>
<%@ page import="eiis.core.dictionary.EiisDictionaryItem" %>
<%@ page import="com.cdtskj.util.Dictionary" %>
<%@ page import="eiis.core.dictionary.ProjDictionary" %>
<%@ page import="eiis.core.dictionary.db.schema.Core_dictionary_item" %>
<%@ page import="eiis.util.webui.InputTag" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="eiis.util.jquery.DynatreeChildren" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="eiis.core.dictionary.db.schema.Core_dictionary_type" %>
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
    String ids = request.getParameter("ids");
    String find = request.getParameter("find");
    String json = "[]";

    boolean onlyChild = false;
    if(childOnly != null && (childOnly.equalsIgnoreCase("true"))) onlyChild = true;
    boolean onlyType = false;
    if(typeOnly != null && (typeOnly.equalsIgnoreCase("true"))) onlyType = true;

    if(!StringUtils.isBlank(ids)){
        List<InputTag> child = new ArrayList<InputTag>();
        for(String id : StringUtils.split(ids,";")){
            try {
                if(!StringUtils.isBlank(id)){
                    String[] data = StringUtils.split(id,"|");
                    if(onlyType){
                        if(data.length == 1){
                            long  _id = Long.parseLong(data[0]);
                            EiisDictionary dict = new EiisDictionary();
                            Core_dictionary_type item = dict.get(_id);
                            InputTag tag = new InputTag();
                            tag.setLabel(item.getType_name());
                            tag.setDesc(item.getType_name());
                            //tag.setValue(item.getItem_value());
                            tag.setValue(item.getType_id().toString());
                            child.add(tag);
                        }
                    }else{
                        if(data.length > 1){
                            long  _id = Long.parseLong(data[1]);
                            EiisDictionaryItem dictItem = new EiisDictionaryItem();
                            Core_dictionary_item item = dictItem.get(_id);
                            InputTag tag = new InputTag();
                            tag.setLabel(item.getItem_name());
                            tag.setDesc(item.getItem_name());
                            //tag.setValue(item.getItem_value());
                            tag.setValue(item.getItem_value()+"|"+item.getItem_id().toString()+"|"+item.getType_id().toString());
                            child.add(tag);
                        }
                    }
                }
            } catch (NumberFormatException e) {
                //e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(sw,child);
        json = sw.toString();
    }

    if(!StringUtils.isBlank(find) && !StringUtils.isBlank(dictCode)){
        List<Object> child = new ArrayList<Object>();
        EiisDictionary dict = new EiisDictionary();
        Core_dictionary_type type = dict.getDicByDicCode(dictCode);
        if(onlyType){
            if(type.getType_name().toLowerCase().contains(find.toLowerCase()) || type.getDic_code().toLowerCase().contains(find.toLowerCase())){
                InputTag tag = new InputTag();
                tag.setLabel(type.getType_name());
                tag.setDesc(type.getType_name());
                tag.setValue(type.getType_id().toString());
                child.add(tag);
            }
        }else{
            EiisDictionaryItem it = new EiisDictionaryItem();
            for(Core_dictionary_item item : it.getChildsList(type.getType_id().toString(),null)){
                if(StringUtils.contains(item.getItem_name(),find.trim())){
                    InputTag tag = new InputTag();
                    tag.setLabel(item.getItem_name());
                    tag.setDesc(item.getItem_name());
                    tag.setValue(item.getItem_value()+"|"+item.getItem_id().toString()+"|"+item.getType_id().toString());
                    child.add(tag);
                }
            }
        }

        StringWriter sw = new StringWriter();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(sw,child);
        json = sw.toString();
    }

    //response.setContentType("text/plain");
    response.setContentType("json");
    out.print(json);
%>