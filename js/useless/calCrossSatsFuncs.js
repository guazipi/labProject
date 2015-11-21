/**
 * Created by chet on 15/8/7.
 */
/**
 * 根据得到的过境卫星的信息，填充jqwidgets中的datatable。
 * @param crossSatsArray 是一个含有填充datatable各个项目的数组的数组
 */
function initializeCrossSatsTable1(crossSatsArray) {
    var data = [];
    for (var i = 0; i < crossSatsArray[0].length; i++) {
        var row = {};
        row["satName"] = crossSatsArray[0][i];
        row["satNum"] = crossSatsArray[1][i];
        row["beginDate"] = crossSatsArray[2][i];
        row["endDate"] = crossSatsArray[3][i];
        data[i] = row;
    }
    var source = {
        localData: data,
        dataType: "array",
        dataFields: [{
            name: 'satName',
            type: 'string'
        }, {
            name: 'satNum',
            type: 'string'
        }, {
            name: 'beginDate',
            type: 'string'
        }, {
            name: 'endDate',
            type: 'string'
        }]
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#crossSatsTable").jqxDataTable({
        width: 600,
        pageable: true,
        pagerButtonsCount: 10,
        pageSize:9,
        source: dataAdapter,
        columnsResize: true,
        columns: [{
            text: '卫星名称',
            dataField: 'satName',
            width: 150
        }, {
            text: '卫星编号',
            dataField: 'satNum',
            width: 100
        }, {
            text: '过境起始时间',
            dataField: 'beginDate',
            width: 200
        }, {
            text: '过境结束时间',
            dataField: 'endDate',
            width: 200
        }]
    });
}
/**
 * 根据一个javascript的date对象，返回时间对象的一个标准表示形式（string）
 * @param date
 * @returns {string}
 */
function getDatestringFromDate(date) {
    var dateString = date.getFullYear() + '-' + (parseInt(date.getMonth())+1).toString() + '-' +
        date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' +
        date.getSeconds();
    return dateString;
}
/**
 * 从已添加到球体上到primitives中筛选出过境的polyline，
 * 读取这些polyline的三个属性，组装成一个数组，
 * 将noradid编号数组回传到服务器，向数据库查询卫星的名称
 * @returns {Array}
 */
function prepareCrossInfo() {
    var allInfoArr = new Array(),
        satNameArr = new Array(),
        satNumArr = new Array(),
        beginDateArr = new Array(),
        endDateArr = new Array();

    var crossPolylines = getCrossPolylines();

    //循环读取卫星过境的polyline
    $.each(crossPolylines, function(i, val) {
        satNumArr.push(crossPolylines[i].satNum);

        var beginDate = Cesium.JulianDate.toDate(crossPolylines[i].beginDateEpoch);
        beginDateArr.push(getDatestringFromDate(beginDate));

        var endDate = Cesium.JulianDate.toDate(crossPolylines[i].endDateEpoch);
        endDateArr.push(getDatestringFromDate(endDate));
    });
    //同步ajax获取卫星的名称
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/queryInfoFromNum.php", {
        'satNumArr': satNumArr
    }, function(data, testStatus) {
        // alert(data);
        // console.log(data);
        $.each(data, function(i, val) {
            satNameArr.push(data[i]);
        });
    });
    $.ajaxSettings.async = true;

    allInfoArr.push(satNameArr);
    allInfoArr.push(satNumArr);
    allInfoArr.push(beginDateArr);
    allInfoArr.push(endDateArr);

    return allInfoArr;
}

/**
 * 根据添加到球体上的primitive，筛选出过境的polyling，
 * 读取过境的polyline中的三个自己添加的属性，并且将他们组装为一个数组返回
 * @returns {Array}
 */
function getCrossPolylines() {
    var primitivesLength = viewer.scene.primitives.length;
    var primitives = viewer.scene.primitives;
    var polylineObj = new Array();
    for (var i = 0; i < primitivesLength; i++) {
        var boolan = primitives._primitives[i].hasOwnProperty("_polylines");
        if (boolan) {
            if (primitives._primitives[i]._polylines && primitives._primitives[i]._polylines.length > 0) {
                var polylinesLength = primitives._primitives[i]._polylines.length;
                for (var k = 0; k < polylinesLength; k++) {
                    if ('beginDateEpoch' in primitives._primitives[i]._polylines[k]) {
                        polylineObj.push(primitives._primitives[i]._polylines[k]);
                    }
                }

            }

        }

    }
    return polylineObj;
}
/**
 * 根据两个时间控件中的时间，创建一个javascript的date对象，并转化为Cesium中juliandate对象，
 * 计算开始和结束的时间之间的secondsDifference，返回三者组合的一个对象
 * @returns {{jdBegin: *, jdEnd: *, secondsDifference: *}}
 */
function getJDSecondsDifference() {
    var dateTxtBegin, dateTxtEnd, dateObjBegin, dateObjEnd,
        newDateBegin, newDateEnd, jdBegin, jdEnd,
        secondsDifference;
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

    newDateBegin = new Date(dateObjBegin.year, dateObjBegin.month - 1, dateObjBegin.day,
        dateObjBegin.hour, dateObjBegin.minute, dateObjBegin.second);
    newDateEnd = new Date(dateObjEnd.year, dateObjEnd.month - 1, dateObjEnd.day,
        dateObjEnd.hour, dateObjEnd.minute, dateObjEnd.second);
    jdBegin = Cesium.JulianDate.fromDate(newDateBegin);
    jdEnd = Cesium.JulianDate.fromDate(newDateEnd);

    secondsDifference = Cesium.JulianDate.secondsDifference(jdEnd, jdBegin);

    return {
        'jdBegin': jdBegin,
        'jdEnd': jdEnd,
        'secondsDifference': secondsDifference
    };
}

/**
 *根据开始时间和结束时间以及两者之间的secondsDifference，
 * 计算出某卫星在这个时间段内每隔1s的所有位置，
 * 并返回所有的位置和每个位置的julianDate组成的对象
 * @param satrec
 * @returns {{positions: Array, posJDs: Array}}
 */
function getPosJDArrayFromBeginEndTime(satrec) {
    var positions = [];
    var posJDs = [];
    var JDSecondsDifference, jdBegin, jdEnd, secondsDifference,
        union, dateArray, newDate, jdSat,
        seconds, middleJulianDate,
        minutesSinceEpoch,
        rets, middsatrec, r, position;
    JDSecondsDifference = getJDSecondsDifference();
    //这样写可能会影响下一个函数的执行，因为这里打断之后但不影响包含本函数的函数的执行，
    //所以只用在包含本函数的函数内执行同样的判断即可。
    if(!JDSecondsDifference){
        return;
    }

    jdBegin = JDSecondsDifference.jdBegin;
    jdEnd = JDSecondsDifference.jdEnd;
    secondsDifference = JDSecondsDifference.secondsDifference;

    //将卫星获取的epoch转化为一个date对象，再转化为julianDate对象
    union = satrec.epochyr.toString() + satrec.epochdays.toString();
    dateArray = DateFromEpoch(parseFloat(union));
    newDate = new Date(parseInt(dateArray['year']), parseInt(dateArray['month']) - 1, parseInt(dateArray['day']),
        parseInt(dateArray['hour']), parseInt(dateArray['minute']), parseInt(dateArray['second']));
    jdSat = Cesium.JulianDate.fromDate(newDate);

    //alert(secondsDifference);

    for (seconds = 0; seconds < secondsDifference; seconds += 1) {
        middleJulianDate = new Cesium.JulianDate();

        Cesium.JulianDate.addSeconds(jdBegin, seconds, middleJulianDate);

        minutesSinceEpoch = Cesium.JulianDate.secondsDifference(middleJulianDate, jdSat) / 60;
        rets = sgp4(satrec, minutesSinceEpoch);
        middsatrec = rets.shift();
        r = rets.shift(); // [1802,    3835,    5287] Km, not meters
        position = new Cesium.Cartesian3(r[0] * 1000, r[1] * 1000, r[2] * 1000); // becomes .x, .y, .z
        positions.push(position);
        posJDs.push(middleJulianDate);
    }
    return {
        'positions': positions,
        'posJDs': posJDs
    };
}
/**
 * 判断某个卫星位置是否在多边形内，如果在，则储存几个值到数组。
 * inPrimitivePos是存储所有卫星的数组，每个卫星又是一个包含三个元素的数组，分别是识别符、卫星位置和此位置的julianDate
 * inPrimitiveNum数组存储某个位置在总的卫星位置数组的序号（用于判断其是否前后相连）
 * @param editPrimitive 画的多边形对象
 * @param satposJDArray  卫星位置点和时间点组成的对象
 * @returns {{inPrimitivePosArr: Array, inPrimitiveNumArr: Array}}
 */
function getCrossSatPosNumObj(editPrimitive, satposJDArray) {
    var inPrimitivePos = [];
    var inPrimitiveNum = [];
    var satJD, pos, satLonLat,
        satposArray = satposJDArray.positions,
        satJDArray = satposJDArray.posJDs;

    //var identitier = "clever";
    //var identitierPosArray = [];

    for (var i = 0; i < satposArray.length; i++) {
        pos = satposArray[i];
        satLonLat = getLonLatFromCartesian(pos);

        satJD = satJDArray[i];

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
            extentArray.push([extent.west * radToDegree, extent.south * radToDegree]);

            if (isPointInPolygon(satLonLat, extentArray)) {
                var identitier = "clever";
                var identitierPosArray = [];

                identitierPosArray.push(identitier);
                identitierPosArray.push(pos);
                identitierPosArray.push(satJD);
                inPrimitivePos.push(identitierPosArray);

                //inPrimitivePos.push(pos);
                inPrimitiveNum.push(i);
            }

        }
        if (editPrimitive.hasOwnProperty("center")) {
            var certerLonLat = getLonLatFromCartesian(editPrimitive.center);

            if (isPointInCircle(satLonLat, certerLonLat, editPrimitive.radius)) {
                var identitier = "clever";
                var identitierPosArray = [];

                identitierPosArray.push(identitier);
                identitierPosArray.push(pos);
                identitierPosArray.push(satJD);
                inPrimitivePos.push(identitierPosArray);

                //inPrimitivePos.push(pos);
                inPrimitiveNum.push(i);
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
                var identitier = "clever";
                var identitierPosArray = [];

                identitierPosArray.push(identitier);
                identitierPosArray.push(pos);
                identitierPosArray.push(satJD);
                inPrimitivePos.push(identitierPosArray);

                //inPrimitivePos.push(pos);
                inPrimitiveNum.push(i);
            }
        }
    }

    return {
        'inPrimitivePosArr': inPrimitivePos,
        'inPrimitiveNumArr': inPrimitiveNum
    };
}
/**
 *判断在多边形内的这些点是否相邻，如果相邻，存储到一个数组，
 * 最后将他们赋值给一个polyline，形成一个polyline或者一个点
 * @param satrec
 * @param color
 */
function addCrossSatTraces(satrec, color) {
    var editPrimitive, satposJDArray, crossSatPosNumJdObj, inPrimitivePosArr, inPrimitiveNumArr;
    editPrimitive = getEditPrimitive();
    if (!editPrimitive) {
        return;
    }
    satposJDArray = getPosJDArrayFromBeginEndTime(satrec);
    if(!satposJDArray){
        return;
    }

    //从getCrossSatPosNumObj(editPrimitive, satposJDArray)函数中得到含有两个数组的对象。
    crossSatPosNumJdObj = getCrossSatPosNumObj(editPrimitive, satposJDArray);

    inPrimitivePosArr = crossSatPosNumJdObj.inPrimitivePosArr;
    inPrimitiveNumArr = crossSatPosNumJdObj.inPrimitiveNumArr;

    //根据inPrimitiveNumArr中每个位置的序号，如果后面的减去前面的等于1说明两个点相邻，给他们的识别符赋值相同。
    for (var i = 0; i < inPrimitiveNumArr.length; i++) {
        if (i == 0) {
            inPrimitivePosArr[i][0] += i.toString();
            continue;
        }
        inPrimitivePosArr[i][0] += i.toString();
        if (inPrimitiveNumArr[i] - inPrimitiveNumArr[i - 1] == 1) {
            inPrimitivePosArr[i][0] = inPrimitivePosArr[i - 1][0];
        }
    }

    //如果识别符相同，将卫星位置和juliandate存储到一个数组中，然后把这个数组再存储到更高层级到一个数组中
    var middleSameArr = [];
    var sameArray = [];
    var totalArray = [];
    if (inPrimitiveNumArr.length > 1) {
        for (var i = 0; i < inPrimitiveNumArr.length - 1; i++) {
            if (inPrimitivePosArr[i][0] == inPrimitivePosArr[i + 1][0]) {
                middleSameArr.push(inPrimitivePosArr[i][1]);
                middleSameArr.push(inPrimitivePosArr[i][2]);
                sameArray.push(middleSameArr);
                middleSameArr = [];
            } else {
                middleSameArr.push(inPrimitivePosArr[i][1]);
                middleSameArr.push(inPrimitivePosArr[i][2]);
                sameArray.push(middleSameArr);
                middleSameArr = [];
                //sameArray.push(inPrimitivePosArr[i][1]);
                totalArray.push(sameArray);
                sameArray = [];
            }
            if (i == inPrimitiveNumArr.length - 2) {
                if (inPrimitivePosArr[i][0] == inPrimitivePosArr[i + 1][0]) {
                    middleSameArr.push(inPrimitivePosArr[i + 1][1]);
                    middleSameArr.push(inPrimitivePosArr[i + 1][2]);
                    sameArray.push(middleSameArr);
                    middleSameArr = [];

                    //sameArray.push(inPrimitivePosArr[i + 1][1]);
                    totalArray.push(sameArray);
                } else {
                    middleSameArr.push(inPrimitivePosArr[i + 1][1]);
                    middleSameArr.push(inPrimitivePosArr[i + 1][2]);
                    sameArray.push(middleSameArr);
                    middleSameArr = [];

                    //sameArray.push(inPrimitivePosArr[i + 1][1]);
                    totalArray.push(sameArray);
                }
                break;
            }
        }
    } else if (inPrimitiveNumArr.length == 1) {
        middleSameArr.push(inPrimitivePosArr[0][1]);
        middleSameArr.push(inPrimitivePosArr[0][2]);
        sameArray.push(middleSameArr);

        middleSameArr = [];

        //sameArray.push(inPrimitivePosArr[0][1]);
        totalArray.push(sameArray);
    } else {
        alert("对不起，此区域没有卫星经过！请扩大查询区域或者增大时间查询范围。");
        return;
    }

    for (var i = 0; i < totalArray.length; i++) {
        if (totalArray[i].length > 1) {
            var traceMaterial = new Cesium.Material({
                fabric: {
                    type: 'Color',
                    uniforms: {
                        //color: Cesium.Color.BLUEVIOLET
                        color: color
                    }
                }
            });
            var tracePosArr = [];
            for (var k = 0; k < totalArray[i].length; k++) {
                tracePosArr.push(totalArray[i][k][0]);
            }
            var polylinePri = satTraces.add({
                positions: tracePosArr,
                material: traceMaterial,
                Width: 2.0
            });
            //将过境卫星的noradid、过境线的起始时间点和结束时间点赋给这个过境线，以备后边使用
            polylinePri.satNum = satrec.satnum;
            polylinePri.beginDateEpoch = totalArray[i][0][1];
            polylinePri.endDateEpoch = totalArray[i][totalArray[i].length - 1][1];
        } else {
            satPoints.add({
                position: totalArray[i][0][0],
                color: Cesium.Color.YELLOW
            });
        }
    }
}