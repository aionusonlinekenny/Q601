<?php
include 'api/config.php';
$channel = 10000;
$appId = 'tw';
$logotype = 'dev';
$userId = getstr ( 'username' );
$passWord = getstr ( 'token' );
$time = time ();
$token = $passWord;
$key = '01589fa97fc2eed7a4b0d4e0dad78793';
$sign = md5 ( $userId . $appId . $time . $key );
$ext = '';
$r = 1;
header ( "Location: {$clientip}?channel={$channel}&appid={$appId}&uid={$userId}&passWord={$passWord}&time={$time}&token={$token}&sign={$sign}&ext={$ext}&r=1&logotype={$logotype}" );
?>