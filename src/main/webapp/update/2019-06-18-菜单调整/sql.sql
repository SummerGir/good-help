
update core_menu_tree_info a set a.OUTLINE_LEVEL=concat('1.',a.OUTLINE_LEVEL);

insert into core_menu_tree_info(MENU_ID,MENU_LEVEL,OUTLINE_LEVEL,TITLE,URL_ID,ICON,`TYPE`,IS_SHOW)
values ('root',1,'1','好管家','','',0,1)