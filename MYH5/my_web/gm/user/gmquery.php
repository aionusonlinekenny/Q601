<?php

include 'config.php';
if (! $_POST) {
 exit ( 'Request error, please contact support!' );
}
$checknum = trim ( poststr ( 'checknum' ) );
$quid = trim ( poststr ( 'qu' ) );
$uid = trim ( poststr ( 'uid' ) );
$qu = $quarr [$quid];
$dbname = $qu ['db_name'];
$gmurl = $qu ['gmurl'];
$time = date ( 'Y-m-d H:i:s' );
if ($checknum != $gmcode) {exit ( 'Invalid GM code' );}
if ($quid < 1) {exit ( 'Invalid zone ID' );}
if ($uid == '') {exit ( 'Character ID is required' );}
$sql = "SELECT * FROM $dbname.player WHERE identityName='" . $uid . "' and serverId ='" . $quid . "'";
$result = mysql_query ( $sql, $conn );
$row = mysql_fetch_array ( $result );
if ($row ['identityName'] != '') {
 $userid = $row ['identityId'];
 $username = $row ['name'];
} else {
 exit ( 'Character not found' );
}
if ($_POST ['type']) {
 $type = trim ( $_POST ['type'] );
 switch ($type) {
  case 'charge' :
   $goodsid = trim ( $_POST ['num'] );
   $a = explode ( '_', $goodsid );
   if ($a [0] <= 0 || $a [1] <= 0) {
    exit ( 'Invalid recharge item' );
   }
   $data = array (
    'channelId' => 10000,
    'roleId' => $userid,
    'serverId' => $quid,
    'orderId' => getMillisecond (),
    'amount' => $a [1] * 100,
    'productId' => $a [0]
   );
   $payurl = $gmurl . '/pay?';
   $msg = douge_post ( $payurl, $data );
   // SUCCESS
   if ($msg == 'SUCCESS') {
    exit ( "Recharge successful" );
   } else {
    exit ( "Recharge failed!" );
   }
   break;
  case 'daoju' :
   include 'itemgoods.php';
   $item = $_POST ['item'];
   $itemnum = $_POST ['num'];
   
   // 分割字符串
   if ($item != "") {
    
    if ($itemnum != "") {
     $bitem = $items [$item];
     $citem = $bitem [0];
     $items = $citem . '_' . $itemnum;
    } else {
     exit ( 'Please enter a quantity!' );
    }
   } else {
    exit ( 'Please select an item!' );
   }
   $data = array (
    'type' => 0, // 0单人邮件 1 全服邮件
    'title' => urlencode ( $title ),
    'content' => urlencode ( $content ),
    'itemStr' => $items,
    'time' => time (),
    'serverId' => $quid,
    'targetId' => $userid,
    'filterParam' => 0 
   );
   $data ['signstr'] = md5 ( $data ['type'] . $title . $content . $data ['itemStr'] . $data ['time'] . $mailkey );
   $mailurl = $gmurl . '/sendmail?';
   $msg = douge_post ( $mailurl, $data );
   $msg = json_decode ( $msg, 1 );
   // {"status":200}
   if ($msg ['status'] == 200) {
    exit ( "Mail sent successfully" );
   } else {
    exit ( "Mail send failed!" );
   }
   break;
  default :
   exit ( 'System error, please try again!' );
   break;
 }
} else {
 exit ( 'Unknown request type!' );
}