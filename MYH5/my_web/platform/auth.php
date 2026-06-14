<?php
header ( 'Cache-Control:no-cache,must-revalidate' );
header ( 'Pragma:no-cache' );
header ( "Expires:0" );
header ( 'Content-Type:text/html; charset=utf-8' );
header ( "Access-Control-Allow-Origin: *" );

require_once 'channel.php';
require_once 'Utils.php';

$channel = 0;
if (isset ( $_GET ["channel"] )) {
 $channel = intval ( $_GET ["channel"] );
}

$appId = '';
if (isset ( $_GET ["appId"] )) {
 $appId = $_GET ["appId"];
}

$userId = '';
if (isset ( $_GET ["userId"] )) {
 $userId = strval ( $_GET ["userId"] );
} else {
 $arr = array (
  'code' => 1,
  'errmsg' => 'No account information received'
 );
 echo json_encode ( $arr );
 exit ();
}

$passWord = $userId;
if (isset ( $_GET ["passWord"] )) {
 $passWord = $_GET ["passWord"];
}

$time = 0;
$tstamp = 0;
if (isset ( $_GET ["time"] )) {
 $time = $_GET ["time"];
 $tstamp = $time;
}
if ($tstamp == 0) {
 $tstamp = time ();
}

$now = time ();
if ($now - $time > 86400) {
 $arr = array (
  'code' => 1,
  'errmsg' => 'Login failed, session expired'
 );
 echo json_encode ( $arr );
 exit ();
}

$token = "";
if (isset ( $_GET ["token"] )) {
 $token = $_GET ["token"];
}

$sign = "";
if (isset ( $_GET ["sign"] )) {
 $sign = $_GET ["sign"];
}

$code = 0;
$devid = '';
$userId_len = strlen ( $userId );
$password_len = strlen ( $passWord );

if (strpos ( $userId, 'undefined' ) === false && strpos ( $userId, 'null' ) === false) {
} else {
 $arr = array (
  'code' => 2,
  'errmsg' => 'Account info is invalid'
 );
 echo json_encode ( $arr );
 exit ();
}

// ---------------------------------------
// 要先检查帐号和密码等字符串的合法性
// ---------------------------------------
// 上士平台不需要验证长度
if ($userId_len < 4 || $userId_len > 64) {
 $arr = array (
  'code' => 3,
  'errmsg' => 'Account length must be 4-64 characters'
 );
 echo json_encode ( $arr );
 exit ();
}

if ($password_len < 1 || $password_len > 64) {
 $arr = array (
  'code' => 4,
  'errmsg' => 'Password length must be 1-64 characters'
 );
 echo json_encode ( $arr );
 exit ();
}

// ---------------------------------------
// error_log("channel:".$channel);
if ($channel == TW_CHANNEL) {
 // 已经测试通过
 // uid+appid+time+login_key
 $checkSign = md5 ( $userId . $appId . $time . TW_LOGIN_KEY );
 if ($sign != $checkSign) {
  $arr = array (
   'code' => 5,
   'errmsg' => 'tw-verification error'
  );
  echo json_encode ( $arr );
  exit ();
 }
} else {
 exit ( "channel undefined" );
}

$code = 0;
// ---------------------------------------
// 输出信息给客户端
$identityId = $userId;
$sign = strtoupper ( md5 ( '' . $identityId . $time . 'ABC123' ) );
$arr = array (
 'code' => $code,
 'identityId' => '' . $userId,
 'identityName' => $userId,
 'userId' => '' . $userId,
 'userName' => $userId,
 'tstamp' => $time,
 'sign' => $sign 
);
echo json_encode ( $arr );
// ---------------------------------------

?>