<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/25
 * Time: 14:52
 */
include 'config.php';
require 'spacetrack.php';
require 'initializeVar.php';

$con = mysql_connect($mysql_host, $mysql_username, $mysql_pwd);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
//选中某个数据库
mysql_select_db($mysql_dbname, $con);

$spacetrack = spacetrack::getInstance();
$api = 'tle_latest';
$postdata = null;
$decode = false;
$recordAddedNum = 0;

/**
 * $satsnumers:含有卫星norad编号的数组
 * $satNum；含有卫星norad编号的数组$satsnumers中的一个值
 */
foreach ($foreignSatsNum as $satNum) {

    $spacetrack->changeApikey($api, $satNum);
    $req_data = $spacetrack->api_call($api, $postdata, $decode);

    //json_decode函数处理后生成一个一个元素的数组，数组里面有个对象
    //$reqdataObj=json_decode($req_data);
    //$x=$reqdataObj[0]->ORDINAL;

    /**
     * 对得到的结果字符串处理了一下，剩下的直接json_decode之后生成一个json对象，
     * 可直接访问
     */
    $length = strlen($req_data);
    //将请求的数据字符串两端的中括号（[]）去掉，以便于进行下一步计算
    $str5 = substr($req_data, 1, $length - 2);

    //json_decode($data)输出的是对象,而json_decode("$arr",true)是把它强制生成PHP关联数组.
    //此时用含有参数true的函数是因为前者生成的是对象，无法直接以字符串的形式插入到数据库中
    $reqdataObj = json_decode($str5, true);
    //var_dump($jj['ORDINAL']);

    insertsth($reqdataObj, $con);
    $recordAddedNum += 1;
    echo $reqdataObj["OBJECT_NAME"];
    echo $recordAddedNum;
    echo "record added";
    echo "\n";
}
mysql_close($con);

/**
 * @param $reqdataArray
 * 向spacetrack请求到的数据经过处理后的一个数组
 * @param $connect
 * 数据库连接对象
 */
function insertsth($reqdataArray, $connect)
{
    //准备要插入到数据库的数据
    $satNum = $reqdataArray['NORAD_CAT_ID'];
    $satName = $reqdataArray["OBJECT_NAME"];
    $objectID = $reqdataArray["OBJECT_ID"];
    $objectType = $reqdataArray["OBJECT_TYPE"];
    $period = $reqdataArray["PERIOD"];
    $inclination = $reqdataArray["INCLINATION"];
    $apogee = $reqdataArray["APOGEE"];
    $perigee = $reqdataArray["PERIGEE"];
    $epoch = $reqdataArray["EPOCH"];
    $tleLine0 = $reqdataArray["TLE_LINE0"];
    $tleLine1 = $reqdataArray["TLE_LINE1"];
    $tleLine2 = $reqdataArray["TLE_LINE2"];
    $sql = "INSERT INTO satsinfo (satNum,satName,objectID,objectType,period,inclination,apogee,perigee,epoch,tleLine0,tleLine1,tleLine2)
VALUES ('$satNum','$satName','$objectID','$objectType','$period','$inclination','$apogee','$perigee','$epoch','$tleLine0','$tleLine1','$tleLine2')";
//$sql="INSERT INTO satsinfo (satNum,satName,objectID,objectType,period,inclination,apogee,perigee,epoch)
//VALUES ("+$reqdataObj["NORAD_CAT_ID"]+","+$reqdataObj["OBJECT_NAME"]+","+$reqdataObj["OBJECT_ID"]+","+
//    $reqdataObj["OBJECT_TYPE"]+","+$reqdataObj["PERIOD"]+","+$reqdataObj["INCLINATION"]+","+$reqdataObj["APOGEE"]+","+
//    $reqdataObj["PERIGEE"]+","+$reqdataObj["EPOCH"]+")";

    //插入数据到选中数据库中的某个表
    if (!mysql_query($sql, $connect)) {
        die('Error: ' . mysql_error());
    }
}


