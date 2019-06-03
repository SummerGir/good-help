-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.6.10 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  8.2.0.4675
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出  表 good-helper.app_daily_cost_info 结构
DROP TABLE IF EXISTS `app_daily_cost_info`;
CREATE TABLE IF NOT EXISTS `app_daily_cost_info` (
  `COST_ID` char(36) NOT NULL,
  `TITLE` varchar(200) DEFAULT NULL COMMENT '标题',
  `COST_TIME` datetime DEFAULT NULL COMMENT '消费日期',
  `PAY_MONEY` decimal(18,4) DEFAULT NULL COMMENT '消费金额',
  `TYPE_DETAIL_ID` decimal(18,4) DEFAULT NULL COMMENT '支付类型，对应app_type_detail表的主键',
  `SYS_TIME` datetime DEFAULT NULL COMMENT '编制日期',
  PRIMARY KEY (`COST_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='日常消费记录';

-- 正在导出表  good-helper.app_daily_cost_info 的数据：~0 rows (大约)
DELETE FROM `app_daily_cost_info`;
/*!40000 ALTER TABLE `app_daily_cost_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_daily_cost_info` ENABLE KEYS */;


-- 导出  表 good-helper.app_dic_info 结构
DROP TABLE IF EXISTS `app_dic_info`;
CREATE TABLE IF NOT EXISTS `app_dic_info` (
  `DIC_ID` char(36) NOT NULL,
  `DIC_NAME` varchar(100) DEFAULT NULL COMMENT '名称',
  `DIC_CODE` varchar(100) DEFAULT NULL COMMENT '编码',
  `UNIT_NAME` varchar(100) DEFAULT NULL COMMENT '材料单位',
  `PRICE` decimal(18,2) DEFAULT NULL COMMENT '价格',
  `PRIORITY_LEVEL` int(11) DEFAULT NULL COMMENT '显示的优先级，最小的在最前面',
  `SYS_TIME` datetime DEFAULT NULL COMMENT '编辑日期',
  `COMMENT` varchar(100) DEFAULT NULL COMMENT '备注说明',
  PRIMARY KEY (`DIC_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='材料字典';

-- 正在导出表  good-helper.app_dic_info 的数据：~1 rows (大约)
DELETE FROM `app_dic_info`;
/*!40000 ALTER TABLE `app_dic_info` DISABLE KEYS */;
INSERT INTO `app_dic_info` (`DIC_ID`, `DIC_NAME`, `DIC_CODE`, `UNIT_NAME`, `PRICE`, `PRIORITY_LEVEL`, `SYS_TIME`, `COMMENT`) VALUES
	('895395fb-7f17-4a21-89e1-138d3b355920', '线条', '', '个', 3.00, 2, '2019-06-03 19:09:55', ''),
	('a', '门', '', '套', 7.00, 1, '2019-06-03 19:09:37', '');
/*!40000 ALTER TABLE `app_dic_info` ENABLE KEYS */;


-- 导出  表 good-helper.app_meterial_input 结构
DROP TABLE IF EXISTS `app_meterial_input`;
CREATE TABLE IF NOT EXISTS `app_meterial_input` (
  `INPUT_ID` char(36) NOT NULL,
  `INPUT_CODE` varchar(100) DEFAULT NULL COMMENT '单据编号，自动组装',
  `YEAR` int(11) DEFAULT NULL COMMENT '年',
  `MONTH` int(11) DEFAULT NULL COMMENT '月',
  `NUMBER` varchar(50) DEFAULT NULL,
  `EXCEPTION` varchar(100) DEFAULT NULL COMMENT '单据例外编号，如：A/B/C等',
  `IS_VALID` bit(1) DEFAULT NULL COMMENT '是否对账',
  `SYS_TIME` timestamp NULL DEFAULT NULL COMMENT '编辑日期',
  `COMMENT` varchar(100) DEFAULT NULL COMMENT '备注说明',
  PRIMARY KEY (`INPUT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='单据录入';

-- 正在导出表  good-helper.app_meterial_input 的数据：~9 rows (大约)
DELETE FROM `app_meterial_input`;
/*!40000 ALTER TABLE `app_meterial_input` DISABLE KEYS */;
INSERT INTO `app_meterial_input` (`INPUT_ID`, `INPUT_CODE`, `YEAR`, `MONTH`, `NUMBER`, `EXCEPTION`, `IS_VALID`, `SYS_TIME`, `COMMENT`) VALUES
	('1143d6eb-caf5-4022-a79a-31d78c6dc7a7', '6-2', 2019, 6, '2', '', b'0', '2019-06-03 19:01:09', ''),
	('4c407a57-c362-40f2-97b6-7ef2cddc413d', '6-3', 2019, 6, '3', '', b'0', '2019-06-03 19:10:31', ''),
	('73bc23cd-8f53-4a8e-bcea-ec13dd430518', '6-4', 2019, 6, '4', '', b'1', '2019-06-03 19:25:57', ''),
	('7be14b1c-147d-4c7a-826e-89646cb671d6', '6-7', 2019, 6, '7', '', b'0', '2019-06-03 20:21:38', ''),
	('94134005-3884-4ce8-bdcd-1d6d65b67d71', '6-111-B', 2019, 6, '111', 'B', b'1', '2019-06-02 22:49:03', 'd'),
	('9c0f5627-993e-46a3-b342-54e72409886c', '6-333', 2019, 6, '333', '', b'1', '2019-06-03 18:57:58', ''),
	('ad472962-4c80-4f2d-ba5d-63a1a7c0ea1e', '6-2', 2019, 6, '2', '', b'0', '2019-06-03 19:14:04', ''),
	('c2737c74-b04a-4db0-a73a-d45560a4b59f', '6-55', 2019, 6, '55', '', b'0', '2019-06-03 20:21:57', ''),
	('dba9d01e-2879-4ba0-bea7-0b26b10b308b', '6-5', 2019, 6, '5', '', b'1', '2019-06-03 20:21:33', '');
/*!40000 ALTER TABLE `app_meterial_input` ENABLE KEYS */;


-- 导出  表 good-helper.app_meterial_input_detail 结构
DROP TABLE IF EXISTS `app_meterial_input_detail`;
CREATE TABLE IF NOT EXISTS `app_meterial_input_detail` (
  `DETAIL_ID` char(36) NOT NULL,
  `INPUT_ID` char(36) NOT NULL,
  `DIC_ID` char(36) NOT NULL,
  `DETAIL_NUM` decimal(10,2) DEFAULT NULL COMMENT '数量',
  `DETAIL_PRICE` decimal(10,2) DEFAULT NULL COMMENT '单价',
  `MONEY` decimal(10,2) DEFAULT NULL COMMENT '金额',
  `COMMENT` varchar(100) DEFAULT NULL COMMENT '备注说明',
  PRIMARY KEY (`DETAIL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='单据录入明细';

-- 正在导出表  good-helper.app_meterial_input_detail 的数据：~8 rows (大约)
DELETE FROM `app_meterial_input_detail`;
/*!40000 ALTER TABLE `app_meterial_input_detail` DISABLE KEYS */;
INSERT INTO `app_meterial_input_detail` (`DETAIL_ID`, `INPUT_ID`, `DIC_ID`, `DETAIL_NUM`, `DETAIL_PRICE`, `MONEY`, `COMMENT`) VALUES
	('39aef4b8-fa0e-4e53-9310-ce3191ee7600', 'c2737c74-b04a-4db0-a73a-d45560a4b59f', 'a', 6.00, 7.00, 42.00, ''),
	('5cd4d7b4-e100-476d-b43c-afd450f1720e', '7be14b1c-147d-4c7a-826e-89646cb671d6', 'a', 8.00, 7.00, 56.00, ''),
	('67357acd-4e3a-499c-a00f-574f59b58463', 'dba9d01e-2879-4ba0-bea7-0b26b10b308b', 'a', 6.00, 7.00, 42.00, ''),
	('884d865c-3b65-4428-8b76-9473dcb4e8ed', '73bc23cd-8f53-4a8e-bcea-ec13dd430518', '895395fb-7f17-4a21-89e1-138d3b355920', 4.50, 3.00, 13.50, ''),
	('c11fcfc0-a744-4324-926c-2e5ff41ae561', '94134005-3884-4ce8-bdcd-1d6d65b67d71', 'a', 1.25, 7.00, 8.75, ''),
	('c39956a4-11ed-49e4-a90c-5c60fc46b935', '9c0f5627-993e-46a3-b342-54e72409886c', 'a', 3.00, 7.00, 21.00, ''),
	('d832d88c-7b01-49bf-b2c7-44610ae7270c', '94134005-3884-4ce8-bdcd-1d6d65b67d71', 'a', 3.00, 7.00, 21.00, ''),
	('fbe28ad3-aa12-4f37-8823-d80d34a0f62f', '9c0f5627-993e-46a3-b342-54e72409886c', 'a', 4.00, 7.00, 28.00, '');
/*!40000 ALTER TABLE `app_meterial_input_detail` ENABLE KEYS */;


-- 导出  表 good-helper.app_note_info 结构
DROP TABLE IF EXISTS `app_note_info`;
CREATE TABLE IF NOT EXISTS `app_note_info` (
  `NOTE_ID` char(36) NOT NULL,
  `TYPE_DETAIL_ID` char(36) NOT NULL COMMENT '笔记类型，对应app_type_detail表主键',
  `TITLE` varchar(200) NOT NULL COMMENT '笔记标题',
  `CONTENT` varchar(2000) NOT NULL COMMENT '笔记内容',
  `SYS_TIME` datetime NOT NULL COMMENT '编制日期',
  `MEMBER_ID` char(36) NOT NULL COMMENT '编制人，对应core_member_info表的主键',
  PRIMARY KEY (`NOTE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='笔记或日记表';

-- 正在导出表  good-helper.app_note_info 的数据：~2 rows (大约)
DELETE FROM `app_note_info`;
/*!40000 ALTER TABLE `app_note_info` DISABLE KEYS */;
INSERT INTO `app_note_info` (`NOTE_ID`, `TYPE_DETAIL_ID`, `TITLE`, `CONTENT`, `SYS_TIME`, `MEMBER_ID`) VALUES
	('0119ac66-5eee-4476-b03f-35c1c70e1eed', 'ccc', 'aaa', 'fffff', '2017-11-02 17:18:13', '张三'),
	('aaaaa', 'ccc', 'c', 'ddddd', '2017-11-01 16:40:22', 'w');
/*!40000 ALTER TABLE `app_note_info` ENABLE KEYS */;


-- 导出  表 good-helper.app_type_detail 结构
DROP TABLE IF EXISTS `app_type_detail`;
CREATE TABLE IF NOT EXISTS `app_type_detail` (
  `TYPE_DETAIL_ID` char(36) NOT NULL,
  `TYPE_ID` char(36) NOT NULL COMMENT '对应app_type_info表主键',
  `DETAIL_NAME` varchar(100) NOT NULL COMMENT '笔记类型（工作、生活等），日程消费类型（逛超市、买菜、外卖等），支付方式（现金、信用卡等）',
  `DETAIL_CODE` varchar(50) NOT NULL,
  `COMMENT` varchar(1000) DEFAULT NULL COMMENT '备注',
  `IS_VALID` bit(1) NOT NULL COMMENT '是否有效',
  PRIMARY KEY (`TYPE_DETAIL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='类型明细表';

-- 正在导出表  good-helper.app_type_detail 的数据：~2 rows (大约)
DELETE FROM `app_type_detail`;
/*!40000 ALTER TABLE `app_type_detail` DISABLE KEYS */;
INSERT INTO `app_type_detail` (`TYPE_DETAIL_ID`, `TYPE_ID`, `DETAIL_NAME`, `DETAIL_CODE`, `COMMENT`, `IS_VALID`) VALUES
	('ccc', 'aaa', '生活', 'life', '生活类的笔记', b'1'),
	('ddd', 'aaa', '工作', 'job', '工作类的笔记', b'1');
/*!40000 ALTER TABLE `app_type_detail` ENABLE KEYS */;


-- 导出  表 good-helper.app_type_info 结构
DROP TABLE IF EXISTS `app_type_info`;
CREATE TABLE IF NOT EXISTS `app_type_info` (
  `TYPE_ID` char(36) NOT NULL,
  `TYPE_NAME` varchar(100) NOT NULL COMMENT '笔记类型、日常消费类型、支付方式、、等',
  `TYPE_CODE` varchar(50) NOT NULL COMMENT '类型编码',
  `SYS_TIME` datetime NOT NULL COMMENT '编制时间',
  `MEMBER_ID` char(36) NOT NULL COMMENT '编制人，对应core_member_info表主键',
  PRIMARY KEY (`TYPE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='各种类型的统一表';

-- 正在导出表  good-helper.app_type_info 的数据：~0 rows (大约)
DELETE FROM `app_type_info`;
/*!40000 ALTER TABLE `app_type_info` DISABLE KEYS */;
INSERT INTO `app_type_info` (`TYPE_ID`, `TYPE_NAME`, `TYPE_CODE`, `SYS_TIME`, `MEMBER_ID`) VALUES
	('aaa', '随手记', 'note', '2017-11-02 16:29:19', 'bbb');
/*!40000 ALTER TABLE `app_type_info` ENABLE KEYS */;


-- 导出  表 good-helper.core_member_info 结构
DROP TABLE IF EXISTS `core_member_info`;
CREATE TABLE IF NOT EXISTS `core_member_info` (
  `MEMBER_ID` char(36) NOT NULL COMMENT '用户编号',
  `MEMBER_NAME` varchar(100) NOT NULL COMMENT '用户名称',
  `PHOTO` longblob COMMENT '用户头像',
  `ACCOUNT` varchar(50) NOT NULL COMMENT '登录账号',
  `PASSWORD` varchar(200) NOT NULL COMMENT '登录密码',
  `IS_FROZEN` bit(1) NOT NULL COMMENT '是否冻结',
  PRIMARY KEY (`MEMBER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='人员信息表';

-- 正在导出表  good-helper.core_member_info 的数据：~3 rows (大约)
DELETE FROM `core_member_info`;
/*!40000 ALTER TABLE `core_member_info` DISABLE KEYS */;
INSERT INTO `core_member_info` (`MEMBER_ID`, `MEMBER_NAME`, `PHOTO`, `ACCOUNT`, `PASSWORD`, `IS_FROZEN`) VALUES
	('0df6d960-b87c-11e7-96df-64510645b30f', '谢世兵', NULL, 'xc', '111', b'0'),
	('0dfb8bd5-b87c-11e7-96df-64510645b30a', '管理员', NULL, 'admin', '111', b'0'),
	('0dfb8d04-b87c-11e7-96df-64510645b30b', '刘珍珍', NULL, 'jane', '111', b'0');
/*!40000 ALTER TABLE `core_member_info` ENABLE KEYS */;


-- 导出  表 good-helper.core_menu_tree_info 结构
DROP TABLE IF EXISTS `core_menu_tree_info`;
CREATE TABLE IF NOT EXISTS `core_menu_tree_info` (
  `MENU_ID` char(36) NOT NULL,
  `MENU_LEVEL` int(11) DEFAULT NULL COMMENT '同级顺序',
  `OUTLINE_LEVEL` varchar(200) DEFAULT NULL COMMENT '大纲序号',
  `TITLE` varchar(100) DEFAULT NULL COMMENT '菜单标题',
  `URL_ID` char(36) DEFAULT NULL COMMENT '菜单路径,对应core_menu_url_info表主键',
  `ICON` varchar(200) DEFAULT NULL COMMENT '菜单图标',
  `TYPE` bit(1) DEFAULT NULL COMMENT '是否为应用',
  `IS_SHOW` bit(1) DEFAULT NULL COMMENT '是否显示',
  PRIMARY KEY (`MENU_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='树形菜单列表';

-- 正在导出表  good-helper.core_menu_tree_info 的数据：~11 rows (大约)
DELETE FROM `core_menu_tree_info`;
/*!40000 ALTER TABLE `core_menu_tree_info` DISABLE KEYS */;
INSERT INTO `core_menu_tree_info` (`MENU_ID`, `MENU_LEVEL`, `OUTLINE_LEVEL`, `TITLE`, `URL_ID`, `ICON`, `TYPE`, `IS_SHOW`) VALUES
	('6ae443fa-b87f-11e7-96df-64510645b3p', 1, '1', '单据录入', 'b7cb93c9-b87f-11e7-96df-64510645b30k', 'glyphicon glyphicon-pencil', b'1', b'1'),
	('6ae4453b-b87f-11e7-96df-64510645b30p', 2, '2', '单据对账', 'b7cb93c9-b87f-11e7-96df-64510645b30m', 'glyphicon glyphicon-check', b'1', b'1'),
	('6ae4458c-b87f-11e7-96df-64510645b30k', 4, '4', '系统管理', '', '', b'0', b'1'),
	('6ae445d5-b87f-11e7-96df-64510645b30l', 1, '4.1', '成员管理', '', '', b'1', b'0'),
	('6ae44662-b87f-11e7-96df-64510645b30c', 3, '3', '字典管理', 'b7cb93c9-b87f-11e7-96df-64510645b30l', 'glyphicon glyphicon-book', b'1', b'1'),
	('6ae44662-b87f-11e7-96df-64510645b30n', 3, '4.3', '菜单管理', 'b7cb93c9-b87f-11e7-96df-64510645b30i', '', b'1', b'0'),
	('6ae44662-b87f-11e7-96df-64510645b30o', 4, '4.4', '字体图标库', 'b7cb93c9-b87f-11e7-96df-64510645b30j', NULL, b'1', b'1');
/*!40000 ALTER TABLE `core_menu_tree_info` ENABLE KEYS */;


-- 导出  表 good-helper.core_menu_url_info 结构
DROP TABLE IF EXISTS `core_menu_url_info`;
CREATE TABLE IF NOT EXISTS `core_menu_url_info` (
  `URL_ID` char(36) NOT NULL,
  `TITLE` varchar(200) NOT NULL COMMENT '菜单名称',
  `CODE` varchar(200) NOT NULL COMMENT '编码',
  `URL` varchar(1000) DEFAULT NULL COMMENT '路径',
  `PARAMETER` varchar(1000) DEFAULT NULL COMMENT '参数',
  `SYS_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`URL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单路径列表';

-- 正在导出表  good-helper.core_menu_url_info 的数据：~14 rows (大约)
DELETE FROM `core_menu_url_info`;
/*!40000 ALTER TABLE `core_menu_url_info` DISABLE KEYS */;
INSERT INTO `core_menu_url_info` (`URL_ID`, `TITLE`, `CODE`, `URL`, `PARAMETER`, `SYS_TIME`) VALUES
	('b7c94d31-b87f-11e7-96df-64510645b30a', '随手记', 'note', '/app/note/index.jsp', '', NULL),
	('b7cb8fa1-b87f-11e7-96df-64510645b30b', '消费单', 'cost', '', '', NULL),
	('b7cb9108-b87f-11e7-96df-64510645b30c', '节日汇', 'ywzx_jrh', '', '', NULL),
	('b7cb919d-b87f-11e7-96df-64510645b30d', '薪资条', 'ywzx_xzt', '', '', NULL),
	('b7cb920d-b87f-11e7-96df-64510645b30d', '消费走势图', 'bbgl_xfzst', '', '', NULL),
	('b7cb9262-b87f-11e7-96df-64510645b30e', '消费类型对比图', 'bbgl_xflxdbt', '', '', NULL),
	('b7cb92cd-b87f-11e7-96df-64510645b30f', '薪资走势图', 'bbgl_xzzst', '', '', NULL),
	('b7cb9316-b87f-11e7-96df-64510645b30g', '成员管理', 'xtgl_cygl', '', '', NULL),
	('b7cb937c-b87f-11e7-96df-64510645b30h', '应用程序库', 'xtgl_yycxk', '', '', NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30i', '菜单管理', 'menu_url', '/app/menuUrl/index.jsp', '', NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30j', '字体图标库', 'xtgl_zttbk', '/public/bootstrap/fonts/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30k', '单据录入', 'meterial_input', '/app/meterialinput/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30l', '字典管理', 'dic_info', '/app/dicinfo/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30m', '单据报表', 'meterial_bill', '/app/meterialbill/index.jsp', NULL, NULL);
/*!40000 ALTER TABLE `core_menu_url_info` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
