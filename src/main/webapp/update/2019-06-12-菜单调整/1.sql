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
-- 正在导出表  good-helper.core_menu_tree_info 的数据：~9 rows (大约)
DELETE FROM `core_menu_tree_info`;
/*!40000 ALTER TABLE `core_menu_tree_info` DISABLE KEYS */;
INSERT INTO `core_menu_tree_info` (`MENU_ID`, `MENU_LEVEL`, `OUTLINE_LEVEL`, `TITLE`, `URL_ID`, `ICON`, `TYPE`, `IS_SHOW`) VALUES
	('6ae443fa-b87f-11e7-96df-64510645b3p', 1, '1', '单据录入', 'b7cb93c9-b87f-11e7-96df-64510645b30k', 'icon-wodejihua', b'1', b'1'),
	('6ae4453b-b87f-11e7-96df-64510645b30p', 2, '2', '单据对账', 'b7cb93c9-b87f-11e7-96df-64510645b30m', 'icon-zhiduliucheng', b'1', b'1'),
	('6ae4458c-b87f-11e7-96df-64510645b30k', 5, '5', '系统管理', '', 'icon-shezhi', b'0', b'0'),
	('6ae445d5-b87f-11e7-96df-64510645b30l', 2, '5.2', '成员管理', '', 'icon-chengyuanguanli', b'1', b'0'),
	('6ae44662-b87f-11e7-96df-64510645b30c', 4, '4', '字典管理', 'b7cb93c9-b87f-11e7-96df-64510645b30l', 'icon-zidianxinxipingtai', b'1', b'1'),
	('6ae44662-b87f-11e7-96df-64510645b30n', 1, '5.1', '菜单管理', 'b7cb93c9-b87f-11e7-96df-64510645b30i', 'icon-caidan', b'1', b'0'),
	('6ae44662-b87f-11e7-96df-64510645b30o', 3, '5.3', 'bs图标库', 'b7cb93c9-b87f-11e7-96df-64510645b30j', 'icon-zidiansousuo', b'1', b'0'),
	('6ae44662-b87f-11e7-96df-64510645b30q', 3, '3', '工作收入统计', 'b7cb93c9-b87f-11e7-96df-64510645b30p', 'icon-shourukemu', b'1', b'1'),
	('b7cb93c9-b87f-11e7-96df-64510645b10p', 4, '5.4', 'esg图标库', 'b7cb93c9-b87f-11e7-96df-64510645b30o', 'icon-zidiansousuo', b'1', b'0');
/*!40000 ALTER TABLE `core_menu_tree_info` ENABLE KEYS */;

-- 正在导出表  good-helper.core_menu_url_info 的数据：~10 rows (大约)
DELETE FROM `core_menu_url_info`;
/*!40000 ALTER TABLE `core_menu_url_info` DISABLE KEYS */;
INSERT INTO `core_menu_url_info` (`URL_ID`, `TITLE`, `CODE`, `URL`, `PARAMETER`, `SYS_TIME`) VALUES
	('b7c94d31-b87f-11e7-96df-64510645b30a', '随手记', 'note', '/app/note/index.jsp', '', NULL),
	('b7cb8fa1-b87f-11e7-96df-64510645b30b', '消费单', 'cost', '', '', NULL),
	('b7cb9316-b87f-11e7-96df-64510645b30g', '成员管理', 'xtgl_cygl', '', '', NULL),
	('b7cb937c-b87f-11e7-96df-64510645b30h', '应用程序库', 'xtgl_yycxk', '', '', NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30i', '菜单管理', 'menu_url', '/app/menuUrl/index.jsp', '', NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30j', 'bootstrap图标', 'xtgl_bstbk', '/public/bootstrap/fonts/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30k', '单据录入', 'meterial_input', '/app/meterialinput/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30l', '字典管理', 'dic_info', '/app/dicinfo/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30m', '单据报表', 'meterial_bill', '/app/meterialbill/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30o', 'esg图标', 'xtgl_esgtbk', '/public/esg-font/index.jsp', NULL, NULL),
	('b7cb93c9-b87f-11e7-96df-64510645b30p', '工作收入统计', 'statement_realincome', '/app/statement/realincome/index.jsp', NULL, NULL);
/*!40000 ALTER TABLE `core_menu_url_info` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
