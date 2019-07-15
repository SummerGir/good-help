//遮盖层
(function(){
	/* 显示遮罩层 */
	function showOverlay() {
		var cover = $('<div></div>').addClass('overlay').appendTo('body');
		$(cover).height(pageHeight()-51);
		$(cover).width(pageWidth());
		$(cover).css('margin-top',51);
		// fadeTo第一个参数为速度，第二个为透明度
		// 多重方式控制透明度，保证兼容性，但也带来修改麻烦的问题
		cover.fadeTo(0, 0.5);
		return cover;
	}

	/* 隐藏覆盖层 */
	function hideOverlay(cover) {
		cover.remove();
	}

	/* 当前页面高度 */
	function pageHeight() {
		return document.body.scrollHeight;
	}

	/* 当前页面宽度 */
	function pageWidth() {
		return document.body.scrollWidth;
	}

	function adjust(id) {
		var w = $(id).width();
		var h = $(id).height();

		var t = scrollY() + (windowHeight()/2) - (h/2);
		if(t < 0) t = 0;

		var l = scrollX() + (windowWidth()/2) - (w/2);
		if(l < 0) l = 0;
		$(id).css({left: l+'px', top: t+'px'});
	}

	//浏览器视口的高度
	function windowHeight() {
		var de = document.documentElement;
		return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
	}

	//浏览器视口的宽度
	function windowWidth() {
		var de = document.documentElement;
		return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
	}

	/* 浏览器垂直滚动位置 */
	function scrollY() {
		var de = document.documentElement;
		return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
	}

	/* 浏览器水平滚动位置 */
	function scrollX() {
		var de = document.documentElement;

		return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
	}
	jQuery.posts = function(url,data,callback,type){
		var cover = showOverlay();
		$.ajax({
			type : "post",
			url : url,
			async : true,
			data : data,
			dataType : type,
			success : function(d){
				callback(d);
			},
			complete: function () {
				hideOverlay(cover);
			}
		});
		/*var cover = showOverlay();
		$.post(url,data,function(d){
			callback(d);
			hideOverlay(cover);
		},type);*/
	};
	jQuery.posts2 = function(url,data,callback,type){
		var cover = showOverlay();
		$.ajax({
			type : "post",
			url : url,
			async : false,
			data : data,
			dataType : type,
			success : function(d){
				callback(d);
			},
			complete: function () {
				hideOverlay(cover);
			}
		});
	};
})()