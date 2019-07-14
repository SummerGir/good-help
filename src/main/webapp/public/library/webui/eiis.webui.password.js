/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-1-31
 * Time: 上午9:19
 * To change this template use File | Settings | File Templates.
 */
$(':password.webui.text').livequery(function() {
    var $this = $(this);
    if ($this && $this.input) {
        $this.input();
        if ($this.prop("disabled")) {
            $this.input("disable");
        }
        this._hookProp = new $.hook('prop', function () {
                if (arguments.length == 2) {
                    if (arguments[0].toLowerCase() == "disabled") {
                        if (Boolean.parse(arguments[1])) {
                            $this.input("disable");
                        }
                        else {
                            $this.input("enable");
                        }
                    }
                }
            },this
        ).on();
        $this.attr("webuiReadyState", "complete");
    }
}, function () {
    var $this = $(this);
    if ($this) {
        this._hookProp.off();
    }
});