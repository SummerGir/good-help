var  hammerManager=function(selector){
    var self=this;
    selector.data("hammer",this);
    var el=selector[0];
    self.el=el;
    var mc=new Hammer.Manager(el);
    var START_X = 0;
    var START_Y = 0;
    var ticking = false;
    var transform;   //图像效果
    var initAngle = 0;  //旋转角度
    var initScale = 1;  //放大倍数
    //旋转相关
    var  preAngle =0 ;
    var  tempAngleFlag=0;
    var  deltaAngle = 0;
    var  startRotateAngle = 0;

    self.enabled=true;
    this.manager=function(){
        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
        mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
        //结束时做一些处理
        mc.on("hammer.input", function(ev) {
            if(ev.isFinal) {
                START_X = transform.translate.x ;
                START_Y = transform.translate.y ;
            }
        });
        mc.on("panstart panmove", onPan);
        mc.on("rotatestart rotatemove rotateend", onRotate);
        mc.on("pinchstart pinchmove", onPinch);

        self.resetElement();
    };

    this.getInitAngle=function(){
        return initAngle;
    };

    function onPan(ev){
        if(!self.enabled){
            return;
        }
        if(!ev.isFinal) {
            selector.removeClass("animate");
            transform.translate = {
                x: START_X + ev.deltaX,
                y: START_Y + ev.deltaY
            };
            requestElementUpdate();
        }
    }

    function onPinch(ev){
        if(!self.enabled){
            return;
        }
        if(ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }
        selector.removeClass("animate");
        transform.scale = initScale * ev.scale;
        requestElementUpdate();
    }

    function onRotate(ev) {
        if(!self.enabled){
            return;
        }
        //点下第二个触控点时触发
        if(ev.type == 'rotatestart') {
            startRotateAngle =  ev.rotation ;
            tempAngleFlag = 0 ;
        }
        if(ev.type == 'rotatemove'){
            if(tempAngleFlag == 0){
                preAngle = startRotateAngle;
                tempAngleFlag ++;
            }else{
                deltaAngle = ev.rotation - preAngle;
                selector.removeClass("animate");
                transform.rz = 1;  //非0  垂直xy轴
                transform.angle =initAngle + deltaAngle;
                requestElementUpdate();
            }
        }

        //旋转结束  记录当前图片角度
        if(ev.type =='rotateend'){
            initAngle = transform.angle;
        }
    }

    function updateElementTransform() {
        var value = [
            'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')',
            'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
        ];

        value = value.join(" ");
        el.style.webkitTransform = value;  /*为Chrome/Safari*/
        el.style.mozTransform = value; /*为Firefox*/
        el.style.transform = value; /*IE Opera?*/
        ticking = false;
    }

    function requestElementUpdate() {
        if(!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }

    /**
     初始化设置
     */
    this.resetElement=function(angle) {
        selector.addClass("animate");
        if(angle!==undefined){
            transform.angle=angle;
            initAngle=angle;
        }else{
            transform = {
                translate: { x: 0, y: 0 },
                scale: 1,
                angle: 0,
                rx: 0,
                ry: 0,
                rz: 0
            };
            initAngle=0;
            initScale=1;
            START_X=0;
            START_Y=0;
        }
        requestElementUpdate();
    };

    var
        reqAnimationFrame = (function () {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
};

hammerManager.prototype.reductionTransformTotate3d=function(){
    //translate3d(18px, 4px, 0px) scale(1, 1) rotate3d(0, 0, 0, 0deg)
    var el=this.el;
    var value=el.style.transform.split("rotate3d")[0]+"rotate3d(0, 0, 0, 0deg)";
    el.style.webkitTransform = value;  /*为Chrome/Safari*/
    el.style.mozTransform = value; /*为Firefox*/
    el.style.transform = value; /*IE Opera?*/
};

$.fn.extend({
    disabledHammer:function(){
        this.data("hammer").enabled=false;
    },
    enabledHammer:function(){
        this.data("hammer").enabled=true;
    },
    resetHammer:function(num){
        var hammer=this.data("hammer");
        if(hammer){
            hammer.resetElement(num);
        }else{
            new hammerManager(this).manager();
        }
    }
});