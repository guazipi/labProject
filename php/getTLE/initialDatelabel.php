<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/25
 * Time: 22:11
 */
$noradNum = $_POST ["noradNum"];
//$noradNum=37820;
$con = mysql_connect("localhost", "chetde", "123456");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db("labtles", $con);

$queryString = "SELECT tleLine1 FROM satsinfo WHERE satNum='$noradNum'";
$queryResult = mysql_query($queryString, $con);

if (!$queryResult) {
    die('Error: ' . mysql_error());
}


$tleLine1 = mysql_fetch_assoc($queryResult)['tleLine1'];
$getOnEpoch = (float)substr($tleLine1, 18, 14);
mysql_close($con);
echo $getOnEpoch;