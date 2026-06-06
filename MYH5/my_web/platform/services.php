<?php
//echo '{"serverOpenTime":1563379200}';
header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');

require_once dirname(__FILE__)."/lwdb.php";
require_once 'config.php';

$serverId = $_GET['serverId'];
sql_connect($GLOBALS['p_db_host'], $GLOBALS['p_db_name'], $GLOBALS['p_db_user'], $GLOBALS['p_db_psd']);
$sql = "select UNIX_TIMESTAMP(`openTime`) as serverOpenTime from cfg_server where id = '{$serverId}'";
$serverInfo = sql_fetch_one($sql);
if(empty($serverInfo))
{
 exit();
}
echo json_encode($serverInfo);