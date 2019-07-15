!function($,window){

    var mask=$('<div class="shareMask" style="display: none;"></div>')
        ,modal=$('<div class="share" style="display: none;">' +
                    '<div class="head">' +
                        '<p>发送给：</p>'+
                        '<div class="members"><div class="list"></div></div>'+
                        '<div class="line"><div></div></div>'+
                        '<div class="title"></div>'+
                        '<div class="content">' +
                            '<div class="textarea" contenteditable="true"></div>'+
                            '<div class="placeholder">给朋友留言</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="bottom">' +
                        '<ul>' +
                            '<li class="cancel">取消</li>'+
                            '<li class="confirm">发送</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>')
        ,getPerson=window.getPerson
        ,$window=$(window)
        ,winWidth=$window.width()
        ,winHeight=$window.height();

    var Share=function(option){
        var self=this;
        var callback=option.callback;
        if(typeof callback==="string"){
            callback=window[callback];
            if($.isFunction(callback)){
                self.callback=callback;
            }else{
                self.throw();
            }
            delete option.callback;
        }else if(typeof callback==="function"){
            self.callback=callback;
            delete option.callback;
        }else{
            self.throw();
        }
        self.option=option;
        self.jqElement={
            mask : mask.clone(),
            modal : modal.clone(),
            $body : $("body")
        };
        self.requestState=false;
        self.jqElement.textarea=self.jqElement.modal.find(".textarea");
        self.jqElement.placeholder=self.jqElement.modal.find(".placeholder");
        self.jqElement.members=self.jqElement.modal.find(".members");
        self.jqElement.list=self.jqElement.members.find(".list");
        self.init();
    };

    Share.prototype={
        init : function(){
            var self=this
                ,width=winWidth*0.8
                ,cancel=self.jqElement.modal.find(".cancel")
                ,confirm=self.jqElement.modal.find(".confirm");
            self.jqElement.modal.css({
                "width" : width+"px",
                "margin-left" : -1*width/2+"px"
            });
            self.blur=true;
            var focus=false,screenY=undefined,y,x;
            var focus2=false,screenX=undefined;
            self.jqElement.textarea.on({
                touchstart : function(){
                    focus=true;
                },
                touchend : function(){
                    focus=false;
                    screenY=undefined;
                },
                "blur" : function(){
                    self.blur=true;
                },
                "focus" : function(){
                    self.blur=false;
                },
                "input" : function(){
                    var htm = this.innerHTML;
                    if (htm.length!== 0 && htm!=='<br>') {
                        self.jqElement.placeholder.hide();
                    } else {
                        self.jqElement.placeholder.show();
                    }
                }
            });
            self.jqElement.members.on({
                touchstart : function(){
                    focus2=true;
                },
                touchend : function(){
                    focus2=false;
                    screenX=undefined;
                }
            });
            self.jqElement.mask.on("touchmove",function(event){
                event.preventDefault();
                event.stopPropagation();
            });
            self.jqElement.modal.on("touchmove",function(event){
                event.preventDefault();
                event.stopPropagation();
                if(focus){
                    y=event.originalEvent.targetTouches[0].screenY;
                    if(screenY!==undefined){
                        self.jqElement.textarea[0].scrollTop-=y-screenY;
                    }
                    screenY=y;
                }else if(focus2){
                    x=event.originalEvent.targetTouches[0].screenX;
                    if(screenX!==undefined){
                        self.jqElement.members[0].scrollLeft-=x-screenX;
                    }
                    screenX=x;
                }
            });
            cancel.on({
                "touchstart" : function(){
                    cancel.css("background-color","#e2e2e2");
                },
                "touchend" : function(){
                    cancel.css("background-color","#ffffff");
                    self.hideBox();
                },
                "click" : function(){
                    self.jqElement.textarea.blur();
                }
            });
            confirm.on({
                "touchstart" : function(){
                    confirm.css("background-color","#e2e2e2");
                },
                "touchend" : function(){
                    if(!self.requestState){
                        self.requestState=true;
                        confirm.css("background-color","#ffffff");
                        var ids=[],item;
                        self.jqElement.list.children().each(function(){
                            item=$(this);
                            ids.push(item.data("id"));
                        });
                        if(ids.length===0){
                            self.requestState=false;
                            return;
                        }
                        if(self.callback.call(self,{ids:ids,content:self.jqElement.textarea.text().trim()})===false){
                            self.requestState=false;
                            return;
                        }
                        self.hideBox(true);
                    }
                },
                "click" : function(){
                    self.jqElement.textarea.blur();
                }
            });
            self.jqElement.modal.resize(function(){
                self.jqElement.modal.css("margin-top",-1*self.jqElement.modal.height()/2+"px");
            });
            self.jqElement.mask.append('<style type="text/css">.shareOpened{overflow: hidden !important;height: '+(winHeight-10)+'px !important;}</style>');
            self.jqElement.$body.append(self.jqElement.mask);
            self.jqElement.$body.append(self.jqElement.modal);
            getPerson("/public/huancun/getPerson",{
                isFrozen : 0,
                postId : "",
                projectId : "",
                _thisbind : $("<input/>")
            },{
                defaultdata : [""],
                maxNum : null,
                minNum : null,
                pinyinType : [4]
            },{
                defaultdata : [""],
                isCheckDep : true,
                isCheckPost : true,
                isCheckperson : true,
                maxNum : null,
                minNum : null
            },null,null,function(data,destroy){
                if(data.length===0){
                    return false;
                }
                self.jqElement.list.empty().data("destroy",destroy);
                for(var i=0;i<data.length;i++){
                    $('<div '+(i===0?'':'style="margin-left:4px;"')+' data-id="'+data[i].id+'"><img src="/app/userinfo/member_outphoto.jsp?personId='+data[i].id+'"></div>')
                        .on("click",function(){
                            // var self=$(this);
                            // self.data("target").click();
                            // self.remove();
                        })
                        .data("target",data[i].target)
                        .appendTo(self.jqElement.list);
                }
                self.showBox();
                return false;
            });
            self.jqElement.modal.find(".title").text(self.option.title || "");
            self.jqElement.personTree=$("#person-tree");
        },
        showBox : function(){
            var self=this;
            self.jqElement.members[0].scrollLeft=0;
            self.jqElement.personTree.addClass("shareOpened");
            self.jqElement.mask.show();
            self.jqElement.modal.fadeIn();
        },
        hideBox : function(state){
            var self=this;
            setTimeout(function(){
                self.jqElement.modal.fadeOut("fast",function(){
                    self.jqElement.mask.hide();
                    self.jqElement.personTree.removeClass("shareOpened");
                    if(state){
                        var destroy=self.jqElement.list.data("destroy");
                        self.jqElement.mask.remove();
                        self.jqElement.modal.remove();
                        destroy();
                        self.requestState=false;
                    }
                });
            },self.blur?200:1000);
        },
        throw : function(){
            throw new Error("需要 callback 方法");
        }
    };

    $.extend({
        share : function(option){
            return new Share(option);
        }
    });
}(jQuery,window);