
$().ready(function () {
    $(':text.webui.number').livequery(function () {
        var $this = $(this);
        if($this && $this.number){
            var option = {};
            if ($this) {
                option.min = $this.attr("data-min") ? $this.attr("data-min") : "";
                option.max = $this.attr("data-max") ? $this.attr("data-max") : "";
                option.type = String.isNullOrEmpty($this.attr("data-type")) ? "int" : $this.attr("data-type");
                var step = 1;
                if(option.type.equalsIgnoreCase("float")){
                    step = 0.01;
                }
                option.step =  step;
                $this.number(option);

                if ($this.prop("disabled")) {
                    $this.number("disable");
                }
                $this.attr("webuiReadyState", "complete");
            }
        }
    }, function () {
        var $this = $(this);
        if ($this) {
        }
    });
});