<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
<title>载入中...</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<script type="text/javascript" src="/public/library/eiis.js"></script>
<script type="text/javascript">
    EIIS.Common.loadComponent(EIIS.Common.jQuery.ui);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.dynatree);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.inputtags);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.selector);
    EIIS.Common.loadComponent(EIIS.Common.jQuery.jqGrid);
    EIIS.Common.loadComponent(EIIS.Common.WebUI);
</script>
<script type="text/javascript">

    if (typeof (dialogArguments) == "undefined") {
        alert('调用该程序请使用 showModalDialog 方法!');
        window.opener = null;
        window.close();
    }

    window.returnValue = null;
</script>
<script type="text/javascript">
    //for debug
    //        var self = window.opener.s;
    //        var options = {
    //            multiple: true,
    //            root: '',
    //            freeze: false,
    //            dept: true,
    //            post: true,
    //            person: true,
    //            selectRoot: true,
    //            //attr:true,
    //            //attrChild:true,
    //            attrCode: '',
    //            attrValue: '',
    //            values: [],
    //            //callback
    //            ok: null, //fire on ok buttion click
    //            cancel: null  //fire on cancel buttion click
    //        };
    //        var selft = {};
    //        self.option = {};
    //        self.option.tabs = [
    //            {
    //                label: '部门',
    //                template: 'tree',
    //                option: {
    //                    url: '/public/memberselector/getdept.jsp',
    //                    data: {
    //                        'root': options.root,
    //                        'freeze': options.freeze,
    //                        'dept': options.dept,
    //                        'post': options.post,
    //                        'person': options.person,
    //                        'selectRoot': options.selectRoot
    //                    }
    //                }
    //            },
    //            {
    //                label: '人员',
    //                template: 'tree',
    //                option: {
    //                    url: '/public/memberselector/getdeptperson.jsp',
    //                    data: {
    //                        'root': options.root,
    //                        'freeze': options.freeze,
    //                        'dept': options.dept,
    //                        'post': options.post,
    //                        'person': options.person,
    //                        'selectRoot': options.selectRoot
    //                    }
    //                }
    //            }
    //        ];
    var self = dialogArguments;
    $().ready(function () {//alert(a);

        var lcList = [];

        $.each(self.option.tabs, function () {
            this.template = new $.selector.template[this.template](self, this.option);
            lcList = lcList.concat(this.template.loadComponent);
        });

        if (self.option.tabs.length > 1) {
            //lcList = lcList.concat(EIIS.Common.jQuery.ui.tabs.paging);
        }

        $.each(lcList, function (i) {
            EIIS.Common.loadComponent(lcList[i]);
        });

        $("#btnOK").click(function () {//alert(a);
            if (jQuery.isFunction(self.option.define)) {//alert(a)
                self.option.define.call(window, self.values, self.format(self.values), self);
            }
            window.returnValue = self.values;
            window.close();
        });

        $("#btnCancel").click(function () {
            if (jQuery.isFunction(self.option.cancel)) {//alert(a)
                self.option.cancel.call(window);
            }
            window.close();
        });

        $(window).on("unload", function () {
            if (jQuery.isFunction(self.option.close)) {//alert(a)
                self.option.close.call(window);
            }
        });
    });

</script>
<script type="text/javascript">
    $().ready(function () {//alert(a);
        var _selectListArea = $('.selectListArea');
        var _selectedArea = $('.selectedArea');
        var refreshTabPanel = function () {
        };
        _selectListArea.tabs({
            collapsible: false,
            closeable: false,
            heightStyle: "fill",
            show: function (event, ui) {
                if (String.isNullOrEmpty($(ui.panel).html())) {
                    self.option.tabs[ui.index].template.create($(ui.panel));
                }
            }
        });
        if (self.option.tabs.length > 1) {
            $.each(self.option.tabs, function (i, tab) {
                _selectListArea.tabs("add", "#" + tab.label, tab.label, i);
            });
        } else {
            _selectListArea.tabs("add", "#" + self.option.tabs[0].label, self.option.tabs[0].label, 0);
        }

        if (self.option.multiple) {
            _selectedArea.inputTags({
                tags: self.format(self.values),
                abreast: false,
                afterRemove: function (value, data) {
                    self._triggerRemove(value);
                }
            });
        } else {
            _selectedArea.parent().hide();
            _selectListArea.width(_selectListArea.parent().width() * 0.985);
        }
        document.title = self.option.title + " - 选择器";
    });
</script>
<script type="text/javascript">
    $().ready(function () {
        self.on('add', function (key, data) {
            $('.selectedArea').inputTags('addTag', data);
        });
        self.on('remove', function (key) {
            $('.selectedArea').inputTags('removeTag', key);
        });
    });
</script>
<style type="text/css">
    html {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    body {
        margin: 1px;
        padding: 0;
        font-size: 12px;
    }

    .webui-selector-wrap {
        position: relative;
        overflow: hidden;
        /*for ie6*/
        zoom:1;
    }

    .webui-selector-list {
        width: 391px;
        height: 510px;
        float: left;
        overflow: hidden;
    }

    .webui-selector-data {
        position: absolute;
        right: 0;
        width: 194px;
        height: 515px;
    }

    .webui-selector-data .webui-selector-data-title {
        height: 26px;
        line-height: 26px;
        vertical-align: middle
    }

    .webui-selector-button {
        width: 99%;
        text-align: right;
        padding: 10px 20% 0px 0px;
    }

    .ui-tabs .ui-tabs-panel {
        padding-top: 1px;
        padding-left: 2px;
    }

    .selectListArea {
    }

    .selectedArea {
        overflow: auto;
        height: 487px;
    }
</style>
</head>
<body>
<div class="webui-selector-wrap">
    <div class="selectListArea webui-selector-list ui-widget-content">
        <ul></ul>
    </div>
    <div class="webui-selector-data ui-corner-all ui-widget-content">
        <div class="webui-selector-data-title ui-corner-top ui-widget-header">已经选择的数据:</div>
        <div class="selectedArea"></div>
    </div>
</div>
<div class="webui-selector-button">
    <input type="button" value=" 确 定 " class="webui" id="btnOK"/>&nbsp;&nbsp;
    <input type="button" value=" 取 消 " class="webui" id="btnCancel"/>
</div>
</body>
</html>
