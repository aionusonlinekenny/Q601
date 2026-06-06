<?php
header('Cache-Control:no-cache,no-store,must-revalidate');
header('Pragma:no-cache');
header("Expires:0");
// 指定允许其他域名访问
header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');

require_once 'lwdb.php';
require_once 'config.php';
require_once 'channel.php';
require_once 'Utils.php';
//TW平台
//=========================================================

$is_white_ip = false;       //用户是否在IP白名单中
$is_white_account = false;  //用户是否在账号白名单中

$platformType = "dev";
if(isset($_GET['platform_type']) && empty($_GET['platform_type']) == false)
{
 $platformType = $_GET['platform_type'];
}

$roleId = '';
if(isset($_GET['roleId']))
{
 $roleId = $_GET['roleId'];
}

$ip_white_list = IP_WHITE_LIST_TW;
$ip = $_SERVER['REMOTE_ADDR'];
if(stripos($ip_white_list, $ip) != false)
{
 $is_white_ip = true;
}


if($roleId != "" && Utils::CheckWhileAccount($roleId, ACCOUNT_WHITE_LIST_TW) != false)
{
 $is_white_account = true;
}

$list = array();
sql_connect($GLOBALS['p_db_host'], $GLOBALS['p_db_name'], $GLOBALS['p_db_user'], $GLOBALS['p_db_psd']);

$sql = "select count(*) from cfg_server where now()>= openTime and status>0 and status<=2";
if($is_white_ip || $is_white_account)
{
 $sql = "select count(*) from `cfg_server`";
}

$total_server_count = sql_fetch_one_cell($sql);
$list['total_server_count'] = intval($total_server_count);
//==========================================================================


//获取玩家登录记录，最多取7条
$role_data_db = Utils::getRoleDataDBName($roleId);
$sql = "select * from ".$role_data_db." where roleId = '$roleId' order by lastLoginTime desc LIMIT 0, 6";
$loginList = sql_fetch_rows($sql);
$list['serversList'] = array();
if(!empty($loginList))
{
 $list['newRole'] = 0;
 foreach($loginList as $d)
 {
  $sid = $d['sid'];
  $loginDays = $d['loginDays'];
  $lastLoginTime = $d['lastLoginTime'];
  $sql = "select * from cfg_server where id=$sid";
  $server = sql_fetch_one($sql);
  $server['loginDyas'] = $loginDays;
  $server['lastLoginTime'] = $lastLoginTime;
  $list['serversList'][] = $server;
 }
}else
{
 $list['newRole'] = 1;
 
 //获取自动开服设置信息
 $sql = "select * from auto_open_setting";
 $auto_setting = sql_fetch_one($sql);
 
 //获取同时开服数
 $open_server_num = intval($auto_setting['open_server_num']);
 if($open_server_num == 0) $open_server_num = 1;
 
 //获取已开服数量
 $sql = "select count(id) from cfg_server where status<=2 and status>0 and now()>= openTime";
 $total_open_num = intval(sql_fetch_one_cell($sql));
 
 $start = $total_open_num - $open_server_num;
 if($start < 0) $start = 0;
 //获取最近开的服人数最少的服
 $sql = "select * from cfg_server where now()>= openTime order by id asc limit $start, $open_server_num";
 $servers = sql_fetch_rows($sql);
 $min_count = 1000000;
 $min_count_sid = 0;
 foreach($servers as $server)
 {
  $id = $server['id'];
  $status = intval($server['status']);
  if($status != 1) continue;
  $sql = "select role_count from server_role_count where sid=$id";
  $role_count = intval(sql_fetch_one_cell($sql));
  if($role_count < $min_count)
  {
   $min_count = $role_count;
   $min_count_sid = $id;
  }
 }
 //如果最新同时开服中没有服正常开启，则选择最近的正常开服的服务器
 if($min_count_sid == 0)
 {
  $sql = "select max(id) from cfg_server where status=1 and now()>= openTime";
  $min_count_sid = intval(sql_fetch_one_cell($sql));
 }
 
 $sql = "select * from cfg_server where id=$min_count_sid";
 $server_list = sql_fetch_rows($sql);
 $server_list[0]['loginDays'] = 0;
 $server_list[0]['lastLoginTime'] = "0";
 $list['serversList'] = $server_list;
}
echo json_encode($list);
