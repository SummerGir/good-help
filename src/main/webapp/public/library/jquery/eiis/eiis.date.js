(function($,undefined){
	$.widget("eiis.date",{
        _picker:null,
		_create:function(){
			this.element
				.addClass("webui-text-input ui-widget ui-widget-content ui-corner-all")
			this.element.datepicker({changeYear:true});
            this._picker = this.element.data("datepicker");
		},
        _setOption:function(key,value){
            if(key == "disabled"){
                if(value){
                    this.element
                        .addClass( "ui-state-disabled" )
                        .attr( "disabled", true );
                }else{
                    this.element
                        .removeClass( "ui-state-disabled" )
                        .attr( "disabled",false);
                }
            }
            if("hide".equalsIgnoreCase(key)){
                if(value){
                    this._hide(this.element);
                }else{
                    this._show(this.element);
                }
            }
            this._super(key,value);
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
            this.element.removeClass('webui-text-input ui-widget ui-widget-content ui-corner-all');
        }
	});
})(jQuery);