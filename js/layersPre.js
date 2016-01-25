/**
 * Created by Administrator on 2016/1/25.
 */

var layers = [];
layers.push(["影像", 'world_image']);
layers.push(["矢量", 'world_vector']);
layers.push(["2000中国区域叶面积指数", 'LAI_2000_China']);
layers.push(["2005中国区域叶面积指数", 'LAI_2005_China']);
layers.push(["2010中国区域叶面积指数", 'LAI_2010_China']);
layers.push(["1982-2006年全球FPAR产品", 'FPAR1982-2006']);
layers.push(["2006年全球年平均FPAR产品", '2006average']);
// Create jqxTree
var source = [
    {
        icon: "js/jqwidgets/treePng/folder.png", label: "基础图层", expanded: true, items: [
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "影像", selected: true},
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "矢量"}
    ]
    },
    {
        icon: "js/jqwidgets/treePng/folder.png", label: "全球空间变化信息", expanded: true, items: [
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2000中国区域叶面积指数"},
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2005中国区域叶面积指数"},
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2010中国区域叶面积指数"},
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "1982-2006年全球FPAR产品"},
        {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2006年全球年平均FPAR产品"},
    ]
    }
];

$('#datatree').jqxTree({source: source, width: '98%', height: '98%', theme: ""});
$('#datatree').on('select', function (event) {
    var args = event.args;
    var item = $('#datatree').jqxTree('getItem', args.element);

    $.each(layers, function (key, value) {
        if (value[0] === item.label) {
            viewer.scene.imageryLayers.removeAll(true);
            viewer.scene.imageryLayers.addImageryProvider(getImageryFromLayerName(value[1]));
            return false;
        }
    })
    //console.log(item);
});

function getImageryFromLayerName(layerName) {
    var value = Math.PI * 256.0 / 180.0;
    var extent = new Cesium.Rectangle(-value, -value, value, value);
    var imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: '/QuadServer/services/maps/wmts100',
        layer: layerName,
        //layer: 'world_vector',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'PGIS_TILE_STORE',
        minimumLevel: 0,
        maximumLevel: 19,
        credit: new Cesium.Credit('world_country'),
        tilingScheme: new Cesium.GeographicTilingScheme({
            rectangle: extent,
            numberOfLevelZeroTilesX: 1,
            numberOfLevelZeroTilesY: 1
        }),
    });
    return imageryProvider;
}
