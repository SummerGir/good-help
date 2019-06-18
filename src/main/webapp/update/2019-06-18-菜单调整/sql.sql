
update core_menu_tree_info a set a.OUTLINE_LEVEL=concat('1.',a.OUTLINE_LEVEL);

insert into core_menu_tree_info(MENU_ID,MENU_LEVEL,OUTLINE_LEVEL,TITLE,URL_ID,ICON,`TYPE`,IS_SHOW)
values ('root',1,'1','好管家','','',0,1);

CREATE TABLE `app_menstrual_info` (
	`MENS_ID` CHAR(36) NOT NULL,
	`START_TIME` DATETIME NULL COMMENT '月经开始时间',
	`END_TIME` DATETIME NULL COMMENT '月经结束时间',
	`DURATION` INT NULL COMMENT '持续天数',
	`MENS_CYCLE` INT NULL COMMENT '周期，本次开始时间到下一次开始的前一天',
	`MENS_DIVER` INT NULL COMMENT '时间差，延迟或提前了几天',
	`IS_VALID` BIT NULL,
	PRIMARY KEY (`MENS_ID`)
)
COMMENT='月经信息表，'
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
