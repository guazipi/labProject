<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/1
 * Time: 10:53
 */
include 'config.php';
$satNoradID = $_GET["satNoradId"];
//$satNoradID =37820;
$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db($mysql_dbname, $con);


$returnTLE = array();

$queryString = "select satName,owner,launchDate,launchSitez,orbitType from satsDetail where satNum='$satNoradID'";

mysql_query('set names utf8', $con);

$queryResult = mysql_query($queryString, $con);



if (!$queryResult) {
    die('Error: ' . mysql_error());
}

$middleResult = mysql_fetch_assoc($queryResult);
$satName = $middleResult['satName'];
$owner = $middleResult['owner'];
$launchDate = $middleResult['launchDate'];
$launchSitez = $middleResult['launchSitez'];
$orbitType = $middleResult['orbitType'];


$returnTLE = array(
    'satName' => $satName,
    'owner' => $owner,
    'launchDate' => $launchDate,
    'launchSitez' => $launchSitez,
    'orbitType' => $orbitType);

echo json_encode($returnTLE,JSON_UNESCAPED_UNICODE);

mysql_close($con);