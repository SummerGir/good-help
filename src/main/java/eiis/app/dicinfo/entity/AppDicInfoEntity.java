package eiis.app.dicinfo.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "app_dic_info")
public class AppDicInfoEntity {
    private String dicId;
    private String dicName;
    private String dicCode;
    private BigDecimal price;
    private Integer priorityLevel;
    private Timestamp sysTime;
    private String comment;

    @Id
    @Column(name = "DIC_ID")
    public String getDicId() {
        return dicId;
    }

    public void setDicId(String dicId) {
        this.dicId = dicId;
    }

    @Basic
    @Column(name = "DIC_NAME")
    public String getDicName() {
        return dicName;
    }

    public void setDicName(String dicName) {
        this.dicName = dicName;
    }

    @Basic
    @Column(name = "DIC_CODE")
    public String getDicCode() {
        return dicCode;
    }

    public void setDicCode(String dicCode) {
        this.dicCode = dicCode;
    }

    @Basic
    @Column(name = "PRICE")
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    @Basic
    @Column(name = "PRIORITY_LEVEL")
    public Integer getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(Integer priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    @Basic
    @Column(name = "SYS_TIME")
    public Timestamp getSysTime() {
        return sysTime;
    }

    public void setSysTime(Timestamp sysTime) {
        this.sysTime = sysTime;
    }

    @Basic
    @Column(name = "COMMENT")
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppDicInfoEntity that = (AppDicInfoEntity) o;

        if (dicId != null ? !dicId.equals(that.dicId) : that.dicId != null) return false;
        if (dicName != null ? !dicName.equals(that.dicName) : that.dicName != null) return false;
        if (dicCode != null ? !dicCode.equals(that.dicCode) : that.dicCode != null) return false;
        if (price != null ? !price.equals(that.price) : that.price != null) return false;
        if (priorityLevel != null ? !priorityLevel.equals(that.priorityLevel) : that.priorityLevel != null)
            return false;
        if (sysTime != null ? !sysTime.equals(that.sysTime) : that.sysTime != null) return false;
        if (comment != null ? !comment.equals(that.comment) : that.comment != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = dicId != null ? dicId.hashCode() : 0;
        result = 31 * result + (dicName != null ? dicName.hashCode() : 0);
        result = 31 * result + (dicCode != null ? dicCode.hashCode() : 0);
        result = 31 * result + (price != null ? price.hashCode() : 0);
        result = 31 * result + (priorityLevel != null ? priorityLevel.hashCode() : 0);
        result = 31 * result + (sysTime != null ? sysTime.hashCode() : 0);
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        return result;
    }
}
