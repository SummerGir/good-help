
require.config({
    paths: {
        "jquery.validate": "/public/jquery/validate/jquery.validate",
        "jquery.validate.messages": "/public/jquery/validate/messages_zh"
    }
});
require(['jquery.validate.messages'],function () {
    $.validator.methods.date = function (value, element) {
        var re = this.optional(element);
        if (re) return re;


        try {
            var v = value.replace(/-/g, ',');
            v = v.replace(/ /g, ',');
            v = v.replace(/:/g, ',');
            v = v.replace(/\./g, ',');
            eval('var nv = new Date(' + v + ');');

            return !/Invalid|NaN/.test(nv);

        } catch (e) {
            return re;
        }
        '/public/jquery/validate/messages_zh.js'

    };
});