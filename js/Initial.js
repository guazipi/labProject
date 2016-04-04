/**
 * Created by Administrator on 2016/4/1.
 */
initial = function () {
    "use strict";

    var initial = {
        iniLayerSwitch: iniLayerSwitch,
        destroyLayerSwitch: destroyLayerSwitch,
        iniElevationSlider: iniElevationSlider,
        iniCarousel: iniCarousel,
        backOriginalView:backOriginalView,
        initializeDatelabel:initializeDatelabel,
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


    /**
     * Created by chet on 15/7/25.
     * 初始化卫星更新的时间标签
     */
    function initializeDatelabel() {
        //$.ajaxSettings.async = false;
        $.getJSON("php/getTLE/initialDatelabel.php", function (data) {
            //console.log(data);
            //alert(data);
            var dateArray = DateFromEpoch(data);

            $("#yearLabel").text(dateArray['year']);
            $("#monthLabel").text(dateArray['month']);
            $("#dayLabel").text(dateArray['day']);
            $("#hourLabel").text(dateArray['hour']);
            $("#minuteLabel").text(dateArray['minute']);
            $("#secondLabel").text(dateArray['second']);
        });
        // $.ajaxSettings.async = true;
    }
    /**
     * 从epoch中计算具体日期
     * @param epoch
     * @returns {Array|*}
     * @constructor
     */
    function DateFromEpoch(epoch) {
        var epochString, middleChar, headEpoch, endEpoch,
            yearEnd, year, allDays, month, day,
            hour, middleMinute, minute, second,
            dateArray;
        epochString = epoch.toString();
        middleChar = epochString.indexOf(".");
        headEpoch = epochString.slice(0, middleChar);
        endEpoch = epochString.slice(middleChar + 1, epochString.length);

        yearEnd = parseInt(headEpoch.slice(0, 2));
        if (yearEnd < 57) {
            year = parseInt("20" + yearEnd.toString());
        } else {
            year = parseInt("19" + yearEnd.toString());
        }


        allDays = parseInt(headEpoch.slice(2, headEpoch.length));

        var monthdateArray = getMonthdateArray(year, allDays);


        var trueEndEpoch = parseFloat("0." + endEpoch);
        hour = parseInt(trueEndEpoch * 24);
        if (hour < 10)
            hour = "0" + hour.toString();
        middleMinute = (trueEndEpoch * 24 - hour) * 60;
        minute = parseInt(middleMinute);
        if (minute < 10)
            minute = "0" + minute.toString();
        second = ((middleMinute - minute) * 60).toFixed(0);
        if (second < 10)
            second = "0" + second.toString();

        dateArray = new Array();
        dateArray['year'] = year;
        dateArray['month'] = monthdateArray.getMonth;
        dateArray['day'] = monthdateArray.getDay;
        dateArray['hour'] = hour;
        dateArray['minute'] = minute;
        dateArray['second'] = second;

        return dateArray;
    }

//JS判断闰年代码
    function isLeapYear(Year) {
        if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
            return (true);
        } else {
            return (false);
        }
    }
    /**
     * 给出年份和一年中的天数，判断是否是闰年
     * 返回一个含有月份和这个月的第几天的数组
     * @param year
     * @param days
     */
    function getMonthdateArray(year, days) {
        if (!isLeapYear(year))
            return noLeapMonthday(days);
        else
            return leapMonthday(days);
    }
    /**
     * 给出一个闰年的天数，返回月份和这个月的某一天
     * 二月29天
     * @param days
     * @returns {Array}
     */
    function leapMonthday(days) {
        var month = 0, day = 0;
        if (days < 31) {
            month = 1;
            day = days;
        }
        else if (days == 31) {
            month = 1;
            day = 31;
        }
        else if (days > 31 && days < 60) {
            month = 2;
            day = days - 31;
        }
        else if (days == 60) {
            month = 2;
            day = 28;
        }
        else if (days > 60 && days < 91) {
            month = 3;
            day = days - 60;
        }
        else if (days == 91) {
            month = 3;
            day = 31;
        }
        else if (days > 91 && days < 121) {
            month = 4;
            day = days - 91;
        }
        else if (days == 121) {
            month = 4;
            day = 30;
        }
        else if (days > 121 && days < 152) {
            month = 5;
            day = days - 121;
        }
        else if (days == 152) {
            month = 5;
            day = 31;
        }
        else if (days > 152 && days < 182) {
            month = 6;
            day = days - 152;
        }
        else if (days == 182) {
            month = 6;
            day = 30;
        }
        else if (days > 182 && days < 213) {
            month = 7;
            day = days - 182;
        }
        else if (days == 213) {
            month = 7;
            day = 31;
        }
        else if (days > 213 && days < 244) {
            month = 8;
            day = days - 213;
        }
        else if (days == 244) {
            month = 8;
            day = 31;
        }
        else if (days > 244 && days < 274) {
            month = 9;
            day = days - 244;
        }
        else if (days == 274) {
            month = 9;
            day = 30;
        }
        else if (days > 274 && days < 305) {
            month = 10;
            day = days - 274;
        }
        else if (days == 305) {
            month = 10;
            day = 31;
        }
        else if (days > 305 && days < 335) {
            month = 11;
            day = days - 305;
        }
        else if (days == 335) {
            month = 11;
            day = 30;
        }
        else if (days > 335 && days < 366) {
            month = 12;
            day = days - 335;
        }
        else if (days == 366) {
            month = 12;
            day = 31;
        }

        return {
            'getMonth': month,
            'getDay': day
        };

    }
    /**
     * 给出一个非闰年的天数，返回月份和这个月的某一天
     * 二月28天
     * @param days
     * @returns {Array}
     */
    function noLeapMonthday(days) {
        var month = 0, day = 0;
        if (days < 31) {
            month = 1;
            day = days;
        }
        else if (days == 31) {
            month = 1;
            day = 31;
        }
        else if (days > 31 && days < 59) {
            month = 2;
            day = days - 31;
        }
        else if (days == 59) {
            month = 2;
            day = 28;
        }
        else if (days > 59 && days < 90) {
            month = 3;
            day = days - 59;
        }
        else if (days == 90) {
            month = 3;
            day = 31;
        }
        else if (days > 90 && days < 120) {
            month = 4;
            day = days - 90;
        }
        else if (days == 120) {
            month = 4;
            day = 30;
        }
        else if (days > 120 && days < 151) {
            month = 5;
            day = days - 120;
        }
        else if (days == 151) {
            month = 5;
            day = 31;
        }
        else if (days > 151 && days < 181) {
            month = 6;
            day = days - 151;
        }
        else if (days == 181) {
            month = 6;
            day = 30;
        }
        else if (days > 181 && days < 212) {
            month = 7;
            day = days - 181;
        }
        else if (days == 212) {
            month = 7;
            day = 31;
        }
        else if (days > 212 && days < 243) {
            month = 8;
            day = days - 212;
        }
        else if (days == 243) {
            month = 8;
            day = 31;
        }
        else if (days > 243 && days < 273) {
            month = 9;
            day = days - 243;
        }
        else if (days == 273) {
            month = 9;
            day = 30;
        }
        else if (days > 273 && days < 304) {
            month = 10;
            day = days - 273;
        }
        else if (days == 304) {
            month = 10;
            day = 31;
        }
        else if (days > 304 && days < 334) {
            month = 11;
            day = days - 304;
        }
        else if (days == 334) {
            month = 11;
            day = 30;
        }
        else if (days > 334 && days < 365) {
            month = 12;
            day = days - 334;
        }
        else if (days == 365) {
            month = 12;
            day = 31;
        }
        return {
            'getMonth': month,
            'getDay': day
        };
    }

    return initial;
}();
