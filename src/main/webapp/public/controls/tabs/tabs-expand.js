(function ($, undefined) {

    var autocollapse = function (tabs) {

        var maxHeight = 0;
        var getMaxHeight = function () {
            if (maxHeight <= 0) {
                maxHeight = $("li:visible:eq(0)", tabs).height();
                maxHeight *= 1.5;
            }
            return maxHeight;
        };

        var tabsHeight = tabs.innerHeight();

        if (tabsHeight >= getMaxHeight()) {
            var ulCollapsed = tabs.children('li.collapsed-li');
            if (ulCollapsed.length == 0) {
                ulCollapsed = $("<li/>")
                    .addClass("collapsed-li")
                    .append($("<a>更多...<span class=\"caret\"></span></a>")
                        .addClass("btn dropdown-toggle")
                        .attr({
                            "data-toggle": "dropdown",
                            "href": "#this"
                        }))
                    .append($("<ul/>").addClass("collapsed-ul dropdown-menu"))
                    .appendTo(tabs);
            }
            ulCollapsed = ulCollapsed.children("ul.collapsed-ul");
            while (tabsHeight > getMaxHeight()) {
                //alert(getMaxHeight() + " === " + tabsHeight);
                tabs.children('li:not(.collapsed-li):last')
                    .prependTo(ulCollapsed);
                tabsHeight = tabs.innerHeight();
            }
        }
        else {
            var liCollapsed = tabs.children('li.collapsed-li');
            if (liCollapsed.length > 0) {
                var ulCollapsed = liCollapsed.children("ul.collapsed-ul");
                while (tabsHeight < getMaxHeight() && (ulCollapsed.children('li').size() > 0)) {
                    ulCollapsed.children('li:first')
                        .insertBefore(liCollapsed);
//                    liCollapsed.removeClass("active");
                    tabsHeight = tabs.innerHeight();
                }
                if (ulCollapsed.children('li').size() == 0) {
                    liCollapsed.remove();
                }
                if (tabsHeight > getMaxHeight()) {
                    autocollapse(tabs);
                }
            }
        }

    };

    var superTabActivate = $.fn.tab.Constructor.activate;
    $.fn.tab.Constructor.activate = function(element){
        var result = superTabActivate.apply(this, arguments);


        return result;
    };

    /*var superTabs = $.fn.tab;
    $.fn.tab = function () {

        var $this = $(this);
        var isNew = !$this.data('bs.tab');

        var result = superTabs.apply(this, arguments);

        if (isNew) {
            //$(document).on("ready", function () {
            autocollapse($this);
            //});

            $(window).on('resize', function () {
                autocollapse($this);
            });
        }

        return result;
    };*/

    $("body").livequery(".nav.nav-tabs", function () {
        var $this = $(this);
        var autoCollapseThis = function () {
            autocollapse($this);
        };
        $this.data('bs.tab.resize', autoCollapseThis);
        autoCollapseThis();
        $(window).on('resize', $this.data('bs.tab.resize'));
    }, function () {
        var $this = $(this);
        $(window).off('resize', $this.data('bs.tab.resize'));
    });

})(window.jQuery);
