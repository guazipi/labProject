/**
 * Created by Administrator on 2016/4/1.
 */
initial = function () {
    "use strict";

    var initial = {
        iniLayerSwitch: iniLayerSwitch,
        destroyLayerSwitch: destroyLayerSwitch,
        iniElevationSlider: iniElevationSlider,
        iniCarousel: iniCarousel
    };

    var layer2000Name = "2000_china_lai_pcttorgb_png";
    var layer2005Name = "2005_china_lai_pcttorgb_png";
    var layer2010Name = "2010_china_lai_pcttorgb_png";

    function getImageryProvider(layerName) {
        var imageryProvider = new Cesium.TileMapServiceImageryProvider({
            url: "/wwwroot/Earth_Data/" + layerName + "/",
            fileExtension: "png"
        });

        return imageryProvider;
    }

    var layersArr=[];

    function iniLayerSwitch() {
        var layers = viewer.scene.imageryLayers;
        var layer2000 = layers.addImageryProvider(getImageryProvider(layer2000Name));
        var layer2005 = layers.addImageryProvider(getImageryProvider(layer2005Name));
        var layer2010 = layers.addImageryProvider(getImageryProvider(layer2010Name));

        var dataImageLayer = new Array(layer2000, layer2005, layer2010);

        layersArr=dataImageLayer;

        jQuery('#LayerSwitcher').slider({
            min: 0.0,
            max: 15.0,
            value: 0,
            step: 0.1,
            slide: function (event, ui) {
                if (ui.value < 5) {
                    dataImageLayer[0].alpha = 1;
                    dataImageLayer[1].alpha = 0;
                    dataImageLayer[2].alpha = 0;

                    dataImageLayer[0].alpha = ui.value / 5;

                    //console.log(ui.value);
                } else if (ui.value >= 5 && ui.value < 10) {
                    dataImageLayer[0].alpha = 1;
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 0;

                    dataImageLayer[0].alpha = (1 - (ui.value - 5) / 5);
                    dataImageLayer[1].alpha = (ui.value - 5) / 5;

                } else if (ui.value >= 10 && ui.value < 15) {
                    dataImageLayer[0].alpha = 0;
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 1;

                    dataImageLayer[1].alpha = (1 - (ui.value - 10) / 5);
                    dataImageLayer[2].alpha = (ui.value - 10) / 5;

                }
            }
        });
    }

    function destroyLayerSwitch() {
        var layers = viewer.scene.imageryLayers;

        if (layers.contains(layersArr[0])) {
            layers.remove(layersArr[0]);
        }
        if (layers.contains(layersArr[1])) {
            layers.remove(layersArr[1]);
        }
        if (layers.contains(layersArr[2])) {
            layers.remove(layersArr[2]);
        }

        jQuery('#LayerSwitcher').html("");
    }

    function iniElevationSlider() {
        //jQuery('#ElevationSlider').slider({
        //    min: 1.0,
        //    max: 25.0,
        //    value: mapView.verticalScale,
        //    step: 0.1,
        //    slide: function (event, ui) {
        //        mapView.setVerticalScale(ui.value);
        //    }
        //});
        //
    }

    function iniCarousel() {
        //$('.web3dglobe-mainmenu > li > a').click(function () {
        //    $('.web3dglobe-mainmenu > li').each(function () {
        //        $(this).removeClass('active');
        //    });
        //
        //    $(this).parent().addClass('active');
        //});

        $("#ui-carousel-next")
            .add("#ui-carousel-prev")
            .hover(
                function () {
                    $(this).css("opacity", 0.7);
                },
                function () {
                    $(this).css("opacity", 1.0);
                }
            );
        $.each($('#carousel-items').children(), function (i, e) {
            carousel_items.push($(e).html());
            prodList.push({
                label: $($(e).children()['1']).text()
            });
        });
    }


    return initial;
}();
