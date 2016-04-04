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
    //先初始化成两个函数,把功能实现再说,然后再去完善这个功能,让他更全面些,有头有尾巴

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


    return initial;
};

var initialize= function () {
    //常见的是返回一个拥有多种功能的对象
    //如果是单一的功能,可能就附加到其他对象上了
}();

var initialized= function () {

};
var iii=initialized();
//iii.***
//这样组织的原因是把相关的函数变量或者只用一次的,中间的函数都整理到一个大的函数对象内部,便于组织管理也便于访问,
//感觉自己在将一个功能的代码搞到一块的能力还有点欠缺的.

//最好的是将所有的代码都整理为对象的形式,整个项目的入口其实也只有一个$(document).ready(function () {})或者onload两个,
// 这两个一般都是比较简洁的写法了(一两句代码就把功能实现了),更多的东西是在这些简洁的东西后面