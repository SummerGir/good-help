package eiis.app.typeinfo.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 2015.09.15  谢世兵
 */
public class TypeSelectEntity {
    private StringBuffer listOp = new StringBuffer();//小屏幕,下拉框选项
    //大屏幕
    private StringBuffer finishedProOp = new StringBuffer();//无效类型
    private StringBuffer doingProOp = new StringBuffer();//有效类型
    private List<AppTypeDetailEntity> finishedList = new ArrayList<>(); //无效类型的ID及NAME List
    private List<AppTypeDetailEntity> doingList = new ArrayList<>(); //有效类型的ID及NAME List
    private String selectedTypeName; // 选中的类型Name
    private String selectedTypeId;//选中的类型ID

    public String getSelectedTypeName() {return selectedTypeName;}

    public void setSelectedTypeName(String selectedTypeName) {this.selectedTypeName = selectedTypeName;}

    public String getSelectedTypeId() {return selectedTypeId;}

    public void setSelectedTypeId(String selectedTypeId) {this.selectedTypeId = selectedTypeId;}

    public List<AppTypeDetailEntity> getFinishedList() {
        return finishedList;
    }

    public void setFinishedList(List<AppTypeDetailEntity> finishedList) {
        this.finishedList = finishedList;
    }

    public List<AppTypeDetailEntity> getDoingList() {
        return doingList;
    }

    public void setDoingList(List<AppTypeDetailEntity> doingList) {
        this.doingList = doingList;
    }

    public StringBuffer getListOp() {
        return listOp;
    }

    public void setListOp(StringBuffer listOp) {
        this.listOp = listOp;
    }

    public StringBuffer getDoingProOp() {
        return doingProOp;
    }

    public void setDoingProOp(StringBuffer doingProOp) {
        this.doingProOp = doingProOp;
    }

    public StringBuffer getFinishedProOp() {
        return finishedProOp;
    }

    public void setFinishedProOp(StringBuffer finishedProOp) {
        this.finishedProOp = finishedProOp;
    }

}
