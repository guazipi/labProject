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
            getCertainSats(val);
        }
    });
});
/**
 * 给定select_satellite_group中的选择项所对应的值，向数据库中查询数据，
 * 根据查询所得的数据，给select_satellite赋值，并且初始化卫星的satrecs，
 * 最后添加卫星的entity，
 * @param satGroup
 */
function getCertainSats(satGroup) {
    $.ajaxSettings.async = false;
    $.getJSON("php/getTLE/getCertainSats.php?satGroup=" + satGroup, function (data, testStatus) {

        /**
         * 此时从服务器的数据库中返回回来是一个多维数组，
         * 每个卫星的tleLine0、tleLine1和tleLine2三行元素一个数组，
         * 每个卫星的数组又组成一个大的数组
         */
        //console.log(data);
        //console.log(data[0][1]);//第一个元素的tleLine1
        //alert(data.length);

        if (data.length > 0) {
            //更换卫星group选择之后，首先清空下面选择卫星的select中的选择项
            $("#select_satellite").empty();
            //当选择的不是所有卫星、国内所有卫星和国外所有卫星这三项时，
            //给下面的select_satellite赋值
            if (!(satGroup == 'allSats' || satGroup == 'innerSats' || satGroup == 'foreignSats')) {
                var option = $("<option>").val(1).text("请选择一个卫星");
                $("#select_satellite").append(option);
                $("#select_satellite").val("请选择一个卫星");
                for (var i = 0; i < data.length; i++) {
                    var option = $("<option>").val(1).text(data[i][0]);
                    $("#select_satellite").append(option);
                }
            }
        }
        //初始化satrecs
        satTLE.getSatrecsFromTLESArray(data);
        //去掉之前scene中所有的entity，下面要添加新一轮的entity了
        viewer.entities.removeAll();

        //初始化并且添加entity到scene
        satTLE.populateSatelliteEntity();

        $("#cb_showsatSweep").prop("checked", false);
        $("#cb_showsatOrbit").prop("checked", false);
        //$("#cb_showsatLabel").prop("checked", false);
        $("#cb_showmousepos").prop("checked", false);
        $("#cb_toggleSatView").prop("checked", false);
    });
    $.ajaxSettings.async = true;
}
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

            showSatDetail(satData[i].noradId);
            setTimeout(function () {
                viewer.camera.moveBackward(900000);
            }, 1000)
        }
    }
});

