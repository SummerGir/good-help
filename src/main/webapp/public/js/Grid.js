var Grid = {
	getSelectedRows: function (grid, isMultiSel){
		if(grid == undefined) throw "此对象不能为空!";
		if(isMultiSel == undefined) isMultiSel = true;
		if(!isMultiSel){
            return grid.getRowData(grid.getGridParam("selrow"));
		}else{
			var ids = (grid.getGridParam("selarrrow") + "").split(",");
			var data = new Data();
			data.setIds(ids);
			for(var i = 0; i < ids.length; i++){
				data.addJsonObj(grid.getRowData(ids[i]));
			}
			return data;
		}
	},
	isHasSelectRow: function(grid){
		if(grid == undefined) throw "此对象不能为空!";
        return grid.getGridParam("selrow") == null ? false : true;
	},
	reLoad: function(gridId, pageSize){
		$("#" + gridId).jqGrid('setGridParam',{rowNum: pageSize}).jqGrid('hideCol',"somecol").trigger("reloadGrid");
	},
	getOption: function(grid, optionName){
		return grid.getGridParam(optionName);
	}
}
