
/*
 //拼音配置
 (function(){
 var conf = {
 bindId: '#pinyin',
 data: d,
 //maxNum: null,
 pinyinType: [1,2,4], //拼音搜索类型:1部门 2岗位 4人员
 callback: function(data){

 }
 };
 getPersonTree(conf);
 })();

 //树形配置
 (function(){
 $("#tree").jqmtree({
 isParentCheck: true,  	//父类是否可选
 isRela: true,  //父类是否关联子类
 data: d,
 callback: function(data){

 }
 })resultParam  resultData
 })();*/
//allPersonData = [];
//组合
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

	hidenode = [];
	var bodyCSS = {};

	var GetPerson = function(url,data,pinyin,tree,max, min, callback){
		//拼音搜索初始化配置
		var pinyinopt = $.extend(true,{
			bindId: '#pinyin',
			data: [],
			pinyinType: [], //拼音搜索类型:1部门 2岗位 4人员
			callback: function(data){ //点击选项后的回调
				$('.top-desc').html('确定(' + resultParam.length + ')');
			}
		},pinyin);
		//树形初始化配置
		var treeopt = $.extend(true,{
			isCheckDep: true,	//部门是否可选
			isCheckPost: false,	//岗位是否可选
			isCheckperson: false, //人员是否可选
			//isRela: true,  //父类是否关联子类
			data: [],
			callback: function(data){ //点击选项后的回调
				$('.top-desc').html('确定(' + resultData.length + ')');
			}
		},tree);

		//数据去重
		var delrepeat = function(data1,data2){
			if(!data1)data1 = [];
			if(!data2)data2 = [];
			var resD = [];
			for(var k=0;k<data2.length;k++){
				resD.push(data2[k]);
			}
			for(var i=0;i<data1.length;i++){
				var isHave = false;
				for(var j=0;j<data2.length;j++){
					if(data1[i].id == data2[j].id){
						isHave = true;
						break;
					}
				}
				if(!isHave)
					resD.push(data1[i]);
			}
			return resD;
		};

		var createtitle = function(){
			groub = {};
			var persontree = $('<div></div>').attr('id','person-tree').appendTo('body');
			var top = $('<div></div>').attr('id','top').appendTo(persontree);
			var topc = $('<div></div>').addClass('top').html('选择成员').appendTo(top);
			//头部返回按钮
			$('<div>取消</div>').addClass('top-left')
				.bind('click',function(){
					//$('body').children().show();
					for (var h = 0; h < hidenode.length; h++) {
						$(hidenode).css('display', 'block');
					}
					$('body').css('padding-top',bodyCSS.paddingtop);
					$(persontree).remove();
				})
				.appendTo(topc);
			//选中提示和全选
			var checkallbtn = $('<div></div>').addClass('top-desc')
				.bind('click',function(){
					groub.resData = [];
					if(!resultData)resultData = [];
					if(!resultParam)resultParam = [];
					groub.resData = delrepeat(resultData,resultParam);
					if(max != null && max<groub.resData.length){
						$.message("最多选"+max+"项");
						return false;
					}
					if(min != null && min>groub.resData.length){
						$.message("最少选"+min+"项");
						return false;
					}

					var destroy=function(){
                        if(groub.resData.length>0){
                            $(data._thisbind).parents('.person-warp').find('.personplace').hide();
                            $(data._thisbind).parents('.person-warp').next('.personplace').hide();
                        }
                        for (var h = 0; h < hidenode.length; h++) {
                            $(hidenode).css('display', 'block');
                        }
                        $('body').css('padding-top',bodyCSS.paddingtop);
                        $(persontree).remove();
					};
					if(callback(groub.resData,destroy)!==false){
                        destroy();
					}
				}).html('确定(0)').appendTo(topc);
			if(pinyinopt.defaultdata && pinyinopt.defaultdata.length>0 && pinyinopt.defaultdata!=""){
				$(checkallbtn).addClass('hasPerson').html('确定(' + pinyinopt.defaultdata.length + ')');
			}
			//右侧下一步按钮
			/*$('<div></div>').addClass('top-right').addClass('esg-font icon-xialatubiao')
			 .css('font-size','22px')
			 .bind('click',function(){
			 groub.resData = [];
			 if(!resultData)resultData = [];
			 if(!resultParam)resultParam = [];
			 groub.resData = delrepeat(resultData,resultParam);
			 if(max != null && max<groub.resData.length){
			 $.message('最多选'+max+'项');
			 return false;
			 }
			 if(min != null && min>groub.resData.length){
			 $.message('最少选'+min+'项');
			 return false;
			 }

			 if(groub.resData.length>0){
			 $(data._thisbind).parents('.person-warp').next('.personplace').hide();
			 }

			 $('body').children().show();
			 $(persontree).remove();
			 callback(groub.resData);
			 }).appendTo(topc);*/
			var searchtitle = $('<div></div>').addClass('search-title').appendTo(persontree);
			$('<a href="javascript:void(0)">按拼音</a>')
				.bind('click',function(){
					descconf($(this).index());
				})
				.addClass('active').appendTo(searchtitle);
			$('<a href="javascript:void(0)">按层级</a>')
				.bind('click',function(){
					descconf($(this).index());
				})
				.appendTo(searchtitle);
			//TODO
			/*$('<a href="javascript:void(0)">按群组</a>')
			 .bind('click',function(){
			 descconf($(this).index());
			 })
			 .appendTo(searchtitle);*/
			//
			var datadesc = $('<div></div>').addClass('data-desc').appendTo(persontree);
			var datadescd = $('<div></div>').addClass('').appendTo(datadesc);

			$('<div></div>').attr('id','pinyin').css('height',window.screen.availHeight).appendTo(datadescd);
			$('<div></div>').attr('id','tree').appendTo(datadescd);
			//TODO
			/*$('<div></div>').attr('id','group').appendTo(datadescd);*/

			var activenum = $(searchtitle).find($('a.active')).index();
			descconf(activenum);

			function descconf(num){
				$(searchtitle).children().removeClass('active');
				$(searchtitle).children().eq(num).addClass('active');
				$(datadescd).children().addClass('dis-hidden');
				$(datadescd).children().eq(num).removeClass('dis-hidden');
			}
		};

		createtitle();
		$.posts("/public/huancun/getPerson", data, function (d) {
			pinyinopt.data = d;
			treeopt.data = d;
			getPersonTree(pinyinopt);
			jqmtree(treeopt);
		}, 'json');

	};
	window.getPerson = function(url,data,pinyin,tree,max, min, callback){
		bodyCSS.paddingtop = $('body').css('padding-top');
		$('body').css('padding-top','0px');
		$('body').children().each(function(){
			if($(this).css('display')=='block'){
				hidenode.push(this);
				$(this).css('display','none');
			}
		});
		//$('body').children().hide();
		new GetPerson(url, data, pinyin, tree,max, min, callback);
	};

	$.fn.extend({
		//
		resetPersonTree: function(personConf){
			var _this = this;
			(function(_this){
				var pinyinType = [1,2,4];
				if($(_this).attr('pinyinType')){
					pinyinType = [];
					var pinyinTypeArray = $(_this).attr('pinyinType').split(',');
					for(var r=0;r<pinyinTypeArray.length;r++){
						pinyinType.push(parseInt(pinyinTypeArray[r]));
					}
				}
				var change = $(_this).attr('data-change');
				var maxnum = ($(_this).attr('maxnum')&&$(_this).attr('maxnum').length>0)?$(_this).attr('maxnum'):null;
				var minnum = ($(_this).attr('minnum')&&$(_this).attr('minnum').length>0)?$(_this).attr('minnum'):null;
				var isFrozen = $(_this).attr('isfrozen')?$(_this).attr('isfrozen'):0;
				var projectId = $(_this).attr('projectId')?$(_this).attr('projectId'):'';
				var postId = $(_this).attr('postId')?$(_this).attr('postId'):'';
				var placeholder = $(_this).attr('placeholder')?$(_this).attr('placeholder'):'';
				var isCheckDep = true, isCheckPost = true, isCheckperson = true;
				if($(_this).attr('isCheckDep') && $(_this).attr('isCheckDep')==0) isCheckDep = false;
				if($(_this).attr('isCheckPost') && $(_this).attr('isCheckPost')==0) isCheckPost = false;
				if($(_this).attr('isCheckperson') && $(_this).attr('isCheckperson')==0) isCheckperson = false;
				$(_this).css('display','none');
				if($(_this).parent('.person-warp').length==0)
					$(_this).wrap('<div class="person-warp"></div>');
				var lab = "";
				if($(_this).parent('.person-warp').find('.p-lab').length==0)
					lab = $('<label></label>').addClass('p-lab').appendTo($(_this).parent(".person-warp"));
				else
					lab = $(_this).parent('.person-warp').find('.p-lab');
				if($(_this).parent(".person-warp").find('.personplace').length==0)
					$('<span></span>').addClass('personplace').html(placeholder).appendTo($(_this).parent(".person-warp"));
				var url = ($(_this).attr('url') && $(_this).attr('url').length>0)?$(_this).attr('url'):'/public/huancun/getPerson';
				var cla = "icon-caidan";
				if($(this).attr('right-img') && $(this).attr('right-img').length>0)cla = $(this).attr('right-img');
				var pspan = $('<span></span>').addClass('p-btn').addClass('esg-font').addClass(cla)
					.css({'font-size':'30px'})
					.bind('click',function(){
						getPerson(url,{
							_thisbind:_this,
							isFrozen:isFrozen,
							projectId: projectId,
							postId: postId
						},{
							defaultdata: $(_this).val().split(','),
							maxNum: maxnum,
							minNum: minnum,
							pinyinType: pinyinType //拼音搜索类型:1部门 2岗位 4人员
						},{
							defaultdata: $(_this).val().split(','),
							maxNum: maxnum,
							minNum: minnum,
							isCheckDep: isCheckDep,	//部门是否可选
							isCheckPost: isCheckPost,	//岗位是否可选
							isCheckperson: isCheckperson //人员是否可选
							//isRela: isRela  //父类是否关联子类
						},maxnum,minnum,function(data){
							$(lab).empty();
							_createchecked(data,$(lab),$(_this));
							if(change){
								eval(change).call(this,data,_this);
							}else if(typeof persontreecallback == 'function')
								persontreecallback.call(this,data,_this);
						});
					})
					.appendTo($(_this).parent(".person-warp"));
				//默认值
				if($(_this).attr('defvalue') && $(_this).attr('defvalue').length>0){
					_createdefchecked($(_this).attr('defvalue'),lab,_this);
				}
			})(this)
		}
	});


	$('body').find('input[persontreedata="true"]').each(function(e){
		var _this = this;
		(function(_this){
			var pinyinType = [1,2,4];
			if($(_this).attr('pinyinType')){
				pinyinType = [];
				var pinyinTypeArray = $(_this).attr('pinyinType').split(',');
				for(var r=0;r<pinyinTypeArray.length;r++){
					pinyinType.push(parseInt(pinyinTypeArray[r]));
				}
			}
			var change = $(_this).attr('data-change');
			var maxnum = ($(_this).attr('maxnum')&&$(_this).attr('maxnum').length>0)?$(_this).attr('maxnum'):null;
			var minnum = ($(_this).attr('minnum')&&$(_this).attr('minnum').length>0)?$(_this).attr('minnum'):null;
			var isFrozen = $(_this).attr('isfrozen')?$(_this).attr('isfrozen'):0;
			var projectId = $(_this).attr('projectId')?$(_this).attr('projectId'):'';
			var postId = $(_this).attr('postId')?$(_this).attr('postId'):'';
			var placeholder = $(_this).attr('placeholder')?$(_this).attr('placeholder'):'';
			var isCheckDep = true, isCheckPost = true, isCheckperson = true;
			if($(_this).attr('isCheckDep') && $(_this).attr('isCheckDep')==0) isCheckDep = false;
			if($(_this).attr('isCheckPost') && $(_this).attr('isCheckPost')==0) isCheckPost = false;
			if($(_this).attr('isCheckperson') && $(_this).attr('isCheckperson')==0) isCheckperson = false;
			$(_this).css('display','none').wrap('<div class="person-warp"></div>');
			var lab = $('<label></label>').addClass('p-lab')
				.bind('click',function(){
					/*var inp = $(this).find('input');
					 if(inp.length==0) {
					 var inpspan = $('<span></span>').addClass('inp-span').appendTo(this);
					 inp = $('<input type="text"/>').addClass('inp')
					 .bind('blur',function(){
					 $(this).val('');
					 })
					 .appendTo(inpspan);
					 }
					 inp.focus();*/
				})
				.appendTo($(_this).parent(".person-warp"));
			$('<span></span>').addClass('personplace').html(placeholder).appendTo($(_this).parent(".person-warp"));
			var url = ($(_this).attr('url') && $(_this).attr('url').length>0)?$(_this).attr('url'):'/public/huancun/getPerson';
			var cla = "icon-caidan";
			console.log($(_this).attr('right-img'))
			if($(_this).attr('right-img') && $(_this).attr('right-img').length>0)cla = $(_this).attr('right-img');
			var pspan = $('<span></span>').addClass('p-btn').addClass('esg-font').addClass(cla)
				.css({'font-size':'30px'})
				.bind('click',function(){
					getPerson(url,{
							_thisbind:_this,
							isFrozen:isFrozen,
							projectId: projectId,
							postId: postId
						},{
							defaultdata: $(_this).val().split(','),
							maxNum: maxnum,
							minNum: minnum,
							pinyinType: pinyinType //拼音搜索类型:1部门 2岗位 4人员
						},{
							defaultdata: $(_this).val().split(','),
							maxNum: maxnum,
							minNum: minnum,
							isCheckDep: isCheckDep,	//部门是否可选
							isCheckPost: isCheckPost,	//岗位是否可选
							isCheckperson: isCheckperson //人员是否可选
							//isRela: isRela  //父类是否关联子类
						},maxnum,minnum,function(data){
							$(lab).empty();
							_createchecked(data,$(lab),$(_this));
							if(change){
								eval(change).call(this,data,_this);
							}else if(typeof persontreecallback == 'function')
								persontreecallback.call(this,data,_this);
						}
					);
				})
				.appendTo($(_this).parent(".person-warp"));
			//默认值
			if($(_this).attr('defvalue') && $(_this).attr('defvalue').length>0){
				_createdefchecked($(_this).attr('defvalue'),lab,_this);
			}
		})(this)

	});
	//生成选中的标签(json数组)
	function _createchecked(data,node,hidnode){
		if(data && data.length>0){
			var inputdesc = [];
			for(var v=0;v<data.length;v++){
				(function(d,_node,_hidnode){
					inputdesc.push(d.id);
					var pspan = $('<span></span>').addClass('child-span').text(d.title).appendTo(_node);
					$('<span></span>').addClass('esg-font icon-guanbi')
						.css({'font-size': '8px','margin-left': '8px'})
						.bind('click',function(event){
							event.preventDefault();
							var idesc = $(this).attr('id');
							for(var input in inputdesc){
								if(inputdesc[input] == d.id){
									inputdesc.splice(input,1);
								}
							}
							$(_hidnode).val(inputdesc.join());
							$(this).parent().remove();
							if($(_node).parents('.person-warp').find('.child-span').length == 0){
								$(_hidnode).parents('.person-warp').find('.personplace').show();
								$(_hidnode).parents('.person-warp').next('.personplace').show();
							}
						})
						.appendTo(pspan);
					var personplace = $(_node).prev().attr('personplace');
					$(_node).next().html(personplace);
					if($(_node).parents('.person-warp').find('.child-span').length == 0){
						$(_node).next().show();
					}else {
						$(_node).next().hide();
					}
				})(data[v],node,hidnode)
			}
			$(hidnode).val(inputdesc.join());
		}else{
			$(hidnode).val('');
		}
	};
	//生成选中的标签(string)
	function _createdefchecked(data,node,hidnode){
		var array = data.split(',');
		if(array && array.length>0){
			var dataarray = [];
			for(var r=0;r<array.length;r++){
				var jsond = {};
				var arrays = array[r].split('_');
				jsond.id = arrays[0];
				jsond.title = arrays[1];
				dataarray.push(jsond);
			}
			_createchecked(dataarray,node,hidnode);
		}
	}
})();