CREATE TABLE `app_account_info` (
	`ACCOUNT_ID` CHAR(36) NOT NULL,
	`ACCOUNT_TYPE` VARCHAR(1000) NOT NULL COMMENT '账号类型',
	`ACCOUNT_NAME` VARCHAR(50) NULL DEFAULT NULL COMMENT '账户名',
	`ACCOUNT_PASSWORD` VARCHAR(50) NULL DEFAULT NULL COMMENT '账户密码',
	`MEMBER_ID` CHAR(36) NULL DEFAULT NULL COMMENT '账户所有人，对应memberinfo 的id',
	`COMMENT` VARCHAR(2000) NULL DEFAULT NULL COMMENT '备注',
	PRIMARY KEY (`ACCOUNT_ID`)
)
COMMENT='用于存储所有的账号密码'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;



ALTER TABLE `app_account_info`
	ADD COLUMN `ACCOUNT_TYPE` VARCHAR(1000) NOT NULL COMMENT '账号类型' AFTER `ACCOUNT_ID`;


ALTER TABLE `app_account_info`
	ALTER `ACCOUNT_TYPE` DROP DEFAULT;
ALTER TABLE `app_account_info`
	CHANGE COLUMN `ACCOUNT_TYPE` `ACCOUNT_TYPE` VARCHAR(1000) NULL COMMENT '账号类型' AFTER `ACCOUNT_ID`;


