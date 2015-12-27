<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/26
 * Time: 11:37
 */
require 'initializeVar.php';

$con = mysql_connect("localhost", "chetde", "123456");
//$con = mysql_connect("localhost", "root");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db("labtles", $con);

$returnTLE=array();

foreach ($innerSatsNum as $satNum) {

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