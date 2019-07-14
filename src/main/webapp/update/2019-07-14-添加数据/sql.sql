
INSERT INTO `app_type_info` (`TYPE_ID`, `TYPE_NAME`, `TYPE_CODE`, `SYS_TIME`, `MEMBER_ID`) VALUES
	('a47eec14-17a4-4a09-9349-dc97c8c3c992', '首页定位', 'index', now(), '0dfb8bd5-b87c-11e7-96df-64510645b30a');

INSERT INTO `app_type_detail` (`TYPE_DETAIL_ID`, `TYPE_ID`, `DETAIL_NAME`, `DETAIL_CODE`, `DETAIL_VALUE`, `DETAIL_LEVEL`, `COMMENT`, `IS_VALID`) VALUES
	('58db050d-04d0-4398-86d0-296d187e3294', 'a47eec14-17a4-4a09-9349-dc97c8c3c992', '首页', 'index', '/app/meterialinput/index.jsp',1,'',1);

ALTER TABLE `app_daily_cost_info`
	ADD COLUMN `COST_NUM` decimal(18,4) NULL DEFAULT NULL COMMENT '数量' AFTER `COST_TIME`,
	ADD COLUMN `COST_PRICE` decimal(18,4) NULL DEFAULT NULL COMMENT '价格' AFTER `COST_NUM`;
