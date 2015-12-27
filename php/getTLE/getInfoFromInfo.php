<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/1
 * Time: 10:54
 */
include 'config.php';
$satNoradID = $_GET["satNoradId"];
$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db($mysql_dbname, $con);


$returnTLE = array();

$queryString = "select satName,objectID,period,inclination,apogee,perigee from satsinfo where satNum='$satNoradID'";
$queryResult = mysql_query($queryString, $con);
if (!$queryResult) {
    die('Error: ' . mysql_error());
}

$middleResult = mysql_fetch_assoc($queryResult);
$satName = $middleResult['satName'];
$objectID = $middleResult['objectID'];
$period = $middleResult['period'];
$inclination = $middleResult['inclination'];
$apogee = $middleResult['apogee'];
$perigee = $middleResult['perigee'];



$returnTLE = array(
    'satName' => $satName,
    'objectID' => $objectID,
    'period' => $period,
    'inclination' => $inclination,
    'apogee' => $apogee,
    'perigee' => $perigee);

echo json_encode($returnTLE);

mysql_close($con);