/**
 * Created by chet on 15/7/24.
 */
/**
 * 加载准备好的图层到球体上，并控制各个图层初始不显示
 * @param data
 * @param datatype
 */
function addLayerToMap(data, datatype) {
    //var dataroot = "http://10.2.4.1:81/wwwroot/Earth_Data/";
    var dataroot = "/Earth_Data/";
    for (var i = 0; i < data.length; ++i) {
        var layers = viewer.scene.imageryLayers;
        dataImageLayer.push(layers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
            url: dataroot + data[i],
            fileExtension: datatype[i],
            //此时proxy不太管用，cesium针对apache没有什么好的方法，这里采用的时apche设置代理解决跨域访问的问题
            //proxy: new Cesium.DefaultProxy('http://cesiumjs.org/proxy/')
        })));
    }
    /**
     * 使用each函数控制初始均不显示各个图层。
     * each操作一个数组的demo
     */
        //var arr1 = [ "aaa", "bbb", "ccc" ];
        //$.each(arr1, function(i,val){
        //    alert(i);
        //    alert(val);
        //});
        //alert(i)将输出0，1，2
        //alert(val)将输出aaa，bbb，ccc
    $.each(dataImageLayer, function (i, val) {
        dataImageLayer[i].alpha = 0;
    });
}

/**
 * 准备要加载显示的图层
 */
function prepareLayers() {
    var data = Array();
    var datatype = Array();
    dataImageLayer = new Array();

    //全球底图。此全球底图加载时无配置文件tilemapresource.xml,所以加载时没有贴合地球本身的纹理
    var imagename = "world_png";
    data.push(imagename); //0
    datatype.push("png");

    /**
     * 全球空间变化信息
     * @type {string}
     */
        //2000中国区域叶面积指数
    imagename = "2000_china_lai_pcttorgb_png";
    data.push(imagename); //1
    datatype.push("png");

    //2005中国区域叶面积指数
    data.push("2005_china_lai_pcttorgb_png"); //2
    datatype.push("png");

    //2010中国区域叶面积指数
    data.push("2010_china_lai_pcttorgb_png"); //3
    datatype.push("png");

    //每日无云雪盖遥感（青藏高原地区MODIS）
    data.push("snow_no_cloud_png"); //4
    datatype.push("png");

    //全球大气CO2浓度变化
    data.push("summer2012_exported"); //5
    datatype.push("png");

    //全球植被FPAR数据
    imagename = "2006averageFPAR";
    data.push(imagename);   //6
    datatype.push("png");

    /**
     * 资源环境专题空间信息产品
     */
        //全球作物长势等级图
    data.push("global_arableland_crop_conditionrgb"); //7
    datatype.push("png");

    /**
     * 高性能计算
     */
        //2004年1月全球植被变化分析
    data.push("2004年1月全球植被变化分析"); //8
    datatype.push("png");

    //2008年5月中国北部地区沙尘分析
    data.push("2008nian5yuezhongguoshachebao"); //9
    datatype.push("png");

    addLayerToMap(data, datatype);
};
/**
 * 调节某一项的图层不显示
 * @param index
 * @param checked
 */
function disableAllLayers(index, checked) {
    for (var i = 0; i < dataImageLayer.length; ++i) {
        if (i != index)
            dataImageLayer[i].alpha = 0;
        else {
            dataImageLayer[i].alpha = 1;
            if (!checked) {
                dataImageLayer[i].alpha = 0;
            }
        }
    }
}

/**
 * 初始化datatree中的各个项
 */
function initializeDatatree(){
    $("#datatree").ligerTree({
        data: [
            {
                text: '基础图层', children: [
                {text: '影像'},
                {text: '矢量'},
                //{text: '地形'},
            ]
            },
            {
                text: '全球空间变化信息', children: [
                {text: '2000中国区域叶面积指数'},
                {text: '2005中国区域叶面积指数'},
                {text: '2010中国区域叶面积指数'},
                //{text: '青藏高原每日无云雪盖遥感'},
                //{text: '全球大气CO2浓度变化'},
                {text: '1982-2006年全球FPAR产品'},
                {text:'2006年全球年平均FPAR产品'}
            ]
            },
            //{
            //    text: '资源环境专题空间信息产品', children: [
            //    {text: '全球作物长势等级图'}
            //]
            //},
            //{
            //    text: '高性能计算', children: [
            //    {text: '2004年1月全球植被变化分析'},
            //    {text: '2008年5月中国北部地区沙尘分析'}
            //]
            //}
        ],
        nodeWidth: 190,
        onCheck: datatreeOnCheck,
        checkbox: false
    });
}
/**
 * datatree上点击某一项时发生的事情
 * @param note
 * @param checked
 */
function datatreeOnCheck(note, checked) {
alert("dkk");
    //var noteString = Array();
    ////noteString.push("全球底图");
    //noteString.push("影像");
    //
    //noteString.push("2000中国区域叶面积指数");
    //noteString.push("2005中国区域叶面积指数");
    //noteString.push("2010中国区域叶面积指数");
    //noteString.push("青藏高原每日无云雪盖遥感");
    //noteString.push("全球大气CO2浓度变化");
    //noteString.push("全球植被FPAR数据");
    //
    //noteString.push("全球作物长势等级图");
    //
    //noteString.push("2004年1月全球植被变化分析");
    //noteString.push("2008年5月中国北部地区沙尘分析");
    //
    //for (var i = 0; i < noteString.length; ++i) {
    //    if (note.data.text == noteString[i]) {
    //        disableAllLayers(i, checked);
    //        //$("#carousel").rcarousel("goToPage", i);
    //    }
    //}
}