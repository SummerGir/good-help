package eiis.app.disk.entity;

import javax.persistence.*;

@Entity
@Table(name = "disk_tree_info", schema = "good-helper", catalog = "")
public class DiskTreeInfoEntity {
    private String treeId;
    private String parentId;
    private String treeName;
    private Integer treeLeft;
    private Integer treeRight;

    @Id
    @Column(name = "TREE_ID", nullable = false, length = 36)
    public String getTreeId() {
        return treeId;
    }

    public void setTreeId(String treeId) {
        this.treeId = treeId;
    }

    @Basic
    @Column(name = "PARENT_ID", nullable = true, length = 36)
    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "TREE_NAME", nullable = true, length = 1000)
    public String getTreeName() {
        return treeName;
    }

    public void setTreeName(String treeName) {
        this.treeName = treeName;
    }

    @Basic
    @Column(name = "TREE_LEFT", nullable = true)
    public Integer getTreeLeft() {
        return treeLeft;
    }

    public void setTreeLeft(Integer treeLeft) {
        this.treeLeft = treeLeft;
    }

    @Basic
    @Column(name = "TREE_RIGHT", nullable = true)
    public Integer getTreeRight() {
        return treeRight;
    }

    public void setTreeRight(Integer treeRight) {
        this.treeRight = treeRight;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DiskTreeInfoEntity entity = (DiskTreeInfoEntity) o;

        if (treeId != null ? !treeId.equals(entity.treeId) : entity.treeId != null) {
            return false;
        }
        if (parentId != null ? !parentId.equals(entity.parentId) : entity.parentId != null) {
            return false;
        }
        if (treeName != null ? !treeName.equals(entity.treeName) : entity.treeName != null) {
            return false;
        }
        if (treeLeft != null ? !treeLeft.equals(entity.treeLeft) : entity.treeLeft != null) {
            return false;
        }
        if (treeRight != null ? !treeRight.equals(entity.treeRight) : entity.treeRight != null) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int result = treeId != null ? treeId.hashCode() : 0;
        result = 31 * result + (parentId != null ? parentId.hashCode() : 0);
        result = 31 * result + (treeName != null ? treeName.hashCode() : 0);
        result = 31 * result + (treeLeft != null ? treeLeft.hashCode() : 0);
        result = 31 * result + (treeRight != null ? treeRight.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "DiskTreeInfoEntity{" +
                "treeId='" + treeId + '\'' +
                ", parentId='" + parentId + '\'' +
                ", treeName='" + treeName + '\'' +
                ", treeLeft=" + treeLeft +
                ", treeRight=" + treeRight +
                '}';
    }
}
