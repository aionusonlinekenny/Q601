<?php

include 'config.php';
if (! $_POST) {
 exit ( '请求错误，请联系技术！' );
}
$checknum = trim ( poststr ( 'checknum' ) );
$quid = trim ( poststr ( 'qu' ) );
$uid = trim ( poststr ( 'uid' ) );
$qu = $quarr [$quid];
$dbname = $qu ['db_name'];
$gmurl = $qu ['gmurl'];
$time = date ( 'Y-m-d H:i:s' );
if ($checknum != $gmcode) {exit ( 'GM码不对' );}
if ($quid < 1) {exit ( '区号错误' );}
if ($uid == '') {exit ( '角色ID错误' );}
$sql = "SELECT * FROM $dbname.player WHERE identityName='" . $uid . "' and serverId ='" . $quid . "'";
$result = mysql_query ( $sql, $conn );
$row = mysql_fetch_array ( $result );
if ($row ['identityName'] != '') {
 $userid = $row ['identityId'];
 $username = $row ['name'];
} else {
 exit ( '角色不存在' );
}
if ($_POST ['type']) {
 $type = trim ( $_POST ['type'] );
 switch ($type) {
  case 'charge' :
   $goodsid = trim ( $_POST ['num'] );
   $a = explode ( '_', $goodsid );
   if ($a [0] <= 0 || $a [1] <= 0) {
    exit ( '充值项错误' );
   }
   $data = array (
    'channelId' => 10000,
    'roleId' => $userid,
    'serverId' => $quid,
    'orderId' => getMillisecond (),
    // 金额*100，为充值元宝数量
    'amount' => $a [1] * 100,
    'productId' => $a [0] 
   );
   $payurl = $gmurl . '/pay?';
   $msg = douge_post ( $payurl, $data );
   // SUCCESS
   if ($msg == 'SUCCESS') {
    exit ( "充值成功" );
   } else {
    exit ( "充值失败！！" );
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
     /**
      *
      * @var Ambiguous $c 再获取物品类型中的值
      */
     $citem = $bitem [0];
     $items = $citem . '_' . $itemnum;
    } else {
     exit ( '请输入数量！！' );
    }
   } else {
    exit ( '请选择物品！！' );
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
    exit ( "邮件发送成功" );
   } else {
    exit ( "邮件发送失败!" );
   }
   break;
  default :
   exit ( '系统异常，请重试!' );
   break;
 }
} else {
 exit ( '请求类型不存在！' );
}