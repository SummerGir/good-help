package eiis.app.menstrual.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "app_menstrual_info")
public class AppMenstrualInfoEntity {
    private String mensId;
    private Timestamp planStartTime;
    private Timestamp actStartTime;
    private Integer planMensCycle;
    private Integer actMensCycle;
    private Timestamp planOveTime;
    private Timestamp actOveTime;
    private Integer planOveCycle;
    private Integer actOveCycle;
    private Boolean isValid;
    private Timestamp sysTime;

    @Id
    @Column(name = "MENS_ID", nullable = false, length = 36)
    public String getMensId() {
        return mensId;
    }

    public void setMensId(String mensId) {
        this.mensId = mensId;
    }

    @Basic
    @Column(name = "PLAN_START_TIME", nullable = true)
    public Timestamp getPlanStartTime() {
        return planStartTime;
    }

    public void setPlanStartTime(Timestamp planStartTime) {
        this.planStartTime = planStartTime;
    }

    @Basic
    @Column(name = "ACT_START_TIME", nullable = true)
    public Timestamp getActStartTime() {
        return actStartTime;
    }

    public void setActStartTime(Timestamp actStartTime) {
        this.actStartTime = actStartTime;
    }

    @Basic
    @Column(name = "PLAN_MENS_CYCLE", nullable = true)
    public Integer getPlanMensCycle() {
        return planMensCycle;
    }

    public void setPlanMensCycle(Integer planMensCycle) {
        this.planMensCycle = planMensCycle;
    }

    @Basic
    @Column(name = "ACT_MENS_CYCLE", nullable = true)
    public Integer getActMensCycle() {
        return actMensCycle;
    }

    public void setActMensCycle(Integer actMensCycle) {
        this.actMensCycle = actMensCycle;
    }

    @Basic
    @Column(name = "PLAN_OVE_TIME", nullable = true)
    public Timestamp getPlanOveTime() {
        return planOveTime;
    }

    public void setPlanOveTime(Timestamp planOveTime) {
        this.planOveTime = planOveTime;
    }

    @Basic
    @Column(name = "ACT_OVE_TIME", nullable = true)
    public Timestamp getActOveTime() {
        return actOveTime;
    }

    public void setActOveTime(Timestamp actOveTime) {
        this.actOveTime = actOveTime;
    }

    @Basic
    @Column(name = "PLAN_OVE_CYCLE", nullable = true)
    public Integer getPlanOveCycle() {
        return planOveCycle;
    }

    public void setPlanOveCycle(Integer planOveCycle) {
        this.planOveCycle = planOveCycle;
    }

    @Basic
    @Column(name = "ACT_OVE_CYCLE", nullable = true)
    public Integer getActOveCycle() {
        return actOveCycle;
    }

    public void setActOveCycle(Integer actOveCycle) {
        this.actOveCycle = actOveCycle;
    }

    @Basic
    @Column(name = "IS_VALID", nullable = true)
    public Boolean getValid() {
        return isValid;
    }

    public void setValid(Boolean valid) {
        isValid = valid;
    }

    @Basic
    @Column(name = "SYS_TIME", nullable = true)
    public Timestamp getSysTime() {
        return sysTime;
    }

    public void setSysTime(Timestamp sysTime) {
        this.sysTime = sysTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppMenstrualInfoEntity that = (AppMenstrualInfoEntity) o;

        if (mensId != null ? !mensId.equals(that.mensId) : that.mensId != null) return false;
        if (planStartTime != null ? !planStartTime.equals(that.planStartTime) : that.planStartTime != null)
            return false;
        if (actStartTime != null ? !actStartTime.equals(that.actStartTime) : that.actStartTime != null) return false;
        if (planMensCycle != null ? !planMensCycle.equals(that.planMensCycle) : that.planMensCycle != null)
            return false;
        if (actMensCycle != null ? !actMensCycle.equals(that.actMensCycle) : that.actMensCycle != null) return false;
        if (planOveTime != null ? !planOveTime.equals(that.planOveTime) : that.planOveTime != null) return false;
        if (actOveTime != null ? !actOveTime.equals(that.actOveTime) : that.actOveTime != null) return false;
        if (planOveCycle != null ? !planOveCycle.equals(that.planOveCycle) : that.planOveCycle != null) return false;
        if (actOveCycle != null ? !actOveCycle.equals(that.actOveCycle) : that.actOveCycle != null) return false;
        if (isValid != null ? !isValid.equals(that.isValid) : that.isValid != null) return false;
        if (sysTime != null ? !sysTime.equals(that.sysTime) : that.sysTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = mensId != null ? mensId.hashCode() : 0;
        result = 31 * result + (planStartTime != null ? planStartTime.hashCode() : 0);
        result = 31 * result + (actStartTime != null ? actStartTime.hashCode() : 0);
        result = 31 * result + (planMensCycle != null ? planMensCycle.hashCode() : 0);
        result = 31 * result + (actMensCycle != null ? actMensCycle.hashCode() : 0);
        result = 31 * result + (planOveTime != null ? planOveTime.hashCode() : 0);
        result = 31 * result + (actOveTime != null ? actOveTime.hashCode() : 0);
        result = 31 * result + (planOveCycle != null ? planOveCycle.hashCode() : 0);
        result = 31 * result + (actOveCycle != null ? actOveCycle.hashCode() : 0);
        result = 31 * result + (isValid != null ? isValid.hashCode() : 0);
        result = 31 * result + (sysTime != null ? sysTime.hashCode() : 0);
        return result;
    }
}
