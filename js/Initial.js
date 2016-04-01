/**
 * Created by Administrator on 2016/4/1.
 */
initial=function(){
    "use strict";

    var initial={
        iniLayerSwitch:iniLayerSwitch,
        iniElevationSlider:iniElevationSlider,
        iniCarousel:iniCarousel
    };

    function iniLayerSwitch(){
        jQuery('#LayerSwitcher').slider({
            min: 0.0,
            max: 15.0,
            value: 0,
            step: 0.1,
            slide: function (event, ui) {
                if (ui.value < 5) {
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 0;
                    dataImageLayer[3].alpha = 0;

                    dataImageLayer[1].alpha = ui.value / 5;

                    //console.log(ui.value);
                } else if (ui.value >= 5 && ui.value < 10) {
                    dataImageLayer[1].alpha = 1;
                    dataImageLayer[2].alpha = 1;
                    dataImageLayer[3].alpha = 0;

                    dataImageLayer[1].alpha = (1 - (ui.value - 5) / 5);
                    dataImageLayer[2].alpha = (ui.value - 5) / 5;

                } else if (ui.value >= 10 && ui.value < 15) {
                    dataImageLayer[1].alpha = 0;
                    dataImageLayer[2].alpha = 1;
                    dataImageLayer[3].alpha = 1;

                    dataImageLayer[2].alpha = (1 - (ui.value - 10) / 5);
                    dataImageLayer[3].alpha = (ui.value - 10) / 5;

                }
            }
        });
    }

    function iniElevationSlider(){
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
}