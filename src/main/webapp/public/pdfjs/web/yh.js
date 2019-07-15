/**
 * Created by Yihu on 2017/10/16.
 */
$(document).ready(function () {
    touchScale("body");
});

var touchScale = function (seletor) {
    var s_start, s_end,count=0;
    $(document).on('touchstart touchmove touchend', seletor, function (event) {
        try {
            var touch1 = event.originalEvent.touches[0],  // 第一根手指touch事件 event.originalEvent.targetTouches
                touch2 = event.originalEvent.touches[1],  // 第二根手指touch事件
                fingers = event.originalEvent.touches.length;   // 屏幕上手指数量
            $("#yh_f").prepend(fingers+"; ");
            $("#yh_err").text(++count);

            if(fingers==2){
                event.preventDefault();
            }
            //手指放到屏幕上的时候，还没有进行其他操作
            if (event.type == 'touchstart') {
                if (fingers == 2) {
                    var x = Math.abs(touch1.pageX - touch2.pageX);
                    var y = Math.abs(touch1.pageY - touch2.pageY);
                    s_start = parseInt(Math.sqrt(x * x + y * y));
                } else {
                    s_start = null, s_end = null;
                }
            }
            //手指在屏幕上滑动
            else if (event.type == 'touchmove') {
                if (fingers == 2) {
                    var x = Math.abs(touch1.pageX - touch2.pageX);
                    var y = Math.abs(touch1.pageY - touch2.pageY);
                    s_end = parseInt(Math.sqrt(x * x + y * y));
                    if (s_start && s_end && s_start != s_end) {
                        var cz = s_end - s_start;
                        var cz_zoom =parseFloat((cz*0.05).toFixed(3));
                        s_start = s_end;
                        (function (cz_zoom) {
                            cz_zoom = cz_zoom>0.2?0.2:cz_zoom;
                            cz_zoom = cz_zoom< -0.2?-0.2:cz_zoom;
                            setTimeout(function () {
                                if(PDFViewerApplication && PDFViewerApplication.pdfViewer && PDFViewerApplication.pdfViewer.currentScale!==null){
                                    if(cz_zoom +PDFViewerApplication.pdfViewer.currentScale >5){
                                        PDFViewerApplication.pdfViewer.currentScale=5;
                                    }else if(cz_zoom +PDFViewerApplication.pdfViewer.currentScale <0.2){
                                        PDFViewerApplication.pdfViewer.currentScale = 0.2;
                                    }else {
                                        PDFViewerApplication.pdfViewer.currentScale +=cz_zoom;
                                    }
                                }
                            },1);
                        })(cz_zoom);
                    }
                }
            }
            else if (event.type == 'touchend') {
            }
        } catch (err) {
        }

    });
};
