<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/10/19
 * Time: 10:41
 */
$filesname="osgbData/Tile_+000_+003_L18_0.osgb";
$handle=fopen($filesname,"rb");
$contents=fread($handle,filesize($filesname));
//echo $contents;
//fclose($handle);
//echo json_encode($contents);
print_r(unpack("A",$contents));