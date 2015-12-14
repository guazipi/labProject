/**
 * Created by chet on 7/18/15.
 */
var ui;
var carousel_items = [];
var prodList = [];
var dataImageLayer;

$(document).ready(function() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        //imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //    url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        //}),
        //imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //    url: "../webGL2015/data/bluemarble/",
        //    fileExtension: "jpg"
        //}),
        //imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //    url: "/Earth_Data/bluemmarble/",
        //    fileExtension: "jpg"
        //}),
        //imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //    url: "js/cesium/Assets/Textures/NaturalEarthII",
        //    fileExtension: "jpg"
        //}),
        //terrainProvider: new Cesium.CesiumTerrainProvider({
        //    url: '//assets.agi.com/stk-terrain/world',
        //    requestVertexNormals: true
        //}),
        //terrainProvider: new Cesium.CesiumTerrainProvider({
        //    url: 'http://10.2.3.1/World_DEM',
        //    requestVertexNormals: true
        //}),
        //imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //    url: "/Earth_Data/world_png",
        //    fileExtension: "png"
        //}),
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
    // alert('i am here');
    viewer.scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -10.5, 130.0, 89.0));
    //viewer.scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -19.5, 130.0, 70.0));
    // viewer.scene.camera.viewRectangle(new Cesium.Rectangle(124.5, -9.5, 140.0, 70.0));
    //控制球体下部的图层等信息不显示，比如cesium的图标和bing地图的credit信息
    $('.cesium-viewer-bottom').hide();
    ui = new UI();

    initializeCarousel();

    ui.carousel();
    ui.data();

    //prepareLayers();
    initializeSlider();
    initializeDatatree();

    //初始化日期标签，在卫星追踪hud－选择卫星显示框中
    initializeDatelabel();

    //显示鼠标坐标
    viewer.scene.primitives.add(mouselabels);
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var scene = viewer.scene;
    //handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    showmousePosandsatlabel(scene, mouselabels, ellipsoid);
    //双击左键回到最初的视角
    backOriginalView(scene);

    //生成全局的Balloon widget
    var balloonContainer = document.createElement('div');
    balloonContainer.className = 'cesium-viewer-balloonContainer';
    viewer.container.appendChild(balloonContainer);
    var balloon = new Cesium.Balloon(balloonContainer, viewer.scene);
    balloon.viewModel.computeScreenSpacePosition = function(value, result) {
        result.x = value.x;
        result.y = viewer.container.clientHeight - value.y;
        return result;
    };
    balloonViewModel = balloon.viewModel;


    ////初始化更新卫星数据时显示的对话框
    //initialUpdateatsDialog();


    satelliteClickDetails(viewer.scene);

    //初始化右侧div中的tabs标签
    var tabs = $("#rightInfoList_div").tabs();


    //临时添加卫星过境时所采集的数据
    //addPringonEarth();
    /**
     * 每隔1000ms更新一次，卫星billboard的位置，让其动态显示
     */
    setInterval(function() {
        var now = Cesium.JulianDate.now(); // TODO> we'll want to base on tick and time-speedup

        if (satrecs.length > 0) {
            var sats = updateSatrecsPosVel(satrecs, now); // TODO: sgp4 needs minutesSinceEpoch from timeclock
            updateSatelliteEntityPos(sats.positions);

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
                displayStats(sats, satNoradId);
            }
        }


    }, CALC_INTERVAL_MS);

    function changeBallon(balloonViewModel, clickposition) {
        if (balloonViewModel) {
            if ('position' in balloonViewModel) {
                if (balloonViewModel.position && clickposition) {
                    var cart2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, clickposition);
                    balloonViewModel.position = cart2;
                    balloonViewModel.update();
                }
            }
        }
    }
    /**
     * 每次更新卫星billboard的位置后，不会立即显示，需要重新绘制canvas上变化的元素，
     * 这样更新后的卫星billboard才会及时显示在球体周围
     */
    // Loop the clock
    (function tick() {
        var scene = viewer.scene;
        scene.initializeFrame(); // takes optional 'time' argument

        if(balloonViewModel.showBalloon == true){
            changeBallon(balloonViewModel, clickposition);
        }

        scene.render();
        Cesium.requestAnimationFrame(tick);
    }());
});