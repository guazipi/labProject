/**
 * Created by chet on 15/7/30.
 */
function satelliteClickDetails(scene) {
    var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    clickDetailHandler.setInputAction(function (click) {  // actionFunction, mouseEventType, eventModifierKey
            var pickedObject = scene.pick(click.position);

            if (Cesium.defined(pickedObject)) {
                if (typeof window !== 'undefined') {
                    if (pickedObject.id) {
                        if(pickedObject.id.satelliteNoradId){
                            if (scene.mode === Cesium.SceneMode.SCENE3D) {
                                if (!$("#cb_toggleSatView").is(':checked')) {
                                    $("#cb_toggleSatView").prop("checked", true);
                                }
                                //selectedSatelliteIdx = pickedObject.id.satelliteNum;
                                viewer.trackedEntity = viewer.entities.getById(pickedObject.id.satelliteNoradId);

                                showSatDetail(pickedObject.id.satelliteNoradId);

                            }
                            setTimeout(function () {
                                viewer.camera.moveBackward(900000);
                            }, 1000)
                        }
                    }
                }
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
    );
}

//$("#updateSatsBtn").click(function () {
//    viewer.camera.moveBackward(400000);
//});
/**
 * 根据给定的noradid编号向数据库中获取卫星的详细信息，
 * 并且将信息显示在指定的dom内
 * @param satNoradId
 */
function showSatDetail(satNoradId) {
    //点击某个卫星的entity之后，网页右侧的显示卫星信息和过境卫星的div自动展开
    $("#rightSide_div").css('width', "290px");
    //$("#rightSide_div").css('height', "450px");
    $("#rightSide_div").css('height', "62%");
    $("#hideSatInfoPanel").attr("class", "layout-button-right");

    //显示卫星详细信息时，把没有选中跟踪卫星的提示信息的div隐藏掉
    $("#satinfo-message").attr("style", "display:none");
    $("#satInfoTable").attr("style", "display:block");


    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/getInfoFromInfo.php?satNoradId=" + satNoradId, function (data, testStatus) {

        /**
         * 此时从服务器的数据库中返回回来是一个对象，
         */
            //satName,objectID,period,inclination,apogee,perigee
            //alert("info here");
            //console.log(data.period);
        $("#noradid").html(satNoradId);
        $("#period").html(data.period);
        $("#inclination").html(data.inclination);
        $("#apogee").html(data.apogee);
        $("#perigee").html(data.perigee);
        $("#satName").html(data.satName);
        $("#objectID").html(data.objectID);


    });

    $.getJSON("php/getTLE/getInfoFromDetail.php?satNoradId=" + satNoradId, function (data, testStatus) {

        /**
         * 此时从服务器的数据库中返回回来是一个对象，
         */
            //satName,owner,launchDate,launchSitez,orbitType
            //alert("detail here");
            //console.log(data.owner);
        console.log(data.satName);
        $("#satName").html(data.satName);
        $("#owner").html(data.owner);
        $("#launchDate").html(data.launchDate);
        $("#launchSitez").html(data.launchSitez);
        $("#orbitType").html(data.orbitType);

    });
    $.ajaxSettings.async = true;
}
/**
 * 显示卫星的实时信息，此函数的调用是发生在每隔1000毫秒更新卫星位置时。
 * @param sates  更新后的一个sats对象，包含newSatrecs、position和velocity
 * @param satNoradId 卫星的noradid编号
 */
function displayStats(sates, satNoradId) {
    var sats, entity, satnum,
        vel0, vel0Carte, kmpers,
        now, time, latLonAlt,
        heightkm;
    sats = sates;
    entity = viewer.entities.getById(satNoradId)
    satnum = entity.satelliteNum;


    vel0 = sats.velocities[satnum];
    vel0Carte = new Cesium.Cartesian3(vel0[0], vel0[1], vel0[2]);
    kmpers = Cesium.Cartesian3.magnitude(vel0Carte);
    $("#sat_velocity").html(kmpers.toFixed(3));

    now = Cesium.JulianDate.now();
    time = now.dayNumber + now.secondsOfDay;
    latLonAlt = calcLatLonAlt(time, sats.positions[satnum], sats.newSatrecs[satnum]);  // (time, position, satellite)

    // Adding Lat/Lon to Satellite Display
    $("#sat_lat").html(sats.newSatrecs[satnum].latInDegrees.toFixed(3));
    $("#sat_lon").html(sats.newSatrecs[satnum].lonInDegrees.toFixed(3));

    heightkm = sats.newSatrecs[satnum].alt;
    $("#sat_height").html(heightkm.toFixed(3));
}

function calcLatLonAlt(time, position, satellite) {
    function fMod2p(x) {
        var i = 0;
        var ret_val = 0.0;
        var twopi = 2.0 * Math.PI;

        ret_val = x;
        i = parseInt(ret_val / twopi);
        ret_val -= i * twopi;

        if (ret_val < 0.0) {
            ret_val += twopi;
        }


        return ret_val;
    }

    var r = 0.0,
        e2 = 0.0,
        phi = 0.0,
        c = 0.0,
        f = 3.35281066474748E-3,
        twopi = 6.28318530717958623,
        pio2 = 1.57079632679489656,
        pi = 3.14159265358979323,
        xkmper = 6378.137,
        rad2degree = 57.295;

    satellite.theta = Math.atan2(position[1], position[0]);
    satellite.lonInRads = fMod2p(satellite.theta - gstime(time));
    r = Math.sqrt(Math.pow(position[0], 2) + Math.pow(position[1], 2));
    e2 = f * (2 - f);
    satellite.latInRads = Math.atan2(position[2], r);

    do {
        phi = satellite.latInRads;
        c = 1 / Math.sqrt(1 - e2 * Math.pow(Math.sin(phi), 2));
        satellite.latInRads = Math.atan2((position[2] + xkmper * c * e2 * Math.sin(phi)), r);

    } while (Math.abs(satellite.latInRads - phi) >= 1E-10);

    satellite.alt = r / Math.cos(satellite.latInRads) - xkmper * c;

    if (satellite.latInRads > pio2) {
        satellite.latInRads -= twopi;
    }

    if (satellite.lonInRads > pi) {
        satellite.lonInRads = -twopi + satellite.lonInRads;
    }

    satellite.latInDegrees = satellite.latInRads * rad2degree;
    satellite.lonInDegrees = satellite.lonInRads * rad2degree;
}
