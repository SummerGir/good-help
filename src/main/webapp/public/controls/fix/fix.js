(function ($, undefined) {

    var _getHeight = function (existsFlag, orgIndex) {
        var obj = new Object();
        var sumH = 0;
        var index = 0;
        $(".navbar-fixed-top").each(function () {
            sumH = sumH + $(this).height();
        });
        $(".fix-fixed-top").each(function (i) {
            var bar = $(this);
            if (!existsFlag) {
                sumH = sumH + bar.height() + 2;
                index++;
            } else {
                if (i < orgIndex) {
                    sumH = sumH + bar.height() + 2;
                }
                index = orgIndex;
            }
        });
        obj.sumH = sumH;
        obj.fIndex = index;
        return obj;
    };
    var _recalPosition = function () {
        var sumH = 0;
        var sumOwn = 0;
        $(".navbar-fixed-top").each(function () {
            sumH = sumH + $(this).height();
        });
        sumOwn = sumH;
        $(".fix-fixed-top").each(function (i) {
            var self = $(this);
            self.css({"top": sumOwn + "px"});
            sumOwn = sumOwn + self.height() + 2;
        });
    }
    var _getInterset = function (_self, defaults, existsFlag, orgIndex) {
        var obj = new Object();
        if (!defaults.beginElement && defaults.beginElement != null) {
            throw new Error("beginElement needed");
        }
        obj.startTop = _getStartTop(defaults);
        obj.endTop = _getEndTop(_self, defaults, existsFlag, orgIndex);
        return obj;

    };
    var _getStartTop = function (defaults, existsFlag, orgIndex) {
        var _top = 0;
        var index = 0;
        if (!defaults.beginElement && defaults.beginElement != null) {
            throw new Error("beginElement needed");
        }
        if (typeof(defaults.beginElement) == "object") {
            _top = defaults.beginElement.offset().top;
        } else {
            _top = defaults.beginElement;
        }
        return _top;
    };
    var _getFloated = function (existsFlag, orgIndex) {
        var sumH = 0;
        $(".navbar-fixed-top").each(function () {
            var nav = $(this);
            sumH = sumH + nav.height() + nav.offset().top;
        });
        var secondIndex = 0;
        if (existsFlag) {
            secondIndex = orgIndex - 1;
            if (secondIndex >= 0) {
                var lastTool = $(".fix-fixed-top:eq(" + secondIndex + ")");
                var fIndex = lastTool.attr("findex");
                if (lastTool.size() >= 1 && fIndex != orgIndex) {
                    sumH = sumH + lastTool.height() + lastTool.offset().top;
                }
            }
        }
        return sumH;
    };
    var _getEndTop = function (_self, defaults, existsFlag, orgIndex) {
        var _top = 0;
        if (defaults.endElement && defaults.endElement != null) {
            if (typeof(defaults.endElement) == "object") {
                _top = defaults.endElement.offset().top + defaults.endElement.height();
            } else {
                _top = defaults.endElement
            }
        } else {
            if (typeof(defaults.beginElement) == "object") {
                _top = defaults.beginElement.offset().top + defaults.beginElement.height();
            } else {
                _top = defaults.beginElement;
            }
        }
        _top = _top - _self.height();
        return _top;
    };
    var _setTable = function (_self,defaults) {
        var cloneObj = _self.data("org");
        if (cloneObj != undefined&&cloneObj.height()>=1) {
            setTimeout(function () {
                _self.find("tr").each(function () {
                    var tr = $(this);
                    var trIndex = tr.index();
                    var cloneTr = cloneObj.find("tr:eq(" + trIndex + ")");
                    tr.find("th").each(function () {
                        var td = $(this);
                        var tdIndex = td.index();
                        var cloneTh = cloneTr.find("th:eq(" + tdIndex + ")");
                        cloneTh.css({"width": td.css("width")});
                        if (tdIndex == 0) {
                            cloneTh.find("div.checkbox").css("margin", "0");
                        }
                    });
                });
                _self.data("org",cloneObj);
            },100);
        }
    };
    var _reTable = function (_self) {
        var cloneObj = _self.data("org");
        if (cloneObj != undefined&&cloneObj.height()>=1) {
            cloneObj.css({
                "top": _self.offset().top,
                "left": _self.offset().left,
                "width":_self.width()
            });
        }
    }
    var _reTableSecond = function (_self,defaults) {
        var cloneObj = _self.data("org");
        if (cloneObj != undefined&&cloneObj.height()>=1) {
            if((cloneObj.offset().left!=_self.offset().left)||(cloneObj.width()!=_self.width()))
                cloneObj.css({
                    // "top": _self.offset().top,
                    "left": _self.offset().left,
                    "width":_self.width()
                });
        }
    }
    var _scrollFn = function (_self, cloneObj, defaults) {

        defaults.width = _self.width();
        defaults.left = _self.offset().left;
        var fIndex = null;
        if (cloneObj != undefined) {
            fIndex = cloneObj.attr("findex");
        } else {
            fIndex = _self.attr("findex");
        }
        var existsFlag = fIndex != undefined ? true : false;
        var objHeight = _getHeight(existsFlag, fIndex);
        var offsetY = objHeight.sumH;
        var objIntersect = _getInterset(_self, defaults, existsFlag, fIndex);
        var lastFloatIndex = _getFloated(existsFlag, fIndex);
        var startTop = objIntersect.startTop;
        var endTop = objIntersect.endTop;
        var scrollTop = window.scrollY != undefined ? window.scrollY : window.pageYOffset;
        scrollTop = scrollTop != undefined ? scrollTop : (document.documentElement || document.body).scrollTop;
        var flagFlag = (lastFloatIndex > defaults.offsetTop);
        var secondFlag = (scrollTop > startTop && scrollTop < endTop);
        var flagFlag=flagFlag&(scrollTop < endTop);
        if (flagFlag || secondFlag) {
            if (cloneObj != undefined) {
                cloneObj.show();
                if (!cloneObj.hasClass("fix-fixed-top")) {
                    cloneObj.addClass("fix-fixed-top")
                        .css({top: offsetY + "px", width: defaults.width})
                        .attr("findex", objHeight.fIndex);
                    _recalPosition();
                }
            } else {
                if (!_self.hasClass("fix-fixed-top")) {
                    _self.addClass("fix-fixed-top")
                        .css({top: offsetY + "px", width: defaults.width})
                        .attr("findex", objHeight.fIndex);
                    _recalPosition();
                }
            }
        } else {
            if (!defaults.stick) {
                if (cloneObj != undefined) {
                    cloneObj.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
                    cloneObj.hide();
                } else {
                    _self.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
                }
                _recalPosition();
            } else {
                if (scrollTop < defaults.offsetTop) {
                    if (cloneObj != undefined) {
                        cloneObj.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
                        cloneObj.hide();
                    } else {
                        _self.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
                    }
                    _recalPosition();
                }
            }
        }
    }
    var _resizeFn = function (_self, cloneObj, defaults) {
        if (cloneObj != undefined) {
            cloneObj.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
        } else {
            _self.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
        }
        _reTable(_self);
        _setTable(_self,defaults);
        _scrollFn(_self, cloneObj, defaults);
    };
    var getDeviceState = function () {
        var state = "desktop";
        var monitorDiv = $("<div class='state-indicator'></div>");
        monitorDiv.appendTo($("body"))
        switch (parseInt(monitorDiv.css('z-index'), 10)) {
            case 2:
                state = 'small-desktop';
                break;
            case 3:
                state = 'tablet';
                break;
            case 4:
                state = 'phone';
                break;
            default:
                state = 'desktop';
                break;
        }
        monitorDiv.remove();
        if (state == 'small-desktop') {
            state = 'desktop';
        }
        return state;
    }
    var _removeAllState = function (_self, cloneObj) {
        if (cloneObj != undefined) {
            var tempPos=cloneObj.css("position");
            if(tempPos=="static"&&cloneObj.height()>=1) {
                cloneObj.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
                cloneObj.hide();
            }
        } else {
            var tempPos=_self.css("position");
            if(tempPos=="static"){
                _self.css({"top": "", "width": ""}).removeClass("fix-fixed-top");
            }
        }
    }
    var _init = function (_self, cloneObj, defaults) {
        var _height = _self.height();
        _setTable(_self,defaults);
        if (_height >= 1) {
            var _parent= _self.parent();
            defaults.offsetTop = _self.offset().top;
            defaults.left = _self.offset().left;
            var orgObj={};
            /* orgObj.offsetTop = _self.offset().top;
             orgObj.left = _self.offset().left;
             orgObj.height = _height; */
            orgObj.offsetTop = _parent.offset().top;
            orgObj.left = _parent.offset().left;
            orgObj.height = _parent.height();
            _self.parent().data("orgPos",orgObj);
            $(document).on('scroll', function () {
                _scrollFn(_self, cloneObj, defaults);
                _removeAllState(_self, cloneObj);
            });
            _parent.on("resize",function(){
                var temp=$(this);
                var orgTemp=temp.data("orgPos");
                if((temp.offset().left!=orgTemp.left)||(temp.offset().top!=orgTemp.offsetTop)||(temp.height()!=orgTemp.height)){
                    _reTableSecond(_self,defaults);
                    if (temp.resizeTimer) {clearTimeout(resizeTimer);temp.resizeTimer = null; }
                    else{
                        temp.resizeTimer = setTimeout(function(){
                            _resizeFn(_self, cloneObj, defaults);
                            _removeAllState(_self, cloneObj);
                        }, 50);
                        orgObj.offsetTop = temp.offset().top;
                        orgObj.left = temp.offset().left;
                        orgObj.height = temp.height();
                        temp.data("orgPos",orgObj);
                    }
                }
            });
        }
    };
    $.fn.fix = function (options) {
        var defaults = $.extend({
            beginElement: null,
            endElement: null,
            startTop: 0,
            endTop: 0,
            stick: false
        }, options);
        var _self =this;
        var cloneObj = undefined;
        if($.nodeName(this[0],"THEAD")){
            var cloneObj = _self.clone(true);
            _self.find("tr").each(function () {
                var tr = $(this);
                var trIndex = tr.index();
                var cloneTr = cloneObj.find("tr:eq(" + trIndex + ")");
                tr.find("th").each(function () {
                    var td = $(this);
                    var tdIndex = td.index();
                    var cloneTh = cloneTr.find("th:eq(" + tdIndex + ")");
                    cloneTh.css({"width": td.css("width")});
                    if(tdIndex==0){
                        cloneTh.find("div.checkbox").css("margin","0");
                    }
                });
            });
            cloneObj.appendTo(this.parent());
            this.data("org", cloneObj);
            cloneObj.hide();
        }
        return this.each(function () {
            _init(_self, cloneObj, defaults);
        });
    };
})(jQuery);

(function($,window,undefined){
    '$:nomunge'; // Used by YUI compressor.

    // A jQuery object containing all non-window elements to which the resize
    // event is bound.
    var elems = $([]),

    // Extend $.resize if it already exists, otherwise create it.
        jq_resize = $.resize = $.extend( $.resize, {} ),

        timeout_id,

    // Reused strings.
        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';

    // Property: jQuery.resize.delay
    //
    // The numeric interval (in milliseconds) at which the resize event polling
    // loop executes. Defaults to 250.

    jq_resize[ str_delay ] = 250;

    // Property: jQuery.resize.throttleWindow
    //
    // Throttle the native window object resize event to fire no more than once
    // every <jQuery.resize.delay> milliseconds. Defaults to true.
    //
    // Because the window object has its own resize event, it doesn't need to be
    // provided by this plugin, and its execution can be left entirely up to the
    // browser. However, since certain browsers fire the resize event continuously
    // while others do not, enabling this will throttle the window resize event,
    // making event behavior consistent across all elements in all browsers.
    //
    // While setting this property to false will disable window object resize
    // event throttling, please note that this property must be changed before any
    // window object resize event callbacks are bound.

    jq_resize[ str_throttle ] = true;

    // Event: resize event
    //
    // Fired when an element's width or height changes. Because browsers only
    // provide this event for the window element, for other elements a polling
    // loop is initialized, running every <jQuery.resize.delay> milliseconds
    // to see if elements' dimensions have changed. You may bind with either
    // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
    //
    // Usage:
    //
    // > jQuery('selector').bind( 'resize', function(e) {
    // >   // element's width or height has changed!
    // >   ...
    // > });
    //
    // Additional Notes:
    //
    // * The polling loop is not created until at least one callback is actually
    //   bound to the 'resize' event, and this single polling loop is shared
    //   across all elements.
    //
    // Double firing issue in jQuery 1.3.2:
    //
    // While this plugin works in jQuery 1.3.2, if an element's event callbacks
    // are manually triggered via .trigger( 'resize' ) or .resize() those
    // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
    // events system. This is not an issue when using jQuery 1.4+.
    //
    // > // While this works in jQuery 1.4+
    // > $(elem).css({ width: new_w, height: new_h }).resize();
    // >
    // > // In jQuery 1.3.2, you need to do this:
    // > var elem = $(elem);
    // > elem.css({ width: new_w, height: new_h });
    // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
    // > elem.resize();

    $.event.special[ str_resize ] = {

        // Called only when the first 'resize' event callback is bound per element.
        setup: function() {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will bind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var elem = $(this);

            // Add this element to the list of internal elements to monitor.
            elems = elems.add( elem );

            // Initialize data store on the element.
            $.data( this, str_data, { w: elem.width(), h: elem.height() } );

            // If this is the first element added, start the polling loop.
            if ( elems.length === 1 ) {
                loopy();
            }
        },

        // Called only when the last 'resize' event callback is unbound per element.
        teardown: function() {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will unbind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var elem = $(this);

            // Remove this element from the list of internal elements to monitor.
            elems = elems.not( elem );

            // Remove any data stored on the element.
            elem.removeData( str_data );

            // If this is the last element removed, stop the polling loop.
            if ( !elems.length ) {
                clearTimeout( timeout_id );
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function( handleObj ) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler( e, w, h ) {
                var elem = $(this),
                    data = $.data( this, str_data );
                if(data==undefined){return;}
                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply( this, arguments );
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ( $.isFunction( handleObj ) ) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

    function loopy() {

        // Start the polling loop, asynchronously.
        timeout_id = window[ str_setTimeout ](function(){

            // Iterate over all elements to which the 'resize' event is bound.
            elems.each(function(){
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data( this, str_data );

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if ( width !== data.w || height !== data.h ) {
                    elem.trigger( str_resize, [ data.w = width, data.h = height ] );
                }

            });

            // Loop.
            loopy();

        }, jq_resize[ str_delay ] );

    };

})(jQuery,this);
