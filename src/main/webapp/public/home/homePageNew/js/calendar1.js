// 关于月份： 在设置时要-1，使用时要+1
$(function () {

  $('#calendars').calendars({
    ifSwitch: true, // 是否切换月份
    hoverdates: true, // hover是否显示当天信息
    backTodays: true // 是否返回当天
  });

});

;(function ($, window, document, undefined) {

  var Calendars = function (elem, options) {
    this.$calendar = elem;

    this.defaults = {
      ifSwitch: true,
      hoverdates: false,
      backTodays: false
    };

    this.opts = $.extend({}, this.defaults, options);

    // console.log(this.opts);
  };

  Calendars.prototype = {
    showHoverInfos: function (obj) { // hover 时显示当天信息
      var datesStr_ = $(obj).attr('data');
      var offset_t_ = $(obj).offset().top + (this.$calendar_today.height() - $(obj).height()) / 2;
      var offset_l_ = $(obj).offset().left + $(obj).width();
      var changeStr_ = datesStr_.substr(0, 4) + '-' + datesStr_.substr(4, 2) + '-' + datesStr_.substring(6);
      var weeks_ = changingStrs(changeStr_).getDay();
      var weeksStr_ = '';

      this.$calendar_today.hide();

      this.$calendar_today
          .css({left: offset_l_ + 30, top: offset_t_})
          .stop()
          .animate({left: offset_l_ + 16, top: offset_t_, opacity: 1});

      switch(weeks_) {
        case 0:
          weeksStr_ = '星期日';
          break;
        case 1:
          weeksStr_ = '星期一';
          break;
        case 2:
          weeksStr_ = '星期二';
          break;
        case 3:
          weeksStr_ = '星期三';
          break;
        case 4:
          weeksStr_ = '星期四';
          break;
        case 5:
          weeksStr_ = '星期五';
          break;
        case 6:
          weeksStr_ = '星期六';
          break;
      }

      this.$calendarToday_dates.text(changeStr_);
      this.$calendarTodayweeks_.text(weeksStr_);
    },

    showCalendars: function () { // 输入数据并显示
      var self = this;
      var year = datesObj.getDate().getFullYear();
      var month = datesObj.getDate().getMonth() + 1;
      var datesStr = returndatesStrs(datesObj.getDate());
      var firstDay = new Date(year, month - 1, 1); // 当前月的第一天

      this.$calendartitles_text.text(year + '年' + datesStr.substr(4, 2)+"月");

      this.$calendardates_items.each(function (i) {
        // allDay: 得到当前列表显示的所有天数
        var allDay = new Date(year, month - 1, i + 1 - firstDay.getDay());
        var allDay_str = returndatesStrs(allDay);

        $(this).text(allDay.getDate()).attr('data', allDay_str);

        if (returndatesStrs(new Date()) === allDay_str) {
          $(this).attr('class', 'items items-curDay');
        } else if (returndatesStrs(firstDay).substr(0, 6) === allDay_str.substr(0, 6)) {
          $(this).attr('class', 'items items-curMonth');
        } else {
          if(returndatesStrs(firstDay).substr(0, 6) > allDay_str){
            $(this).attr('class', 'items before');
          }else{
            $(this).attr('class', 'items last');
          }
        }
      });
    },

    renderDOM: function () { // 渲染DOM
      this.$calendar_titles = $('<div class="calendars-titles"></div>');
      this.$calendarweeks_ = $('<ul class="calendars-weeks"></ul>');
      this.$calendar_dates = $('<ul class="calendars-dates"></ul>');
      this.$calendar_today = $('<div class="calendars-today"></div>');


      var _titlesStr = '<a href="#" class="titles"></a>'+
          '<a href="javascript:;" id="backTodays" hidden>今</a>'+
          '<div class="arrow">'+
          '<span class="arrow-prevs"><</span>'+
          '<span class="arrow-nexts">></span>'+
          '</div>';
      var weeksStr_ = '<li class="items">日</li>'+
          '<li class="items">一</li>'+
          '<li class="items">二</li>'+
          '<li class="items">三</li>'+
          '<li class="items">四</li>'+
          '<li class="items">五</li>'+
          '<li class="items">六</li>';
      var datesStr_ = '';
      var _dayStr = '<i class="triangle"></i>'+
          '<p class="dates"></p>'+
          '<p class="weeks"></p>';

      for (var i = 0; i < 6; i++) {
        datesStr_ += '<li class="items">26</li>'+
            '<li class="items">26</li>'+
            '<li class="items">26</li>'+
            '<li class="items">26</li>'+
            '<li class="items">26</li>'+
            '<li class="items">26</li>'+
            '<li class="items">26</li>';
      }

      this.$calendar_titles.html(_titlesStr);
      this.$calendarweeks_.html(weeksStr_);
      this.$calendar_dates.html(datesStr_);
      this.$calendar_today.html(_dayStr);

      this.$calendar.append(this.$calendar_titles, this.$calendarweeks_, this.$calendar_dates, this.$calendar_today);
      this.$calendar.show();
    },

    inital: function () { // 初始化
      var self = this;

      this.renderDOM();

      this.$calendartitles_text = this.$calendar_titles.find('.titles');
      this.$backTodays = $('#backTodays');
      this.$arrow_prev = this.$calendar_titles.find('.arrow-prevs');
      this.$arrow_next = this.$calendar_titles.find('.arrow-nexts');
      this.$calendardates_items = this.$calendar_dates.find('.items');
      this.$calendarToday_dates = this.$calendar_today.find('.dates');
      this.$calendarTodayweeks_ = this.$calendar_today.find('.weeks');

      this.showCalendars();

      if (this.opts.ifSwitch) {
        this.$arrow_prev.bind('click', function () {
          $('#backTodays').show();
          var _dates = datesObj.getDate();

          datesObj.setdates(new Date(_dates.getFullYear(), _dates.getMonth() - 1, 1));

          self.showCalendars();
        });

        this.$arrow_next.bind('click', function () {
          $('#backTodays').show();
          var _dates = datesObj.getDate();

          datesObj.setdates(new Date(_dates.getFullYear(), _dates.getMonth() + 1, 1));

          self.showCalendars();
        });
      }

      if (this.opts.backTodays) {
        this.$backTodays.bind('click', function () {
          $(this).hide();
          if (!self.$calendardates_items.hasClass('items-curDay')) {
            datesObj.setdates(new Date());

            self.showCalendars();
          }
        });
      }

      this.$calendardates_items.hover(function () {
        self.showHoverInfos($(this));
      }, function () {
        self.$calendar_today.css({left: 0, top: 0}).hide();
      });
    },

    constructor: Calendars
  };

  $.fn.calendars = function (options) {
    var calendars = new Calendars(this, options);

    return calendars.inital();
  };


  // ========== 使用到的方法 ==========

  var datesObj = (function () {
    var _dates = new Date();

    return {
      getDate: function () {
        return _dates;
      },

      setdates: function (dates) {
        _dates = dates;
      }
    }
  })();

  function returndatesStrs(dates) { // 日期转字符串
    var year = dates.getFullYear();
    var month = dates.getMonth() + 1;
    var day = dates.getDate();

    month = month <= 9 ? ('0' + month) : ('' + month);
    day = day <= 9 ? ('0' + day) : ('' + day);

    return year + month + day;
  };

  function changingStrs(fdates) { // 字符串转日期
    var fulldates = fdates.split("-");

    return new Date(fulldates[0], fulldates[1] - 1, fulldates[2]);
  };

})(jQuery, window, document);