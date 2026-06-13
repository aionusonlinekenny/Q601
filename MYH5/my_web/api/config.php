<?php
// pdo mysql
//error_reporting ( 0 );
session_start ();
header("Content-Type: text/html;charset=utf-8");
header("Access-Control-Allow-Origin:*");
date_default_timezone_set('prc');
// mysql 连接
$conn = @mysql_connect ( '127.0.0.1', 'root', '123456' ) or die ( "数据库连接失败,请联系管理员！" );
mysql_select_db ( 'myh5_pl', $conn );
mysql_query ( "SET NAMES utf8" );
//==============
$clientip = 'http://106.12.121.18:81/myh5_cilent/';
//==============
// 公共函数调用
function getstr($str) {
 if (isset ( $_GET [$str] )) {
  return $_GET [$str];
 }
 die ( '{"code":0,"msg":"参数错误"}' );
}

function poststr($str) {
 if (isset ( $_POST [$str] )) {
  return $_POST [$str];
 }
 die ( '{"code":0,"msg":"参数错误"}' );
}