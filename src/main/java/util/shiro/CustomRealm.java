package util.shiro;

import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import eiis.core.memberInfo.service.CoreMemberInfoService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @ClassName CustomRealm
 * @Description TODO
 * @Author Jane
 * @Date 2020/4/13 15:14
 * @Version 1.0
 */
public class CustomRealm extends AuthorizingRealm {


    @Autowired
    CoreMemberInfoService service;

    @Override
    public void setName(String name) {
        super.setName("customRealm");
    }

    /**
     * 认证
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        System.out.println("认证方法");
        // authenticationToken中包含用户输入的用户名和密码
        // 第一步从authenticationToken中取出用户名
//        String userName = (String) authenticationToken.getPrincipal();
        // 第二步：根据用户输入的userCode从数据库查询
//        TAdminUser adminUser = adminUserService.getAdminUserByUserName(userName);
        // 如果查询不到返回null
//        if (adminUser == null) {//
//            return null;
//        }
        // 获取数据库中的密码
//        String password = adminUser.getPassword();
        /**
         * 认证的用户,正确的密码
         */
//        AuthenticationInfo authcInfo = new SimpleAuthenticationInfo(adminUser, password, this.getName());
        //MD5 加密+加盐+多次加密
//<span style="color:#ff0000;">SimpleAuthenticationInfo authcInfo = new SimpleAuthenticationInfo(adminUser, password,ByteSource.Util.bytes(salt), this.getName());</span>
//        return authcInfo;
        UsernamePasswordToken token =(UsernamePasswordToken)authenticationToken;
        String username = token.getUsername();
        String pwd = new String(token.getPassword());
        CoreMemberInfoEntity entity = service.loginCheck(username,pwd);
        if(entity == null){
            throw new UnknownAccountException();
        }else if(entity.getIsFrozen()){
            // 帐号未启用(或账号被锁定)
            throw new LockedAccountException();
        }else{
            return new SimpleAuthenticationInfo(entity, token.getCredentials(), CustomRealm.class.getName());
        }

    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        System.out.println("授权方法");
        return null;
    }
}
