<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/25
 * Time: 17:07
 */
//国内所有卫星
$innerSatsNum = array(
    "GAOFEN-1" => "39150",
    "GAOFEN-2" => "40118",
    "GAOFEN-8" => "40701",
    "TIANGONG-1" => "37820",
    "HUANJING-1A-(HJ-1A)" => "33320",
    "HUANJING-1B-(HJ-1B)" => "33321",
    "HUANJING-1C-(HJ-1C)" => "38997",
    "CBERS-1-(ZY-1A)" => "25940",
    "CBERS-2-(ZY-1B)" => "28057",
    "CBERS-2B" => "32062",
    "CBERS-4" => "40336",
    "JB-3-1-(ZY-2A)" => "26481",
//    "JB-3-2-(ZY-2B)" => "27550",
    "JB-3-3-(ZY-2C)" => "28470",
    "ZIYUAN-1-02C-(ZY-1-02C)" => "38038",
    "ZIYUAN-3(ZY-3)" => "38046",
    "HAIYANG-1A" => "27430",
    "HAIYANG-1B" => "31113",
    "HAIYANG-2A" => "37781"
);
$tiangong = array("TIANGONG-1" => "37820");
$gaofenSet = array(
    "GAOFEN-1" => "39150",
    "GAOFEN-2" => "40118",
    "GAOFEN-8" => "40701"
);
$HJSet = array(
    "HUANJING-1A-(HJ-1A)" => "33320",
    "HUANJING-1B-(HJ-1B)" => "33321",
    "HUANJING-1C-(HJ-1C)" => "38997");
$CBERSSet = array(
    "CBERS-1-(ZY-1A)" => "25940",
    "CBERS-2-(ZY-1B)" => "28057",
    "CBERS-2B" => "32062",
    "CBERS-4" => "40336");
$ZYSet = array(
    "JB-3-1-(ZY-2A)" => "26481",
//    "JB-3-2-(ZY-2B)" => "27550",
    "JB-3-3-(ZY-2C)" => "28470",
    "ZIYUAN-1-02C-(ZY-1-02C)" => "38038",
    "ZIYUAN-3(ZY-3)" => "38046");
$HAIYANGSet = array(
    "HAIYANG-1A" => "27430",
    "HAIYANG-1B" => "31113",
    "HAIYANG-2A" => "37781");

//国外所有卫星
$foreignSats = array(
    "SPOT-1" => "16613",
    "SPOT-2" => "20436",
    "SPOT-3" => "22823",
    "SPOT-4" => "25260",
    "SPOT-5" => "27421",
    "SPOT-6" => "38755",
    "SPOT-7" => "40053",
    "LANDSAT-1-(ERTS-1)" => "06126",
    "LANDSAT-2" => "07615",
    "LANDSAT-3" => "10702",
    "LANDSAT-4" => "13367",
    "LANDSAT-5" => "14780",
    "LANDSAT-7" => "25682",
    "LANDSAT-8" => "39084",
    "TERRA" => "25994",
    "ALOS-(DAICHI)" => "28931",
    "ALOS-2" => "39766",
    "THEOS" => "33396",
    "IRS-1A" => "18960",
    "IRS-1B" => "21688",
    "IRS-P2" => "23323",
    "IRS-1C" => "23751",
    "IRS-P3" => "23827",
    "IRS-1D" => "24971",
    "IRS-P4-(OCEANSAT-1)" => "25758",
    "IRS-P6-(RESOURCESAT-1)" => "28051",
    "IRS-P5-(CARTOSAT-1)" => "28649",
    "CARTOSAT-2-(IRS-P7)" => "29710",
    "ERS-1" => "21574",
    "ERS-2" => "23560",
    "ENVISAT" => "27386",
    "RADARSAT-1" => "23710",
    "RADARSAT-2" => "32382");
$LandSatSet = array(
    "LANDSAT-1-(ERTS-1)" => "06126",
    "LANDSAT-2" => "07615",
    "LANDSAT-3" => "10702",
    "LANDSAT-4" => "13367",
    "LANDSAT-5" => "14780",
    "LANDSAT-7" => "25682",
    "LANDSAT-8" => "39084");
$IRSSet = array(
    "IRS-1A" => "18960",
    "IRS-1B" => "21688",
    "IRS-P2" => "23323",
    "IRS-1C" => "23751",
    "IRS-P3" => "23827",
    "IRS-1D" => "24971",
    "IRS-P4-(OCEANSAT-1)" => "25758",
    "IRS-P6-(RESOURCESAT-1)" => "28051",
    "IRS-P5-(CARTOSAT-1)" => "28649",
    "CARTOSAT-2-(IRS-P7)" => "29710");
$ESASet = array(
    "ERS-1" => "21574",
    "ERS-2" => "23560",
    "ENVISAT" => "27386");
$CASet = array(
    "RADARSAT-1" => "23710",
    "RADARSAT-2" => "32382");
$SPOTSet = array(
    "SPOT-1" => "16613",
    "SPOT-2" => "20436",
    "SPOT-3" => "22823",
    "SPOT-4" => "25260",
    "SPOT-5" => "27421",
    "SPOT-6" => "38755",
    "SPOT-7" => "40053");
$TERRA = array("TERRA" => "25994");
$ALOSSet = array(
    "ALOS-(DAICHI)" => "28931",
    "ALOS-2" => "39766");
$THEOS = array("THEOS" => "33396");


$satsnumers = array(
    "GAOFEN-1" => "39150",
    "GAOFEN-2" => "40118",
    "GAOFEN-8" => "40701",
    "TIANGONG-1" => "37820",
    "HUANJING-1A-(HJ-1A)" => "33320",
    "HUANJING-1B-(HJ-1B)" => "33321",
    "HUANJING-1C-(HJ-1C)" => "38997",
    "CBERS-1-(ZY-1A)" => "25940",
    "CBERS-2-(ZY-1B)" => "28057",
    "CBERS-2B" => "32062",
    "CBERS-4" => "40336",
    "JB-3-1-(ZY-2A)" => "26481",
//    "JB-3-2-(ZY-2B)" => "27550",
    "JB-3-3-(ZY-2C)" => "28470",
    "ZIYUAN-1-02C-(ZY-1-02C)" => "38038",
    "ZIYUAN-3(ZY-3)" => "38046",
    "HAIYANG-1A" => "27430",
    "HAIYANG-1B" => "31113",
    "HAIYANG-2A" => "37781",
    "SPOT-1" => "16613",
    "SPOT-2" => "20436",
    "SPOT-3" => "22823",
    "SPOT-4" => "25260",
    "SPOT-5" => "27421",
    "SPOT-6" => "38755",
    "SPOT-7" => "40053",
    "LANDSAT-1-(ERTS-1)" => "06126",
    "LANDSAT-2" => "07615",
    "LANDSAT-3" => "10702",
    "LANDSAT-4" => "13367",
    "LANDSAT-5" => "14780",
    "LANDSAT-7" => "25682",
    "LANDSAT-8" => "39084",
    "TERRA" => "25994",
    "ALOS-(DAICHI)" => "28931",
    "ALOS-2" => "39766",
    "THEOS" => "33396",
    "IRS-1A" => "18960",
    "IRS-1B" => "21688",
    "IRS-P2" => "23323",
    "IRS-1C" => "23751",
    "IRS-P3" => "23827",
    "IRS-1D" => "24971",
    "IRS-P4-(OCEANSAT-1)" => "25758",
    "IRS-P6-(RESOURCESAT-1)" => "28051",
    "IRS-P5-(CARTOSAT-1)" => "28649",
    "CARTOSAT-2-(IRS-P7)" => "29710",
    "ERS-1" => "21574",
    "ERS-2" => "23560",
    "ENVISAT" => "27386",
    "RADARSAT-1" => "23710",
    "RADARSAT-2" => "32382");