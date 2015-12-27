<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/2
 * Time: 17:09
 */
include 'config.php';
require 'initializeVar.php';
$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db($mysql_dbname, $con);


$updatedNum = 0;

foreach ($satsnumers as $satNum) {
    $satNum = (int)$satNum;
    $satNum = (string)$satNum;

    $queryString = "select isupdated from satsinfo where satNum='$satNum'";
    $queryResult = mysql_query($queryString, $con);
    if (!$queryResult) {
        die('Error: ' . mysql_error());
    }

    $middleResult = mysql_fetch_assoc($queryResult);
    $updatedNum += $middleResult['isupdated'];

}
$numArray = array($updatedNum, count($satsnumers));
echo json_encode($numArray);


mysql_close($con);