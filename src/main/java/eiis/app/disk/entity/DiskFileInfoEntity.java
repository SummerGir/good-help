package eiis.app.disk.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "disk_file_info", schema = "good-helper", catalog = "")
public class DiskFileInfoEntity {
    private String fileId;
    private String fileTreeId;
    private String fileName;
    private String filePath;
    private Timestamp createdTime;
    private Timestamp systime;
    private String comment;

    @Id
    @Column(name = "FILE_ID", nullable = false, length = 36)
    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    @Basic
    @Column(name = "FILE_TREE_ID", nullable = true, length = 36)
    public String getFileTreeId() {
        return fileTreeId;
    }

    public void setFileTreeId(String fileTreeId) {
        this.fileTreeId = fileTreeId;
    }

    @Basic
    @Column(name = "FILE_NAME", nullable = true, length = 50)
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Basic
    @Column(name = "FILE_PATH", nullable = true, length = 2000)
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    @Basic
    @Column(name = "CREATED_TIME", nullable = true)
    public Timestamp getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Timestamp createdTime) {
        this.createdTime = createdTime;
    }

    @Basic
    @Column(name = "SYSTIME", nullable = true)
    public Timestamp getSystime() {
        return systime;
    }

    public void setSystime(Timestamp systime) {
        this.systime = systime;
    }

    @Basic
    @Column(name = "COMMENT", nullable = true, length = 2000)
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DiskFileInfoEntity entity = (DiskFileInfoEntity) o;

        if (fileId != null ? !fileId.equals(entity.fileId) : entity.fileId != null) {
            return false;
        }
        if (fileTreeId != null ? !fileTreeId.equals(entity.fileTreeId) : entity.fileTreeId != null) {
            return false;
        }
        if (fileName != null ? !fileName.equals(entity.fileName) : entity.fileName != null) {
            return false;
        }
        if (filePath != null ? !filePath.equals(entity.filePath) : entity.filePath != null) {
            return false;
        }
        if (createdTime != null ? !createdTime.equals(entity.createdTime) : entity.createdTime != null) {
            return false;
        }
        if (systime != null ? !systime.equals(entity.systime) : entity.systime != null) {
            return false;
        }
        if (comment != null ? !comment.equals(entity.comment) : entity.comment != null) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int result = fileId != null ? fileId.hashCode() : 0;
        result = 31 * result + (fileTreeId != null ? fileTreeId.hashCode() : 0);
        result = 31 * result + (fileName != null ? fileName.hashCode() : 0);
        result = 31 * result + (filePath != null ? filePath.hashCode() : 0);
        result = 31 * result + (createdTime != null ? createdTime.hashCode() : 0);
        result = 31 * result + (systime != null ? systime.hashCode() : 0);
        result = 31 * result + (comment != null ? comment.hashCode() : 0);
        return result;
    }
}
