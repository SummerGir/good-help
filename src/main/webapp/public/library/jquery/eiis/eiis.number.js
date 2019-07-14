(function($,undefined){

    $.widget("eiis.number",{
        options:{
            min:null,
            max:null,
            step:1,
            type:"int"
        },
        _spinner:null,
        _create:function(){
            this._on(this.element,this._events);
            this.options.change = function(){
                $(this).trigger("change");
            }
            this.element.spinner(this.options);
            this._spinner = this.element.data("spinner");
        },
        _check:function(){
            var $this = this;
            var p = this.options;
            if(p.min){
                try{
                    if(parseFloat($this.element.val()) < p.min) $this.element.val(p.min);
                }catch(e){}
            }
            if(p.max){
                try{
                    if(parseFloat($this.element.val()) > p.max) $this.element.val(p.max);
                }catch(e){}
            }
        },
        _events:{
            change:function(){
                this._check();
            },
            keypress:function(e){
                var $this = this;
                if (e.keyCode == 13) return $this.element.trigger("change");

                if(String.fromCharCode(e.keyCode) == "." && /[.]/.test($this.element.val())) return false;
                if(String.fromCharCode(e.keyCode) == "-" && /[\-]/.test($this.element.val())) return false;
                var regex = /[0-9.\-]/;
                if($this.options.type.equalsIgnoreCase('int')){
                    regex = /[0-9\-]/;
                }
                if(!regex.test(String.fromCharCode(e.keyCode))) return false;
            }
        },
        _setOption:function(key,value){
            this._super(key,value);
            if(key == "disabled"){
                if(value){
                    this._spinner.disable();
                }else{
                    this._spinner.enable();
                }
            }
            if("hide".equalsIgnoreCase(key)){
                if(value){
                    this._spinner._hide(this.element);
                }else{
                    this._spinner._show(this.element);
                }
            }
        },
        show:function(){
            this._setOption("hide",false);
        },
        hide:function(){
            this._setOption("hide",true);
        },
        widget:function(){
            return this.element;
        },
        _destroy:function(){
             //this.element.removeClass("");
        }
    });
})(jQuery);