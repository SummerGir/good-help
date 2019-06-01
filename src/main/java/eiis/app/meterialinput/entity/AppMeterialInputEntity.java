package eiis.app.meterialinput.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "app_meterial_input", schema = "good-helper", catalog = "")
public class AppMeterialInputEntity {
    private String inputId;
    private String inputCode;
    private Integer year;
    private Integer month;
    private Integer number;
    private String exception;
    private Boolean isValid;
    private Timestamp sysTime;
    private String comment;

    @Id
    @Column(name = "INPUT_ID")
    public String getInputId() {
        return inputId;
    }

    public void setInputId(String inputId) {
        this.inputId = inputId;
    }

    @Basic
    @Column(name = "INPUT_CODE")
    public String getInputCode() {
        return inputCode;
    }

    public void setInputCode(String inputCode) {
        this.inputCode = inputCode;
    }

    @Basic
    @Column(name = "YEAR")
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Basic
    @Column(name = "MONTH")
    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    @Basic
    @Column(name = "NUMBER")
    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    @Basic
    @Column(name = "EXCEPTION")
    public String getException() {
        return exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }

    @Basic
    @Column(name = "IS_VALID")
    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
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

}
