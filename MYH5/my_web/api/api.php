<?php
include 'config.php';
if ($_POST) {
 switch (poststr ('act')) {
  case 'login' :
   {
    $user = poststr ( 'username' );
    $pass = poststr ( 'passwd' );
    $sqlcx = "SELECT * FROM myh5_pl.user WHERE account = '$user'";
    $result = mysql_query ( $sqlcx, $conn );
    $row = mysql_fetch_array ( $result );
    if ($row ['account'] == $user && $row ['passwd'] == $pass) {
     $data = array ('code' => '1','msg' => 'success','token' => $pass,'user' => $user );
    } else {
     $data = array ('code' => '0','msg' => '账号或者密码错误!');
    }
    exit ( json_encode ( $data ) );
    break;
   }
  case 'reg' :
   {
    $user = poststr ( 'username' );
    $pass = poststr ( 'passwd' );
    if ($pass != '') {
     $sqlcx = "SELECT * FROM myh5_pl.user WHERE account = '$user'";
     $result = mysql_query ( $sqlcx, $conn );
     $row = mysql_fetch_array ( $result );
     if ($row ['account'] == $user) {
      $data = array ('code' => '0','msg' => '用户名已被注册!');
     } else {
      $datetime = date ( 'Y-m-d h:i:s' );
      $sqlcr = "INSERT INTO myh5_pl.user(account, passwd, createtime, updatetime, lastserver) VALUES ('$user', '$pass', '$datetime', '$datetime', '1')";
      $result = mysql_query ( $sqlcr, $conn );
      if ($result) {	
       $data = array ('code' => '1','msg' => 'success','token' => $pass,'user' => $user);
      } else {
       $data = array ('code' => '0','msg' => '注册账号失败!');
      }
     }
    } else {
     $data = array ('code' => '0','msg' => '密码不能空!');
    }
    exit ( json_encode ( $data ) );
    break;
   }
 }
}













