var containoffsettop = 0;
searchgroub = {
	getsearchdata :function(type){
		switch(type) {
            case 'sectionType'://项目部阶段
                return {
                    url: '/app/projectStatement/getPlanNameOption2.do',
                    //默认值查询条件
                    searchid: 'id',
                    //默认值展示字段
                    showcode: ['text']
                };
            case 'project'://项目部
                return {
                    url: '/public/selectPlutIn/selectProjectInfo.do',
                    //默认值查询条件
                    searchid: 'projectId',
                    //默认值展示字段
                    showcode: ['projectName']
                };
            case 'meterial'://材料通中的出库(output)、退货(inputEsc)、退库(outputEsc)
                return {
                    url: '/public/selectPlutIn/selectMeterialInfo.do',
                    //默认值查询条件
                    searchid: 'dicId',
                    //默认值展示字段
                    showcode: ['dicName','dicDes']
                };
			case 'contractTemp'://合同模板
				return {
					url: '/public/selectPlutIn/selectContractTemp.do',
					//默认值查询条件
					searchid: 'templetId',
					//默认值展示字段
					showcode: ['templetName']
				};
			case 'dicInfo': // 劳务，机械，材料，间接费等所有材料
				return {
					url: '/public/selectPlutIn/selectAllDicInfo.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'customInfo': // 劳务，机械，材料，等所有往来单位
				return {
					url: '/public/selectPlutIn/selectCustomInfo.do',
					//默认值查询条件
					searchid: 'customId',
					//默认值展示字段
					showcode: ['displayName']
				};
			case 'contractInfo': // 劳务，机械，材料，等所有合同
				return {
					url: '/public/selectPlutIn/selectContractInfo.do',
					//默认值查询条件
					searchid: 'contractId',
					//默认值展示字段
					showcode: ['contractCode']
				};
			case 'contractInfoName': // 劳务，机械，材料，等所有合同
				return {
					url: '/public/selectPlutIn/selectContractInfo.do',
					//默认值查询条件
					searchid: 'contractId',
					//默认值展示字段
					showcode: ['displayName']
				};
			case 'contractDetail': // 劳务，机械，等合同明细
				return {
					url: '/public/selectPlutIn/selectContractDetail.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'contractDetailNew': // 劳务，机械，等合同明细,新方法
				return {
					url: '/public/selectPlutIn/getDicInfoByContract.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'WithholdContract': // 代扣合同
				return {
					url: '/public/selectPlutIn/selectWithholdContract.do',
					//默认值查询条件
					searchid: 'helpedContractId',
					//默认值展示字段
					showcode: ['newShowName']
				};
			case 'planDetail': // 材料需求计划等合同明细
				return {
					url: '/public/selectPlutIn/selectPlanDetail.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'machineInterfix': // 机械相关 出场 output
				return {
					url: '/public/selectPlutIn/selectMachineInterfix.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'machineInputDic': // 查询进场单根据合同
				return {
					url: '/public/selectPlutIn/getMachineInputDic.do',
					searchid: 'dicId',
					showcode: ['dicName','dicDes']
				};
			case 'machineInterfixNew': // 机械相关 出场 output
				return {
					url: '/app/machine/measure/getInputListByContract.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'payFeeDic': // 间接费费用支付单费用名称
				return {
					url: '/public/selectPlutIn/selectPayFeeDic.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'unitDetail': // 查询单位
				return {
					url: '/public/selectPlutIn/selectUnitDetail.do',
					//默认值查询条件
					searchid: 'unitId',
					//默认值展示字段
					showcode: ['unitName']
				};
			case 'leaseOutputAndStop': // 查询租赁停租及退租信息
				return {
					url: '/public/selectPlutIn/getLeaseOutputAndStop.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'appLeaseDic': // 查询租赁起租、退租材料
				return {
					url: '/public/selectPlutIn/getAppLeaseDic.do',
					//默认值查询条件
					searchid: 'dicId',
					//默认值展示字段
					showcode: ['dicName','dicDes']
				};
			case 'unitOfClient': // 查询租赁起租、退租材料
				return {
					url: '/public/unit/getUnitList.do',
					//默认值查询条件
					searchid: 'unitId',
					//默认值展示字段
					showcode: ['unitName']
				};
			case  'pickMember':
				return{
					url : '/public/selectPlutIn/searchPickPhone.do',
                    searchid : 'id',
                    showcode : ['text','expla']
				};
            case 'buildPosition': //施工部位选择项
                return {
                    url: '/public/selectPlutIn/selectBuildPosition.do',
                    searchid: 'buildId',
                    showcode: ['allName']
                };
            case 'invoiceHistory': //发票销售方单位
                return {
                    url: '/public/selectPlutIn/getInvoiceHistory.do',
                    searchid: 'companyName',
                    showcode: ['companyName']
                };
		}
	},
	resetfun: function (_this) {
		var title = $(_this).attr('title');
		var placeholder = $(_this).attr('placeholder');
		var difid = $(_this).val();
		var geturltype = $(_this).attr('urlType');
		var disabled = $(_this).attr('disabled')=='disabled'?true:false;
		var paramsType = $(_this).attr('paramsType');
		var _thisparent = $(_this).parent();
		if($(_this).parent('.wrap-div').length==0) {
			var wrapdiv = $('<div></div>').addClass('wrap-div').appendTo(_thisparent);
			var titlespan = "";
			if (title && title.length > 0)
				titlespan = $('<span></span>').addClass('title').css({
					'font-weight': 'bold',
					'float': 'left'
				}).text(title + ':').appendTo(wrapdiv);
			var list = $('<span></span>').addClass('checked-list').appendTo(wrapdiv);
			if(!disabled)
				$('<span></span>').addClass('esg-font icon-zidiansousuo').css({
					'position': 'absolute',
					'top': '8px',
					'right': '1px',
					'font-size': '25px',
					'color': '#2dcc70'
				}).on('click', function () {
					containoffsettop = $('.container')?$('.container').offset().top:0;
					$(_this).click();
				}).appendTo(wrapdiv);
			var showinput = $('<input type="text" readonly/>').addClass('search-input').appendTo(wrapdiv);
			if (placeholder && placeholder.length > 0)
				$(showinput).attr('placeholder', placeholder);
			$(_this).addClass('search-input').css('display', 'none').appendTo(wrapdiv);
			//默认值
			if (difid && difid.length > 0 && geturltype && geturltype.length > 0) {
				var difidArray = difid.split(',');
				for (var v = 0; v < difidArray.length; v++) {
					var search = searchgroub.getsearchdata(geturltype);
					var searchdata = {};
					searchdata[search.searchid] = difidArray[v];
					searchdata.page = 1;
					searchdata.rows = 20;
					searchdata.paramsType = paramsType;
					$.post(search.url, searchdata, function (d) {
						for (var v = 0; v < d.length; v++) {
							var defspan = $('<span></span>').addClass('search-checked').appendTo(list);
							// if(disabled)$(defspan).css('color','#969696');
							var defhtml = '';
							if (search.showcode) {
								for (var code = 0; code < search.showcode.length; code++) {
									if(typeof($(_this).attr("paramsType")) != "undefined" && $(_this).attr("paramsType").toLowerCase() == "Labour".toLowerCase()){
										if(code == 1) break;
									}
									if (code > 0) defhtml += ' ';
									defhtml += d[v][search.showcode[code]];
								}
							}
							defspan.html(defhtml);
						}
						var wrapwidth = wrapdiv.width();
						var titlewidth = (title && title.length > 0) ? titlespan.width() : 0;
						var checkedwidth = list.width();
						$(showinput).css('width', (wrapwidth - titlewidth - checkedwidth - 42) + 'px')
					}, 'json')
				}
			}
			var searchinput = $(_this).parent().find('input.search-input').eq(0);
			if(difid && difid.length > 0)
				$(searchinput).css('display','none');
			else
				$(searchinput).css('display','block');
		}else{
			var wrapdiv = $(_this).parent('.wrap-div');
			var titlespan = "";
			if (title && title.length > 0)
				titlespan = $(wrapdiv).find('.title').css({
					'font-weight': 'bold',
					'float': 'left'
				}).text(title + ':');
			var list = $(wrapdiv).find('.checked-list');
			if(!disabled)
				$(wrapdiv).find('.icon-zidiansousuo').css({
					'position': 'absolute',
					'top': '8px',
					'right': '1px',
					'font-size': '25px',
					'color': '#2dcc70'
				}).on('click', function () {
					containoffsettop = $('.container')?$('.container').offset().top:0;
					//$(_this).click();
				});
			var showinput = $(wrapdiv).find('.search-input').eq(0);
			if (placeholder && placeholder.length > 0)
				$(showinput).attr('placeholder', placeholder);
			$(_this).addClass('search-input').css('display', 'none').appendTo(wrapdiv);
			//默认值
			if (difid && difid.length > 0 && geturltype && geturltype.length > 0) {
				var difidArray = difid.split(',');
				for (var v = 0; v < difidArray.length; v++) {
					var search = searchgroub.getsearchdata(geturltype);
					var searchdata = {};
					searchdata[search.searchid] = difidArray[v];
					searchdata.page = 1;
					searchdata.rows = 20;
					searchdata.paramsType = paramsType;
					$.post(search.url, searchdata, function (d) {
						$(_thisparent).find('.checked-list').empty();
						for (var v = 0; v < d.length; v++) {
							var defspan = $('<span></span>').addClass('search-checked').appendTo(list);
							// if(disabled)$(defspan).css('color','#969696');
							var defhtml = '';
							if (search.showcode) {
								for (var code = 0; code < search.showcode.length; code++) {
									if(typeof(paramsType) != "undefined" && paramsType.toLowerCase() == "Labour".toLowerCase()){
										if(code == 1) break;
									}
									if (code > 0)defhtml += ' '
									defhtml += d[v][search.showcode[code]];
								}
							}
							defspan.html(defhtml);
						}
						var wrapwidth = wrapdiv.width();
						var titlewidth = (title && title.length > 0) ? titlespan.width() : 0;
						var checkedwidth = list.width();
						$(showinput).css('width', (wrapwidth - titlewidth - checkedwidth - 42) + 'px')
					}, 'json')
				}
			}
			var searchinput = $(_this).parent().find('input.search-input').eq(0);
			if(difid && difid.length > 0)
				$(searchinput).css('display','none');
			else
				$(searchinput).css('display','block');
		};
	}
};
//滑动加载
(function(){
	myScroll = '';
	var Moveload = function(conf){
		var opt = {
			bindId: '',
			upId: '',
			downId: '',
			upcallback: function(){},
			downcallback: function(){}
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
					if (this.y > 5 && !pullDownEl.className.match('flip')) {
						pullDownEl.className = 'flip';
						//$(pullDownEl).find('.pullDownLabel').text('松手开始更新...');
						this.minScrollY = 0;
					} else if (this.y < 5 && pullDownEl.className.match('flip')) {
						pullDownEl.className = '';
						//$(pullDownEl).find('.pullDownLabel').text('下拉刷新...');
						this.minScrollY = -pullDownOffset;
					} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip';
						//$(pullUpEl).find('.pullUpLabel').text('松手开始更新...');
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
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
			if(document.getElementById(opt.bindId)!=null) {
				setTimeout(function () {
					document.getElementById(opt.bindId).style.left = '0';
				}, 800);
			}
		};
		//初始化绑定iScroll控件
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		//document.addEventListener('DOMContentLoaded', loaded, false);
		return loaded;
	};
	window.moveload = function(conf){
		new Moveload(conf)();
	}
})();

//搜索
(function(){
	//字典配置
	var searchopt = {
		url: '',
		data: {},
		//defaultdata:[],//默认值
		maxNum: 1,//最大选项个数
		minNum: 1,//最小选项个数
		id: '',//
		title: '',//展示字段
		toptitle:'标题',//弹框标题
		desc: '',//展示字段2
		code: '',
		downvalue: '',//2排展示字段
		rowdown: '',//2排标题
		searchKey: 'searchKey',
		rows: 20,
		isAddRow: false,//是否可以添加临时数据,
		callback: function(){

		}
	};

	var optclone = {};
	optclone.data = {};
	var downloadend = '没有更多了...';
	var downloading = '下拉加载更多...';
	var lastcount = 0;
	var scrWidth = window.screen.availWidth;
	var scrHeight = window.screen.availHeight;
	var resultParam = [];
	var _this;
	optclone.data.page = 1;
	optclone.data.rows = searchopt.rows;
	//滑动加载配置
	var c = {
		bindId: 'sort-box-wrap',
		upId: 'pullDown',
		downId: 'pullUp',
		//上拉加载
		upcallback: function(){
			optclone.data.page++;
			if(optclone.data.page==1)return;
			if(lastcount==optclone.rows) {
				$.posts(searchgroub.getsearchdata(optclone.urlType).url, optclone.data, function (d) {
					lastcount = d.length;
					for (var v = 0; v < d.length; v++) {
						if(d[v])
						createrow(d[v], $('.sort_box'), $('.top-right'));
					}
					myScroll.refresh();
				}, 'json')
			}else{
				$('#pullUp').find('.pullUpLabel').html(downloadend);
			}
		},
		//下拉刷新
		downcallback: function(){
			optclone.data.page = 0;
		}
	};

	//请求URL加载数据
	var request = function(conf){
		optclone = $.extend(true,{},searchopt,conf);
		if(optclone.moduleId){
			$.ajax({
				type : "post",
				url : "/public/baseSet/tempDic/getTempDicState.do",
				data : {moduleId : moduleId},
				dataType : "json",
				async : false,
				success : function(msg){
                    optclone.isAddRow=msg.tempDicState===1;
				}
			});
		}
		resultParam = [];
		optclone.data.page = 1;
		optclone.data.rows = optclone.rows;
		optclone.data[optclone.searchKey] = '';
		$.posts(searchgroub.getsearchdata(optclone.urlType).url,optclone.data,function(d){
			if(d[0]==null){
				d=[];
			}
			lastcount = d.length;
			initData(d);
		},'json')
	};
	//创建列表
	var initData = function(data){
		//搜索头部信息
		var searchDic = $('<div></div>').attr('id', 'searchDicDialog').appendTo('body');
		if(optclone.data.isHP && optclone.data.isHP == 1) {
			$('body').css('height', (optclone.data.hpheight-51) + 'px');
			$(searchDic).css({'height': (optclone.data.hpheight-51) + 'px','width': (optclone.data.hpwidth) + 'px'});
		}
		var top = $('<div></div>').attr('id', 'top').appendTo(searchDic);
		var topc = $('<div></div>').addClass('top').html(optclone.toptitle).appendTo(top);
		//头部返回按钮
		$('<div>取消</div>').addClass('top-left')
			.bind('click', function () {
				searchDic.remove();
				for (var h = 0; h < hidenode.length; h++) {
					$(hidenode).css('display', 'block');
				}
			})
			.appendTo(topc);
		//头部确定按钮
		var topright = $('<div>确定(0)</div>').addClass('top-right').addClass('display-none')
			.on('click', function () {
				optclone.callback(resultParam, _this,optclone,this);
				if(typeof optclone.isend != 'undefined' && optclone.isend){
					optclone.isend = false;
					return;
				}
				for (var h = 0; h < hidenode.length; h++) {
					$(hidenode).css('display', 'block');
				}
				$('.container')?$('.container').animate({'top':containoffsettop},0):'';
				createchecked(_this.parent());
				searchDic.remove();
			})
			.appendTo(topc);
		var searchdiv = $('<div></div>').attr("id", "search-div").appendTo(searchDic);
		var sousuodiv = $('<div></div>').addClass('esg-font icon-sousuo').css({
			'position': 'absolute',
			'top': '12px',
			'left': '10px',
			'font-size': '20px'
		}).appendTo(searchdiv);
		//重置
		$('<div></div>').addClass('esg-font icon-zhongzhi').css({
			'position': 'absolute',
			'top': '13px',
			'right': '12px',
			'z-index': '1000',
			'font-size': '25px'
			//'display': 'none'
		}).on('click', function () {
			$(topright).html('确定(0)');
			$(searchinput).val('');
			resultParam = [];
			SortBox.empty();
			$(SortBox).parent().css({'transform': 'translate(0px, -40px) scale(1) translateZ(0px)'});
			$(sousuodiv).show();
			optclone.data.page = 1;
			optclone.data[optclone.searchKey] = '';
			$.posts(searchgroub.getsearchdata(optclone.urlType).url, optclone.data, function (d) {
				lastcount = d.length;
				for (var v = 0; v < d.length; v++) {
					if(d[v])
					createrow(d[v], SortBox, topright);
				}
				if (d.length == optclone.rows)downloaddesc.html(downloading);
				else downloaddesc.html(downloadend);
			}, 'json')
		}).appendTo(searchdiv);
		var searchinputdiv = $('<div></div>').addClass("search-child-div").appendTo(searchdiv);
		var searchinput = $('<input type="text"/>').addClass("search-input").attr('placeholder', '    搜索模版关键词')
			.on('input propertychange', function () {
				$(topright).html('确定('+resultParam.length+')');
				//resultParam = [];
				SortBox.empty();
				$(SortBox).parent().css({'transform': 'translate(0px, -40px) scale(1) translateZ(0px)'});
				var inputdesc = $.trim($(this).val()).toUpperCase();
				if (inputdesc && inputdesc.length > 0)
					$(sousuodiv).hide();
				else
					$(sousuodiv).show();
				optclone.data.page = 1;
				optclone.data[optclone.searchKey] = inputdesc;
				$.posts2(searchgroub.getsearchdata(optclone.urlType).url, optclone.data, function (d) {
					if(optclone.isAddRow) {
						if (d.length == 0) {
							createAddBtn(SortBox, topright);
						} else {
							delAddBtn(SortBox);
						}
					}
					for (var v = 0; v < d.length; v++) {
						if(d[v])
							createrow(d[v], SortBox, topright);
					}
					if (d.length == optclone.rows)downloaddesc.html(downloading);
					else downloaddesc.html(downloadend);
				}, 'json');
			}).appendTo(searchinputdiv);
		//加载数据
		var sortboxdiv = $('<div></div>').attr("id", "sort-box-wrap")
			.css({
				'width': scrWidth + 'px',
				'height': (scrHeight - 96) + 'px'
			}).appendTo(searchDic);
		//横屏页面处理
		if(optclone.data.isHP && optclone.data.isHP == 1) {
			$(sortboxdiv).height((optclone.data.hpheight - 51) + 'px');
			$(sortboxdiv).width((optclone.data.hpwidth) + 'px');
		}
		var mustdiv = $('<div></div>').appendTo(sortboxdiv);
		var pulldown = $('<div></div>').attr("id", "pullDown").appendTo(mustdiv);
		$('<span></span>').addClass("pullDownIcon").appendTo(pulldown);
		$('<span></span>').addClass("pullDownLabel").appendTo(pulldown);
		var SortBox = $('<div></div>').addClass("sort_box").appendTo(mustdiv);
		for (var da = 0; da < data.length; da++) {
			createrow(data[da], SortBox, topright);
		}
		if(data.length==0 && optclone.isAddRow){
			createAddBtn(SortBox, topright);
		}
		var pullup = $('<div></div>').attr("id", "pullUp").appendTo(mustdiv);
		$('<span></span>').addClass("pullUpIcon").appendTo(pullup);
		var downloaddesc = $('<span></span>').addClass("pullUpLabel").appendTo(pullup);
		if (data.length == optclone.rows)downloaddesc.html(downloading);
		else downloaddesc.html(downloadend);
		moveload(c);
	};
	//临时字典添加按钮
	var createAddBtn = function (SortBox,topright) {
		if($('.add-btn').length==0) {
			$('<div></div>').addClass('add-btn').html(optclone.data.addBtnDesc?optclone.data.addBtnDesc:'新增字典')
				.on('click', function () {
					var colData;
					if(optclone.data.colData){
                        colData = optclone.data.colData;
					}else {
                        var treeKind = optclone.data.paramsType;
                        var name = "";
                        var pro = "规格型号";
                        if ("Meterial".equalsIgnoreCase(treeKind)) {
                            name = "材料";
                        } else if ("Labour".equalsIgnoreCase(treeKind)) {
                            name = "劳务";
                            pro = '工作内容';
                        } else if ("Sanction".equalsIgnoreCase(treeKind)) {
                            name = "奖罚";
                            pro = '奖罚内容';
                        } else if ("Lease".equalsIgnoreCase(treeKind)) {
                            name = "租赁";
                        } else if ("Machine".equalsIgnoreCase(treeKind)) {
                            name = "机械";
                        } else if ("Fee".equalsIgnoreCase(treeKind)) {
                            name = "间接费";
                        }
                        colData = [{
                            name: 'dicName', title: name + '名称', isMust: true, type: 'input'
                        }, {
                            name: 'dicPro', title: pro, isMust: false, type: 'input'
                        }, {
                            name: 'unitId', title: '计量单位', isMust: true, type: 'select'
                        }, {
                            name: 'comment', title: '备注', isMust: false, type: 'input'
                        }];
                    }
					createAddDialog(colData,SortBox,topright);
				}).appendTo(SortBox);
		}
	};
	//临时字典添加弹出框
	var createAddDialog = function (data,SortBox,topright) {
		var addDialog = $('<div></div>').addClass('add-dialog').appendTo('body');
		var dialogTop = $('<div></div>').addClass('dialog-top').html(optclone.data.addBtnDesc?optclone.data.addBtnDesc:'新增字典').appendTo(addDialog);
		$('<div>取消</div>').addClass('dialog-top-left')
			.on('click', function () {
				$(addDialog).remove();
			}).appendTo(dialogTop);
		var dialogBody = $('<div></div>').addClass('dialog-body').appendTo(addDialog);
		for(var v=0;v<data.length;v++) {
			var dialogBodyVal = $('<div></div>').addClass('dialog-body-val').appendTo(dialogBody);
			var dialogBodyValDiv = $('<div></div>').addClass('dialog-body-val-div').appendTo(dialogBodyVal);
			var placeholder = '输入'+data[v].title;
			if(data[v].isMust)placeholder+='(必填)';
			if(data[v].type=='input') {
				$('<input type="text" />').attr({
					'name': data[v].name,
					'placeholder': placeholder
				}).appendTo(dialogBodyValDiv);
			}else if(data[v].type=='select'){
				var selUnit = $('<select></select>').addClass('unit').attr({'name':data[v].name}).appendTo(dialogBodyValDiv);
                $.post('/public/unit/getAllUnit.do',{b: true}, function (unitList) {
					for(var a=0;a<unitList.length;a++) {
						$('<option value="'+unitList[a].unitId+'">'+unitList[a].nameCn+(unitList[a].nameEn?'('+unitList[a].nameEn+')':'')+'</option>').appendTo(selUnit);
					}
                    $(selUnit).mobiscroll().select({display: 'bottom'});
                },'json')
			}
			$('<div></div>').addClass('dialog-body-name').text(data[v].title+':').appendTo(dialogBody);
		}
		//TODO
		$('<div>确定</div>').addClass('dialog-foot')
			.on('click', function () {
				var paramData = {};
				for(var a=0;a<data.length;a++){
					var key = data[a].name;
					var value = $(addDialog).find(data[a].type+'[name="'+key+'"]').val();
					paramData[key] = value;
					if(data[a].type=='select'){
						var val = $(addDialog).find(data[a].type+'[name="'+key+'"]').prev().val();
						if(val.indexOf('(')!=-1){
							paramData['unitNameCn'] = val.substr(0,val.indexOf('('));
							paramData['unitNameEn'] =val.substr(val.indexOf('('),val.indexOf(')'));
						}else{
							paramData['unitNameCn'] = val;
							paramData['unitNameEn'] = "";
						}
					}
				}
				if(optclone.data.addBtnUrl){
					$.extend(true, paramData, optclone.data.addBtnData);
                    $.post(optclone.data.addBtnUrl, paramData, function (da) {
                        if (da.error == 0) {
                            createrow(da.data, SortBox, topright);
                            $(addDialog).remove();
                            delAddBtn(SortBox);
                        }
                    }, 'json')
				}else {
                    var dicCode = "";
                    switch (optclone.treeKind) {
                        case 'Meterial':
                            dicCode = 'CL';
                            break;
                        case 'Labour':
                            dicCode = 'LW';
                            break;
                        case 'Lease':
                            dicCode = 'ZL';
                            break;
                        case 'Machine':
                            dicCode = 'JXSB';
                            break;
                        case 'Fee':
                            dicCode = 'JJFY';
                            break;
                    }
                    paramData['dicCode'] = '-' + makePy(paramData['dicName'])[0] + '-' + makePy(paramData['dicPro'])[0];
                    paramData['treeKind'] = optclone.data.paramsType;
                    $.post('/app/dicinfo/action.jsp?action=addTemporaryNode', paramData, function (da) {
                        if (da.error == 0) {
                            da.data[''] = da.data;
                            createrow(da.data, SortBox, topright);
                            $(addDialog).remove();
                            delAddBtn(SortBox);
                        }
                        //console.log(da.data)
                    }, 'json')
                }
			}).appendTo(addDialog);
	};
	var delAddBtn = function (SortBox) {
		$(SortBox).find('.add-btn').remove();
	};
	//生成行对象
	var createrow = function(data,SortBox,topright){
		(function(d,SortBox,topright){
			var sortlist = $('<div></div>').addClass('row-dic')
				.bind('click',function(){
					if(typeof d.readonly != 'undefined' && d.readonly == '0'){

					}else {
						//取消选中
						if ($(this).find('.esg-font').hasClass('icon-xuanzhong')) {
							for (var c = 0; c < resultParam.length; c++) {
								if (resultParam[c][optclone.id] == d[optclone.id])
									resultParam.splice(c, 1);
							}
							$(this).find('.esg-font').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong').css({'color': '#ccc'});
							topright.html('确定' + '(' + resultParam.length + ')');

						}
						//选中
						else {
							if (optclone.maxNum != null && resultParam.length == optclone.maxNum && optclone.maxNum>1) {
								$.message('最多选' + optclone.maxNum + '个');
								return;
							}
							//单选
							if(optclone.maxNum == 1){
								resultParam.clear();
								resultParam.push(d);
								$(this).parent().find('.icon-xuanzhong').removeClass('icon-xuanzhong').addClass('icon-weixuanzhong').css({'color': '#ccc'});
								$(this).find('.esg-font').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong').css({'color': 'green'});
								$(topright).click();
							}else {
								var isHas = false;
								for (var c = 0; c < resultParam.length; c++) {
									if (resultParam[c][optclone.id] == d[optclone.id])
										isHas = true;
								}
								if (!isHas)
									resultParam.push(d);
								$(this).find('.esg-font').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong').css({'color': 'green'});
							}
							topright.html('确定' + '(' + resultParam.length + ')');
						}
						if (resultParam.length > 0)$(topright).removeClass('display-none');
						else $(topright).addClass('display-none');
					}
				}).appendTo(SortBox);
			var warpdiv = $('<div></div>').addClass('row-up').appendTo(sortlist);
			var titledesc = '';
			if(d[optclone.desc])titledesc='<span style="color:#ccc;">'+d[optclone.desc]+'</span>';
			$('<div></div>').addClass('row-title').html(d[optclone.title]+'&nbsp;'+titledesc).appendTo(warpdiv);
			//$('<span></span>').addClass('row-up-2').html(d.desc).appendTo(warpdiv);
			if(optclone.rowdown && optclone.rowdown!=null && optclone.rowdown.length>0) {
				$('<span></span>').addClass('row-down').html(optclone.rowdown+':').appendTo(sortlist);
				$('<span></span>').addClass('row-down').html(d[optclone.downvalue]).appendTo(sortlist);
			}
			$('<div></div>').addClass('esg-font icon-weixuanzhong')
				.css({
					'position': 'absolute',
					'top': '15px',
					'right': '10px',
					'font-size': '25px',
					'color': '#ccc'
				}).appendTo(sortlist);
			if(typeof d.readonly != 'undefined' && d.readonly == '0'){
				$(sortlist).css({'background':'#f0eff5'});
				$(sortlist).children(".row-down").css("color","#666");
				$(sortlist).find('.esg-font').removeClass('icon-weixuanzhong').removeClass('icon-xuanzhong');
			}
			if(typeof d.titleimg == 'undefined') {
                $(sortlist).css('padding-left', '5px');
			}else if(d.titleimg) {
                var titleim = $('<div></div>').addClass('fa fa-bookmark-o').addClass('row-img').appendTo(sortlist);
			}else {
                var titleim = $('<div></div>').addClass('fa fa-bookmark').addClass('row-img').appendTo(sortlist);
			}
			for(var r=0;r<resultParam.length;r++){
				if(resultParam[r][optclone.id]==d[optclone.id]) {
					$(sortlist).find('.esg-font').removeClass('icon-weixuanzhong').addClass('icon-xuanzhong').css({'color': 'green'});
				}
			}
		})(data,SortBox,topright)
	};
	//生成选中结果
	var createchecked = function(node){
		var searchinput = $(node).find('input.search-input');
		if(resultParam.length>0){
			$(searchinput).css('display','none');
		}else{
			$(searchinput).eq(0).css('display','block');
		}
		$(node).find('.checked-list').empty();
		var geturltype = $(_this).attr('urltype');
		var search = searchgroub.getsearchdata(geturltype);
		if(search && typeof search!=undefined) {
			for (var v = 0; v < resultParam.length; v++) {
				var defspan = $('<span></span>').addClass('search-checked').appendTo($(node).find('.checked-list'));
				var defhtml = '';
				if (search.showcode) {
					for (var code = 0; code < search.showcode.length; code++) {
						if(typeof(optclone.data.paramsType) != "undefined" && optclone.data.paramsType.toLowerCase() == "Labour".toLowerCase()){
							if(code == 1) break;
						}
						if (code > 0) defhtml += ' '
						defhtml += resultParam[v][search.showcode[code]];
					}
				}
				defspan.text(defhtml);
			}
		}
		var wrapwidth = $(node).width();
		var titlewidth = $(node).find('.title').width();
		var checkedwidth = $(node).find('.checked-list').width();
		$(searchinput).width((wrapwidth-titlewidth-checkedwidth-42)+'px');
		var resultIds = "";
		for(var v=0;v<resultParam.length;v++){
			if(v>0)resultIds += ",";
			resultIds += resultParam[v][optclone.id];
		}
		$(_this).val(resultIds);
	};
	var hidenode = [];
	$.fn.extend({
		createDic: function(conf){
			_this = this;
			conf.bindId = $(_this).attr('id');
			$('body').children().each(function(){
				if($(this).css('display')=='block'){
					hidenode.push(this);
					$(this).css('display','none');
				}
			});
			request(conf);
		}
	})
})(jQuery);

//默认input
window.onload = function(){
	$('[searchDic="true"]').each(function(e){
		(function(_this){
			searchgroub.resetfun($(_this));
		})(this)
	});
}
