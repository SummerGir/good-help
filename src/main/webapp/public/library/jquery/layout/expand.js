; (function ($) {

    //$.extend($.layout,  {
    // 	language: {
    // 	        Open:			"打开"
    //         ,	Close:			"关闭"
    //         ,	Resize:			"调整"
    //         ,	Slide:			"滑开"
    //         ,	Pin:			"固定"
    //         ,	Unpin:			"自动隐藏"
    //         ,	noRoomToOpenTip: "没有足够的空间来显示此窗格。"
    //         ,	pane:					"窗格"		// description of "layout pane element"
    //         ,	selector:				"选择"	// description of "jQuery-selector"
    //         ,	errButton:				"错误添加按钮 \n\n无效 "
    //         ,	errContainerMissing:	"UI Layout 初始化错误\n\n不存在指定的布局容器。"
    //         ,	errCenterPaneMissing:	"UI Layout 初始化错误\n\n该中心窗格元素不存在。\n\n中心窗格中是一个必需的元素。"
    //         ,	errContainerHeight:		"UI Layout 初始化警告\n\n布局容器 \"CONTAINER\" 没有高度。.\n\n因此布局为0的高度，因此“无形”！"
    //     }
    // });

    $.extend(true, $.layout.defaults, {
        errors: {
            pane: "窗格"		// description of "layout pane element" - used only in error messages
            , selector: "选择"	// description of "jQuery-selector" - used only in error messages
            , addButtonError: "错误添加按钮 \n\n无效 "
            , containerMissing: "UI Layout 初始化错误\n\n不存在指定的布局容器。"
            , centerPaneMissing: "UI Layout 初始化错误\n\n该中心窗格元素不存在。\n\n中心窗格中是一个必需的元素。"
            , noContainerHeight: "UI Layout 初始化警告\n\n布局容器 \"CONTAINER\" 没有高度。.\n\n因此布局为0的高度，因此“无形”！"
            , callbackError: "UI Layout 回调错误\n\n这个事件的回调不是一个有效的函数。"
        },
        panes: {
            tips: {
                Open: "打开"		// eg: "Open Pane"
		        , Close: "关闭"
		        , Resize: "调整"
		        , Slide: "滑开"
		        , Pin: "固定"
		        , Unpin: "自动隐藏"
		        , noRoomToOpen: "没有足够的空间来显示此窗格。"	// alert if user tries to open a pane that cannot
		        , minSizeWarning: "面板已经达到最小尺寸"	// displays in browser statusbar
		        , maxSizeWarning: "面板已经达到最大尺寸"	// ditto
            }
        }
    });

})(jQuery);
