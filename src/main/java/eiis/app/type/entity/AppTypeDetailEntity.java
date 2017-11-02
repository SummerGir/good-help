package eiis.app.type.entity;

import javax.persistence.*;

/**
 * Created by xiucai on 2017/11/2.
 */
@Entity
@Table(name = "APP_TYPE_DETAIL")
public class AppTypeDetailEntity {
    private String typeDetailId;
    private String typeId;
    private String detailName;
    private String detailCode;
    private String comment;
    private boolean isValid = true;

    @Id
    @Column(name = "TYPE_DETAIL_ID")
    public String getTypeDetailId() {
        return typeDetailId;
    }

    public void setTypeDetailId(String typeDetailId) {
        this.typeDetailId = typeDetailId;
    }

    @Basic
    @Column(name = "TYPE_ID")
    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    @Basic
    @Column(name = "DETAIL_NAME")
    public String getDetailName() {
        return detailName;
    }

    public void setDetailName(String detailName) {
        this.detailName = detailName;
    }

    @Basic
    @Column(name = "DETAIL_CODE")
    public String getDetailCode() {
        return detailCode;
    }

    public void setDetailCode(String detailCode) {
        this.detailCode = detailCode;
    }

    @Basic
    @Column(name = "COMMENT")
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Basic
    @Column(name = "IS_VALID")
    public boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(boolean isValid) {
        this.isValid = isValid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppTypeDetailEntity that = (AppTypeDetailEntity) o;

        if (isValid != that.isValid) return false;
        if (typeDetailId != null ? !typeDetailId.equals(that.typeDetailId) : that.typeDetailId != null) return false;
        if (typeId != null ? !typeId.equals(that.typeId) : that.typeId != null) return false;
        if (detailName != null ? !detailName.equals(that.detailName) : that.detailName != null) return false;
        if (detailCode != null ? !detailCode.equals(that.detailCode) : that.detailCode != null) return false;
        if (comment != null ? !comment.equals(that.comment) : that.comment != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = typeDetailId != null ? typeDetailId.hashCode() : 0;
        result = 31 * result + (typeId != null ? typeId.hashCode() : 0);
        result = 31 * result + (detailName != null ? detailName.hashCode() : 0);
        result = 31 * result + (detailCode != null ? detailCode.hashCode() : 0);
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        result = 31 * result + (isValid ? 1 : 0);
        return result;
    }
}
