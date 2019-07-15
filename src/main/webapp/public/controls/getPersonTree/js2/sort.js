
(function(){
	var Position = function(conf){
		var opt = $.extend(true,{
			//url: '',
			//data: {},
			data: [],
			defaultdata:[],//默认值
			bindId: '',
			maxNum: null,
			minNum: null,
			pinyinType: [], //拼音搜索类型:1部门 2岗位 4人员
			callback: function(){
				
			}
		},conf);

		pinyin = {};
		pinyin.Initials = '';
		pinyin.initials = [];
		pinyin.num = 0;
		resultParam = [];
		//resultData = [];
		defaultdatastr = opt.defaultdata.join();
		searchdivwidth = 0;
		scrHeight = window.screen.availHeight;
		//拼音搜索类型
		var pinyinTypeFun = function(){
			if(opt.pinyinType.length>0){
				var res = '';
				//for(var pi in opt.pinyinType){
				for(var pi=0;pi<opt.pinyinType.length;pi++){
					if(pi>0)res += '|';
					res += opt.pinyinType[pi];
				}
				return eval(res);
			}
		};
		
		//根据展示类型过滤数据
		var checkDataFun = function(datas,pyType){
			var resData = [];
			//for(var n in datas){
			for(var n=0;n<datas.length;n++){
				switch(pyType){
					case 1: //部门
						if(datas[n].type == 1)
							resData.push(datas[n]);
						break;
					case 2: //岗位
						if(datas[n].type == 2)
							resData.push(datas[n]);
						break;
					case 3: //部门+岗位
						if(datas[n].type == 1 || datas[n].type == 2)
							resData.push(datas[n]);
						break;
					case 4: //人员
						if(datas[n].type == 4)
							resData.push(datas[n]);
						break;
					case 5: //部门+人员
						if(datas[n].type == 1 || datas[n].type == 4)
							resData.push(datas[n]);
						break;
					case 6: //岗位+人员
						if(datas[n].type == 2 || datas[n].type == 4)
							resData.push(datas[n]);
						break;
					case 7: //部门+岗位+人员
						resData.push(datas[n]);
						break;
				}
			}
			return resData;
		};
		
		//请求URL加载数据
		var request = function(){
			//$.post(opt.url,data,function(d){
				var resultPinyinData = opt.data;
				pinyin.Initials = $('<div></div>').addClass('initials').appendTo($(opt.bindId));
				var initul = $('<ul></ul>').appendTo(pinyin.Initials);
				$('<li>#</li>').appendTo(initul);

				//右排字母集合
				var initials = [];
				//特殊编码个数
				var num = 0;
				//点击字母列后的放大框
				var LetterBox = $('<div></div>').attr('id','letter').appendTo($(opt.bindId));
				//拼音搜索需要展示的类型
				var pinyinDataType = pinyinTypeFun();
				//获得拼音搜索中的数据
				var pinyinData = checkDataFun(resultPinyinData,pinyinDataType);
				
				initData(pinyinData);
				$(".initials ul li").click(function () {
					var _this = $(this);
					var LetterHtml = _this.html();
					LetterBox.html(LetterHtml).fadeIn();

					setTimeout(function () {
						pinyin.Initials.css('background', 'rgba(145,145,145,0)');
						LetterBox.fadeOut();
					}, 1000);

					var _index = _this.index();
					document.body.scrollTop=0;
					//点击第一个滚到顶部
					if (_index == 0) {
						$('.sort-box-wrap').animate({scrollTop: 0}, 300);
					} else {
						var letter = _this.text();
						if ($('#' + letter).length > 0) {
							var LetterTop = $('#' + letter).position().top;
							$('.sort-box-wrap').animate({scrollTop: LetterTop+'px'}, 300);
						}
					}
				});

				//var InitHeight=scrHeight-200;
				var InitHeight=document.getElementById('pinyin').style.height;
				InitHeight = InitHeight.replace(/[A-Za-z]/g,'') - 160;
				pinyin.Initials.height(InitHeight);
				var LiHeight=InitHeight/(pinyin.initials.length + 1);
				pinyin.Initials.find('li').height(LiHeight).css('line-height',LiHeight+'px');

			//},'json')
		};
		
		var addData = function(data,sortlist,checkeddiv){
			checkeddiv.addClass('checked-div').html(data.title);
			if(data.type==1)checkeddiv.css({'background-color':'#f7b051'});
			else if(data.type==2)checkeddiv.css({'background-color':'#82bbd6'});
			else if(data.type==4) {
				checkeddiv.empty();
				$('<img />').addClass('title-img-circle').attr('src', '/app/userinfo/member_outphoto.jsp?personId=' + data.id).appendTo(checkeddiv);
			}
				//checkeddiv.css({'background-color':'#2dcc70'});
			//$('<img />').addClass('title-img-circle').attr('src','/app/userinfo/member_outphoto.jsp?personId='+data.id).appendTo(checkeddiv);
			$(checkeddiv).on('click',function(){
				$(this).remove();
				for(var c=0;c<resultParam.length;c++){
					if(resultParam[c].id == data.id)
						resultParam.splice(c,1);
				}
				$(sortlist).find('.check_img').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
				$('.search-child-w,.search-child').css({
					width: 44*(resultParam.length)
				});
				$('.search-child-div').css({
					width: searchdivwidth *.75 - $('.search-child-w').width()<1?searchdivwidth *.24:(searchdivwidth - $('.search-child-w').width())
				});
				opt.callback(resultParam);
				//同步
				var tongbu = "tongbu"+ data.id;
				for(var g in persontree){
					if(g.indexOf(data.id) != -1){
						persontree[g].call(this, data);
					}
				}
			})
			.appendTo('.search-child');
			//var checkedimg = $('<div></div>').addClass('checked-img').appendTo(checkeddiv);
			if(data.type==1)checkeddiv.addClass('');
			else if(data.type==2)checkeddiv.addClass('');
			else if(data.type==4)checkeddiv.addClass('');
			$('.search-child-w,.search-child').css({
				width: 44*(resultParam.length)
			})
		};
		
		var initData = function(pinyinData){
			//搜索头部信息
			var searchdiv = $('<div></div>').attr("id","search-div").appendTo($(opt.bindId));
			searchdivwidth = $(searchdiv).width();
			var searchchildw = $('<div></div>').addClass("search-child-w").appendTo(searchdiv);
			$('<div></div>').attr("id","search-child").addClass("search-child").appendTo(searchchildw);

			var searchinputdiv = $('<div></div>').addClass("search-child-div").appendTo(searchdiv);
			$('<input type="text"/>').addClass("search-input").attr("placeholder","搜索").appendTo(searchinputdiv);
			//加载数据
			var sortboxdiv = $('<div></div>').addClass("sort-box-wrap")
				.css({
					'height':scrHeight,
					'padding-top': '85px',
					'overflow': 'auto',
					'-webkit-overflow-scrolling':'touch',
					'position': 'relative'
				}).appendTo($(opt.bindId));
			var SortBox = $('<div></div>').addClass("sort_box").appendTo(sortboxdiv);
			var searchinputwidht = $('.search-input').width();

			for(var data=0;data<pinyinData.length;data++){
				(function(d){
					var checkeddiv = "";
					//d.py = makePy(d.title)[0].toUpperCase();
					var sortlist = $(d.html);
					//SortBox.append(sortlist);
					/*var sortlist = $('<div></div>').addClass('sort_list')*/
					sortlist.bind('click',function(){
						//取消选中
						if($(this).find('.check_img').hasClass('icon-xuanzhong')){
							$(checkeddiv).remove();
							$(this).find('.check_img').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
							for(var c=0;c<resultParam.length;c++){
								if(resultParam[c].id == d.id)
									resultParam.splice(c,1);
							}
							$('.search-child,.search-child-w').css({
								width: 44*(resultParam.length)
							});
						}
						//选中
						else{
							if(opt.maxNum != null && resultParam.length == opt.maxNum){
								$.message('最多选'+opt.maxNum+'个');
								return;
							}
                            checkeddiv = $('<div></div>');
							d.target=checkeddiv;
							resultParam.push(d);
							//$('<img />').addClass('img-circle').css({'width':'40px','height':'40px'}).attr('src','/app/userinfo/member_outphoto.jsp?personId='+ d.id).appendTo(checkeddiv);
							addData(d,$(sortlist),checkeddiv);
							$(this).find('.check_img').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
						}
						$('.search-child-div').css({
							width: searchdivwidth *.75 - $('.search-child-w').width()<1?searchdivwidth *.24:(searchdivwidth - $('.search-child-w').width())
						});
						//同步
						var tongbu = "tongbu"+ d.id;
						for(var g in persontree){
							if(g.indexOf(d.id) != -1){
								persontree[g].call($(this), d);
							}
						}
						opt.callback(resultParam);
					}).appendTo(SortBox);

					if(d.type==4)
						$('<img />').addClass('img-circle').attr('src','/app/userinfo/member_outphoto.jsp?personId='+ d.id).appendTo(sortlist.find('.num_logo'));

					//默认值选中
					if(defaultdatastr.indexOf(d.id)!=-1){
						//sortlist.click();
						resultParam.push(d);
						checkeddiv = $('<div></div>');
						//$('<img />').addClass('img-circle').css({'width':'40px','height':'40px'}).attr('src','/app/userinfo/member_outphoto.jsp?personId='+ d.id).appendTo(checkeddiv);
						addData(d,sortlist,checkeddiv);
						$(sortlist).find('.check_img').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
						$('.search-child-div').css({
							width: searchdivwidth *.75 - $('.search-child-w').width()<1?searchdivwidth *.24:(searchdivwidth - $('.search-child-w').width())
						});
					}
					//同步方法
					var tongbu = "tongbu"+ d.id;
					pinyin[tongbu] = function(n){
						//取消选中
						if($(sortlist).find('.check_img').hasClass('icon-xuanzhong')){
							$(checkeddiv).remove();
							$(sortlist).find('.check_img').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong');
							for(var c=0;c<resultParam.length;c++){
								if(resultParam[c].id == n.id)
									resultParam.splice(c,1);
							}
							$('.search-child-w,.search-child').css({
								width: 44*(resultParam.length)
							});

						}
						//选中
						else{
							var bo = false;
							for(var y=0;y<resultParam.length;y++){
								if(resultParam[y].id== n.id){
									bo = true;
									break;
								}
							}
							if(!bo)
								resultParam.push(n);
							checkeddiv = $('<div></div>');
							//$('<img />').addClass('img-circle').css({'width':'40px','height':'40px'}).attr('src','/app/userinfo/member_outphoto.jsp?personId='+ d.id).appendTo(checkeddiv);
							addData(n,sortlist,checkeddiv);
							$(sortlist).find('.check_img').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong');
						}
						$('.search-child-div').css({
							width: searchdivwidth *.75 - $('.search-child-w').width()<1?searchdivwidth *.24:(searchdivwidth - $('.search-child-w').width())
						});
					}
				})(pinyinData[data])
			}

			var SortList=$(".sort_list");
			var SortBox=$(".sort_box");
			
			//按首字母排序
			/*SortList.sort(asc_sort).appendTo(SortBox);
			function asc_sort(a, b) {
				var r = makePy($(b).find('.num_name').text().charAt(0))[0].toUpperCase() < makePy($(a).find('.num_name').text().charAt(0))[0].toUpperCase() ? 1 : -1;
				return r
			}*/
			
			SortList.each(function(i) {
				var initial = makePy($(this).find('.num_name').text().charAt(0))[0].toUpperCase();
				
				if(initial>='A'&&initial<='Z'){
					if (pinyin.initials.indexOf(initial) === -1)
						pinyin.initials.push(initial);
				}else{
					pinyin.num++;
				}
			});

			pinyin.initials.sort(asc_right);
			function asc_right(a, b) {
				var r = makePy(b)[0].toUpperCase() < makePy(a)[0].toUpperCase() ? 1 : -1;
				return r
			}

			//添加首字母标签
			$.each(pinyin.initials, function(index, value) {
				if(pinyin && pinyin.Initials && pinyin.Initials.length>0)
					pinyin.Initials.find('ul').append('<li>' + value + '</li>');
				SortBox.append('<div class="sort_letter" id="'+ value +'">' + value + '</div>');
			});
			
			if(pinyin.num != 0){
				SortBox.prepend('<div class="sort_letter" id="default">#</div>');
			}
			//插入到对应的首字母后面
			for (var i =0;i<SortList.length;i++) {
				var letter=makePy(SortList.eq(i).find('.num_name').text().charAt(0))[0].toUpperCase();
				switch(letter){
					case "A":
						$('#A').after(SortList.eq(i));
						break;
					case "B":
						$('#B').after(SortList.eq(i));
						break;
					case "C":
						$('#C').after(SortList.eq(i));
						break;
					case "D":
						$('#D').after(SortList.eq(i));
						break;
					case "E":
						$('#E').after(SortList.eq(i));
						break;
					case "F":
						$('#F').after(SortList.eq(i));
						break;
					case "G":
						$('#G').after(SortList.eq(i));
						break;
					case "H":
						$('#H').after(SortList.eq(i));
						break;
					case "I":
						$('#I').after(SortList.eq(i));
						break;
					case "J":
						$('#J').after(SortList.eq(i));
						break;
					case "K":
						$('#K').after(SortList.eq(i));
						break;
					case "L":
						$('#L').after(SortList.eq(i));
						break;
					case "M":
						$('#M').after(SortList.eq(i));
						break;
					case "N":
						$('#N').after(SortList.eq(i));
						break;
					case "O":
						$('#O').after(SortList.eq(i));
						break;
					case "P":
						$('#P').after(SortList.eq(i));
						break;
					case "Q":
						$('#Q').after(SortList.eq(i));
						break;
					case "R":
						$('#R').after(SortList.eq(i));
						break;
					case "S":
						$('#S').after(SortList.eq(i));
						break;
					case "T":
						$('#T').after(SortList.eq(i));
						break;
					case "U":
						$('#U').after(SortList.eq(i));
						break;
					case "V":
						$('#V').after(SortList.eq(i));
						break;
					case "W":
						$('#W').after(SortList.eq(i));
						break;
					case "X":
						$('#X').after(SortList.eq(i));
						break;
					case "Y":
						$('#Y').after(SortList.eq(i));
						break;
					case "Z":
						$('#Z').after(SortList.eq(i));
						break;
					default:
						$('#default').after(SortList.eq(i));
						break;
				}
			}
		};
		request();
		
		$('#search-div .search-input').bind('input propertychange',function(){
			$('.sort_box').css({top: '85px'});
			var inputdesc = $.trim($(this).val()).toUpperCase();
			if(inputdesc)
				$('.sort_box .sort_letter').addClass('dis-hidden');
			else
				$('.sort_box .sort_letter').removeClass('dis-hidden');
			var sortlist = $(".sort_box .sort_list");
			for(var n=0;n<sortlist.length;n++){
				var childpinyin = $(sortlist[n]).find('.num_name').attr('pinyin');
				var childpinyindesc = $(sortlist[n]).find('.num_name').html();
				if((childpinyin && childpinyin.indexOf(inputdesc) != -1) || childpinyindesc.indexOf(inputdesc) != -1)
					$(sortlist[n]).removeClass('dis-hidden');
				else
					$(sortlist[n]).addClass('dis-hidden');
			}
		});
		return this;
	};
	window.getPersonTree = function(conf){
		return new Position(conf);
	}
	
})(jQuery)
