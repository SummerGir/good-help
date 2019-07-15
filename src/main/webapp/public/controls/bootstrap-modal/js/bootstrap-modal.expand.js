(function ($, undefined) {

    var zIndex = 2000;
    var jqBody = $("body");

    var enforceObjectAddHide = function () {
        $(this).addClass("modal-object-hidden");
    };

    var enforceObjectStartHide = function () {
        if (zIndex == 2000) {
            setTimeout(function () {
                $(":not(.modal object)object").addClass("modal-object-hidden");
                jqBody.livequery(":not(.modal object)object", enforceObjectAddHide);
            }, 100);
        }
    };
    var enforceObjectEndHide = function () {
        if (zIndex == 2000) {
            setTimeout(function () {
                jqBody.expire(":not(.modal object)object", enforceObjectAddHide);
                $(".modal-object-hidden").removeClass("modal-object-hidden");
            }, 200);
        }
    };


    var superModalShow = $.fn.modal.Constructor.prototype.show;
    $.fn.modal.Constructor.prototype.show = function () {

        if (this.isShown) return superModalShow.apply(this, arguments);

        var result = superModalShow.apply(this, arguments);

        enforceObjectStartHide();
        zIndex++;

        this.$backdrop.addClass("modal-backdrop-expand");

        if("true".equalsIgnoreCase(this.$element.attr("data-drag"))){
            var disX = 0;
            var disY = 0;
            var $ele = this.$element;
            var ele = $ele[0];
            this.$element.parents(".modal-scrollable").css("overflow","hidden");
            $(".modal-header",this.$element).css("cursor","move");
            if(!$ele.data("isInit")){
                $ele.data("isInit",true);
                $ele.data("initCss",{
                    "margin-top":0,
                    "margin-left":0,
                    "top":parseFloat($ele.css("top"))+parseFloat($ele.css("margin-top"))+"px",
                    "left":parseFloat($ele.css("left"))+parseFloat($ele.css("margin-left"))+"px"
                });
                $ele.css($ele.data("initCss"));
            }else {
                $ele.css($ele.data("initCss"));
            }

            $(".modal-header",this.$element).unbind("mousedown").bind("mousedown",function (ev) {
                var oEvent = ev || event;
                disX = oEvent.clientX ;
                disY = oEvent.clientY;
                var top = parseFloat($ele.css("top"));
                var left = parseFloat($ele.css("left"));
                document.onmousemove = function (ev) {
                    var oEvent = ev || event;
                    var l = oEvent.clientX - disX+left;
                    var t = oEvent.clientY - disY+top;

                    var limit = $ele.parents(".modal-scrollable")[0];
                    var min = 50;
                    if (l < -ele.offsetWidth + min) {
                        l = -ele.offsetWidth + min;
                    }
                    else if (l > limit.offsetWidth- min){
                        l = limit.offsetWidth - min;
                    }
                    if (t < 0){
                        t = 0;
                    }else if (t > limit.offsetHeight- min){
                        t = limit.offsetHeight - min;
                    }
                    $ele.css({
                        "margin-top":0,
                        "margin-left":0,
                        "top":t+"px",
                        "left":l+"px"
                    });
                };

                document.onmouseup = function (){
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
        }else {
            $(".modal-header",this.$element).css("cursor","auto");
            this.$element.parents(".modal-scrollable").css("overflow","auto");
        }
        return result;
    };

    var superModalHide = $.fn.modal.Constructor.prototype.hide;
    $.fn.modal.Constructor.prototype.hide = function () {

        if (!this.isShown) return superModalHide.apply(this, arguments);

        var result = superModalHide.apply(this, arguments);

        zIndex--;
        enforceObjectEndHide();

        return result;
    };

    var superModalDestroy = $.fn.modal.Constructor.prototype.destroy;
    $.fn.modal.Constructor.prototype.destroy = function () {

        if (!this.isShown) return superModalDestroy.apply(this, arguments);

        var result = superModalDestroy.apply(this, arguments);

        zIndex--;
        enforceObjectEndHide();

        return result;

    };

})(window.jQuery);
