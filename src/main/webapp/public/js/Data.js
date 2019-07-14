function Data(ids, jsonArray){
	this.ids = [];
	this.jsonArray = [];
}
Data.prototype.setIds = function (ids){
	this.ids = ids;
};
Data.prototype.getIds = function (){
	return this.ids;
};
Data.prototype.addId = function (id){
	this.ids.add(id);
};
Data.prototype.setJsonArray = function (jsonArray){
	this.jsonArray = jsonArray;
};
Data.prototype.getJsonArray = function (jsonArray){
	return this.jsonArray;
};
Data.prototype.addJsonObj = function (jsonData){
	this.jsonArray.add(jsonData);
};