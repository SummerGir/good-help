(function (window) {

    if ($.selector == undefined) {
        $.selector = {};
    }

    var random = new Date().getMilliseconds();

    $.selector.appmember = function (options) {
        var self = this;
        var defaultOptions = {
            readonly: false,
            multiple: true,
            dept: true,
            post: true,
            person: true,
            freeze: false,
            selectRoot: true,
            attrCode: '',
            roots: '',
            exclude: '',
            values: [],
            ok: null
        };
        var params = $.isEmptyObject(options) ? $.extend({}, defaultOptions) : $.extend({}, defaultOptions, options);
        var okFun = params.ok;
        delete params.ok;
        var defaultValues = params.values ? params.values.join(";") : "";
        var myModal = $('#eiis-selectorNetdiskModal' + random);
        if (myModal.length == 0) {
            $.ajax({
                url: "/public/controls/selector/appmember/selector.appmember.jsp",
                data: {random: random,readonly:params.readonly,values:params.values},
                async: false,
                cache: true,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    $("body").append(data);
                }
            });
            myModal = $('#eiis-selectorNetdiskModal' + random);
            myModal.on('show.bs.modal', function (e) {
                //$("#eiis-selectorNetdiskModal"+random+" .fa-hover.activated").removeClass("activated");

            })
        }
        $("#eiis-selectorNetdiskOkBtn" + random, myModal).off("click");
        $("#eiis-selectorNetdiskOkBtn" + random, myModal).on("click", function () {
            var selected = myModal.find(".selected");
            var data = {ids:[],items:[]};
            $.each(selected,function(i,o){
                data.items.push({id:$(o).attr("data-dir-id"),name:$(o).text(),url:$(o).attr("data-file-path")});
                data.ids.push($(o).attr("data-dir-id"));
            });

            myModal.modal("hide");

            if ($.isFunction(okFun)) {
                okFun(data);
            }
        });
        myModal.modal();
    };
})(window);
