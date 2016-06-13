<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/13
 * Time: 10:10
 */
header("Access-Control-Allow-Origin: *");
$inSR =$_POST['inSR'];
$returnDistinctValues =$_POST['returnDistinctValues'];
$where =$_POST['where'];
$f =$_POST['f'];
$geometry =$_POST['geometry'];
$outFields =$_POST['outFields'];
$spatialRel =$_POST['spatialRel'];
$returnGeometry =$_POST['returnGeometry'];
$geometryType =$_POST['geometryType'];
$maxAllowableOffset =$_POST['maxAllowableOffset'];

$time =$post_data = array();
//$.post("http://10.103.2.159:8090/labProject/php/getTLE/", {
//                //$.post("/ceode/ArcGIS/rest/services/ids_c_SPOT1_v/MapServer/0/query", {
//            //$.post("http://ids.ceode.ac.cn/ArcGIS/rest/services/ids_c_SPOT1_v/MapServer/0/query", {
//                'inSR': 4326,
//                'returnDistinctValues': false,
//                'where': time,
//                'f': 'json',
//                'geometry': geo,
//                'outFields': '*',
//                'spatialRel': 'esriSpatialRelIntersects',
//                'returnGeometry': true,
//                'geometryType': type,
//                'maxAllowableOffset': 100
//            }, function (data, testStatus) {

$post_data ['inSR'] = $inSR;
$post_data ['returnDistinctValues'] = $returnDistinctValues;
$post_data ['where'] =$where;
$post_data ['f'] = $f;
$post_data ['geometry'] = $geometry;
$post_data ['outFields'] = $outFields;
$post_data ['spatialRel'] = $spatialRel;
$post_data ['returnGeometry'] =$returnGeometry;
$post_data ['geometryType'] = $geometryType;
$post_data ['maxAllowableOffset'] = $maxAllowableOffset;
$url = "http://ids.ceode.ac.cn/ArcGIS/rest/services/ids_c_SPOT1_v/MapServer/0/query";

function do_post_request($url, $data, $optional_headers = null)
{
    $params = array('http' => array(
        'method' => 'POST',
        'content' => $data
    ));
    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }
//    $ctx = stream_context_create($params);
//    $fp = @fopen($url, 'rb', false, $ctx);
//    if (!$fp) {
//        throw new Exception("Problem with $url, $php_errormsg");
//    }
//    $response = @stream_get_contents($fp);
//    if ($response === false) {
//        throw new Exception("Problem reading data from $url, $php_errormsg");
//    }
//    return $response;
    $context = stream_context_create($params);
    $result = file_get_contents($url, false, $context);

    return $result;
}
function post($url, $post_data = '', $timeout = 50){//curl

    $ch = curl_init();

    curl_setopt ($ch, CURLOPT_URL, $url);

    curl_setopt ($ch, CURLOPT_POST, 1);

    if($post_data != ''){

        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);

    }

    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

    curl_setopt($ch, CURLOPT_HEADER, false);

    $file_contents = curl_exec($ch);

    curl_close($ch);

    return $file_contents;

}
$response=post($url, $post_data);
//$response = do_post_request($url, $post_data);
echo $response;