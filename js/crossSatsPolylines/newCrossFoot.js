$('#dateTimePickerBegin').datetimepicker({
    showSecond: true,
    showMillisec: false,
    timeFormat: 'hh:mm:ss:l'
});
$('#dateTimePickerEnd').datetimepicker({
    showSecond: true,
    showMillisec: false,
    timeFormat: 'hh:mm:ss:l'
});
$('#queryCrossSats').click(function () {
    excuteQuery();
    //addPringonEarth();
});


$('#clearCrossPolyline').click(function () {
    //当清除卫星轨迹时，将Balloon也消除掉
    if (balloonViewModel.userClosed == false) {
        balloonViewModel.userClosed = true;
    }

    var length = viewer.scene.primitives.length;
    var removeArray = new Array();
    for (var i = 0; i < length; i++) {
        var primit = viewer.scene.primitives.get(i);
        if ("imageFoot" in viewer.scene.primitives.get(i)) {
            //viewer.scene.primitives.remove(viewer.scene.primitives.get(i));
            removeArray.push(viewer.scene.primitives.get(i));
            //break;
        }
    }
    if (removeArray.length > 0) {
        $.each(removeArray, function (k, val) {
            viewer.scene.primitives.remove(val);
        });
    }
});

function excuteQuery() {
    var editPrimitive = getEditPrimitive();
    //if (!editPrimitive) {
    //    return;
    //}
    if (isEndGreaterBegin() && editPrimitive) {
        //生成查询状态的对话框
        createCoverDiv();

        $("#cancelQuery").attr('disabled', true);

        var now = new Date;
        var nowString = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        $("#status").append("---时间" + nowString + "：查询中... \n");

        var getCrossRecs = new Cesium.GetCrossRecs({
            ellipsoid: viewer.scene.globe.ellipsoid
        });
        var satellite = $("#select_crossSat").val();
        var times = getQueryStr(satellite, $('#dateTimePickerBegin').val(), $('#dateTimePickerEnd').val());
        //var times = "satellite = 'SPOT-1' and CLOUD_COVER_AVG<=10 and START_TIME>= to_date('2001-06-23 00:00:00','YYYY-MM-DD HH24:MI:SS') AND START_TIME <= to_date('2015-11-23 22:18:21','YYYY-MM-DD HH24:MI:SS')";

        setTimeout(function () {
            excuteSth();
        }, 1000);//延迟1秒执行，在延迟的这一秒内把对话框渲染出来，不然渲染线程和js执行线程互斥
        function excuteSth() {
            if (editPrimitive.hasOwnProperty("extent")) {
                var features = getCrossRecs.crossRectangle(times, editPrimitive);
                // alert(features);
                if (features.length>0) {
                    displayFeatures(features);
                }
            }
            if (editPrimitive.hasOwnProperty("center")) {
                var features = getCrossRecs.crossCircle(times, editPrimitive);
                //alert(features);//经常是undefined，因为是异步获取数据，所以在还没获取数据的时候，已经执行到了这里，所以弹出undefined

                if (features.length>0) {
                    displayFeatures(features);
                }
            }
            if (editPrimitive.hasOwnProperty("positions")) {
                var features = getCrossRecs.crossPoly(times, editPrimitive);
                if (features.length>0) {
                    displayFeatures(features);
                }
            }
            $("#cancelQuery").val("确 定");
            $("#cancelQuery").attr('disabled', false);
            $("#cancelQuery").click(function () {
                $("#coverMiddle").remove();
                $("#coverFull").remove();
            })
        }
    }
}

function displayFeatures(featuresArray) {
    for (var k = 0; k < featuresArray.length; k++) {
        var pointsArray = featuresArray[k].geometry.rings[0];
        //var hierarchy = Cesium.Cartesian3.fromDegreesArray([
        //    pointsArray[0][0], pointsArray[0][1],
        //    pointsArray[1][0], pointsArray[1][1],
        //    pointsArray[2][0], pointsArray[2][1],
        //    pointsArray[3][0], pointsArray[3][1]
        //]);
        var positions = [];

        for (var i = 0; i < pointsArray.length - 1; ++i) {
            positions.push(Cesium.Cartesian3.fromDegrees(pointsArray[i][0], pointsArray[i][1]));
        }
        //viewer.entities.add({
        //    polyline: {
        //        positions: positions,
        //        width: 2.0,
        //        material: new Cesium.PolylineGlowMaterialProperty({
        //            color: Cesium.Color.DEEPSKYBLUE,
        //            glowPower: 0.25
        //        })
        //    }
        //});

        //var entity = viewer.entities.add({
        //    polygon: {
        //        hierarchy: new Cesium.PolygonHierarchy(positions),
        //        extrudedHeight: 0,
        //        perPositionHeight: true,
        //        material: new Cesium.ColorMaterialProperty({
        //            //color: new Cesium.Color(0.5,0.5,0.5,0),
        //            color: Cesium.Color.WHITE
        //        }),
        //        outline: true,
        //        outlineColor: Cesium.Color.CYAN,
        //        outlineWidth: 6.0
        //    }
        //});
        //
        //entity.imageFoot = "hello";
        ////条带数据
        //entity.satllite = featuresArray[k].attributes.SATELLITE;//卫星
        //entity.acceptTime = featuresArray[k].attributes.ACQUISITION_START_TIME;//接收时间
        //entity.pathNum = featuresArray[k].attributes.PATH_NUMBER;//条带号
        //entity.rowNum = featuresArray[k].attributes.ROW_NUMBER;//行编号
        //
        //var urlStr = featuresArray[k].attributes.GRANULEID;
        //entity.imageUrl = "http://eds.ceode.ac.cn/image4flex/" + urlStr + "/C/sq";//因为是img标签，不存在跨域的问题
        ////entity.imageUrl = "/ceode/image4flex/" + urlStr + "/C/sq";


        //// 1. create a polygon from points
        //var polygon = new Cesium.PolygonGeometry({
        //    polygonHierarchy: {
        //        positions: positions
        //    }
        //});
        //var geometry = Cesium.PolygonGeometry.createGeometry(polygon);


        var instance = new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: {
                    positions: positions
                },
                height: 1000.0
            }),
            id: featuresArray[k].attributes.GRANULEID,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)
            }
        });


        var primiti = viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: false,
                //closed : true
            })
        }));

        primiti.imageFoot = "hello";
        //条带数据
        primiti.satllite = featuresArray[k].attributes.SATELLITE;//卫星
        primiti.acceptTime = featuresArray[k].attributes.ACQUISITION_START_TIME;//接收时间
        primiti.pathNum = featuresArray[k].attributes.PATH_NUMBER;//条带号
        primiti.rowNum = featuresArray[k].attributes.ROW_NUMBER;//行编号

        var urlStr = featuresArray[k].attributes.GRANULEID;
        primiti.imageUrl = "http://eds.ceode.ac.cn/image4flex/" + urlStr + "/C/sq";//因为是img标签，不存在跨域的问题
        //entity.imageUrl = "/ceode/image4flex/" + urlStr + "/C/sq";
    }
    var scene = viewer.scene;
    var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    var ellipsoid = scene.globe.ellipsoid;

    clickDetailHandler.setInputAction(function (click) { // actionFunction, mouseEventType, eventModifierKey
            var pickedObject = scene.pick(click.position);

            if (Cesium.defined(pickedObject)) {
                if (typeof window !== 'undefined') {
                    if (pickedObject.primitive.imageFoot) {
                        var pickedObjId = pickedObject.primitive;
                        clickposition = scene.camera.pickEllipsoid(click.position, ellipsoid);
                        balloonViewModel.position = click.position;
                        balloonViewModel.content = getHtml(pickedObjId.satllite, pickedObjId.acceptTime, pickedObjId.pathNum, pickedObjId.rowNum, pickedObjId.imageUrl);
                        balloonViewModel.showBalloon = true;
                        balloonViewModel.update();
                    }
                }
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
    );
    function getHtml(satllite, acceptTime, pathNum, rowNum, imageUrl) {
        var html = "";
        html += "        <table height='130' width='300'>";
        html += "            <tr style='text-align:center;font-weight:bold;background:#9CBCE2'>";
        html += "                <td colspan='2'>条带数据</td>";
        html += "            </tr>";
        html += "            <tr>";
        html += "                <td> 卫星：</td>";
        html += "                <td>" + satllite + "</td>";
        html += "            </tr>";
        html += "            <tr>";
        html += "                <td width='50%'>接收时间：</td>";
        html += "                <td>" + acceptTime + "</td>";
        html += "            </tr>";
        html += "            <tr>";
        html += "                <td> 条带号： </td>";
        html += "                <td>" + pathNum + "</td>";
        html += "            </tr>";
        html += "            <tr>";
        html += "                <td width='50%'>行编号：</td>";
        html += "                <td>" + rowNum + "</td>";
        html += "            </tr>";
        html += "        </table>";
        html += "<img height='300' width='320' src=" + imageUrl + "></img> ";
        return html;
    }
}


function createCoverDiv() {
    var cover = $('<div id="coverFull"></div>').css({
        "display": "block",
        "position": "fixed",
        "z-index": 700,
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
        "background-color": 'rgba(0, 0, 0, 0.5)'
    });
    $('body').append(cover);

    var coverMiddle = $('<div id="coverMiddle"></div>').css({
        "z-index": 710,
        "top": "30%",
        "left": "30%",
        "width": "350px",
        "height": "350px",
        "background-color": "#E7E7E7",
        "border": "3px solid #B1B1B1",
        "position": "absolute",
        "-moz-border-radius": "15px",
        "-webkit-border-radius": "15px",
        "border-radius": "15px"
    });
    $('body').append(coverMiddle);

    var coverHead = $('<div id="coverHead"></div>').css({
        "width": "100%",
        "height": "20%",
        "position": "relative"
    });
    var labelHead = $('<label id="labelHead">查询遥感数据</label> ').css({
        "position": "absolute",
        "left": "6%",
        "top": "30%",
        "font-weight": "bold"
    });
    coverHead.append(labelHead);
    coverMiddle.append(coverHead);

    var queryStatus = $('<div id="queryStatus"></div>').css({
        "width": "100%",
        "height": "60%"
    });
    var now = new Date;
    var nowString = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var txtStatus = $('<textarea id="status" cols="" rows="" readonly="readonly" >---时间' + nowString + '：开始查询。\n</textarea>').css({
        "width": "98%",
        "height": "100%",
        "font-size": "18px"
    });
    queryStatus.append(txtStatus);
    coverMiddle.append(queryStatus);

    var queryFoot = $('<div id="queryFoot"></div>').css({
        "width": "100%",
        "height": "20%",
        "position": "relative"
    });
    var cancelQuery = $('<input id="cancelQuery" type="button" value="取消查询" />').css({
        "position": "absolute",
        "left": "65%",
        "top": " 35%",
        "height": "35px"
    });
    queryFoot.append(cancelQuery);
    coverMiddle.append(queryFoot);
}

function isEndGreaterBegin() {
    var dateTxtBegin, dateTxtEnd, dateObjBegin, dateObjEnd;
    dateTxtBegin = $('#dateTimePickerBegin').val();
    dateTxtEnd = $('#dateTimePickerEnd').val();
    if (dateTxtBegin == "") {
        alert("请输入起始时间点！");
        return false;
    }
    if (dateTxtEnd == "") {
        alert("请输入结束时间点！");
        return false;
    }
    dateObjBegin = usefullFuncs.getDateObjFromText(dateTxtBegin);
    dateObjEnd = usefullFuncs.getDateObjFromText(dateTxtEnd);

    if (dateObjEnd.year < dateObjBegin.year) {
        alert("结束时间必须晚于开始时间，请重新选择！");
        return false;
    }
    if (dateObjEnd.year == dateObjBegin.year) {
        if (dateObjEnd.month < dateObjBegin.month) {
            alert("结束时间必须晚于开始时间，请重新选择！");
            return false;
        }
        if (dateObjEnd.month == dateObjBegin.month) {
            if (dateObjEnd.day < dateObjBegin.day) {
                alert("结束时间必须晚于开始时间，请重新选择！");
                return false;
            }
            if (dateObjEnd.day == dateObjBegin.day) {
                if (dateObjEnd.hour < dateObjBegin.hour) {
                    alert("结束时间必须晚于开始时间，请重新选择！");
                    return false;
                }
                if (dateObjEnd.hour == dateObjBegin.hour) {
                    if (dateObjEnd.minute < dateObjBegin.minute) {
                        alert("结束时间必须晚于开始时间，请重新选择！");
                        return false;

                    }
                }
            }
        }
    }

    return true;
}

function getQueryStr(satllite, dateTxtBegin, dateTxtEnd) {
    var satlliteStr = "satellite ='" + satllite + "' and CLOUD_COVER_AVG<=10 and START_TIME>= to_date('20";
    var time1 = "','YYYY-MM-DD HH24:MI:SS') AND START_TIME <= to_date('20";
    var time2 = "','YYYY-MM-DD HH24:MI:SS')";

    var timeStart = dateTxtBegin.slice(2, 4) + "-" + dateTxtBegin.slice(5, 7) + "-" + dateTxtBegin.slice(8, 10) + " " + dateTxtBegin.slice(11, 13) + ":" + dateTxtBegin.slice(14, 16) + ":00";
    var timeEnd = dateTxtEnd.slice(2, 4) + "-" + dateTxtEnd.slice(5, 7) + "-" + dateTxtEnd.slice(8, 10) + " " + dateTxtEnd.slice(11, 13) + ":" + dateTxtEnd.slice(14, 16) + ":00";
    var totalStr = satlliteStr + timeStart + time1 + timeEnd + time2;

    return totalStr;


    //month = parseInt(dateTxt.slice(5, 7));
    //day = parseInt(dateTxt.slice(8, 10));
    //year = parseInt(dateTxt.slice(2, 4));
    //hour = parseInt(dateTxt.slice(11, 13));
    //minute = parseInt(dateTxt.slice(14, 16));
}

function getEditPrimitive() {
    var editPrimitive, length, allPrimitives;
    length = viewer.scene.primitives.length;
    allPrimitives = viewer.scene.primitives;
    for (var i = 0; i < length; i++) {
        if ("_editMode" in allPrimitives.get(i)) {
            if (allPrimitives.get(i)._editMode) {
                if (allPrimitives.get(i)._editMode == true) {
                    editPrimitive = allPrimitives.get(i);
                    break;
                }
            }
        }
    }
    if (editPrimitive) {
        return editPrimitive;
    } else {
        alert("请选择感兴趣的区域");
        return;
    }

}