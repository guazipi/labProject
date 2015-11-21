<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/2
 * Time: 20:50
 */
require 'initializeVar.php';

$con = mysql_connect("localhost", "chetde", "123456");
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db("labtles", $con);

$recordAddedNum = 0;

foreach ($satsnumers as $satNum) {
    //landsat1和landsat2的编号是0开头，所以要转化一下
    //"06126"(string)==>6126(int)==>"6126"(string)
    $satNum = (int)$satNum;
    $satNum = (string)$satNum;

    $isupdated = 0;

    $updatedb = "UPDATE satsinfo SET isupdated='$isupdated' WHERE satNum='$satNum'";

    //更新数据到选中数据库中的某个表
    if (!mysql_query($updatedb, $con)) {
        die('Error: ' . mysql_error());
    }


    $recordAddedNum += 1;
    echo $recordAddedNum;
    echo "record updated";
    echo "\n";
}

mysql_close($con);
