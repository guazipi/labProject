/**
 * Created by Administrator on 2016/4/6.
 */
modelSwitch = function () {
    "use strict";
    var modelSwitch = {
        toDataNavY: toDataNavY,
        toDataNavN: toDataNavN,
        toSatelliteY: toSatelliteY,
        toSatelliteN: toSatelliteN,
        toSimulationY: toSimulationY,
        toSimulationN: toSimulationN
    };

    function toDataNavY() {
        ui.data();
        $('#prod').show();
        $('#basicLayer').jqxTree('checkAll')
    }

    function toDataNavN() {
        ui.dataClose();
        $('#prod').hide();
        viewer.scene.imageryLayers.removeAll(true);
        viewer.dataSources.removeAll();
        PrepareDataNav.resetEarthCloth();
        if (document.getElementById("productLegendDiv") !== null)
            document.body.removeChild(document.getElementById("productLegendDiv"));
    }

    function toSatelliteY() {
         $('#sattrack_buttons').show();

        setTimeout(function(){
            //初始化从数据库取得的tle数据
            satTLE.initialTLES();

            //默认select_satellite_group选择国内所有资源卫星
            $("#select_satellite_group").val("innerSats");
            //清空选择卫星的select中的选择项
            $("#select_satellite").empty();

            //初始化并且添加entity到scene
            satTLE.populateSatelliteEntity();


            /**
             * 控制每当显示卫星追踪hud时，默认选中显示卫星标签复选框,而不选中显示鼠标位置复选框
             * 当然，卫星的标签也是默认显示的。
             * 其实没有做到复选框的选中和标签的显示两者真正的协同工作，只是实现了这个效果
             */
            /**
             * 方法一这个有时候会不行
             * @type {boolean}
             */
            //$("#cb_showsatLabel").attr("checked","checked");
            //$("#cb_showmousepos").attr("checked","checked");
            /**
             * 方法二，这个是javascript原生的方法，应该是每个浏览器都可用的
             * @type {boolean}
             */
            document.getElementById("cb_showsatLabel").checked = true;
            //if ($("#cb_showmousepos").is(':checked'))
            //if (!document.getElementById("cb_showmousepos").checked)
            //    document.getElementById("cb_showmousepos").checked = false;
            if ($("#cb_showsatOrbit").is(':checked')) {
                $("#cb_showsatOrbit").prop("checked", false);
            }
            if ($("#cb_showsatSweep").is(':checked')) {
                $("#cb_showsatSweep").prop("checked", false);
            }

            /**
             * 方法三，这个还真不好说，方法一不可行时，这个可行
             * @type {boolean}
             */
            //$("#cb_showsatLabel").prop("checked",true);
            //$("#cb_showmousepos").prop("checked",true);

            //for (var i = 0; i < satBillboards.length; i++) {
            //    if (!satBillboards.get(i).show) {
            //        satBillboards.get(i).show = true;
            //    }
            //}
            //for (var i = 0; i < satlabels.length; i++) {
            //    if (!satlabels.get(i).show) {
            //        satlabels.get(i).show = true;
            //    }
            //}

        },1000)
    }

    function toSatelliteN() {
        $('#sattrack_buttons').hide();

        //当卫星追踪hud消失时，去掉scene中所有的entity
        viewer.entities.removeAll();
        //去掉显示当前卫星位置坐标的标签
        mouselabels.removeAll();
        //去掉追踪过境卫星时所画的图形
        operateSats.removeEditPrimitive();
        //下面的方法不管用，会调用那些已经destroyed的图形再次destroy（）
        //viewer.scene.primitives.removeAll();

        //设置追踪过境卫星时所画图形的说明信息为空
        $('#logging').attr("style", "display:none");
        $('#logging').html("");
        $('#crossSatsTable').html("");

        $("#rightSide_div").css('width', "40px");
        $("#rightSide_div").css('height', "40px");
        $("#hideSatInfoPanel").attr("class", "layout-button-left");


        //控制当卫星hud消失时，显示鼠标坐标的标签是未选中状态
        if ($("#cb_showmousepos").is(':checked')) {
            $("#cb_showmousepos").prop("checked", false);
        }

        $('#satsCrossSwr').hide();
        $('#sats_displayopts').hide();
        $('#satellite_form').hide();
        $('#satshelp').hide();

        if(viewer.scene.SceneMode!==Cesium.SceneMode.SCENE3D ){
            //转换视野的过程持续2000毫秒
            viewer.scene.morphTo3D(2.0);
            setTimeout(function() {
                viewer.scene.camera.viewRectangle(new Cesium.Rectangle.fromDegrees(110.5, -9.5, 135.0, 90.0));
            }, 2100);
        }
    }

    function toSimulationY() {
        $('#timingsimulation').show();
        initial.iniLayerSwitch();
    }

    function toSimulationN() {
        $('#timingsimulation').hide();
        initial.destroyLayerSwitch();
    }


    return modelSwitch;
}();