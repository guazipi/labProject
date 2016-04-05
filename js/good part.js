/**
 * Created by chet on 16/4/4.
 */

var initialize = function () {
    //常见的是返回一个拥有多种功能的对象
    //如果是单一的功能,可能就附加到其他对象上了
}();

var initialized = function () {

};
var iii = initialized();
//iii.***
//这样组织的原因是把相关的函数变量或者只用一次的,中间的函数都整理到一个大的函数对象内部,便于组织管理也便于访问,
//感觉自己在将一个功能的代码搞到一块的能力还有点欠缺的.

//最好的是将所有的代码都整理为对象的形式,整个项目的入口其实也只有一个$(document).ready(function () {})或者onload两个,
// 这两个一般都是比较简洁的写法了(一两句代码就把功能实现了),更多的东西是在这些简洁的东西后面

//拿到一个功能需求，在感觉不能完全把握下手时，就是不能了然于心，那就先完成一点是一点，遇到问题解决问题，突然你就豁然开朗了
// 先初始化成两个函数,把功能实现再说,然后再去完善这个功能,让他更全面些,有头有尾巴

//
//匿名函数的自执行
//
//var changeBalloon=function(balloonViewModel, clickposition){
//    if (balloonViewModel) {
//        if ('position' in balloonViewModel) {
//            if (balloonViewModel.position && clickposition) {
//                var cart2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, clickposition);
//                balloonViewModel.position = cart2;
//                balloonViewModel.update();
//            }
//        }
//    }
//}(balloonViewModel, clickposition);