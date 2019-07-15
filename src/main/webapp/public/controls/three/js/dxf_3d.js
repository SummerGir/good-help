var three_js = function () {
    var lesson3 = {
        isRun: false,
        bindId: null,
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        clock: null,
        defCheckColor: '153,153,153',
        raycaster: null,
        mouse: null,
        data: {
            xyPoints: {},//2D坐标
            zPoints: {},//楼层层数集合
            cadLines: {},//cad line
            cadCircles: {},//圆弧
            cadTexts: {},//文字备注
            cadbuildMap: {}//cad几何图形ID和楼栋ID关系
        },
        readonly: false,//只读不用设置JSON值
        dataJSON: {},//各种类型数据JSON集
        colorJSON: {},//颜色JSON集
        uuidJSON: {},//图层的uuid JSON集
        uuidBuildJSON: {},//楼栋的uuid JSON集
        checkedObjects: {},//选中对象的JSON集
        type: 2,//2D OR 3D
        leftwindow: 7,//左侧窗口展示内容 默认全选 1图层、2楼栋、4分项
        loadType: 31, //加载CAD类型 1线段 2多段线 4 弧线 8圆形 16文字
        resp: null,//字体标准
        cadOtherTexts: {},//3D坐标中的文字集合
        defaultTaskName: "主体结构",//默认分项名称
        defColorJSON: {wjh: 0x797979, ywc: 0x25ba44, wwc: 0x71bae9, face: 0x8d928f, checked: 0xFF00FF},//楼栋颜色 wjh未计划 ywcyi完成 wwc未完成 face楼顶 checked选中
        clickcallback: function () {},//点击事件回调
        //
        init: function (id, conf) {
            this.emptyData();
            this.bindId = id;
            if (conf) {
                $.extend(true, this.data, conf);
                if (typeof conf.readonly!='undefined') this.readonly = conf.readonly;
                if (typeof conf.type!='undefined') this.type = conf.type;
                if (typeof conf.leftwindow!='undefined') this.leftwindow = conf.leftwindow;
                if (typeof conf.clickcallback!='undefined') this.clickcallback = conf.clickcallback;
                if (typeof conf.resp!='undefined') this.resp = conf.resp;
                if (typeof conf.loadType!='undefined')this.loadType = conf.loadType;
            }
            var _width = document.getElementById(id).offsetWidth;
            var _height = document.getElementById(id).offsetHeight;

            this.scene = new THREE.Scene();

            this.camera = new THREE.PerspectiveCamera(45, _width / _height, 0.01, 10000);
            this.camera.position.set(0, this.type==2?0:-1000, 1000);
            this.camera.lookAt(this.scene.position);

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(_width, _height);
            this.renderer.setClearColor(0x212830);

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

            document.getElementById(this.bindId).appendChild(this.renderer.domElement);

            //CAD弧线 loadType=4
            if ((this.loadType&4)>0 && !$.isEmptyObject(this.data.cadArcs)) {
                this.cadArcs();
            }
            //CAD多段线 loadType=2
            if ((this.loadType&2)>0 && !$.isEmptyObject(this.data.cadLwpolyLines)) {
                this.cadLwpolyLines();
            }
            //CAD圆形 loadType=8
            if ((this.loadType&8)>0 && !$.isEmptyObject(this.data.cadCircles)) {
                this.cadCircles();
            }
            //CAD数据连线LINE loadType=1
            if ((this.loadType&1)>0 && !$.isEmptyObject(this.data.cadLines)) {
                this.cadLines();
            }
            //CAD文字备注: this.data.cadTexts:cad文字  this.cadOtherTexts:楼层文字 loadType=16
            if ((this.loadType&16)>0 && (!$.isEmptyObject(this.data.cadTexts) || !$.isEmptyObject(this.cadOtherTexts))) {
                this.cadTexts();
            }
            //画布数据连线LINE
            if (!$.isEmptyObject(this.data.xyPoints)) {
                //坐标轴辅助
                // this.createAxes();
                //网格辅助线
                // this.createGridHelper();
            }

            if (this.readonly) {
                //网格辅助线
                // this.createGridHelper();
            } else {
                //点击事件TODO
                // if(this.type==2)
                this.clickFun();
                //鼠标滑动事件
                this.mousemoveFun();
            }
            //鼠标事件
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.clock = new THREE.Clock();

            this.isRun = true;
            this.animate();
        },
        //清空
        emptyData: function () {
            THREE.Cache.clear();
            var _this = this;
            if (_this.scene) {
                var allChildren = _this.scene.children;
                var lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    _this.scene.remove(lastObject);
                }
                for (var name in this) {
                    if (name == "data") {
                        for (var dataname in this[name]) {
                            this[name][dataname] = {};
                        }
                    } else if (name == "dataJSON" || name == "colorJSON" || name == "uuidJSON" || name == "uuidBuildJSON" || name == "checkedObjects") {
                        this[name] = {};
                    } else if (name == "cadOtherTexts") {
                        this[name] = {};
                    }
                }
            }
        },
        //左侧菜单
        createMange: function () {
            var _this = this;
            if((_this.leftwindow&7)==0)return;
            var wrap = $("<div/>").addClass("wrap").appendTo("#" + _this.bindId);
            var leftwindownum = 0, tablenum = 0;
            //图层管理
            var _sta = $("<div/>").addClass("_3d sta").appendTo(wrap);
            if ((_this.leftwindow & 1) == 1) {
                leftwindownum++;
                $("<span/>").addClass("title").addClass("action").text("图层").appendTo(_sta);
            }
            if ((_this.leftwindow & 2) == 2) {
                leftwindownum++;
                $("<span/>").addClass("title").text("楼栋").appendTo(_sta);
            }
            if ((_this.leftwindow & 4) == 4) {
                leftwindownum++;
                $("<span/>").addClass("title").text("分项").appendTo(_sta);
            }
            _sta.find(".title").css({"width": 100 / leftwindownum + "%"});
            $(".sta .title").on("click", function () {
                var index = $(this).index();
                $(".sta .title").removeClass("action");
                $(this).addClass("action");
                $(".sta").children("table").hide();
                $(".sta").children("table").eq(index).show();
            })
            //图层
            if ((_this.leftwindow & 1) == 1) {
                var tab = $("<table/>").appendTo(_sta);
                if (tablenum > 0) tab.css({"display": "none"});
                var _top = $("<tr/>").css({"text-align": "center", "background": "grey"}).appendTo(tab);
                $("<td/>").text("名称").appendTo(_top);
                $("<td/>").text("状态").appendTo(_top);
                for (var type in _this.data) {
                    var buildJSON = _this.data[type];
                    if (type == "cadArcs" || type == "cadCircles" || type == "cadLines" || type == "cadLwpolyLines" || type == "cadTexts") {
                        for (var build in buildJSON) {
                            (function (type, build) {
                                var _tr = $("<tr/>").appendTo(tab);
                                $("<td/>").text(build.split(":")[0]).appendTo(_tr);
                                var lt = $("<td/>").appendTo(_tr);
                                $("<i/>").addClass("esg-font").addClass("icon-tongyi")
                                    .on("click", function () {
                                        var vis;
                                        if ($(this).hasClass("icon-tongyi")) {
                                            $(this).removeClass("icon-tongyi").addClass("icon-jujue");
                                            vis = false;
                                        } else {
                                            $(this).removeClass("icon-jujue").addClass("icon-tongyi");
                                            vis = true;
                                        }
                                        var uuidArray = _this.uuidJSON[build];
                                        if(uuidArray) {
                                            for (var a = 0; a < uuidArray.length; a++) {
                                                _this.dataJSON[uuidArray[a]].isCad = vis;
                                                var obj = _this.scene.getObjectById(_this.dataJSON[uuidArray[a]].id);
                                                obj.visible = _this.dataJSON[uuidArray[a]].isCad && _this.dataJSON[uuidArray[a]].isBuild;
                                            }
                                        }
                                    }).appendTo(lt);
                            })(type, build)
                        }
                    }
                }
                tablenum++;
            }
            //楼栋
            if ((_this.leftwindow & 2) == 2) {
                var _bui = $("<table/>").appendTo(_sta);
                if (tablenum > 0) _bui.css({"display": "none"});
                var _top = $("<tr/>").css({"text-align": "center", "background": "grey"}).appendTo(_bui);
                $("<td/>").text("名称").appendTo(_top);
                $("<td/>").text("状态").appendTo(_top);
                if (_this.data.builds) {
                    for (var v = 0; v < _this.data.builds.length; v++) {
                        var buildJSON = _this.data.builds[v];
                        (function (buildJSON) {
                            var _tr = $("<tr/>").data("data", buildJSON).appendTo(_bui);
                            $("<td/>").text(buildJSON.buildName).appendTo(_tr);
                            var tb = $("<td/>").appendTo(_tr);
                            $("<i/>").addClass("esg-font").addClass("icon-tongyi")
                                .on("click", function () {
                                    var vis;
                                    if ($(this).hasClass("icon-tongyi")) {
                                        $(this).removeClass("icon-tongyi").addClass("icon-jujue");
                                        vis = false;
                                    } else {
                                        $(this).removeClass("icon-jujue").addClass("icon-tongyi");
                                        vis = true;
                                    }
                                    var uuidBuildArray = _this.uuidBuildJSON[buildJSON.buildId];
                                    for (var a = 0; a < uuidBuildArray.length; a++) {
                                        _this.dataJSON[uuidBuildArray[a]].isBuild = vis;
                                        var obj = _this.scene.getObjectById(_this.dataJSON[uuidBuildArray[a]].id);
                                        obj.visible = _this.dataJSON[uuidBuildArray[a]].isCad && _this.dataJSON[uuidBuildArray[a]].isBuild;
                                    }
                                }).appendTo(tb);
                        })(buildJSON)
                    }
                }
                tablenum++;
            }
            //分项
            if ((_this.leftwindow & 4) == 4) {
                var _bui = $("<table/>").appendTo(_sta);
                if (tablenum > 0) _bui.css({"display": "none"});
                var _top = $("<tr/>").css({"text-align": "center", "background": "grey"}).appendTo(_bui);
                $("<td/>").text("名称").appendTo(_top);
                $("<td/>").text("状态").appendTo(_top);
                for (var v = 0; v < _this.data.parentTasks.length; v++) {
                    var parentTaskJSON = _this.data.parentTasks[v];
                    (function (parentTaskJSON) {
                        var _tr = $("<tr/>").addClass("parent_task").data("data", parentTaskJSON).appendTo(_bui);
                        $("<td/>").text(parentTaskJSON.taskName).appendTo(_tr);
                        var tb = $("<td/>").appendTo(_tr);
                        $("<i/>").addClass("esg-font").addClass(parentTaskJSON.taskName.indexOf(_this.defaultTaskName) != -1 ? "icon-tongyi" : "icon-jujue")
                            .on("click", function () {
                                $("tr.parent_task").find("td>i").removeClass("icon-tongyi").addClass("icon-jujue");
                                $(this).removeClass("icon-jujue").addClass("icon-tongyi");
                                _this.setShapeColorFun(parentTaskJSON.taskName);
                            }).appendTo(tb);
                    })(parentTaskJSON)
                }
                tablenum++;
            }
            //备注
            var _desc = $("<div/>").css({
                "text-align": "left",
                "margin-top": "5px",
                "font-size": "14px"
            }).appendTo(wrap);
            $("<span/>").text("备注：").appendTo(_desc);
            $("<i/>").addClass("esg-font icon-bangzhu1")
                .attr("title", "鼠标功能\n滚轮-->放大缩小\n左键-->翻转\n右键-->拖动").appendTo(_desc);
            //楼层状态颜色
            if (_this.type == 3 && _this.data.parentTasks && _this.data.parentTasks.length > 0) {
                _this.setShapeColorFun(_this.defaultTaskName);
            }
        },
        //cad连线LINE
        cadLines: function () {
            var _this = this;
            for (var buildId in _this.data.cadLines) {
                for (var i = 0; i < _this.data.cadLines[buildId].length; i++) {
                    var thiscadline = _this.data.cadLines[buildId][i];
                    var _id = thiscadline.id;
                    var zPoint = _this.data.zPoints[_id];
                    if (zPoint) {
                        for (var _b in zPoint) {
                            for (var _z = 0; _z < zPoint[_b].length; _z++) {
                                _this.createLine(_id, buildId, [
                                    [{
                                        id: thiscadline.id,
                                        x: thiscadline.xs,
                                        y: thiscadline.ys,
                                        z: zPoint[_b][_z].z * 10,
                                        color: thiscadline.color
                                    }, {
                                        id: thiscadline.id,
                                        x: thiscadline.xe,
                                        y: thiscadline.ye,
                                        z: zPoint[_b][_z].z * 10,
                                        color: thiscadline.color
                                    }]
                                ])
                            }
                        }
                    } else {
                        var _isReadonly = !!_this.data.cadbuildMap[thiscadline.id];
                        var _startPoint = {
                            id: thiscadline.id,
                            x: thiscadline.xs,
                            y: thiscadline.ys,
                            z: 0,
                            color: _isReadonly?_this.defCheckColor:thiscadline.color
                        };
                        var _endPoint = {
                            id: thiscadline.id,
                            x: thiscadline.xe,
                            y: thiscadline.ye,
                            z: 0,
                            color: _isReadonly?_this.defCheckColor:thiscadline.color
                        };
                        if(thiscadline.order){
                            _startPoint.order = thiscadline.order;
                            _endPoint.order = thiscadline.order;
                        }
                        if(_isReadonly){
                            _startPoint.oldColor = thiscadline.color;
                            _endPoint.oldColor = thiscadline.color;
                        }
                        _this.createLine(_id, buildId, [
                            [_startPoint, _endPoint]
                        ], _isReadonly);
                    }
                }
            }
        },
        //cad 弧线
        cadArcs: function () {
            var _this = this;
            for (var buildId in _this.data.cadArcs) {
                var uuidArray = _this.uuidJSON[buildId];
                if (!uuidArray) uuidArray = [];
                for (var v = 0; v < _this.data.cadArcs[buildId].length; v++) {
                    var thiscadarc = _this.data.cadArcs[buildId][v];
                    var isReadonly = !!_this.data.cadbuildMap[thiscadarc.id];
                    var material = new THREE.LineBasicMaterial({color: showRGB(thiscadarc.color)});
                    var ellipse = new THREE.EllipseCurve(thiscadarc.x, thiscadarc.y, thiscadarc.radius, thiscadarc.radius, thiscadarc.start_angle * Math.PI / 180, thiscadarc.end_angle * Math.PI / 180, false);
                    var ellipsePath = new THREE.CurvePath();
                    ellipsePath.add(ellipse);
                    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
                    var ellipse = new THREE.Line(ellipseGeometry, material);
                    if (!_this.readonly) {
                        if (!_this.dataJSON[ellipse.uuid]) _this.dataJSON[ellipse.uuid] = {id: ellipse.id, isCad: true, isBuild: true, isReadonly: !!isReadonly};
                        _this.dataJSON[ellipse.uuid].data = [thiscadarc];
                        _this.colorJSON[ellipse.uuid] = showRGB(thiscadarc.color);
                    }
                    uuidArray.push(ellipse.uuid);

                    var bindBuildId = _this.data.cadbuildMap[thiscadarc.id];
                    if (bindBuildId) {
                        var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                        uuidBuildArray.push(ellipse.uuid)
                        _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
                    }

                    _this.scene.add(ellipse);
                }
                if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
            }
        },
        //cad 多段线
        cadLwpolyLines: function () {
            var _this = this;
            for (var buildId in _this.data.cadLwpolyLines) {
                for (var v = 0; v < _this.data.cadLwpolyLines[buildId].length; v++) {
                    var allcurves = [];
                    var lwpolyLine = _this.data.cadLwpolyLines[buildId][v];
                    var _id = lwpolyLine[0].parentId;
                    var dxfmsgOrder = _this.data.dxfmsgMap&&_this.data.dxfmsgMap[_id]?_this.data.dxfmsgMap[_id].split(","):[];
                    var zPoint = _this.data.zPoints[_id];
                    var _isReadonly = !!_this.data.cadbuildMap[_id];
                    if (zPoint) {
                        var cadOtherTestArray = [];
                        for (var _b in zPoint) {
                            //平面
                            for (var _z = 0; _z < zPoint[_b].length; _z++) {
                                var pointsArray = [];
                                var curves = [];
                                for (var a = 0; a < lwpolyLine.length; a++) {
                                    var c = {
                                        x: lwpolyLine[a].x,
                                        y: lwpolyLine[a].y,
                                        z: zPoint[_b][_z].z * 10,
                                        buildName: zPoint[_b][_z].buildName,
                                        color: lwpolyLine[a].color
                                    };
                                    if (lwpolyLine[a].id) c.id = lwpolyLine[a].id;
                                    else if (lwpolyLine[a].parentId) c.parentId = lwpolyLine[a].parentId;
                                    curves.push(c);
                                    var points = []
                                    if (a > 0 && _z > 0) {
                                        points.push(new THREE.Vector3(lwpolyLine[a - 1].x, lwpolyLine[a - 1].y, zPoint[_b][_z - 1].z * 10));
                                        points.push(new THREE.Vector3(lwpolyLine[a].x, lwpolyLine[a].y, zPoint[_b][_z - 1].z * 10));
                                        points.push(new THREE.Vector3(lwpolyLine[a].x, lwpolyLine[a].y, zPoint[_b][_z].z * 10));
                                        points.push(new THREE.Vector3(lwpolyLine[a - 1].x, lwpolyLine[a - 1].y, zPoint[_b][_z].z * 10));
                                        pointsArray.push(points);
                                    }
                                    //楼层文字
                                    if(dxfmsgOrder.length>0) {
                                        if (dxfmsgOrder.indexOf(a) != -1) {
                                            cadOtherTestArray.push({
                                                id: _id,
                                                buildId: buildId,
                                                text: zPoint[_b][_z].buildName,
                                                x: lwpolyLine[a].x,
                                                y: lwpolyLine[a].y,
                                                z: zPoint[_b][_z].z * 10
                                            });
                                        }
                                    }else if(a == 0){
                                        cadOtherTestArray.push({
                                            id: _id,
                                            buildId: buildId,
                                            text: zPoint[_b][_z].buildName,
                                            x: lwpolyLine[a].x,
                                            y: lwpolyLine[a].y,
                                            z: zPoint[_b][_z].z * 10
                                        });
                                    }
                                }
                                allcurves.push(curves);
                                if (_this.type == 3) {
                                    //平面
                                    if (_z == 0 || _z == zPoint[_b].length - 1)
                                        _this.createShape(_id, buildId, curves);
                                    //立面
                                    _this.createBuildShape(_id, buildId, pointsArray, {
                                        shoapeColor: _this.defColorJSON.wjh,
                                        taskId: zPoint[_b][_z].taskId ? zPoint[_b][_z].taskId : zPoint[_b][_z - 1] ? zPoint[_b][_z - 1].taskId : null
                                    });
                                }
                            }
                            //垂直
                            for (var a = 0; a < lwpolyLine.length; a++) {
                                var curves = [];
                                for (var _z = 0; _z < zPoint[_b].length; _z++) {
                                    var c = {
                                        x: lwpolyLine[a].x,
                                        y: lwpolyLine[a].y,
                                        z: zPoint[_b][_z].z * 10,
                                        color: lwpolyLine[a].color
                                    };
                                    if (lwpolyLine[a].id) c.id = lwpolyLine[a].id;
                                    else if (lwpolyLine[a].parentId) c.parentId = lwpolyLine[a].parentId;
                                    curves.push(c);
                                }
                                allcurves.push(curves);
                            }
                        }
                        _this.cadOtherTexts[_id] = cadOtherTestArray;
                    } else {
                        var curves = [];
                        for (var a = 0; a < lwpolyLine.length; a++) {
                            var c = {
                                x: lwpolyLine[a].x,
                                y: lwpolyLine[a].y,
                                z: 0,
                                color: _isReadonly?_this.defCheckColor:lwpolyLine[a].color
                            };
                            if(_isReadonly)c.oldColor = lwpolyLine[a].color;
                            if (lwpolyLine[a].id) c.id = lwpolyLine[a].id;
                            else if (lwpolyLine[a].parentId) c.parentId = lwpolyLine[a].parentId;
                            curves.push(c);
                        }
                        allcurves.push(curves);
                    }
                    _this.createLine(_id, buildId, allcurves, _isReadonly);
                }
            }
        },
        //cad 圆形
        cadCircles: function () {
            var _this = this;
            for (var buildId in _this.data.cadCircles) {
                var uuidArray = _this.uuidJSON[buildId];
                if (!uuidArray) uuidArray = [];
                for (var v = 0; v < _this.data.cadCircles[buildId].length; v++) {
                    var circle = _this.data.cadCircles[buildId][v];
                    var isReadonly = !!_this.data.cadbuildMap[circle.id];
                    var material = new THREE.LineBasicMaterial({color: showRGB(circle.color)});
                    var geometry = new THREE.CircleGeometry(circle.radius, 64);
                    var line = new THREE.Line(geometry, material);
                    line.position.set(circle.x, circle.y, 0);
                    if (!_this.readonly) {
                        if (!_this.dataJSON[line.uuid]) _this.dataJSON[line.uuid] = {id: line.id, isCad: true, isBuild: true, isReadonly: !!isReadonly};
                        _this.dataJSON[line.uuid].data = [circle];
                        _this.colorJSON[line.uuid] = showRGB(circle.color);
                    }
                    uuidArray.push(line.uuid);

                    var bindBuildId = _this.data.cadbuildMap[circle.id];
                    if (bindBuildId) {
                        var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                        uuidBuildArray.push(line.uuid)
                        _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
                    }

                    this.scene.add(line);
                }
                if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
            }
        },
        //cad 文字备注
        cadTexts: function () {
            var _this = this;
            var loader = new THREE.FontLoader();
            if(_this.resp){
                var options = {
                    size: 8,
                    height: 0.1, //文字的厚度
                    font: _this.resp
                };
                if (_this.type == 2) {
                    for (var buildId in _this.data.cadTexts) {
                        var uuidArray = _this.uuidJSON[buildId];
                        if (!uuidArray) uuidArray = [];
                        for (var v = 0; v < _this.data.cadTexts[buildId].length; v++) {
                            var text = _this.data.cadTexts[buildId][v];
                            //text输入的文字 options 文字设置
                            var textGeo = new THREE.TextGeometry(text.text, options);

                            var material = new THREE.MultiMaterial([
                                new THREE.MeshPhongMaterial({color: text.color}), // front
                                new THREE.MeshPhongMaterial({color: text.color}) // side
                            ]);

                            var mesh = new THREE.Mesh(textGeo, material);
                            mesh.position.set(text.x, text.y, 0);
                            _this.dataJSON[mesh.uuid] = {id: mesh.id, isCad: true, isBuild: true};
                            uuidArray.push(mesh.uuid);
                            _this.scene.add(mesh);
                        }
                        if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
                    }
                }
                if (!$.isEmptyObject(_this.cadOtherTexts)) {
                    options.size = 12;
                    for(var dxfId in _this.cadOtherTexts) {
                        var dxfmsgOrder = _this.data.dxfmsgMap&&_this.data.dxfmsgMap[_this.cadOtherTexts[dxfId][0].id]?_this.data.dxfmsgMap[_this.cadOtherTexts[dxfId][0].id].split(","):[];
                        for (var v = 0; v < _this.cadOtherTexts[dxfId].length; v++) {
                            if (_this.cadOtherTexts[dxfId][v].z == 0)continue;
                            var msgZ;
                            if (_this.cadOtherTexts[dxfId][v].z > 0) {
                                if(dxfmsgOrder.length<2)
                                    msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][v - 1].z) / 2 + _this.cadOtherTexts[dxfId][v - 1].z;
                                else
                                    msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][parseInt(((v+1)%dxfmsgOrder.length==0?v:(v+1))/dxfmsgOrder.length)*dxfmsgOrder.length-1].z) / 2 + _this.cadOtherTexts[dxfId][parseInt(((v+1)%dxfmsgOrder.length==0?v:(v+1))/dxfmsgOrder.length)*dxfmsgOrder.length-1].z;
                            }else{
                                if(dxfmsgOrder.length<2)
                                    msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][v + 1].z) / 2 + _this.cadOtherTexts[dxfId][v + 1].z;
                                else
                                    msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][Math.ceil((v+1)/dxfmsgOrder.length)*dxfmsgOrder.length].z) / 2 + _this.cadOtherTexts[dxfId][Math.ceil((v+1)/dxfmsgOrder.length)*dxfmsgOrder.length].z;
                            }
                            _this.addDesc(
                                _this.cadOtherTexts[dxfId][v].id,
                                _this.cadOtherTexts[dxfId][v].text,
                                options,
                                _this.cadOtherTexts[dxfId][v].x,
                                _this.cadOtherTexts[dxfId][v].y,
                                msgZ,
                                _this.cadOtherTexts[dxfId][v].buildId
                            );
                        }
                    }
                }
            }else {
                loader.load('/public/controls/three/font/gentilis_bold_typeface.json', function (response) {
                    _this.resp = response;
                    var options = {
                        size: 8,
                        height: 0.1, //文字的厚度
                        font: _this.resp
                    };
                    if (_this.type == 2) {
                        for (var buildId in _this.data.cadTexts) {
                            var uuidArray = _this.uuidJSON[buildId];
                            if (!uuidArray) uuidArray = [];
                            for (var v = 0; v < _this.data.cadTexts[buildId].length; v++) {
                                var text = _this.data.cadTexts[buildId][v];
                                //text输入的文字 options 文字设置
                                var textGeo = new THREE.TextGeometry(text.text, options);

                                var material = new THREE.MultiMaterial([
                                    new THREE.MeshPhongMaterial({color: text.color}), // front
                                    new THREE.MeshPhongMaterial({color: text.color}) // side
                                ]);

                                var mesh = new THREE.Mesh(textGeo, material);
                                mesh.position.set(text.x, text.y, 0);
                                _this.dataJSON[mesh.uuid] = {id: mesh.id, isCad: true, isBuild: true};
                                uuidArray.push(mesh.uuid);
                                _this.scene.add(mesh);
                            }
                            if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
                        }
                    }
                    if (!$.isEmptyObject(_this.cadOtherTexts)) {
                        options.size = 12;
                        for(var dxfId in _this.cadOtherTexts) {
                            var dxfmsgOrder = _this.data.dxfmsgMap&&_this.data.dxfmsgMap[_this.cadOtherTexts[dxfId][0].id]?_this.data.dxfmsgMap[_this.cadOtherTexts[dxfId][0].id].split(","):[];
                            for (var v = 0; v < _this.cadOtherTexts[dxfId].length; v++) {
                                if (_this.cadOtherTexts[dxfId][v].z == 0)continue;
                                var msgZ;
                                if (_this.cadOtherTexts[dxfId][v].z > 0) {
                                    if(dxfmsgOrder.length<2)
                                        msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][v - 1].z) / 2 + _this.cadOtherTexts[dxfId][v - 1].z;
                                    else
                                        msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][parseInt(((v+1)%dxfmsgOrder.length==0?v:(v+1))/dxfmsgOrder.length)*dxfmsgOrder.length-1].z) / 2 + _this.cadOtherTexts[dxfId][parseInt(((v+1)%dxfmsgOrder.length==0?v:(v+1))/dxfmsgOrder.length)*dxfmsgOrder.length-1].z;
                                }else{
                                    if(dxfmsgOrder.length<2)
                                        msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][v + 1].z) / 2 + _this.cadOtherTexts[dxfId][v + 1].z;
                                    else
                                        msgZ = (_this.cadOtherTexts[dxfId][v].z - _this.cadOtherTexts[dxfId][Math.ceil((v+1)/dxfmsgOrder.length)*dxfmsgOrder.length].z) / 2 + _this.cadOtherTexts[dxfId][Math.ceil((v+1)/dxfmsgOrder.length)*dxfmsgOrder.length].z;
                                }
                                _this.addDesc(
                                    _this.cadOtherTexts[dxfId][v].id,
                                    _this.cadOtherTexts[dxfId][v].text,
                                    options,
                                    _this.cadOtherTexts[dxfId][v].x,
                                    _this.cadOtherTexts[dxfId][v].y,
                                    msgZ,
                                    _this.cadOtherTexts[dxfId][v].buildId
                                );
                            }
                        }
                    }
                })
            }
        },
        //添加文字(文字内容，文字设置，X, Y, Z)
        addDesc: function (cadId, text, options, x, y, z, buildId) {
            var _this = this;
            var textGeo = new THREE.TextGeometry(text, options);
            var material = new THREE.MultiMaterial([
                new THREE.MeshPhongMaterial({color: 'red'}), // front
                new THREE.MeshPhongMaterial({color: 'red'}) // side
            ]);
            var mesh = new THREE.Mesh(textGeo, material);
            mesh.position.set(x, y, z);
            mesh.rotation.x = Math.PI / 2;
            _this.dataJSON[mesh.uuid] = {id: mesh.id, isCad: true, isBuild: true};
            if (buildId) {
                var uuidArray = buildId ? _this.uuidJSON[buildId] : [];
                if (!uuidArray) uuidArray = [];
                uuidArray.push(mesh.uuid);
                _this.uuidJSON[buildId] = uuidArray;
            }

            var bindBuildId = _this.data.cadbuildMap[cadId];
            if (bindBuildId) {
                var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                uuidBuildArray.push(mesh.uuid);
                _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
            }

            _this.scene.add(mesh);
        },
        //获得选中的dxf ID集合
        getCheckedDxfIds: function () {
            var _this = this;
            var dxfIds = [];
            for (var uuid in _this.checkedObjects) {
                dxfIds.push(_this.checkedObjects[uuid][0].id ? _this.checkedObjects[uuid][0].id : _this.checkedObjects[uuid][0].parentId);
            }
            return dxfIds;
        },
        //连线
        createLine: function (cadId, buildId, pointsArray, isReadonly) {
            var _this = this;
            var uuidArray = buildId ? _this.uuidJSON[buildId] : [];
            if (!uuidArray) uuidArray = [];
            for (var v = 0; v < pointsArray.length; v++) {
                var points = pointsArray[v];
                if (points && points.length > 0) {
                    var lines = new THREE.Geometry();
                    points.forEach(function (e) {
                        lines.vertices.push(new THREE.Vector3(e.x, e.y, e.z));
                    });
                    var material = new THREE.LineBasicMaterial({color: showRGB(points[0].color)});

                    var line = new THREE.Line(lines, material);
                    line.position.set(0, 0, 0);
                    if (!_this.readonly) {
                        if (!_this.dataJSON[line.uuid]) _this.dataJSON[line.uuid] = {id: line.id, isCad: true, isBuild: true, isReadonly: !!isReadonly};
                        _this.dataJSON[line.uuid].data = points;
                        _this.colorJSON[line.uuid] = showRGB(points[0].color);
                    }
                    if (buildId) uuidArray.push(line.uuid);

                    if (cadId) {
                        var bindBuildId = _this.data.cadbuildMap[cadId];
                        if (bindBuildId) {
                            var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                            uuidBuildArray.push(line.uuid)
                            _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
                        }
                    }

                    _this.scene.add(line);
                }
            }
            if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
        },
        //生成水平不规则平面
        createShape: function (cadId, buildId, pointsArray) {
            var _this = this;
            var uuidArray = buildId ? _this.uuidJSON[buildId] : [];
            if (!uuidArray) uuidArray = [];
            if (pointsArray && pointsArray.length > 2 && _this.data.zPoints[pointsArray[0].parentId]) {
                var rectShape = new THREE.Shape();
                rectShape.moveTo(pointsArray[0].x, pointsArray[0].y);
                pointsArray.forEach(function (e) {
                    rectShape.lineTo(e.x, e.y);
                });
                var rectGeom = new THREE.ShapeGeometry(rectShape);
                var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({
                    color: _this.defColorJSON.face,
                    side: THREE.DoubleSide
                }));
                rectMesh.position.set(0, 0, pointsArray[0].z);
                if (!_this.readonly) {
                    if (!_this.dataJSON[rectMesh.uuid]) _this.dataJSON[rectMesh.uuid] = {id: rectMesh.id, isCad: true, isBuild: true};
                    _this.dataJSON[rectMesh.uuid].data = pointsArray;
                }
                _this.colorJSON[rectMesh.uuid] = _this.defColorJSON.face;
                var bindBuildId = _this.data.cadbuildMap[cadId];
                if (bindBuildId) {
                    var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                    uuidBuildArray.push(rectMesh.uuid);
                    _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
                }
                if (buildId) uuidArray.push(rectMesh.uuid);
                _this.scene.add(rectMesh);
            }
            if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
        },
        //生成楼层立面
        createBuildShape: function (cadId, buildId, pointsArray, shoapeColorJson) {
            if (!pointsArray)return false;
            var _this = this;
            var uuidArray = buildId ? _this.uuidJSON[buildId] : [];
            if (!uuidArray) uuidArray = [];
            var normal = new THREE.Vector3(0, 0, 1); //三角面法向量
            var face0 = new THREE.Face3(0, 1, 2, normal); //创建三角面0
            var face1 = new THREE.Face3(0, 2, 3, normal); //创建三角面1
            for (var v = 0; v < pointsArray.length; v++) {
                var geometry = new THREE.Geometry();
                for (var a = 0; a < pointsArray[v].length; a++) {
                    geometry.vertices.push(pointsArray[v][a]);
                }
                geometry.faces.push(face0, face1); //三角面添加到几何体
                var material = new THREE.MeshFaceMaterial(
                    new THREE.MeshBasicMaterial({
                            color: shoapeColorJson.shoapeColor,
                            side: THREE.DoubleSide
                        })
                );
                var mesh = new THREE.Mesh(geometry, material);
                if (!_this.readonly) {
                    if (!_this.dataJSON[mesh.uuid]) _this.dataJSON[mesh.uuid] = {id: mesh.id, isCad: true, isBuild: true};
                    _this.dataJSON[mesh.uuid].data = pointsArray[v];
                    if (shoapeColorJson.taskId) _this.dataJSON[mesh.uuid].taskId = shoapeColorJson.taskId;
                }
                if (buildId) uuidArray.push(mesh.uuid);

                _this.colorJSON[mesh.uuid] = shoapeColorJson.shoapeColor;

                var bindBuildId = _this.data.cadbuildMap[cadId];
                if (bindBuildId) {
                    var uuidBuildArray = _this.uuidBuildJSON[bindBuildId] ? _this.uuidBuildJSON[bindBuildId] : [];
                    uuidBuildArray.push(mesh.uuid);
                    _this.uuidBuildJSON[bindBuildId] = uuidBuildArray;
                }
                _this.scene.add(mesh);
            }
            if (uuidArray.length > 0) _this.uuidJSON[buildId] = uuidArray;
        },
        //设置立面颜色
        setShapeColorFun: function (taskParentName) {
            var _this = this;
            var children = _this.scene.children;
            for (var v = 0; v < children.length; v++) {
                if (children[v].type == "Mesh" && !$.isArray(children[v].material) && _this.dataJSON[children[v].uuid].taskId) {
                    var taskJSON = eval("(" + _this.dataJSON[children[v].uuid].taskId + ")");
                    if (typeof _this.data.taskIsValidMap[taskJSON[taskParentName]] == "undefined")
                        _this.colorJSON[children[v].uuid] = _this.defColorJSON.wjh;
                    else
                        _this.colorJSON[children[v].uuid] = _this.data.taskIsValidMap[taskJSON[taskParentName]] ? _this.defColorJSON.ywc : _this.defColorJSON.wwc;
                    if ($.isEmptyObject(_this.checkedObjects) || !_this.checkedObjects[children[v].uuid])
                        children[v].material.color.set(new THREE.Color(_this.colorJSON[children[v].uuid]));
                }
            }
        },
        //查找点击立面所属楼栋信息
        getBuildShapeData: function (uuid) {
            var _this = this;
            for (var cadId in _this.data.zPoints) {
                for (var buildId in _this.data.zPoints[cadId]) {
                    for (var v = 0; v < _this.data.zPoints[cadId][buildId].length; v++) {
                        if (_this.data.zPoints[cadId][buildId][v].taskId == uuid) {
                            return {buildId: buildId, buildName: _this.data.zPoints[cadId][buildId][v].buildName};
                        }
                    }
                }
            }
        },
        //由楼栋ID查询name
        getbuildName: function (buildId) {
            var _this = this;
            if (_this.data.builds && _this.data.builds.length > 0) {
                for (var v = 0; v < _this.data.builds.length; v++) {
                    if (buildId == _this.data.builds[v].buildId) {
                        return _this.data.builds[v].buildName;
                    }
                }
            }
        },
        //点击事件
        clickFun: function () {
            var _this = this;
            document.getElementById(_this.bindId).addEventListener("mouseup", function (event) {
                event.preventDefault();
                _this.mouse.x = (event.offsetX / _this.renderer.domElement.clientWidth) * 2 - 1;
                _this.mouse.y = -(event.offsetY / _this.renderer.domElement.clientHeight) * 2 + 1;

                _this.raycaster.setFromCamera(_this.mouse, _this.camera);
                var intersects = _this.raycaster.intersectObjects(_this.scene.children);
                if (intersects.length > 0) {
                    var res = intersects.filter(function (res) {
                        return res && res.object;
                    })[0];
                    if (res && res.object && _this.dataJSON[res.object.uuid] && !_this.dataJSON[res.object.uuid].isReadonly) {
                        if ((_this.type == 2 && !$.isArray(res.object.material)) || (_this.type == 3 && !$.isArray(res.object.material))) {
                            //取消选中
                            if (_this.checkedObjects[intersects[0].object.uuid]) {
                                delete _this.checkedObjects[intersects[0].object.uuid];
                                var _oldColor = _this.dataJSON[intersects[0].object.uuid].data[0].oldColor;
                                res.object.material.color.set(new THREE.Color(_oldColor?showRGB(_oldColor):_this.colorJSON[intersects[0].object.uuid]));
                            }
                            //选中
                            else {
                                if (_this.type == 2) {
                                    _this.checkedObjects[intersects[0].object.uuid] = _this.dataJSON[intersects[0].object.uuid].data;
                                    res.object.material.color.set(new THREE.Color(_this.defColorJSON.checked));
                                } else if (_this.type == 3) {
                                    var buildTaskData = _this.getBuildShapeData(_this.dataJSON[intersects[0].object.uuid].taskId);
                                    _this.clickcallback.call(_this, _this.dataJSON[intersects[0].object.uuid].taskId, {
                                        buildName: _this.getbuildName(buildTaskData.buildId),
                                        buildChildName: buildTaskData.buildName
                                    });
                                }
                            }
                        }
                    }
                }
            }, false)
        },
        //鼠标滑动事件
        mousemoveFun: function () {
            var _this = this;
            var selectedObject;
            document.getElementById(this.bindId)
                .addEventListener("mousemove", function (event) {
                    event.preventDefault();
                    if (selectedObject && !$.isArray(selectedObject.material) && !_this.checkedObjects[selectedObject.uuid]) {
                        var _oldColor = _this.dataJSON[selectedObject.uuid].data[0].oldColor;
                        selectedObject.material.color.set(new THREE.Color(_oldColor?showRGB(_oldColor):_this.colorJSON[selectedObject.uuid]));
                        selectedObject = null;
                    }
                    _this.mouse.x = (event.offsetX / _this.renderer.domElement.clientWidth) * 2 - 1;
                    _this.mouse.y = -(event.offsetY / _this.renderer.domElement.clientHeight) * 2 + 1;
                    _this.mouse.set(_this.mouse.x, _this.mouse.y, 0.5);
                    _this.raycaster.setFromCamera(_this.mouse, _this.camera);
                    var intersects = _this.raycaster.intersectObjects(_this.scene.children, true);
                    if (intersects.length > 0 && selectedObject != intersects[0].object) {
                        var res = intersects.filter(function (res) {
                            return res && res.object;
                        })[0];
                        if (res && res.object && _this.dataJSON[res.object.uuid] && !_this.dataJSON[res.object.uuid].isReadonly) {
                            selectedObject = res.object;
                            if (!$.isArray(selectedObject.material)) {
                                selectedObject.material.color.set(_this.defColorJSON.checked);
                            }
                        }
                    }
                }, true);
        },
        //坐标轴
        createAxes: function () {
            var axes = new THREE.AxisHelper(10000);
            this.scene.add(axes);
        },
        //网格线
        createGridHelper: function () {
            var gridHelper = new THREE.GridHelper(5000, 50);
            gridHelper.rotation.x = Math.PI / 2;
            this.scene.add(gridHelper);
        },
        //加载数据
        reloadData: function (data) {
            var _this = this;
            _this.isRun = false;
            window.setTimeout(function () {
                _this.init(_this.bindId, data);
                _this.createMange();
            },200)
        },
        //销毁
        distroy3D: function () {
            this.isRun = false;
        },
        animate: function () {
            var _this = this;
            window.requestAnimationFrame(function (event) {
                if(_this.isRun) _this.animate();
            });
            _this.renderer.render(_this.scene, _this.camera);
            _this.controls.update(_this.clock.getDelta());
        }
    };
    return lesson3;
}
//颜色bgr转16进制
function showRGB(s){
    hexcode="#";
    var arr = s.split(",");
    for(x=0;x<arr.length;x++){
        if(arr[x]=="")arr[x]="0";
        var c="0123456789ABCDEF", b="", a=arr[x]%16;
        b=c.substr(a,1);
        a=(arr[x]-a)/16;
        hexcode+=c.substr(a,1)+b
    }
    return hexcode
}
$.fn.extend({
	create3D: function (conf) {
	    var id = $(this).attr("id");
	    if(id) {
	        var lesson3 = new three_js();
	        //主图
	        lesson3.init(id, conf);
	        //左侧图层
            lesson3.createMange();
        }
	    //设置图层管理DIV高度
	    var hei = document.getElementById(id).clientHeight-20;
	    if(conf.type==2) $("#"+id).find(".wrap").css({"max-height": hei+"px"});
	    else $("#"+id).find(".wrap").css({"height": "100%"});
	    return lesson3;
    }
});
