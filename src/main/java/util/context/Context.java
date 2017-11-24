package util.context;

import eiis.core.memberInfo.entity.CoreMemberInfoEntity;
import eiis.core.menuTree.entity.CoreMenuTreeInfoEntity;

public class Context {
    public static CoreMemberInfoEntity member = null;//当前登录用户
    public static CoreMenuTreeInfoEntity menuTree = null;//当前访问页面
    public Context(){}

}
