/**
 * Created by Administrator on 2016/4/4.
 */
/**
 * Created by chet on 15/7/22.
 * sattrack.js sattrack.js sattrack.js
 */
//点击卫星追踪导航条显示卫星追踪hud
$("#track-nav").click(function () {
    if ($('#sattrack_buttons').is(':visible')) {
        modelSwitch.toSatelliteN();
        modelSwitch.toDataNavY();
    } else {
        modelSwitch.toSimulationN();
        modelSwitch.toDataNavN();
        modelSwitch.toSatelliteY();
    }
})
//切换显示卫星追踪下的几个显示框
$('#crosssat_button').click(function () {
    if ($('#satsCrossSwr').css('display') === 'none' || !$('#satsCrossSwr').css('display')) {
        $('#drawSthTools').html("");
        initial.initialDraw();
        //readyDrawsth();


        if ($("#sattrack_buttons").offset().left<"50") {
            $('#satsCrossSwr').attr("style", "display:block");
            $("#satsCrossSwr").css("left", '15px');
        } else {
            $('#satsCrossSwr').attr("style", "display:block");
        }

        $('#sats_displayopts').attr("style", "display:none");
        $('#satellite_form').attr("style", "display:none");
        $('#satshelp').attr("style", "display:none");
    } else {
        $('#satsCrossSwr').attr("style", "display:none");
    }
})
$('#display_button').click(function () {
    if ($('#sats_displayopts').css('display') === 'none' || !$('#sats_displayopts').css('display')) {
        //console.log($("#sattrack_buttons").offset());
        if ($("#sattrack_buttons").offset().left <"50") {
            $('#sats_displayopts').attr("style", "display:block");
            $("#sats_displayopts").css("left", '15px');
        } else {
            $('#sats_displayopts').attr("style", "display:block");
        }
        $('#satsCrossSwr').attr("style", "display:none");
        $('#satellite_form').attr("style", "display:none");
        $('#satshelp').attr("style", "display:none");
    } else {
        $('#sats_displayopts').attr("style", "display:none");
    }
})
$('#satselect_button').click(function () {
    if ($('#satellite_form').css('display') === 'none' || !$('#satellite_form').css('display')) {
        if ($("#sattrack_buttons").offset().left <"50") {
            $('#satellite_form').attr("style", "display:block");
            $("#satellite_form").css("left", '15px');
        } else {
            $('#satellite_form').attr("style", "display:block");
        }

        $('#satsCrossSwr').attr("style", "display:none");
        $('#sats_displayopts').attr("style", "display:none");
        $('#satshelp').attr("style", "display:none");
    } else {
        $('#satellite_form').attr("style", "display:none");
    }
})
$('#satshelp_button').click(function () {
    if ($('#satshelp').css('display') === 'none' || !$('#satshelp').css('display')) {
        if ($("#sattrack_buttons").offset().left <"50") {
            $('#satshelp').attr("style", "display:block");
            $("#satshelp").css("left", '15px');
        } else {
            $('#satshelp').attr("style", "display:block");
        }

        $('#satsCrossSwr').attr("style", "display:none");
        $('#sats_displayopts').attr("style", "display:none");
        $('#satellite_form').attr("style", "display:none");
    } else {
        $('#satshelp').attr("style", "display:none");
    }
})

//点击追踪过境卫星、显示选项、选择卫星和帮助显示框的右上角的close按钮，关闭该显示框
$("#satsCrossSwr_close").click(function () {
    $("#satsCrossSwr").attr("style", "display:none");
})
$("#mapopts_close").click(function () {
    $("#sats_displayopts").attr("style", "display:none");
})
$("#satellite_form_close").click(function () {
    $("#satellite_form").attr("style", "display:none");
})
$("#instructions_close").click(function () {
    $("#satshelp").attr("style", "display:none");
})
$("#three_d_display_button").click(function () {
    //转换视野的过程持续2000毫秒
    viewer.scene.morphTo3D(2.0);
    //设置转换视野这个动作开始2100毫秒后执行一个动作，
    //正好接上上一个动作的执行，基本看不出来
    setTimeout(function () {
        viewer.scene.camera.viewRectangle(new Cesium.Rectangle.fromDegrees(110.5, -9.5, 135.0, 90.0));
    }, 2100);
    operateSats.secondDTo3D();
})
$("#columbus_display_button").click(function () {
    viewer.scene.morphToColumbusView(2.0);

    operateSats.thirdDTo2D();
})
$("#two_d_display_button").click(function () {
    viewer.scene.morphTo2D(2.0);
    operateSats.thirdDTo2D();
})

/**
 * checkbox控制是否显示卫星的标签
 */
$("#cb_showsatLabel").click(function () {
    if ($("#cb_showsatLabel").is(':checked')) {
        for (var i = 0; i < satrecs.length; i++) {
            viewer.entities.getById(satData[i].noradId).label.show = true;
        }

    } else {
        for (var i = 0; i < satrecs.length; i++) {
            viewer.entities.getById(satData[i].noradId).label.show = false;
        }
    }
});

/**
 * checkbox控制是否显示卫星轨道
 */
$("#cb_showsatOrbit").click(function () {
    if ($("#cb_showsatOrbit").is(':checked')) {
        for (var i = 0; i < satrecs.length; i++) {
            var positions = satTLE.orbitPos(satrecs[i]);

            for(var k= 0,innerLength=satTLE.innerSatsNum.length;k<innerLength;k++){
                if (satrecs[i].satnum === parseInt(satTLE.innerSatsNum[k])) {
                    var color = new Cesium.Color(1.0, k / innerLength, 0.0, 0.8);
                    satTLE.addOrbit(i, positions, color);
                }
            }
            for(var m= 0,outerLength=satTLE.foreignSats.length;m<innerLength;m++){
                if (satrecs[i].satnum === parseInt(satTLE.foreignSats[m])) {
                    var color = new Cesium.Color(0.0,(1-m / outerLength),1.0, 1.0, 0.8);
                    satTLE.addOrbit(i, positions, color);
                }
            }
        }
    } else {
        for (var i = 0; i < satrecs.length; i++) {
            viewer.entities.removeById(satData[i].noradId + "01");
        }
    }
});

/**
 * checkbox控制是否显示卫星传感器扫描范围
 */
$("#cb_showsatSweep").click(function () {
    if ($("#cb_showsatSweep").is(':checked')) {
        //如果scene中没有显示卫星扫过的范围，即时生成卫星扫描的范围的entity
        if (!viewer.entities.getById(satData[0].noradId + "02")) {
            //生成卫星扫描的范围的entity
            satTLE.pupulateSatSweep();
        }

        for (var i = 0; i < satrecs.length; i++) {
            viewer.entities.getById(satData[i].noradId + "02").show = true;
        }

    } else {
        for (var i = 0; i < satrecs.length; i++) {
            viewer.entities.getById(satData[i].noradId + "02").show = false;
        }
    }
});

/**
 * checkbox控制切换卫星视角
 */
$("#cb_toggleSatView").click(function () {
    if ($("#cb_toggleSatView").is(':checked')) {
        alert("请首先点击选择您要切换观察视角的卫星");
        document.getElementById("cb_toggleSatView").checked = false;
    } else {
        //var center = Cesium.Cartesian3.fromDegrees(-98.0, 40.0);
        //var cameraPos = new Cesium.Cartesian3(0.0, -4790.0, 3930.0);
        //viewer.camera.lookAt(center, cameraPos);
        //viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        viewer.trackedEntity = undefined;
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }
});
//控制右边显示卫星信息和过境卫星的div的收缩
$("#hideSatInfoPanel").click(function () {
    if ($("#hideSatInfoPanel").attr("class") == "layout-button-left") {
        $("#rightSide_div").css('width', "290px");
        //$("#rightSide_div").css('height', "450px");
        $("#rightSide_div").css('height', "62%");

        $("#hideSatInfoPanel").attr("class", "layout-button-right");
    } else {
        $("#rightSide_div").css('width', "30px");
        $("#rightSide_div").css('height', "30px");

        $("#hideSatInfoPanel").attr("class", "layout-button-left");
    }
    //$("#rightSide_div").addClass("hideRightSide_div");//添加一个样式类，不能产生动画被和谐掉了
    //$("#rightSide_div").attr("class", "hideRightSide_div");//把原dom元素掉所有类删除掉，换为此类
    //$("#rightSide_div").hide();//把dom元素隐藏掉，很粗暴
    //左边掉 元素也可以动画
});
/**
 *显示不显示鼠标坐标有代码会监测cb_showmousepos是否选中，
 * 但有时候会出现取消选中之后，会遗留有一个鼠标的值显示在球体上，
 * 所以就设置点选事件，如果没选中就删除掉所有的鼠标坐标标签。
 */
$("#cb_showmousepos").click(function () {
    if (!$("#cb_showmousepos").is(':checked')) {
        mouselabels.removeAll();
    }
});

/**
 * Created by chet on 15/7/26.
 * slectsetSats.js  slectsetSats.js
 slectsetSats.js */
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

