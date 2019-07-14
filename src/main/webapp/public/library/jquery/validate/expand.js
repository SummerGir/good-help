/*
* Translated default messages for the jQuery validation plugin.
* Locale: CN
*/
jQuery(function($) {
    $.validator.methods.date = function(value, element) {
        var re = this.optional(element)
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


    };
});