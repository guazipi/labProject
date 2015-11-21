<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/2
 * Time: 10:35
 */
require 'initializeVar.php';
$satGroup = $_GET["satGroup"];
//$satGroup = "LandSatSet";
switch($satGroup){
    //所有卫星
    case 'allSats':
        $certainSatsNum=$satsnumers;
        break;
    //国内所有卫星
    case 'innerSats':
        $certainSatsNum= $innerSatsNum;
        break;
    //天宫一号
    case 'tiangong':
        $certainSatsNum=$tiangong;
        break;
    //高分系列
    case 'gaofenSet':
        $certainSatsNum=$gaofenSet;
        break;
    //环境卫星系列
    case 'HJSet':
        $certainSatsNum=$HJSet;
        break;
    //中巴资源卫星
    case 'CBERSSet':
        $certainSatsNum=$CBERSSet;
        break;
    //资源卫星系列
    case 'ZYSet':
        $certainSatsNum=$ZYSet;
        break;
    //海洋卫星系列
    case 'HAIYANGSet':
        $certainSatsNum=$HAIYANGSet;
        break;

    //国外所有卫星
    case 'foreignSats':
        $certainSatsNum=$foreignSats;
        break;

    //美国陆地卫星LANDSAT系列
    case 'LandSatSet':
        $certainSatsNum=$LandSatSet;
        break;

    //印度IRS系列
    case 'IRSSet':
        $certainSatsNum=$IRSSet;
        break;
    // 欧空局雷达卫星系列
    case 'ESASet':
        $certainSatsNum=$ESASet;
        break;
    //加拿大雷达卫星系列
    case 'CASet':
        $certainSatsNum=$CASet;
        break;
    //法国地球观测卫星SPOT系列
    case 'SPOTSet':
        $certainSatsNum=$SPOTSet;
        break;
    //TERRA卫星
    case 'TERRA':
        $certainSatsNum=$TERRA;
        break;
    //ALOS卫星系列
    case 'ALOSSet':
        $certainSatsNum=$ALOSSet;
        break;
    //THEOS卫星
    case 'THEOS':
        $certainSatsNum=$THEOS;
        break;
    default :
        alert("这是不可能出现的情况");
}






$con = mysql_connect("localhost", "chetde", "123456");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db("labtles", $con);


$returnTLE=array();

foreach ($certainSatsNum as $satNum) {
    $satNum=(int)$satNum;
    $satNum=(string)$satNum;

    $queryString="select tleLine0,tleLine1,tleLine2 from satsinfo where satNum='$satNum'";
//    $queryString="select tleLine0,tleLine1,tleLine2 from satsinfo where satNum='37820'";
    $queryResult = mysql_query($queryString, $con);
    if (!$queryResult) {
        die('Error: ' . mysql_error());
    }

    $middleResult=mysql_fetch_assoc($queryResult);
    $middleTleline0=$middleResult['tleLine0'];
    $tleLine0 =  substr($middleTleline0, 2, strlen($middleTleline0));;
    $tleLine1 = $middleResult['tleLine1'];
    $tleLine2 = $middleResult['tleLine2'];

    $aTLE=array($tleLine0,$tleLine1, $tleLine2 );

    $returnTLE[]=$aTLE;
}
echo json_encode($returnTLE);

mysql_close($con);