(function ($, undefined) {

    /*
     * 字典选择器input标签
     */
    EIIS.Common.loadComponent(EIIS.Common.UI, function () {

        EIIS.Common.loadComponent({}, function () {
            EIIS.UI.addControl({
                selector: ":text.esgselect",
                _jqElement: null,
                _jqButton: null,
                _jqTagElement: null,
                _innerVal: false,
                _params: null,
                create: function () {
                    var self = this;
                    self._jqElement = $(self.element);
                    if (self.element.tagName.toLowerCase() != "input") throw ("初始化标签不是input!");
                    var params = {
                        readonly: self._jqElement.prop('disabled'),
                        placeholder : self._jqElement.attr("placeholder") ? self._jqElement.attr("placeholder") : '',
                        type: self._jqElement.attr("selectType"),
                        postData : self._jqElement.attr("postData")? JSON.parse(self._jqElement.attr("postData")):{},
                        addOption : self._jqElement.attr("addOption")? JSON.parse(self._jqElement.attr("addOption")):null,
                        minLength : self._jqElement.attr("minSearchLength")? parseInt(self._jqElement.attr("minSearchLength")):2
                    };
                    if(params.postData.rows){
                        params.postData.rows = parseInt(params.postData.rows);
                    }
                    params.postData=$.extend({page:1,rows:30},params.postData);
                    params.postData.rows = params.postData.rows>=30?params.postData.rows:30;
                    $.extend(params,self.getSearchData(params.type));

                    self._params = params;
                    self._jqElement.hide();
                    self._jqTagElement = $("<div/>").insertAfter(self._jqElement);
                    self._jqTagElement
                        .on("created.tagsinput2", function () {
                            if (self._jqElement.val() != "") {
                            }
                        });

                    self._jqTagElement
                        .tagsinput2({
                            idKey: self._params.searchid,
                            displayKey: self._params.showcode,
                            url: self._params.url,
                            postData: self._params.postData,
                            addOption: self._params.addOption,
                            multiple: false,
                            menuTemplate: function (value) {
                                var ci;
                                if(value.titleimg){ //1为空心
                                    ci="fa fa-bookmark-o";
                                }else{
                                    ci="fa fa-bookmark";
                                }
                                var ciyao = "";
                                if(self._params.showcode.length>1){
                                    ciyao = value[self._params.showcode[1]];
                                }
                                if(defaultValues == value[self._params.searchid]){
                                    value.readonly = null;
                                }

                                var result;
                                if (value.readonly==0) {
                                    result = "<i style='color:#b1b1b1;' class='"+ci+"'>&nbsp;&nbsp;</i><b style='color:#b1b1b1;'>"
                                        + value[self._params.showcode[0]] + "</b>&nbsp;&nbsp;<span style='font-style:italic;color:#b1b1b1;'>" + (ciyao?ciyao:"") + "</span>";
                                }else{
                                    result = "<i style='color:#31b0d5;' class='"+ci+"'>&nbsp;&nbsp;</i><b>"
                                        + value[self._params.showcode[0]] + "</b>&nbsp;&nbsp;<span style='font-style:italic;'>" + (ciyao?ciyao:"") + "</span>";

                                }
                                return result;
                            },
                            input: {
                                placeholder: self._params.placeholder,
                                source: function (value, callback) {
                                    var postData = getTruePostParam(self._params.postData);
                                    postData.searchKey = value;
                                    $.ajax({
                                        dataType: 'json', cache: true,
                                        url: self._params.url,
                                        data: postData,
                                        success: function (results) {
                                            callback(results);
                                        }
                                    });
                                },
                                cache: true,
                                minLength: self._params.minLength
                            }
                        });
                    var defaultValues = self._jqElement.val();
                    if (defaultValues && $.trim(defaultValues).length >0) {
                        var postData = getTruePostParam(self._params.postData);
                        postData.searchKey = null;
                        postData[self._params.searchid] = self._jqElement.val();
                        $.ajax({
                            url: self._params.url,
                            dataType: 'json',
                            async: false,
                            cache: true,
                            data: postData,
                            success: function (data) {
                                if (data) {
                                    var r;
                                    if ($.isArray(data) && data.length>0) {
                                        r = data[0];
                                    } else {
                                        r = data;
                                    }
                                    if(r && defaultValues == r[self._params.searchid]){
                                        self._jqTagElement.tagsinput2("putTag", r);
                                        self._jqTagElement.tagsinput2("setSearchText", "");
                                    }else{
                                        self._jqElement.val("");
                                        self._jqTagElement.tagsinput2("setSearchText", defaultValues);
                                    }
                                }
                            }
                        });
                    }
                    self._jqTagElement
                        .on("put.tagsinput2 remove.tagsinput2", function (e, id, data) {
                            self._innerVal = true;
                            self._jqElement.val(self._jqTagElement.tagsinput2("getIds").join(";"));
                            self._innerVal = false;
                        });
                    self._jqTagElement
                        .on("put.tagsinput2", function (e, id, data) {
                            if (id) {
                                if($(e.currentTarget).attr("which")){
                                    self._jqElement.attr("which",$(e.currentTarget).attr("which"));
                                }
                                self._jqElement.triggerHandler("esgselect.put.tagsinput2", [data, "input"]);
                            }
                        });
                    self._jqTagElement
                        .on("remove.tagsinput2", function (e, id, data) {
                            if (id) {
                                self._jqElement.triggerHandler("esgselect.remove.tagsinput2", [data, "remove"]);
                            }
                        });
                    if (params.readonly) {
                        self._jqTagElement.tagsinput2("setReadOnly", true);
                    }
                    self._jqTagElement.tagsinput2("setPlaceholder", self._params.placeholder);
                },
                setDisabled: function (value) {
                    this._jqTagElement.tagsinput2("setReadOnly", value);
                },
                destroy: function () {
                    this._jqTagElement.remove();
                    this._jqElement.show();
                },
                setValue: function (value) {
                    var self = this;
                    if(!value || "".equals(value)){
                        self._jqTagElement.tagsinput2("clearTag");
                        self._jqElement.val(value);
                        return;
                    }
                    if (!self._innerVal) {
                        var postData = getTruePostParam(self._params.postData);
                        postData.searchKey = null;
                        postData[self._params.searchid] = value;
                        $.ajax({
                            url: self._params.url,
                            dataType: 'json',
                            async: false,
                            cache: true,
                            data: postData,
                            success: function (data) {
                                self._jqTagElement.tagsinput2("clearTag");
                                self._jqTagElement.tagsinput2("putTag", data);
                            }
                        });
                    } else {
                        self._jqElement.val(value);
                    }
                },
                isDisabled: function () {
                    return this._jqTagElement.tagsinput2("isReadOnly");
                },
                getSearchData: function(type){
                    switch(type) {
                        case 'meterial'://材料通中的出库(output)、退货(inputEsc)、退库(outputEsc)
                            return {
                                url: '/public/selectPlutIn/selectMeterialInfo.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'contractTemp'://合同模板
                            return {
                                url: '/public/selectPlutIn/selectContractTemp.do',
                                searchid: 'templetId',
                                showcode: ['templetName']
                            };
                        case 'dicInfo': // 劳务，机械，材料，间接费等所有材料
                            return {
                                url: '/public/selectPlutIn/selectAllDicInfo.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'customInfo': // 劳务，机械，材料，等所有往来单位
                            return {
                                url: '/public/selectPlutIn/selectCustomInfo.do',
                                searchid: 'customId',
                                showcode: ['displayName']
                            };
                        case 'contractInfo': // 劳务，机械，材料，等所有合同
                            return {
                                url: '/public/selectPlutIn/selectContractInfo.do',
                                searchid: 'contractId',
                                showcode: ['contractCode']
                            };
                        case 'contractDetail': // 劳务，机械，等合同明细
                            return {
                                url: '/public/selectPlutIn/selectContractDetail.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'WithholdContract': // 代扣合同
                            return {
                                url: '/public/selectPlutIn/selectWithholdContract.do',
                                searchid: 'helpedContractId',
                                showcode: ['newShowName']
                            };
                        case 'planDetail': // 材料需求计划等合同明细
                            return {
                                url: '/public/selectPlutIn/selectPlanDetail.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'machineInterfix': // 机械相关 出场 output
                            return {
                                url: '/public/selectPlutIn/selectMachineInterfix.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'payFeeDic': // 间接费费用支付单费用名称
                            return {
                                url: '/public/selectPlutIn/selectPayFeeDic.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'unitDetail': // 查询单位
                            return {
                                url: '/public/selectPlutIn/selectUnitDetail.do',
                                searchid: 'unitId',
                                showcode: ['unitName']
                            };
                        case 'unitOfClient':  //查询某字典的单位
                            return{
                                url: '/public/unit/getUnitList.do',
                                searchid: 'unitId',
                                showcode: ['unitName']
                            };
                        case 'leaseOutputAndStop': // 查询租赁停租及退租信息
                            return {
                                url: '/public/selectPlutIn/getLeaseOutputAndStop.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'costInfo': // 查询租赁停租及退租信息
                            return {
                                url: '/public/selectPlutIn/costInfo.do',
                                searchid: 'costId',
                                showcode: ['costName']
                            };
                        case 'leaseInfo': // 查询租赁信息
                            return {
                                url: '/public/selectPlutIn/getLeaseInfo.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'dicInfoByCon': // 查询明细在合同里面
                            return {
                                url: '/public/selectPlutIn/getDicInfoByContract.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'machineInputDic': // 查询进场单根据合同
                            return {
                                url: '/public/selectPlutIn/getMachineInputDic.do',
                                searchid: 'dicId',
                                showcode: ['dicName','dicDes']
                            };
                        case 'memberInfo': // 系统内成员
                            return {
                                url: '/public/selectPlutIn/getMemberInfo.do',
                                searchid: 'memberId',
                                showcode: ['memberName']
                            };
                        case 'quotaUseInfo': //企业定额库
                            return {
                                url: '/public/selectPlutIn/quotaUseInfo.do',
                                searchid: 'quotaUseId',
                                showcode: ['quotaUseName','typeName']
                            };
                        case 'subject_relation_countType': //科目挂接统计方式的选择项
                            return {
                                url: '/app/dynamiccost/subject_relation_adjust/getCountTypeOption.jsp',
                                searchid: 'value',
                                showcode: ['text']
                            };
                        case 'subject_relation_searchCost': //科目挂接统计方式的选择项
                            return {
                                url: '/app/dynamiccost/subject_relation/adjust/searchCost.do',
                                searchid: 'costId',
                                showcode: ['costName','pathName']
                            };
                        case 'buildPosition': //部位明细选择项
                            return {
                                url: '/public/selectPlutIn/selectBuildPosition.do',
                                searchid: 'buildId',
                                showcode: ['allName']
                            };

                    }
                }
            });
        });
    });
    function getTruePostParam(postData) {
        var p = $.extend(true,{},postData);
        for(var i in p){
            if (typeof window[p[i]] === 'function') {
                try{
                    p[i]=window[p[i]].call(this);
                }catch (e){ console.log(e)};
            }
        }
        return p;
    }
})(jQuery);
