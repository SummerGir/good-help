$().ready(function () {

    $(':text.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            if ($this.hasClass('date') && $this.hasClass('time')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.DateTime);
            } else if ($this.hasClass('time')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Time);
            } else if ($this.hasClass('date')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Date);
            } else if ($this.hasClass('member')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Member);
            } else if ($this.hasClass('dictionary')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Dictionary);
            } else if ($this.hasClass('customtext')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.CustomText);
            } else if ($this.hasClass('tags')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Tags);
            } else if ($this.hasClass('file')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.File);
            } else if ($this.hasClass('number')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Number);
            } else {
                $this.addClass('text');
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Text);
            }
        }
    });
    $(":checkbox.webui").livequery(function(){
        var $this = $(this);
        if ($this) {
            //if ($this.hasClass('checkbox')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.CheckBox);
            //}
        }
    });
    $(":radio.webui").livequery(function(){
        var $this = $(this);
        if ($this) {
            //if ($this.hasClass('radio')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Radio);
            //}
        }
    });

    $(':password.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            $this.addClass('text');
            EIIS.Common.loadComponent(EIIS.Common.WebUI.Password);
        }
    });

    $('select.webui').livequery(function () {
        var $this = this;
        if ($this) {
            EIIS.Common.loadComponent(EIIS.Common.WebUI.ComboBox);
        }
    });

    $('textarea.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            if ($this.hasClass('html')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Html);
            } else if ($this.hasClass('office')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Office);
            } else if ($this.hasClass('officeext')) {
                EIIS.Common.loadComponent(EIIS.Common.WebUI.OfficeExt);
            }else {
                $this.addClass('textarea');
                EIIS.Common.loadComponent(EIIS.Common.WebUI.Textarea);
            }
        }
    });

//    $('div.webui').livequery(function () {
//        var $this = $(this);
//        if ($this) {
//            if($this.hasClass('radio')){
//                EIIS.Common.loadComponent(EIIS.Common.WebUI.Radio);
//            }else if($this.hasClass('checkbox')){
//                EIIS.Common.loadComponent(EIIS.Common.WebUI.CheckBox);
//            }
//        }
//    });
//    $('span.webui').livequery(function () {
//        var $this = $(this);
//        if ($this) {
//            if($this.hasClass('radio')){
//                EIIS.Common.loadComponent(EIIS.Common.WebUI.Radio);
//            }else if($this.hasClass('checkbox')){
//                EIIS.Common.loadComponent(EIIS.Common.WebUI.CheckBox);
//            }
//        }
//    });

    $(':button.webui, a.webui.button').livequery(function () {
        var $this = $(this);
        if ($this) {
            EIIS.Common.loadComponent(EIIS.Common.WebUI.Button);
        }
    });

    $('table.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            EIIS.Common.loadComponent(EIIS.Common.WebUI.Table);
        }
    });
    $('form.webui').livequery(function () {
        var $this = $(this);
        if ($this) {
            EIIS.Common.loadComponent(EIIS.Common.WebUI.Form);
        }
    });
});
