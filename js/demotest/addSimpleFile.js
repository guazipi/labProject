/**
 * Created by chet on 15/9/23.
 */
Sandcastle.addToolbarMenu([{
    text: '请选择'
}, {
    text: '添加kml文件',
    onselect: function () {
        viewer.trackedEntity = undefined;
        viewer.dataSources.add(Cesium.KmlDataSource.load('../../dataset/kml/runthemap.kml'));
    }
}, {
    text: '添加kmz文件',
    onselect: function () {
        viewer.dataSources.add(Cesium.KmlDataSource.load('../../dataset/kml/facilities/facilities.kml'));
    }

},{
    text: '添加TopoJSON文件',
    onselect: function () {
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../../dataset/json/rivertopo.json'), {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.GOLD,
            strokeWidth: 3
        });
    }

}, {
    text: '添加三维模型',
    onselect: function () {
        //createModel('../../dataset/3dmodels/Cesium_Air.bgltf', 5000.0);
        //createModel('dataset/3dmodels/Deep_space.bgltf', 5000.0);
    }
}, {
    text: 'KMZ with embedded data - GDP per capita',
    onselect: function () {
        viewer.dataSources.add(Cesium.KmlDataSource.load('../../SampleData/kml/gdpPerCapita2008.kmz'));
    }
}], 'addSimpleFile');

function createModel(url, height) {
    viewer.entities.removeAll();

    var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, height);
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);

    var entity = viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
            uri: url,
            minimumPixelSize: 128
        }
    });
    viewer.trackedEntity = entity;
}