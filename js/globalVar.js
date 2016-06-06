/**
 * Created by chet on 15/7/22.
 */
var viewer; //整个球体显示到viewer
//var handler; //鼠标控制器
var satrecs = []; // populated from onclick file load
var satData = []; // list of satellite data and metadata
var satPositions = []; // calculated by updateSatrecsPosVel()

// HACK: force globals for SGP4
var WHICHCONST = 72; //
var TYPERUN = 'm'; // 'm'anual, 'c'atalog, 'v'erification
var TYPEINPUT = 'n'; // HACK: 'now'
var CALC_INTERVAL_MS = 1000;

var opsmode = 'i'; /*GLOBAL for intl, 'i'mproved */

var mouselabels = new Cesium.LabelCollection();
var satTraces = new Cesium.PolylineCollection();
var satPoints = new Cesium.PointPrimitiveCollection();

var balloonViewModel;
//点击某条轨迹的cartesian3的点坐标，以便于在重绘时，不断及时更新balloon的位置
var clickposition;

/**
 *删除数组指定下标或指定对象,
 * 此方法是直接在Array数组对象上添加的一个新方法。
 */
Array.prototype.remove = function(obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
}

var ui;
var carousel_items = [];
var prodList = [];