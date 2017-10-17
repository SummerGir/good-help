package eiis.app.note.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Created by SSKJ on 2017/7/11.
 */
@Entity
@Table(name = "app_project_detail")
public class AppProjectDetailEntity {
    private String taskId;
    private String taskParentId;
    private Integer parentId;
    private Integer uniqueId;
    private String outlineNumber;
    private String taskName;
    private String taskNameAll;
    private String taskPlanType;
    private String taskType;
    private Integer taskLevel;
    private Integer taskState;
    private Integer taskRemind;
    private BigDecimal progress;
    private Timestamp plannedEndDate;
    private BigDecimal plannedDuration;
    private Timestamp plannedStartDate;
    private Timestamp startDate;
    private Timestamp endDate;
    private BigDecimal duration;
    private String projectId;
    private String projectSection;
    private String customId;
    private String customName;
    private String memberId;
    private String memberName;
    private Integer childrenCount;
    private BigDecimal finishCompare;
    private String predecessors;
    private String preSourceId;
    private Integer preTargetId;
    private String preLag;
    private String preType;
    private Integer taskMeasureTerm;
    private Integer taskMeasureRemind;
    private String originalCode;
    private String comment;
    private Boolean isValid = false;
    private Boolean canQuery = false;

    @Id
    @Column(name = "TASK_ID")
    public String getTaskId() {
        return taskId;
    }
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    @Basic
    @Column(name = "TASK_PARENT_ID")
    public String getTaskParentId() {
        return taskParentId;
    }
    public void setTaskParentId(String taskParentId) {
        this.taskParentId = taskParentId;
    }

    @Basic
    @Column(name = "PARENT_ID")
    public Integer getParentId() {
        return parentId;
    }
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "UNIQUE_ID")
    public Integer getUniqueId() {return uniqueId;}

    public void setUniqueId(Integer uniqueId) {this.uniqueId = uniqueId;}

    @Basic
    @Column(name = "OUTLINE_NUMBER")
    public String getOutlineNumber() {
        return outlineNumber;
    }
    public void setOutlineNumber(String outlineNumber) {
        this.outlineNumber = outlineNumber;
    }

    @Basic
    @Column(name = "TASK_NAME")
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    @Basic
    @Column(name = "TASK_NAME_ALL")
    public String getTaskNameAll() {return taskNameAll;}
    public void setTaskNameAll(String taskNameAll) {this.taskNameAll = taskNameAll;}

    @Basic
    @Column(name = "TASK_PLAN_TYPE")
    public String getTaskPlanType() {
        return taskPlanType;
    }

    public void setTaskPlanType(String taskPlanType) {
        this.taskPlanType = taskPlanType;
    }

    @Basic
    @Column(name = "TASK_TYPE")
    public String getTaskType() {
        return taskType;
    }
    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    @Basic
    @Column(name = "TASK_LEVEL")
    public Integer getTaskLevel() {
        return taskLevel;
    }
    public void setTaskLevel(Integer taskLevel) {
        this.taskLevel = taskLevel;
    }

    @Basic
    @Column(name = "TASK_STATE")
    public Integer getTaskState() {
        return taskState;
    }
    public void setTaskState(Integer taskState) {
        this.taskState = taskState;
    }

    @Basic
    @Column(name = "TASK_REMIND")
    public Integer getTaskRemind() {
        return taskRemind;
    }
    public void setTaskRemind(Integer taskRemind) {
        this.taskRemind = taskRemind;
    }

    @Basic
    @Column(name = "PROGRESS")
    public BigDecimal getProgress() {
        return progress;
    }
    public void setProgress(BigDecimal progress) {
        this.progress = progress;
    }

    @Basic
    @Column(name = "PLANNED_START_DATE")
    public Timestamp getPlannedStartDate() {
        return plannedStartDate;
    }
    public void setPlannedStartDate(Timestamp plannedStartDate) {
        this.plannedStartDate = plannedStartDate;
    }

    @Basic
    @Column(name = "PLANNED_END_DATE")
    public Timestamp getPlannedEndDate() {
        return plannedEndDate;
    }
    public void setPlannedEndDate(Timestamp plannedEndDate) {
        this.plannedEndDate = plannedEndDate;
    }

    @Basic
    @Column(name = "PLANNED_DURATION")
    public BigDecimal getPlannedDuration() {
        return plannedDuration;
    }
    public void setPlannedDuration(BigDecimal plannedDuration) {
        this.plannedDuration = plannedDuration;
    }

    @Basic
    @Column(name = "START_DATE")
    public Timestamp getStartDate() {
        return startDate;
    }
    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "END_DATE")
    public Timestamp getEndDate() {
        return endDate;
    }
    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    @Basic
    @Column(name = "DURATION")
    public BigDecimal getDuration() {
        return duration;
    }
    public void setDuration(BigDecimal duration) {
        this.duration = duration;
    }

    @Basic
    @Column(name = "PROJECT_ID")
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    @Basic
    @Column(name = "PROJECT_SECTION")
    public String getProjectSection() {
        return projectSection;
    }
    public void setProjectSection(String projectSection) {
        this.projectSection = projectSection;
    }

    @Basic
    @Column(name = "CUSTOM_ID")
    public String getCustomId() {
        return customId;
    }
    public void setCustomId(String customId) {
        this.customId = customId;
    }

    @Basic
    @Column(name = "CUSTOM_NAME")
    public String getCustomName() {
        return customName;
    }
    public void setCustomName(String customName) {
        this.customName = customName;
    }

    @Basic
    @Column(name = "MEMBER_ID")
    public String getMemberId() {
        return memberId;
    }
    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    @Basic
    @Column(name = "MEMBER_NAME")
    public String getMemberName() {
        return memberName;
    }
    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    @Basic
    @Column(name = "CHILDREN_COUNT")
    public Integer getChildrenCount() {
        return childrenCount;
    }
    public void setChildrenCount(Integer childrenCount) {
        this.childrenCount = childrenCount;
    }

    @Basic
    @Column(name = "FINISH_COMPARE")
    public BigDecimal getFinishCompare() {
        return finishCompare;
    }
    public void setFinishCompare(BigDecimal finishCompare) {
        this.finishCompare = finishCompare;
    }

    @Basic
    @Column(name = "PREDECESSORS")
    public String getPredecessors() {
        return predecessors;
    }
    public void setPredecessors(String predecessors) {
        this.predecessors = predecessors;
    }

    @Basic
    @Column(name = "PRE_SOURCE_ID")
    public String getPreSourceId() {
        return preSourceId;
    }
    public void setPreSourceId(String preSourceId) {
        this.preSourceId = preSourceId;
    }

    @Basic
    @Column(name = "PRE_TARGET_ID")
    public Integer getPreTargetId() {
        return preTargetId;
    }

    public void setPreTargetId(Integer preTargetId) {
        this.preTargetId = preTargetId;
    }

    @Basic
    @Column(name = "PRE_LAG")
    public String getPreLag() {
        return preLag;
    }
    public void setPreLag(String preLag) {
        this.preLag = preLag;
    }

    @Basic
    @Column(name = "PRE_TYPE")
    public String getPreType() {
        return preType;
    }
    public void setPreType(String preType) {
        this.preType = preType;
    }

    @Basic
    @Column(name = "TASK_MEASURE_TERM")
    public Integer getTaskMeasureTerm() {return taskMeasureTerm;}

    public void setTaskMeasureTerm(Integer taskMeasureTerm) {this.taskMeasureTerm = taskMeasureTerm;}

    @Basic
    @Column(name = "TASK_MEASURE_REMIND")
    public Integer getTaskMeasureRemind() {return taskMeasureRemind;}

    public void setTaskMeasureRemind(Integer taskMeasureRemind) {this.taskMeasureRemind = taskMeasureRemind;}

    @Basic
    @Column(name = "ORIGINAL_CODE")
    public String getOriginalCode() {
        return originalCode;
    }
    public void setOriginalCode(String originalCode) {
        this.originalCode = originalCode;
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
    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }


    @Basic
    @Column(name = "CAN_QUERY")
    public Boolean getCanQuery() {
        return canQuery;
    }

    public void setCanQuery(Boolean canQuery) {
        this.canQuery = canQuery;
    }

}
