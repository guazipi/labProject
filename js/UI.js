/**
 * Created by chet on 15/7/24.
 */

function UI() {
    this.dialog = function (title, message) {
        //$('.modal-title').empty();
        //$('.modal-title').append(title);
        //$('.modal-body').empty();
        //$('.modal-body').append(message);

        $('#modal-title_h4').empty();
        $('#modal-title_h4').append(title);
        $('#modal-body_div').empty();
        $('#modal-body_div').append(message);
        $('#myModal').modal(false);
    }

    this.data = function () {
        $('#globediv').css({left: '290px'});
        if (!$('.web3dglobe-data').is(':visible')) {
            //$('#cesiumContainer').css({left: '290px'});
            var cesiumdiv = document.getElementById("ceisumContainer");
            //cesiumdiv.width -= 290;
            //cesiumdiv.style.width -= 290;
            viewer.resize();
        }
        this.carousel();

        var navbar = $('.web3dglobe-bar');
        var t = navbar.height();
        var footer = $('#footer');
        var b = footer.height();


        $('.web3dglobe-data').css({
            top: t + 'px',
            bottom: b + 'px'
        }).show();

        //$('.web3dglobe-data').css({
        //    top: t + 'px',
        //    bottom: b + 'px'
        //}).show(100, function () {
        //    var off1 = $('.web3dglobe-data hr').offset();
        //    var off2 = $('.web3dglobe-data .panel-footer').offset();
        //    //$('#datatree').height(off2.top - off1.top+40);
        //    $('#datatree').height('90%');
        //});


        if ($('#sattrack_buttons').css('display') === 'block' || $('#sattrack_buttons').css('display')) {
            $("#sattrack_buttons").css("left", '305px');
        }
        if ($('#satsCrossSwr').css('display') === 'block' || $('#satsCrossSwr').css('display')) {
            $("#satsCrossSwr").css("left", '305px');
        }
        if ($('#sats_displayopts').css('display') === 'block' || $('#sats_displayopts').css('display')) {
            $("#sats_displayopts").css("left", '305px');
        }
        if ($('#satellite_form').css('display') === 'block' || $('#satellite_form').css('display')) {
            $("#satellite_form").css("left", '305px');
        }
        if ($('#satshelp').css('display') === 'block' || $('#satshelp').css('display')) {
            $("#satshelp").css("left", '305px');
        }

    }

    this.dataClose = function () {
        $('.web3dglobe-data').hide();
        $('#globediv').css({left: '0px'});
        var cesiumdiv = document.getElementById("cesiumContainer");
        cesiumdiv.style.width -= 290;

        if ($('#sattrack_buttons').css('display') === 'block' || $('#sattrack_buttons').css('display')) {
            $("#sattrack_buttons").css("left", '15px');
        }
        //var domPos = $("#sattrack_buttons").offset().left - 290;
        //alert(domPos)
        if ($('#satsCrossSwr').css('display') === 'block' || $('#satsCrossSwr').css('display')) {
            $("#satsCrossSwr").css("left", '15px');
        }
        if ($('#sats_displayopts').css('display') === 'block' || $('#sats_displayopts').css('display')) {
            $("#sats_displayopts").css("left", '15px');
        }
        if ($('#satellite_form').css('display') === 'block' || $('#satellite_form').css('display')) {
            $("#satellite_form").css("left", '15px');
        }
        if ($('#satshelp').css('display') === 'block' || $('#satshelp').css('display')) {
            $("#satshelp").css("left", '15px');
        }
        viewer.resize();
        
        this.carousel();
    }
    this.isShow=function(){
        if (!$('.web3dglobe-data').is(':visible')) {
            this.data();
        } else {
            this.dataClose();
        }
    }

    this.calc = function (idx) {
        this.dialog('空间地球信息高性能计算', idx == 1 ? '计算集群配置' : (idx == 2 ? '高性能计算模型库' : '自动计算'));

    }

    this.sim = function (idx) {
        //this.dialog('地学空间信息模拟', idx == 1 ? '时序模拟' : (idx == 2 ? '三维数值模拟' : '时空拉伸模拟'));
        if (idx == 1) {
            if ($('#timingsimulation').is(':visible')){
                $('#timingsimulation').hide();
                initial.destroyLayerSwitch();
            }
            else{
                $('#timingsimulation').show();
                initial.iniLayerSwitch();
            }
        }
        if (idx == 3) {
            if ($('#Elevationsimulation').is(':visible'))
                $('#Elevationsimulation').hide();
            else
                $('#Elevationsimulation').show();
        }

    }

    this.login = function () {
        this.dialog('全球资源环境信息平台', '登陆');
    }

    this.register = function () {
        this.dialog('全球资源环境信息平台', '注册');
    }

    this.carousel = function () {
        $("#prod").empty();
        var width = $('#globediv').width();
        var vi = Math.floor((width - 60) / 130);
        if (vi < 0) vi = 0;
        if (vi > carousel_items.length) vi = carousel_items.length;

        if (vi > 0) {

            var html = '<div id="carousel">' + '</div>' +
                '<a href="#" id="ui-carousel-prev"><span></span></a>' +
                '<a href="#" id="ui-carousel-next"><span></span></a>';
            $("#prod").append(html);

            for (var i = 0; i < carousel_items.length; i++) {
                $('#carousel').append('<div>' + carousel_items[i] + '</div>');
            }

            $("#carousel").rcarousel({
                step: 1,
                visible: vi,
                auto: {enabled: false},
                margin: 10,
                speed: 100,
                width: 120
            });

            var ch = $('#prod').height();
            var h = $('#ui-carousel-prev').height();
            var witems = 130 * vi;
            $('#ui-carousel-prev').css({
                left: Math.floor(0.5 * (width - witems) - 20) + 'px',
                bottom: Math.floor((77 - h) / 2 + ch - 77) + 'px'
            });

            $('#ui-carousel-next').css({
                right: Math.floor(0.5 * (width - witems) - 30) + 'px',
                bottom: Math.floor((77 - h) / 2 + ch - 77) + 'px'
            });
        }
    }
}

//function initializeSlider() {
//    jQuery('#LayerSwitcher').slider({
//        min: 0.0,
//        max: 15.0,
//        value: 0,
//        step: 0.1,
//        slide: function (event, ui) {
//            if (ui.value < 5) {
//                dataImageLayer[1].alpha = 1;
//                dataImageLayer[2].alpha = 0;
//                dataImageLayer[3].alpha = 0;
//
//                dataImageLayer[1].alpha = ui.value / 5;
//
//                //console.log(ui.value);
//            } else if (ui.value >= 5 && ui.value < 10) {
//                dataImageLayer[1].alpha = 1;
//                dataImageLayer[2].alpha = 1;
//                dataImageLayer[3].alpha = 0;
//
//                dataImageLayer[1].alpha = (1 - (ui.value - 5) / 5);
//                dataImageLayer[2].alpha = (ui.value - 5) / 5;
//
//            } else if (ui.value >= 10 && ui.value < 15) {
//                dataImageLayer[1].alpha = 0;
//                dataImageLayer[2].alpha = 1;
//                dataImageLayer[3].alpha = 1;
//
//                dataImageLayer[2].alpha = (1 - (ui.value - 10) / 5);
//                dataImageLayer[3].alpha = (ui.value - 10) / 5;
//
//            }
//        }
//    });
//
//    //jQuery('#ElevationSlider').slider({
//    //    min: 1.0,
//    //    max: 25.0,
//    //    value: mapView.verticalScale,
//    //    step: 0.1,
//    //    slide: function (event, ui) {
//    //        mapView.setVerticalScale(ui.value);
//    //    }
//    //});
//    //
//    $('#timingsimulation').hide();
//    $('#Elevationsimulation').hide();
//}


//function initializeCarousel() {
//    //$('.web3dglobe-mainmenu > li > a').click(function () {
//    //    $('.web3dglobe-mainmenu > li').each(function () {
//    //        $(this).removeClass('active');
//    //    });
//    //
//    //    $(this).parent().addClass('active');
//    //});
//
//    $("#ui-carousel-next")
//        .add("#ui-carousel-prev")
//        .hover(
//        function () {
//            $(this).css("opacity", 0.7);
//        },
//        function () {
//            $(this).css("opacity", 1.0);
//        }
//    );
//    $.each($('#carousel-items').children(), function (i, e) {
//        carousel_items.push($(e).html());
//        prodList.push({
//            label: $($(e).children()['1']).text()
//        });
//    });
//}
/**
 * 在没有跟踪卫星的情况下，单击右键回到最初的观察角度
 * @param scene
 */
function backOriginalView(scene) {
    var backViewHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    backViewHandler.setInputAction(function (movement) {
        if (!viewer.trackedEntity) {
            scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(100.5, -10.5, 130.0, 89.0));
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}