/**
 * Created by chet on 15/11/19.
 */
 function addPringonEarth(){
 	var polygonArray = crossFoots.features;
//    console.log(polygonArray[0].geometry.rings);
//    console.log(polygonArray[0].geometry.rings[0]);
//    console.log(polygonArray[0].geometry.rings[0][0]);
//var entities = viewer.entities;

for (var k = 0; k < polygonArray.length / 10; k++) {
    var positions = [];

    var pointsArray = polygonArray[k].geometry.rings[0];
    for (var i = 0; i < pointsArray.length; ++i) {
        positions.push(Cesium.Cartesian3.fromDegrees(pointsArray[i][0], pointsArray[i][1]));
    }
    viewer.entities.add({
        polyline: {
            positions: positions,
            width: 2.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.DEEPSKYBLUE,
                glowPower: 0.25
            })
        }
    });
}
 }
