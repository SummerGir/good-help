(function (window) {

    if ($.selector == undefined) {
        $.selector = {};
    }

    var random = new Date().getMilliseconds();

    $.selector.icons = function (define) {

        var myModal = $('#eiis-selectorIconsModal' + random);
        if (myModal.length == 0) {
            $.ajax({
                url: "/public/controls/selector/icons/selector.icons.jsp",
                data: {random: random},
                async: false,
                cache: true,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    $("body").append(data);
                }
            });
            myModal = $('#eiis-selectorIconsModal' + random);
            myModal.on('show.bs.modal', function (e) {
                $("#eiis-selectorIconsModal"+random+" .fa-hover.activated").removeClass("activated");
            })
        }
        $("#eiis-selectorIconsOkBtn" + random, myModal).off("click");
        $("#eiis-selectorIconsOkBtn" + random, myModal).on("click", function () {
            if ($.isFunction(define)) {
                define($(".activated > i", myModal).attr("class"));
            }
            myModal.modal("hide");
        });
        myModal.modal();
    };

    $.selector.iconColor = function (define) {

        var myModal = $('#eiis-selectorIconColorModal' + random);
        if (myModal.length == 0) {
            $.ajax({
                url: "/public/controls/selector/icons/selector.iconColor.jsp",
                data: {random: random},
                async: false,
                cache: true,
                dataType: "html",
                success: function (data, textStatus, jqXHR) {
                    $("body").append(data);
                }
            });
            myModal = $('#eiis-selectorIconColorModal' + random);
            myModal.on('show.bs.modal', function (e) {
                $("#eiis-selectorIconColorModal"+random+" .fa-hover.activated").removeClass("activated");
            })
        }
        $("#eiis-selectorIconColorOkBtn" + random, myModal).off("click");
        $("#eiis-selectorIconColorOkBtn" + random, myModal).on("click", function () {
            if ($.isFunction(define)) {
                define($(".activated > i", myModal).attr("class"));
            }
            myModal.modal("hide");
        });
        myModal.modal();
    };
})(window);