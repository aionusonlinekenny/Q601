<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/api.php';

// ── Auth ──────────────────────────────────────────────────────────────────
if (isset($_POST['gm_login'])) {
    if ($_POST['password'] === GM_PASSWORD) {
        $_SESSION['gm_auth'] = true;
        $_SESSION['server_id'] = (int)(isset($_POST['server_id']) ? $_POST['server_id'] : 1);
    } else {
        $loginError = 'Wrong password.';
    }
}
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function payment_state() {
    if (!file_exists(PAYMENT_STATE_FILE)) {
        return array('payment_enabled' => true, 'original_packages' => null);
    }
    $d = @json_decode(file_get_contents(PAYMENT_STATE_FILE), true);
    return is_array($d) ? $d : array('payment_enabled' => true, 'original_packages' => null);
}
function save_payment_state($state) {
    file_put_contents(PAYMENT_STATE_FILE, json_encode($state, JSON_PRETTY_PRINT));
}
function paypal_config() {
    if (!file_exists(PAYPAL_CONFIG_FILE)) {
        return array('client_id' => '', 'secret' => '', 'mode' => 'sandbox');
    }
    $d = @json_decode(file_get_contents(PAYPAL_CONFIG_FILE), true);
    return is_array($d) ? $d : array('client_id' => '', 'secret' => '', 'mode' => 'sandbox');
}

// ── AJAX handlers ────────────────────────────────────────────────────────
$gmAuth = isset($_SESSION['gm_auth']) ? $_SESSION['gm_auth'] : false;
if (isset($_GET['ajax']) && $gmAuth) {
    header('Content-Type: application/json');
    $servers = unserialize(SERVERS);
    $sid     = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
    $dbName  = isset($servers[$sid]['db']) ? $servers[$sid]['db'] : DB_NAME;

    switch ($_GET['ajax']) {

        // ── DB diagnostic ─────────────────────────────────────────────────
        case 'db_test':
            $pdo = db_connect($dbName);
            if (!$pdo) {
                echo json_encode(array('ok' => false, 'error' => db_last_error(),
                    'hint' => 'Check DB_HOST, DB_USER, DB_PASS, DB_NAME in includes/config.php'));
                break;
            }
            $tables    = db_list_tables($dbName);
            $databases = db_list_databases();
            $detected  = db_find_player_table($dbName);
            $cols      = $detected ? db_describe($detected, $dbName) : array();
            $count     = 0;
            if ($detected) {
                $r = db_query("SELECT COUNT(*) AS c FROM `$detected`", array(), $dbName);
                $count = isset($r[0]['c']) ? (int)$r[0]['c'] : 0;
            }
            echo json_encode(array(
                'ok'         => true,
                'db'         => $dbName,
                'databases'  => $databases,
                'tables'     => $tables,
                'detected'   => $detected,
                'columns'    => $cols,
                'row_count'  => $count,
            ));
            break;

        // ── Account search ────────────────────────────────────────────────
        case 'accounts':
            $q     = trim(isset($_GET['q']) ? $_GET['q'] : '');
            $limit = min((int)(isset($_GET['limit']) ? $_GET['limit'] : 50), 500);
            $tbl   = DB_TABLE_PLAYER;

            // Check table exists; try auto-detect fallback
            $tables = db_list_tables($dbName);
            if (!in_array($tbl, $tables)) {
                $tbl = db_find_player_table($dbName);
            }
            if (!$tbl) {
                echo json_encode(array('ok' => false, 'data' => array(),
                    'error' => 'No player table found. DB error: ' . db_last_error()));
                break;
            }

            // Get column list to build flexible SELECT
            $cols = db_describe($tbl, $dbName);
            $colNames = array();
            foreach ($cols as $c) { $colNames[] = $c['Field']; }

            // Detect name/id column dynamically
            $idCol   = 'id';
            $nameCol = 'name';
            $idAlias   = '`id` AS playerId';
            $nameAlias = '`name` AS playerName';
            foreach ($colNames as $c) {
                if (in_array(strtolower($c), array('playerid', 'roleid'))) { $idCol = $c; $idAlias = "`$c` AS playerId"; }
                if (in_array(strtolower($c), array('playername', 'rolename'))) { $nameCol = $c; $nameAlias = "`$c` AS playerName"; }
            }

            // Build optional extra columns
            $extras = array();
            $extraMap = array('level'=>'level','lv'=>'level','viplevel'=>'vipLevel','vip'=>'vipLevel',
                              'gold'=>'gold','goldnum'=>'gold','jade'=>'jade','diamond'=>'jade',
                              'lastlogintime'=>'lastLoginTime','lastlogin'=>'lastLoginTime',
                              'onlinestate'=>'onlineState','online'=>'onlineState',
                              'createtime'=>'createTime','createdate'=>'createTime');
            $seen = array();
            foreach ($colNames as $c) {
                $key = strtolower($c);
                if (isset($extraMap[$key]) && !in_array($extraMap[$key], $seen)) {
                    $extras[] = "`$c` AS `" . $extraMap[$key] . "`";
                    $seen[] = $extraMap[$key];
                }
            }
            $sel = $idAlias . ', ' . $nameAlias . (count($extras) ? ', ' . implode(', ', $extras) : '');

            // Detect sort column
            $sortCol = in_array('lastLoginTime', $seen) ? '`lastLoginTime`' :
                       (in_array('lastlogintime', array_map('strtolower', $colNames)) ? '`lastlogintime`' : "`$idCol`");

            // LIMIT must be embedded as an integer literal — PDO binds it as a string which MySQL rejects
            $limitInt = (int)$limit;
            if ($q === '') {
                $rows = db_query("SELECT $sel FROM `$tbl` ORDER BY $sortCol DESC LIMIT $limitInt", array(), $dbName);
            } else {
                $rows = db_query("SELECT $sel FROM `$tbl` WHERE `$nameCol` LIKE ? OR `$idCol` = ? ORDER BY $sortCol DESC LIMIT $limitInt",
                    array("%$q%", $q), $dbName);
            }
            echo json_encode(array('ok' => true, 'table' => $tbl, 'data' => $rows ? $rows : array(),
                'error' => db_last_error()));
            break;

        // ── Player detail ─────────────────────────────────────────────────
        case 'player_detail':
            $pid = isset($_GET['pid']) ? $_GET['pid'] : '';
            $tbl = DB_TABLE_PLAYER;
            $tables = db_list_tables($dbName);
            if (!in_array($tbl, $tables)) { $tbl = db_find_player_table($dbName); }
            if (!$tbl) { echo json_encode(array('ok'=>false,'data'=>null)); break; }
            $row = db_query("SELECT * FROM `$tbl` WHERE `playerId`=? OR `roleId`=? OR `id`=? LIMIT 1",
                array($pid, $pid, $pid), $dbName);
            echo json_encode(array('ok' => true, 'data' => isset($row[0]) ? $row[0] : null));
            break;

        // ── Delete player ─────────────────────────────────────────────────
        case 'delete_player':
            $pid = isset($_POST['playerId']) ? trim($_POST['playerId']) : '';
            if (!$pid) { echo json_encode(array('ok' => false, 'msg' => 'Missing playerId')); break; }

            $pdo = db_connect($dbName);
            if (!$pdo) { echo json_encode(array('ok' => false, 'msg' => 'DB connect failed')); break; }

            // Detect player table
            $playerTbl = DB_TABLE_PLAYER;
            $allTables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array($playerTbl, $allTables)) {
                $playerTbl = db_find_player_table($dbName);
            }
            if (!$playerTbl) { echo json_encode(array('ok' => false, 'msg' => 'Player table not found')); break; }

            // Detect id/name columns in player table
            $cols = $pdo->query("DESCRIBE `$playerTbl`")->fetchAll(PDO::FETCH_COLUMN);
            $idCol = 'id';
            $nameCol = 'name';
            foreach ($cols as $c) {
                if (in_array(strtolower($c), array('playerid', 'roleid'))) $idCol = $c;
                if (in_array(strtolower($c), array('playername', 'rolename'))) $nameCol = $c;
            }

            // Look up player UUID if name given
            if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $pid)) {
                $stmt = $pdo->prepare("SELECT `$idCol` AS pid, `$nameCol` AS pname FROM `$playerTbl` WHERE `$nameCol` = ? LIMIT 1");
                $stmt->execute(array($pid));
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$row) { echo json_encode(array('ok' => false, 'msg' => 'Player not found: ' . $pid)); break; }
                $uuid = $row['pid'];
                $playerName = $pid;
            } else {
                $uuid = $pid;
                $stmt = $pdo->prepare("SELECT `$nameCol` AS pname FROM `$playerTbl` WHERE `$idCol` = ? LIMIT 1");
                $stmt->execute(array($uuid));
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $playerName = $row ? $row['pname'] : $uuid;
            }

            // Also look up identityName for this player (login account name)
            $identityName = null;
            try {
                $idnCols = $pdo->query("DESCRIBE `$playerTbl`")->fetchAll(PDO::FETCH_COLUMN);
                if (in_array('identityName', $idnCols)) {
                    $stmt = $pdo->prepare("SELECT identityName FROM `$playerTbl` WHERE `$idCol` = ? LIMIT 1");
                    $stmt->execute(array($uuid));
                    $irow = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($irow) $identityName = $irow['identityName'];
                }
            } catch (PDOException $e) { /* skip */ }

            // Delete from ALL tables that have a playerId or identityName column
            $deleted = array();
            $errors = array();
            foreach ($allTables as $tbl) {
                if ($tbl === $playerTbl) continue;
                try {
                    $tblCols = $pdo->query("DESCRIBE `$tbl`")->fetchAll(PDO::FETCH_COLUMN);
                    // Try playerId column
                    foreach ($tblCols as $tc) {
                        $tcl = strtolower($tc);
                        if ($tcl === 'playerid' || $tcl === 'player_id') {
                            $stmt = $pdo->prepare("DELETE FROM `$tbl` WHERE `$tc` = ?");
                            $stmt->execute(array($uuid));
                            $c = $stmt->rowCount();
                            if ($c > 0) $deleted[$tbl] = (isset($deleted[$tbl]) ? $deleted[$tbl] : 0) + $c;
                        }
                        if ($identityName && ($tcl === 'identityname' || $tcl === 'identity_name')) {
                            $stmt = $pdo->prepare("DELETE FROM `$tbl` WHERE `$tc` = ?");
                            $stmt->execute(array($identityName));
                            $c = $stmt->rowCount();
                            if ($c > 0) $deleted[$tbl . '(identity)'] = $c;
                        }
                    }
                } catch (PDOException $e) {
                    $errors[] = $tbl . ': ' . $e->getMessage();
                }
            }

            // Delete from player table last
            try {
                $stmt = $pdo->prepare("DELETE FROM `$playerTbl` WHERE `$idCol` = ?");
                $stmt->execute(array($uuid));
                $deleted[$playerTbl] = $stmt->rowCount();
            } catch (PDOException $e) {
                echo json_encode(array('ok' => false, 'msg' => 'Delete player failed: ' . $e->getMessage()));
                break;
            }

            // Also delete all characters with same identityName (alt chars on same account)
            if ($identityName) {
                try {
                    $stmt = $pdo->prepare("DELETE FROM `$playerTbl` WHERE identityName = ?");
                    $stmt->execute(array($identityName));
                    $c = $stmt->rowCount();
                    if ($c > 0) $deleted[$playerTbl . '(same account)'] = $c;
                } catch (PDOException $e) { /* skip */ }
            }

            echo json_encode(array(
                'ok' => true,
                'name' => $playerName,
                'identity' => $identityName,
                'deleted' => $deleted,
                'errors' => $errors,
                'note' => 'Restart game server to clear cached player data'
            ));
            break;

        // ── Gift item ─────────────────────────────────────────────────────
        case 'gift_item':
            $pid    = isset($_POST['playerId']) ? trim($_POST['playerId']) : '';
            $itemId = isset($_POST['itemId'])   ? trim($_POST['itemId'])   : '';
            $count  = max(1, (int)(isset($_POST['count']) ? $_POST['count'] : 1));
            $reason = isset($_POST['reason'])   ? trim($_POST['reason'])   : 'GM Gift';
            if (!$pid || !$itemId) {
                echo json_encode(array('ok' => false, 'msg' => 'Missing playerId or itemId')); break;
            }
            // $pid is the character display name; api_mail_gift_db looks up by player.name
            $result = api_mail_gift_db($pid, $itemId, $count, 'GM Gift', $reason, $sid);
            $ok     = isset($result['success']) ? (bool)$result['success'] : false;
            echo json_encode(array('ok' => $ok, 'result' => $result, 'targetName' => $pid));
            break;

        // ── Gift to all ───────────────────────────────────────────────────
        case 'gift_all':
            $itemId = isset($_POST['itemId']) ? trim($_POST['itemId']) : '';
            $count  = max(1, (int)(isset($_POST['count']) ? $_POST['count'] : 1));
            $reason = isset($_POST['reason']) ? trim($_POST['reason']) : 'Server Event Gift';
            if (!$itemId) { echo json_encode(array('ok'=>false,'msg'=>'No itemId')); break; }
            $result = api_broadcast_mail($itemId, $count, 'Server Gift', $reason);
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Payment status ────────────────────────────────────────────────
        case 'payment_status':
            $state = payment_state();
            $pp    = paypal_config();
            echo json_encode(array(
                'ok'              => true,
                'payment_enabled' => $state['payment_enabled'],
                'has_backup'      => !empty($state['original_packages']),
                'toggled_at'      => isset($state['toggled_at']) ? $state['toggled_at'] : null,
                'paypal_set'      => !empty($pp['client_id']),
                'paypal_mode'     => $pp['mode'],
            ));
            break;

        // ── Toggle payment ON ─────────────────────────────────────────────
        case 'payment_on':
            $state = payment_state();
            // Restore config file prices
            $pkgs = load_recharge_packages();
            if (!empty($state['original_packages'])) {
                $pkgs = $state['original_packages'];
                save_recharge_packages($pkgs);
            }
            $state['payment_enabled']   = true;
            $state['original_packages'] = null;
            $state['toggled_at']        = date('Y-m-d H:i:s');
            save_payment_state($state);
            // Enable recharge component in real-time
            $sw = array();
            foreach (array('recharge','pay','shop','mall') as $n) {
                $r = api_call('componentSwitch', array('name' => $n, 'state' => '1'));
                if (empty($r['error'])) { $sw[] = $n . ':ON'; }
            }
            echo json_encode(array('ok' => true,
                'msg'      => 'Payment ENABLED. Config file restored.' . (count($sw) ? ' Switches set: ' . implode(', ', $sw) : ' (Could not reach server — restart required.)'),
                'switches' => $sw));
            break;

        // ── Toggle payment OFF (free) ─────────────────────────────────────
        case 'payment_off':
            $state = payment_state();
            $pkgs  = load_recharge_packages();
            if (empty($state['original_packages'])) {
                $state['original_packages'] = $pkgs;
            }
            foreach ($pkgs as &$pkg) { $pkg['RMB'] = 0; }
            unset($pkg);
            save_recharge_packages($pkgs);
            $state['payment_enabled'] = false;
            $state['toggled_at']      = date('Y-m-d H:i:s');
            save_payment_state($state);
            // Disable recharge component in real-time via ComponentSwitchService
            $sw = array();
            foreach (array('recharge','pay','shop','mall') as $n) {
                $r = api_call('componentSwitch', array('name' => $n, 'state' => '0'));
                if (empty($r['error'])) { $sw[] = $n . ':OFF'; }
            }
            echo json_encode(array('ok' => true,
                'msg'      => 'Payment DISABLED. Config file updated.' . (count($sw) ? ' Switches set: ' . implode(', ', $sw) : ' (Could not reach server — restart required to apply config change.)'),
                'switches' => $sw));
            break;

        // ── List all component switches ───────────────────────────────────
        case 'switch_list':
            $result = api_call('componentSwitch', array('name' => ''));
            // Server returns non-standard: [{name:"X",state:N},...] — unquoted keys, not valid JSON.
            // api_call stores the raw text in $result['raw']. Parse it manually.
            $switches = array();
            $rawText  = isset($result['raw']) ? $result['raw'] : '';
            if ($rawText && preg_match_all('/\{name:"([^"]+)",state:(\d+)\}/', $rawText, $m)) {
                for ($i = 0; $i < count($m[1]); $i++) {
                    $switches[] = array('name' => $m[1][$i], 'state' => (int)$m[2][$i]);
                }
            }
            if (!empty($switches)) {
                echo json_encode(array('ok' => true, 'result' => $switches));
            } else {
                echo json_encode(array('ok' => true, 'result' => $result));
            }
            break;

        // ── Toggle one component switch ───────────────────────────────────
        case 'switch_toggle':
            $swName  = isset($_POST['name'])  ? trim($_POST['name'])  : '';
            $swState = isset($_POST['state']) ? trim($_POST['state']) : '1';
            if (!$swName) { echo json_encode(array('ok'=>false,'msg'=>'No switch name')); break; }
            $result  = api_call('componentSwitch', array('name' => $swName, 'state' => $swState));
            // Server returns non-standard: { code:0,description:"..."} — detect success by code:0 in raw
            $rawText = isset($result['raw']) ? $result['raw'] : '';
            $togOk   = (isset($result['code']) && $result['code'] === 0)
                    || (strpos($rawText, 'code:0') !== false);
            echo json_encode(array('ok' => $togOk, 'name' => $swName, 'state' => $swState, 'result' => $result));
            break;

        // ── Recharge list ─────────────────────────────────────────────────
        case 'recharge_list':
            echo json_encode(array('ok' => true, 'data' => load_recharge_packages()));
            break;

        case 'recharge_set_price':
            $id    = (int)(isset($_POST['id'])  ? $_POST['id']  : 0);
            $price = (int)(isset($_POST['rmb']) ? $_POST['rmb'] : -1);
            if ($id <= 0 || $price < 0) { echo json_encode(array('ok'=>false,'msg'=>'Bad params')); break; }
            $pkgs = load_recharge_packages();
            $found = false;
            foreach ($pkgs as &$pkg) {
                if ((int)$pkg['id'] === $id) { $pkg['RMB'] = $price; $found = true; break; }
            }
            unset($pkg);
            if (!$found) { echo json_encode(array('ok'=>false,'msg'=>'Package not found')); break; }
            echo json_encode(array('ok' => (bool)save_recharge_packages($pkgs), 'msg' => 'Saved. Restart server to apply.'));
            break;

        // ── PayPal config save ────────────────────────────────────────────
        case 'paypal_config_save':
            $cfg = array(
                'client_id' => trim(isset($_POST['client_id']) ? $_POST['client_id'] : ''),
                'secret'    => trim(isset($_POST['secret'])    ? $_POST['secret']    : ''),
                'mode'      => (isset($_POST['mode']) && $_POST['mode'] === 'live') ? 'live' : 'sandbox',
            );
            file_put_contents(PAYPAL_CONFIG_FILE, json_encode($cfg, JSON_PRETTY_PRINT));
            echo json_encode(array('ok' => true, 'msg' => 'PayPal config saved.'));
            break;

        case 'paypal_config_get':
            echo json_encode(array('ok' => true, 'config' => paypal_config()));
            break;

        // ── Server notice ─────────────────────────────────────────────────
        case 'send_notice':
            $msg = trim(isset($_POST['message']) ? $_POST['message'] : '');
            if (!$msg) { echo json_encode(array('ok'=>false,'msg'=>'Empty message')); break; }
            $result = api_call('syspop', array('content' => $msg, 'key' => 'ddgg5bjjflasd12345531'));
            if (!empty($result['error'])) {
                $result = api_call('SystemPopMsgService', array('content' => $msg, 'key' => 'ddgg5bjjflasd12345531'));
            }
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Item catalog ──────────────────────────────────────────────────
        case 'items':
            $q       = strtolower(trim(isset($_GET['q']) ? $_GET['q'] : ''));
            $catalog = load_item_catalog();
            if ($q) {
                $catalog = array_filter($catalog, function($i) use ($q) {
                    return strpos(strtolower($i['name']), $q) !== false
                        || strpos((string)$i['id'], $q) !== false;
                });
            }
            echo json_encode(array('ok' => true, 'data' => array_values($catalog)));
            break;

        // ── Quest list ────────────────────────────────────────────────
        case 'quest_list':
            $taskFile = CONF_DIR . '/task/taskNewbie.json';
            if (!file_exists($taskFile)) {
                echo json_encode(array('ok' => false, 'msg' => 'taskNewbie.json not found: ' . $taskFile));
                break;
            }
            $raw = file_get_contents($taskFile);
            $quests = @json_decode($raw, true);
            if (!is_array($quests)) {
                echo json_encode(array('ok' => false, 'msg' => 'Failed to parse taskNewbie.json'));
                break;
            }
            echo json_encode(array('ok' => true, 'data' => $quests));
            break;

        // ── Quest save rewards ───────────────────────────────────────────
        case 'quest_save':
            $qid     = isset($_POST['id'])      ? (int)$_POST['id']          : 0;
            $rewards = isset($_POST['rewards'])  ? trim($_POST['rewards'])    : '';
            if (!$qid) { echo json_encode(array('ok' => false, 'msg' => 'Missing quest id')); break; }

            $confBase = dirname(CONF_DIR);  // MYH5/my_s1
            $serverDirs = array('my_s1', 'my_s2', 'my_s3');
            $errors = array();
            foreach ($serverDirs as $sdir) {
                $path = str_replace('my_s1', $sdir, $confBase) . '/conf/task/taskNewbie.json';
                if (!file_exists($path)) { $errors[] = $sdir . ': file not found'; continue; }
                $data = @json_decode(file_get_contents($path), true);
                if (!is_array($data)) { $errors[] = $sdir . ': parse error'; continue; }
                $found = false;
                foreach ($data as &$q) {
                    if (isset($q['id']) && (int)$q['id'] === $qid) {
                        $q['rewards'] = $rewards;
                        $found = true;
                        break;
                    }
                }
                unset($q);
                if (!$found) { $errors[] = $sdir . ': quest id not found'; continue; }
                $written = file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE));
                if (!$written) { $errors[] = $sdir . ': write failed'; }
            }
            if (count($errors)) {
                echo json_encode(array('ok' => false, 'msg' => implode('; ', $errors)));
            } else {
                echo json_encode(array('ok' => true, 'msg' => 'Saved to all 3 servers'));
            }
            break;

        default:
            echo json_encode(array('ok' => false, 'msg' => 'Unknown action'));
    }
    exit;
}

$servers = unserialize(SERVERS);
$sid     = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
$isAuth  = isset($_SESSION['gm_auth'])   ? $_SESSION['gm_auth']   : false;
$srvName = isset($servers[$sid]['name']) ? $servers[$sid]['name'] : 'Server ' . $sid;
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GM Panel</title>
<style>
:root {
  --bg:#0f1117; --card:#1a1d27; --border:#2a2d3e;
  --accent:#5865f2; --success:#23d160; --warn:#ffdd57;
  --danger:#ff3860; --text:#e0e0f0; --muted:#7a7d9a; --gold:#ffd700;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font:14px/1.5 'Segoe UI',sans-serif}
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh}
.login-box{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:40px;width:360px}
.login-box h1{font-size:22px;margin-bottom:24px;color:var(--accent)}
.login-box select,.login-box input[type=password]{width:100%;padding:10px 12px;background:#12141e;border:1px solid var(--border);border-radius:6px;color:var(--text);margin-bottom:12px;font-size:14px}
.login-box .err{color:var(--danger);margin-bottom:10px;font-size:13px}
.shell{display:flex;height:100vh}
.sidebar{width:200px;min-width:200px;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:16px 0}
.sidebar-logo{padding:0 16px 16px;font-size:18px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border)}
.sidebar-logo span{font-size:11px;color:var(--muted);display:block;font-weight:400}
.sidebar nav a{display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--muted);text-decoration:none;transition:.15s;border-left:3px solid transparent}
.sidebar nav a:hover,.sidebar nav a.active{color:var(--text);background:rgba(88,101,242,.12);border-left-color:var(--accent)}
.sidebar-bottom{margin-top:auto;padding:12px 16px;font-size:12px;color:var(--muted);border-top:1px solid var(--border)}
.sidebar-bottom a{color:var(--muted);text-decoration:none}
.main{flex:1;overflow:auto;padding:24px}
.page{display:none}.page.active{display:block}
.page-title{font-size:20px;font-weight:700;margin-bottom:20px}
.page-title small{font-size:13px;color:var(--muted);font-weight:400;margin-left:8px}
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:18px;margin-bottom:16px}
.card-title{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:4px}
.field label{font-size:12px;color:var(--muted)}
.field input,.field select,.field textarea{background:#12141e;border:1px solid var(--border);border-radius:6px;color:var(--text);padding:8px 10px;font-size:13px;min-width:140px}
.field input:focus,.field select:focus{outline:none;border-color:var(--accent)}
.field textarea{resize:vertical;min-height:60px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:.15s;text-decoration:none}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:#4752c4}
.btn-success{background:var(--success);color:#000}
.btn-warn{background:var(--warn);color:#000}
.btn-danger{background:var(--danger);color:#fff}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text)}.btn-ghost:hover{background:var(--border)}
.btn-sm{padding:5px 10px;font-size:12px}
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#12141e;color:var(--muted);text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0}
td{padding:8px 12px;border-bottom:1px solid var(--border)}
tr:hover td{background:rgba(255,255,255,.025)}
.badge{display:inline-block;padding:2px 7px;border-radius:999px;font-size:11px;font-weight:700}
.badge-online{background:#1a3a2a;color:var(--success)}.badge-offline{background:#2a1a1a;color:#888}
.badge-vip{background:#3a2a00;color:var(--gold)}
.quality-0{color:#aaa}.quality-1{color:#6cf}.quality-2{color:#a6f}.quality-3{color:#fa6}.quality-4{color:#f64}.quality-5{color:var(--gold)}
#toast{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.toast{padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;animation:slideIn .3s ease;max-width:360px}
.toast-ok{background:#1a3a2a;border:1px solid var(--success);color:var(--success)}
.toast-err{background:#3a1a1a;border:1px solid var(--danger);color:var(--danger)}
.toast-info{background:#1a1e3a;border:1px solid var(--accent);color:#aaf}
@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}
.modal-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;align-items:center;justify-content:center}
.modal-backdrop.open{display:flex}
.modal{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;width:520px;max-width:95vw}
.modal h2{font-size:16px;margin-bottom:16px}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:20px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 16px}
.stat-val{font-size:22px;font-weight:700;margin-bottom:2px}
.stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase}
.search-bar{display:flex;gap:8px;margin-bottom:16px}
.search-bar input{flex:1;background:#12141e;border:1px solid var(--border);border-radius:6px;color:var(--text);padding:9px 12px;font-size:13px}
.search-bar input:focus{outline:none;border-color:var(--accent)}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:6px;max-height:300px;overflow-y:auto}
.item-card{background:#12141e;border:1px solid var(--border);border-radius:6px;padding:8px;cursor:pointer;transition:.15s}
.item-card:hover,.item-card.selected{border-color:var(--accent);background:rgba(88,101,242,.1)}
.item-name{font-size:12px;font-weight:600}.item-id{font-size:11px;color:var(--muted)}
/* Payment toggle */
.pay-toggle{display:flex;align-items:center;gap:16px;padding:20px;background:var(--card);border:2px solid var(--border);border-radius:12px;margin-bottom:16px}
.pay-toggle.state-on{border-color:#23d160}
.pay-toggle.state-off{border-color:#ff3860}
.pay-mode-label{font-size:18px;font-weight:700}
.pay-mode-sub{font-size:12px;color:var(--muted);margin-top:2px}
.toggle-btns{margin-left:auto;display:flex;gap:8px}
.dbtest-box{background:#0a0c14;border:1px solid var(--border);border-radius:6px;padding:12px;font-size:12px;font-family:monospace;white-space:pre-wrap;max-height:200px;overflow:auto;margin-top:8px}
.col-list{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.col-badge{background:#1a1e3a;color:#aaf;padding:2px 6px;border-radius:4px;font-size:11px;font-family:monospace}
</style>
</head>
<body>
<?php if (!$isAuth): ?>
<div class="login-wrap">
  <div class="login-box">
    <h1>GM Panel</h1>
    <?php if (!empty($loginError)): ?><div class="err"><?php echo htmlspecialchars($loginError); ?></div><?php endif; ?>
    <form method="POST">
      <select name="server_id">
        <?php foreach ($servers as $id => $s): ?>
          <option value="<?php echo $id; ?>"><?php echo htmlspecialchars($s['name']); ?></option>
        <?php endforeach; ?>
      </select>
      <input type="password" name="password" placeholder="GM Password" autofocus>
      <button class="btn btn-primary" style="width:100%" name="gm_login">Enter GM Panel</button>
    </form>
  </div>
</div>
<?php else: ?>
<div class="shell">
  <aside class="sidebar">
    <div class="sidebar-logo">GM Panel<span><?php echo htmlspecialchars($srvName); ?></span></div>
    <nav>
      <a href="#" class="active" data-page="dashboard">Dashboard</a>
      <a href="#" data-page="accounts">Accounts</a>
      <a href="#" data-page="gift">Gift Items</a>
      <a href="#" data-page="payment">Payment</a>
      <a href="#" data-page="notice">Notice</a>
      <a href="#" data-page="quests">Quests</a>
    </nav>
    <div class="sidebar-bottom"><a href="?logout">Logout</a></div>
  </aside>

  <main class="main">

    <!-- DASHBOARD -->
    <div class="page active" id="page-dashboard">
      <div class="page-title">Dashboard <small>Quick overview</small></div>
      <div class="stat-grid">
        <div class="stat"><div class="stat-val" id="s-total">—</div><div class="stat-lbl">Total Accounts</div></div>
        <div class="stat"><div class="stat-val" id="s-online" style="color:var(--success)">—</div><div class="stat-lbl">Online Now</div></div>
        <div class="stat"><div class="stat-val" id="s-today">—</div><div class="stat-lbl">Logged In Today</div></div>
        <div class="stat"><div class="stat-val" id="s-vip" style="color:var(--gold)">—</div><div class="stat-lbl">VIP Players</div></div>
      </div>
      <div class="card"><div class="card-title">Recent Active Players</div><div id="dash-recent"><div class="spinner"></div></div></div>
    </div>

    <!-- ACCOUNTS -->
    <div class="page" id="page-accounts">
      <div class="page-title">Accounts <small>Search &amp; manage players</small></div>
      <div class="card">
        <div class="search-bar">
          <input id="acc-search" placeholder="Search name or player ID..." oninput="debounceSearch()">
          <button class="btn btn-primary btn-sm" onclick="loadAccounts()">Search</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('acc-search').value='';loadAccounts()">Reset</button>
          <button class="btn btn-ghost btn-sm" onclick="showDbTest()" title="Diagnose DB connection">DB Test</button>
        </div>
        <div id="db-test-result" style="display:none"></div>
        <div id="acc-error" style="display:none;color:var(--danger);font-size:12px;margin-bottom:8px;padding:8px;background:#3a1a1a;border-radius:6px"></div>
        <div class="tbl-wrap">
          <table>
            <thead><tr>
              <th>Player ID</th><th>Name</th><th>Lv</th><th>VIP</th>
              <th>Gold</th><th>Jade</th><th>Status</th><th>Last Login</th><th>Actions</th>
            </tr></thead>
            <tbody id="acc-tbody"><tr><td colspan="9" style="color:var(--muted);text-align:center">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- GIFT ITEMS -->
    <div class="page" id="page-gift">
      <div class="page-title">Gift Items <small>Send items to players</small></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="card">
          <div class="card-title">Gift to Single Player</div>
          <div class="field" style="margin-bottom:10px">
            <label>Player ID or Name</label>
            <input id="g-pid" placeholder="Player ID or Name">
          </div>
          <div class="field" style="margin-bottom:10px">
            <label>Item <span id="g-item-name" style="color:var(--accent)"></span></label>
            <input id="g-item-search" placeholder="Search item..." oninput="searchItems('g')">
          </div>
          <div id="g-items-grid" class="items-grid" style="margin-bottom:10px"></div>
          <input type="hidden" id="g-item-id">
          <div class="row">
            <div class="field"><label>Quantity</label><input id="g-count" type="number" value="1" min="1" style="width:80px"></div>
            <div class="field"><label>Reason</label><input id="g-reason" value="GM Gift" style="min-width:200px"></div>
          </div>
          <button class="btn btn-success" onclick="giftSingle()">Send Gift</button>
        </div>
        <div class="card">
          <div class="card-title">Gift to All Online Players</div>
          <div class="field" style="margin-bottom:10px">
            <label>Item <span id="ga-item-name" style="color:var(--accent)"></span></label>
            <input id="ga-item-search" placeholder="Search item..." oninput="searchItems('ga')">
          </div>
          <div id="ga-items-grid" class="items-grid" style="margin-bottom:10px"></div>
          <input type="hidden" id="ga-item-id">
          <div class="row">
            <div class="field"><label>Quantity</label><input id="ga-count" type="number" value="1" min="1" style="width:80px"></div>
            <div class="field"><label>Reason</label><input id="ga-reason" value="Server Event Gift" style="min-width:200px"></div>
          </div>
          <button class="btn btn-warn" onclick="giftAll()">Broadcast Gift</button>
          <div style="margin-top:8px;font-size:12px;color:var(--muted)">Sends to all currently online players.</div>
        </div>
      </div>
    </div>

    <!-- PAYMENT CONTROL -->
    <div class="page" id="page-payment">
      <div class="page-title">Payment Control</div>

      <!-- Global toggle -->
      <div id="pay-toggle-box" class="pay-toggle">
        <div>
          <div class="pay-mode-label" id="pay-mode-label">Loading...</div>
          <div class="pay-mode-sub" id="pay-mode-sub"></div>
        </div>
        <div class="toggle-btns">
          <button class="btn btn-success" onclick="setPayment(true)">Enable Payment (ON)</button>
          <button class="btn btn-danger"  onclick="setPayment(false)">Disable Payment (FREE)</button>
        </div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">
        Uses ComponentSwitchService to toggle recharge in real-time. Also writes gameRecharge.json as backup.
      </div>

      <!-- Component switches -->
      <div class="card">
        <div class="card-title" style="display:flex;align-items:center;justify-content:space-between">
          <span>Component Switches <small style="font-weight:normal;text-transform:none;color:var(--muted)">(real-time server feature toggles)</small></span>
          <button class="btn btn-ghost btn-sm" onclick="loadSwitches()">Refresh</button>
        </div>
        <div style="font-size:12px;color:#7a7d9a;background:#12141e;border:1px solid #2a2d3e;border-radius:6px;padding:10px 12px;margin-bottom:10px">
          ℹ️ Requires <strong>server_patched.jar</strong> deployed as <strong>server.jar</strong> + server restart to activate Tomcat port 8090.<br>
          <span style="color:#aaa">If server is offline or not patched, use the <strong>Enable/Disable Payment</strong> buttons above — they work without the server.</span>
        </div>
        <div id="sw-status" style="font-size:12px;color:var(--muted);margin-bottom:8px"></div>
        <div id="sw-list"></div>
      </div>

      <!-- PayPal configuration -->
      <div class="card">
        <div class="card-title">PayPal Configuration</div>
        <div id="paypal-status" style="margin-bottom:12px;font-size:12px"></div>
        <div class="row">
          <div class="field" style="flex:1">
            <label>Client ID (from developer.paypal.com)</label>
            <input id="pp-client-id" type="text" placeholder="Client ID" style="min-width:100%">
          </div>
        </div>
        <div class="row">
          <div class="field" style="flex:1">
            <label>Secret</label>
            <input id="pp-secret" type="password" placeholder="PayPal App Secret" style="min-width:100%">
          </div>
          <div class="field">
            <label>Mode</label>
            <select id="pp-mode">
              <option value="sandbox">Sandbox (Test)</option>
              <option value="live">Live (Production)</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="savePaypalConfig()">Save PayPal Config</button>
        <div style="margin-top:10px;font-size:12px;color:var(--muted)">
          Payment page for players: <code id="pay-url" style="background:#12141e;padding:2px 6px;border-radius:4px"></code>
        </div>
      </div>

      <!-- Package list -->
      <div class="card">
        <div class="card-title">Recharge Packages <small style="font-weight:normal;text-transform:none">(config file prices — requires restart)</small></div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Price (RMB)</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="pay-tbody"><tr><td colspan="6" style="color:var(--muted);text-align:center">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- NOTICE -->
    <div class="page" id="page-notice">
      <div class="page-title">Server Notice <small>Broadcast pop-up to all players</small></div>
      <div class="card" style="max-width:600px">
        <div class="card-title">Send Pop-up Notice</div>
        <div class="field" style="margin-bottom:12px">
          <label>Message</label>
          <textarea id="notice-msg" placeholder="Message text..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="sendNotice()">Send Notice</button>
      </div>
    </div>

    <!-- QUESTS -->
    <div class="page" id="page-quests">
      <div class="page-title">Quests <small>View &amp; edit quest rewards</small></div>
      <div class="card">
        <div class="card-title" style="display:flex;align-items:center;justify-content:space-between">
          <span>Newbie Quests (taskNewbie.json)</span>
          <button class="btn btn-ghost btn-sm" onclick="loadQuests()">Refresh</button>
        </div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Description</th><th>Rewards</th><th>Actions</th></tr></thead>
            <tbody id="quest-tbody"><tr><td colspan="6" style="color:var(--muted);text-align:center">Click Quests tab to load</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

  </main>
</div>

<!-- Quest reward editor modal -->
<div class="modal-backdrop" id="modal-quest">
  <div class="modal" style="width:720px;max-height:90vh;overflow-y:auto">
    <h2>Edit Quest Rewards</h2>
    <div id="qe-quest-info" style="margin-bottom:12px;font-size:13px;color:var(--muted)"></div>
    <div id="qe-rows" style="margin-bottom:12px"></div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="btn btn-ghost btn-sm" onclick="qeAddRow()">+ Add Reward</button>
    </div>
    <div class="field" style="margin-bottom:12px">
      <label>Raw Reward String (auto-updated)</label>
      <input id="qe-raw" style="width:100%;font-family:monospace;font-size:12px" readonly>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-success" onclick="qeSave()">Save to All Servers</button>
      <button class="btn btn-ghost" onclick="document.getElementById('modal-quest').classList.remove('open')">Cancel</button>
    </div>
  </div>
</div>

<!-- Item picker modal for quest editor -->
<div class="modal-backdrop" id="modal-itempick" style="z-index:600">
  <div class="modal" style="width:680px;max-height:85vh;display:flex;flex-direction:column">
    <h2 style="margin-bottom:8px">Select Item</h2>
    <div class="search-bar" style="margin-bottom:8px">
      <input id="qip-search" placeholder="Search by name or ID..." oninput="qipFilter()" style="flex:1;background:#12141e;border:1px solid var(--border);border-radius:6px;color:var(--text);padding:8px 10px;font-size:13px">
    </div>
    <div id="qip-grid" style="flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;max-height:55vh;padding:2px"></div>
    <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
      <button class="btn btn-ghost btn-sm" id="qip-prev" onclick="qipPage(-1)">← Prev</button>
      <span style="font-size:12px;color:var(--muted);flex:1;text-align:center" id="qip-count"></span>
      <button class="btn btn-ghost btn-sm" id="qip-next" onclick="qipPage(1)">Next →</button>
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('modal-itempick').classList.remove('open')">Cancel</button>
    </div>
  </div>
</div>

<!-- Gift modal -->
<div class="modal-backdrop" id="modal-gift">
  <div class="modal">
    <h2>Gift Item</h2>
    <div id="modal-target" style="margin-bottom:12px;color:var(--accent);font-size:13px"></div>
    <div class="field" style="margin-bottom:10px">
      <label>Item</label>
      <input id="mg-item-search" placeholder="Search item..." oninput="searchItems('mg')">
    </div>
    <div id="mg-items-grid" class="items-grid" style="margin-bottom:10px"></div>
    <input type="hidden" id="mg-item-id">
    <div class="row">
      <div class="field"><label>Qty</label><input id="mg-count" type="number" value="1" min="1" style="width:80px"></div>
      <div class="field"><label>Reason</label><input id="mg-reason" value="GM Gift" style="min-width:200px"></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-success" onclick="doModalGift()">Send</button>
      <button class="btn btn-ghost"   onclick="closeModal()">Cancel</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
// ── Routing ───────────────────────────────────────────────────────────────
document.querySelectorAll('[data-page]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    var pg = a.dataset.page;
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('[data-page]').forEach(function(x) { x.classList.remove('active'); });
    document.getElementById('page-' + pg).classList.add('active');
    a.classList.add('active');
    if (pg === 'dashboard') loadDashboard();
    if (pg === 'accounts')  loadAccounts();
    if (pg === 'gift')      { searchItems('g'); searchItems('ga'); }
    if (pg === 'payment')   loadPaymentPage();
    if (pg === 'quests')    loadQuests();
  });
});

// ── Toast ─────────────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || 'info';
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type === 'ok' ? 'ok' : type === 'err' ? 'err' : 'info');
  el.textContent = msg;
  document.getElementById('toast').appendChild(el);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 4500);
}

function post(action, data) {
  return fetch('index.php?ajax=' + action, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams(data)
  }).then(function(r) { return r.json(); });
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function loadDashboard() {
  fetch('index.php?ajax=accounts&limit=500').then(function(r) { return r.json(); }).then(function(d) {
    var rows = d.data || [];
    document.getElementById('s-total').textContent  = rows.length;
    document.getElementById('s-online').textContent = rows.filter(function(x) { return x.onlineState == '1' || x.onlineState === 1; }).length;
    var today = new Date().toISOString().slice(0, 10);
    document.getElementById('s-today').textContent  = rows.filter(function(x) { return (x.lastLoginTime || '').indexOf(today) === 0; }).length;
    document.getElementById('s-vip').textContent    = rows.filter(function(x) { return parseInt(x.vipLevel || 0) > 0; }).length;
    document.getElementById('dash-recent').innerHTML = buildPlayerTable(rows.slice(0, 10));
    if (d.error) {
      document.getElementById('dash-recent').insertAdjacentHTML('beforebegin',
        '<div style="color:var(--danger);font-size:12px;margin-bottom:8px">DB error: ' + esc(d.error) + '</div>');
    }
  });
}

// ── DB Test ───────────────────────────────────────────────────────────────
function showDbTest() {
  var box = document.getElementById('db-test-result');
  box.style.display = 'block';
  box.innerHTML = '<div class="spinner"></div> Testing connection...';
  fetch('index.php?ajax=db_test').then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) {
      box.innerHTML = '<div style="color:var(--danger)"><strong>Connection FAILED</strong><br>' + esc(d.error) +
        '<br><br><em>' + esc(d.hint || '') + '</em></div>';
      return;
    }
    var html = '<div style="color:var(--success)"><strong>Connected to DB: ' + esc(d.db) + '</strong></div>';
    html += '<br><strong>Available tables (' + d.tables.length + '):</strong><div class="col-list">';
    d.tables.forEach(function(t) { html += '<span class="col-badge">' + esc(t) + '</span>'; });
    html += '</div>';
    if (d.detected) {
      html += '<br><strong>Auto-detected player table: <span style="color:var(--warn)">' + esc(d.detected) + '</span></strong>';
      html += ' (' + d.row_count + ' rows)';
      html += '<br><strong>Columns:</strong><div class="col-list">';
      d.columns.forEach(function(c) { html += '<span class="col-badge">' + esc(c.Field) + '</span>'; });
      html += '</div>';
      html += '<br><em style="color:var(--muted)">If "' + esc(d.detected) + '" is not correct, update DB_TABLE_PLAYER in includes/config.php</em>';
    } else {
      html += '<br><span style="color:var(--danger)">No player table found. DB may be empty or misconfigured.</span>';
    }
    box.innerHTML = html;
  });
}

// ── Accounts ──────────────────────────────────────────────────────────────
var searchTimer;
function debounceSearch() { clearTimeout(searchTimer); searchTimer = setTimeout(loadAccounts, 400); }

function loadAccounts() {
  var q = document.getElementById('acc-search').value;
  document.getElementById('acc-tbody').innerHTML = '<tr><td colspan="9" style="text-align:center"><span class="spinner"></span></td></tr>';
  document.getElementById('acc-error').style.display = 'none';
  fetch('index.php?ajax=accounts&q=' + encodeURIComponent(q) + '&limit=100').then(function(r) { return r.json(); }).then(function(d) {
    if (d.error) {
      var errEl = document.getElementById('acc-error');
      errEl.textContent = 'DB Error: ' + d.error + (d.table ? ' (table: ' + d.table + ')' : '') +
        ' — Click "DB Test" to diagnose.';
      errEl.style.display = 'block';
    }
    document.getElementById('acc-tbody').innerHTML = buildPlayerRows(d.data || []);
  });
}

function buildPlayerRows(rows) {
  if (!rows.length) return '<tr><td colspan="9" style="color:var(--muted);text-align:center">No results — try clicking "DB Test" to check your connection</td></tr>';
  return rows.map(function(p) {
    var pid  = p.playerId || p.roleId || p.id || '?';
    var name = p.playerName || p.roleName || p.name || '?';
    var online = p.onlineState == '1' || p.onlineState === 1;
    return '<tr>' +
      '<td style="font-family:monospace;font-size:12px">' + esc(pid) + '</td>' +
      '<td><strong>' + esc(name) + '</strong></td>' +
      '<td>' + (p.level || p.lv || '—') + '</td>' +
      '<td>' + ((p.vipLevel||p.vip) > 0 ? '<span class="badge badge-vip">VIP ' + (p.vipLevel||p.vip) + '</span>' : '—') + '</td>' +
      '<td>' + fmt(p.gold || p.goldNum) + '</td>' +
      '<td>' + fmt(p.jade || p.diamond || p.rmb) + '</td>' +
      '<td><span class="badge ' + (online ? 'badge-online' : 'badge-offline') + '">' + (online ? 'Online' : 'Offline') + '</span></td>' +
      '<td style="font-size:12px;color:var(--muted)">' + esc((p.lastLoginTime || p.lastLogin || '').replace('T', ' ').slice(0, 16)) + '</td>' +
      '<td><button class="btn btn-success btn-sm" onclick="openGiftModal(\'' + esc(pid) + '\',\'' + esc(name) + '\')">Gift</button> ' +
      '<button class="btn btn-danger btn-sm" onclick="deletePlayer(\'' + esc(pid) + '\',\'' + esc(name) + '\')">Delete</button></td>' +
      '</tr>';
  }).join('');
}

function buildPlayerTable(rows) {
  if (!rows.length) return '<div style="color:var(--muted);font-size:13px">No data. Check DB connection with "DB Test" on Accounts tab.</div>';
  var html = '<div class="tbl-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Lv</th><th>VIP</th><th>Status</th></tr></thead><tbody>';
  rows.forEach(function(p) {
    var pid = p.playerId || p.roleId || p.id || '?';
    var name = p.playerName || p.roleName || p.name || '?';
    var online = p.onlineState == '1' || p.onlineState === 1;
    html += '<tr><td style="font-family:monospace;font-size:12px">' + esc(pid) + '</td>' +
      '<td>' + esc(name) + '</td><td>' + (p.level||p.lv||'—') + '</td>' +
      '<td>' + ((p.vipLevel||p.vip)>0 ? '<span class="badge badge-vip">VIP '+(p.vipLevel||p.vip)+'</span>' : '—') + '</td>' +
      '<td><span class="badge ' + (online?'badge-online':'badge-offline') + '">' + (online?'Online':'Offline') + '</span></td></tr>';
  });
  return html + '</tbody></table></div>';
}

// ── Delete player ─────────────────────────────────────────────────────────
function deletePlayer(pid, name) {
  if (!confirm('Delete player "' + name + '" (ID: ' + pid + ')?\n\nThis will remove the player and all related data (mail, arena, friends, tasks).\n\nThis action CANNOT be undone!')) return;
  if (!confirm('Are you ABSOLUTELY sure?\n\nPlayer: ' + name + '\n\nType OK to confirm.')) return;
  fetch('index.php?ajax=delete_player', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'playerId=' + encodeURIComponent(pid)
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (d.ok) {
      var details = [];
      for (var t in d.deleted) { details.push(t + ': ' + d.deleted[t] + ' rows'); }
      var msg = 'Player "' + (d.name || name) + '" deleted completely.';
      if (d.identity) msg += '\nAccount: ' + d.identity;
      msg += '\nDeleted: ' + details.join(', ');
      if (d.note) msg += '\n\n⚠ ' + d.note;
      if (d.errors && d.errors.length) msg += '\nWarnings: ' + d.errors.join('; ');
      toast(msg, 'ok');
      loadAccounts();
    } else {
      toast(d.msg || 'Delete failed', 'err');
    }
  });
}

// ── Item search ───────────────────────────────────────────────────────────
var itemCache = null;
function getItems() {
  if (itemCache) return Promise.resolve(itemCache);
  return fetch('index.php?ajax=items').then(function(r) { return r.json(); }).then(function(d) {
    itemCache = d.data || [];
    return itemCache;
  });
}
var selectedItems = {};
function searchItems(prefix) {
  var qEl = document.getElementById(prefix + '-item-search');
  var q = qEl ? qEl.value.toLowerCase() : '';
  getItems().then(function(all) {
    var filtered = q ? all.filter(function(i) {
      return i.name.toLowerCase().indexOf(q) !== -1 || String(i.id).indexOf(q) !== -1;
    }) : all.slice(0, 48);
    var grid = document.getElementById(prefix + '-items-grid');
    if (!grid) return;
    grid.innerHTML = filtered.slice(0, 48).map(function(i) {
      return '<div class="item-card quality-' + i.quality + (selectedItems[prefix] == i.id ? ' selected' : '') +
             '" onclick="selectItem(\'' + prefix + '\',\'' + i.id + '\',\'' + esc(i.name) + '\')">' +
             '<div class="item-name quality-' + i.quality + '">' + esc(i.name) + '</div>' +
             '<div class="item-id">#' + i.id + '</div></div>';
    }).join('');
  });
}
function selectItem(prefix, id, name) {
  selectedItems[prefix] = id;
  document.getElementById(prefix + '-item-id').value = id;
  var nameEl = document.getElementById(prefix + '-item-name');
  if (nameEl) nameEl.textContent = name;
  searchItems(prefix);
}

// ── Gift single ───────────────────────────────────────────────────────────
function giftSingle() {
  var pid    = document.getElementById('g-pid').value.trim();
  var itemId = document.getElementById('g-item-id').value;
  var count  = document.getElementById('g-count').value;
  var reason = document.getElementById('g-reason').value;
  if (!pid)    { toast('Enter player ID or name', 'err'); return; }
  if (!itemId) { toast('Select an item first', 'err'); return; }
  post('gift_item', {playerId: pid, itemId: itemId, count: count, reason: reason}).then(function(r) {
    toast(r.ok ? 'Gift sent to ' + (r.targetName || pid) : 'Failed: ' + JSON.stringify(r.result), r.ok ? 'ok' : 'err');
  });
}
function giftAll() {
  var itemId = document.getElementById('ga-item-id').value;
  var count  = document.getElementById('ga-count').value;
  var reason = document.getElementById('ga-reason').value;
  if (!itemId) { toast('Select an item first', 'err'); return; }
  if (!confirm('Send this item to ALL online players?')) return;
  post('gift_all', {itemId: itemId, count: count, reason: reason}).then(function(r) {
    toast(r.ok ? 'Broadcast sent' : 'Failed', r.ok ? 'ok' : 'err');
  });
}

// ── Gift modal ────────────────────────────────────────────────────────────
var modalPid = '';
function openGiftModal(pid, name) {
  modalPid = pid;
  document.getElementById('modal-target').textContent = 'Player: ' + name + ' (' + pid + ')';
  document.getElementById('modal-gift').classList.add('open');
  searchItems('mg');
}
function closeModal() { document.getElementById('modal-gift').classList.remove('open'); }
function doModalGift() {
  var itemId = document.getElementById('mg-item-id').value;
  var count  = document.getElementById('mg-count').value;
  var reason = document.getElementById('mg-reason').value;
  if (!itemId) { toast('Select an item', 'err'); return; }
  post('gift_item', {playerId: modalPid, itemId: itemId, count: count, reason: reason}).then(function(r) {
    toast(r.ok ? 'Gift sent' : 'Failed: ' + JSON.stringify(r.result), r.ok ? 'ok' : 'err');
    if (r.ok) closeModal();
  });
}

// ── Payment ───────────────────────────────────────────────────────────────
function loadPaymentPage() {
  // Payment toggle status
  fetch('index.php?ajax=payment_status').then(function(r) { return r.json(); }).then(function(d) {
    var box   = document.getElementById('pay-toggle-box');
    var label = document.getElementById('pay-mode-label');
    var sub   = document.getElementById('pay-mode-sub');
    if (d.payment_enabled) {
      box.className = 'pay-toggle state-on';
      label.textContent = 'PAYMENT ON — players must pay to buy';
      label.style.color = 'var(--success)';
    } else {
      box.className = 'pay-toggle state-off';
      label.textContent = 'PAYMENT OFF — FREE TO BUY';
      label.style.color = 'var(--danger)';
    }
    sub.textContent = d.toggled_at ? 'Last changed: ' + d.toggled_at : '';
  });

  // PayPal config
  fetch('index.php?ajax=paypal_config_get').then(function(r) { return r.json(); }).then(function(d) {
    var cfg = d.config || {};
    document.getElementById('pp-client-id').value = cfg.client_id || '';
    document.getElementById('pp-secret').value    = cfg.secret    || '';
    document.getElementById('pp-mode').value = cfg.mode === 'live' ? 'live' : 'sandbox';
    var statusEl = document.getElementById('paypal-status');
    statusEl.innerHTML = cfg.client_id
      ? '<span style="color:var(--success)">PayPal configured (' + esc(cfg.mode) + ' mode)</span>'
      : '<span style="color:var(--warn)">PayPal not configured — enter credentials below.</span>';
  });

  document.getElementById('pay-url').textContent = location.protocol + '//' + location.host + '/pay/';
  loadSwitches();
  loadPayment();
}

// ── Component Switches ────────────────────────────────────────────────────
var swStates = {};   // name -> '1'/'0' as returned by server

function loadSwitches() {
  document.getElementById('sw-status').textContent = 'Fetching switches from server...';
  document.getElementById('sw-list').innerHTML = '<div class="spinner"></div>';
  fetch('index.php?ajax=switch_list').then(function(r) { return r.json(); }).then(function(d) {
    var result = d.result || {};

    // Common format: result is object {switchName: '0'/'1', ...}
    // Or array [{name:'...', state:'1'}, ...]
    var switches = [];
    if (Array.isArray(result)) {
      result.forEach(function(item) {
        if (item.name !== undefined) switches.push({name: item.name, state: String(item.state || item.value || '1')});
      });
    } else if (typeof result === 'object') {
      Object.keys(result).forEach(function(k) {
        if (k !== 'error' && k !== 'success' && k !== 'raw') {
          switches.push({name: k, state: String(result[k])});
        }
      });
    }

    // If raw text came back (likely 404 HTML from Jetty), suppress it
    if (!switches.length && result.raw) {
      document.getElementById('sw-status').textContent = '';
      document.getElementById('sw-list').innerHTML = buildManualSwitchPanel();
      return;
    }

    if (!switches.length) {
      document.getElementById('sw-status').innerHTML =
        '<span style="color:var(--muted)">Server not reachable on port 8090 — deploy server_patched.jar and restart game server to enable this feature.</span>';
      document.getElementById('sw-list').innerHTML = buildManualSwitchPanel();
      return;
    }

    document.getElementById('sw-status').textContent = switches.length + ' switches found:';
    swStates = {};
    switches.forEach(function(s) { swStates[s.name] = s.state; });
    renderSwitches(switches);
  }).catch(function() {
    document.getElementById('sw-status').textContent = 'Request failed.';
    document.getElementById('sw-list').innerHTML = buildManualSwitchPanel();
  });
}

var payRelated = ['recharge', 'pay', 'payment', 'shop', 'mall', 'vip', 'charge'];

function renderSwitches(switches) {
  // Sort: payment-related first
  switches.sort(function(a, b) {
    var aRel = payRelated.some(function(k) { return a.name.toLowerCase().indexOf(k) !== -1; });
    var bRel = payRelated.some(function(k) { return b.name.toLowerCase().indexOf(k) !== -1; });
    if (aRel && !bRel) return -1;
    if (!aRel && bRel) return 1;
    return a.name.localeCompare(b.name);
  });

  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px">';
  switches.forEach(function(s) {
    var on = s.state === '1' || s.state === 'true' || s.state === 'on';
    var highlight = payRelated.some(function(k) { return s.name.toLowerCase().indexOf(k) !== -1; });
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#12141e;border-radius:6px;border:1px solid ' + (highlight ? 'var(--warn)' : 'var(--border)') + '">' +
      '<span style="font-size:13px;font-family:monospace' + (highlight ? ';color:var(--warn)' : '') + '">' + esc(s.name) + '</span>' +
      '<div style="display:flex;gap:6px;align-items:center">' +
        '<span style="font-size:11px;color:' + (on ? 'var(--success)' : '#888') + '">' + (on ? 'ON' : 'OFF') + '</span>' +
        '<button class="btn btn-sm ' + (on ? 'btn-danger' : 'btn-success') + '" onclick="toggleSwitch(\'' + esc(s.name) + '\',\'' + (on ? '0' : '1') + '\')">' + (on ? 'Disable' : 'Enable') + '</button>' +
      '</div></div>';
  });
  html += '</div>';
  document.getElementById('sw-list').innerHTML = html;
}

function buildManualSwitchPanel() {
  var html = '<div style="margin-bottom:8px;font-size:12px;color:var(--muted)">Toggle a switch by name (try: recharge, pay, shop, mall):</div>' +
    '<div style="display:flex;gap:8px">' +
      '<input id="sw-manual-name" style="flex:1;background:#12141e;border:1px solid var(--border);border-radius:6px;color:var(--text);padding:7px 10px;font-size:13px" placeholder="Switch name, e.g. recharge">' +
      '<button class="btn btn-danger  btn-sm" onclick="toggleSwitchManual(\'0\')">Disable</button>' +
      '<button class="btn btn-success btn-sm" onclick="toggleSwitchManual(\'1\')">Enable</button>' +
    '</div>';
  return html;
}

function toggleSwitchManual(state) {
  var name = document.getElementById('sw-manual-name').value.trim();
  if (!name) { toast('Enter a switch name', 'err'); return; }
  toggleSwitch(name, state);
}

function toggleSwitch(name, state) {
  post('switch_toggle', {name: name, state: state}).then(function(d) {
    var label = state === '1' ? 'Enabled' : 'Disabled';
    var ok = d.ok;
    toast(ok ? label + ': ' + name : 'Failed to toggle ' + name, ok ? 'ok' : 'err');
    if (ok) {
      swStates[name] = state;
      setTimeout(loadSwitches, 500);
    }
  });
}

function setPayment(enable) {
  var msg = enable
    ? 'Enable payment? Players will need to pay (via PayPal) to buy packages.'
    : 'Disable payment? All packages will be set to FREE — players can buy without paying.';
  if (!confirm(msg + '\n\nA server restart is needed to apply the change.')) return;
  post(enable ? 'payment_on' : 'payment_off', {}).then(function(r) {
    toast(r.msg || (r.ok ? 'Done' : 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) loadPaymentPage();
  });
}

function savePaypalConfig() {
  var data = {
    client_id: document.getElementById('pp-client-id').value.trim(),
    secret:    document.getElementById('pp-secret').value.trim(),
    mode:      document.getElementById('pp-mode').value
  };
  if (!data.client_id || !data.secret) { toast('Enter Client ID and Secret', 'err'); return; }
  post('paypal_config_save', data).then(function(r) {
    toast(r.msg || (r.ok ? 'Saved' : 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) loadPaymentPage();
  });
}

function loadPayment() {
  document.getElementById('pay-tbody').innerHTML = '<tr><td colspan="6" style="text-align:center"><span class="spinner"></span></td></tr>';
  fetch('index.php?ajax=recharge_list').then(function(r) { return r.json(); }).then(function(d) {
    var pkgs = d.data || [];
    var typeMap = {99:'First Recharge', 1:'Monthly Card', 2:'Daily', 3:'Weekly', 4:'Total Recharge', 5:'Event', 0:'Normal'};
    if (!pkgs.length) {
      document.getElementById('pay-tbody').innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center">No packages found (check CONF_DIR in config.php)</td></tr>';
      return;
    }
    document.getElementById('pay-tbody').innerHTML = pkgs.map(function(p) {
      return '<tr>' +
        '<td>' + p.id + '</td><td>' + esc(p.name) + '</td>' +
        '<td><span class="badge" style="background:#1a1e3a;color:#aaf">' + (typeMap[p.type] || 'Type ' + p.type) + '</span></td>' +
        '<td><span style="color:' + (p.RMB == 0 ? 'var(--success)' : 'var(--warn)') + ';font-weight:700">' + (p.RMB == 0 ? 'FREE' : 'RMB ' + p.RMB) + '</span></td>' +
        '<td>' + (p.RMB == 0 ? '<span class="badge" style="background:#1a3a2a;color:var(--success)">FREE</span>' : '<span class="badge badge-offline">Paid</span>') + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="setPkgPrice(' + p.id + ',' + p.RMB + ')">Set Price</button></td>' +
        '</tr>';
    }).join('');
  });
}

function setPkgPrice(id, cur) {
  var v = prompt('New price in RMB (0 = free):', cur);
  if (v === null) return;
  var rmb = parseInt(v);
  if (isNaN(rmb) || rmb < 0) { toast('Invalid price', 'err'); return; }
  post('recharge_set_price', {id: id, rmb: rmb}).then(function(r) {
    toast(r.msg || (r.ok ? 'Done' : 'Error'), r.ok ? 'ok' : 'err');
    if (r.ok) loadPayment();
  });
}

// ── Notice ────────────────────────────────────────────────────────────────
function sendNotice() {
  var msg = document.getElementById('notice-msg').value.trim();
  if (!msg) { toast('Enter a message', 'err'); return; }
  post('send_notice', {message: msg}).then(function(r) {
    toast(r.ok ? 'Notice sent' : 'Failed: ' + (r.msg || ''), r.ok ? 'ok' : 'err');
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmt(n) { return parseInt(n||0).toLocaleString(); }

// ── Quests ────────────────────────────────────────────────────────────────
var questData = [];
var qeQuestId = 0;
var QUEST_TYPES = {1:'Talk',2:'Collect',3:'Interact',4:'Kill',11:'Level',12:'Equip',13:'Stage',14:'Enchant',
  15:'Skill',16:'Smelt',17:'PBoss',18:'PetTransform',19:'SpiritInfuse',21:'Gem',22:'Rune',23:'Mark',
  24:'Endless',25:'Legion',27:'PetTower',28:'CelestLadder',30:'LearnPts',31:'PVP',32:'PetHatch',
  33:'BattleSoul',34:'PetAdvance',35:'ForgeOrange',40:'GemDgn',41:'PetDgn',42:'DragonDgn',43:'RuneDgn',
  44:'MarkDgn',45:'PhantomWeap',90:'WBoss',91:'WBoss'};
var ICON_BASE = '../myh5_cilent/v1.1.9.1/resource/icon/item/';

function itemIconId(id) {
  if (!itemCache) return id;
  for (var i = 0; i < itemCache.length; i++) {
    if (String(itemCache[i].id) === String(id)) return itemCache[i].icon || itemCache[i].id;
  }
  return id;
}

function itemIcon(id) {
  var ico = itemIconId(id);
  return '<img src="' + ICON_BASE + ico + '.png" style="width:24px;height:24px;vertical-align:middle;border-radius:3px" onerror="this.style.display=\'none\'">';
}

function itemName(id) {
  if (!itemCache) return '#' + id;
  for (var i = 0; i < itemCache.length; i++) {
    if (String(itemCache[i].id) === String(id)) return itemCache[i].name;
  }
  return '#' + id;
}

function loadQuests() {
  document.getElementById('quest-tbody').innerHTML = '<tr><td colspan="6" style="text-align:center"><span class="spinner"></span></td></tr>';
  getItems().then(function() {
    return fetch('index.php?ajax=quest_list').then(function(r) { return r.json(); });
  }).then(function(d) {
    if (!d.ok) { toast(d.msg || 'Failed to load quests', 'err'); return; }
    questData = d.data || [];
    var html = '';
    if (!questData.length) {
      html = '<tr><td colspan="6" style="color:var(--muted);text-align:center">No quests found</td></tr>';
    } else {
      questData.forEach(function(q) {
        html += '<tr>' +
          '<td style="font-family:monospace">' + q.id + '</td>' +
          '<td><strong>' + esc(q.name) + '</strong></td>' +
          '<td><span class="badge" style="background:#1a1e3a;color:#aaf">' + esc(QUEST_TYPES[q.type] || 'Type ' + q.type) + '</span></td>' +
          '<td style="max-width:250px;font-size:12px;color:var(--muted)">' + esc(q.des || '') + '</td>' +
          '<td style="font-size:12px;max-width:280px">' + formatRewardsHtml(q.rewards || '') + '</td>' +
          '<td><button class="btn btn-primary btn-sm" onclick="openQuestEditor(' + q.id + ')">Edit</button></td>' +
          '</tr>';
      });
    }
    document.getElementById('quest-tbody').innerHTML = html;
  }).catch(function() { toast('Failed to fetch quests', 'err'); });
}

function formatRewardsHtml(str) {
  if (!str) return '<span style="color:var(--muted)">none</span>';
  return str.split(';').map(function(part) {
    return part.split('&').map(function(rw) {
      var s = rw.split('_');
      var iid = s[0]; var cnt = s[1] || '?';
      var name = itemName(iid);
      return itemIcon(iid) + ' <span style="color:var(--accent)">' + esc(name) + '</span> <span style="color:var(--warn)">x' + esc(fmt(cnt)) + '</span>';
    }).join(' | ');
  }).join('<br>');
}

function openQuestEditor(id) {
  qeQuestId = id;
  var q = null;
  for (var i = 0; i < questData.length; i++) {
    if (questData[i].id === id) { q = questData[i]; break; }
  }
  if (!q) return;
  document.getElementById('qe-quest-info').innerHTML =
    '<strong>' + esc(q.name) + '</strong> (ID: ' + q.id + ')' +
    (q.des ? '<br>' + esc(q.des) : '');
  var rows = [];
  if (q.rewards) {
    q.rewards.split(';').forEach(function(part) { rows.push(part); });
  }
  if (!rows.length) rows.push('');
  renderQeRows(rows);
  document.getElementById('modal-quest').classList.add('open');
}

function renderQeRows(rows) {
  var container = document.getElementById('qe-rows');
  var html = '';
  rows.forEach(function(part, idx) {
    var items = part ? part.split('&') : [''];
    html += '<div style="background:#12141e;border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:6px" data-qe-idx="' + idx + '">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
    html += '<span style="font-size:11px;color:var(--muted)">Reward Slot ' + (idx + 1) + '</span>';
    html += '<div style="display:flex;gap:4px">';
    html += '<button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:11px" onclick="qeAddAlt(' + idx + ')">+Alt</button>';
    html += '<button class="btn btn-danger btn-sm" style="padding:2px 6px;font-size:11px" onclick="qeRemoveRow(' + idx + ')">Remove</button>';
    html += '</div></div>';
    items.forEach(function(rw, aidx) {
      var s = rw.split('_');
      var iid = s[0] || ''; var cnt = s[1] || '';
      var iname = iid ? itemName(iid) : '';
      html += '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;padding:4px;background:#0a0c14;border-radius:4px">';
      html += '<div style="width:32px;height:32px;min-width:32px;background:#12141e;border-radius:4px;display:flex;align-items:center;justify-content:center;overflow:hidden" id="qe-icon-' + idx + '-' + aidx + '">';
      if (iid) html += '<img src="' + ICON_BASE + itemIconId(iid) + '.png" style="width:32px;height:32px" onerror="this.style.display=\'none\'">';
      html += '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="display:flex;gap:4px;align-items:center">';
      html += '<input class="qe-custom-id" data-row="' + idx + '" data-alt="' + aidx + '" value="' + esc(iid) + '" style="width:60px;background:#12141e;border:1px solid var(--border);border-radius:4px;color:var(--text);padding:3px 6px;font-size:12px;font-family:monospace" oninput="qeUpdate()" readonly>';
      html += '<span class="qe-item-label" style="font-size:12px;color:var(--accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px" id="qe-label-' + idx + '-' + aidx + '">' + esc(iname) + '</span>';
      html += '<button class="btn btn-ghost btn-sm" style="padding:2px 8px;font-size:11px;white-space:nowrap" onclick="qePickItem(' + idx + ',' + aidx + ')">Browse</button>';
      html += '</div>';
      html += '</div>';
      html += '<div class="field" style="gap:1px"><label style="font-size:10px">Count</label>';
      html += '<input class="qe-cnt" data-row="' + idx + '" data-alt="' + aidx + '" value="' + esc(cnt) + '" type="number" min="1" style="width:90px;background:#12141e;border:1px solid var(--border);border-radius:4px;color:var(--text);padding:3px 6px;font-size:12px" oninput="qeUpdate()">';
      html += '</div>';
      if (items.length > 1) {
        html += '<button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:11px;color:var(--danger)" onclick="qeRemoveAlt(' + idx + ',' + aidx + ')">✕</button>';
      }
      html += '</div>';
    });
    html += '</div>';
  });
  container.innerHTML = html;
  qeUpdate();
}

var qePickRow = 0, qePickAlt = 0;
var qipCurrentPage = 0, qipFiltered = [], qipPerPage = 40;

function qePickItem(row, alt) {
  qePickRow = row; qePickAlt = alt;
  qipCurrentPage = 0;
  document.getElementById('qip-search').value = '';
  document.getElementById('modal-itempick').classList.add('open');
  qipFilter();
  setTimeout(function() { document.getElementById('qip-search').focus(); }, 100);
}

function qipPage(dir) {
  var maxPage = Math.max(0, Math.ceil(qipFiltered.length / qipPerPage) - 1);
  qipCurrentPage = Math.max(0, Math.min(maxPage, qipCurrentPage + dir));
  qipRender();
  document.getElementById('qip-grid').scrollTop = 0;
}

function qipFilter() {
  var q = document.getElementById('qip-search').value.toLowerCase();
  qipCurrentPage = 0;
  getItems().then(function(all) {
    qipFiltered = q ? all.filter(function(i) {
      return i.name.toLowerCase().indexOf(q) !== -1 || String(i.id).indexOf(q) !== -1;
    }) : all;
    qipRender();
  });
}

function qipRender() {
  var totalPages = Math.max(1, Math.ceil(qipFiltered.length / qipPerPage));
  var start = qipCurrentPage * qipPerPage;
  var shown = qipFiltered.slice(start, start + qipPerPage);
  var qualColors = {0:'#aaa',1:'#6cf',2:'#a6f',3:'#fa6',4:'#f64',5:'#ffd700',6:'#f44',7:'#ffd700',8:'#f0f'};
  var html = '';
  shown.forEach(function(i) {
    var col = qualColors[i.quality] || '#aaa';
    html += '<div style="background:#12141e;border:1px solid var(--border);border-radius:6px;padding:6px;cursor:pointer;display:flex;gap:6px;align-items:center;transition:.15s" ' +
      'onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'" ' +
      'onclick="qipSelect(\'' + esc(String(i.id)) + '\')">' +
      '<img src="' + ICON_BASE + (i.icon || i.id) + '.png" style="width:36px;height:36px;border-radius:4px;border:1px solid ' + col + '" onerror="this.src=\'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\'">' +
      '<div style="min-width:0;flex:1">' +
      '<div style="font-size:11px;font-weight:600;color:' + col + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(i.name) + '</div>' +
      '<div style="font-size:10px;color:var(--muted);font-family:monospace">#' + i.id + '</div>' +
      '</div></div>';
  });
  document.getElementById('qip-grid').innerHTML = html || '<div style="color:var(--muted);text-align:center;padding:20px">No items found</div>';
  document.getElementById('qip-count').textContent = qipFiltered.length + ' items — Page ' + (qipCurrentPage + 1) + ' / ' + totalPages;
  document.getElementById('qip-prev').disabled = qipCurrentPage <= 0;
  document.getElementById('qip-next').disabled = qipCurrentPage >= totalPages - 1;
}

function qipSelect(id) {
  document.getElementById('modal-itempick').classList.remove('open');
  var idInput = document.querySelector('#qe-rows .qe-custom-id[data-row="' + qePickRow + '"][data-alt="' + qePickAlt + '"]');
  if (idInput) idInput.value = id;
  var label = document.getElementById('qe-label-' + qePickRow + '-' + qePickAlt);
  if (label) label.textContent = itemName(id);
  var icon = document.getElementById('qe-icon-' + qePickRow + '-' + qePickAlt);
  if (icon) icon.innerHTML = '<img src="' + ICON_BASE + itemIconId(id) + '.png" style="width:32px;height:32px" onerror="this.style.display=\'none\'">';
  qeUpdate();
}

function qeGetRows() {
  var container = document.getElementById('qe-rows');
  var groups = container.querySelectorAll('[data-qe-idx]');
  var rows = [];
  for (var g = 0; g < groups.length; g++) {
    var ids = groups[g].querySelectorAll('.qe-custom-id');
    var cnts = groups[g].querySelectorAll('.qe-cnt');
    var alts = [];
    for (var a = 0; a < ids.length; a++) {
      var iid = ids[a].value.trim();
      var cnt = cnts[a].value.trim();
      if (iid && cnt) alts.push(iid + '_' + cnt);
    }
    rows.push(alts.join('&'));
  }
  return rows;
}

function qeUpdate() {
  document.getElementById('qe-raw').value = qeGetRows().filter(function(r) { return r; }).join(';');
}

function qeAddRow() {
  var rows = qeGetRows();
  rows.push('');
  renderQeRows(rows);
}

function qeRemoveRow(idx) {
  var rows = qeGetRows();
  rows.splice(idx, 1);
  if (!rows.length) rows.push('');
  renderQeRows(rows);
}

function qeAddAlt(idx) {
  var rows = qeGetRows();
  rows[idx] = rows[idx] ? rows[idx] + '&_' : '_';
  renderQeRows(rows);
}

function qeRemoveAlt(idx, aidx) {
  var rows = qeGetRows();
  var parts = rows[idx].split('&');
  parts.splice(aidx, 1);
  rows[idx] = parts.join('&');
  renderQeRows(rows);
}

function qeSave() {
  var raw = document.getElementById('qe-raw').value;
  post('quest_save', {id: qeQuestId, rewards: raw}).then(function(r) {
    toast(r.msg || (r.ok ? 'Saved' : 'Failed'), r.ok ? 'ok' : 'err');
    if (r.ok) {
      document.getElementById('modal-quest').classList.remove('open');
      loadQuests();
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
loadDashboard();
</script>
<?php endif; ?>
</body>
</html>