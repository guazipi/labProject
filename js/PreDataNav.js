/**
 * Created by Administrator on 2016/1/25.
 */
var PrepareDataNav = function () {
    var layers = [];
    layers.push(["卫星影像", 'world_image']);
    layers.push(["地图", 'world_vector']);
    layers.push(["2000中国区域叶面积指数", 'LAI_2000_China']);
    layers.push(["2005中国区域叶面积指数", 'LAI_2005_China']);
    layers.push(["2010中国区域叶面积指数", 'LAI_2010_China']);
    layers.push(["1982-2006年全球平均FPAR产品", 'FPAR1982-2006']);
    layers.push(["2006年全球年平均FPAR产品", '2006average']);
// Create jqxTree
    var source = [
        {
            icon: "js/jqwidgets/treePng/folder.png", label: "基础图层", expanded: true, items: [
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "卫星影像", selected: true},
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "地图"}
        ]
        },
        {
            icon: "js/jqwidgets/treePng/folder.png", label: "陆表要素产品", expanded: true, items: [
            {
                icon: "js/jqwidgets/treePng/folder.png", label: "植被产品", expanded: true, items: [
                {
                    icon: "js/jqwidgets/treePng/folder.png", label: "中国区域叶面积指数产品", expanded: true, items: [
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2000中国区域叶面积指数"},
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2005中国区域叶面积指数"},
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2010中国区域叶面积指数"},
                ]
                },
                {
                    icon: "js/jqwidgets/treePng/folder.png", label: "中亚(含新疆)植被覆盖度数据", expanded: true, items: [
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2013年中亚植被覆盖度数据产品"},
                ]
                },
                {
                    icon: "js/jqwidgets/treePng/folder.png", label: "FPAR数据产品", expanded: true, items: [
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "1982-2006年全球平均FPAR产品"},
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2006年全球年平均FPAR产品"},
                ]
                },
            ]
            },
            {
                icon: "js/jqwidgets/treePng/folder.png", label: "积雪产品", expanded: true, items: [
                {
                    icon: "js/jqwidgets/treePng/folder.png", label: "青藏高原/中亚地区积雪产品数据集", expanded: true, items: [
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "青藏高原MODIS每日无云积雪产品"}
                ]
                }
            ]
            },
        ]
        },
        {
            icon: "js/jqwidgets/treePng/folder.png", label: "内陆水体要素产品", expanded: true, items: [
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "全球湖泊水位变化数据"}
        ]
        }
    ];


    function getImageryFromLayerName(layerName) {
        var layersArr = [];

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
        if (layerName == "world_vector") {
            return imageryProvider;
        } else {
            layersArr.push(imageryProvider);
            //天地图中文注记
            var tiandituProvider = new Cesium.WebMapTileServiceImageryProvider({
                url: 'http://t0.tianditu.com/cia_w/wmts',
                layer: 'cia',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'w',//注意web墨卡托此时是w
                maximumLevel: 19,
                credit: new Cesium.Credit('天地图')
            });
            layersArr.push(tiandituProvider);

            return layersArr;
        }

    }

    function iniLegendDiv(legendUrl,divHeight,divWidth) {
        var legendDiv = document.createElement("div");
        legendDiv.id = "productLegendDiv";
        legendDiv.style.position = "absolute";
        legendDiv.style.backgroundColor = 'rgba(254, 252, 252,0.9)';
        legendDiv.style.left = "80%";
        legendDiv.style.bottom = "20%";
        legendDiv.style.height = divHeight;
        legendDiv.style.width = divWidth;
        legendDiv.style.zindex = 1000;
        legendDiv.style.borderRadius="10px";

        var legendImage = document.createElement("img");
        legendImage.src = legendUrl;
        legendImage.style.height = "95%";
        legendImage.style.width = "95%";
        legendDiv.appendChild(legendImage);
        document.body.appendChild(legendDiv);
    }

    //给资源数据产品添加图例（颜色对照表）
    function getLegend(layerName) {
        switch (layerName) {
            case 'LAI_2000_China':
                iniLegendDiv("./img/productLegend/LAI.png","23%","20%");
                break;
            case 'LAI_2005_China':
                iniLegendDiv("./img/productLegend/LAI.png","23%","20%");
                break;
            case 'LAI_2010_China':
                iniLegendDiv("./img/productLegend/LAI.png","23%","20%");
                break;
            case 'FPAR1982-2006':
                iniLegendDiv("./img/productLegend/FPAR.png","4%","16%");
                break;
            case '2006average':
                iniLegendDiv("./img/productLegend/FPAR.png","4%","16%");
                break;
        }
    }

    function initialDataNav() {
        $('#datatree').jqxTree({source: source, width: '58%', height: '98%', theme: ""});
        $('#datatree').on('select', function (event) {
            var args = event.args;
            var item = $('#datatree').jqxTree('getItem', args.element);

            $.each(layers, function (key, value) {
                if (value[0] === item.label) {
                    if (document.getElementById("productLegendDiv")!==null)
                        document.body.removeChild(document.getElementById("productLegendDiv"));

                    viewer.scene.imageryLayers.removeAll(true);

                    var getImageryProvider = getImageryFromLayerName(value[1]);
                    //console.log(getImageryProvider);
                    if (getImageryProvider instanceof Array) {
                        viewer.scene.imageryLayers.addImageryProvider(getImageryProvider[0]);
                        viewer.scene.imageryLayers.addImageryProvider(getImageryProvider[1]);
                        //给数据产品添加图例
                        getLegend(value[1]);
                    } else {
                        viewer.scene.imageryLayers.addImageryProvider(getImageryProvider);
                    }
                    return false;
                }
            })
        });

    }

    return {
        initialDataNav: initialDataNav
    }
}





