/**
 *created by chet Liu on 15/08/19
 **/
/**
 *点击过境卫星的某条轨迹时，显示这条轨迹的详细信息
 **/
function createBalloon(scene) {
    var balloonContainer = document.createElement('div');
    balloonContainer.className = 'cesium-viewer-balloonContainer';
    viewer.container.appendChild(balloonContainer);
    var balloon = new Cesium.Balloon(balloonContainer, scene);
    balloon.viewModel.computeScreenSpacePosition = function (value, result) {
       result.x = value.x;
       result.y = viewer.container.clientHeight - value.y;
       return result;
    };
    balloonViewModel = balloon.viewModel;
}

function crossSatsClickDetails(scene) {
    //createBalloon(scene);

    var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    var ellipsoid = scene.globe.ellipsoid;

    clickDetailHandler.setInputAction(function(click) { // actionFunction, mouseEventType, eventModifierKey
            var pickedObject = scene.pick(click.position);

            if (Cesium.defined(pickedObject)) {
                if (typeof window !== 'undefined') {
                    if (pickedObject.primitive) {
                        if (pickedObject.primitive.beginDateEpoch) {
                            //遍历所有的过境卫星的轨迹，如果有被点击过变色的把其恢复原状，保持点击的轨迹的唯一性
                            $.each(satTraces._polylines, function(i, val) {
                                if (this._width == 3) {
                                    this._width=1;
                                    this._material = satTraceMaterial;
                                }
                            })
                            clickposition = scene.camera.pickEllipsoid(click.position, ellipsoid);
                            showCrossPolylineInfo(pickedObject.primitive, click.position);

                            //将全局的过境卫星轨迹的Material赋值为点击的轨迹的material。
                            //这样以便于上面的更改
                            satTraceMaterial = pickedObject.primitive._material;

                            pickedObject.primitive._width = 3;
                            var clickMaterial = new Cesium.Material({
                                fabric: {
                                    type: 'Color',
                                    uniforms: {
                                        color: Cesium.Color.BLUEVIOLET
                                    }
                                }
                            });
                            pickedObject.primitive._material = clickMaterial;
                        }
                    }
                }
            }
            //else {
            //    satDiv.style.display = 'none';
            //}
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
    );
}

function showCrossPolylineInfo(primitive, position) {
    var middleBeginDate, middleEndDate,
        beginDate, endDate;
    middleBeginDate = Cesium.JulianDate.toDate(primitive.beginDateEpoch);
    middleEndDate = Cesium.JulianDate.toDate(primitive.endDateEpoch);
    beginDate = getDatestringFromDate(middleBeginDate);
    endDate = getDatestringFromDate(middleEndDate);
    var satNumArr = [];
    var satNameArr = [];
    satNumArr.push(primitive.satNum);

    //同步ajax获取卫星的名称
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/queryInfoFromNum.php", {
        'satNumArr': satNumArr
    }, function(data, testStatus) {
        $.each(data, function(i, val) {
            satNameArr.push(data[i]);
        });
    });
    $.ajaxSettings.async = true;

    balloonViewModel.position = position;
    balloonViewModel.content = gethtml(satNameArr[0], satNumArr[0], beginDate, endDate);
    balloonViewModel.showBalloon = true;
    balloonViewModel.update();
}

function gethtml(satName, satNum, beginDate, endDate) {
    var html = "";
    html += "        <table>";
    html += "            <tr>";
    html += "                <th colspan='2'>过境轨迹信息</th>";
    html += "            </tr>";
    html += "            <tr>";
    html += "                <td> 卫星名称 </td>";
    html += "                <td class='crossSat-info'>" + satName + "</td>";
    html += "            </tr>";
    html += "            <tr>";
    html += "                <td width='50%'>卫星NORAD编号</td>";
    html += "                <td class='crossSat-info'>" + satNum + "</td>";
    html += "            </tr>";
    html += "            <tr>";
    html += "                <td> 过境起始时间 </td>";
    html += "                <td class='crossSat-info'>" + beginDate + "</td>";
    html += "            </tr>";
    html += "            <tr>";
    html += "                <td> 过境结束时间 </td>";
    html += "                <td class='crossSat-info'>" + endDate + "</td>";
    html += "            </tr>";
    html += "        </table>";
    return html;
}

function changeBallon(balloonViewModel, clickposition) {
    if (balloonViewModel) {
        if ('position' in balloonViewModel) {
            if (balloonViewModel.position && clickposition) {
                var cart2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, clickposition);
                balloonViewModel.position = cart2;
                balloonViewModel.update();
            }
        }
    }
}