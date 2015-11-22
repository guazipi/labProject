/**
 * Created by Administrator on 2015/11/22.
 */
//console.log(data);//返回的是一个json字符串，需要将json字符串转换为对象
var features = $.parseJSON(data).features;//array
processFeatures(features);
function processGeoms(geomsObj) {
    var features = geomsObj.features;
    var featuresLen = features.length;
    if (featuresLen == 0) {//如果是0个要素，提示该时间段区域内没有数据
        return 0;
    }
    esle
    {
        return features;
    }
}
function createCoverDiv() {
    $('<div id="cover"></div>').css({
        "displa": "none",
        "position": "fixed",
        "z-index": "1",
        "top": 0,
        "left": 0,
        "width": 100 %,
        "height": 100 %,
        "background-color": 'rgba(0, 0, 0, 0.44)'
    });
}