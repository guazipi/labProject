/**
 * Created by chet on 7/18/15.
 */
var ui;
var carousel_items = [];
var prodList = [];

$(document).ready(function () {
    var value = Math.PI * 256.0 / 180.0;
    var extent = new Cesium.Rectangle(-value, -value, value, value);
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
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
        }),
        terrainProvider: new Cesium.CesiumTerrainProvider({
            url: '//assets.agi.com/stk-terrain/world',
            requestVertexNormals: true
        }),
        baseLayerPicker: false,
        animation: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        timeline: false
    });
    //控制地球的初始视野为中国
    viewer.scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -10.5, 130.0, 89.0));
    //viewer.scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -19.5, 130.0, 70.0));
    // viewer.scene.camera.viewRectangle(new Cesium.Rectangle(124.5, -9.5, 140.0, 70.0));
    //控制球体下部的图层等信息不显示，比如cesium的图标和bing地图的credit信息
    $('.cesium-viewer-bottom').hide();
    var tiandituProvider=new Cesium.WebMapTileServiceImageryProvider({
        url : 'http://t0.tianditu.com/cia_w/wmts',
        layer : 'cia',
        style : 'default',
        format : 'tiles',
        tileMatrixSetID : 'w',//注意web墨卡托此时是w
        // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
        maximumLevel: 19,
        credit : new Cesium.Credit('天地图')
    });
    viewer.scene.imageryLayers.addImageryProvider(tiandituProvider);

    ui = new UI();

    //初始化图片轮询
    initial.iniCarousel();

    //初始化页面左边栏的数据导航内容
    //var preData=new PrepareDataNav();
    //preData.initialDataNav();
    PrepareDataNav.initialDataNav();
    ui.carousel();
    ui.data();


    //初始化日期标签，在卫星追踪hud－选择卫星显示框中
    initial.initializeDatelabel();

    //显示鼠标坐标
    viewer.scene.primitives.add(mouselabels);
    satTLE.showmousePosandsatlabel(viewer.scene, mouselabels, viewer.scene.globe.ellipsoid);
    //注册事件，按空格键回到最初的视角
    initial.backOriginalView(viewer.scene);
    //注册事件，双击左键，拉近camera与物体的距离，放大
    initial.doubleClickZoomIn(viewer.scene);

    //生成全局的Balloon widget
    var balloonContainer = document.createElement('div');
    balloonContainer.className = 'cesium-viewer-balloonContainer';
    viewer.container.appendChild(balloonContainer);
    var balloon = new Cesium.Balloon(balloonContainer, viewer.scene);
    balloon.viewModel.computeScreenSpacePosition = function (value, result) {
        result.x = value.x;
        result.y = viewer.container.clientHeight - value.y;
        return result;
    };
    balloonViewModel = balloon.viewModel;


    operateSats.satelliteClickDetails(viewer.scene);

    //初始化右侧div中的tabs标签
    var tabs = $("#rightInfoList_div").tabs();


    /**
     * 每隔1000ms更新一次，卫星billboard的位置，让其动态显示
     */
    setInterval(function () {
        var now = Cesium.JulianDate.now(); // TODO> we'll want to base on tick and time-speedup

        if (satrecs.length > 0) {
            var sats = satTLE.updateSatrecsPosVel(satrecs, now); // TODO: sgp4 needs minutesSinceEpoch from timeclock
            satTLE.updateSatelliteEntityPos(sats.positions);

            // propagate [GLOBAL]
            satrecs = sats.newSatrecs;

            //更新卫星轨道entity的位置（此时要求精度不是那么高，暂时不用更新轨道entity的位置）
            //updateOrbitPos(sats.newSatrecs);

            //当没有跟踪卫星时，把没有选中跟踪卫星的提示信息的div显示出来，同时把显示卫星信息的table隐藏掉
            if (!viewer.trackedEntity) {
                if ($('#satInfoTable').is(':visible')) {
                    $("#satInfoTable").hide();
                }
                if (!$('#satinfo-message').is(':visible')) {
                    $("#satinfo-message").show();
                }

            } else {
                //根据跟踪卫星entity的id去显示该卫星的详细信息
                var satNoradId = viewer.trackedEntity.id;
                operateSats.displayStats(sats, satNoradId);
            }
        }


    }, CALC_INTERVAL_MS);

    /**
     * 每次更新卫星billboard的位置后，不会立即显示，需要重新绘制canvas上变化的元素，
     * 这样更新后的卫星billboard才会及时显示在球体周围
     */
        // Loop the clock
    (function tick() {
        var scene = viewer.scene;
        scene.initializeFrame(); // takes optional 'time' argument

        if (balloonViewModel.showBalloon == true) {
            //changeBallon(balloonViewModel, clickposition);
            var changeBalloon=function(balloonViewModel, clickposition){
                if (balloonViewModel) {
                    if ('position' in balloonViewModel) {
                        if (balloonViewModel.position && clickposition) {
                            var cart2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, clickposition);
                            balloonViewModel.position = cart2;
                            balloonViewModel.update();
                        }
                    }
                }
            }(balloonViewModel, clickposition);
        }

        scene.render();
        Cesium.requestAnimationFrame(tick);
    }());
});