
$().ready(function() {
    $('textarea.webui.textarea').livequery(function() {
        var $this = $(this);
        if ($this) {
            $this.addClass("webui-text-input ui-widget ui-widget-content ui-corner-all");
        }
    });
});
    
    