(function ($, undefined) {
    $.widget("ui.tabs", $.ui.tabs, {
        options: {
            closeable: false,
            beforeRemove: null
        },
        remove: function (index) {
            index = this._getIndex(index);
            var tab = this.tabs.eq(index),
                panel = this._getPanelForTab(tab),
                eventData = {
                    tab: tab,
                    panel: panel
                };
            if (this._trigger("beforeRemove", null, eventData) === false) {
                return this;
            }
            return this._super(index);
        },
        _create: function () {
            if (this.options.closeable === true) {
                this._setOption("closeable", true);
            }
            this._super();
        },
        _setOption: function (key, value) {
            if (key !== "closeable") {
                return this._super(key, value);
            }
            if (value === true) {
                if (this.options._tabTemplate == undefined
                    ||
                    this.options._tabTemplate == null) {
                    this.options._tabTemplate = this.options.tabTemplate;
                }
                this.options.tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>关闭</span></li>";
                var that = this;
                $("li .ui-icon-close", this.element).die("click.ui-tabs-close");
                $("li .ui-icon-close", this.element).live("click.ui-tabs-close", function () {
                    that.remove(that.anchors.index($(this).prev("a")));
                });
            } else {
                if (this.options._tabTemplate != undefined
                    &&
                    this.options._tabTemplate != null) {
                    this.options.tabTemplate = this.options._tabTemplate;
                }
            }
        },
        getIndex: function (index) {
            return this._getIndex(index);
        },
        setLabel: function (index, label) {
            index = this.getIndex(index);
            if (index >= 0) {
                this.anchors.eq(index).text(label);
            }
            return this;
        }
    });

})(jQuery);