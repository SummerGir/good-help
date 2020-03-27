;(function ($, window, document, undefined) {
    var Upload = function (el, setting) {
        this._default = {
            data:[],
            maxcount:5,
            maxsize:5,
            allow:".jpg|.jpef|.png|.image|.gif|.bmp"
        };
        this._option = $.extend(this._default,setting);
        this.url = null;
        this.getValue = function () {

        };
        this.setValue = function (arr) {
            for(var i=0;i<arr.length;i++){
                $(el).append("<img src='"+arr[i]+"'/>");
            }
        };

    };
    window.Upload = Upload;

})(jQuery, window, document, undefined);