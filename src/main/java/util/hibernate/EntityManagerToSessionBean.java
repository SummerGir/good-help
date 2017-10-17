package eiis.util.hibernate;

import org.hibernate.Session;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Service("eiis.util.hibernate.entitymanagertosessionbean")
public class EntityManagerToSessionBean {
    @PersistenceContext
    protected EntityManager entityManager;

    public Session getCurrentSession() {
        return ((org.hibernate.jpa.HibernateEntityManager) this.entityManager).getSession();
    }
}
