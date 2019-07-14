
$().ready(function () {
    $(':button.webui, a.webui.button').livequery(function () {
        var $this = $(this);
        if ($this) {
            if($this.button){
                $this.button();
            }
        }
    });

});