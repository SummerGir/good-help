package eiis.app.home.entity;

import javax.persistence.*;

@Entity
@Table(name = "home", schema = "good-helper", catalog = "")
public class HomeEntity {
    private String id;
    private String homeIndex;
    private String homeMax;

    @Id
    @Column(name = "id", nullable = false, length = 50)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name = "home_index", nullable = true, length = 50)
    public String getHomeIndex() {
        return homeIndex;
    }

    public void setHomeIndex(String homeIndex) {
        this.homeIndex = homeIndex;
    }

    @Basic
    @Column(name = "home_max", nullable = true, length = 50)
    public String getHomeMax() {
        return homeMax;
    }

    public void setHomeMax(String homeMax) {
        this.homeMax = homeMax;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        HomeEntity entity = (HomeEntity) o;

        if (id != null ? !id.equals(entity.id) : entity.id != null) {
            return false;
        }
        if (homeIndex != null ? !homeIndex.equals(entity.homeIndex) : entity.homeIndex != null) {
            return false;
        }
        if (homeMax != null ? !homeMax.equals(entity.homeMax) : entity.homeMax != null) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (homeIndex != null ? homeIndex.hashCode() : 0);
        result = 31 * result + (homeMax != null ? homeMax.hashCode() : 0);
        return result;
    }
}
