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
    layers.push(["2013年中亚植被覆盖度数据产品", 'zhongyaPlant']);
    layers.push(["1982-2006年全球平均FPAR产品", 'FPAR1982-2006']);
    layers.push(["2006年全球年平均FPAR产品", '2006average']);
    layers.push(["2011年05月31日青藏高原MODIS每日无云积雪产品", 'no_cloud_snow']);
    layers.push(["全球湖泊水位变化数据产品", 'globalLake_change']);
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
                    {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "2011年05月31日青藏高原MODIS每日无云积雪产品"}
                ]
                }
            ]
            },
        ]
        },
        {
            icon: "js/jqwidgets/treePng/folder.png", label: "内陆水体要素产品", expanded: true, items: [
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "全球湖泊水位变化数据产品"}
        ]
        }
    ];
    //天地图边界
    var tiandituProviderBoundary = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.cn/ibo_w/wmts',
        layer: 'ibo',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',//注意web墨卡托此时是w
        // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
        maximumLevel: 19,
        credit: new Cesium.Credit('天地图')
    });
    //天地图中文地名注记
    var tiandituProviderPlaceName = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/cia_w/wmts',
        layer: 'cia',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',//注意web墨卡托此时是w
        maximumLevel: 19,
        credit: new Cesium.Credit('天地图')
    });
    //地形
    var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: '//assets.agi.com/stk-terrain/world',
        requestVertexNormals: true
    })


    //quadServer上的影像底图
    var value = Math.PI * 256.0 / 180.0;
    var extent = new Cesium.Rectangle(-value, -value, value, value);
    var quadServerProviderImage = new Cesium.WebMapTileServiceImageryProvider({
        url: '/QuadServer/services/maps/wmts100',
        layer: 'world_image',
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

    function getImageryFromLayerName(layerName) {
        switch (layerName) {
            case 'world_image':
                return getLayerFromQuadServer(layerName);
                break;
            case 'world_vector':
                return getLayerFromQuadServer(layerName)
                break;
            case 'LAI_2000_China':
                return getLayerFromQuadServer(layerName);
                break;
            case 'LAI_2005_China':
                return getLayerFromQuadServer(layerName)
                break;
            case 'LAI_2010_China':
                return getLayerFromQuadServer(layerName)
                break;
            case 'zhongyaPlant':
                return getLayerFromTMS(layerName)
                break;
            case 'FPAR1982-2006':
                return getLayerFromQuadServer(layerName)
                break;
            case '2006average':
                return getLayerFromQuadServer(layerName)
                break;
            case 'no_cloud_snow':
                return getLayerFromTMS(layerName)
                break;
            case 'globalLake_change':
                return getLayerFromLocal(layerName)
                break;
        }
    }

    function getLayerFromQuadServer(layerName) {
        var layersArr = [];

        //QuadServer服务器上的图层
        var value = Math.PI * 256.0 / 180.0;
        var extent = new Cesium.Rectangle(-value, -value, value, value);
        var quadServerProvider = new Cesium.WebMapTileServiceImageryProvider({
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
            return quadServerProvider;
        } else {
            layersArr.push(quadServerProvider);

            layersArr.push(tiandituProviderBoundary);
            layersArr.push(tiandituProviderPlaceName);

            return layersArr;
        }

    }

    function getLayerFromTMS(layerName) {
        var layersArr = [];

        //tms服务器上的图层
        var TMSProvider = new Cesium.TileMapServiceImageryProvider({
            url: "/map_data/" + layerName + "/",
            //url: "http://10.2.4.1:8092/Earth_Data/bluemmarble/",
            fileExtension: "png"
        });
        layersArr.push(quadServerProviderImage);
        layersArr.push(TMSProvider);
        layersArr.push(tiandituProviderBoundary);
        layersArr.push(tiandituProviderPlaceName);

        return layersArr;
    }

    function getLayerFromLocal(layerName) {
        viewer.dataSources.add(Cesium.KmlDataSource.load('./dataset/kml/globalLake1.kmz'));
        var scene = viewer.scene;
        var ellipsoid = scene.globe.ellipsoid;
        var clickDetailHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        clickDetailHandler.setInputAction(function (click) { // actionFunction, mouseEventType, eventModifierKey
                var pickedObject = scene.pick(click.position);
                if (Cesium.defined(pickedObject)) {
                    if (typeof window !== 'undefined') {
                        if (pickedObject.id._kml) {
                            var htmlStr = pickedObject.id._description._value;
                            $("#aaa").html(htmlStr);
                            var lakeName = $("#aaa td")[0].innerText;
                            $.each($("#aaa td"), function (key, value) {
                                value.style.fontSize = '18px';
                            })
                            $("#aaa td")[0].style.fontSize = '25px';
                            var imgUrl = getImgUrl(lakeName);

                            clickposition = scene.camera.pickEllipsoid(click.position, ellipsoid);
                            balloonViewModel.position = click.position;
//                            balloonViewModel.content = htmlStr+getTif("img/"+imgUrl);
                            balloonViewModel.content = $("#aaa").html() + getTif("./img/" + imgUrl);
                            balloonViewModel.showBalloon = true;
                            balloonViewModel.update();
                        }
                    }
                }
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
        );

        function getTif(url) {
            var html = "";
            html += "<img height='290' width='450'  src=" + url + " >";
            return html;
        }

        return "lakeProvider";
    }

    function iniLegendDiv(legendUrl, divLeft, divBottom, divHeight, divWidth) {
        var legendDiv = document.createElement("div");
        legendDiv.id = "productLegendDiv";
        legendDiv.style.position = "absolute";
        legendDiv.style.backgroundColor = 'rgba(254, 252, 252,0.8)';
        legendDiv.style.left = divLeft;
        legendDiv.style.bottom = divBottom;
        legendDiv.style.height = divHeight;
        legendDiv.style.width = divWidth;
        legendDiv.style.zindex = 1000;
        legendDiv.style.borderRadius = "10px";

        var legendImage = document.createElement("img");
        legendImage.src = legendUrl;
        legendImage.style.height = "98%";
        legendImage.style.width = "98%";
        legendDiv.appendChild(legendImage);
        document.body.appendChild(legendDiv);
    }

    function selectedStatus(layerName) {
        //$("#carousel").rcarousel('goToPage',2);
        // $("#carousel").rcarousel('next');
        //console.log($("#carousel").rcarousel('getTotalPages'));
        //var b = a(this.element).data("data");
        //alert($("#carousel").data("data").pages.length);
        // alert($("#carousel").rcarousel('getCurrentPage'));

        var carouselItem = [];
        var isShow = false;

        $("#carousel img").each(function () {
            this.style.border = "1px solid #CCCCCC";
            this.background = "transparent";
            carouselItem.push(this.getAttribute('originalTitle'));
        })
        function makeShow() {
            for (var i = 0; i < carouselItem.length; i++) {
                if (layerName == carouselItem[i]) {
                    $("#carousel img").each(function () {
                        var originalTitle = this.getAttribute('originalTitle');
                        if (layerName == originalTitle) {
                            this.style.border = "4px solid #38EA25";
                            this.background = "transparent";
                            return false;
                        }
                    })
                    return;
                }
            }
            $("#carousel").rcarousel('next');
            carouselItem = [];
            //dom操作与js逻辑执行相斥，先缓缓，让dom先执行
            setTimeout(function(){
                $("#carousel img").each(function () {
                    carouselItem.push(this.getAttribute('originalTitle'));
                });

                $("#carousel img").each(function () {
                    var originalTitle = this.getAttribute('originalTitle');
                    if (layerName == originalTitle) {
                        this.style.border = "4px solid #38EA25";
                        this.background = "transparent";
                        return false;
                    }
                })
                makeShow();
            },500);
        }

        makeShow();
    }

    //给资源数据产品添加图例（颜色对照表）
    function getLegend(layerName) {
        switch (layerName) {
            case "LAI_2000_China":
                selectedStatus("LAI_2000_China");
                iniLegendDiv("./img/productLegend/LAI.png", "310px", "170px", "15%", "18%");
                break;
            case 'LAI_2005_China':
                selectedStatus('LAI_2005_China');
                iniLegendDiv("./img/productLegend/LAI.png", "310px", "170px", "15%", "18%");
                break;
            case 'LAI_2010_China':
                selectedStatus('LAI_2010_China');
                iniLegendDiv("./img/productLegend/LAI.png", "310px", "170px", "15%", "18%");
                break;
            case 'FPAR1982-2006':
                selectedStatus("FPAR1982-2006");
                iniLegendDiv("./img/productLegend/FPAR.png", "310px", "170px", "5%", "16%");
                break;
            case '2006average':
                selectedStatus('2006average');
                iniLegendDiv("./img/productLegend/FPAR.png", "310px", "170px", "5%", "16%");
                break;
            case 'no_cloud_snow':
                selectedStatus('no_cloud_snow');
                iniLegendDiv("./img/productLegend/modisSnow.png", "310px", "170px", "7%", "14%");
                break;
            case 'zhongyaPlant':
                selectedStatus('zhongyaPlant');
                iniLegendDiv("./img/productLegend/plant.png", "310px", "170px", "3%", "15%");
                break;
            case 'globalLake_change':
                selectedStatus('globalLake_change');
                iniLegendDiv("./img/productLegend/lake.png", "310px", "170px", "4%", "13%");
                break;
        }
    }

    //var sourceCheckBox = [
    //    {
    //        icon: "js/jqwidgets/treePng/folder.png", label: "基础图层", expanded: true, items: [{
    //        icon: "js/jqwidgets/treePng/folder.png", label: "卫星影像", expanded: true, checked: true,items: [
    //            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "影像底图", checked: true},
    //            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "地名与边界", checked: true},
    //            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "地形", checked: true}
    //        ]
    //    }, {
    //        icon: "js/jqwidgets/treePng/folder.png", label: "地图", expanded: true, items: []
    //    }
    //    ]
    //    }
    //];

    var sourceCheckBox = [
        {
            icon: "js/jqwidgets/treePng/folder.png", label: "主数据库", expanded: true, checked: true, items: [
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "地名", checked: true},
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "行政边界", checked: true},
            {icon: "js/jqwidgets/treePng/contactsIcon.png", label: "地形", checked: true}
        ]
        }
    ];


    function afterPlaceNameChecked(isChecked) {
        var imageryLayersLength = viewer.scene.imageryLayers.length;
        if (isChecked) {
            var placeNameImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 1);
            placeNameImagery.alpha = 1.0
        } else {
            var placeNameImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 1);
            placeNameImagery.alpha = 0.0
        }
    }

    function afterBoundaryChecked(isChecked) {
        var imageryLayersLength = viewer.scene.imageryLayers.length;
        if (isChecked) {
            var boundaryImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 2);
            boundaryImagery.alpha = 1.0
        } else {
            var boundaryImagery = viewer.scene.imageryLayers.get(imageryLayersLength - 2);
            boundaryImagery.alpha = 0.0
        }
    }

    function afterTerrainChecked(isChecked) {
        if (isChecked) {
            viewer.terrainProvider = terrainProvider;
        } else {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        }
    }

    function checkBoxChange(labelName, isChecked) {
        switch (labelName) {
            case "地名":
                afterPlaceNameChecked(isChecked);
                break;
            case "行政边界":
                afterBoundaryChecked(isChecked);
                break;
            case "地形":
                afterTerrainChecked(isChecked);
                break;
        }
    }

    function initialDataNav() {
        $('#basicLayer').jqxTree({
            source: sourceCheckBox,
            height: '100%',
            hasThreeStates: true,
            checkboxes: true,
            width: '58%'
        });
        $('#basicLayer').css('visibility', 'visible');
        //如果不设置的话，一开始加载，checkbox的框的高度高一点，不美观
        $('.jqx-checkbox').css("margin-top", "4.5px");
        $('#basicLayer').on('checkChange', function (event) {
            var args = event.args;
            var item = $('#basicLayer').jqxTree('getItem', args.element);
            var checked = args.checked;
            if (item !== null) {
                checkBoxChange(item.label, checked);
            }
        });

        $('#datatree').jqxTree({source: source, width: '58%', height: '100%', theme: ""});
        $('#datatree').on('select', function (event) {
            var args = event.args;
            var item = $('#datatree').jqxTree('getItem', args.element);

            $.each(layers, function (key, value) {
                if (value[0] === item.label) {
                    if (document.getElementById("productLegendDiv") !== null)
                        document.body.removeChild(document.getElementById("productLegendDiv"));

                    viewer.scene.imageryLayers.removeAll(true);
                    viewer.dataSources.removeAll();
                    var getImageryProvider = getImageryFromLayerName(value[1]);
                    if (getImageryProvider instanceof Array) {
                        var length = getImageryProvider.length;
                        for (var i = 0; i < length; i++) {
                            viewer.scene.imageryLayers.addImageryProvider(getImageryProvider[i]);
                        }
                        //给数据产品添加图例
                        getLegend(value[1]);

                        //每一次更改数据产品都将地名，行政边界和地形都勾选上
                        $('#basicLayer').jqxTree('checkAll')
                    } else if (getImageryProvider === "lakeProvider") {
                        resetEarthCloth();
                        getLegend(value[1]);

                        //每一次更改数据产品都将地名，行政边界和地形都勾选上
                        $('#basicLayer').jqxTree('checkAll')
                    } else {
                        //world_vector
                        viewer.scene.imageryLayers.addImageryProvider(getImageryProvider);
                        var boundary = viewer.scene.imageryLayers.addImageryProvider(tiandituProviderBoundary);
                        var placeName = viewer.scene.imageryLayers.addImageryProvider(tiandituProviderPlaceName);
                        boundary.alpha = 0.0;
                        placeName.alpha = 0.0;
                    }
                    return false;
                }
            })
        });

    }

    /**
     * Created by Administrator on 2015/12/13.
     */
    function getImgUrl(lakeName) {
        var globalLake = [["阿拉湖", "globalLake/AE/alahu.jpg"],
            ["奥涅加湖", "globalLake/AE/aoniejiahu.jpg"],
            ["巴尔克什湖", "globalLake/AE/baerkeshenhu.jpg"],
            ["白湖", "globalLake/AE/baihu.jpg"],
            ["贝加尔湖", "globalLake/AE/beijiaerhu.jpg"],
            ["楚德湖", "globalLake/AE/chudehu.jpg"],
            ["洞里亭湖", "globalLake/AE/donglitinghu.jpg"],
            ["凡湖", "globalLake/AE/fanhu.jpg"],
            ["哈尔乌苏湖", "globalLake/AE/haerwusuhu.jpg"],
            ["吉尔吉斯湖", "globalLake/AE/jierjisihu.jpg"],
            ["库苏古尔湖", "globalLake/AE/kusuguerhu.jpg"],
            ["拉多加湖", "globalLake/AE/laduojiahu.jpg"],
            ["雷宾斯克水库", "globalLake/AE/leibinsike.jpg"],
            ["里海", "globalLake/AE/lihai.jpg"],
            ["米尔亚湖", "globalLake/AE/mieryahu.jpg"],
            ["萨雷卡梅什湖", "globalLake/AE/saleikameishenhu.jpg"],
            ["塞凡湖", "globalLake/AE/saifanhu.jpg"],
            ["泰梅尔湖", "globalLake/AE/taimeierhu.jpg"],
            ["韦特恩湖", "globalLake/AE/weiteenhu.jpg"],
            ["维纳恩湖", "globalLake/AE/weinaenhu.jpg"],
            ["乌布苏湖", "globalLake/AE/wubusuhu.jpg"],
            ["兴凯湖", "globalLake/AE/xingkaihu.jpg"],
            ["伊尔门湖", "globalLake/AE/yiermenhu.jpg"],
            ["伊塞克湖", "globalLake/AE/yisaikehu.jpg"],
            ["斋桑湖", "globalLake/AE/zhaisanghu.jpg"],
            ["阿根廷湖", "globalLake/southAmer/agentinghu.jpg"],
            ["别德马湖", "globalLake/southAmer/biedemahu.jpg"],
            ["布宜诺斯艾利斯湖", "globalLake/southAmer/buyinuosiailisihu.jpg"],
            ["的的喀喀湖", "globalLake/southAmer/dedekakahu.jpg"],
            ["马拉开波湖", "globalLake/southAmer/malakaibohu.jpg"],
            ["密林湖", "globalLake/southAmer/milinhu.jpg"],
            ["奇基塔湖", "globalLake/southAmer/qijitahu.jpg"],
            ["索布拉迪湖", "globalLake/southAmer/suobuladihu.jpg"],
            ["艾伯特湖", "globalLake/africa/aibotehu.jpg"],
            ["爱德华湖", "globalLake/africa/aidehuahu.jpg"],
            ["基奥加湖", "globalLake/africa/jiaojiahu.jpg"],
            ["基伏湖", "globalLake/africa/jifuhu.jpg"],
            ["卡布拉巴萨水库", "globalLake/africa/kabulabasa.jpg"],
            ["卡里巴湖", "globalLake/africa/kalibahu.jpg"],
            ["鲁夸湖", "globalLake/africa/lukuahu.jpg"],
            ["马拉维湖", "globalLake/africa/malaweihu.jpg"],
            ["姆韦鲁湖", "globalLake/africa/muweiluhu.jpg"],
            ["塔纳湖", "globalLake/africa/tanahu.jpg"],
            ["坦噶尼喀湖", "globalLake/africa/tangenikahu.jpg"],
            ["图尔卡纳湖", "globalLake/africa/tuerkanahu.jpg"],
            ["维多利亚湖", "globalLake/africa/weiduoliyahu.jpg"],
            ["乍得湖", "globalLake/africa/zhadehu.jpg"],
            ["阿盖尔湖", "globalLake/oceania/agaierhu.jpg"],
            ["艾尔湖", "globalLake/oceania/aierhu.jpg"],
            ["弗罗姆湖", "globalLake/oceania/fuluomuhu.jpg"],
            ["盖尔德纳湖", "globalLake/oceania/gaierdenahu.jpg"],
            ["麦凯湖", "globalLake/oceania/maikahu.jpg"],
            ["托伦斯湖", "globalLake/oceania/tuolunsihu.jpg"],
            ["阿萨巴斯卡湖", "globalLake/northAmer/asabasikahu.jpg"],
            ["安大略湖", "globalLake/northAmer/andaluehu.jpg"],
            ["贝克湖", "globalLake/northAmer/beikehu.jpg"],
            ["别恰罗夫湖", "globalLake/northAmer/bieqialuofuhu.jpg"],
            ["大奴湖", "globalLake/northAmer/danuhu.jpg"],
            ["大熊湖", "globalLake/northAmer/daxionghu.jpg"],
            ["大盐湖", "globalLake/northAmer/dayanhu.jpg"],
            ["杜邦特湖", "globalLake/northAmer/dubangtehu.jpg"],
            ["多芬湖", "globalLake/northAmer/duofenhu.jpg"],
            ["马尼托巴湖", "globalLake/northAmer/manituobahu.jpg"],
            ["马朱瓦克湖", "globalLake/northAmer/mazhuwakehu.jpg"],
            ["梅尔维尔湖", "globalLake/northAmer/meierweierhu.jpg"],
            ["米斯塔西尼湖", "globalLake/northAmer/misitaxinihu.jpg"],
            ["密歇根湖", "globalLake/northAmer/mixiegenhu.jpg"],
            ["纳蒂灵湖", "globalLake/northAmer/nadilinghu.jpg"],
            ["尼加拉瓜湖", "globalLake/northAmer/nijialaguahu.jpg"],
            ["尼皮贡湖", "globalLake/northAmer/nipigonghu.jpg"],
            ["塞拉威克湖", "globalLake/northAmer/sailaweikehu.jpg"],
            ["圣让湖", "globalLake/northAmer/shengranghu.jpg"],
            ["势必利尔湖", "globalLake/northAmer/shibilierhu.jpg"],
            ["温尼伯戈西斯湖", "globalLake/northAmer/wenniboerxisihu.jpg"],
            ["温尼伯湖", "globalLake/northAmer/wennibohu.jpg"],
            ["伍拉斯顿湖", "globalLake/northAmer/wulasidunhu.jpg"],
            ["锡达湖", "globalLake/northAmer/xidahu.jpg"],
            ["休伦湖", "globalLake/northAmer/xiulunhu.jpg"],
            ["驯鹿湖", "globalLake/northAmer/xunluhu.jpg"],
            ["亚斯凯德湖", "globalLake/northAmer/yasikaidehu.jpg"],
            ["伊利湖", "globalLake/northAmer/yilihu.jpg"],
            ["伊利亚姆纳湖", "globalLake/northAmer/yiliyamunahu.jpg"]
        ];
        var imgUrl;

        for (var i = 0; i < globalLake.length; i++) {
            if (lakeName == globalLake[i][0]) {
                imgUrl = globalLake[i][1];
                break;
            }
        }

        return imgUrl;
    }

    function invokeSlect(layerName) {
        //$("#datatree").find('li:first>ul>li')[0];//卫星影像
        //$("#datatree").find('li:first>ul>li')[1];//地图
        //$("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[0]//2000年叶面积
        //$("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[1]//2005年叶面积
        //$("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[2]//2010年叶面积
        //$("#datatree").find('li:first+li>ul>li>ul>li+li>ul>li')[0]//2013年中亚植被
        //$("#datatree").find('li:first+li>ul>li>ul>li+li+li>ul>li')[0]//1982-2006 FPAR
        //$("#datatree").find('li:first+li>ul>li>ul>li+li+li>ul>li')[1]//2006 FPAR
        //$("#datatree").find('li:first+li>ul>li+li>ul>li>ul>li')[0]//2011年 MODIS no cloud
        //("#datatree").find('li:first+li+li>ul>li')[0]//global lake
        switch (layerName) {
            case 'LAI_2000_China':
                selectedStatus('LAI_2000_China');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[0]);
                break;
            case 'LAI_2005_China':
                selectedStatus('LAI_2005_China');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[1]);
                break;
            case 'LAI_2010_China':
                selectedStatus('LAI_2010_China');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li>ul>li')[2]);
                break;
            case 'FPAR1982-2006':
                selectedStatus('FPAR1982-2006');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li+li+li>ul>li')[0]);
                break;
            case '2006average':
                selectedStatus('2006average');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li+li+li>ul>li')[1]);
                break;
            case 'no_cloud_snow':
                selectedStatus('no_cloud_snow');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li+li>ul>li>ul>li')[0]);
                break;
            case 'zhongyaPlant':
                selectedStatus('zhongyaPlant');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li>ul>li>ul>li+li>ul>li')[0]);
                break;
            case 'globalLake_change':
                selectedStatus('globalLake_change');
                $('#datatree').jqxTree('selectItem', $("#datatree").find('li:first+li+li>ul>li')[0]);
                break;
        }
    }

    //重置earth为最初的图层
    function resetEarthCloth() {
        viewer.scene.imageryLayers.addImageryProvider(quadServerProviderImage);
        viewer.scene.imageryLayers.addImageryProvider(tiandituProviderBoundary);
        viewer.scene.imageryLayers.addImageryProvider(tiandituProviderPlaceName);
    }

    return {
        initialDataNav: initialDataNav,
        invokeSlect: invokeSlect,
        resetEarthCloth: resetEarthCloth,
        tiandituProviderPlaceName: tiandituProviderPlaceName,
        tiandituProviderBoundary: tiandituProviderBoundary
    }
}();





