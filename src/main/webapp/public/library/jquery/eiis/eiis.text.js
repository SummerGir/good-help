(function($,undefined){
	$.widget("eiis.input",{
		_create:function(){
            this.element.addClass("webui-text-input ui-widget ui-widget-content ui-corner-all")
		},
        _setOption:function(key,value){
            //$.Widget.prototype._setOption.apply(this, arguments);
            this._super(key,value);
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
        },
		widget:function(){
			return this.element;
		},
        _destroy:function(){
            this.element.removeClass('webui-text-input ui-widget ui-widget-content ui-corner-all');
        }
	});
})(jQuery);