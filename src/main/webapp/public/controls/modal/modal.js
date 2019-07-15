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


    var superModal = $.fn.modal;

    var superModalShow = $.fn.modal.Constructor.prototype.show;
    $.fn.modal.Constructor.prototype.show = function () {

        if (this.isShown) return superModalShow.apply(this, arguments);

        var result = superModalShow.apply(this, arguments);

        enforceObjectStartHide();
        zIndex++;

        this.$element.css({"z-index": zIndex});
        //this.$backdrop.css({"z-index": zIndex - 1});

        //this.$backdrop.addClass("modal-z-index-" + zIndex).css({"z-index": zIndex - 1});
        //$(".modal-backdrop.in:not(.modal-z-index-" + zIndex + ")").hide();


        return result;
    };

    var superModalHide = $.fn.modal.Constructor.prototype.hide;
    $.fn.modal.Constructor.prototype.hide = function () {

        if (!this.isShown) return superModalHide.apply(this, arguments);

        zIndex--;
        enforceObjectEndHide();

        this.$element.css({"z-index": ""});
        //this.$backdrop.css({"z-index": ""});

        var result = superModalHide.apply(this, arguments);


        //$(".modal-backdrop.in.modal-z-index-" + zIndex).show();


        return result;
    };

    $.fn.modal.Constructor.prototype.destroy = function () {
        this.$element.off();
        this.hide();

        var e = $.Event('destroy.bs.modal');

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        //zIndex--;
        //enforceObjectEndHide();

/*        this.removeBackdrop();
        this.$element
            .off('.modal')
            .removeData('bs.modal')
            .removeClass('in')
            .attr('aria-hidden', true);*/

        this.$element.remove();
        this.$element = null;
        return;

    };

    var superModalResize = $.fn.modal.Constructor.prototype.resize;
    $.fn.modal.Constructor.prototype.resize = function () {
        var result = superModalResize.apply(this, arguments);
        if (this.isShown) {
            this.$element.on('scroll.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            this.$element.off('scroll.bs.modal')
        }
        return result;
    };

    var superModalBackdrop = $.fn.modal.Constructor.prototype.backdrop;
    $.fn.modal.Constructor.prototype.backdrop = function (callback) {
        var that = this;
        return superModalBackdrop.call(this, function () {
            callback();
            if (zIndex > 2000) {
                that.$body.addClass('modal-open');
            }
        });
    };

    var superModalResetScrollbar = $.fn.modal.Constructor.prototype.resetScrollbar;
    $.fn.modal.Constructor.prototype.resetScrollbar = function () {
        if (zIndex == 2000) {
            return superModalResetScrollbar.apply(this, arguments);
        }
    };

    var superModalSetScrollbar = $.fn.modal.Constructor.prototype.setScrollbar;
    $.fn.modal.Constructor.prototype.setScrollbar = function () {
        if (zIndex == 2000) {
            return superModalSetScrollbar.apply(this, arguments);
        }
    }

    /*var superModalEnforceFocus = $.fn.modal.Constructor.prototype.enforceFocus;
     $.fn.modal.Constructor.prototype.enforceFocus = function () {

     };*/


    $.fn.modal = function () {
        if (this.children(".modal-dialog").children(".modal-content").length == 0) {
            $("<div/>").addClass("modal-dialog")
                .append($("<div/>").addClass("modal-content")
                    .append(this.children())).appendTo(this);
        }
        return superModal.apply(this, arguments);
    };


})(window.jQuery);
