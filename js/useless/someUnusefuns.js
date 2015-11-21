/**
 * Created by chet on 15/7/19.
 */
//DEFAULT_VIEW_RECTANGLE  更改cesium地球初始的显示范围，不过通过viewrectangle也能实现同样效果
alert("I'm here!");
//添加到viewer中一个图层
function addalayer() {
    var layers1 = viewer.scene.imageryLayers;
    layers1.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
        url: "../data/bluemarble/",
        fileExtension: "jpg"
    }));
}

// Read TLEs from file and set GLOBAL satrecs, names, noradId and intlDesig.
// We can then run the SGP4 propagator over it and render as billboards.
function getSatrecsFromTLEFile(fileName) {
    var satnum, max, rets, satrec, startmfe, stopmfe, deltamin;

    fileName = '../tle/' + fileName + '.txt';
    var tles = tle.parseFile(fileName);

    // Reset the globals
    satrecs = [];
    satData = [];

    for (satnum = 0, max = tles.length; satnum < max; satnum += 1) {
        satData[satnum] = {
            name: tles[satnum][0].trim(), // Name: (ISS (ZARYA))
            intlDesig: tles[satnum][1].slice(9, 17), // Intl Designator YYNNNPPP (98067A)
            noradId: tles[satnum][2].split(' ')[1], // NORAD ID (25544)
            // should parse and store the bits we want, but save string for now
            tle0: tles[satnum][0],
            tle1: tles[satnum][1],
            tle2: tles[satnum][2]
        };

        rets = twoline2rv(WHICHCONST,
            tles[satnum][1],
            tles[satnum][2],
            TYPERUN,
            TYPEINPUT);
        satrec = rets.shift();
        startmfe = rets.shift();
        stopmfe = rets.shift();
        deltamin = rets.shift();
        satrecs.push(satrec); // Don't need to sgp4(satrec, 0.0) to initialize state vector
    }
    // Returns nothing, sets globals: satrecs, satData
}

// Create a new billboard for the satellites which are updated frequently.
// These are placed in the global satellite billboard, replacing any old ones.
// Keep it distict from other billboards, e.g., GeoLocation, that don't change.
// We don't need to set position here to be actual, it'll be updated in the time-loop.
// TODO: should this be combined with the populateSatelliteSelector()?
function populateSatelliteBillboard() {
    var satnum, max, billboard, satlabel;

    // clear out the old ones
    satBillboards.removeAll();
    satlabels.removeAll();

    //初始设置每个卫星billboard和卫星label的位置均在(0, 0, 0)位置，
    //之后会有setinterval这个函数在不停的运行，所以卫星的位置也会及时的改变，
    //有的时候反应慢的话，一开始加载卫星billboard和卫星label时，会不友好的显示在(0, 0, 0)处
    for (satnum = 0, max = satData.length; satnum < max; satnum += 1) {
        billboard = satBillboards.add({
            image: '../img/satellites/Satellite.png',
            position: new Cesium.Cartesian3(0, 0, 0)
        }); // BOGUS position
        // attach names for mouse interaction
        // TODO: just attach satData[satnum] and let JS display the attrs it wants?
        billboard.satelliteName = satData[satnum].name;
        billboard.satelliteNoradId = satData[satnum].noradId;
        billboard.satelliteDesignator = satData[satnum].intlDesig;
        billboard.satelliteData = satData[satnum];
        billboard.satelliteNum = satnum;

        satlabel = satlabels.add({
            position: new Cesium.Cartesian3(0, 0, 0),
            font: '15px sans-serif',
            pixelOffset: new Cesium.Cartesian2(16, 12),
            fillColor: Cesium.Color.DARKORANGE,
            outlineColor: Cesium.Color.BLACK,
            style: Cesium.LabelStyle.FILL,
            text: satData[satnum].name + "卫星"
        });
    }
    viewer.scene.primitives.add(satBillboards);
    viewer.scene.primitives.add(satlabels);

    for (var i = 0; i < satBillboards.length; i++) {
        satBillboards.get(i).show = false;
    }
    for (var i = 0; i < satlabels.length; i++) {
        //这个方法也是可行的，不过既然cesium中有原生的方法，就不要自己创造了，用人家的就行
        //satlabels.get(i).fillColor=satlabels.get(i).fillColor.withAlpha(0.0);

        satlabels.get(i).show = false;
    }
}


// Update the location of each satellite in the billboard.
// The calculated position is in Km but Cesium wants meters.
// The satellite's icon (from TextureAtlas) and name are already set
// by populateSatelliteBillboard().

function updateSatelliteBillboards(satPositions) {
    var now = Cesium.JulianDate.now();
    var posnum, max, pos, newpos, bb, sl;

    satBillboards.modelMatrix =
        Cesium.Matrix4.fromRotationTranslation(
            Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
            Cesium.Cartesian3.ZERO
        );
    satlabels.modelMatrix =
        Cesium.Matrix4.fromRotationTranslation(
            Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
            Cesium.Cartesian3.ZERO
        );
    for (posnum = 0, max = satPositions.length; posnum < max; posnum += 1) {
        pos = satPositions[posnum];
        newpos = new Cesium.Cartesian3(pos[0] * 1000, pos[1] * 1000, pos[2] * 1000); // TODO multiplyByScalar(1000)

        bb = satBillboards.get(posnum);
        //注意新老版本同一个功能的不同写法
        bb.position = newpos;

        sl = satlabels.get(posnum);
        //注意新老版本同一个功能的不同写法
        sl.position = newpos;
    }
}
//生成一个轨道，并以polyline的形式加载到scene上
function showOrbit(satrec, color) {
    var positions = [];
    var rs = [];

    //var jdSat = new Cesium.JulianDate.fromTotalDays(satrec.jdsatepoch);
    //alert(satrec.jdsatepoch);
    var jdSat = new Cesium.JulianDate(satrec.jdsatepoch, 0, Cesium.TimeStandard.UTC);
    var now = Cesium.JulianDate.now(); // TODO: we'll want to base on tick and time-speedup
    var minutesPerOrbit = 2 * Math.PI / satrec.no;
    var pointsPerOrbit = 144; // arbitrary: should be adaptive based on size (radius) of orbit

    var minutesPerPoint = minutesPerOrbit / pointsPerOrbit;

    minutesPerOrbit = minutesPerOrbit + minutesPerPoint;

    var minutes, julianDate, minutesSinceEpoch, rets, r, position;

    orbitTraces.modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
        Cesium.Cartesian3.ZERO);

    for (minutes = 0; minutes <= minutesPerOrbit; minutes += minutesPerPoint) {
        //julianDate = now.addMinutes(minutes);
        //julianDate = Cesium.JulianDate.addMinutes(now,minutes);
        julianDate = new Cesium.JulianDate();
        Cesium.JulianDate.addMinutes(now, minutes, julianDate);
        //minutesSinceEpoch = jdSat.getMinutesDifference(julianDate);
        minutesSinceEpoch = Cesium.JulianDate.secondsDifference(jdSat, julianDate) / 60;
        rets = sgp4(satrec, minutesSinceEpoch);
        satrec = rets.shift();
        r = rets.shift();      // [1802,    3835,    5287] Km, not meters
        position = new Cesium.Cartesian3(r[0] * 1000, r[1] * 1000, r[2] * 1000);  // becomes .x, .y, .z
        positions.push(position);
        rs.push(r);
    }
    //把第一个position写入positions中，让正好轨道上缺的一点补全
    positions.push(positions[0]);

    //javascript中获取随机颜色值的方法,用的时候在前面加#
    //http://blog.163.com/magic_messi1006/blog/static/19244042120119144203164/
    //function getRandColorValue(){
    //    var str = Math.ceil(Math.random()*16777215).toString(16);
    //    while(str.length < 6){
    //        str = '0' + str;
    //    }
    //    return str;
    //}

    var materialColor = color;
    //var materialColor = Cesium.Color.fromRandom({
    //    red: 0.3,
    //    //green: 0.3,
    //    blue:0.7,
    //    alpha: 1.0
    //});
    var traceMaterial = new Cesium.Material({
        fabric: {
            type: 'Color',
            uniforms: {
                color: materialColor
            }
        }
    });
    //var trace = new Cesium.Polyline();
    //orbitTraces.add(trace);
    //trace.positions = positions;
    //trace.material = traceMaterial;
    //trace.Width = 2.0;


    orbitTraces.add({
        //show: false,
        positions: positions,
        material: traceMaterial,
        Width: 2.0
    });

}
//给定一个color返回一个material
function getMaterial(color) {
    var traceMaterial = new Cesium.Material({
        fabric: {
            type: 'Color',
            uniforms: {
                color: color
            }
        }
    });
    return traceMaterial;
}

/**
 * 针对某个更新过后的卫星对象，更新其轨道的位置
 * @param satrecs
 */
function updateOrbitPos(satrecs) {
    if (orbitTraces.length > 0) {
        $.each(satrecs, function (i, val) {
            // 此时satrecs[i])和orbitTraces.get(i)是相对应的
            var newOrbitpos = orbitPos(satrecs[i]);
            orbitTraces.get(i).positions = newOrbitpos;
        });
    }
}
/**
 * 给定端点的集合和颜色生成一条轨道，并加载到collection中
 * @param positions
 * @param color
 */
function addOrbit(positions, color) {
    var materialColor = color;
    var traceMaterial = new Cesium.Material({
        fabric: {
            type: 'Color',
            uniforms: {
                color: materialColor
            }
        }
    });
    orbitTraces.add({
        positions: positions,
        material: traceMaterial,
        Width: 3.0
    });
}