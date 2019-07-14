$().ready(function () {
	$('textarea.webui.office').livequery(function () {
        var $this = $(this);
        if ($this && $this.office) {
        	if(!$this.attr("data-extname")) return;
            var $div = $('<div/>')
                .attr("data-for",$this.attr('name'))
                .width($this.width())
                .height($this.height());
            if ($this.css('width') && $this.css('width') != 'auto') $div.css('width', $this.css('width'));
            if ($this.attr('width')) $div.attr('width', $this.attr('width'));
            if ($this.css('height') && $this.css('height') != 'auto') $div.css('height', $this.css('height'));
            if ($this.attr('height')) $div.attr('height', $this.attr('height'));
            
            $this.before($div);
//            $WebUI.border($div);
            $this.hide();

            var extName = $this.attr("data-extname");
            var options = {};
			var tmpOnDocumentOpened = window[$this.attr('name') + '_afterOpened'];
			var tmpOnDocumentClosed = window[$this.attr('name') + '_beforeClosed'];
			if (tmpOnDocumentOpened) {
				options.afterOpened = tmpOnDocumentOpened;
			}
			if (tmpOnDocumentClosed) {
				options.beforeClose = tmpOnDocumentClosed;
			}
            var Instance = null;
			try{
                Instance = $div.office(options);
                if (Instance != null) {
                    $this[0]["data-office-div"] = $div;
                    if (String.isNullOrEmpty($this.val())) {
                        Instance.office('create',extName);
                    } else {
                        Instance.office('open',$this.val());
                    }

                    Instance.office('bindingForm',this.form, this);
                }
            }catch(e){
                if ($.office.isInstall() === false) {
                    if(Instance)  Instance.office("destroy");
                }
            }
        }
    });

}); 