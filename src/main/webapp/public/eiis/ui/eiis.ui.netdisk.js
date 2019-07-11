(function ($, undefined) {
    EIIS.UI.register("netdisk", {
        _jqElement: null,
        _jqButton: null,
        _jqTagElement: null,
        _jqSelectedView:null,
        _jqNetdisk:null,
        _jqUploadModal:null,
        _jqUploadInput:null,
        _jqUploadOk:null,
        _innerVal: false,
        _isExcelUpload: false,
        _params: null,
        _random:null,
        create: function () {
            var self = this;
            self._random= Math.floor(Math.random()*999+1);
            self._jqElement = $(self.element);
            if (self.element.tagName.toLowerCase() != "input") throw ("初始化标签不是input!");
            var params = {
                readonly: self._jqElement.prop('disabled'),
                multiple: self._jqElement.attr('data-multiple') ? Boolean.parse(self._jqElement.attr('data-multiple')) : true,
                dirCode:self._jqElement.attr("data-dir-code") ? self._jqElement.attr('data-dir-code') : '',
                isSource:self._jqElement.attr("data-isSource") ? self._jqElement.attr('data-isSource') : '',//true：随手记来源  false：业务单据   null：其他来源
                projectId:self._jqElement.attr("data-projectId") ? self._jqElement.attr('data-projectId') : '',   //单据的项目id
                sourceKind:self._jqElement.attr("data-sourceKind") ? self._jqElement.attr('data-sourceKind') : '',   //单据的项目id
                formCode:self._jqElement.attr("data-formCode") ? self._jqElement.attr('data-formCode') : '',   //单据的项目id
                values:[]
                //values:self._jqElement.val().split(";")
            };

            self._params = params;
            self._jqElement.hide();
            //var excludes = params.exclude.split(";");


            self._jqTagElement = $('<div/>').insertAfter(self._jqElement);
            //self._jqTagElement.append('<a type="button" id="originalImage"><i class="fa fa-plus" style="margin-right: 3px;"></i><span>选择原始单据</span></a>');
            var htmlTemplate = [
                '<div class="btn-group">',
                '<a class="btn btn-default hasfile" disabled role="button" aria-expanded="false" aria-haspopup="true" href="#" data-toggle="dropdown"><span class="text">无附件</span>&nbsp;<span class="caret" style="display: none" ></span></a>',
                '<ul class="dropdown-menu" aria-labelledby="drop8">',
                //'<li class="divider" role="separator"></li>',
                '</ul>',

                '<a class="btn btn-default btn-upload" href="#">上传</a>',
                '<a class="btn btn-default btn-netdisk" href="#">网盘</a>',
                '</div>'
            ].join("");
            self._jqTagElement.append(htmlTemplate);

            //upload template
            var uploadModal = [
                '<div id="eiis-selectorNetdiskUploadModal'+self._random+'" class="modal fade netdisk-upload" tabindex="-1" aria-hidden="true" data-backdrop="static">',
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">上传文件</h4></div>',
                '<div class="modal-body">',
                '<form role="form">',
                '<div class="form-group">',
                '<input id="eiis-selectorNetdiskUploadInput'+self._random+'" class="eiis-file multiple" name="attachment" />',
                '</div>',
                '</form>',
                '</div>',
                '<div class="modal-footer">',
                '<button id="eiis-selectorNetdiskUploadOk'+self._random+'" type="button" class="btn btn-primary"><i class="fa fa-check"></i>提交</button>',
                '<button type="button" class="eiis-button btn-default" data-dismiss="modal"><i class="fa fa-close"></i>关闭</button>',
                '</div>',
                '</div>',
            ].join("");

            self._jqUploadModal = $('#eiis-selectorNetdiskUploadModal' + self._random);
            self._jqUploadOk = $("#eiis-selectorNetdiskUploadOk"+self._random);
            self._jqUploadInput = $("#eiis-selectorNetdiskUploadInput"+self._random);
            if (self._jqUploadModal.length == 0) {
                $("body").append(uploadModal);
                self._jqUploadModal = $('#eiis-selectorNetdiskUploadModal' + self._random);
                self._jqUploadModal.on('show.bs.modal', function (e) {
                    //$("#eiis-selectorNetdiskModal"+random+" .fa-hover.activated").removeClass("activated");

                })

                self._jqUploadInput = $("#eiis-selectorNetdiskUploadInput"+self._random);

                self._jqUploadOk = $("#eiis-selectorNetdiskUploadOk"+self._random);
                self._jqUploadOk.on("click",function(){
                    self._uploadOk();
                });
            }

            self._jqTagElement.find("a").css({
                "padding":"0px 12px",
                "border-color": "#046eb8",
                "background-color": "#046eb8",
                "color": "#ffffff"
            });

            self._jqSelectedView = self._jqTagElement.find(".dropdown-menu");
            self._jqUpload = self._jqTagElement.find(".btn-upload");
            self._jqUpload.on("click",function(){
                self._jqUploadModal.find(".document-list").find('tr').remove();  //清空上次上传的
                if(self._jqElement.attr('excelUpload')) {
                    self._jqUploadModal.find('input[type="file"]').attr('excelUpload', self._jqElement.attr('excelUpload'));
                }
                self._jqUploadModal.modal();
            });
            self._jqNetdisk = self._jqTagElement.find(".btn-netdisk").on("click",function() {
                $.selector.netdisk($.extend(true, {}, params, {
                    ok: function (data) {
                        if(self._params.formCode && !self._params.formCode.isEmpty()
                            && self._params.sourceKind && !self._params.sourceKind.isEmpty()){
                            $.ajax({
                                url:"/public/controls/selector/netdisk/selector.netdisk.copy.jsp",
                                type:"post",
                                dataType:"json",
                                cache:false,
                                data:{value:data.ids.join(";"),
                                    isSource:self._params.isSource,
                                    sourceKind:self._params.sourceKind,
                                    formCode:self._params.formCode,
                                    projectId:self._params.projectId},
                                success:function(data1){
                                    if(data1){
                                        self._updateValue(data1.ids.join(";"),false);
                                        self._updateSelectedView(data1,false);   // 从网盘选择ok 1
                                    }
                                }
                            });
                        }else{
                            self._updateValue(data.ids.join(";"),false);
                            self._updateSelectedView(data,false);   // 从网盘选择ok 1
                        }


                    }
                }))
            });


            self._jqSelectedView.on("click",".btn-warning",function(){
                var jqI = $(this);
                var id = jqI.attr("data-doc-id");
                if(id){
                    jqI.closest("li").remove();
                    var value = self._jqElement.val();
                    var _values = [];
                    $.each(value.split(";"),function(i,o){
                        if(o != id){
                            _values.push(o);
                        }
                    });
                    self._innerVal = _values.join(";");
                    self._jqElement.val(self._innerVal);
                    self._allDownBtn();
                    if(self._jqSelectedView.children('li').length>0){
                        self._jqTagElement.find(".text").text("附件("+self._jqSelectedView.children('li').length+")");
                        self._jqTagElement.find(".hasfile").removeAttr("disabled");
                        self._jqTagElement.find(".caret").show();

                    }else{
                        self._jqTagElement.find(".text").text("无附件");
                        self._jqTagElement.find(".hasfile").trigger("click");
                        self._jqTagElement.find(".hasfile").attr("disabled","disabled");
                        self._jqTagElement.find(".caret").hide();
                    }
                }
                return false;
            });

            //self._jqTagElement
            var defaultValues = self._jqElement.val();
            if (defaultValues) {
                //params.ids = self._jqElement.val().split(";").join(",");
                $.ajax({
                    url: '/public/controls/selector/netdisk/selector.netdisk.query.jsp',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: {values:self._jqElement.val().split(";")},
                    success: function (data) {
                        if (data) {
                            var rs = {ids:[],items:[]};
                            $.each(data,function(i,o){
                                rs.ids.push(o.id);
                                rs.items.push({name: o.name,id: o.id,url: o.filePath})
                            });
                            self._innerVal = defaultValues;
                            self._updateSelectedView(rs,true);   //默认值 2
                        }
                    }
                });
            }

            if (params.readonly) {
                self.setDisabled(params.readonly);
            }

            //$("<div class=\"tooltip bottom\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\">Tooltip on the bottom</div></div>").insertAfter(self._jqElement);
            /*self._jqElement.next("div").after(
                $("<div/>").append("<i style=\"color:#f0ad4e\" class=\"glyphicon glyphicon-info-sign\"></i> ")
                    .append($("<span/>").text("您可以通过输入名称的全拼、简拼等来查找用户."))
            );*/
            //glyphicon glyphicon-info-sign
        },
        _uploadOk:function(){
            var self = this;
            var value = self._jqUploadInput.val();
            value = uniQueue(value.split("\|")).join("\|");
            //TODO
            self._isExcelUpload = self._jqUploadModal.find('input[type=file]').attr('excelupload');
            if(!String.isNullOrEmpty(value)){
                $.ajax({
                    url:"/public/controls/selector/netdisk/selector.netdisk.upload.save.jsp",
                    type:"post",
                    dataType:"json",
                    cache:false,
                    data:{upload:value,code:self._params.dirCode,
                        isSource:self._params.isSource,
                        sourceKind:self._params.sourceKind,
                        formCode:self._params.formCode,
                        projectId:self._params.projectId},
                    success:function(data){
                        if(data){
                            self._updateValue(data.ids.join(";"),false);
                            self._updateSelectedView(data,false);  //上传 3
                            self._jqUploadModal.modal("hide");
                            self._jqUploadInput.val("");  //清空无效
                        }
                    },
                    error:function(data){
                        if(data){
                            $.message(data.responseText);
                        }else{
                            $.message("上传发生错误！");
                        }
                    }
                });
            }
        },
        _uploadExcelOk: function () {

        },
        _updateSelectedView:function(data,clear){
            var self = this;
            if(clear){
                this._jqSelectedView.empty();
            }
            var urls=[];
            $.each(data.items,function(index,o){
                if(self._jqSelectedView.children("li[data-doc-id='"+ o.id+"']").length>0){
                    return;
                }
                var reg=/.*下 载$/;
                o.name= $.trim(o.name.replaceAll("\\n",""));
                if(reg.test(o.name)){
                    o.name = o.name.substring(0, o.name.length-3);
                }

                var i = '<button class="btn btn-warning" title="删除" data-doc-id="{0}"><i class="glyphicon glyphicon-trash"></i></button>'.format(o.id);
                if(self._params.readonly) i = "";
                var displyurl ="/public/controls/selector/netdisk/preview.jsp?url=" + encodeURIComponent(o.url);
                urls.push(displyurl);
                var tem=o.name.split(".");
                var suffix=tem[tem.length-1];
                // var suffix=/(?<=\.)\w+$/.exec(o.name);
                if(suffix===undefined){
                    suffix="";
                }
                suffix=suffix.toLocaleLowerCase();
                var ele=$(('<li data-doc-id="{3}">'
                        +'<table role="presentation" class="table" style="margin-bottom: 0px">'
                            + '<tbody>'
                                + '<tr class="document-template">'
                                    + '<td rowspan="2"   class="document-preview">'

                                    + '</td>'
                                    + '<td  class="document-info">'
                                        + '<span style="width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;display:inline-block;display:-moz-inline-box;">{1}</span>'
                                    + '</td>'
                                + '</tr>'
                                + '<tr class="document-template">'
                                    + '<td style="min-width: 110px">'
                                        +"<a class='btn btn-info' onclick='skip(\"{0}\")' role='button' title='下载'><i class='glyphicon glyphicon-download'></i></a>"
                                        +'&nbsp;&nbsp;{2}'
                                    + '</td>'
                                + '</tr>'
                                + '</tbody>'
                            + '</table>' +
                        '</li>').format(o.url, o.name, i,o.id));
                if(suffix==="docx" || suffix==="doc" || suffix==="xlsx" || suffix==="xls" || suffix==="pdf"){
                    if (!EIIS.browser.phone) {
                        $('<a href="javascript:void(0);"><img src="'+displyurl+'" name="imgSrc" style="width:80px;height:80px;"/></a>').on("click",function(){
                            processData({
                                type : "preView",
                                real_Path : o.url,
                                source : "reportForms",
                                quarry : "attachment",
                                mainId : "",
                                mainName : ""
                            });
                        }).appendTo(ele.find(".document-preview"));
                    }else{
                        $('<img src="'+displyurl+'" style="width:80px;height:80px;"/>').appendTo(ele.find(".document-preview"));
                    }
                }else{
                    !function(displyurl){
                        $('<img src="'+displyurl+'" style="width:80px;height:80px;"/>').appendTo(ele.find(".document-preview")).on("click",function(){
                            self._jqSelectedView.find("img").gallery({
                                activeUrl : displyurl
                            });
                        });
                    }(displyurl);
                }
                self._jqSelectedView.append(ele);
            });
            self._allDownBtn();
            if(self._jqSelectedView.children("li").length>0){
                self._jqTagElement.find(".text").text("附件("+self._jqSelectedView.children('li').length+")");
                self._jqTagElement.find(".hasfile").removeAttr("disabled");
                self._jqTagElement.find(".caret").show();
            }else{
                self._jqTagElement.find(".text").text("无附件");
                self._jqTagElement.find(".hasfile").trigger("click");
                self._jqTagElement.find(".hasfile").attr("disabled","disabled");
                self._jqTagElement.find(".caret").hide();
            }
        },
        setDisabled: function (value) {
            //this._jqTagElement.tagsinput("setReadOnly", value);
            if(value) {
                this._jqUpload.hide();
                this._jqNetdisk.hide();
                this._jqTagElement.find("a[data-toggle='dropdown']").css({"border-bottom-right-radius":"4px","border-top-right-radius":"4px"});
            } else {
                this._jqUpload.show();
                this._jqNetdisk.show();
                this._jqTagElement.find("a[data-toggle='dropdown']").css({"border-bottom-right-radius":"0px","border-top-right-radius":"0px"});
            }
        },
        destroy: function () {
            this._jqTagElement.remove();
            this._jqElement.show();
        },
        _updateValue:function(value,clear){
            if(value==undefined){
                return;
            }
            var self = this;
            if(clear===true || clear==undefined ){
                self._innerVal=value;
            }else{
                var newAr = value.split(";");
                //去重
                var oldval = self._jqElement.val();
                var oldAr = [];
                if(oldval && oldval!=""){
                     oldAr = oldval.split(";");
                }
                $.merge(oldAr,newAr);
                self._innerVal=uniQueue(oldAr).join(";");
            }
            self._jqElement.val(self._innerVal);
        },
        setValue: function (value) {
            if(value==undefined)return false;
            var self = this;
            if (!self._innerVal) {
                $.ajax({
                    url: '/public/controls/selector/netdisk/selector.netdisk.query.jsp',
                    dataType: 'json',
                    async: false,
                    cache: false,
                    data: {values:value.split(";")},
                    success: function (data) {
                        if (data) {
                            var rs = {ids:[],items:[]};
                            $.each(data,function(i,o){
                                rs.ids.push(o.id);
                                rs.items.push({name: o.name,id: o.id,url: o.filePath})
                            });
                            self._innerVal = value;
                            self._updateSelectedView(rs,true);  //设定值 4
                        }
                    }
                });
            }
            self._jqElement.val(value);
        },
        isDisabled: function () {
            return this._jqTagElement.tagsinput("isReadOnly");
        },
        _allDownBtn: function () {
            var self = this;
            if(EIIS.browser.pc && self._innerVal && self._innerVal.split(";").length>=4){
                var div = self._jqSelectedView.children("div[name='allDown_div']");
                if(div.length==0){
                    div = $("<div name='allDown_div' style='padding: 0 15px 3px 15px;'></div>");
                    var btn = $("<button class='btn btn-xs btn-block' type='button' " +
                        "style='padding: 2px 12px;font-size: 12px !important;height: 24px;'>下载全部</button>");
                    btn.click(function () {
                        window.open("/public/CommonController/downloadAllAttachment.do?netdeskIds="+self._innerVal);
                    });
                    div.append(btn);
                    self._jqSelectedView.prepend(div);
                }else{
                    div.show();
                }
            }else{
                var div = self._jqSelectedView.children("div[name='allDown_div']");
                if(div.length>0){
                    div.hide();
                }
            }
        }
    });
    function uniQueue(array){
        var arr=[];
        var m;
        while(array.length>0){
            m=array[0];
            arr.push(m);
            array=$.grep(array,function(n,i){
                return n==m;
            },true);
        }
        return arr;
    }
})(jQuery);

function skip(uri) {
    if (EIIS.browser.phone) {
        var tem=uri.split(".");
        var suffix=tem[tem.length-1];
        if(suffix===undefined){
            suffix="";
        }
        if(suffix==="jpg" || suffix==="gif" || suffix==="png" || suffix==="bmp" || suffix==="jpeg"){
            $(".dropdown-menu").find("img").gallery({
                activeUrl : "/public/controls/selector/netdisk/preview.jsp?url="+encodeURIComponent(uri)
            });
        }else{
            var postData = {};
            postData['type'] = 'preView';
            postData['real_Path'] = uri;
            postData['source'] = 'reportForms';
            postData['quarry'] = 'attachment';
            postData['mainId'] = '';
            postData['mainName'] = '';
            processData(postData);
        }
    } else {
        window.location.href = uri;
    }
}