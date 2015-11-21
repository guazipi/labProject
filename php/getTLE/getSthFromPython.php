<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/8/13
 * Time: 09:38
 */
//system('python ../../python/test.py 123');
$pointA = $_GET["pointA"];
$pointB = $_GET["pointB"];
$distance=$_GET["distance"];
//$pointA = array(-5202210.559014506, 1994607.3339636736, (-3094293.1584207197));
//$pointB = array(-5198621.798053595, 1994341.8700860739, (-3100448.0659037554));
//$distance = 600000;
//echo $pointA[0];

exec("python ../../python/fsolve.py '$pointA[0]' '$pointA[1]'  '$pointA[2]'  '$pointB[0]'  '$pointB[1]'  '$pointB[2]' '$distance'", $array, $ret);

//$arrayLeng = count($array[0]);//php中计算数组长度用count函数或者sizeof函数
if(count($array)==1){
    echo json_encode($array);
    //echo $array[0];
}else if(count($array)>1){
    for($i=0;$i<count($array);$i++){
        echo json_encode($array[i]);
    }
}else{
    echo "没有结果";
    //echo("ret is $ret");
}




