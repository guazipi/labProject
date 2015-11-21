/**
 * Created by chet on 15/8/3.
 */
function readyDrawsth() {
    var scene=viewer.scene;
    var drawHelper = new DrawHelper(viewer);
    var toolbar = drawHelper.addToolbar(document.getElementById("drawSthTools"), {
        //buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
        buttons: ['polygon', 'circle', 'extent']
    });
    toolbar.addListener('polygonCreated', function (event) {
        //loggingMessage('Polygon created with ' + event.positions.length + ' points');
        loggingMessage('多边形创建完成，共含有 ' + event.positions.length + ' 点');
        var polygon = new DrawHelper.PolygonPrimitive({
            positions: event.positions,
            material: Cesium.Material.fromType('Checkerboard')
        });
        scene.primitives.add(polygon);
        polygon.setEditable();
        polygon.addListener('onEdited', function (event) {
            //loggingMessage('Polygon edited, ' + event.positions.length + ' points');
            loggingMessage('多边形编辑完成,共含有 ' + event.positions.length + ' 点');
        });

    });
    toolbar.addListener('circleCreated', function (event) {
        //loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
        loggingMessage('圆形创建完成: 中心点为 ' + event.center.toString() + '，半径为 ' + event.radius.toFixed(1) + ' 米');
        var circle = new DrawHelper.CirclePrimitive({
            center: event.center,
            radius: event.radius,
            material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
        });
        scene.primitives.add(circle);
        circle.setEditable();
        circle.addListener('onEdited', function (event) {
            //loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            loggingMessage('圆形编辑完成: 半径为 ' + event.radius.toFixed(1) + ' 米');
        });
    });
    toolbar.addListener('extentCreated', function (event) {
        var extent = event.extent;
        //loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
        loggingMessage('长方形创建完成 (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
        var extentPrimitive = new DrawHelper.ExtentPrimitive({
            extent: extent,
            material: Cesium.Material.fromType(Cesium.Material.StripeType)
        });
        scene.primitives.add(extentPrimitive);
        extentPrimitive.setEditable();
        extentPrimitive.addListener('onEdited', function (event) {
            //loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
            loggingMessage('长方形编辑完成: 范围为 (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');

        });
    });

    function loggingMessage(message) {
        $('#logging').attr("style", "display:block");
        $('#logging').html(message);
        $('#logging').css("color","black");
    }
}

