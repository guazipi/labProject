$('#dateTimePickerBegin').datetimepicker({
	showSecond: true,
	showMillisec: false,
	timeFormat: 'hh:mm:ss:l'
});
$('#dateTimePickerEnd').datetimepicker({
	showSecond: true,
	showMillisec: false,
	timeFormat: 'hh:mm:ss:l'
});
$('#queryCrossSats').click(function() {
	 excuteQuery();
	//addPringonEarth();
});

function excuteQuery() {
	if (isEndGreaterBegin()) {
		var getCrossRecs = new Cesium.GetCrossRecs();
		var times = getTimes($('#dateTimePickerBegin').val(), $('#dateTimePickerEnd').val());
		var editPrimitive = getEditPrimitive();
		if (!editPrimitive) {
			return;
		}
		if (editPrimitive.hasOwnProperty("extent")) {
			var features = getCrossRecs.crossRectangle(times, editPrimitive);
			// alert(features);

		}
		if (editPrimitive.hasOwnProperty("center")) {
			var features = getCrossRecs.crossCircle(times, editPrimitive);
			//alert(features);//经常是undefined，因为是异步获取数据，所以在还没获取数据的时候，已经执行到了这里，所以弹出undefined
		}
		if (editPrimitive.hasOwnProperty("positions")) {
			var features = getCrossRecs.crossPoly(times, editPrimitive);
			
		}



	}
}


function isEndGreaterBegin() {
	var dateTxtBegin, dateTxtEnd, dateObjBegin, dateObjEnd;
	dateTxtBegin = $('#dateTimePickerBegin').val();
	dateTxtEnd = $('#dateTimePickerEnd').val();
	if (dateTxtBegin == "") {
		alert("请输入起始时间点！");
		return false;
	}
	if (dateTxtEnd == "") {
		alert("请输入结束时间点！");
		return false;
	}
	dateObjBegin = usefullFuncs.getDateObjFromText(dateTxtBegin);
	dateObjEnd = usefullFuncs.getDateObjFromText(dateTxtEnd);

	if (dateObjEnd.year < dateObjBegin.year) {
		alert("结束时间必须晚于开始时间，请重新选择！");
		return false;
	}
	if (dateObjEnd.year == dateObjBegin.year) {
		if (dateObjEnd.month < dateObjBegin.month) {
			alert("结束时间必须晚于开始时间，请重新选择！");
			return false;
		}
		if (dateObjEnd.month == dateObjBegin.month) {
			if (dateObjEnd.day < dateObjBegin.day) {
				alert("结束时间必须晚于开始时间，请重新选择！");
				return false;
			}
			if (dateObjEnd.day == dateObjBegin.day) {
				if (dateObjEnd.hour < dateObjBegin.hour) {
					alert("结束时间必须晚于开始时间，请重新选择！");
					return false;
				}
				if (dateObjEnd.hour == dateObjBegin.hour) {
					if (dateObjEnd.minute < dateObjBegin.minute) {
						alert("结束时间必须晚于开始时间，请重新选择！");
						return false;

					}
					if (dateObjEnd.minute < dateObjBegin.minute) {
						if (dateObjEnd.second < dateObjBegin.second) {
							alert("结束时间必须晚于开始时间，请重新选择！");
							return false;
						}
					}
				}
			}
		}
	}

	return true;

}

function getTimes(dateTxtBegin, dateTxtEnd) {
	var time = "satellite = 'SPOT-1' and CLOUD_COVER_AVG<=10 and START_TIME>= to_date('";
	var time1 = "','YYYY-MM-DD HH24:MI:SS') AND START_TIME <= to_date('";
	var time2 = "','YYYY-MM-DD HH24:MI:SS')";

	var timeStart = dateTxtBegin.slice(6, 10) + "-" + dateTxtBegin.slice(0, 2) + "-" + dateTxtBegin.slice(3, 5) + " " + dateTxtBegin.slice(11, 13) + ":" + dateTxtBegin.slice(14, 16) + ":" + dateTxtBegin.slice(17, 19);
	var timeEnd = dateTxtEnd.slice(6, 10) + "-" + dateTxtEnd.slice(0, 2) + "-" + dateTxtEnd.slice(3, 5) + " " + dateTxtEnd.slice(11, 13) + ":" + dateTxtEnd.slice(14, 16) + ":" + dateTxtEnd.slice(17, 19);
	var totalTime = time + timeStart + time1 + timeEnd + time2;

	return totalTime;
}

function getEditPrimitive() {
	var editPrimitive, length, allPrimitives;
	length = viewer.scene.primitives.length;
	allPrimitives = viewer.scene.primitives;
	for (var i = 0; i < length; i++) {
		if ("_editMode" in allPrimitives.get(i)) {
			if (allPrimitives.get(i)._editMode) {
				if (allPrimitives.get(i)._editMode == true) {
					editPrimitive = allPrimitives.get(i);
					break;
				}
			}
		}
	}
	if (editPrimitive) {
		return editPrimitive;
	} else {
		alert("请选择感兴趣的区域");
		return;
	}

}