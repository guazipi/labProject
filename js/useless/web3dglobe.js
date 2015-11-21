var ui;
var carousel_items = [];
var prodList = [];

var mapView;
var layerSwitcher;
var Landsatlayer;
var FPARlayer;
var CropGrowlayer;
var shplayer;

var monthSixHalf;
var monthSixAverage;
var monthSix;

var chld20070610;
var chld20080601;
var chld20090601;
var china_lai_2010;

var dataImageLayer;
var data_name_Map;
function addLayerToMap(data, datatype) {
//console.log("data size"+ data.length );
    var dataroot = "http://10.2.4.1:81/wwwroot/Earth_Data/";
    for (var i = 0; i < data.length; ++i) {
        dataImageLayer.push(new ReadyMap.TMSImageLayer({
            name: data[i],
            url: dataroot + data[i] + "/",
            imageType: datatype[i]
        }));
    }
}

//$(document).ready(function () {
ReadyMap.init(function () {

    var data = Array();
    var datatype = Array();
    dataImageLayer = new Array();
    data_name_map = {};

    var imagename = "world_png";
    data.push(imagename); //0
    datatype.push("png");

//  data.push( "2004年1月全球植被变化分析"); //1
// datatype.push("png");
//  data.push( "2008nian5yuezhongguoshachebao"); //1
// datatype.push("png");

    //中国区域叶面积指数
    imagename = "2000_china_lai_pcttorgb_png";
    data.push(imagename); //1
    datatype.push("png");

    data.push("2005_china_lai_pcttorgb_png"); //1
    datatype.push("png");

    data.push("2010_china_lai_pcttorgb_png"); //1
    datatype.push("png");

    //青藏高原地区MODIS每日无云雪盖遥感
    data.push("snow_no_cloud_png"); //2
    datatype.push("png");

    //全球大气CO2浓度变化
    data.push("summer2012_exported"); //3
    datatype.push("png");

    //全球植被FPAR数据
    imagename = "2006averageFPAR";
    data.push(imagename);   //4
    datatype.push("png");

    data.push("global_arableland_crop_conditionrgb"); //5
    datatype.push("png");

    data.push("ChlD_20090601_000000_20090610_235959");
    datatype.push("png");

// data.push("monthSixHalf");
// datatype.push("png"); 
// data.push("monthSixAverage");
// datatype.push("png");
// data.push("ChlD_20070610_000000_20070617_235959");
// datatype.push("png"); 
// data.push("ChlD_20080601_000000_20080610_235959");
// datatype.push("png");  


    //	data.push("2000_china_lai_pcttorgb_png");
    //	datatype.push("png");

// 	data.push("2005_china_laipcttorgb_png");
// 	datatype.push("png"); 

    //	 data.push("2010_china_laipcttorgb_png");
    //	datatype.push("png");


    addLayerToMap(data, datatype);

    var dataroot = "http://10.2.4.1:81/wwwroot/Earth_Data/";
    var map = new ReadyMap.Map({minElevation: 0.0});


    CropGrowlayer = new ReadyMap.TMSCustomImageLayer({		//农作物长势图
        name: "zhenan",
        url: dataroot + "global_arableland_crop_conditionrgb/",
        imageType: "png",
        xmin: -159,
        xmax: 169.7,
        ymin: -40,
        ymax: 59.9
    });

    for (var i = 0; i < dataImageLayer.length; ++i) {
        //控制是否初始显现
        map.addImageLayer(dataImageLayer[i]);
        dataImageLayer[i].setVisible(false);
    }
    dataImageLayer[0].setVisible(true);
    //dataImageLayer[dataImageLayer.length-1].setVisible(true);


    // create a view tied to a page element:
    var size = ReadyMap.getWindowSize();
    var headerHeight = jQuery('#head').height();
    var toolbarHeight = jQuery('#toolbar').height();
    var footerHeight = jQuery('#footer').height();
    var headlen = headerHeight;
    size.h -= headlen;
    size.w -= 290;
    mapView = new ReadyMap.MapView("3DView", size, map);

    ui = new UI();


    $('.web3dglobe-mainmenu > li > a').click(function () {
        $('.web3dglobe-mainmenu > li').each(function () {
            $(this).removeClass('active');
        });

        $(this).parent().addClass('active');
    });

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

    ui.carousel();


    $('#web3dglobe-search').autocomplete({
        source: prodList,
        select: function (event, _ui) {
            ui.search();
        }
    });

    $('#datatree :checkbox').click(function () {
        var checked = $(this).is(':checked');
        var checkboxes = $(this).parent().find('input[type=checkbox]');
        console.log(checkboxes);
        $(checkboxes).prop('checked', checked);

        if ($(this).val() == "FPAR")//植被FPAR2006年全球植被FPAR平均值
        {
            FPARlayer.setOpacity(1);
            FPARlayer.setVisible(checked);
            CropGrowlayer.setOpacity(0);
            $("#carousel").rcarousel("goToPage", 0);
        }

        if ($(this).val() == "CropGrow")	//2013年9月中旬全球作物长势等级图
        {
            $("#carousel").rcarousel("goToPage", 7);
            CropGrowlayer.setVisible(checked);
            FPARlayer.setOpacity(0);
            CropGrowlayer.setOpacity(1);
        }
    });

    ui.data();

    $(window).resize(function (evt) {
        if ($('.web3dglobe-data').is(':visible')) {
            ui.data();
            var canvas = document.getElementById("3DView");
            canvas.width = window.innerWidth - 290;
            canvas.style.width = window.innerWidth - 290;
        }

        canvas.height = window.innerHeight - jQuery('#head').height();
        canvas.style.height = window.innerHeight - jQuery('#head').height();

        ui.carousel();
        mapView.resize();
    });

    if ($('.web3dglobe-data').is(':visible')) {
        var canvas = document.getElementById("3DView");
        canvas.width = window.innerWidth - 290;
        canvas.style.width = window.innerWidth - 290;
    }
    mapView.resize();
    jQuery('#LayerSwitcher').slider({
        min: 0.0,
        max: 15.0,
        value: 0,
        step: 0.1,
        slide: function (event, ui) {
            if (ui.value < 5) {
                dataImageLayer[1].setVisible(true);
                dataImageLayer[2].setVisible(false);
                dataImageLayer[3].setVisible(false);
                //dataImageLayer[0].setVisible(false);

                dataImageLayer[1].setOpacity(ui.value / 5);
                console.log(ui.value);
            } else if (ui.value >= 5 && ui.value < 10) {
                dataImageLayer[1].setVisible(true);
                dataImageLayer[2].setVisible(true);
                dataImageLayer[3].setVisible(false);
                //dataImageLayer[0].setVisible(false);

                dataImageLayer[1].setOpacity((1 - (ui.value - 5) / 5));
                dataImageLayer[2].setOpacity((ui.value - 5) / 5);

            } else if (ui.value >= 10 && ui.value < 15) {
                dataImageLayer[1].setVisible(false);
                dataImageLayer[2].setVisible(true);
                dataImageLayer[3].setVisible(true);
                //dataImageLayer[0].setVisible(false);
                dataImageLayer[2].setOpacity((1 - (ui.value - 10) / 5));
                dataImageLayer[3].setOpacity((ui.value - 10) / 5);

            }
        }
    });

    jQuery('#ElevationSlider').slider({
        min: 1.0,
        max: 25.0,
        value: mapView.verticalScale,
        step: 0.1,
        slide: function (event, ui) {
            mapView.setVerticalScale(ui.value);
        }
    });

    jQuery('#timingsimulation').hide();
    jQuery('#Elevationsimulation').hide();


    $("#datatree").ligerTree({
        data: [
            {
                text: '基础图层', children: [
                {text: '影像'},
                {text: '矢量'},
                {text: '地形'},
                {
                    text: '全球空间变化信息', children: [
                    {text: '2000中国区域叶面积指数'},
                    {text: '2005中国区域叶面积指数'},
                    {text: '2010中国区域叶面积指数'},
                    {text: '每日无云雪盖遥感'},
                    {text: '全球大气CO2浓度变化'},
                    {text: '全球植被FPAR数据'},
                    {text: '全球植被叶绿素密度'},
                    {text: '全球植被物候数据'},
                    {text: '全球森林植被高度'}
                ]
                },
                {
                    text: '资源环境专题空间信息产品', children: [
                    {text: '全球作物长势等级图'},
                    {text: '2010年全国土地利用产品'},
                    {text: '2010全球主要灾害空间信息产品'}
                ]
                },
                {
                    text: '高性能计算', children: [
                    {text: '2004年1月全球植被变化分析'},
                    {text: '2008年5月中国北部地区沙尘分析'}
                ]
                }
            ]
            }
        ],
        nodeWidth: 160,
        onCheck: onCheck
    });
});

function disableAllLayers(index, checked) {
    for (var i = 1; i < dataImageLayer.length; ++i) {
        if (i != index)
            dataImageLayer[i].setOpacity(0);
        else {
            dataImageLayer[i].setOpacity(1);
            dataImageLayer[i].setVisible(checked);
        }
    }
}

function onCheck(note, checked) {

    var noteString = Array();
    noteString.push("全球底图");

//	noteString.push("2004年1月全球植被变化分析");
//	noteString.push("2008年5月中国北部地区沙尘分析");

    noteString.push("2000中国区域叶面积指数");
    noteString.push("2005中国区域叶面积指数");
    noteString.push("2010中国区域叶面积指数");
    noteString.push("每日无云雪盖遥感");
    noteString.push("全球大气CO2浓度变化");
    noteString.push("全球植被FPAR数据");
    noteString.push("全球作物长势等级图");
    noteString.push("全球植被叶绿素密度");
    noteString.push("海洋表面温度产品");
    noteString.push("全球植被物候数据");


    noteString.push("全球森林植被高度");
    noteString.push("2006年全球植被FPAR");

    for (var i = 0; i < noteString.length; ++i) {
        if (note.data.text == noteString[i]) {
            disableAllLayers(i, checked);
            $("#carousel").rcarousel("goToPage", i);
        }
    }

}


function resize() {
}


function UI() {
    this.dialog = function (title, message) {
        $('.modal-title').empty();
        $('.modal-title').append(title);
        $('.modal-body').empty();
        $('.modal-body').append(message);
        $('#myModal').modal(false);
    }

    this.home = function () {

    }

    this.data = function () {

        $('#canvas').css({left: '290px'});
        if (!$('.web3dglobe-data').is(':visible')) {
            var canvas = document.getElementById("3DView");
            canvas.width -= 290;
            canvas.style.width -= 290;
            var mapv = mapView;
            mapv.resize("3DView");
        }
        this.carousel();

        var navbar = $('.web3dglobe-bar');
        var t = navbar.height();
        var footer = $('#footer');
        var b = footer.height();

        $('.web3dglobe-data').css({
            top: t + 'px',
            bottom: b + 'px'
        }).show(100, function () {
            var off1 = $('.web3dglobe-data hr').offset();
            var off2 = $('.web3dglobe-data .panel-footer').offset();
            $('#datatree').height(off2.top - off1.top - 10);
        });

    }

    this.dataClose = function () {
        $('.web3dglobe-data').hide();
        $('#canvas').css({left: '0px'});
        var canvas = document.getElementById("3DView");
        canvas.width += 290;
        canvas.style.width -= 290;
        mapView.resize("3DView");

        this.carousel();
    }

    this.calc = function (idx) {
        this.dialog('空间地球信息高性能计算', idx == 1 ? '计算集群配置' : (idx == 2 ? '高性能计算模型库' : '自动计算'));

    }

    this.sim = function (idx) {
        //this.dialog('地学空间信息模拟', idx == 1 ? '时序模拟' : (idx == 2 ? '三维数值模拟' : '时空拉伸模拟'));
        if (idx == 1) {
            if (jQuery('#timingsimulation').is(':visible'))
                jQuery('#timingsimulation').hide();
            else
                jQuery('#timingsimulation').show();
        }
        if (idx == 3) {
            if (jQuery('#Elevationsimulation').is(':visible'))
                jQuery('#Elevationsimulation').hide();
            else
                jQuery('#Elevationsimulation').show();
        }

    }

    this.search = function () {
        var label = $('#web3dglobe-search').val();
        carousel_items = [];
        if (!!label) {
            $.each($('#carousel-items').children(), function (i, e) {
                var _label = $($(e).children()['1']).text();
                if (_label.search(label) != -1) {
                    carousel_items.push($(e).html());
                }
            });
        } else {
            $.each($('#carousel-items').children(), function (i, e) {
                carousel_items.push($(e).html());
            });
        }

        this.carousel();
    }

    this.login = function () {
        this.dialog('全球资源环境信息平台', '登陆');
    }

    this.register = function () {
        this.dialog('全球资源环境信息平台', '注册');
    }

    this.carousel = function () {
        $("#prod").empty();
        var width = $('#canvas').width();
        var vi = Math.floor((width - 60) / 130);
        if (vi < 0) vi = 0;
        if (vi > carousel_items.length) vi = carousel_items.length;

        // console.log(vi);

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

function gotoloctation() {
    mapView.viewer.getManipulator().setViewpoint(33.5, 109, 0, 0, -90, 200000, 5);
}
function onclickCrop()	//响应全球作物长势图
{
    mapView.viewer.getManipulator().setViewpoint(33.5, 109, 0, 0, -90, 200000, 5);
}