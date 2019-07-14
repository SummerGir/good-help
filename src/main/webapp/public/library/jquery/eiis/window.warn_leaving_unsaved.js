var warnLeavingUnsaved = {
    message: "若离开当前页面，则该页面内未保存的内容将丢失。",
    _unsavedElements: [],
    put: function (element) {
        if (element instanceof jQuery) {
            element.each(function () {
                if (!warnLeavingUnsaved._unsavedElements.contains(this)) {
                    warnLeavingUnsaved._unsavedElements.add(this);
                }
            });
        } else {
            if (!warnLeavingUnsaved._unsavedElements.contains(element)) {
                warnLeavingUnsaved._unsavedElements.add(element);
            }
        }
    },
    remove: function (element) {
        if (element instanceof jQuery) {
            element.each(function () {
                if (warnLeavingUnsaved._unsavedElements.contains(this)) {
                    warnLeavingUnsaved._unsavedElements.remove(this);
                }
            });
        } else {
            if (warnLeavingUnsaved._unsavedElements.contains(element)) {
                warnLeavingUnsaved._unsavedElements.remove(element);
            }
        }
    },
    isUnsaved: function () {
        var event = $.Event(null);
        event.type = "checkUnsaved";
        event.target = window;
        $(window).trigger(event);
        return event.isDefaultPrevented();
    },
    on: function () {
        warnLeavingUnsaved.off();
        $('form').on("submit.warnLeavingUnsaved", function () {
            $(':input[name]', this).each(function () {
                warnLeavingUnsaved.remove(this);
            });
        });
        $('form :input[name]').on("change.warnLeavingUnsaved", function () {
            var jqThis = $(this);
            if (jqThis.hasClass("webui")) {
                if (jqThis.attr("webuiReadyState") != "complete") {
                    return;
                }
            }
            warnLeavingUnsaved.put(this);
        });
        $(window).on("checkUnsaved.warnLeavingUnsaved", function () {
            if (warnLeavingUnsaved._unsavedElements.length > 0) {
                return false;
            }
        });
        $(window).on("beforeunload.warnLeavingUnsaved", function () {
            $(':input').blur();
            if (warnLeavingUnsaved.isUnsaved()) {
                return warnLeavingUnsaved.message;
            }
        });
    },
    off: function () {
        $('form').off(".warnLeavingUnsaved");
        $('form :input[name]').off(".warnLeavingUnsaved");
        $(window).off(".warnLeavingUnsaved");
        warnLeavingUnsaved._unsavedElements = [];
    }
}
$(window).load(function () {
    warnLeavingUnsaved.on();
});

