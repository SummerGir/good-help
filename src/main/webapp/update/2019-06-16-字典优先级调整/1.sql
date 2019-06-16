
update app_dic_info d set d.PRIORITY_LEVEL=0;

update app_dic_info d,(select a.DIC_ID,count(1) ct from app_meterial_input_detail a group by a.DIC_ID) b set d.PRIORITY_LEVEL=b.ct where b.DIC_ID=d.DIC_ID;
