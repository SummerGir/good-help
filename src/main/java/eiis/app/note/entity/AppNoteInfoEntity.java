package eiis.app.note.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "app_note_info")
public class AppNoteInfoEntity {
    private String noteId;
    private String typeDetailId;
    private String title;
    private String content;
    private Timestamp sysTime;
    private String memberId;

    @Id
    @Column(name = "NOTE_ID")
    public String getNoteId() {
        return noteId;
    }

    public void setNoteId(String noteId) {
        this.noteId = noteId;
    }

    @Basic
    @Column(name = "TYPE_DETAIL_ID")
    public String getTypeDetailId() {
        return typeDetailId;
    }

    public void setTypeDetailId(String typeDetailId) {
        this.typeDetailId = typeDetailId;
    }

    @Basic
    @Column(name = "TITLE")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "CONTENT")
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
    @Column(name = "MEMBER_ID")
    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppNoteInfoEntity that = (AppNoteInfoEntity) o;

        if (noteId != null ? !noteId.equals(that.noteId) : that.noteId != null) return false;
        if (typeDetailId != null ? !typeDetailId.equals(that.typeDetailId) : that.typeDetailId != null) return false;
        if (title != null ? !title.equals(that.title) : that.title != null) return false;
        if (content != null ? !content.equals(that.content) : that.content != null) return false;
        if (sysTime != null ? !sysTime.equals(that.sysTime) : that.sysTime != null) return false;
        if (memberId != null ? !memberId.equals(that.memberId) : that.memberId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = noteId != null ? noteId.hashCode() : 0;
        result = 31 * result + (typeDetailId != null ? typeDetailId.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (content != null ? content.hashCode() : 0);
        result = 31 * result + (sysTime != null ? sysTime.hashCode() : 0);
        result = 31 * result + (memberId != null ? memberId.hashCode() : 0);
        return result;
    }
}
