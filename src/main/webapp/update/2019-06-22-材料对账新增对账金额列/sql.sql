ALTER TABLE `app_meterial_input`
	ADD COLUMN `BILL_MONEY` DECIMAL(10,2) NULL DEFAULT NULL COMMENT '对账金额，存在差异的单据才需要记录' AFTER `EXCEPTION`;
