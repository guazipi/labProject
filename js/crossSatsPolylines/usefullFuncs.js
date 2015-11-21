var usefullFuncs = {};
usefullFuncs.getLonLatFromCartesian = function(position) {
	var cartographic, lon, lat;
	var lonLatArray = [];
	cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position);

	lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
	lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(15);

	lonLatArray.push(lon);
	lonLatArray.push(lat);

	return lonLatArray;
};
usefullFuncs.getDateObjFromText = function(dateTxt) {
	var month, day, year,
		hour, minute, second;
	month = parseInt(dateTxt.slice(0, 2));
	day = parseInt(dateTxt.slice(3, 5));
	year = parseInt(dateTxt.slice(6, 10));
	hour = parseInt(dateTxt.slice(11, 13));
	minute = parseInt(dateTxt.slice(14, 16));
	second = parseInt(dateTxt.slice(17, 19));

	

return {
	'month': month,
	'day': day,
	'year': year,
	'hour': hour,
	'minute': minute,
	'second': second
}
}