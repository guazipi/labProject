<?php
/**
 * Created by PhpStorm.
 * User: chet
 * Date: 15/7/21
 * Time: 09:38
 */
require_once 'Services/SpaceTrack.php';

$st = new Services_SpaceTrack(
    array(
        'username' => 'html52014@126.com',
        'password' => 'nimeidecesiumorbit'
    )
);

try {
    $tle = $st->getLatestTLE(25544);
} catch (Services_SpaceTrack_Exception $e) {
    echo $e->getMessage();
}

echo $tle;