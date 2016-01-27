<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/25
 * Time: 22:11
 */
include 'config.php';
//$noradNum = $_POST ["noradNum"];
$noradNum=37820;
$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db($mysql_dbname, $con);

$queryString = "SELECT tleLine1 FROM satsinfo WHERE satNum='$noradNum'";
$queryResult = mysql_query($queryString, $con);

if (!$queryResult) {
    die('Error: ' . mysql_error());
}


//$tleLine1 = mysql_fetch_assoc($queryResult)['tleLine1'];//怀疑问题就出在这里，版本不同导致有些写法的兼容性不同
$tleLine1 = mysql_fetch_assoc($queryResult);
//echo $tleLine1[0];
//var_dump($tleLine1['tleLine1']);
$tleLine1Str=$tleLine1['tleLine1'];
$getOnEpoch = (float)substr($tleLine1Str, 18, 14);
//$getOnEpoch = (float)substr($tleLine1, 18, 14);

echo $getOnEpoch;
mysql_close($con);

//<?php
///**
// * Created by PhpStorm.
// * User: chet
// * Date: 15/7/25
// * Time: 22:11
// */
//
//include 'config.php';
//require 'initializeVar.php';
////$noradNum = $_POST ["noradNum"];
//$noradNum=37820;
//$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
//if (!$con) {
//    die('Could not connect: ' . mysql_error());
//}
////选中某个数据库
//mysql_select_db($mysql_dbname, $con);
//
//
//$queryString = "SELECT tleLine1 FROM satsinfo WHERE satNum='$noradNum'";
////$queryString = "select tleLine1 from satsinfo where satNum='$innerSatsNum[3]'";
// //$queryString="select tleLine0,tleLine1,tleLine2 from satsinfo where satNum='$satNum'";
//$queryResult = mysql_query($queryString, $con);
//
//if (!$queryResult) {
//    die('Error: ' . mysql_error());
//}
//
////echo "imhere";
//
//$tleLine1 = mysql_fetch_assoc($queryResult);
////echo $tleLine1[0];
////var_dump($tleLine1['tleLine1']);
//$tleLine1Str=$tleLine1['tleLine1'];
//$getOnEpoch = (float)substr($tleLine1Str, 18, 14);
//echo $getOnEpoch;
///* $returnTLE=array();
//$returnTLE[]=$getOnEpoch; */
//
////echo json_encode($returnTLE);
////echo $returnTLE;
//mysql_close($con);
