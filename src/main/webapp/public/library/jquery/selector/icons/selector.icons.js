(function ($, undefined) {
    $.selector.icons = function (value) {
        return $.selector({
            title: '图标选择器',
            multiple: false,
            values: [value],
            tabs: [
                {
                    label: '图标列表',
                    template: 'tree',
                    option: {
                        url: '/public/jquery/selector/icons/selector.icons.jsp'
                    }
                }
            ]
        });
    }

})(jQuery);