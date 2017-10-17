package eiis.util.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.jpa.HibernateEntityManagerFactory;

import javax.persistence.PersistenceUnit;
import java.lang.reflect.Proxy;

/**
 * Created with IntelliJ IDEA.
 * User: Jiong
 * Date: 13-8-23
 * Time: 下午3:11
 * To change this template use File | Settings | File Templates.
 */
public class EntityManagerFactoryToSessionFactoryBean implements org.springframework.beans.factory.FactoryBean<SessionFactory> {

    @PersistenceUnit
    protected javax.persistence.EntityManagerFactory entityManagerFactory;

    @Override
    public SessionFactory getObject() {
        SessionFactory sessionFactory =((HibernateEntityManagerFactory)this.entityManagerFactory).getSessionFactory();
        //拦截器对象
        SessionFactoryInvocationHandler handler = new SessionFactoryInvocationHandler(sessionFactory);
        //返回业务对象的代理对象
        return (SessionFactory)Proxy.newProxyInstance(
                sessionFactory.getClass().getClassLoader(),
                sessionFactory.getClass().getInterfaces(),
                handler);
    }

    @Override
    public Class<?> getObjectType() {
        return org.hibernate.SessionFactory.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
