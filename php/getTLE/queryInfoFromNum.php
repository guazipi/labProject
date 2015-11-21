<?php
/**
 * Created by chetLiu.
 * User: chet
 * Date: 15/8/18
 * Time: 13:46
 */
/**
 * 根据一个卫星的noradid编号数组去数据库中查询卫星的名称，然后组合成一个名称数组，返回。
 * 被使用于calCrossSatsFuncs.js
 */
$satNumArr = $_GET["satNumArr"];
// $satNumArr =array('37820','40118');
$con = mysql_connect("localhost", "chetde", "123456");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db("labtles", $con);

$satNameArr = array();

while ($elem = each($satNumArr)) {
    $satnum=(float)$elem["value"];
    $queryString = "select satName from satsDetail where satNum='$satnum'";

    $queryResult = mysql_query($queryString, $con);

    if (!$queryResult) {
        die('Error: ' . mysql_error());
    }
    $middleResult=mysql_fetch_assoc($queryResult);
    $satNameArr[]= $middleResult['satName'];
}

echo json_encode($satNameArr);

mysql_close($con);