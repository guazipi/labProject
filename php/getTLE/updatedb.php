<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/25
 * Time: 14:52
 */

//即使Client断开(如关掉浏览器)，PHP脚本也可以继续执行.
//ignore_user_abort();
////执行时间为无限制，php默认的执行时间是30秒，通过set_time_limit(0)可以让程序无限制的执行下去
//set_time_limit(0);
////每隔5分钟运行
//$interval = 60 * 60 * 24;
//do {
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
 * 从sapcetrack中获得最新的资源3号的最新更新的时间，
 * 然后拿这个最新的时间和从客户端提交的时间比较，
 * 客户端提交的更新时间是从数据库中查询到的天宫一号的更新时间，
 * 两者对比就可以决定是否去更新卫星数据
 */
$spacetrack->changeApikey($api, 38046);
$req_data = $spacetrack->api_call($api, $postdata, $decode);
$length = strlen($req_data);
//将请求的数据字符串两端的中括号（[]）去掉，以便于进行下一步计算
$str5 = substr($req_data, 1, $length - 2);
$reqdataObj = json_decode($str5, true);
$tleLine1 = $reqdataObj["TLE_LINE1"];

$getOnEpoch = (float)substr($tleLine1, 18, 14);

/**
 * $satsnumers:含有卫星norad编号的数组
 * $satNum；含有卫星norad编号的数组$satsnumers中的一个值
 */
foreach ($satsnumers as $satNum) {
    $satNum = (int)$satNum;
    $satNum = (string)$satNum;


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

    updateSth($reqdataObj, $con);

//            $affectedRows += mysql_affected_rows();

    $recordAddedNum += 1;
    echo $recordAddedNum;

    echo "record updated";
    echo "\n";
}
mysql_close($con);
//    /**
//     * @param $reqdataArray
//     * 向spacetrack请求到的数据经过处理后的一个数组
//     * @param $connect
//     * 数据库连接对象
//     */
//    function updateSth($reqdataArray, $connect)
//    {
//        //准备要更新到数据库的数据
//        $satNum = $reqdataArray['NORAD_CAT_ID'];
//        $tleLine1 = $reqdataArray["TLE_LINE1"];
//        $tleLine2 = $reqdataArray["TLE_LINE2"];
//        $isupdated = 1;
//
//        $updatedb = "UPDATE satsinfo SET tleLine1='$tleLine1',tleLine2='$tleLine2',isupdated='$isupdated' WHERE satNum='$satNum'";
//
//        //更新数据到选中数据库中的某个表
//        if (!mysql_query($updatedb, $connect)) {
//            die('Error: ' . mysql_error());
//        }
//    }

//按设置的时间等待24个小时循环执行
//sleep($interval);
//} while (true);
/**
 * @param $reqdataArray
 * 向spacetrack请求到的数据经过处理后的一个数组
 * @param $connect
 * 数据库连接对象
 */
function updateSth($reqdataArray, $connect)
{
    //准备要更新到数据库的数据
    $satNum = $reqdataArray['NORAD_CAT_ID'];
    $tleLine1 = $reqdataArray["TLE_LINE1"];
    $tleLine2 = $reqdataArray["TLE_LINE2"];
    $isupdated = 1;

    $updatedb = "UPDATE satsinfo SET tleLine1='$tleLine1',tleLine2='$tleLine2',isupdated='$isupdated' WHERE satNum='$satNum'";

    //更新数据到选中数据库中的某个表
    if (!mysql_query($updatedb, $connect)) {
        die('Error: ' . mysql_error());
    }
}
