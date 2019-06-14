/**
 * Created by Yihu on 2016/12/13.
 */

$.extend($.fn.datagrid.defaults.editors, {
    esgselect: {
        init: function (container, options) {

            var width = container.parents("td[field]").width();
            var height = container.parents("td[field]").height();
            var input = makeEsgselect(width, height, options).appendTo(container);
            cellEdit_Container = container;
            cellEdit_Container.options = options;

            if(typeof window[options.onPutTags] === 'function'){
                input.on("esgselect.put.tagsinput2", function (e, data) {
                    window[options.onPutTags].call(this,e,data);
                });
            }


            return input;
        },
        destroy: function (target) {
            $(target).remove();
        },
        getValue: function (target) {
            return $(target).val();
        },
        setValue: function (target, value) {
            $(target).val(value);
        },
        resize: function (target, width) {
            $(target)._outerWidth(width);
        }
    }
});

function makeEsgselect(width, height , options) {
    var input = $("<input type='text' style='display: none' class='esgselect'/>");
    input.attr("_width", width);
    input.attr("_height", height);
    input.attr("selectType", options.selectType);
    input.attr("postData", JSON.stringify(options.postData));
    if(options.addOption)
        input.attr("addOption", JSON.stringify(options.addOption));
    if(options.minSearchLength)
        input.attr("minSearchLength", options.minSearchLength);
    return input.clone(true);
}

var cellEdit_Container;
function addNewTmpDic(treeKind) {
    if ($("#temporary_div").length > 0) {
        temporary_clearData();
        $("#temporary_div").modal();
    } else {
        $.ajax({
            async: true,
            dataType: 'html',
            type: 'post',
            url: '/app/dicinfo/temporary.jsp',
            data: {backFunctionName: 'addNewTmpDic_callBack',treeKind:treeKind},
            success: function (res, state) {
                $("body").append(res);
                $("#temporary_div").modal();
            }
        });
    }
}
function addNewTmpDic_callBack(rs) {
    if (cellEdit_Container) {
        cellEdit_Container.find("input.esgselect").val(rs[cellEdit_Container.options.addOption.value]);
    }
}
