/**
 * Created by chet on 15/7/22.
 */
//点击卫星追踪导航条显示卫星追踪hud
$("#track-nav").click(function() {
        if ($('#sattrack_buttons').is(':visible')) {
            $('#sattrack_buttons').hide();

            //当卫星追踪hud消失时，去掉scene中所有的entity
            viewer.entities.removeAll();
            //去掉追踪过境卫星时所画的图形
            removeEditPrimitive();
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

        } else {
            ui.dataClose();
            // viewer.scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(0.5, -9.5, 170.0, 89.0));
            // setTimeout(function() {
            //     viewer.camera.moveBackward(900000);
            // }, 600)

            $('#sattrack_buttons').show();

            setTimeout(function(){
                //初始化从数据库取得的tle数据
                initialTLES();

                //默认select_satellite_group选择国内所有资源卫星
                $("#select_satellite_group").val("innerSats");
                //清空选择卫星的select中的选择项
                $("#select_satellite").empty();

                //初始化并且添加entity到scene
                populateSatelliteEntity();


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
    })
    //切换显示卫星追踪下的几个显示框
$('#crosssat_button').click(function() {
    if ($('#satsCrossSwr').css('display') === 'none' || !$('#satsCrossSwr').css('display')) {
        $('#drawSthTools').html("");
        readyDrawsth();


        if ($("#sattrack_buttons").offset().left == "15") {
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
$('#display_button').click(function() {
    if ($('#sats_displayopts').css('display') === 'none' || !$('#sats_displayopts').css('display')) {
        if ($("#sattrack_buttons").offset().left == "15") {
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
$('#satselect_button').click(function() {
    if ($('#satellite_form').css('display') === 'none' || !$('#satellite_form').css('display')) {
        if ($("#sattrack_buttons").offset().left == "15") {
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
$('#satshelp_button').click(function() {
    if ($('#satshelp').css('display') === 'none' || !$('#satshelp').css('display')) {
        if ($("#sattrack_buttons").offset().left == "15") {
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
$("#satsCrossSwr_close").click(function() {
    $("#satsCrossSwr").attr("style", "display:none");
})
$("#mapopts_close").click(function() {
    $("#sats_displayopts").attr("style", "display:none");
})
$("#satellite_form_close").click(function() {
    $("#satellite_form").attr("style", "display:none");
})
$("#instructions_close").click(function() {
    $("#satshelp").attr("style", "display:none");
})
$("#three_d_display_button").click(function() {
    //转换视野的过程持续2000毫秒
    viewer.scene.morphTo3D(2.0);
    //设置转换视野这个动作开始2100毫秒后执行一个动作，
    //正好接上上一个动作的执行，基本看不出来
    setTimeout(function() {
        //viewer.scene.camera.viewRectangle(new Cesium.Rectangle.fromDegrees(124.5, -9.5, 140.0, 90.0));
        viewer.scene.camera.viewRectangle(new Cesium.Rectangle.fromDegrees(110.5, -9.5, 135.0, 90.0));
    }, 2100);
})
$("#columbus_display_button").click(function() {
    viewer.scene.morphToColumbusView(2.0);
})
$("#two_d_display_button").click(function() {
    viewer.scene.morphTo2D(2.0);
})

/**
 * checkbox控制是否显示卫星的标签
 */
$("#cb_showsatLabel").click(function() {
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
$("#cb_showsatOrbit").click(function() {
    if ($("#cb_showsatOrbit").is(':checked')) {
        for (var i = 0; i < satrecs.length; i++) {
            var positions = orbitPos(satrecs[i]);

            var color = new Cesium.Color(1.0, i / satrecs.length, 0.4, 0.9);
            //console.log(color);

            addOrbit(i, positions, color);
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
$("#cb_showsatSweep").click(function() {
    if ($("#cb_showsatSweep").is(':checked')) {
        //如果scene中没有显示卫星扫过的范围，即时生成卫星扫描的范围的entity
        if (!viewer.entities.getById(satData[0].noradId + "02")) {
            //生成卫星扫描的范围的entity
            pupulateSatSweep();
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
$("#cb_toggleSatView").click(function() {
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
$("#hideSatInfoPanel").click(function() {
    if ($("#hideSatInfoPanel").attr("class") == "layout-button-left") {
        $("#rightSide_div").css('width', "290px");
        //$("#rightSide_div").css('height', "450px");
        $("#rightSide_div").css('height', "62%");

        $("#hideSatInfoPanel").attr("class", "layout-button-right");
    } else {
        $("#rightSide_div").css('width', "40px");
        $("#rightSide_div").css('height', "40px");

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
$("#cb_showmousepos").click(function() {
    if (!$("#cb_showmousepos").is(':checked')) {
        mouselabels.removeAll();
    }
});
/**
 * 安全删除掉scene中所有在追踪过境卫星时添加和编辑的图形
 */
function removeEditPrimitive() {
    var length = viewer.scene.primitives.length;
    var primitives = viewer.scene.primitives;
    var removeArray = new Array();
    for (var i = 0; i < length; i++) {
        if ("_editMode" in viewer.scene.primitives.get(i)) {
            if (viewer.scene.primitives.get(i)._editMode) {
                removeArray.push(primitives.get(i));
                //if (viewer.scene.primitives.get(i)._editMode == true) {
                //    viewer.scene.primitives.remove(viewer.scene.primitives.get(i));
                //    break;
                //}
            }
        }
    }
    $.each(removeArray, function(k, val) {
        viewer.scene.primitives.remove(val);
    });
    var length1 = viewer.scene.primitives.length;
    var primitives1 = viewer.scene.primitives;
    var removeArray1 = new Array();
    for (var i = 0; i < length1; i++) {
        var boolan = primitives1._primitives[i].hasOwnProperty("_billboards");
        if (boolan) {
            if (primitives1._primitives[i]._billboards && primitives1._primitives[i]._billboards.length > 0) {
                var imageId = primitives1._primitives[i]._billboards[0]._imageId;
                if (imageId) {
                    if (imageId == "js/drawHelper/img/dragIcon.png" || imageId == "js/drawHelper/img/dragIconLight.png") {
                        removeArray1.push(primitives1.get(i));

                    }
                }
            }

        }

    }

    $.each(removeArray1, function(k, val) {
        viewer.scene.primitives.remove(val);
    });
}