/**
 *created by chet Liu on 15/08/19
 **/
/**
 *点击过境卫星的某条轨迹时，显示这条轨迹的详细信息
 **/
function createBalloon() {
    var balloonContainer = document.createElement('div');
    balloonContainer.className = 'cesium-viewer-balloonContainer';
    viewer.container.appendChild(balloonContainer);
    var balloon = new Cesium.Balloon(balloonContainer, scene);
    balloon.viewModel.computeScreenSpacePosition = function(value, result) {
        result.x = value.x;
        result.y = viewer.container.clientHeight - value.y;
        return result;
    };

    var balloonViewModel = balloon.viewModel;
    balloonViewModel.position = endPosition;
    balloonViewModel.content = pick.id.html;
    balloonViewModel.showBalloon = true;
    balloonViewModel.update();
}

function crossSatsClickDetails(scene) {
    var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    clickDetailHandler.setInputAction(function(click) { // actionFunction, mouseEventType, eventModifierKey
            var pickedObject = scene.pick(click.position);
            var satDiv = document.getElementById('crossSat_popup');
            if (Cesium.defined(pickedObject)) {
                if (typeof window !== 'undefined') {
                    if (pickedObject.primitive) {
                        if (pickedObject.primitive.beginDateEpoch) {
                            showCrossPolylineInfo(satDiv, pickedObject.primitive, click.position);
                        }
                    }
                }
            } else {
                satDiv.style.display = 'none';
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
    );
}

function showCrossPolylineInfo(satDiv, primitive, position) {
    var middleBeginDate, middleEndDate,
        beginDate, endDate,
        canvasTop;
    middleBeginDate = Cesium.JulianDate.toDate(primitive.beginDateEpoch);
    middleEndDate = Cesium.JulianDate.toDate(primitive.endDateEpoch);
    beginDate = getDatestringFromDate(middleBeginDate);
    endDate = getDatestringFromDate(middleEndDate);
    satNameArr = [],
        satNumArr = [];
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

    canvasTop = viewer.scene.canvas.offsetTop;
    alert(gethtml(satNameArr[0], satNumArr[0], beginDate, endDate));
    satDiv.innerHtml = gethtml(satNameArr[0], satNumArr[0], beginDate, endDate);
    satDiv.style.left = position.x + 'px';
    satDiv.style.top = position.y + canvasTop - 50 + 'px'; // seems a bit high from mouse
    satDiv.style.display = ''; // remove any 'none'
    // The following used to work in <style> section, but stopped; why?
    satDiv.style.position = 'absolute'; // vital to positioning near cursor
    satDiv.className = 'satmodal';
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