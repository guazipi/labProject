<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/21
 * Time: 13:37
 */
$baseurl = 'https://www.space-track.org/auth/login';
$username = 'html52014@126.com';
$password = 'nimeidecesiumorbit';
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $baseurl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
//curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    "identity=" . $username
    . "&password=" . $password
);


$contents = curl_exec($ch);
curl_close($ch);
print $contents;

function get_content($url,$postinfo){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postinfo);
    $response  = curl_exec($ch);
    curl_close($ch);
    return $response;
}