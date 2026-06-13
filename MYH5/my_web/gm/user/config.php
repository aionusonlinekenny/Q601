<?php

error_reporting ( 0 );
header ( "Access-Control-Allow-Origin:*" ); // 跨域处理
header ( "Content-type: text/html; charset=utf-8" );
ini_set ( 'date.timezone', 'Asia/Shanghai' );
session_start ();
$quarr = array (
 '1' => array (
  'db_ip' => '134.22.38.31',
  'db_port' => 3306,
  'db_user' => 'root',
  'db_pswd' => '',
  'db_name' => 'myh5_s1',
  'gmurl' => 'http://134.22.38.31:8081/myh5'
 ),
 '2' => array (
  'db_ip' => '134.22.38.31',
  'db_port' => 3306,
  'db_user' => 'root',
  'db_pswd' => '',
  'db_name' => 'myh5_s2',
  'gmurl' => 'http://134.22.38.31:8082/myh5'
 ),
 '3' => array (
  'db_ip' => '134.22.38.31',
  'db_port' => 3306,
  'db_user' => 'root',
  'db_pswd' => '',
  'db_name' => 'myh5_s3',
  'gmurl' => 'http://134.22.38.31:8083/myh5'
 ) 
);
$gmcode = 'syymw.com';//GM码
$mailkey='ddgg5bjjflasd12345531';
$title='GM邮件';
$content='手游源码网-www.syymw.com';
/*
 * 数据库连接
 */
$conn = @mysql_connect ( '134.22.38.31', 'root', '123456' ) or die ( "数据库连接失败,请联系管理员！" );
mysql_select_db ( 'myh5_pl', $conn );
mysql_query ( "SET NAMES utf8" );
function poststr($str) {
 if (isset ( $_POST [$str] )) {
  return $_POST [$str];
 }
 die ( "this link server do not exist" );
}
/**
 * 后面跟参数的GET请求
 */
function douge_post($url = '', $param = '') {
 if (empty ( $url ) || empty ( $param )) {
  return false;
 }
 $postUrl = $url;
 $curlPost = $param;
 $ch = curl_init ();
 curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
 curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
 curl_setopt ( $ch, CURLOPT_HEADER, false );
 curl_setopt ( $ch, CURLOPT_URL, $postUrl );
 curl_setopt ( $ch, CURLOPT_POST, 1 );
 curl_setopt ( $ch, CURLOPT_POSTFIELDS, http_build_query ( $param ) );
 $data = curl_exec ( $ch );
 //$msg = json_decode ( $data, 1 );
 curl_close ( $ch );
 return $data;
}
function getMillisecond() {
 list ( $t1, $t2 ) = explode ( ' ', microtime () );
 return ( float ) sprintf ( '%.0f', (floatval ( $t1 ) + floatval ( $t2 )) * 1000 );
}