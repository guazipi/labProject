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
        if ($('.web3dglobe-data').is(':visible')) {
            modelSwitch.toDataNavN();
        } else {
            modelSwitch.toSatelliteN();
            modelSwitch.toSimulationN();
            modelSwitch.toPopulationN();
            modelSwitch.toDataNavY();
        }
    }

    this.calc = function (idx) {
        this.dialog('空间地球信息高性能计算', idx == 1 ? '计算集群配置' : (idx == 2 ? '高性能计算模型库' : '自动计算'));

    }

    this.sim = function (idx) {
        //this.dialog('地学空间信息模拟', idx == 1 ? '时序模拟' : (idx == 2 ? '三维数值模拟' : '时空拉伸模拟'));
        if (idx == 1) {
            if($("#toolbar_popu").is(':visible')){
                if ($('#timingsimulation').is(':visible')){
                    modelSwitch.toSimulationN();
                   // modelSwitch.toDataNavY();
                }
                else{
                    //modelSwitch.toSatelliteN();
                    //modelSwitch.toDataNavN();
                    modelSwitch.toSimulationY();
                }
            }else{
                if ($('#timingsimulation').is(':visible')){
                    modelSwitch.toSimulationN();
                    modelSwitch.toDataNavY();
                }
                else{
                    modelSwitch.toSatelliteN();
                    modelSwitch.toDataNavN();
                    modelSwitch.toSimulationY();
                }
            }
        }
        setTimeout(function(){
            if(idx==2){
                if($("#timingsimulation").is(':visible')){
                    if ($('#toolbar_popu').is(':visible')){
                        modelSwitch.toPopulationN();
                        // modelSwitch.toDataNavY();
                    }
                    else{
                        //modelSwitch.toSatelliteN();
                        //modelSwitch.toDataNavN();
                        modelSwitch.toPopulationY();
                    }
                }else{
                    if ($('#toolbar_popu').is(':visible')){
                        modelSwitch.toPopulationN();
                        modelSwitch.toDataNavY();
                    }
                    else{
                        modelSwitch.toSatelliteN();
                        modelSwitch.toDataNavN();
                        modelSwitch.toPopulationY();
                    }
                }
            }
        },300);

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



