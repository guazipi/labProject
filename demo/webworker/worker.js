/**
 * Created by chet on 15/9/14.
 */
//importScripts('../../js/cesium/Cesium.js');
onmessage = function (event) {
    var first = event.data.first;
    var second = event.data.second;
    calculate(first, second);
};
function calculate(first, second) {
    postMessage("Work done! "
        + " and the greatest common divisor is " + document);//+Cesium.CesiumMath.DEGREES_PER_RADIAN);
}


