/**
 * Created by Administrator on 2015/11/22.
 */
//console.log(data);//���ص���һ��json�ַ�������Ҫ��json�ַ���ת��Ϊ����
var features = $.parseJSON(data).features;//array
processFeatures(features);
function processGeoms(geomsObj) {
    var features = geomsObj.features;
    var featuresLen = features.length;
    if (featuresLen == 0) {//�����0��Ҫ�أ���ʾ��ʱ���������û������
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