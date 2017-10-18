;(function($){
/*
 * jqGrid extension for constructing Grid Data from external file
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/ 
    $.jgrid.extend({
        exportData : function(o) {

            var o = $.extend({
                name    :'data',    //提交时存放数据的名称
                ids     :[],        //要导出的数据行id,为空或长度为0时表示全部导出
                allCol  :false,     //为true时导出所有字段包含隐藏字段，为 false 时只导出当前显示的字段。
                postData:{},        //提交时附加的数据信息
                ajax    :{},        //ajax 提交时的参数，参数参照 $.ajax 方法。
                url     :null,      // 为非空字符串时进行提交，否则直接返回数据
                target  :false      //为非空字符串时向指定的目标提交数据，否则采用ajax提交。
            }, o || {});

            var exportdata = function(){
                var self = this;
                if(!self.grid) { return;}
                
                 var gprm = $.extend(true, {}, $(this).jqGrid("getGridParam"));

                if (gprm.rownumbers) {
                    gprm.colNames.splice(0, 1);
                    gprm.colModel.splice(0, 1);
                }
                if (gprm.multiselect) {
                    gprm.colNames.splice(0, 1);
                    gprm.colModel.splice(0, 1);
                }
                if (gprm.subGrid) {
                    gprm.colNames.splice(0, 1);
                    gprm.colModel.splice(0, 1);
                }
                gprm.knv = null;
                if (gprm.treeGrid) {
                    for (var key in gprm.treeReader) {
                        if (gprm.treeReader.hasOwnProperty(key)) {
                            gprm.colNames.splice(gprm.colNames.length - 1);
                            gprm.colModel.splice(gprm.colModel.length - 1);
                        }
                    }
                }

                var ids = [];
                if($.isArray(o.ids) && o.ids.length>0){
                    ids = o.ids;
                }else{
                    ids = $(this).jqGrid("getDataIDs");
                }
                
                var reXML = $($.parseXml('<data />'));

                var tmpXML = reXML.find('data:last');

                //for (var irow = 0, jrow = gprm.data.length; irow < jrow; irow++) {
                for (var irow = 0, jrow = ids.length; irow < jrow; irow++) {
                //    alert(gprm.data[irow].id);
                //    if($.inArray(ids,gprm.data[irow].id)>=0){
                //        var tmpData = gprm.data[irow];
                    var tmpData = $(this).jqGrid("getRowData", ids[irow]);
                        var rowXML = tmpXML.appendXml('<row />').find('row:last');
                        for (var icol = 0, jcol = gprm.colNames.length; icol < jcol; icol++) {
                            if (o.allCol || !gprm.colModel[icol].hidden) {
                                rowXML.appendXml('<cell />')
                                    .find('cell:last')
                                        .attr('name', $.trim(gprm.colNames[icol]) == ''
                                                        ? ($.trim(gprm.colModel[icol].label) == ''
                                                            ? $.trim(gprm.colModel[icol].name)
                                                            : $.trim(gprm.colModel[icol].label))
                                                        : $.trim(gprm.colNames[icol]))
                                        .attr('type', gprm.colModel[icol].sorttype)
                                        .text(tmpData[gprm.colModel[icol].name]);
                            }
                        }
                    //}

                }

                if($.trim(o.url)==''){
                    return reXML.xml();
                }


                var postData = $.extend(true, {}, o.postData);
                postData[o.name] = reXML.xml();

                if($.type(o.target)==='string'){
                    $('<form method="post" ></form>').appendTo('body')
                                    .css('display', 'none')
                                    .attr('action', o.url)
                                    .attr('target', o.target)
                                    .append(function(){
                                        for(key in postData){
                                            if (postData.hasOwnProperty(key)) {
			                                    $('<input type="hidden" />')
                                                    .attr("name",key)
                                                    .val(postData[key].toString())
                                                    .appendTo(this);
		                                    }
                                        }
                                    })
                                    .submit()
                                    .remove();
                }else{
                    $.ajax($.extend(true, o.ajax, {url: o.url, data: postData }));
                }
            }

            if($.trim(o.url)==''){
                return exportdata.call(this[0]);
            }
            return this.each(function(){
                exportdata.call(this);
            });
            
        }
    });
})(jQuery);