/**
 * Created by chet on 15/7/22.
 */
///////////////////////////////////////////////////////////////////////////
// Satellite records and calculation
function populateSatelliteEntity() {
    var satnum, max, entity;

    // clear out the old ones
    viewer.entities.removeAll();

    //初始设置每个卫星billboard和卫星label的位置均在(0, 0, 0)位置，
    //之后会有setinterval这个函数在不停的运行，所以卫星的位置也会及时的改变，
    //有的时候反应慢的话，一开始加载卫星billboard和卫星label时，会不友好的显示在(0, 0, 0)处
    for (satnum = 0, max = satData.length; satnum < max; satnum += 1) {
        entity = viewer.entities.add({
            id: satData[satnum].noradId,
            position: new Cesium.Cartesian3(0, 0, 0),
            //billboard: {
            //    image: "../../img/satellites/satellite.png"
            //},
            model: {
                uri: "./dataset/3dmodels/Deep_space.bgltf",
                show: 'true',
                scale: 2.0,
                minimumPixelSize:64
            },
            label: {
                font: '15px sans-serif',
                pixelOffset: new Cesium.Cartesian2(16, 12),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                fillColor: Cesium.Color.DARKORANGE,
                outlineColor: Cesium.Color.BLACK,
                style: Cesium.LabelStyle.FILL,
                text: satData[satnum].name + "卫星"

            }
        }); // BOGUS position
        // attach names for mouse interaction
        // TODO: just attach satData[satnum] and let JS display the attrs it wants?
        entity.satelliteName = satData[satnum].name;
        entity.satelliteNoradId = satData[satnum].noradId;
        entity.satelliteDesignator = satData[satnum].intlDesig;
        entity.satelliteData = satData[satnum];
        entity.satelliteNum = satnum;
    }
}

function pupulateSatSweep() {
    var satnum, max, sweepPolygon;
    for (satnum = 0, max = satData.length; satnum < max; satnum += 1) {
        sweepPolygon = viewer.entities.add({
            id: satData[satnum].noradId + "02",
            show: false,
            polygon: {
                //hierarchy: hierarchy,
                extrudedHeight: 0,
                perPositionHeight: true,
                material: Cesium.Color.ORANGE.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.BLACK
            }
        });
    }
}

function updateSatelliteEntityPos(satPositions) {
    var posnum, max, pos, oldPos, newPos, bb;

    for (posnum = 0, max = satPositions.length; posnum < max; posnum += 1) {
        pos = satPositions[posnum];
        newPos = new Cesium.Cartesian3(pos[0] * 1000, pos[1] * 1000, pos[2] * 1000); // TODO multiplyByScalar(1000)

        bb = viewer.entities.getById(satData[posnum].noradId);
        if (bb) {
            oldPos = bb.position;

            //console.log(oldPos._value.x);

            bb.position = newPos;

            //console.log("这是一个老点");
            //console.log(oldPos);
            //var oldPosition = new Cesium.Cartesian3(oldPos._value.x, oldPos._value.y, oldPos._value.z);
            //var newOldPos = cartesianToSurface(oldPosition);
            //console.log(newOldPos);
            //
            //console.log("这是一个新点");
            //console.log(newPos);
            //var newNewPos = cartesianToSurface(newPos);
            //console.log(newNewPos);

            if (oldPos._value.x != 0) {
                //showSatSweep(posnum, oldPos, newPos);
                showSatSweep2(posnum, newPos);
                //showSatSweep1(posnum, oldPos, newPos);
            }
        }
    }
}

function cartesianToSurface(cartesian) {
    var cartographic, newLon, newLat, newCartesian;
    cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    newLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
    newLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
    newCartesian = Cesium.Cartesian3.fromDegrees(newLon, newLat);

    return newCartesian;
}

function showSatSweep(posnum, oldPos, newPos) {
    var oldPosition,
        newOldPos, newNewPos, distance,
        pointThree,
        hierarchy;

    oldPosition = new Cesium.Cartesian3(oldPos._value.x, oldPos._value.y, oldPos._value.z);
    newOldPos = cartesianToSurface(oldPosition);
    newNewPos = cartesianToSurface(newPos);
    distance = 100000;
    pointThree = getPointAfterCalculate(newOldPos, newNewPos, distance);


    hierarchy = Cesium.Cartesian3.fromArray([newPos.x, newPos.y, newPos.z,
        newNewPos.x, newNewPos.y, newNewPos.z,
        pointThree.x, pointThree.y, pointThree.z
    ]);
    if (viewer.entities.getById(satData[posnum].noradId + "02")) {
        viewer.entities.getById(satData[posnum].noradId + "02").polygon.hierarchy = hierarchy;
    }
}

function getPointAfterCalculate(oldPosition, newPosition, distance) {
    var pointA = new Array(oldPosition.x, oldPosition.y, oldPosition.z);
    var pointB = new Array(newPosition.x, newPosition.y, newPosition.z);
    var distance = distance;
    var tmp;
    //$.ajaxSettings.async = false;
    //$.getJSON("php/getTLE/getSthFromPython.php?pointA=" + poingA+"&pointB="+pointB+"&distance="+distance, function (data, testStatus) {
    $.getJSON("php/getTLE/getSthFromPython.php", {
        'pointA': pointA,
        'pointB': pointB,
        'distance': distance
    }, function (data, testStatus) {
        //console.log(data);
        tmp = getPointFromPython(data);

    });
    //$.ajaxSettings.async = true;
    return tmp;
}


function getPointFromPython(data) {
    var dataString, str,
        pointX, pointY, pointZ,
        newCartesian;
    dataString = data[0].toString();
    dataString = dataString.slice(1, dataString.length - 1);
    str = dataString.split(/\s+/);
    //if (str.length > 3) {
    //    str.shift();
    //}
    if (str[0] == "") {
        str.shift();
    }
    if (str[str.length] == "") {
        str.pop();
    }
    pointX = parseFloat(str[0]);
    pointY = parseFloat(str[1]);
    pointZ = parseFloat(str[2]);

    newCartesian = new Cesium.Cartesian3(pointX, pointY, pointZ);
    return newCartesian;
}


function showSatSweep2(posnum, newPosition) {
    var newPos, newCartographic,
        newLon, newLat, height,
        hierarchy;
    newPos = newPosition;

    newCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(newPos);

    //console.log(newPos);
    //console.log(newCartographic);
    newLon = Cesium.Math.toDegrees(newCartographic.longitude).toFixed(3);
    newLat = Cesium.Math.toDegrees(newCartographic.latitude).toFixed(3);
    height = newCartographic.height; //是地表以上的高度，单位是米
    //var newPos0 = Cesium.Cartesian3.fromDegrees(newLon, newLat);

    hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights([newLon, newLat, height,
        newLon, newLat, 0,
        newLon - 0.9, newLat - 0.9, 0
    ]);
    if (viewer.entities.getById(satData[posnum].noradId + "02")) {
        viewer.entities.getById(satData[posnum].noradId + "02").polygon.hierarchy = hierarchy;
    }

}


function showSatSweep1(posnum, oldPosition, newPosition) {
    var newPos, newCartographic,
        newLon, newLat, height,
        hierarchy;

    newPos = newPosition;

    newCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(newPos);
    newLon = Cesium.Math.toDegrees(newCartographic.longitude).toFixed(3);
    newLat = Cesium.Math.toDegrees(newCartographic.latitude).toFixed(3);
    height = newCartographic.height;

    //var oldPos = new Cesium.Cartesian3(oldPosition._value.x, oldPosition._value.y, oldPosition._value.z);
    var oldPos = new Cesium.Cartesian3(oldPosition._value.x, oldPosition._value.y, 0);


    var oldCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(oldPos);
    var oldLon = Cesium.Math.toDegrees(oldCartographic.longitude).toFixed(3);
    var oldLat = Cesium.Math.toDegrees(oldCartographic.latitude).toFixed(3);


    var k1 = (oldLon - newLon) / (oldLat - newLat);
    var k = -1 / k1;
    var b = newLon - k * newLat;
    var distance = 50000;
    var middleNewNewLat = Math.pow(distance, 2) / (1 + Math.pow(k, 2));

    var newNewLat = Math.sqrt(middleNewNewLat) + newLat;
    var newNewLon = newNewLat * k + b;

    hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights([newLon, newLat, height,
        newLon, newLat, 0,
        newNewLon, newNewLat, 0
    ]);
    if (viewer.entities.getById(satData[posnum].noradId + "02")) {
        viewer.entities.getById(satData[posnum].noradId + "02").polygon.hierarchy = hierarchy;
    }
}

// Calculate new Satrecs based on time given as fractional Julian Date
// (since that's what satrec stores).
// Return object containing updated list of Satrecs, Rposition, Velocity.
// We don't have r (position) or v (velocity) in the satrec,
// so we have to return a those as a list as well; ugly.
// XXX Should I just add position and velocity to the satrec objects?

function updateSatrecsPosVel(satrecs, julianDate) {
    var satrecsOut = [];
    var positions = [];
    var velocities = [];
    var satnum, max, satrecTmp,
        union, dateArray, newDate, jdSat,
        minutesSinceEpoch, rets, satrec, r, v;

    for (satnum = 0, max = satrecs.length; satnum < max; satnum += 1) {
        satrecTmp = satrecs[satnum];
        //老版本的用法
        //jdSat = new Cesium.JulianDate.fromTotalDays(satrecTmp.jdsatepoch);
        //minutesSinceEpoch = jdSat.getMinutesDifference(julianDate);

        union = satrecTmp.epochyr.toString() + satrecTmp.epochdays.toString();
        dateArray = initial.DateFromEpoch(parseFloat(union));

        newDate = new Date(parseInt(dateArray['year']), parseInt(dateArray['month']) - 1, parseInt(dateArray['day']),
            parseInt(dateArray['hour']), parseInt(dateArray['minute']), parseInt(dateArray['second']));
        jdSat = Cesium.JulianDate.fromDate(newDate);

        //jdSat = new Cesium.JulianDate(satrecTmp.jdsatepoch, 0, Cesium.TimeStandard.UTC);
        //只能说这个是错误用法，总是提示没有secondsDifference这个property
        //minutesSinceEpoch = jdSat.secondsDifference(this, julianDate) / 60;


        //minutesSinceEpoch = Cesium.JulianDate.secondsDifference(jdSat, julianDate) / 60;
        minutesSinceEpoch = Cesium.JulianDate.secondsDifference(julianDate, jdSat) / 60;
        rets = sgp4(satrecs[satnum], minutesSinceEpoch);
        satrec = rets.shift();
        r = rets.shift(); // [1802,    3835,    5287] Km, not meters
        v = rets.shift();
        satrecsOut.push(satrec);
        positions.push(r);
        velocities.push(v);
    }
    // UPDATE GLOBAL SO OTHERS CAN USE IT (TODO: make this sane w.r.t. globals)
    //satPositions = positions;
    return {
        'newSatrecs': satrecsOut,
        'positions': positions,
        'velocities': velocities
    };
}


/**
 * 鼠标滑过球体时，显示鼠标坐标和卫星标签
 * @param scene
 * @param labels
 * @param ellipsoid
 */
function showmousePosandsatlabel(scene, labels, ellipsoid) {
    var showMousePoshandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    showMousePoshandler.setInputAction(function (movement) {
        //console.log(movement.endPosition);
        //选择显示鼠标坐标的复选框时，当鼠标滑过球体上某个位置时，显示该地点的位置坐标
        if ($("#cb_showmousepos").is(':checked')) {
            labels.removeAll();
            var cartesian = scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian && !isNaN(cartesian.x)) {
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);


                var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
                var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);

                labels.add({
                    //show : true,
                    position: cartesian,
                    font: '16px sans-serif',
                    pixelOffset: new Cesium.Cartesian2(16, 12),
                    //fillColor: new Cesium.Color(0.6, 0.9, 1.0),
                    fillColor: Cesium.Color.DARKORANGE,
                    outlineColor: Cesium.Color.BLACK,
                    style: Cesium.LabelStyle.FILL,
                    text: '（' + lon + ', ' + lat + '）'
                });
            }
        }

        //当鼠标滑过卫星的billboard时，显示卫星的名称
        var pickedObject = scene.pick(movement.endPosition);
        var satDiv = document.getElementById('satellite_popup');
        var canvasTop = viewer.scene.canvas.offsetTop;

        if (pickedObject) { // Only show satellite, not Geo marker
            if (pickedObject.id) {
                if (pickedObject.id.satelliteName) {
                    satDiv.textContent = pickedObject.id.satelliteName + "卫星";
                    satDiv.style.left = movement.endPosition.x + 'px';
                    satDiv.style.top = movement.endPosition.y + canvasTop - 50 + 'px'; // seems a bit high from mouse
                    satDiv.style.display = ''; // remove any 'none'
                    // The following used to work in <style> section, but stopped; why?
                    satDiv.style.position = 'absolute'; // vital to positioning near cursor
                    satDiv.className = 'satmodal';
                }
            }
        } else {
            satDiv.style.display = 'none';
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}


// For the given satellite, calculate points for one orbit, starting 'now'
// and create a polyline to visualize it.
// It does this by copying the satrec then looping over it through time.
//
// TODO: How to find the satIdx on a CLICK event?
// TODO: the position loop repeats much of updateSatrecsPosVel()
//
// The TLE.slice(52, 63) is Mean Motion, Revs per day, e.g., ISS=15.72125391
// ISS (ZARYA)
// 1 25544U 98067A   08264.51782528 - .00002182  00000-0 -11606-4 0  2927
// 2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537
// We can invert that to get the time time we need for one rev.
// But it's not our satrec, and we are't storing parsed TLEs.
// satrec.no is TLE.slice(51,63) / xpdotp in radians/minute; it's manipulated by SGP4 but OK.
// ISS no=0.06767671366760845
// To get full 'circle' = 2*Pi => minutes/orbit = 2*Pi / satrec.no = 92.84 minutes for ISS
// Compare with TLE 15.721.. revs/day:
// 24 hr/day * 60 min/hr / 15.72125391 rev/day = 91.59574 minutes/rev -- close (enough?)
/**
 * 计算某个卫星对象的轨道的组成端点的集合
 * @param satrec
 * @returns {Array}
 */
function orbitPos(satrec) {
    var positions = [];
    var rs = [];

    var union, dateArray, newDate, jdSat,
        now, minutesPerOrbit, pointsPerOrbit, minutesPerPoint;
    //var jdSat = new Cesium.JulianDate.fromTotalDays(satrec.jdsatepoch);
    //将卫星获取的epoch转化为一个date对象，再转化为julianDate对象
    union = satrec.epochyr.toString() + satrec.epochdays.toString();
    dateArray = initial.DateFromEpoch(parseFloat(union));
    //当生成date对象时，生产的对象month加了一个1，所以此时人为的减去一个1
    newDate = new Date(parseInt(dateArray['year']), parseInt(dateArray['month']) - 1, parseInt(dateArray['day']),
        parseInt(dateArray['hour']), parseInt(dateArray['minute']), parseInt(dateArray['second']));
    jdSat = Cesium.JulianDate.fromDate(newDate);
    //var jdSat = new Cesium.JulianDate(satrec.jdsatepoch, 0, Cesium.TimeStandard.UTC);

    //var date=new Date();
    //now =Cesium.JulianDate.fromDate(date);
    now = Cesium.JulianDate.now(); // TODO: we'll want to base on tick and time-speedup
    //var x=Cesium.JulianDate.toDate(now);
    minutesPerOrbit = 2 * Math.PI / satrec.no;
    pointsPerOrbit = 144; // arbitrary: should be adaptive based on size (radius) of orbit
    minutesPerPoint = minutesPerOrbit / pointsPerOrbit;

    var minutes, julianDate, minutesSinceEpoch, rets, r, position;

    //orbitTraces.modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
    //    Cesium.Cartesian3.ZERO);

    for (minutes = 0; minutes <= minutesPerOrbit; minutes += minutesPerPoint) {
        julianDate = new Cesium.JulianDate();
        Cesium.JulianDate.addMinutes(now, minutes, julianDate);
        //此时secondsDifference函数是左边参数减去右边参数。左边的日期大于右边的日期
        minutesSinceEpoch = Cesium.JulianDate.secondsDifference(julianDate, jdSat) / 60;

        rets = sgp4(satrec, minutesSinceEpoch);
        satrec = rets.shift();
        r = rets.shift(); // [1802,    3835,    5287] Km, not meters
        position = new Cesium.Cartesian3(r[0] * 1000, r[1] * 1000, r[2] * 1000); // becomes .x, .y, .z
        positions.push(position);
        rs.push(r);
    }
    /**
     * 根据新添加的Array对象的remove方法，去除掉positions中最后一个元素，
     * 这样做是为了解决比如天宫一号轨道上交错，没有很顺滑的连到一块上，
     * 人为的去掉一个很突兀的点,让轨道近似顺滑点接合到一起
     */
    positions.remove(positions.length - 1);
    //把第一个position写入positions中，让正好轨道上缺的一点补全
    positions.push(positions[0]);
    return positions;
}

function updateOrbitPos(satrecs) {
    $.each(satrecs, function (i, val) {
        // 此时satrecs[i])和orbitTraces.get(i)是相对应的
        var newOrbitpos = orbitPos(satrecs[i]);
        if (viewer.entities.getById(satData[i].noradId + "01")) {
            viewer.entities.getById(satData[i].noradId + "01").polyline.positions = newOrbitpos;
        }

    });
}

function addOrbit(num, positions, color) {
    var entity = viewer.entities.add({
        //show:false,
        id: satData[num].noradId + "01",
        polyline: {
            positions: positions,
            material: color,
            Width: 5.0
        }
    });
}