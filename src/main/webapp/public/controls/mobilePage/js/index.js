//主表
var state_project_main = "true";//项目部状态   在建/竣工
var canEdit_main = "true";//是否可编辑
var sign = "";//点击项目部是清除搜索条件
var load_parameter = {}; //获取列表时所需参数；
var records = 0; //用于判断是否下拉到底
var rows = 10; //每次显示条数
var moveClientYS = 0;
var moveClientYE = 0;

document.addEventListener('touchstart', function (e) {
    moveClientYS = e.changedTouches[0].clientY;
}, false);
document.addEventListener('touchend', function (e) {
    touch_();
    moveClientYE = e.changedTouches[0].clientY;
    if (moveClientYE > moveClientYS && $("#cue_div").children().val() == "到底了") {
        $("#cue_div").children().val(records + "/" + records);
    }
}, false);

// 用于附件的显示
$(function () {
    $(".container input[name='originalCode']").prev().hide();
})
function touch_() {
    $(".container input[name='originalCode']").next().find('ul').css("position", 'relative');
}


// 初始化加载
function myLoad() {
    // 为项目部赋值
    if (initializeParams.permissions) {
        $("#xiao_projectId").mobiscroll().select({
            minWidth: 100,
            data: initializeParams.projectList,
            dataText: "projectName",
            dataValue: "projectId",
            group: true,
            onInit: function (event, inst) {
                $(this).prev().val(initializeParams.projectName);
                $(this).val(initializeParams.projectId);
            },
            onSet: function (event, inst) {
                load_parameter.page = 1;
                load_parameter.projectId = inst._wheelArray[1];
                load_parameter.projectName = inst._value;
                $("#list_div").empty();
                $(this).val(inst._wheelArray[1]);
                if (typeof housejson == 'undefined')
                    click_project_too(inst._wheelArray[1]);
                else
                    getHouse(inst._wheelArray[1], inst._value, function (data) {
                        housejson = data;
                        if (typeof load_list == 'function')
                            load_list.call(this);
                        if (typeof jumpAddUrl == 'function')
                            jumpAddUrl.call(this, {projectId: inst._wheelArray[1], projectName: inst._value});
                    });
                myScroll.refresh();
            }
        });
        $('.icon-xiangxia').on('click', function () {
            $("#xiao_projectId").click();
        });

    } else {
        $("#xiao_projectId").val("无权限");
    }

    //设置滚轮div
    $('#wrapper').height($(window).height() - $('body nav').height() - $('#wrapper').prev().height() + 20);

    // 设置新增及搜索按钮
    $("#master_option").show()
    $("#master_option").find("i").removeClass().addClass("esg-font icon-sousuo");
    $("#master_option").on("click", function () {
        open_search_div();
    });
    $(".m_option").append("<a class='dropdown-toggle navbar-brand' id='master_search' style='padding-left: 0px;' href=''><i class='esg-font icon-xinzeng'></i></a>")
}

//处理单据名
function getCode(proCode) {
    if (proCode == "") {
        proCode = "无数据";
    } else if (proCode.split(";").length > 1) {
        if (proCode.split(";")[1] == "") {
            proCode = proCode.split(";")[0];
        } else {
            proCode = proCode.split(";")[1];
        }
    }
    return proCode;
}

// 根据id获取头像
function getImgById(id) {
    return '/app/userinfo/member_outphoto.jsp?personId=' + id;
}
// 根据name获取头像
function getImgByName(name) {
    return '/app/userinfo/member_outphoto.jsp?name=' + name;
}

//点击项目部
function click_project_too(projectId) {
    if (projectId == "") {
        return;
    } else {
        sign = "true";
    }
    _project(projectId);
}

function _project(projectId) {
    var isHave = false;
    for(var ii = 0 ; ii < initializeParams.projectList.length ; ii++){
        var data = initializeParams.projectList[ii];
        if(projectId != data.projectId)
            continue;
        isHave = true;
        state_project_main = data.projectState+"";
        canEdit_main = data.canUpate+"";
        initializeParams.projectId = data.projectId;
        initializeParams.projectName = data.projectName;
        initializeParams.isReadSelf = data.isReadSelf;
        //在建  可编辑
        if (state_project_main == "true" && canEdit_main == "true")
            $("#master_search").show();
        else
            $("#master_search").hide();
        if (sign.equals("true")) {
            load_parameter.projectId = data.projectId;
            load_parameter.rows = rows;
            jumpAddUrl(data);
            search_show('search_form');
        }
    }
    if(!isHave){
        load_parameter.projectId = "00000000-00000000-00000000";
        $("#master_search").hide();
        load_list();
    }
}

// 高级搜索
function more_search(e) {
    $("#open_btn").hide();
    $("#title_span").html("高级搜索");
    $("#adv_search").show();
}

//弹出搜索框
function open_search_div() {
    $("#search_form input").each(function () {
        var name = $(this).attr("name");
        if (name != "searchKey") {
            if ($(this).val() != "") more_search(this);
        } else {
            $("#open_btn").show();
            $("#title_span").html("搜索");
            $("#adv_search").hide();
        }
    });
    $('#search_form').modal();
}

//流程超期和为超期及完成状态框
function getImgBorder(data) {
    var style = "width: 49px;height:49px;";
    // 有流程并并且没有走完流程
    if (typeof(data.extendTime) != "undefined" && typeof(data.alertTime) != "undefined" && data.isValid == 0) {
        if (data.extendTime.indexOf("/") > 0) {
            data.extendTime = data.extendTime.replace(/[\/]/g, "-").split(" ")[0];
        } else if (data.extendTime.indexOf(" ") > 0) {
            data.extendTime = data.extendTime.split(" ")[0];
        }
        if (data.alertTime.indexOf("/") > 0) {
            data.alertTime = data.alertTime.replace(/[\/]/g, "-").split(" ")[0];
        } else if (data.alertTime.indexOf(" ") > 0) {
            data.alertTime = data.alertTime.split(" ")[0];
        }

        if (getNowFormatDate() > data.extendTime) {
            style += "padding:2px;border:2px solid red";
        } else if (data.alertTime > getNowFormatDate() && getNowFormatDate() > data.extendTime) {
            style += "padding:2px;border:2px solid #2DCC71";
        } else {
            style += "padding:2px;border:2px solid #F8A01A";
        }
    }
    return style;
}

//流程是否完成图标
function getFlowState(data) {
    var stateIco = "<div style='text-align:right'>";
    if (data.isValid == 1) {
        stateIco += '<i class="esg-font icon-chenggong" style="font-size: 17px;color:green"></i>';
    } else {
        stateIco += '<i class="esg-font icon-weiwancheng" style="font-size: 17px;color:black"></i>';
    }
    stateIco += "</div>";
    return stateIco;
}

// 获取当前系统时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//打印图标
function getIcoType1(data) {
    var ico = "<div style='text-align:right'>";
    if (data.printCount!= "" && data.printCount>0) {
        ico += '<i class="esg-font icon-dayin1" style="font-size: 17px;color: green"></i>'
    }
    ico += "</div>";
    return ico;
}
//打印图标
function getIcoType(data) {
    var ico = "<div style='text-align:right'>";
    if (data.printTime != "") {
        ico += '<i class="esg-font icon-dayin1" style="font-size: 17px;color: green"></i>'
    }
    ico += "</div>";
    return ico;
}

// 添加列表项及设置提示框
function setPromptInformation(myDiv, res) {
    $("#list_div").append(myDiv);
    $("#cue_div").show();
    records = res.records;
    if (records > load_parameter.page * rows) {
        $("#cue_div").children().val(load_parameter.page * rows + "/" + records);
    } else {
        $("#cue_div").children().val(records + "/" + records);
    }
}

//只读滑动加载提示框
function setReadPromptInformation(res) {
    records = res.records;
    if (records > load_parameter.page * rows) {
        $("#cue_div").children().val(load_parameter.page * rows + "/" + records);
    } else {
        $("#cue_div").children().val(records + "/" + records);
    }
}

//重置
function search_show(form) {
    $("#" + form + " input").each(function () {
        var name = $(this).attr("name");
        $(this).val("");
    });
    getSearch(form)
}
function dateFormat(obj) {
    if(typeof obj==="string"){
        if(obj.indexOf(" ")===-1){
            return obj+" 00:00:00";
        }else{
            return obj;
        }
    }
    var date = obj.date;
    date = date<10?"0"+date:date;
    var mon = obj.month+1;
    mon = mon<10?"0"+mon:mon;
    var year = obj.year+1900;
    return year+"-"+mon+"-"+date+" "+obj.hours+":"+obj.minutes+":"+obj.seconds;
}

//处理编制时间
function get_shengyu_time(endTime) {
    if (endTime != "") {
        //得到开始时间
        var startDate = new Date();
        //得到结束时间
        var end_sz = endTime.split(/[- :]/);
        var endDate = new Date(parseInt(end_sz[0]), parseInt(end_sz[1]) - 1, parseInt(end_sz[2]), parseInt(end_sz[3]), parseInt(end_sz[4]), end_sz[5] == null ? 0 : parseInt(end_sz[5]));

        //相差秒数
        var sy_1 = parseInt(Date.parse(startDate)) - parseInt(Date.parse(endDate));

        var y = startDate.getYear() - endDate.getYear();
        var d = Math.floor(sy_1 / (24 * 3600 * 1000));
        if (d == 0) {
            d = startDate.getDate() - endDate.getDate();
        }
        var sy_2 = sy_1 % (24 * 3600 * 1000);
        var h = Math.floor(sy_2 / (3600 * 1000));
        var sy_3 = sy_2 % (3600 * 1000);
        var m = Math.floor(sy_3 / (60 * 1000));

        var year = endDate.getFullYear();
        var month = endDate.getMonth() + 1;
//                    month = month < 10 ? ("0" + month) : month;
        var day = endDate.getDate();
//                    day = day < 10 ? ("0" + day) : day;
        var hours = endDate.getHours();
//                    hours = hours < 10 ? ("0" + hours) : hours;
        var min = endDate.getMinutes();
        min = min < 10 ? ("0" + min) : min;

        var sysTime = year + "年" + month + "月" + day + "日";
        if (y == 0) {
            sysTime = month + "月" + day + "日";
            if (d == 0) {
                sysTime = hours + ":" + min;
            } else if (d == 1) {
                sysTime = "昨天";
            }
        }

        return sysTime;
    }
    return null;
};

//查询库房,没有则创建一个
function getHouse(projectId, projectName, callback) {
    $.posts('/app/meterial/output/output_action.jsp?action=getHouse_json', {
        projectId: projectId,
        projectName: projectName
    }, function (data) {
        var res = {houseId: '', houseName: ''};
        if (data.length > 0) {
            res.houseId = data[0].houseId;
            res.houseName = data[0].houseName;
        }
        callback.call(this, res);
    }, 'json')
}
var noPage = {
    //生成无数据页面DIV
    createNoPage: function (node) {
        var isShow = $(node).children().length == 0 ? true : false;
        var noPage = '';
        if (isShow) {
            noPage = $('<div>暂无数据</div>').addClass('no-page').appendTo(node);
        } else {
            $(noPage).remove();
        }
        return noPage;
    },
    //显示
    showNoPage: function () {

    },
    //隐藏
    hideNoPage: function () {

    }
};

/*-------------------------只读页面代码---------------------*/

//添加按钮
function showTopButton(flowDzqk, isValid, type) {
    var ul = '<ul class="dropdown-menu" style="border-radius:6px;">' +
        ' <li id="show_flow" onclick="showFlow()" style="border: none;margin-top: 10px">' +
        '  <i class="esg-font icon-chayueliucheng btn-i" style="color: #fcd240"></i>' +
        '  <span class="btn-span">查看流程</span>' +
        ' </li>' +
        ' <li id="haveInstructions" onclick="output_type(\'preView\',\'hasFlow\')" style="border: none;margin-top: 18px">' +
        '   <i class="esg-font icon-youpizhudayin btn-i" style="color: #00a6e2"></i>' +
        '   <span class="btn-span">有批注打印</span>' +
        ' </li>' +
        ' <li id="noInstructions" onclick="output_type(\'preView\',\'noFlow\')" style="border: none;margin: 18px 0 10px 0">' +
        '   <i class="esg-font icon-youpizhudayin btn-i" style="color: #fb747a"></i>' +
        '   <span class="btn-span">无批注打印</span>' +
        ' </li>' +
        '</ul>';

    $("#btn_div").append(ul);
    // 资金通只有一种打印
    if(type == "zjt") $("#noInstructions").hide();
    // if ("no".equals(flowDzqk)) {
    //     $("#show_flow i,#show_flow span").css("color", "#c4c4c4");
    //     $("#show_flow").removeAttr("onclick");
    // }
    if (isValid != "true") {
        $("#haveInstructions i,#noInstructions i,#haveInstructions span,#noInstructions span").css("color", "#c4c4c4");
        $("#haveInstructions,#noInstructions").removeAttr("onclick");
    }
}

function noflowshow() {
    $.message("此单据暂无审核流程");
}

// 无流程提交没有流程信息
function noFlowState() {
    if ($("#flow_info_div").html().indexOf("无流程信息") > 0 || $("#flow_info_div").html().indexOf("流程审批意见") > 0) {
        $("#show_flow i,#show_flow span").css("color", "#c4c4c4");
        $("#show_flow").removeAttr("onclick");
    }
}