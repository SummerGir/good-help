var data = [];
var hot;
$(document).ready(function () {

    hot= new Handsontable(document.getElementById("handsontable"), {
        data: data,
        minSpareRows: 1,
        minRows: 5,
        rowHeaders: true,
        columns: [
            {
                renderer: customDropdownRenderer1,
                editor: "chosen",
                width: 100,
                chosenOptions: {
                    eiisOptions:{
                        type:"dicInfo",
                        rows:5,
                        readonly: true,  //是否使用 启用readonly 属性
                        paramsType:"meterial"
                    },
                    addOption: {
                        text:"没有吗?去新增一项",
                        addFunction: function () {
                            if($("#temporary_cl_div").length>0){
                                temporary_clearData();
                                $("#temporary_cl_div").modal();
                            }else{
                                $.ajax({
                                    async: true,
                                    dataType: 'html',
                                    type: 'post',
                                    url: '/app/dicinfo/temporary_CL.jsp',
                                    data: {backFunctionName:'ChoseneiisAddNewItemBack'},
                                    success: function (res, state) {
                                        $("body").append(res);
                                        $("#temporary_cl_div").modal();
                                    }
                                });
                            }
                        }
                    }
                }
            },
            {
                renderer: customDropdownRenderer2,
                editor: "chosen",
                width: 100,
                chosenOptions: {
                    multiple:true,
                    data: [
                        {
                            id: "a",
                            label: "汉字",
                            pinyin: 'hz'
                        }, {
                            id: "b",
                            label: "BB"
                        }, {
                            id: "c",
                            label: "CC"
                        }, {
                            id: "d",
                            label: "DD"
                        }
                    ]
                }
            },
            {}
        ],
        contextMenu: {
            items: {
                "row_above": {name: '向上增加行'},
                "hsep1": "---------",
                "row_below": {name: '向下增加行'},
                "hsep2": "---------",
                "remove_row": {name: '删除行'}
            }
        },
        beforeChange:function (changes) {
            var row = changes[0][0];
            var col = changes[0][1];
            var orgVal = changes[0][2];
            var newVal = changes[0][3];
        },
        afterChange:function (changes,source) {
            if(changes && changes.length>0 && changes[0][3]!=null && changes[0][3]!=""){
                var row = changes[0][0];
                var col = changes[0][1];
                if(col==0){
                    if(this.getDataAtCell(row,2)==null || this.getDataAtCell(row,2)==""){

                        if(hot.eiis_map[changes[0][3]]){
                            this.setDataAtCell(row,2,hot.eiis_map[changes[0][3]].costName,source);
                        }

                    }

                }
            }

        }
    });
    hot.eiis_map={};
});

function customDropdownRenderer1(instance, td, row, col, prop, value, cellProperties) {
    var text = "";
    if(value && value!=""){
        if(hot.eiis_map[value]){
            text = hot.eiis_map[value][getsearchdata(cellProperties.chosenOptions.eiisOptions.type).showcode[0]];
        }else{

        }
    }
    Handsontable.TextCell.renderer(instance, td, row, col, prop, text, cellProperties);
    return td;
}

function customDropdownRenderer2(instance, td, row, col, prop, value, cellProperties) {
    var optionsList = cellProperties.chosenOptions.data;
    var values = (value + "").split(",");
    var text = [];
    for (var index = 0; index < optionsList.length; index++) {
        if (values.indexOf(optionsList[index].id + "") > -1) {
            text.push(optionsList[index].label);
        }
    }
    text = text.join(", ");

    Handsontable.TextCell.renderer(instance, td, row, col, prop, text, cellProperties);
    return td;
}