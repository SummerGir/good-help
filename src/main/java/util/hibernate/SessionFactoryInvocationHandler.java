package eiis.util.hibernate;


import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class SessionFactoryInvocationHandler implements InvocationHandler {

    private Object targetObject;

    public SessionFactoryInvocationHandler(Object targetObject) {
        this.targetObject = targetObject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (method.getName().equals("getCurrentSession")) {
            return eiis.util.spring.ApplicationContext.getCurrent().getBean(EntityManagerToSessionBean.class).getCurrentSession();
        }
        return method.invoke(this.targetObject, args);
    }
}
