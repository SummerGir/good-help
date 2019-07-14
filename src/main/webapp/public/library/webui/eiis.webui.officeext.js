/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-5-29
 * Time: 上午11:46
 * To change this template use File | Settings | File Templates.
 */
$().ready(function () {
    $('textarea.webui.officeext').livequery(function () {
        var $this = $(this);
        if ($this && $this.officeExt) {
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
            var options = {
                userName:String.isNullOrEmpty($this.attr("data-username")) ? "" : $this.attr("data-username"),
                revisions:Boolean.parse($this.attr("data-revisions")),
                readOnly:Boolean.parse($this.attr("data-readonly"))
            };
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
                Instance = $div.officeExt(options);
                if (Instance != null) {
                    $this[0]["data-office-div"] = $div;
                    if (String.isNullOrEmpty($this.val())) {
                        Instance.officeExt('create',extName);
                    } else {
                        Instance.officeExt('open',$this.val());
                    }

                    Instance.officeExt('bindingForm',this.form, this);
                }
            }catch(e){
                if ($.office.isInstall() === false) {
                    if(Instance)  Instance.officeExt("destroy");
                }
            }
        }
    });

});
