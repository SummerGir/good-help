var FD = {
    xmlUtil: new XmlUtils(),
    attr: "attr",
    content: "content",
    prefixAttr: "eiis_attr",
    prefixContent: "eiis_content",
    typeRead: "read",
    typeWrite: "write",
    getEIISProps: function (prefix, type) {
        var props = [];
        $("input,select,textarea").each(function () {
            var obj = $(this);
            if (obj.attr("name") != null && obj.attr("name").startsWith(prefix)) {
                if (type == FD.typeRead) {
                    var name = obj.attr("name");
                    var val = obj.val();
                    var mapping = obj.attr("mapping") == undefined ? name : obj
                        .attr("mapping");
                    var tag = obj.attr("tag");
                    var prop = new Property(name, val, mapping, tag);
                    props.add(prop);
                } else if (type == FD.typeWrite) {
                    var name = obj.attr("name");
                    var val = obj.val();
                    var mapping = obj.attr("mapping") == undefined ? name : obj
                        .attr("mapping");
                    var tag = obj.attr("tag");
                    var prop = new Property(name, val, mapping, tag);
                    props.add(prop);
                } else {
                    throw "参数传递错误!";
                }

            }
        });
        return props;
    },
    getEIISContent: function (prefix) {
        var result = "";
        var contentGroups = FD.getContentGroup(prefix, FD.typeRead);
        for (var i = 0; i < contentGroups.length; i++)
            result += FD.xmlUtil.generateContent(contentGroups[i]);
        return result;
    },
    hasAttribute: function (content, name) {
        for (var i = 0; i < content.attributes.length; i++) {
            var attribute = content.attributes[i];
            if (name == attribute.name) {
                return true;
            }
        }
        return false;
    },
    getContentGroup: function (prefix) {
        var contents = FD.getEIISProps(prefix, FD.typeRead);
        var contentGroup = [];
        for (var i = 0; i < contents.length; i++) {
            var tagArr = [];
            var obj = contents[i];
            if (!obj.getName().endsWith(FD.attr)) {
                for (var j = 0; j < contents.length; j++) {
                    var obj1 = contents[j];
                    if (obj1.getName().startsWith(obj.getName())
                        && obj1.getTag() == obj.getTag()) {
                        tagArr.add(obj1);
                    }
                }
                contentGroup.add(tagArr);
            }
        }
        return contentGroup;
    },
    initContents: function (contents) {
        var sn = 0;
        if (contents == null || contents.length <= 0)
            return;
        var contentDoms = FD.getEIISProps(FD.prefixContent, FD.typeWrite);

        for (var i1 = 0; i1 < contentDoms.length; i1++) {
            var obj = contentDoms[i1];
            if (!obj.getName().endsWith(FD.attr)) {
                for (var j = 0; j < contentDoms.length; j++) {
                    var obj1 = contentDoms[j];
                    if (obj1.getName().startsWith(obj.getName())
                        && obj1.getTag() == obj.getTag()) {
                        var content = contents.get(sn).node;
                        for (var index = 0; index < content.attributes.length; index++) {
                            var attribute = content.attributes[index];
                            if (obj1.getMapping() == attribute.name) {
                                var el = document.getElementsByName(obj1.getName())[0];
                                el.value = attribute.value;
                                var tagName = el.tagName;
                                if (tagName == "SELECT") {
                                    $(el).combobox("value", attribute.value);
                                }
                            }
                        }

                    }
                }
                sn++;
            }
        }
        sn = 0;
    },
    getCallActivitiOption: function (tableId) {
        var optionts = [];
        $("#" + tableId + " tr").each(function (i) {
            var obj = $(this);
            if (obj.attr("id") != null && obj.attr("id") != "") {
                var inputs = obj.find("input");
                var a = ($(inputs[1]).val() != null && $(inputs[1]).val() != "");
                var b = ($(inputs[2]).val() != null && $(inputs[2]).val() != "");
                var c = ($(inputs[3]).val() != null && $(inputs[3]).val() != "");
                var d = ($(inputs[4]).val() != null && $(inputs[4]).val() != "");
                if ((a || b) && (c || d)) {
                    var option = new CallActivitiOptions($(inputs[1]).val(), $(inputs[2]).val(), $(inputs[3]).val(), $(inputs[4]).val());
                    optionts.add(option);
                }
            }
        });
        return optionts;
    },
    getEventOption: function (tableId) {
        var options = [];
        $("#" + tableId + " tr").each(function (i) {
            var obj = $(this);
            if (obj.attr("id") != null && obj.attr("id") != "") {
                options.add(FD.getEIISProps(obj.attr("id"), FD.typeRead));
            }
        });
        return options;
    },
    getNodeContent: function (obj) {
        var extend = null;
        var isChange = false;
        switch (obj.type) {
            //generateErrorEndContent
            case "END_ERROR":
                extend = FD.xmlUtil.generateErrorEndContent($("#error_code").val());
                break;
            case "HQL":
                isChange = true;
                extend = FD.xmlUtil.generateMailContent(FD.getEIISProps("mail", FD.typeRead));
                break;
            case "CALLACTIVITI":
                //generateCallActivitiContent
                //var optins = FD.getCallActivitiOption("call-activiti-content-in");
                isChange = true;
                extend = FD.xmlUtil.generateCallActivitiContent(FD.getCallActivitiOption("call-activiti-content-in"), FD.getCallActivitiOption("call-activiti-content-out"));
                break;
            case "XIORKFLOW_TRANSITION":
                extend = FD.xmlUtil.generateTransitionContent("condition");
                isChange = true;
                break;
            default :
                extend = buttonStore.toXml();
                var tableDoc = store.toXml();
                if (FD.xmlDocIsNull(extend)) {
                    if (!FD.xmlDocIsNull(tableDoc)) {
                        extend = tableDoc;
                    } else {
                        extend = null;
                    }
                } else if (!FD.xmlDocIsNull(extend)) {
                    if (!FD.xmlDocIsNull(tableDoc)) {
                        var doc = tableDoc.documentElement;
                        for (var i = 0; i < doc.childNodes.length; i++) {
                            var node = doc.childNodes[i].cloneNode(true);
                            extend.documentElement.appendChild(node);
                        }
                    } else {
                        extend = extend;
                    }
                }
                break;
        }
        //extend += FD.xmlUtil.generateEventContent(FD.getEventOption("event"),isChange);
        var eventDoc = obj.eventStore.createDoc();
        var step = 0;
        if (FD.xmlDocIsNull(extend)) {
            if (!FD.xmlDocIsNull(eventDoc)) {
                step = 1;
                extend = eventDoc;
            } else {
                step = 2;
                extend = "";
            }
        } else if (!FD.xmlDocIsNull(extend)) {
            if (!FD.xmlDocIsNull(eventDoc)) {
                step = 3;
                try {
                    if (obj.type != "XIORKFLOW_TRANSITION") {
                        var doc = eventDoc.documentElement;
                        for (var i = 0; i < doc.childNodes.length; i++) {
                            var node = doc.childNodes[i].cloneNode(true);
                            extend.documentElement.appendChild(node);
                        }
                    } else {
                        step = 2;
                        extend = eventDoc.xml + extend.xml;
                    }
                } catch (e) {
                    alert("1." + e);
                }
            } else {
                step = 4;
                extend = extend;
            }
        }
        if (step == 2 && extend == "") {
            return ""
        } else if (step == 2) {
            return extend;
        }
        return extend.xml;
    },
    xmlDocIsNull: function (xmlDoc) {
        try {
            if (xmlDoc == null || xmlDoc.xml == "" || xmlDoc.xml == undefined || xmlDoc == "" || xmlDoc == undefined) {
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    },
    getValueByName: function (name, node) {
        if (!node) return "";
        for (var i = 0; i < node.attributes.length; i++) {
            var obj = node.attributes[i];
            if (obj.name == name) {
                return obj.value;
            }
        }
    },
    installNodeContent: function (objNode) {
        var isChange = false;
        var type = objNode.type;
        var contents = objNode.getContents();
        switch (type) {
            //generateErrorEndContent
            case "END_ERROR":
                $("#error_code").val(contents.get(0).node.attributes[0].value);
                break;
            case "HQL":
                isChange = true;
                for (var i = 0; i < contents.length; i++) {
                    var childNodes = contents.get(i).node.childNodes;
                    for (var j = 0; j < childNodes.length; j++) {
                        var attrs = childNodes[j].attributes;
                        switch (attrs[0].value) {
                            case "from":
                                $("#mail_from").val(attrs[1].value);
                                break;
                            case "to":
                                $("#mail_to").val(attrs[1].value);
                                break;
                            case "subject":
                                $("#mail_subject").val(attrs[1].value);
                                break;
                            case "html":
                                $("#mail_content").val(childNodes[j].firstChild.text);
                                break;
                            default:
                                break;
                        }
                    }
                }
                break;
            case "CALLACTIVITI":
                isChange = true;
                for (var i = 0; i < contents.length; i++) {
                    var childNodes = contents.get(i).node.childNodes;
                    var in_i = 0;
                    var out_i = 0;
                    for (var j = 0; j < childNodes.length; j++) {
                        var obj = childNodes[j];
                        if ("activiti:in" == obj.nodeName) {
                            var tr = $("#in_root");
                            if (in_i > 0) {
                                //增加一行
                                tr = addRow('call-activiti-content-in', 'in_attr');
                            }


                            var inputs = tr.find("input").each(function (i) {
                                var inputObj = $(this);
                                if (i > 0) {
                                    inputObj.val(FD.getValueByName(inputObj.attr("name"), obj));
                                }
                            });

                            in_i++;
                        } else if ("activiti:out" == obj.nodeName) {
                            var tr = $("#out_root");
                            if (out_i > 0) {
                                //增加一行
                                tr = addRow('call-activiti-content-out', 'out_attr');
                            }

                            var inputs = tr.find("input").each(function (i) {
                                var inputObj = $(this);
                                if (i > 0) {
                                    inputObj.val(FD.getValueByName(inputObj.attr("name"), obj));
                                }
                            });

                            out_i++;
                        }
                    }
                }
                break;
            case "XIORKFLOW_TRANSITION":
                isChange = true;
                for (var i = 0; i < contents.length; i++) {
                    var childNodes = contents.get(i).node.childNodes;
                    if (contents.get(i).node.nodeName == "conditionExpression") {//<![CDATA[tete]]>
                        var value = contents.get(i).node.childNodes[0].text;
                        document.getElementById("condition").value = value;
                    }
                }
                break;
            default :
                var buttonsNode = FD.getContentByNodeName(contents, "buttons")[0];
                if (buttonsNode != null && buttonsNode != undefined) {
                    for (var i = 0; i < buttonsNode.childNodes.length; i++) {
                        var obj = buttonsNode.childNodes[i];//buttonStore
                        var depandentence = [];
                        if (obj.childNodes.length != 0) {
                            for (var j = 0; j < obj.childNodes[0].childNodes.length; j++) {
                                var dependButtonNode = obj.childNodes[0].childNodes[j];
                                depandentence.add(new Button(FD.getValueByName("id", dependButtonNode), FD.getValueByName("name", dependButtonNode)));
                            }
                        }
                        var button = new Button(FD.getValueByName("id", obj), FD.getValueByName("name", obj), FD.getValueByName("index", obj), depandentence);
                        buttonStore.addButton(button);
                    }
                }
                var tablesNode = FD.getContentByNodeName(contents, "tables")[0];
                var store1 = new TableStore();
                if (tablesNode != null && tablesNode != undefined) {
                    for (var i = 0; i < tablesNode.childNodes.length; i++) {
                        var obj = tablesNode.childNodes[i];//buttonStore
                        var table = new Table(FD.getValueByName("id", obj), FD.getValueByName("enname", obj), FD.getValueByName("chname", obj));
                        if (obj.childNodes.length != 0) {
                            for (var j = 0; j < obj.childNodes.length; j++) {
                                var columnNode = obj.childNodes[j];
                                var column = new Column(FD.getValueByName("id", columnNode), FD.getValueByName("enname", columnNode), FD.getValueByName("chname", columnNode), table.getId(), FD.getValueByName("editstate", columnNode), FD.getValueByName("checkstate", columnNode));
                                table.addColumn(column);
                            }
                        }
                        store1.addTable(table);
                    }
                }

                if (store1 != null && store1.getTables().length > 0) {
                    for (var j = 0; j < store1.getTables().length; j++) {
                        var _b = store1.getTables()[j];
                        var obj = store.getTableById(_b.getId());
                        if (obj != null) {
                            obj.iteratorCloumn(function (k, c) {
                                var _col = _b.getColumnByEnname(c.getEn_name());
                                if (_col != null) {
                                    c.setEditState(_col.getEditState());
                                    c.setCheckState(_col.getCheckState());
                                }
                            });
                        }
//							if(obj != null){
//								obj.setColumns([]);
//								obj.setColumns(_b.getColumns());
//							}
                    }
                }
                break;
        }
        FD.initEventContent(objNode);
    },
    initEventContent: function (obj) {
        var contents = obj.getContents();
        if (contents == null && contents.length <= 0)return;
        obj.eventStore.events = new Array();
        for (var i = 0; i < contents.length; i++) {
            var childNodes = contents.get(i).node.selectNodes("listeners/listener");
            for (var j = 0; j < childNodes.length; j++) {
                var node = childNodes[j];
                var type = FD.getValueByName("type", node);
                var packageName = FD.getValueByName("packagename", node);
                var className = FD.getValueByName("classname", node);
                var indexNo = FD.getValueByName("indexno", node);
                var tr = FD.addRow('event', 'in_attr', ['type', 'packagename', 'classname', 'indexno'], 'readonly=readonly');
                var inputs = tr.find("input");
                $(inputs[1]).val(type);
                $(inputs[2]).val(packageName);
                $(inputs[3]).val(className);
                $(inputs[4]).val(indexNo);
                var event = new Event(type, packageName, className, indexNo, node.text);
                obj.eventStore.add(event);
            }
        }
    },
    getContentByNodeName: function (contents, nodeName) {
        var nodes = [];
        for (var i = 0; i < contents.length; i++) {
            var childNodes = contents.get(i).node.childNodes;
            for (var j = 0; j < childNodes.length; j++) {
                var obj = childNodes[j];
                if (obj.nodeName == nodeName) {
                    nodes.add(obj);
                }
            }
        }
        return nodes;
    },
    addRow: function (table, radioName, fields, readOnly, width) {
        if (readOnly == undefined) readOnly = "";
        if (width == undefined) width = '110';
        var length = $("#" + table + " tr").length;
        var tds = "<td align='center'><input type='checkbox' name='" + radioName + "' style='width: 30px;'/> </td>";
        for (var i = 0; i < fields.length; i++) {
            var obj = fields[i];
            tds += "<td><input type='text' name='" + length + "_" + obj + "' " + readOnly + " mapping='" + obj + "' style=\"width:" + width + "px;\" /></td>"
        }
        var row = "<tr id='" + length + "' > " + tds + "</tr>";
        $("#" + table).append(row);
        return $("#" + table + " tr[id='" + length + "']");
    },
    deleteRow: function (table, name) {
        $("#" + table + " tr td input[name='" + name + "']").each(function (i) {
            if (this.checked == true) {
                $(this).parent().parent().remove();
            }
        });
    },
    changeAll: function (chcekBoxObj, table, name) {
        $("#" + table + " tr td input[name='" + name + "']").each(function (i) {
            this.checked = chcekBoxObj.checked;
        });
    },
    getSelectTrs: function (tabelId, name) {
        var trs = [];
        $("#" + tabelId + " tr input[name='" + name + "']").each(function (i) {
            if (this.checked) {
                trs.add($(this).parent().parent());
            }
        });
        return trs;
    },
    getAllOption: function (selectId) {
        var options = [];
        $("#" + selectId + " option").each(function () {
            var obj = $(this);
            options.add(obj);
        });
        return options;
    },
    getSelectedOptions: function (selectId) {
        var options = [];
        $("#" + selectId + " option:selected").each(function () {
            var obj = $(this);
            options.add(obj);
        });
        return options;
    },
    addOption: function (selectId, options) {
        for (var i = 0; i < options.length; i++) {
            options[i].removeAttr("selected");
            $("#" + selectId).append(options[i]);
        }
    },
    removeOption: function (selectId, options) {
        for (var i = 0; i < options.length; i++) {
            $("#" + selectId).remove(options[i]);
        }
    },
    getOptionIndex: function (selectId, optionValue) {
        for (var i = 0; i < document.getElementById(selectId).options.length; i++) {
            var obj = document.getElementById(selectId).options[i];
            if (obj.value == optionValue) {
                return obj.index;
            }
        }
    },
    removeOptionByValue: function (selectId, value) {
        $("#" + selectId + " option").each(function () {
            var obj = $(this);
            if (obj.val() == value) {
                obj.remove();
            }
        });
    },
    deleteRow: function (table, name) {
        $("#" + table + " tr td input[name='" + name + "']").each(function (i) {
            if (this.checked == true) {
                $(this).parent().parent().remove();
            }
        });
    }
};