/**
 * Created by tanhuan on 2017/3/6.
 */
$(function () {
    $('body').on('click', '.a_s_s', function () {
        $(".side_left").animate({"width": "60px"}, function () {
            $(".a_s_s").addClass("a_z_k").removeClass("a_s_s");
        });
        $(".outd").find("ul").slideUp()
        $(".content_admin").animate({"margin-left": "80px"});
        //alert("dd");
    });
    $('body').on('click', '.a_z_k', function () {
        $(".side_left").animate({"width": "200px"}, function () {
            $(".a_z_k").removeClass("a_z_k").addClass("a_s_s");
        });
        $(".content_admin").animate({"margin-left": "220px"});
        //alert("dd");.glyphicon .glyphicon-file
    });

    var json = [
        {
            "name": "写日志",
            "userLevel": "写日志",
            "url": "baidu.com"
        },
        {
            "name": "基础办公",
            "userLevel": "基础办公",
            "list": [
                {
                    //显示名称
                    "name": "日程",
                    //用户等级
                    "userLevel": "日程",
                    //下级
                    "list": [
                        {
                            "name": "我的日程",
                            "url": "baidu.com",
                            "userLevel": "我的日程"
                        },
                        {
                            "name": "日程安排",
                            "url": "baidu.com",
                            "userLevel": "日程安排"
                        }
                    ]
                },
                {
                    //显示名称
                    "name": "日志",
                    //用户等级
                    "userLevel": "日志",
                    //下级
                    "list": [
                        {
                            "name": "撰写日志",
                            "url": "baidu.com",
                            "userLevel": "撰写日志"
                        },
                        {
                            "name": "查阅日志",
                            "url": "baidu.com",
                            "userLevel": "查阅日志"
                        }
                    ]
                }
            ]
        },
        {
            "name": "报表管理",
            "userLevel": "报表管理",
            "list": [
                {
                    //显示名称
                    "name": "资金报表",
                    //用户等级
                    "userLevel": "资金报表",
                    //下级
                    "list": [
                        {
                            "name": "资金收入报表",
                            "url": "baidu.com",
                            "userLevel": "资金收入报表"
                        },
                        {
                            "name": "资金支出总表",
                            "url": "baidu.com",
                            "userLevel": "资金支出总表"
                        }
                    ]
                }
            ]
        }
    ];
    /*递归实现获取无级树数据并生成DOM结构*/
    var str = "";
    var forTree = function (o) {
        for (var i = 0; i < o.length; i++) {
            var urlstr = "";
            try {
                if (typeof o[i]["url"] == "undefined") {
                    urlstr = "<div class='outd'><span><i class='glyphicon glyphicon-pencil'></i>" + o[i]["userLevel"] + "<em class='glyphicon glyphicon-chevron-right'></em></span><ul>";//+ o[i]["name"]
                } else {
                    urlstr = "<div class='outd'><span><i class='glyphicon glyphicon-pencil'></i><a href=" + o[i]["url"] + ">" + o[i]["name"] + "</a></span><ul>";
                }
                str += urlstr;
                if (o[i]["list"] != null) {
                    forTree(o[i]["list"]);
                }
                str += "</ul></div>";
            } catch (e) {
            }
        }
        return str + "<a class='a_s_s glyphicon glyphicon-resize-horizontal'></a>";
    }
    /*添加无级树*/
    $("#menuTree").html(forTree(json));

    /*树形菜单*/
    var menuTree = function () {
        //给有子对象的元素加
        $("#menuTree ul").each(function (index, element) {
            var ulContent = $(element).html();
            var spanContent = $(element).siblings("span").html();
            if (ulContent) {
                $(element).siblings("span").html(spanContent)
            }
        });

        $("#menuTree").find("div span").click(function () {
            var ul = $(this).siblings("ul");
            var spanStr = $(this).html();
            var spanContent = spanStr.substr(3, spanStr.length);
            if (ul.find("div").html() != null) {
                if (ul.css("display") == "none") {
                    ul.slideDown();
                    // $(this).html("[-]" + spanContent);
                } else {
                    ul.slideUp();
                    // $(this).html("[+] " + spanContent);
                }
            }
            $(".side_left").animate({"width": "200px"}, function () {
                $(".a_z_k").removeClass("a_z_k").addClass("a_s_s");
            });
            $(".content_admin").animate({"margin-left": "220px"});
            $(this).parents(".outd").siblings(".outd").find("ul").slideUp();
            $(this).parents(".outd").find("span").eq(0).addClass("a_active");
            $(this).parents(".outd").siblings(".outd").find("span").removeClass("a_active");
        })
    }();
    /*二级*/
    $(".outd ul .outd span i").addClass("glyphicon-file").removeClass("glyphicon-pencil");
    /*三级*/
    $(".outd ul .outd ul .outd span i").addClass("glyphicon-folder-open").removeClass("glyphicon-pencil glyphicon-file");
    /*图标*/
    //$(".outd span").parents(".outd").eq(0).find("span").eq(0).addClass("glyphicon-folder-open").removeClass("glyphicon-pencil glyphicon-file");
    $("i.glyphicon-pencil").eq(1).addClass("glyphicon-briefcase").removeClass("glyphicon-file");
    $("i.glyphicon-pencil").eq(2).addClass("glyphicon-book").removeClass("glyphicon-pencil glyphicon-file");
});

function pent(s) {
    return s < 10 ? '0' + s : s;
}
function run_time() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours();       //获取当前小时数(0-23)
    var m = myDate.getMinutes();     //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    //生成年月日时分秒
    var now = year + '年' + pent(month) + "月" + pent(date) + "日 " + pent(h) + ':' + pent(m) + ":" + pent(s);
    $(".a_time").text(now);
    //组织判断周几格式月/日/年
    var a_weeks = pent(month) + '/' + pent(date) + '/' + year;
    //判断是星期几
    var a_date = a_weeks;
    var a_day = new Date(Date.parse(a_date));
    var a_today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    var a_week = a_today[a_day.getDay()];
    $(".a_week").text(a_week);
}
$(function () {
    run_time();//时间
    $(window).resize(function () {          //当浏览器大小变化时
        //a_zhuzhuang();//柱状图
    });
});