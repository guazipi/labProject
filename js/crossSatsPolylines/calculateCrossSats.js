/**
 * Created by chet on 15/8/4.
 */
//$('#dateTimePicker').datetimepicker();
//如果只需要显示时间，则：
//$('#dateTimePicker').timepicker();
//初始化时间input，定义时间格式：
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

$('#clearCrossPolyline').click(function () {
    if (!viewer.scene.primitives.contains(satTraces)) {
        viewer.scene.primitives.add(satTraces);
    }
    if (!viewer.scene.primitives.contains(satPoints)) {
        viewer.scene.primitives.add(satPoints);
    }

    if (satTraces.length > 0) {
        satTraces.removeAll();
    }
    if (satPoints.length > 0) {
        satPoints.removeAll();
    }

    if ($("#rightSide_div").css('width') == "290px") {
        $("#rightSide_div").css('width', "40px");
        //$("#rightSide_div").css('height', "450px");
        $("#rightSide_div").css('height', "40px");
        $("#hideSatInfoPanel").attr("class", "layout-button-left");

        $("#crossSatsTableDiv").html("");
        //if ($("#crossSatsTable").length) {
        //    $("#crossSatsTable").remove();
        //}
        $("#crossSatsTableDiv").attr("style", "display:none");
        // $("#showCrossSats").click();
    }
    $("#crossinfo-message").attr("style", "display:block");

    //当清除卫星轨迹时，将Balloon也消除掉
    if (balloonViewModel.userClosed == false) {
        balloonViewModel.userClosed = true;
    }
});
$('#queryCrossSats').click(function () {
    //显示正在加载时的效果
    $("#cover").show();
    $("#coverShow").show();
    setTimeout("excuteQuery()", 1000);

    //Concurrent.Thread.create(excuteQuery);
});

function excuteQuery() {
    if (!viewer.scene.primitives.contains(satTraces)) {
        viewer.scene.primitives.add(satTraces);
    }
    if (!viewer.scene.primitives.contains(satPoints)) {
        viewer.scene.primitives.add(satPoints);
    }
    if (satTraces.length < 1) {
        crossSatsClickDetails(viewer.scene);
    }

    if (satTraces.length > 0) {
        satTraces.removeAll();
    }
    if (satPoints.length > 0) {
        satPoints.removeAll();
    }
    //当重新点击查询时，将存在的Balloon也消除掉
    if (balloonViewModel.userClosed === false) {
        balloonViewModel.userClosed = true;
    }


    var color = new Cesium.Color(0.8, 0.9, 0.4, 1.0);
    addCrossSatTraces(satrecs[0], color);


    var allInfoArr = prepareCrossInfo();
    if (allInfoArr[0].length > 0) {
        if (!$("#crossSatsTable").length) {
            $("#crossSatsTableDiv").append("<div id='crossSatsTable'></div>");
        }
        // if($("#rightSide_div").css('width')=="290px"){
        //     //如果计算有卫星信息，就弹出右边的边框
        //     $("#rightSide_div").css('width', "40px");
        //     //$("#rightSide_div").css('height', "450px");
        //     $("#rightSide_div").css('height', "40px");
        //     $("#hideSatInfoPanel").attr("class", "layout-button-right");
        // }

        initializeCrossSatsTable1(allInfoArr);
        $("#crossSatsTable").css('height', "90%");

        if ($("#rightSide_div").css('width') !== "290px") {
            //如果计算有卫星信息，就弹出右边的边框
            $("#rightSide_div").css('width', "290px");
            $("#rightSide_div").css('height', "63%");
            $("#hideSatInfoPanel").attr("class", "layout-button-right");
        }


        //模拟点击事件，让弹出右边框时，显示的是过境卫星
        $("#showCrossSats").click();


        $("#crossinfo-message").attr("style", "display:none");
        $("#crossSatsTableDiv").attr("style", "display:block");

        $("#cover").hide();
        $("#coverShow").hide();

    } else {
        //隐藏正在加载时的效果
        $("#cover").hide();
        $("#coverShow").hide();

        $("#crossinfo-message").attr("style", "display:block");
        if ($("#rightSide_div").css('width') == "290px") {
            // $("#crossSatsTable").attr("style", "display:none");
            $("#crossSatsTableDiv").attr("style", "display:none");
            $("#showCrossSats").click();
        }
    }
}


//$('#queryCrossSats').click(function () {
//    //显示正在加载时的效果
//    $("#cover").show();
//    $("#coverShow").show();
//
//    // if($("#rightSide_div").css('width')=="290px"){
//    //      //如果计算有卫星信息，就弹出右边的边框
//    //      $("#rightSide_div").css('width', "40px");
//    //      //$("#rightSide_div").css('height', "450px");
//    //      $("#rightSide_div").css('height', "40px");
//    //      $("#hideSatInfoPanel").attr("class", "layout-button-right");
//    //  }
//    if (!viewer.scene.primitives.contains(satTraces)) {
//        viewer.scene.primitives.add(satTraces);
//    }
//    if (!viewer.scene.primitives.contains(satPoints)) {
//        viewer.scene.primitives.add(satPoints);
//    }
//    if (satTraces.length < 1) {
//        crossSatsClickDetails(viewer.scene);
//    }
//
//    if (satTraces.length > 0) {
//        satTraces.removeAll();
//    }
//    if (satPoints.length > 0) {
//        satPoints.removeAll();
//    }
//    //当重新点击查询时，将存在的Balloon也消除掉
//    if (balloonViewModel.userClosed == false) {
//        balloonViewModel.userClosed = true;
//    }
//
//
//    var color = new Cesium.Color(0.8, 0.9, 0.4, 1.0);
//    addCrossSatTraces(satrecs[0], color);
//
//
//    var allInfoArr = prepareCrossInfo();
//    if (allInfoArr[0].length > 0) {
//        if (!$("#crossSatsTable").length) {
//            $("#crossSatsTableDiv").append("<div id='crossSatsTable' style='height:100%'></div>");
//        }
//        // if($("#rightSide_div").css('width')=="290px"){
//        //     //如果计算有卫星信息，就弹出右边的边框
//        //     $("#rightSide_div").css('width', "40px");
//        //     //$("#rightSide_div").css('height', "450px");
//        //     $("#rightSide_div").css('height', "40px");
//        //     $("#hideSatInfoPanel").attr("class", "layout-button-right");
//        // }
//
//        initializeCrossSatsTable1(allInfoArr);
//        $("#crossSatsTable").css('height', "90%");
//
//        if ($("#rightSide_div").css('width') !== "290px") {
//            //如果计算有卫星信息，就弹出右边的边框
//            $("#rightSide_div").css('width', "290px");
//            //$("#rightSide_div").css('height', "450px");
//            $("#rightSide_div").css('height', "63%");
//            $("#hideSatInfoPanel").attr("class", "layout-button-right");
//        }
//
//
//        //模拟点击事件，让弹出右边框时，显示的是过境卫星
//        $("#showCrossSats").click();
//
//
//        $("#crossinfo-message").attr("style", "display:none");
//        $("#crossSatsTableDiv").attr("style", "display:block");
//
//    } else {
//        //隐藏正在加载时的效果
//        $("#cover").hide();
//        $("#coverShow").hide();
//
//        $("#crossinfo-message").attr("style", "display:block");
//        if ($("#rightSide_div").css('width') == "290px") {
//            // $("#crossSatsTable").attr("style", "display:none");
//            $("#crossSatsTableDiv").attr("style", "display:none");
//            $("#showCrossSats").click();
//        }
//    }
//
//});

/**
 *给定一个点的经纬度坐标和一个多边形的经纬度坐标的数组，
 * 判断这个点是否在这个多边形中
 * @param point
 * @param vs
 * @returns {boolean}
 */
function isPointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0],
        y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0],
            yi = vs[i][1];
        var xj = vs[j][0],
            yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * 获取当前scene中正在编辑点primitive
 * @returns {*}
 */
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
/**
 * 给定一个点的经纬度坐标、圆的中心的的经纬度坐标和圆的半径，
 * 判断这个点是否在这个圆内
 * @param pointLonLat
 * @param certerLonLat
 * @param radius
 * @returns {boolean}
 */
function isPointInCircle(pointLonLat, certerLonLat, radius) {
    var boolen = true;
    var distance = getGreatCircleDistance(pointLonLat, certerLonLat);
    if (distance <= radius)
        return boolen;
    else
        return !boolen;
}
/**
 * 将给定点一个点的位置坐标转换为WGS84下的经纬度坐标
 * @param position
 * @returns {Array}
 */
function getLonLatFromCartesian(position) {
    var cartographic, lon, lat;
    var lonLatArray = [];
    cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position);

    lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
    lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);

    lonLatArray.push(lon);
    lonLatArray.push(lat);

    return lonLatArray;
}

/**
 * 根据日期控件input里面的具体时间信息，
 * 抽取出一个含有年月日时分秒的时间对象
 * @param dateTxt
 * @returns {{month: (Number|*), day: (Number|*), year: (Number|*), hour: (Number|*), minute: (Number|*), second: (Number|*)}}
 */
function getDateObjFromText(dateTxt) {
    var month, day, year,
        hour, minute, second;
    month = parseInt(dateTxt.slice(0, 2));
    day = parseInt(dateTxt.slice(3, 5));
    year = parseInt(dateTxt.slice(6, 10));
    hour = parseInt(dateTxt.slice(11, 13));
    minute = parseInt(dateTxt.slice(14, 16));
    second = parseInt(dateTxt.slice(17, 19));

    return {
        'month': month,
        'day': day,
        'year': year,
        'hour': hour,
        'minute': minute,
        'second': second
    }
}
/**
 * caculate the great circle distance
 * 根据一个经纬度的数组，计算球面的距离
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getGreatCircleDistance(oneLonLat, anotherLonLat) {
    var lat1, lng1, lat2, lng2,
        EARTH_RADIUS, PI,
        radLat1, radLat2,
        a, b, s;
    lng1 = oneLonLat[0];
    lat1 = oneLonLat[1];
    lng2 = anotherLonLat[0];
    lat2 = anotherLonLat[1];

    EARTH_RADIUS = 6378137.0; //单位M
    PI = Math.PI;

    function getRad(d) {
        return d * PI / 180.0;
    };


    radLat1 = getRad(lat1);
    radLat2 = getRad(lat2);

    a = radLat1 - radLat2;
    b = getRad(lng1) - getRad(lng2);

    s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;

    return s;
}
//////////////////////////////////////////以上几个函数，现在不用///////////////////////////////////////

/**
 * 根据起始点和结束点的时间对象，生成一个JulianDate，
 * 然后利用SGP模型计算在这个JulianDate时卫星的位置
 * @returns {{satsBeginPos: (positions|*), satsEndPos: (positions|*)}}
 */
function getSatsBeginEndPos() {
    var dateTxtBegin, dateTxtEnd, dateObjBegin, dateObjEnd,
        newDateBegin, newDateEnd, jdBegin, jdEnd,
        satsBeginPos, satsEndPos;
    dateTxtBegin = $('#dateTimePickerBegin').val();
    dateTxtEnd = $('#dateTimePickerEnd').val();
    if (dateTxtBegin == "") {
        alert("请输入起始时间点！");
        return;
    }
    if (dateTxtEnd == "") {
        alert("请输入结束时间点！");
        return;
    }
    dateObjBegin = getDateObjFromText(dateTxtBegin);
    dateObjEnd = getDateObjFromText(dateTxtEnd);

    if (dateObjEnd.year < dateObjBegin.year) {
        alert("结束时间必须晚于开始时间，请重新选择！");
        //$('#dateTimePickerBegin').val("");
        //$('#dateTimePickerEnd').val("");
        return;
    }
    if (dateObjEnd.year == dateObjBegin.year) {
        if (dateObjEnd.month < dateObjBegin.month) {
            alert("结束时间必须晚于开始时间，请重新选择！");
            return;
        }
        if (dateObjEnd.month == dateObjBegin.month) {
            if (dateObjEnd.day < dateObjBegin.day) {
                alert("结束时间必须晚于开始时间，请重新选择！");
                return;
            }
            if (dateObjEnd.day == dateObjBegin.day) {
                if (dateObjEnd.hour < dateObjBegin.hour) {
                    alert("结束时间必须晚于开始时间，请重新选择！");
                    return;
                }
                if (dateObjEnd.hour == dateObjBegin.hour) {
                    if (dateObjEnd.minute < dateObjBegin.minute) {
                        alert("结束时间必须晚于开始时间，请重新选择！");
                        return;

                    }
                    if (dateObjEnd.minute < dateObjBegin.minute) {
                        if (dateObjEnd.second < dateObjBegin.second) {
                            alert("结束时间必须晚于开始时间，请重新选择！");
                            return;
                        }
                        //if (dateObjEnd.second == dateObjBegin.second) {
                        //    alert("结束时间必须晚于开始时间")
                        //}
                    }
                }
            }
        }
    }
    newDateBegin = new Date(dateObjBegin.year, dateObjBegin.month, dateObjBegin.day,
        dateObjBegin.hour, dateObjBegin.minute, dateObjBegin.second);
    newDateEnd = new Date(dateObjEnd.year, dateObjEnd.month, dateObjEnd.day,
        dateObjEnd.hour, dateObjEnd.minute, dateObjEnd.second);
    jdBegin = Cesium.JulianDate.fromDate(newDateBegin);
    jdEnd = Cesium.JulianDate.fromDate(newDateEnd);
    satsBeginPos = updateSatrecsPosVel(satrecs, jdBegin).positions;
    satsEndPos = updateSatrecsPosVel(satrecs, jdEnd).positions;

    return {
        'satsBeginPos': satsBeginPos,
        'satsEndPos': satsEndPos
    }
}

/**
 * 给定一组卫星的实时位置坐标（不是cartesian形式的，需要转化），
 * 和一个正在处于编辑状态的primitive，判断这个primitive的形状，
 *根据不同的primitive的形状（多边形，长方形和圆形），
 * 判断这一组卫星的实时位置坐标是否在这个primitive中
 * @param satsPos
 * @returns {Array}
 */
function getCrossSatsInfo(satsPos) {
    var editPrimitive = getEditPrimitive();

    var satsCrossArray = [];
    var satsCrossName = [];
    for (var i = 0; i < satsPos.length; i++) {
        var pos = satsPos[i];
        var newPos = new Cesium.Cartesian3(pos[0] * 1000, pos[1] * 1000, pos[2] * 1000);
        var satLonLat = getLonLatFromCartesian(newPos);

        if (editPrimitive.hasOwnProperty("extent")) {
            /**
             * 将长方形的四个extent的边界转化为长方形的四个顶点的坐标。
             * @type {number}
             */
            var radToDegree = 180.0 / Math.PI;
            var extent = editPrimitive.extent;
            var extentArray = [];
            extentArray.push([extent.east * radToDegree, extent.north * radToDegree]);
            extentArray.push([extent.east * radToDegree, extent.south * radToDegree]);
            extentArray.push([extent.west * radToDegree, extent.north * radToDegree]);
            extentArray.push([extent.west * radToDegree, extent.sourth * radToDegree]);

            if (isPointInPolygon(satLonLat, extentArray)) {
                satsCrossArray.push(satrecs[i]);
                satsCrossName.push(satData[i].name);
            }

        }
        if (editPrimitive.hasOwnProperty("center")) {
            var certerLonLat = getLonLatFromCartesian(editPrimitive.center);

            if (isPointInCircle(satLonLat, certerLonLat, editPrimitive.radius)) {
                satsCrossArray.push(satrecs[i]);
                satsCrossName.push(satData[i].name);
            }
        }
        if (editPrimitive.hasOwnProperty("positions")) {
            //将多边形的位置坐标（cartesian形式的）转化为经纬度形式的，并抽取出经纬度
            var positionsLonLat = [];
            var polygonPos = editPrimitive.positions;
            for (var k = 0; k < polygonPos.length; k++) {
                positionsLonLat.push(getLonLatFromCartesian(polygonPos[k]));
            }

            if (isPointInPolygon(satLonLat, positionsLonLat)) {
                satsCrossArray.push(satrecs[i]);
                satsCrossName.push(satData[i].name);
            }
        }
    }
    return satsCrossName;
}

/**
 * 根据以上的一系列函数得到的处于primitive卫星的name，
 * 判断起始时间和结束时间相同的卫星，并不将其重复加入总的卫星名称的数组中
 * @returns {Array}
 */
function shwoCrossSatsInfo() {
    var allSatsCrossName = [];
    var satsBeginEndPOs,
        beginSatsCrossName, endSatsCrossName;
    satsBeginEndPOs = getSatsBeginEndPos();
    beginSatsCrossName = getCrossSatsInfo(satsBeginEndPOs.satsBeginPos);
    endSatsCrossName = getCrossSatsInfo(satsBeginEndPOs.satsEndPos);
    for (var i = 0; i < beginSatsCrossName.length; i++) {
        allSatsCrossName.push(beginSatsCrossName[i]);
        for (var k = 0; k < endSatsCrossName.length; k++) {
            if (!(beginSatsCrossName[i] == endSatsCrossName[k])) {
                allSatsCrossName.push(endSatsCrossName[k]);
            }
        }
    }
    return allSatsCrossName;
}