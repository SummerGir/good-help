package eiis.app.meterialinput.entity;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "app_meterial_input_detail", schema = "good-helper", catalog = "")
public class AppMeterialInputDetailEntity {
    private String detailId;
    private String inputId;
    private String dicId;
    private BigDecimal detailNum;
    private BigDecimal detailPrice;
    private BigDecimal money;
    private String comment;

    @Id
    @Column(name = "DETAIL_ID")
    public String getDetailId() {
        return detailId;
    }

    public void setDetailId(String detailId) {
        this.detailId = detailId;
    }

    @Basic
    @Column(name = "INPUT_ID")
    public String getInputId() {
        return inputId;
    }

    public void setInputId(String inputId) {
        this.inputId = inputId;
    }

    @Basic
    @Column(name = "DIC_ID")
    public String getDicId() {
        return dicId;
    }

    public void setDicId(String dicId) {
        this.dicId = dicId;
    }

    @Basic
    @Column(name = "DETAIL_NUM")
    public BigDecimal getDetailNum() {
        return detailNum;
    }

    public void setDetailNum(BigDecimal detailNum) {
        this.detailNum = detailNum;
    }

    @Basic
    @Column(name = "DETAIL_PRICE")
    public BigDecimal getDetailPrice() {
        return detailPrice;
    }

    public void setDetailPrice(BigDecimal detailPrice) {
        this.detailPrice = detailPrice;
    }

    @Basic
    @Column(name = "MONEY")
    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
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

        AppMeterialInputDetailEntity that = (AppMeterialInputDetailEntity) o;

        if (detailId != null ? !detailId.equals(that.detailId) : that.detailId != null) return false;
        if (inputId != null ? !inputId.equals(that.inputId) : that.inputId != null) return false;
        if (dicId != null ? !dicId.equals(that.dicId) : that.dicId != null) return false;
        if (detailNum != null ? !detailNum.equals(that.detailNum) : that.detailNum != null) return false;
        if (detailPrice != null ? !detailPrice.equals(that.detailPrice) : that.detailPrice != null) return false;
        if (money != null ? !money.equals(that.money) : that.money != null) return false;
        if (comment != null ? !comment.equals(that.comment) : that.comment != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = detailId != null ? detailId.hashCode() : 0;
        result = 31 * result + (inputId != null ? inputId.hashCode() : 0);
        result = 31 * result + (dicId != null ? dicId.hashCode() : 0);
        result = 31 * result + (detailNum != null ? detailNum.hashCode() : 0);
        result = 31 * result + (detailPrice != null ? detailPrice.hashCode() : 0);
        result = 31 * result + (money != null ? money.hashCode() : 0);
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        return result;
    }
}
