KindEditor.plugin('flow_createprintpage',function(){
	var editor=this,name='flow_createprintpage';
	editor.clickToolbar(name,function(){
		editor.plugin['flow_createExexutepage']['edit']("flow_print");
	});
});