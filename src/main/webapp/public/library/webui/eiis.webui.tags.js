
$().ready(function () {
    $(':text.webui.tags').livequery(function () {
        var $this = $(this);
        if ($this && $this.inputTags) {

            this['expand'] = {
                'change': null
                , 'display': null
                , 'hook': null
            };

            var $display = $('<div />');

            if ($this.attr('borderstyle')) {
                $display.attr('style', $this.attr('borderstyle'));
            }
            if ($this.attr('bordercss')) {
                $display.addClass($this.attr('bordercss'));
            }

            $this.hide();
            $this.data('display', $display);
            $this.after($display);

            var GetFormatText = function (values) {
                var newTags;
                if ($this.attr('formatText')) {
                        eval('var _ft = function(values) {' + $this.attr('formatText') + '}');
                        newTags = _ft.call($this[0], values);
                }else{
                    newTags = values;
                }
                return newTags;
            }

            this['expand']['change'] = function () {
                var $this = $(this);
                if ($this.data('value') != $this.val()) {
                    $this.data('value', $this.val());
                    var values = $this.val().split(';');
                    $this.data('display').inputTags('setTags', GetFormatText(values));
                }
            };
            this['expand']['display'] = $display;

            $display.inputTags({
                tags: GetFormatText($this.val().split(';')),
                select:{
                    element: $this.attr('selectElement') ? $this.attr('selectElement') : "<a href=\"#\" onclick=\"javascript:return false;\">请选择...</a>", //选择事件触发对象
                    onFire: function () {
                        if ($this.attr('onFireSelect')) {
                            //var values = $this.val().split(';');
                            eval('var _fc = function() {' + $this.attr('onFireSelect') + '}');
                            return GetFormatText(_fc.call($this[0]));
                        }
                    }
                },
                abreast: $this.attr('abreast') ? Boolean.parse($this.attr('abreast')) : true,
                afterAdd: function () {
                    var tags = $this.data('display').inputTags('getTagsValue');
                    $this.data('value', tags.join(';'));
                    $this.val($this.data('value'));
                },
                afterRemove: function () {
                    var tags = $this.data('display').inputTags('getTagsValue');
                    $this.data('value', tags.join(';'));
                    $this.val($this.data('value'));
                }
            });

            this['expand']['hook'] = new $.hook('val', function () {
                if (arguments.length > 0) {
                    if ($this.data('value') != $this.val()) {
                        $this.change();
                    }
                }
            }).on();

            $this.on('change', this['expand']['change']).change();

        }
    }
    , function () {
        var $this = $(this);
        if ($this) {
            var expand = this['expand'];
            expand['hook'].off();
            $this.off('change', expand['change']);
            expand['display'].remove();
            $this.show();
        }
    });

});