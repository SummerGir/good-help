/*分页*/ 
(function () {
	var Page = function (conf) {
		var opt = {
			pageNo:1, 
			pageCount:5,
			url:null,
			term:{},
			even:"click", 
			searchcont:null,
			btns:{
				prev:"",
				next:"",
				//direct:"",
				search:""
			},
			callback:function(){
				
			}
		};
		$.extend(true, opt, conf);
		var request = function () {
			var o = $.extend(true,{},opt,opt.term);
			delete o.callback;
			delete o.btns;
			$.post(opt.url, o, function (d) {
				opt.callback(d,o);
			},'json');
		};
		var isClick = false;
		var prev = function () {
			if (opt.pageNo > 1){
				opt.pageNo--;
				isClick = true;
			}else{
				isClick = false;
			}
			return this;
		};
		var next = function () {
			if (opt.pageNo < opt.pageCount) {
				opt.pageNo++;
				isClick = true;
			}else{
				isClick = false;
			}
			return this;
		};
		var set = function (no) {
			if (no > 0 && no <= opt.pageCount) {
				opt.pageNo = no;
				isClick = true;
			}else{
				isClick = false;
			}
			return this;
		};
		for(var btn in opt.btns){
			(function(btns,btn){
				$(btns[btn]).unbind(opt.even).on(opt.even,function(){
					if(btn=='prev'){
						prev();
					}else if(btn=='next'){
						next();
					}else if(btn=='direct'){
						var no = $(this).attr('value');
						set(no);
					}else if(btn=='search'){
						var no = $(opt.searchcont).val();
						set(no);
					}
					if(isClick) request();
				})
			})(opt.btns,btn)
		}
	};
	window.pageinit = function(conf){
		return new Page(conf);
	}
})()
