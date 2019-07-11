!function(eiis,require,$,window,undefined){
    require.config({
        paths: {
            "jquery.gallery.swiper": ["/public/mobileImgSupport/js/swiper-4.3.3.min"],
            "jquery.gallery.hammer": ["/public/mobileImgSupport/js/hammer.min"],
            "jquery.gallery.sonic": ["/public/mobileImgSupport/js/sonic"]
        }
    });
    var gallery;
    if(eiis.browser.phone){
        EIIS.Common.loadCss("/public/mobileImgSupport/css/swiper-4.3.3.min.css");
        require(["jquery.gallery.swiper","jquery.gallery.hammer","jquery.gallery.sonic"], function (a,b,c) {
            !function(hm,sw,sc){
                var jQTemplate={
                    container : $('<div class="galleryContainer" style="display: none;">' +
                        '<div class="galleryPageInfo" style="display: none;"><span class="galleryActivePage">1</span>/<span class="galleryMaxPage"></span></div>'+
                        '<div class="galleryMask"></div>'+
                        '<div class="swiper-container">'+
                        '<div class="swiper-wrapper">'+
                        '</div>'+
                        '</div>'+
                        '</div>'),
                    $window : $(window),
                    $body : [],
                    maskOption : {
                        width: 100,
                        height: 100,
                        stepsPerFrame: 3,
                        trailLength: 1,
                        pointDistance: .01,
                        fps: 30,
                        step: 'fader',
                        strokeColor: '#4de2ff',
                        setup: function () {
                            this._.lineWidth = 6;
                        },
                        path: [
                            ['arc', 50, 50, 20, 360, 0]
                        ]
                    }
                };
                jQTemplate.maxHeight=jQTemplate.$window.height();
                jQTemplate.maxWidth=jQTemplate.$window.width();
                var interval=setInterval(function(){
                    if(jQTemplate.$body.length>0){
                        clearInterval(interval);
                    }
                    jQTemplate.$body=$(window.document.body);
                },10);
                gallery=function(param){
                    var self=this;
                    self.param=param || {urls : []};
                    self.pageing=false;
                    self.maxPage=0;
                    self.jqElement={container : jQTemplate.container.clone().css({
                        "width" : jQTemplate.maxWidth+"px",
                        "height" : jQTemplate.maxHeight+"px"
                    }).on("click",function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        self.hide();
                    }).appendTo(jQTemplate.$body)};
                    self.jqElement.galleryPageInfo=self.jqElement.container.find(".galleryPageInfo");
                    self.jqElement.galleryMask=self.jqElement.container.find(".galleryMask");
                    self.jqElement.galleryActivePage=self.jqElement.galleryPageInfo.find(".galleryActivePage");
                    self.jqElement.swiper=new sw(self.jqElement.container.find(".swiper-container"),{
                        on : {
                            touchMove : function(){
                                self.showPage();
                            },
                            touchEnd : function(){
                                self.hidePage();
                            },
                            slideChange : function(){
                                $(self.jqElement.swiper.slides[self.jqElement.swiper.previousIndex]).css("visibility","hidden").find(".imgContainer").hammerManager();
                                $(self.jqElement.swiper.slides[self.jqElement.swiper.activeIndex]).css("visibility","initial");
                                self.jqElement.galleryActivePage.text(self.jqElement.swiper.activeIndex+1);
                            }
                        }
                    });
                    var sonic=new sc(jQTemplate.maskOption);
                    self.jqElement.galleryMask.append($(sonic.canvas).css({
                        "left" : (jQTemplate.maxWidth/2-jQTemplate.maskOption.width/2)+"px",
                        "top" : (jQTemplate.maxHeight/2-jQTemplate.maskOption.height/2)+"px"
                    })).data("sonic",sonic).on("click",function(event){
                        event.preventDefault();
                        event.stopPropagation();
                    }).data("sonic",sonic);
                    sonic.play();
                    self.beforeBodyStyle=undefined;
                    self.init();
                };

                gallery.prototype={
                    init : function(){
                        var self=this;
                        self.show();
                        var urls=self.param.urls;
                        if(urls && urls.length>0){
                            for(var i=0;i<urls.length;i++){
                                self.putSlide(urls[i]);
                            }
                            self.jqElement.galleryPageInfo.find(".galleryMaxPage").text(urls.length);
                        }
                        if(self.param.activeIndex!==undefined && typeof self.param.activeIndex==="number"){
                            self.jqElement.swiper.slideTo(Math.abs(parseInt(self.param.activeIndex)), 500, false);
                            self.jqElement.galleryActivePage.text(self.param.activeIndex+1);
                            $(self.jqElement.swiper.slides[self.jqElement.swiper.activeIndex]).css("visibility","initial");
                        }
                    },
                    putSlide : function(url){
                        var self=this;
                        var slide=$('<div class="swiper-slide" style="visibility: hidden;"><div class="imgContainer"></div></div>');
                        var img=$('<img/>').on("load",function(){
                            var imgWidth=this.width;
                            var imgHeight=this.height;
                            var percent;
                            if(imgHeight>=jQTemplate.maxHeight && imgWidth>=jQTemplate.maxWidth){
                                if((imgHeight-jQTemplate.maxHeight)>(imgWidth-jQTemplate.maxWidth)){
                                    percent=jQTemplate.maxHeight/imgHeight;
                                    imgHeight=jQTemplate.maxHeight;
                                    imgWidth=imgWidth*percent;
                                }else{
                                    percent=jQTemplate.maxWidth/imgWidth;
                                    imgWidth=jQTemplate.maxWidth;
                                    imgHeight=imgHeight*percent;
                                }
                            }else if(imgHeight>=jQTemplate.maxHeight){
                                percent=jQTemplate.maxHeight/imgHeight;
                                imgHeight=jQTemplate.maxHeight;
                                imgWidth=imgWidth*percent;
                            }else if(imgWidth>=jQTemplate.maxWidth){
                                percent=jQTemplate.maxWidth/imgWidth;
                                imgWidth=jQTemplate.maxWidth;
                                imgHeight=imgHeight*percent;
                            }
                            slide.find(".imgContainer").animate({
                                "width" : imgWidth+"px",
                                "height" : imgHeight+"px",
                                "left" : (jQTemplate.maxWidth/2-imgWidth/2)+"px",
                                "top" : (jQTemplate.maxHeight/2-imgHeight/2)+"px"
                            },200,null,function(){
                                self.hideMask();
                            }).append(img).hammerManager();
                        }).attr("src",url);
                        self.jqElement.swiper.appendSlide(slide);
                    },
                    show : function(){
                        var self=this;
                        self.beforeBodyStyle=jQTemplate.$body.attr("style");
                        jQTemplate.$body.attr("style","overflow : hidden");
                        self.jqElement.container.show();
                    },
                    hide : function(){
                        var self=this;
                        if(self.beforeBodyStyle){
                            jQTemplate.$body.attr("style",self.beforeBodyStyle);
                        }else{
                            jQTemplate.$body.removeAttr("style");
                        }
                        self.jqElement.container.remove();
                    },
                    showMask : function(){
                        this.jqElement.galleryMask.show().data("sonic").play();
                    },
                    hideMask : function(){
                        this.jqElement.galleryMask.hide().data("sonic").stop();
                    },
                    showPage : function(){
                        var self=this;
                        if(!self.pageing){
                            self.jqElement.galleryPageInfo.show();
                            self.pageing=true;
                        }
                    },
                    hidePage : function(){
                        var self=this;
                        if(self.pageing){
                            self.jqElement.galleryPageInfo.hide();
                            self.pageing=false;
                        }
                    }
                };

                var HammerManager=function(ele,callback){
                    var self=this;
                    if($.isFunction(callback)){
                        self.callback=callback;
                    }
                    self.target=ele;
                    self.param={
                        startX : 0,
                        startY :0,
                        initAngle : 0,
                        initScale : 1,
                        preAngle : 0,
                        deltaAngle : 0,
                        tempAngleFlag : 0,
                        startRotateAngle : 0
                    };
                    self.transform={};
                    self.enable=true;
                    self.ticking=false;
                    self.mc=new hm.Manager(ele[0]);
                    self.target.data("hmInstance",self);
                    self.init();
                };

                HammerManager.prototype={
                    init : function(){
                        var self=this;
                        self.mc.add(new hm.Pan({ threshold: 0, pointers: 0 }));
                        self.mc.add(new hm.Rotate({ threshold: 0 })).recognizeWith(self.mc.get('pan'));
                        self.mc.add(new hm.Pinch({ threshold: 0 })).recognizeWith([self.mc.get('pan'), self.mc.get('rotate')]);
                        self.mc.on("hammer.input", function(ev) {
                            if(ev.isFinal) {
                                self.param.startX = self.transform.translate.x ;
                                self.param.startY = self.transform.translate.y ;
                            }
                        });
                        self.mc.on("panstart panmove",self.pan.bind(self));
                        self.mc.on("rotatestart rotatemove rotateend", self.rotate.bind(self));
                        self.mc.on("pinchstart pinchmove", self.pinch.bind(self));
                        self.resize();
                    },
                    resize : function(angle,callback){
                        var self=this;
                        if(angle!==undefined){
                            self.transform.angle=angle;
                            self.param.initAngle=angle;
                        }else{
                            self.transform = {
                                translate: { x: 0, y: 0 },
                                scale: 1,
                                angle: 0,
                                rx: 0,
                                ry: 0,
                                rz: 0
                            };
                            self.param.seinitAngle=0;
                            self.param.initScale=1;
                            self.param.startX=0;
                            self.param.startY=0;
                        }
                        self.requestElementUpdate();
                        callback=callback || self.callback;
                        if($.isFunction(callback)){
                            setTimeout(function(){
                                callback();
                            },16);
                        }
                    },
                    pan : function(ev){
                        var self=this;
                        if(!self.enabled){
                            return;
                        }
                        if(!ev.isFinal) {
                            self.transform.translate = {
                                x: self.param.startX + ev.deltaX,
                                y: self.param.startY + ev.deltaY
                            };
                            self.requestElementUpdate();
                        }
                    },
                    rotate : function(ev){
                        var self=this;
                        if(!self.enabled){
                            return;
                        }
                        if(ev.type==="rotatestart") {
                            self.param.startRotateAngle =  ev.rotation ;
                            self.param.tempAngleFlag = 0 ;
                        }
                        if(ev.type==="rotatemove"){
                            if(self.param.tempAngleFlag===0){
                                self.param.preAngle = self.param.startRotateAngle;
                                self.param.tempAngleFlag ++;
                            }else{
                                self.param.deltaAngle = ev.rotation - self.param.preAngle;
                                self.transform.rz = 1;
                                self.transform.angle =self.param.initAngle + self.param.deltaAngle;
                                self.requestElementUpdate();
                            }
                        }
                        if(ev.type==="rotateend"){
                            self.param.initAngle = self.transform.angle;
                        }
                    },
                    pinch : function(ev){
                        var self=this;
                        if(!self.enabled){
                            return;
                        }
                        if(ev.type==="pinchstart") {
                            self.param.initScale = self.transform.scale || 1;
                        }
                        self.transform.scale = self.param.initScale * ev.scale;
                        self.requestElementUpdate();
                    },
                    updateElementTransform : function(){
                        var self=this;
                        var value = [
                            'translate3d(' + self.transform.translate.x + 'px, ' + self.transform.translate.y + 'px, 0)',
                            'scale(' + self.transform.scale + ', ' + self.transform.scale + ')',
                            'rotate3d('+ self.transform.rx +','+ self.transform.ry +','+ self.transform.rz +','+  self.transform.angle + 'deg)'
                        ];
                        value = value.join(" ");
                        self.target.css({
                            webkitTransform : value,
                            mozTransform : value,
                            transform : value
                        });
                        self.ticking = false;
                    },
                    requestElementUpdate : function(){
                        var self=this;
                        if(!self.ticking) {
                            reqAnimationFrame(self.updateElementTransform.bind(self));
                            self.ticking = true;
                        }
                    },
                    disable : function(){
                        this.enable=false;
                    },
                    enabled : function(){
                        this.enable=true;
                    }
                };

                var reqAnimationFrame=(function () {
                    return window[hm.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();

                $.fn.extend({
                    hammerManager : function(callback){
                        this.each(function(){
                            var jqEle=$(this);
                            if(jqEle.data("hmInstance")!==undefined){
                                jqEle.data("hmInstance").resize(undefined,callback);
                            }else{
                                new HammerManager(jqEle,callback);
                            }
                        });
                    }
                });
            }(b,a,Sonic);
        });
    }else{
        require(["jquery.gallery.sonic"], function () {
            !function(sc){
                var jQTemplate={
                    container : $('<div class="galleryPcContainer" style="display: none;">' +
                                    '<div class="galleryMask" style="display: none;"></div>'+
                                    '<div class="galleryPcWrapper">' +
                                        '<div class="galleryTools">' +
                                            '<div class="galleryTooTop">' +
                                                '<span class="galleryImgName"></span>'+
                                                '<div class="galleryClose" title="关闭"><i class="iconfont icon-tuichu"></i></div>'+
                                            '</div>'+
                                            '<div class="galleryToolsRight">' +
                                                '<div class="gallerySwitchNext"><i class="esg-font icon-fanhui"></i></div>'+
                                            '</div>'+
                                            '<div class="galleryToolsDown">' +
                                                '<div class="galleryTs">' +
                                                    '<div class="galleryTsWrapper">' +
                                                        '<ul>' +
                                                            '<li class="galleryNar" title="缩小图片"><i class="iconfont icon-suoxiao"></i></li>'+
                                                            '<li class="galleryPercent">100%</li>'+
                                                            '<li class="galleryAmp" title="放大图片"><i class="iconfont icon-fangda"></i></li>'+
                                                            '<li class="gallerySourceSize" title="实际大小"><i class="iconfont icon-bili"></i></li>'+
                                                            '<li class="gallerySeparated"><div></div></li>'+
                                                            '<li class="galleryFll" title="查看全屏"><i class="iconfont icon-zuidahua"></i></li>'+
                                                            '<li class="galleryRotate" title="向右旋转"><i class="iconfont icon-shuaxin"></i></li>'+
                                                        '</ul>'+
                                                    '</div>' +
                                                '</div>'+
                                                '<div class="galleryList"></div>'+
                                            '</div>'+
                                            '<div class="galleryToolsLeft">' +
                                                '<div class="gallerySwitchPre"><i class="esg-font icon-fanhui"></i></div>' +
                                            '</div>'+
                                        '</div>'+
                                        '<div class="galleryEdge">' +
                                            '<div class="galleryEdgeTop"></div>'+
                                            '<div class="galleryEdgeRight"></div>'+
                                            '<div class="galleryEdgeDown"></div>'+
                                            '<div class="galleryEdgeLeft"></div>'+
                                            '<div class="galleryEdgeLeftTop"></div>'+
                                            '<div class="galleryEdgeLeftDown"></div>'+
                                            '<div class="galleryEdgeRightTop"></div>'+
                                            '<div class="galleryEdgeRightDown"></div>'+
                                        '</div>'+
                                        '<div class="galleryImg"></div>'+
                                        '<div class="gallerySmall">' +
                                            '<div class="gallerySmallWrapper">' +
                                                '<div class="gallerySmallClose" title="关闭"><i class="esg-font icon-guanbi"></i></div>'+
                                                '<div class="gallerySmallBox"></div>'+
                                                '<div class="gallerySmallImg"></div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'),
                    $window : $(window),
                    windowHeight : 0,
                    windowWidth : 0,
                    $document : $(window.document),
                    $body : [],
                    maskOption : {
                        width: 100,
                        height: 100,
                        stepsPerFrame: 3,
                        trailLength: 1,
                        pointDistance: .01,
                        fps: 30,
                        step: 'fader',
                        strokeColor: '#4de2ff',
                        setup: function () {
                            this._.lineWidth = 6;
                        },
                        path: [
                            ['arc', 50, 50, 20, 360, 0]
                        ]
                    },
                    minInitWidth : 810,
                    minInitHeight : 540,
                    scale : 1.2
                };
                var interval=setInterval(function(){
                    if(jQTemplate.$body.length>0){
                        clearInterval(interval);
                    }
                    jQTemplate.$body=$(window.document.body);
                },10);
                var percent,clientX,clientY,minusX,minusY,style,height,width,tempWidth,tempHeight,
                    changeStatus,tempX,tempY,tempImgWidth,tempImgHeight,temp,state,result,tempUrl,
                    stempWidth,stempHeight,stempImgWidth,stempImgHeight,minusWidth,minusHeight,
                    beforeWidth,beforeHeight,stempX,stempY;
                gallery=function(param){
                    var self=jQTemplate.$window.data("gallery");
                    if(self!==undefined){
                        self.hide();
                    }
                    self=this;
                    jQTemplate.$window.data("gallery",self);
                    self.param=param || {urls : []};
                    self.jqElement={
                        container : jQTemplate.container.clone().appendTo(jQTemplate.$body)
                    };
                    self.jqElement.galleryMask=self.jqElement.container.find(".galleryMask").data("sonic",new sc(jQTemplate.maskOption));
                    self.size={
                        containerHeight : 0,
                        containerWidth : 0,
                        imgHeight : 0,
                        imgWidth : 0,
                        sourceHeight : 0,
                        sourceWidth : 0,
                        smallWidth : 0,
                        smallHeight : 0,
                        boxWidth : 0,
                        boxHeight : 0,
                        beforeContainerWidth : 0,
                        beforeContainerHeight : 0
                    };
                    self.position={
                        x : 0,
                        y : 0,
                        imgX : 0,
                        imgY : 0,
                        imgRotate : 0,
                        smallLeft : 0,
                        smallRight : 0,
                        smallTop : 0,
                        smallDown : 0,
                        boxX : 0,
                        boxY : 0,
                        beforeX : 0,
                        beforeY : 0
                    };
                    self.state={
                        pre : true,
                        next : true,
                        nar : true,
                        amp : true,
                        sourceSize : true,
                        fll : true,
                        rotate : true,
                        small : false,
                        activeSmall : true,
                        imgList : false
                    };
                    self.imgCount=self.param.urls.length;
                    self.percent=undefined;
                    self.activeImg=undefined;
                    self.eventParam1=undefined;//容器移动
                    self.eventParam2=undefined;//容器左边缘拉升
                    self.eventParam3=undefined;//容器右边缘拉升
                    self.eventParam4=undefined;//容器上边缘拉升
                    self.eventParam5=undefined;//容器下边缘拉升
                    self.eventParam6=undefined;//容器左上边缘拉升
                    self.eventParam7=undefined;//容器左下边缘拉升
                    self.eventParam8=undefined;//容器右上边缘拉升
                    self.eventParam9=undefined;//容器右下边缘拉升
                    self.eventParam10=undefined;//小瓶黑框移动
                    self.eventParam11=undefined;//大屏图片移动
                    self.jqElement.galleryImgName=self.jqElement.container.find(".galleryImgName");
                    self.jqElement.galleryEdge=self.jqElement.container.find(".galleryEdge");
                    self.jqElement.galleryClose=self.jqElement.container.find(".galleryClose");
                    self.jqElement.gallerySwitchPre=self.jqElement.container.find(".gallerySwitchPre");
                    self.jqElement.gallerySwitchNext=self.jqElement.container.find(".gallerySwitchNext");
                    self.jqElement.galleryTs=self.jqElement.container.find(".galleryTs");
                    self.jqElement.galleryNar=self.jqElement.galleryTs.find(".galleryNar");
                    self.jqElement.galleryPercent=self.jqElement.galleryTs.find(".galleryPercent");
                    self.jqElement.galleryAmp=self.jqElement.galleryTs.find(".galleryAmp");
                    self.jqElement.gallerySourceSize=self.jqElement.galleryTs.find(".gallerySourceSize");
                    self.jqElement.galleryFll=self.jqElement.galleryTs.find(".galleryFll");
                    self.jqElement.galleryRotate=self.jqElement.galleryTs.find(".galleryRotate");
                    self.jqElement.galleryTooTop=self.jqElement.container.find(".galleryTooTop");
                    self.jqElement.galleryTooDown=self.jqElement.container.find(".galleryToolsDown");
                    self.jqElement.galleryImg=self.jqElement.container.find(".galleryImg");
                    self.jqElement.gallerySmall=self.jqElement.container.find(".gallerySmall");
                    self.jqElement.gallerySmallClose=self.jqElement.gallerySmall.find(".gallerySmallClose");
                    self.jqElement.gallerySmallBox=self.jqElement.gallerySmall.find(".gallerySmallBox");
                    self.jqElement.gallerySmallImg=self.jqElement.gallerySmall.find(".gallerySmallImg");
                    self.jqElement.galleryList=self.jqElement.container.find(".galleryList");
                    self.beforeBodyStyle=undefined;
                    self.cache={};
                    self.init();
                };

                gallery.prototype={
                    init : function(){
                        var self=this;
                        $(self.jqElement.galleryMask.data("sonic").canvas).appendTo(self.jqElement.galleryMask);
                        self.bindEvent();
                        self.show();
                        self.changeContainerSize(jQTemplate.minInitWidth,jQTemplate.minInitHeight,true);
                        self.slideTo(self.param.activeIndex || 0);
                        self.reCenter();
                    },
                    reCenter : function(){
                        var self=this;
                        if(self.size.containerWidth<jQTemplate.windowWidth){
                            tempX=(jQTemplate.windowWidth-self.size.containerWidth)/2;
                        }else{
                            tempX=0;
                        }
                        if(self.size.containerHeight<jQTemplate.windowHeight){
                            tempY=(jQTemplate.windowHeight-self.size.containerHeight)/2;
                        }else{
                            tempY=0;
                        }
                        self.changeContainerPosition(tempX,tempY);
                    },
                    displayImgSource : function(){
                        var self=this;
                        stempImgWidth=self.size.sourceWidth;
                        stempImgHeight=self.size.sourceHeight;
                        tempImgWidth=self.size.imgWidth;
                        tempImgHeight=self.size.imgHeight;
                        if(self.position.imgRotate===0 || self.position.imgRotate===180){
                            if(tempImgWidth!==stempImgWidth || tempImgHeight!==stempImgHeight){
                                if(stempImgWidth<=jQTemplate.windowWidth){
                                    if(stempImgWidth<=self.size.containerWidth){
                                        tempWidth=self.size.containerWidth;
                                    }else{
                                        tempWidth=stempImgWidth;
                                    }
                                }else{
                                    tempWidth=jQTemplate.windowWidth;
                                }
                                if(stempImgHeight<=jQTemplate.windowHeight){
                                    if(stempImgHeight<=self.size.containerHeight){
                                        tempHeight=self.size.containerHeight;
                                    }else{
                                        tempHeight=stempImgHeight;
                                    }
                                }else{
                                    tempHeight=jQTemplate.windowHeight;
                                }
                            }
                            self.changeContainerSize(tempWidth,tempHeight,true);
                            self.changeContainerPosition((jQTemplate.windowWidth-tempWidth)/2,(jQTemplate.windowHeight-tempHeight)/2);
                            self.changeImgSize(self.size.sourceWidth,self.size.sourceHeight);
                            self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,(self.size.containerHeight-self.size.imgHeight)/2,true);
                        }else{
                            if(tempImgWidth!==stempImgHeight || tempImgHeight!==stempImgWidth){
                                if(stempImgHeight<=jQTemplate.windowWidth){
                                    if(stempImgHeight<=self.size.containerWidth){
                                        tempWidth=self.size.containerWidth;
                                    }else{
                                        tempWidth=stempImgHeight;
                                    }
                                }else{
                                    tempWidth=jQTemplate.windowWidth;
                                }
                            }
                            if(stempImgWidth<=jQTemplate.windowHeight){
                                if(stempImgWidth<=self.size.containerHeight){
                                    tempHeight=self.size.containerHeight;
                                }else{
                                    tempHeight=stempImgWidth;
                                }
                            }else{
                                tempHeight=jQTemplate.windowHeight;
                            }
                            self.changeContainerSize(tempWidth,tempHeight,true);
                            self.changeContainerPosition((jQTemplate.windowWidth-tempWidth)/2,(jQTemplate.windowHeight-tempHeight)/2);
                            self.changeImgSize(self.size.sourceHeight,self.size.sourceWidth);
                            self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,(self.size.containerHeight-self.size.imgHeight)/2,true);
                        }
                    },
                    displayFull : function(){
                        var self=this;
                        self.beforeBodyStyle=jQTemplate.$body.attr("style");
                        jQTemplate.$body.attr("style","overflow : hidden;margin : 0;");
                        window.onresize();
                        if(self.imgCount>1){
                            self.putFullImgList();
                        }
                        self.state.fll=false;
                        self.position.beforeX=self.position.x;
                        self.position.beforeY=self.position.y;
                        self.size.beforeContainerWidth=self.size.containerWidth;
                        self.size.beforeContainerHeight=self.size.containerHeight;
                        self.changeContainerPosition(0,0);
                        self.changeContainerSize(jQTemplate.windowWidth,jQTemplate.windowHeight);
                        self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,(self.size.containerHeight-self.size.imgHeight)/2,true);
                        self.jqElement.galleryEdge.hide();
                        self.jqElement.galleryFll.attr("title","退出全屏").find("i")
                            .removeClass("icon-zuidahua").addClass("icon-tuichuquanping");
                    },
                    putFullImgList : function(index){
                        var self=this;
                        index=index || 0;
                        if(!self.state.imgList && index<self.imgCount){
                            temp=self.cache["_"+index];
                            if(temp===undefined){
                                tempUrl=self.param.urls[index];
                                var result={
                                    img : $('<img/>').on("load",function(){
                                        $(this).off("load");
                                        result.imgHeight=this.height;
                                        result.imgWidth=this.width;
                                        tempUrl=decodeURIComponent(tempUrl);
                                        result.imgName=tempUrl.substr(tempUrl.lastIndexOf("/")+1);
                                        self.cache["_"+index]=result;
                                        self.putFullImgList(index);
                                    }).attr("src",tempUrl),
                                    imgHeight : 0,
                                    imgWidth : 0,
                                    index : index
                                };
                            }else{
                                self.cache["_"+index].imgItem=$("<div class='galleryListImg'></div>").append(temp.img.clone().removeAttr("style")).append("<div></div>")
                                    .appendTo(self.jqElement.galleryList).on("mousedown",function(event){
                                        event.preventDefault();
                                        event.stopPropagation();
                                        self.slideTo(index);
                                    });
                                self.putFullImgList(index+1);
                            }
                        }else{
                            self.state.imgList=true;
                            self.jqElement.galleryList.find(".galleryListImgActive").removeClass("galleryListImgActive");
                            self.cache["_"+self.activeImg.index].imgItem.addClass("galleryListImgActive");
                        }
                    },
                    exitFull : function(){
                        var self=this;
                        self.state.fll=true;
                        self.changeContainerPosition(self.position.beforeX,self.position.beforeY);
                        self.changeContainerSize(self.size.beforeContainerWidth,self.size.beforeContainerHeight);
                        self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,(self.size.containerHeight-self.size.imgHeight)/2,true);
                        self.jqElement.galleryList.hide();
                        self.jqElement.galleryEdge.show();
                        self.jqElement.galleryFll.attr("title","查看全屏").find("i")
                            .removeClass("icon-tuichuquanping").addClass("icon-zuidahua");
                        self.jqElement.galleryTs.css("bottom","-3px");
                        self.jqElement.gallerySmall.css("bottom","2px");
                        if(self.beforeBodyStyle){
                            jQTemplate.$body.attr("style",self.beforeBodyStyle);
                        }else{
                            jQTemplate.$body.removeAttr("style");
                        }
                        window.onresize();
                    },
                    slideTo : function(index){
                        var self=this;
                        if(self.imgCount>0){
                            if(index<0){
                                index=0;
                            }else if(index>=self.imgCount){
                                index=self.imgCount-1;
                            }
                            if(index===0){
                                self.state.pre=false;
                                self.state.next=self.imgCount>1;
                            }else{
                                self.state.pre=true;
                            }
                            if((index+1)===self.imgCount){
                                self.state.next=false;
                                self.state.pre=self.imgCount>1;
                            }else{
                                self.state.next=true;
                            }
                            if(self.state.pre){
                                self.jqElement.gallerySwitchPre.attr("title",(index+1)+"/"+self.imgCount);
                            }else{
                                self.jqElement.gallerySwitchPre.attr("title","已经是第一张").removeClass("prepareSwitch");
                            }
                            if(self.state.next){
                                self.jqElement.gallerySwitchNext.attr("title",(index+1)+"/"+self.imgCount);
                            }else{
                                self.jqElement.gallerySwitchNext.attr("title","已经是最后一张").removeClass("prepareSwitch");
                            }
                            self.state.activeSmall=true;
                            self.state.small=false;
                            self.jqElement.gallerySmall.hide();
                            self.position.imgRotate=0;
                            self.buildImg(self.param.urls[index],index);
                            if(!self.state.fll){
                                self.jqElement.galleryList.find(".galleryListImgActive").removeClass("galleryListImgActive");
                                self.activeImg.imgItem.addClass("galleryListImgActive");
                            }
                        }
                    },
                    bindEvent : function(){
                        var self=this;
                        self.beforeWindowResize=window.onresize;
                        window.onresize=function(){
                            jQTemplate.windowHeight=jQTemplate.$window.height();
                            jQTemplate.windowWidth=jQTemplate.$window.width();
                            if(typeof self.beforeWindowResize==="function"){
                                self.beforeWindowResize();
                            }
                        };
                        window.onresize();
                        self.jqElement.container.on("contextmenu",function(){
                            return false;
                        }).on("mousewheel DOMMouseScroll",function (e) {
                            self.scaleImg(((e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||
                                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)))>0);
                            e.preventDefault();
                            return false;
                        });
                        self.jqElement.container.find(".galleryPcWrapper").on({
                            mousedown : function(event){
                                if(event.button===0){
                                    self.eventParam1={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeLeft").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam2={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeRight").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam3={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeTop").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam4={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeDown").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam5={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeLeftTop").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam6={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeLeftDown").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam7={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeRightTop").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam8={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.container.find(".galleryEdgeRightDown").on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam9={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        jQTemplate.$document.off("mousemove.gallery,mouseup.gallery").on({
                            "mousemove.gallery" : function(event){
                                if(self.state.fll && self.eventParam1){//container
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientY<0 || clientX>jQTemplate.windowWidth || clientY>jQTemplate.windowHeight){
                                        self.eventParam1=undefined;
                                    }else{
                                        self.changeContainerPosition(self.position.x+(clientX-self.eventParam1.startX),self.position.y+(clientY-self.eventParam1.startY));
                                        self.eventParam1={
                                            startX : clientX,
                                            startY : clientY
                                        };
                                    }
                                }else if(self.eventParam2){//containerLeft
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientX>jQTemplate.windowWidth){
                                        self.eventParam2=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam2.startX;
                                        result=self.changeContainerSize(self.size.containerWidth-minusX,self.size.containerHeight,false);
                                        if(result.x){
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX-(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam2={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam2=undefined;
                                        }
                                    }
                                }else if(self.eventParam3){//containerRight
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientX>jQTemplate.windowWidth){
                                        self.eventParam3=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam3.startX;
                                        result=self.changeContainerSize(self.size.containerWidth+minusX,self.size.containerHeight,false);
                                        if(result.x){
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX+(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam3={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam3=undefined;
                                        }
                                    }
                                }else if(self.eventParam4){//containerTop
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientY<0 || clientY>jQTemplate.windowHeight){
                                        self.eventParam4=undefined;
                                    }else{
                                        minusY=clientY-self.eventParam4.startY;
                                        result=self.changeContainerSize(self.size.containerWidth,self.size.containerHeight-minusY,false);
                                        if(result.y){
                                            self.changeContainerPosition(self.position.x,self.position.y+minusY);
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY-(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam4={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam4=undefined;
                                        }
                                    }
                                }else if(self.eventParam5){//containerDown
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientY<0 || clientY>jQTemplate.windowHeight){
                                        self.eventParam5=undefined;
                                    }else{
                                        minusY=clientY-self.eventParam5.startY;
                                        result=self.changeContainerSize(self.size.containerWidth,self.size.containerHeight+minusY,false);
                                        if(result.y){
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY+(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam5={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam5=undefined;
                                        }
                                    }
                                }else if(self.eventParam6){//containerLeftTop
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientY<0 || clientX>jQTemplate.windowWidth || clientY>jQTemplate.windowHeight){
                                        self.eventParam6=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam6.startX;
                                        minusY=clientY-self.eventParam6.startY;
                                        result=self.changeContainerSize(self.size.containerWidth-minusX,self.size.containerHeight-minusY,false);
                                        if(result.x && result.y){
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y+minusY);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX-(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY-(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(tempX,tempY,true);
                                            self.eventParam6={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.x){
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y);
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX-(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam6={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.y){
                                            self.changeContainerPosition(self.position.x,self.position.y+minusY);
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY-(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam6={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam6=undefined;
                                        }
                                    }
                                }else if(self.eventParam7){//containerLeftDown
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientY<0 || clientX>jQTemplate.windowWidth || clientY>jQTemplate.windowHeight){
                                        self.eventParam7=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam7.startX;
                                        minusY=clientY-self.eventParam7.startY;
                                        result=self.changeContainerSize(self.size.containerWidth-minusX,self.size.containerHeight+minusY,false);
                                        if(result.x && result.y){
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX-(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY+(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(tempX,tempY,true);
                                            self.eventParam7={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.x){
                                            self.changeContainerPosition(self.position.x+minusX,self.position.y);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX-(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam7={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.y){
                                            self.changeContainerPosition(self.position.x,self.position.y);
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY+(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam7={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam7=undefined;
                                        }
                                    }
                                }else if(self.eventParam8){//containerRightTop
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientY<0 || clientX>jQTemplate.windowWidth || clientY>jQTemplate.windowHeight){
                                        self.eventParam8=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam8.startX;
                                        minusY=clientY-self.eventParam8.startY;
                                        result=self.changeContainerSize(self.size.containerWidth+minusX,self.size.containerHeight-minusY,false);
                                        if(result.x && result.y){
                                            self.changeContainerPosition(self.position.x,self.position.y+minusY);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX+(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY-(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(tempX,tempY,true);
                                            self.eventParam8={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.x){
                                            self.changeContainerPosition(self.position.x,self.position.y);
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX+(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam8={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.y){
                                            self.changeContainerPosition(self.position.x,self.position.y+minusY);
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY-(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam8={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam8=undefined;
                                        }
                                    }
                                }else if(self.eventParam9){//containerRightDown
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(clientX<0 || clientY<0 || clientX>jQTemplate.windowWidth || clientY>jQTemplate.windowHeight){
                                        self.eventParam9=undefined;
                                    }else{
                                        minusX=clientX-self.eventParam9.startX;
                                        minusY=clientY-self.eventParam9.startY;
                                        result=self.changeContainerSize(self.size.containerWidth+minusX,self.size.containerHeight+minusY,false);
                                        if(result.x && result.y){
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX+(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY+(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(tempX,tempY,true);
                                            self.eventParam9={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.x){
                                            if(self.size.imgWidth>self.size.containerWidth){
                                                tempX=self.position.imgX+(minusX/2);
                                                if(tempX>0){
                                                    tempX=0;
                                                }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                                    tempX=(self.size.containerWidth-self.size.imgWidth);
                                                }
                                            }else{
                                                tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                            }
                                            self.changeImgPosition(tempX,self.position.imgY,true);
                                            self.eventParam9={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else if(result.y){
                                            if(self.size.imgHeight>self.size.containerHeight){
                                                tempY=self.position.imgY+(minusY/2);
                                                if(tempY>0){
                                                    tempY=0;
                                                }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                                    tempY=(self.size.containerHeight-self.size.imgHeight);
                                                }
                                            }else{
                                                tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                            }
                                            self.changeImgPosition(self.position.imgX,tempY,true);
                                            self.eventParam9={
                                                startX : clientX,
                                                startY : clientY
                                            };
                                        }else{
                                            self.eventParam9=undefined;
                                        }
                                    }
                                }else if(self.eventParam10){//boxMove
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    minusX=clientX-self.eventParam10.startX;
                                    minusY=clientY-self.eventParam10.startY;
                                    result=self.changeSmallPosition(self.position.boxX+minusX,self.position.boxY+minusY);
                                    if(result.x!==0){
                                        tempX=self.position.imgX+result.x*(self.size.imgWidth/self.size.smallWidth);
                                    }else{
                                        tempX=self.position.imgX;
                                    }
                                    if(result.y!==0){
                                        tempY=self.position.imgY+result.y*(self.size.imgHeight/self.size.smallHeight);
                                    }else{
                                        tempY=self.position.imgY;
                                    }
                                    self.changeImgPosition(tempX,tempY,false);
                                    self.eventParam10={
                                        startX : clientX,
                                        startY : clientY
                                    };
                                }else if(self.eventParam11){
                                    clientX=event.clientX;
                                    clientY=event.clientY;
                                    if(self.size.imgWidth>self.size.containerWidth || self.size.imgHeight>self.size.containerHeight){
                                        if(self.size.imgWidth>self.size.containerWidth){
                                            minusX=clientX-self.eventParam11.startX;
                                        }else{
                                            minusX=0;
                                        }
                                        if(self.size.imgHeight>self.size.containerHeight){
                                            minusY=clientY-self.eventParam11.startY;
                                        }else{
                                            minusY=0;
                                        }
                                        tempX=self.position.imgX+minusX;
                                        tempY=self.position.imgY+minusY;
                                        if(tempX>=0){
                                            tempX=self.position.imgX;
                                        }else{
                                            minusX=self.size.containerWidth-self.size.imgWidth;
                                            if(tempX<minusX){
                                                tempX=minusX;
                                            }
                                        }
                                        if(tempY>=0){
                                            tempY=self.position.imgY;
                                        }else{
                                            minusY=self.size.containerHeight-self.size.imgHeight;
                                            if(tempY<minusY){
                                                tempY=minusY;
                                            }
                                        }
                                        self.changeImgPosition(tempX,tempY,true);
                                        self.eventParam11={
                                            startX : clientX,
                                            startY : clientY
                                        };
                                    }else{
                                        self.eventParam11=undefined;
                                        self.eventParam1={
                                            startX : clientX,
                                            startY : clientY
                                        };
                                    }
                                }
                            },
                            "mouseup.gallery" : function(event){
                                if(event.button===0){
                                    self.eventParam1=undefined;
                                    self.eventParam2=undefined;
                                    self.eventParam3=undefined;
                                    self.eventParam4=undefined;
                                    self.eventParam5=undefined;
                                    self.eventParam6=undefined;
                                    self.eventParam7=undefined;
                                    self.eventParam8=undefined;
                                    self.eventParam9=undefined;
                                    self.eventParam10=undefined;
                                    self.eventParam11=undefined;
                                }
                            }
                        });
                        self.jqElement.galleryTooTop.on({
                            "mouseover" : function(){
                                if(self.timeout1!==undefined){
                                    clearTimeout(self.timeout1);
                                    self.timeout1=undefined;
                                }
                                self.jqElement.galleryTooTop.attr("style","background-color:rgba(0,0,0,0.2)");
                                self.animaShow(self.jqElement.galleryImgName);
                                self.animaShow(self.jqElement.galleryClose);
                            },
                            "mouseout" : function(){
                                self.jqElement.galleryTooTop.removeAttr("style");
                                self.animaHide(self.jqElement.galleryImgName);
                                self.animaHide(self.jqElement.galleryClose);
                            }
                        });
                        self.jqElement.galleryClose.on({
                            "mouseover" : function(){
                                self.jqElement.galleryClose.addClass("prepareClose");
                            },
                            "mouseout" : function(){
                                self.jqElement.galleryClose.removeClass("prepareClose");
                            },
                            "click" : function(){
                                self.hide();
                            }
                        });
                        self.jqElement.container.find(".galleryToolsLeft").on({
                            "mouseover" : function(){
                                self.animaShow(self.jqElement.gallerySwitchPre);
                            },
                            "mouseout" : function(){
                                self.animaHide(self.jqElement.gallerySwitchPre);
                            }
                        });
                        self.jqElement.container.find(".galleryToolsRight").on({
                            "mouseover" : function(){
                                self.animaShow(self.jqElement.gallerySwitchNext);
                            },
                            "mouseout" : function(){
                                self.animaHide(self.jqElement.gallerySwitchNext);
                            }
                        });
                        if(self.imgCount>1){
                            self.jqElement.gallerySwitchPre.on({
                                "mouseover" : function(){
                                    if(self.state.pre){
                                        self.jqElement.gallerySwitchPre.addClass("prepareSwitch");
                                    }
                                },
                                "mouseout" : function(){
                                    if(self.state.pre){
                                        self.jqElement.gallerySwitchPre.removeClass("prepareSwitch").removeClass("clickSwitch");
                                    }
                                },
                                "mousedown" : function(event){
                                    if(self.state.pre && event.button===0){
                                        event.stopPropagation();
                                        self.jqElement.gallerySwitchPre.addClass("clickSwitch");
                                    }
                                },
                                "mouseup" : function(event){
                                    if(self.state.pre && event.button===0){
                                        event.stopPropagation();
                                        self.jqElement.gallerySwitchPre.removeClass("clickSwitch");
                                        self.slideTo(self.activeImg.index-1);
                                    }
                                }
                            });
                            self.jqElement.gallerySwitchNext.on({
                                "mouseover" : function(){
                                    if(self.state.next){
                                        self.jqElement.gallerySwitchNext.addClass("prepareSwitch");
                                    }
                                },
                                "mouseout" : function(){
                                    if(self.state.next){
                                        self.jqElement.gallerySwitchNext.removeClass("prepareSwitch").removeClass("clickSwitch");
                                    }
                                },
                                "mousedown" : function(event){
                                    if(self.state.next && event.button===0){
                                        event.stopPropagation();
                                        self.jqElement.gallerySwitchNext.addClass("clickSwitch");
                                    }
                                },
                                "mouseup" : function(event){
                                    if(self.state.next && event.button===0){
                                        event.stopPropagation();
                                        self.jqElement.gallerySwitchNext.removeClass("clickSwitch");
                                        self.slideTo(self.activeImg.index+1);
                                    }
                                }
                            });
                        }else{
                            self.jqElement.gallerySwitchPre.parent().hide();
                            self.jqElement.gallerySwitchNext.parent().hide();
                        }
                        self.jqElement.galleryTooDown.on({
                            "mouseover" : function(){
                                if(self.timeout2!==undefined){
                                    clearTimeout(self.timeout2);
                                    self.timeout2=undefined;
                                }
                                if(!self.state.fll && self.imgCount>1){
                                    self.jqElement.galleryList.show();
                                    self.jqElement.galleryTs.css("bottom","47px");
                                    self.jqElement.gallerySmall.css("bottom","52px");
                                }
                                self.animaShow(self.jqElement.galleryTs);
                            },
                            "mouseout" : function(){
                                if(!self.state.fll && self.imgCount>1){
                                    self.jqElement.galleryList.hide();
                                    self.jqElement.galleryTs.css("bottom","-3px");
                                    self.jqElement.gallerySmall.css("bottom","2px");
                                }
                                self.animaHide(self.jqElement.galleryTs);
                            }
                        });
                        self.jqElement.galleryNar.on({
                            "mouseover" : function(){
                                if(self.state.nar){
                                    self.jqElement.galleryNar.addClass("prepareTs");
                                }
                            },
                            "mouseout" : function(){
                                if(self.state.nar){
                                    self.jqElement.galleryNar.removeClass("prepareTs").removeClass("galleryTsPress");
                                }
                            },
                            "mousedown" : function(event){
                                if(self.state.nar && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryNar.addClass("galleryTsPress");
                                }
                            },
                            "mouseup" : function(event){
                                if(self.state.nar && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryNar.removeClass("galleryTsPress");
                                    self.scaleImg(false);
                                }
                            }
                        });
                        self.jqElement.galleryAmp.on({
                            "mouseover" : function(){
                                if(self.state.amp){
                                    self.jqElement.galleryAmp.addClass("prepareTs");
                                }
                            },
                            "mouseout" : function(){
                                if(self.state.amp){
                                    self.jqElement.galleryAmp.removeClass("prepareTs").removeClass("galleryTsPress");
                                }
                            },
                            "mousedown" : function(event){
                                if(self.state.amp && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryAmp.addClass("galleryTsPress");
                                }
                            },
                            "mouseup" : function(event){
                                if(self.state.amp && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryAmp.removeClass("galleryTsPress");
                                    self.scaleImg(true);
                                }
                            }
                        });
                        self.jqElement.gallerySourceSize.on({
                            "mouseover" : function(){
                                if(self.state.sourceSize){
                                    self.jqElement.gallerySourceSize.addClass("prepareTs");
                                }
                            },
                            "mouseout" : function(){
                                if(self.state.sourceSize){
                                    self.jqElement.gallerySourceSize.removeClass("prepareTs").removeClass("galleryTsPress");
                                }
                            },
                            "mousedown" : function(event){
                                if(self.state.sourceSize && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.gallerySourceSize.addClass("galleryTsPress");
                                }
                            },
                            "mouseup" : function(event){
                                if(self.state.sourceSize && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.gallerySourceSize.removeClass("galleryTsPress");
                                    self.displayImgSource();
                                }
                            }
                        });
                        self.jqElement.galleryFll.on({
                            "mouseover" : function(){
                                self.jqElement.galleryFll.addClass("prepareTs");
                            },
                            "mouseout" : function(){
                                self.jqElement.galleryFll.removeClass("prepareTs").removeClass("galleryTsPress");
                            },
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryFll.addClass("galleryTsPress");
                                }
                            },
                            "mouseup" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryFll.removeClass("galleryTsPress");
                                    if(self.state.fll){
                                        self.displayFull();
                                    }else{
                                        self.exitFull();
                                    }
                                }
                            }
                        });
                        self.jqElement.galleryRotate.on({
                            "mouseover" : function(){
                                if(self.state.rotate){
                                    self.jqElement.galleryRotate.addClass("prepareTs");
                                }
                            },
                            "mouseout" : function(){
                                if(self.state.rotate){
                                    self.jqElement.galleryRotate.removeClass("prepareTs").removeClass("galleryTsPress");
                                }
                            },
                            "mousedown" : function(event){
                                if(self.state.rotate && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryRotate.addClass("galleryTsPress");
                                }
                            },
                            "mouseup" : function(event){
                                if(self.state.rotate && event.button===0){
                                    event.stopPropagation();
                                    self.jqElement.galleryRotate.removeClass("galleryTsPress");
                                    self.rotateImg();
                                }
                            }
                        });
                        self.jqElement.gallerySmallClose.on({
                            "mouseover" : function(){
                                self.jqElement.gallerySmallClose.addClass("gallerySmallClosePre");
                            },
                            "mouseout" : function(){
                                self.jqElement.gallerySmallClose.removeClass("gallerySmallClosePre");
                            },
                            "click" : function(){
                                self.state.activeSmall=false;
                                self.jqElement.gallerySmall.hide();
                            }
                        });
                        self.jqElement.gallerySmallBox.on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.stopPropagation();
                                    self.eventParam10={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.galleryImg.on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.preventDefault();
                                    event.stopPropagation();
                                    self.eventParam11={
                                        startX : event.clientX,
                                        startY : event.clientY
                                    };
                                }
                            }
                        });
                        self.jqElement.gallerySmallImg.on({
                            "mousedown" : function(event){
                                if(event.button===0){
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if(self.position.imgRotate===0){
                                        clientX=event.offsetX;
                                        clientY=event.offsetY;
                                    }else if(self.position.imgRotate===90){
                                        clientX=self.size.smallWidth-event.offsetY;
                                        clientY=event.offsetX;
                                    }else if(self.position.imgRotate===180){
                                        clientX=self.size.smallWidth-event.offsetX;
                                        clientY=self.size.smallHeight-event.offsetY;
                                    }else{
                                        clientX=event.offsetY;
                                        clientY=self.size.smallHeight-event.offsetX;
                                    }
                                    tempWidth=self.size.smallWidth/2;
                                    tempHeight=self.size.smallHeight/2;
                                    minusX=self.size.boxWidth/2;
                                    minusY=self.size.boxHeight/2;
                                    if(clientX<=tempWidth){
                                        if(minusX>=clientX){
                                            tempX=self.position.smallLeft;
                                        }else{
                                            tempX=clientX-minusX+self.position.smallLeft;
                                        }
                                    }else{
                                        if(minusX>=self.size.smallWidth-clientX){
                                            tempX=self.position.smallRight-self.size.boxWidth;
                                        }else{
                                            tempX=clientX-minusX+self.position.smallLeft;
                                        }
                                    }
                                    if(clientY<=tempHeight){
                                        if(minusY>=clientY){
                                            tempY=self.position.smallTop;
                                        }else{
                                            tempY=clientY-minusY+self.position.smallTop;
                                        }
                                    }else{
                                        if(minusY>=self.size.smallHeight-clientY){
                                            tempY=self.position.smallDown-self.size.boxHeight;
                                        }else{
                                            tempY=clientY-minusY+self.position.smallTop;
                                        }
                                    }
                                    minusX=tempX-self.position.boxX;
                                    minusY=tempY-self.position.boxY;
                                    changeStatus=self.changeSmallPosition(tempX,tempY);
                                    if(changeStatus.x!==0){
                                        tempX=self.position.imgX+(changeStatus.x)*(self.size.imgWidth/self.size.smallWidth);
                                    }else{
                                        tempX=self.position.imgX;
                                    }
                                    if(changeStatus.y!==0){
                                        tempY=self.position.imgY+(changeStatus.y)*(self.size.imgHeight/self.size.smallHeight);
                                    }else{
                                        tempY=self.position.imgY;
                                    }
                                    self.changeImgPosition(tempX,tempY,false);
                                }
                            }
                        });
                    },
                    buildImg : function(url,index){
                        var self=this;
                        var imgItem=self.cache["_"+index];
                        if(imgItem===undefined){
                            imgItem={
                                img : $('<img/>').on("load",function(){
                                    $(this).off("load");
                                    imgItem.imgHeight=this.height;
                                    imgItem.imgWidth=this.width;
                                    url=decodeURIComponent(url);
                                    imgItem.imgName=url.substr(url.lastIndexOf("/")+1);
                                    self.putSlide(imgItem);
                                    self.cache["_"+index]=imgItem;
                                }).attr("src",url),
                                imgHeight : 0,
                                imgWidth : 0,
                                index : index
                            };
                        }else{
                            self.putSlide(imgItem);
                        }
                    },
                    putSlide : function(imgItem){
                        var self=this;
                        self.activeImg=imgItem;
                        self.size.sourceHeight=imgItem.imgHeight;
                        self.size.sourceWidth=imgItem.imgWidth;
                        if(self.position.imgRotate===0 || self.position.imgRotate===180){
                            tempImgWidth=imgItem.imgWidth;
                            tempImgHeight=imgItem.imgHeight;
                            state=true;
                        }else{
                            tempImgWidth=imgItem.imgHeight;
                            tempImgHeight=imgItem.imgWidth;
                            state=false;
                        }
                        if(tempImgHeight<=self.size.containerHeight && tempImgWidth<=self.size.containerWidth){
                            self.changeImgSize(tempImgWidth,tempImgHeight);
                            self.changeImgPosition((self.size.containerWidth-tempImgWidth)/2,(self.size.containerHeight-tempImgHeight)/2,false);
                        }else if(tempImgHeight>=self.size.containerHeight && tempImgWidth>=self.size.containerWidth){
                            if(tempImgWidth>tempImgHeight){
                                percent=self.size.containerWidth/tempImgWidth;
                                self.changeImgSize(self.size.containerWidth,tempImgHeight*percent);
                                self.changeImgPosition(0,(self.size.containerHeight-self.size.imgHeight)/2,false);
                            }else{
                                percent=self.size.containerHeight/tempImgHeight;
                                self.changeImgSize(tempImgWidth*percent,self.size.containerHeight);
                                self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,0,false);
                            }
                        }else if(tempImgHeight>=self.size.containerHeight){
                            percent=self.size.containerHeight/tempImgHeight;
                            self.changeImgSize(tempImgWidth*percent,self.size.containerHeight);
                            self.changeImgPosition((self.size.containerWidth-self.size.imgWidth)/2,0,false);
                        }else{
                            percent=self.size.containerWidth/tempImgWidth;
                            self.changeImgSize(self.size.containerWidth,tempImgHeight*percent);
                            self.changeImgPosition(0,(self.size.containerHeight-self.size.imgHeight)/2,false);
                        }
                        if(state){
                            style="translate("+0+"px,"+0+"px) rotate("+self.position.imgRotate+"deg)";
                        }else{
                            temp=(self.size.imgWidth-self.size.imgHeight)/2;
                            style="translate("+temp+"px,"+(-1*temp)+"px) rotate("+self.position.imgRotate+"deg)";
                        }
                        self.activeImg.smallImg=imgItem.img.css({
                            webkitTransform : style,
                            mozTransform : style,
                            transform : style
                        }).appendTo(self.jqElement.galleryImg.empty()).clone();
                        self.jqElement.galleryImgName.text(imgItem.imgName);
                        self.putSmallImg();
                        self.showHideSmall(undefined,undefined,true);
                    },
                    resizeSlide : function(){
                        var self=this;
                        self.putSlide(self.activeImg);
                    },
                    putSmallImg : function(){
                        var self=this;
                        tempImgWidth=250;
                        tempImgHeight=150;
                        if(self.position.imgRotate===0 || self.position.imgRotate===180){
                            width=self.size.sourceWidth;
                            height=self.size.sourceHeight;
                            temp=true;
                        }else{
                            width=self.size.sourceHeight;
                            height=self.size.sourceWidth;
                            temp=false;
                        }
                        if((width<=tempImgWidth && height<=tempImgHeight) || (width>=tempImgWidth && height>=tempImgHeight)){
                            if(width>height){
                                tempWidth=tempImgWidth;
                                tempHeight=(height*(tempImgWidth/width));
                            }else{
                                tempWidth=(width*(tempImgHeight/height));
                                tempHeight=tempImgHeight;
                            }
                        }else if(width>=tempImgWidth){
                            tempWidth=tempImgWidth;
                            tempHeight=(height*(tempImgWidth/width));
                        }else{
                            tempWidth=(width*(tempImgHeight/height));
                            tempHeight=tempImgHeight;
                        }
                        self.size.smallWidth=tempWidth;
                        self.size.smallHeight=tempHeight;
                        self.position.smallLeft=(tempImgWidth-tempWidth)/2;
                        self.position.smallRight=self.position.smallLeft+tempWidth-1;
                        self.position.smallTop=(tempImgHeight-tempHeight)/2;
                        self.position.smallDown=self.position.smallTop+tempHeight-1;
                        style="translate("+((tempImgWidth-tempWidth)/2)+"px,"+((tempImgHeight-tempHeight)/2)+"px)";
                        self.jqElement.gallerySmallImg.css({
                            width : tempWidth+"px",
                            height : tempHeight+"px",
                            webkitTransform : style,
                            mozTransform : style,
                            transform : style
                        }).empty().append(self.activeImg.smallImg);
                        if(temp){
                            style="translate(0px,0px) rotate("+self.position.imgRotate+"deg)";
                            self.activeImg.smallImg.css({
                                width : tempWidth+"px",
                                height : tempHeight+"px",
                                webkitTransform : style,
                                mozTransform : style,
                                transform : style
                            });
                        }else{
                            temp=(tempWidth-tempHeight)/2;
                            style="translate("+temp+"px,"+(-1*temp)+"px) rotate("+self.position.imgRotate+"deg)";
                            self.activeImg.smallImg.css({
                                width : tempHeight+"px",
                                height : tempWidth+"px",
                                webkitTransform : style,
                                mozTransform : style,
                                transform : style
                            });
                        }
                    },
                    scaleImg : function(state){
                        var self=this;
                        if(state){//放大
                            if(self.state.amp){
                                width=self.size.imgWidth;
                                height=self.size.imgHeight;
                                self.changeImgSize(self.size.imgWidth*jQTemplate.scale,self.size.imgHeight*jQTemplate.scale);
                                minusWidth=self.size.imgWidth-width;
                                minusHeight=self.size.imgHeight-height;
                                if(self.size.imgWidth>self.size.containerWidth){
                                    tempX=self.position.imgX-(minusWidth/2);
                                }else{
                                    tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                }
                                if(self.size.imgHeight>self.size.containerHeight){
                                    tempY=self.position.imgY-(minusHeight/2);
                                }else{
                                    tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                }
                                self.changeImgPosition(tempX,tempY,true);
                            }
                        }else{
                            if(self.state.nar){
                                width=self.size.imgWidth;
                                height=self.size.imgHeight;
                                self.changeImgSize(self.size.imgWidth/jQTemplate.scale,self.size.imgHeight/jQTemplate.scale);
                                minusWidth=self.size.imgWidth-width;
                                minusHeight=self.size.imgHeight-height;
                                if(self.size.imgWidth>self.size.containerWidth){
                                    tempX=self.position.imgX-(minusWidth/2);
                                    if(tempX>0){
                                        tempX=0;
                                    }else if(tempX<(self.size.containerWidth-self.size.imgWidth)){
                                        tempX=(self.size.containerWidth-self.size.imgWidth);
                                    }
                                }else{
                                    tempX=(self.size.containerWidth-self.size.imgWidth)/2;
                                }
                                if(self.size.imgHeight>self.size.containerHeight){
                                    tempY=self.position.imgY-(minusHeight/2);
                                    if(tempY>0){
                                        tempY=0;
                                    }else if(tempY<(self.size.containerHeight-self.size.imgHeight)){
                                        tempY=(self.size.containerHeight-self.size.imgHeight);
                                    }
                                }else{
                                    tempY=(self.size.containerHeight-self.size.imgHeight)/2;
                                }
                                self.changeImgPosition(tempX,tempY,true);
                            }
                        }
                    },
                    rotateImg : function(){
                        var self=this;
                        self.position.imgRotate+=90;
                        self.position.imgRotate=self.position.imgRotate>=360?0:self.position.imgRotate;
                        self.resizeSlide();
                    },
                    changeImgSize : function(width,height){
                        var self=this;
                        if(self.position.imgRotate===0 || self.position.imgRotate===180){
                            tempWidth=self.size.sourceWidth;
                            tempHeight=self.size.sourceHeight;
                            state=true;
                        }else{
                            tempWidth=self.size.sourceHeight;
                            tempHeight=self.size.sourceWidth;
                            state=false;
                        }
                        percent=(width/tempWidth*100).toFixed(0);
                        if(percent>90 && percent<110){
                            percent=100;
                            width=tempWidth;
                            height=tempHeight;
                        }else if(percent>1600){
                            percent=1600;
                            width=tempWidth*16;
                            height=tempHeight*16;
                        }else if(percent<5){
                            percent=5;
                            width=tempWidth/20;
                            height=tempHeight/20;
                        }
                        self.jqElement.galleryImg.css({
                            "height" : height+"px",
                            "width" : width+"px"
                        });
                        if(state){
                            style="translate("+0+"px,"+0+"px) rotate("+self.position.imgRotate+"deg)";
                            self.activeImg.img.css({
                                "height" : height+"px",
                                "width" : width+"px",
                                webkitTransform : style,
                                mozTransform : style,
                                transform : style
                            });
                        }else{
                            temp=(width-height)/2;
                            style="translate("+temp+"px,"+(-1*temp)+"px) rotate("+self.position.imgRotate+"deg)";
                            self.activeImg.img.css({
                                "height" : width+"px",
                                "width" : height+"px",
                                webkitTransform : style,
                                mozTransform : style,
                                transform : style
                            });
                        }
                        if(percent===100){
                            if(self.state.sourceSize){
                                self.state.sourceSize=false;
                                self.jqElement.gallerySourceSize.attr("title","当前已显示实际大小").addClass("galleryDisabled");
                            }
                        }else{
                            if(percent===1600){
                                self.state.amp=false;
                                self.jqElement.galleryAmp.addClass("galleryDisabled");
                            }else{
                                if(percent===5){
                                    self.state.nar=false;
                                    self.jqElement.galleryNar.addClass("galleryDisabled");
                                }else{
                                    if(!self.state.nar){
                                        self.state.nar=true;
                                        self.jqElement.galleryNar.removeClass("galleryDisabled");
                                    }
                                }
                                if(!self.state.amp){
                                    self.state.amp=true;
                                    self.jqElement.galleryAmp.removeClass("galleryDisabled");
                                }
                            }
                            if(!self.state.sourceSize){
                                self.state.sourceSize=true;
                                self.jqElement.gallerySourceSize.attr("title","实际大小").removeClass("galleryDisabled");
                            }
                        }
                        self.showHideSmall(width,height);
                        self.jqElement.galleryPercent.text(percent+"%");
                        self.size.imgWidth=width;
                        self.size.imgHeight=height;
                        self.percent=percent;
                    },
                    showHideSmall : function(width,height,state){
                        var self=this;
                        if(self.state.activeSmall){
                            width=width || self.size.imgWidth;
                            height=height || self.size.imgHeight;
                            stempWidth=self.size.containerWidth;
                            stempHeight=self.size.containerHeight;
                            if(width>stempWidth || height>stempHeight){
                                stempImgWidth=self.size.smallWidth;
                                stempImgHeight=self.size.smallHeight;
                                if(width<stempWidth){
                                    stempWidth=stempImgWidth;
                                    stempHeight=stempImgHeight/(height/stempHeight);
                                }else if(height<stempHeight){
                                    stempWidth=stempImgWidth/(width/stempWidth);
                                    stempHeight=stempImgHeight;
                                }else{
                                    stempWidth=stempImgWidth/(width/stempWidth);
                                    stempHeight=stempImgHeight/(height/stempHeight);
                                }
                                stempWidth-=1;
                                stempHeight-=1;

                                self.size.boxWidth=stempWidth;
                                self.size.boxHeight=stempHeight;
                                self.jqElement.gallerySmallBox.css({
                                    "width" : stempWidth+"px",
                                    "height" : stempHeight+"px"
                                });
                                if(state || !self.state.small){
                                    self.jqElement.gallerySmall.show();
                                    self.state.small=true;
                                    self.changeSmallPosition(((249-stempWidth)/2)-1,((149-stempHeight)/2)-1);
                                }
                            }else{
                                if(self.state.small){
                                    self.jqElement.gallerySmall.hide();
                                    self.state.small=false;
                                }
                            }
                        }
                    },
                    changeSmallPosition : function(x,y){
                        var self=this,result;
                        if(x<self.position.smallLeft){
                            x=self.position.smallLeft;
                        }
                        if(x+self.size.boxWidth>self.position.smallRight){
                            x=self.position.smallRight;
                        }
                        if(y<self.position.smallTop){
                            y=self.position.smallTop;
                        }
                        if(y+self.size.boxHeight>self.position.smallDown){
                            y=self.position.smallDown;
                        }
                        if(x>=self.position.smallLeft && x+self.size.boxWidth<=self.position.smallRight && y>=self.position.smallTop && y+self.size.boxHeight<=self.position.smallDown){
                            self.jqElement.gallerySmallBox.css({
                                left : x+"px",
                                top : y+"px"
                            });
                            result={
                                x : self.position.boxX-x,
                                y : self.position.boxY-y
                            };
                            self.position.boxX=x;
                            self.position.boxY=y;
                        }else if(x>=self.position.smallLeft && x+self.size.boxWidth<=self.position.smallRight){
                            self.jqElement.gallerySmallBox.css({
                                left : x+"px"
                            });
                            result={
                                x : self.position.boxX-x,
                                y : 0
                            };
                            self.position.boxX=x;
                        }else if(y>=self.position.smallTop && y+self.size.boxHeight<=self.position.smallDown){
                            self.jqElement.gallerySmallBox.css({
                                top : y+"px"
                            });
                            result={
                                x : 0,
                                y : self.position.boxY-y
                            };
                            self.position.boxY=y;
                        }else{
                            result={
                                x : 0,
                                y : 0
                            };
                        }
                        return result;
                    },
                    changeImgPosition : function(x,y,state){
                        var self=this;
                        style="translate("+x+"px,"+y+"px)";
                        self.jqElement.galleryImg.css({
                            webkitTransform : style,
                            mozTransform : style,
                            transform : style
                        });
                        self.position.imgX=x;
                        self.position.imgY=y;
                        if(state && self.state.activeSmall && self.state.small){
                            self.changeSmallPosition((-1*x)/(self.size.imgWidth/self.size.smallWidth)+self.position.smallLeft,(-1*y)/(self.size.imgHeight/self.size.smallHeight)+self.position.smallTop);
                        }
                    },
                    changeContainerSize : function(width,height,animate){
                        result={};
                        if(width>=jQTemplate.minInitWidth){
                            result.x=true;
                        }else{
                            result.x=false;
                            width=jQTemplate.minInitWidth;
                        }
                        if(height>=jQTemplate.minInitHeight){
                            result.y=true;
                        }else{
                            result.y=false;
                            height=jQTemplate.minInitHeight;
                        }
                        if(result.x || result.y){
                            var self=this;
                            self.size.containerWidth=width;
                            self.size.containerHeight=height;
                            if(animate){
                                self.jqElement.container.animate({
                                    height : height+"px",
                                    width : width+"px"
                                });
                            }else{
                                self.jqElement.container.css({
                                    height : height+"px",
                                    width : width+"px"
                                });
                            }
                            self.jqElement.galleryMask.find("canvas").css({
                                "left" : (width/2-jQTemplate.maskOption.width/2)+"px",
                                "top" : (height/2-jQTemplate.maskOption.height/2)+"px"
                            });
                            self.showHideSmall();
                            self.jqElement.gallerySwitchPre.css("top",(height-50)/2);
                            self.jqElement.gallerySwitchNext.css("top",(height-50)/2);
                            self.jqElement.galleryTs.css("left",width/2-150);
                        }
                        return result;
                    },
                    changeContainerPosition : function(x,y){
                        var self=this;
                        style="translate("+x+"px,"+y+"px)";
                        self.jqElement.container.css({
                            webkitTransform : style,
                            mozTransform : style,
                            transform : style
                        });
                        self.position.x=x;
                        self.position.y=y;
                    },
                    show : function(){
                        var self=this;
                        jQTemplate.$body.addClass("noSelect");
                        self.jqElement.container.show();
                        self.jqElement.galleryTooTop.mouseover();
                        self.jqElement.galleryTooDown.mouseover();
                        self.timeout1=setTimeout(function(){
                            self.jqElement.galleryTooTop.mouseout();
                        },2000);
                        self.timeout2=setTimeout(function(){
                            self.jqElement.galleryTooDown.mouseout();
                        },2000);
                    },
                    hide : function(){
                        if(this.beforeBodyStyle){
                            jQTemplate.$body.attr("style",this.beforeBodyStyle);
                        }else{
                            jQTemplate.$body.removeAttr("style");
                        }
                        window.onresize=this.beforeWindowResize;
                        jQTemplate.$body.removeClass("noSelect");
                        this.jqElement.container.remove();
                    },
                    showMask : function(){
                        this.jqElement.galleryMask.show().data("sonic").play();
                    },
                    hideMask : function(){
                        this.jqElement.galleryMask.hide().data("sonic").stop();
                    },
                    animaShow : function(ele){
                        ele.show();
                    },
                    animaHide : function(ele){
                        ele.hide();
                    }
                };

                String.prototype.colorHex2Rgb = function(){
                    var sColor = this.toLowerCase(),i;
                    if(sColor && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(sColor)){
                        if(sColor.length === 4){
                            var sColorNew = "#";
                            for(i=1; i<4; i+=1){
                                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                            }
                            sColor = sColorNew;
                        }
                        var sColorChange = [];
                        for(i=1; i<7; i+=2){
                            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
                        }
                        return sColorChange;
                    }else{
                        return [];
                    }
                };
            }(Sonic);
        });
    }

    $.fn.extend({
        gallery : function(param){
            var urls=[];
            this.each(function(){
                if(this.tagName.toLocaleLowerCase()==="img"){
                    var tem=this.src.split(".");
                    var suffix=tem[tem.length-1];
                    if(suffix===undefined){
                        suffix="";
                    }
                    suffix=suffix.toLocaleLowerCase();
                    if(suffix==="jpg" || suffix==="gif" || suffix==="png" || suffix==="bmp" || suffix==="jpeg"){
                        urls.push(this.src);
                    }
                }
            });
            if(urls.length>0){
                param=param || {};
                var url,indexOf;
                if(param.activeUrl!==undefined){
                    for( var i=0;i<urls.length;i++){
                        url=urls[i];
                        indexOf=url.indexOf("/public");
                        if(indexOf>0){
                            url=url.substr(indexOf);
                        }else{
                            indexOf=url.indexOf("/file/display");
                            if(indexOf>0){
                                url=url.substr(indexOf);
                            }
                        }
                        if(param.activeUrl===url){
                            param.activeIndex=i;
                            break;
                        }
                    }
                }
                param.urls=urls;
                $.gallery(param);
            }
        },
        animateShow : function(){
            var ele=this,param=ele.data("animateParam"),arr;
            if(param){
                arr=param.arr;
                var index=param.index;
                if(param.inter!==undefined){
                    clearInterval(param.inter);
                }
                param.inter=setInterval(function(){
                    if(index++>=10){
                        if(param.beforeStyle){
                            ele.attr("style",param.beforeStyle);
                        }else{
                            ele.removeAttr("style");
                        }
                        clearInterval(param.inter);
                        ele.data("animateParam",undefined);
                    }else{
                        ele.css("color","rgba("+arr[0]+","+arr[1]+","+arr[2]+","+(index/10)+")");
                        param.index=index;
                        ele.data("animateParam",param);
                    }
                },10);
            }else{
                var color=ele.css("color");
                if(color){
                    if(/^#/.test(color)){
                        arr=color.colorHex2Rgb();
                    }else{
                        arr=color.replace("rgb(","").replace(")","").split(",");
                    }
                    if(arr.length===3){
                        ele.show().data("animateParam",{
                            index : 1,
                            arr : arr,
                            beforeStyle : ele.attr("style")
                        }).css("color","rgba("+arr[0]+","+arr[1]+","+arr[2]+",0)").animateShow();
                    }
                }else{
                    ele.show();
                }
            }
        },
        animateHide : function(){
            var ele=this,param=ele.data("animateParam"),arr;
            if(param){
                arr=param.arr;
                var index=param.index;
                if(param.inter!==undefined){
                    clearInterval(param.inter);
                }
                param.inter=setInterval(function(){
                    if(index--<=0){
                        if(param.beforeStyle){
                            ele.attr("style",param.beforeStyle);
                        }else{
                            ele.removeAttr("style");
                        }
                        ele.hide();
                        clearInterval(param.inter);
                        ele.data("animateParam",undefined);
                    }else{
                        ele.css("color","rgba("+arr[0]+","+arr[1]+","+arr[2]+","+(index/10)+")");
                        param.index=index;
                        ele.data("animateParam",param);
                    }
                },10);
            }else{
                var color=ele.css("color");
                if(color){
                    if(/^#/.test(color)){
                        arr=color.colorHex2Rgb();
                    }else{
                        arr=color.replace("rgb(","").replace(")","").split(",");
                    }
                    if(arr.length===3){
                        ele.data("animateParam",{
                            index : 10,
                            arr : arr,
                            beforeStyle : ele.attr("style")
                        }).css("color","rgba("+arr[0]+","+arr[1]+","+arr[2]+",0)").animateHide();
                    }
                }else{
                    ele.hide();
                }
            }
        }
    });

    $.extend({
        gallery : function(url){
            var param;
            if(typeof url==="string"){
                param={
                    urls : [url]
                };
            }else if($.isArray(url)){
                param={
                    urls : url
                }
            }else{
                param=url;
            }
            new gallery(param);
        }
    });
}(EIIS,require,jQuery,window,undefined);