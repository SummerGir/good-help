

$.widget("ui.tabs",$.ui.tabs,{
	options:{
		 closeable:true
		,pagingable:true
	},
	_processTabs:function(){
		var that = this;
		this._super();
		if(this.options.closeable){
			that.tabs.not(that.tabs.has("span.ui-icon-close.eiis-ui-tabs-close")).append(
				$('<span class="ui-icon ui-icon-close eiis-ui-tabs-close">关闭</span>')
					.click(function(){
						var index = that.tabs.index($( this ).closest("li"));
						that.remove(index);
					})
			);
		}else{
			$("span.ui-icon-close.eiis-ui-tabs-close", this.tabs).remove();
		}
		if(this.options.pagingable === true){
			this._pagingUpdate();	
		}
	},
	_pagingHandleResize: function(){ },
	_pagingInit:function(){
		var that = this;
	      that.tabsPanel = $('<div />').addClass('ui-tabs-paging-full');
            that.scrollPanel = $('<div />').addClass('ui-tabs-paging-display')
                                            .append(that.tabsPanel);
            that.nextButton = $('<div ><div class="ui-icon ui-icon-circle-arrow-e" /></div>').addClass('ui-tabs-paging-next')
            	.on("mousedown", function (e) {
                        e.preventDefault();

                        var tabsPanelWidth = 0;
                        that.tabs.each(function () {
                            tabsPanelWidth += $(this).outerWidth(true);
                        });

                        var offsetleft = that.scrollPanel.width() - tabsPanelWidth;
                        if (offsetleft > 0) offsetleft = 0;

                        that.tabsPanel.stop();
                        that.tabsPanel.animate({ left: offsetleft }, 'slow');

                    })
                    .on("mouseup", function (e) {
                        e.preventDefault();
                        that.tabsPanel.stop();
                    })
                   .hide()
                    ;
            that.prevButton = $('<div ><div class="ui-icon ui-icon-circle-arrow-w" /></div>').addClass('ui-tabs-paging-prev')
            	.on("mousedown", function (e) {
                        e.preventDefault();

                        that.tabsPanel.stop();
                        that.tabsPanel.animate({ left: 0 }, 'fast');
                    })
                    .on("mouseup", function (e) {
                        e.preventDefault();
                        that.tabsPanel.stop();
                    })
                   .hide()
                    ;
		that.tabsPanel.append(that.tabs);
             that.tablist.append(that.prevButton);
             that.tablist.append(that.scrollPanel);
             that.tablist.append(that.nextButton);
             
             var	resizeTimer= null,
			windowHeight=$(window).height(), 
			windowWidth=$(window).width()
			;
             
             that._pagingHandleResize = function () {
	            if (resizeTimer) clearTimeout(resizeTimer);

	            if (windowHeight != $(window).height() || windowWidth != $(window).width()){
	                resizeTimer = setTimeout(function() {
			            windowHeight = $(window).height();
			            windowWidth = $(window).width();
			            that._pagingUpdate();
        			}, 100);
            	}
		};
             $(window).on("resize", that._pagingHandleResize);
	},
	_pagingUpdate:function(){
		var that = this;
		if(that.tabsPanel){
				that.tabsPanel.append(that.tabs);
		var tabsPanelWidth = 0;
            that.tabs.each(function () {
                tabsPanelWidth += $(this).outerWidth(true);
            });

            if (tabsPanelWidth > that.tablist.width()) {


	
                that.prevButton.show();
                that.nextButton.show();

                that.scrollPanel.width(that.tablist.width() - that.prevButton.outerWidth(true) - that.nextButton.outerWidth(true) - 1);

                that.tabsPanel.width(tabsPanelWidth * 2);

                //当前 tabs 左边的位置
                var currentLeft = that.tabsPanel.position().left - that.scrollPanel.position().left;
                if (currentLeft > 0) currentLeft = 0;
                currentLeft *= -1;
                //tabs 滚动容器长度
                var scrollWidth = that.scrollPanel.width();

                if (tabsPanelWidth < currentLeft + scrollWidth) {
                    that.tabsPanel.css('left', ((tabsPanelWidth - scrollWidth) * -1) + 'px');
                }
            }else{
            	that.prevButton.hide();
                	that.nextButton.hide();
            }

        }
	},
	_pagingDestroy:function(){
		var that = this;
		$(window).off('resize', that._pagingHandleResize);

            that.tablist.append(that.tabs);
            that.scrollPanel.detach();
            that.prevButton.detach();
            that.nextButton.detach();
	},
	_setOption: function( key, value ) {
		this._super( key, value);
		if ( key === "closeable" ) {
			this._processTabs();
		}
		if ( key === "pagingable" ) {
			if(value === true){
				this._pagingInit();	
			}else{
				this._pagingDestroy();
			}
		}
	},
	_create: function() {
		this._super();
		//var that = this;
		if(this.options.pagingable === true){
			this._pagingInit();	
		}
	},
	_destroy: function() {
		this._pagingDestroy();
		this._super();
	}
});