(function(){
	myScroll = '';
	var Moveload = function(conf){
		var opt = {
			bindId: 'wrapper',
			upId: 'pullUp',
			downId: 'pullDown',
			upcallback: function(){
			},
			downcallback: function(){
			}
		};
		var pullDownEl,
			pullDownOffset,
			pullUpEl,
			pullUpOffset,
			generatedCount = 0;
		$.extend(true,opt,conf);
		var loaded = function () {
			pullDownEl = document.getElementById(opt.downId);
			pullDownOffset = pullDownEl.offsetHeight;
			pullUpEl = document.getElementById(opt.upId);
			pullUpOffset = pullUpEl.offsetHeight;

			myScroll = new iScroll(opt.bindId, {
				scrollbarClass: 'myScrollbar',
				useTransition: false,
				topOffset: pullDownOffset,
				onRefresh: function () {
					if (pullDownEl.className.match('loading')) {
						 pullDownEl.className = '';
						 $(pullDownEl).find('.pullDownLabel').text('下拉刷新...');
					 } else if (pullUpEl.className.match('loading')) {
						 pullUpEl.className = '';
						 $(pullUpEl).find('.pullUpLabel').text('上拉加载更多...');
					 }
				},
				onScrollMove: function () {
					if ((this.y+40) > 0 && !pullDownEl.className.match('flip')) {
						pullDownEl.className = 'flip';
						//$(pullDownEl).find('.pullDownLabel').text('松手开始更新...');
						//this.minScrollY = 0;
					} else if ((this.y+40) < 0 && pullDownEl.className.match('flip')) {
						pullDownEl.className = '';
						//$(pullDownEl).find('.pullDownLabel').text('下拉刷新...');
						//this.minScrollY = -pullDownOffset;
					} else if ((this.y+40) < (this.maxScrollY - 0) && !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip';
						//$(pullUpEl).find('.pullUpLabel').text('松手开始更新...');
						this.maxScrollY = this.maxScrollY;
					} else if ((this.y+40) > (this.maxScrollY + 0) && pullUpEl.className.match('flip')) {
						pullUpEl.className = '';
						//$(pullUpEl).find('.pullUpLabel').text('上拉加载更多...');
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (pullDownEl.className.match('flip')) {
						pullDownEl.className = 'loading';
						$(pullDownEl).find('.pullDownLabel').text('加载中...');
						opt.downcallback();
					} else if (pullUpEl.className.match('flip')) {
						pullUpEl.className = 'loading';
						$(pullUpEl).find('.pullUpLabel').text('加载中...');
						opt.upcallback();
					}
					myScroll.refresh();
				}
			});

			setTimeout(function () { document.getElementById(opt.bindId).style.left = '0'; }, 800);
		};
		//初始化绑定iScroll控件
		document.getElementById(opt.bindId).addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		document.addEventListener('DOMContentLoaded', loaded, false);
	};
	window.moveload = function(conf){
		new Moveload(conf);
	}
})()