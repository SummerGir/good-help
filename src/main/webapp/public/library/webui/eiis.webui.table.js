$().ready(function () {
    $('table.webui').livequery(function () {

        var printBg = false;
        $(">tbody>tr:not(.caption)", this).each(function () {
            if (printBg) {
                $(this).addClass("bg2");
            } else {
                $(this).addClass("bg1");
            }
            printBg = !printBg;
        });

    });
});