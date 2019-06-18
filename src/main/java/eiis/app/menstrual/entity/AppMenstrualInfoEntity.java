package eiis.app.menstrual.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "APP_MENSTRUAL_INFO")
public class AppMenstrualInfoEntity {
    private String mensId;
    private Timestamp startTime;
    private Timestamp endTime;
    private Integer duration;
    private Integer mensCycle;
    private Integer mensDiver;
    private Boolean isValid;

    @Id
    @Column(name = "MENS_ID")
    public String getMensId() {
        return mensId;
    }

    public void setMensId(String mensId) {
        this.mensId = mensId;
    }

    @Basic
    @Column(name = "START_TIME")
    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    @Basic
    @Column(name = "END_TIME")
    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    @Basic
    @Column(name = "DURATION")
    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    @Basic
    @Column(name = "MENS_CYCLE")
    public Integer getMensCycle() {
        return mensCycle;
    }

    public void setMensCycle(Integer mensCycle) {
        this.mensCycle = mensCycle;
    }

    @Basic
    @Column(name = "MENS_DIVER")
    public Integer getMensDiver() {
        return mensDiver;
    }

    public void setMensDiver(Integer mensDiver) {
        this.mensDiver = mensDiver;
    }

    @Basic
    @Column(name = "IS_VALID")
    public Boolean getValid() {
        return isValid;
    }

    public void setValid(Boolean valid) {
        isValid = valid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppMenstrualInfoEntity that = (AppMenstrualInfoEntity) o;

        if (mensId != null ? !mensId.equals(that.mensId) : that.mensId != null) return false;
        if (startTime != null ? !startTime.equals(that.startTime) : that.startTime != null) return false;
        if (endTime != null ? !endTime.equals(that.endTime) : that.endTime != null) return false;
        if (duration != null ? !duration.equals(that.duration) : that.duration != null) return false;
        if (mensCycle != null ? !mensCycle.equals(that.mensCycle) : that.mensCycle != null) return false;
        if (mensDiver != null ? !mensDiver.equals(that.mensDiver) : that.mensDiver != null) return false;
        if (isValid != null ? !isValid.equals(that.isValid) : that.isValid != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = mensId != null ? mensId.hashCode() : 0;
        result = 31 * result + (startTime != null ? startTime.hashCode() : 0);
        result = 31 * result + (endTime != null ? endTime.hashCode() : 0);
        result = 31 * result + (duration != null ? duration.hashCode() : 0);
        result = 31 * result + (mensCycle != null ? mensCycle.hashCode() : 0);
        result = 31 * result + (mensDiver != null ? mensDiver.hashCode() : 0);
        result = 31 * result + (isValid != null ? isValid.hashCode() : 0);
        return result;
    }
}
