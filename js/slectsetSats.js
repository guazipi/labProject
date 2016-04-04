/**
 * Created by chet on 15/7/26.
 */
//默认select_satellite_group选择国内所有资源卫星
$("#select_satellite_group").val("innerSats");
//select_satellite_group更改选择项时触发的事件
$('#select_satellite_group').change(function () {
    var selectValue = $("#select_satellite_group").val();
    var satsArray = [
        'allSats',
        'innerSats', 'tiangong', 'gaofenSet', 'HJSet', 'CBERSSet', 'ZYSet', 'HAIYANGSet',
        'foreignSats', 'LandSatSet', 'IRSSet', 'ESASet', 'CASet', 'SPOTSet', 'TERRA', 'ALOSSet', 'THEOS'];
    $.each(satsArray, function (i, val) {
        if (val == selectValue) {
            operateSats.getCertainSats(val);
        }
    });
});

/**
 * 更改select_satellite'里面的选择项时，触发的事件
 */
$('#select_satellite').change(function () {
    //得到select的值是1
    //var value=$("#select_satellite").val();
    //得到select中所有选择项的文本值
    //var selectValue = $("#select_satellite").val(1).text();
    var selectValue = $("#select_satellite").find("option:selected").text();
    if (selectValue == "请选择一个卫星") {
        viewer.trackedEntity = undefined;
    }
    //当选中某一项时，即默认追踪此卫星
    for (var i = 0; i < satrecs.length; i++) {
        if (selectValue == satData[i].name) {
            viewer.trackedEntity = viewer.entities.getById(satData[i].noradId);
            document.getElementById("cb_toggleSatView").checked = true;

            operateSats.showSatDetail(satData[i].noradId);
            setTimeout(function () {
                viewer.camera.moveBackward(900000);
            }, 1000)
        }
    }
});

