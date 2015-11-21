<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/21
 * Time: 10:21
 */
/** simple spacetrack API client script example using PHP/CLI scripting */
require 'spacetrack.php';
$satNum=$_POST ["satNumber"];
//$satNum=37820;
$spacetrack =spacetrack::getInstance();
$api='tle_latest';
$spacetrack->changeApikey($api,$satNum);
$postdata=null;
$decode=false;
$req_data = $spacetrack->api_call($api,$postdata,$decode);
header('HTTP/1.1 200 OK');
header('Content-Type: application/json');
//header('Access-Control-Allow-Origin: *');
echo json_encode($req_data);
//echo $req_data;
?>