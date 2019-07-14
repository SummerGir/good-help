$().ready(function () {
    $('textarea.webui.html').livequery(function () {
        var $this = $(this);
        if($this && $this.webeditor){
            var p = {};
            if($this.attr("data-uploadpath")) p.uploadPath = $this.attr("data-uploadpath");
            if($this.attr("data-uploadname")) p.uploadName = $this.attr("data-uploadname");
            if ($this.attr('data-toolbarset')) p.themeType = $this.attr('data-toolbarset');

            p.height = $this.height();
            p.width = $this.width();
            if (!$.isEmptyObject(p)) {
                $this.webeditor(p);
            } else {
                $this.webeditor();
            }
            if(!String.isNullOrEmpty(this.value)){
                $this.webeditor("value",this.value);
            }

            this.getValue = function () {
                return $this.webeditor("value");
            }
            this.setValue = function(value){
                $this.webeditor("value",value);
            }

            p = null;
        }
    });
});