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

// ── AJAX handlers ────────────────────────────────────────────────────────
$gmAuth = isset($_SESSION['gm_auth']) ? $_SESSION['gm_auth'] : false;
if (isset($_GET['ajax']) && $gmAuth) {
    header('Content-Type: application/json');

    $servers = unserialize(SERVERS);
    $sid     = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
    $dbName  = isset($servers[$sid]['db']) ? $servers[$sid]['db'] : DB_NAME;

    switch ($_GET['ajax']) {

        // ── Account search ───────────────────────────────────────────────
        case 'accounts':
            $q     = trim(isset($_GET['q']) ? $_GET['q'] : '');
            $limit = min((int)(isset($_GET['limit']) ? $_GET['limit'] : 50), 200);
            if ($q === '') {
                $rows = db_query(
                    "SELECT playerId, playerName, level, vipLevel, gold, jade,
                            lastLoginTime, onlineState, createTime
                     FROM t_player ORDER BY lastLoginTime DESC LIMIT ?",
                    array($limit), $dbName
                );
            } else {
                $rows = db_query(
                    "SELECT playerId, playerName, level, vipLevel, gold, jade,
                            lastLoginTime, onlineState, createTime
                     FROM t_player
                     WHERE playerName LIKE ? OR playerId = ?
                     ORDER BY lastLoginTime DESC LIMIT ?",
                    array("%$q%", $q, $limit), $dbName
                );
            }
            echo json_encode(array('ok' => true, 'data' => $rows ? $rows : array()));
            break;

        // ── Player detail ─────────────────────────────────────────────────
        case 'player_detail':
            $pid = isset($_GET['pid']) ? $_GET['pid'] : '';
            $row = db_query(
                "SELECT playerId, playerName, level, vipLevel, gold, jade,
                         lastLoginTime, onlineState, createTime, accountId, job
                 FROM t_player WHERE playerId = ? LIMIT 1",
                array($pid), $dbName
            );
            echo json_encode(array('ok' => true, 'data' => isset($row[0]) ? $row[0] : null));
            break;

        // ── Gift item (server API) ─────────────────────────────────────
        case 'gift_item':
            $pid    = isset($_POST['playerId']) ? $_POST['playerId'] : '';
            $itemId = isset($_POST['itemId'])   ? $_POST['itemId']   : '';
            $count  = max(1, (int)(isset($_POST['count']) ? $_POST['count'] : 1));
            $title  = 'GM Gift';
            $reason = isset($_POST['reason']) ? $_POST['reason'] : 'GM Gift';
            if (!$pid || !$itemId) {
                echo json_encode(array('ok' => false, 'msg' => 'Missing playerId or itemId'));
                break;
            }
            // Resolve playerId to playerName (MailService needs name)
            $targetName = $pid;
            if (ctype_digit($pid)) {
                $pr = db_query("SELECT playerName FROM t_player WHERE playerId=? LIMIT 1", array($pid), $dbName);
                if (!empty($pr[0]['playerName'])) $targetName = $pr[0]['playerName'];
            }
            $result = api_mail_gift($targetName, $itemId, $count, $title, $reason);
            if (!empty($result['error'])) {
                $result = api_new_mail($targetName, $itemId, $count, $title, $reason);
            }
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Broadcast gift to all online ──────────────────────────────
        case 'gift_all':
            $itemId = isset($_POST['itemId']) ? $_POST['itemId'] : '';
            $count  = max(1, (int)(isset($_POST['count']) ? $_POST['count'] : 1));
            $reason = isset($_POST['reason']) ? $_POST['reason'] : 'Server Event Gift';
            if (!$itemId) { echo json_encode(array('ok' => false, 'msg' => 'No itemId')); break; }
            $result = api_new_mail('', $itemId, $count, 'Server Gift', $reason);
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Recharge packages ─────────────────────────────────────────
        case 'recharge_list':
            $pkgs = load_recharge_packages();
            echo json_encode(array('ok' => true, 'data' => $pkgs));
            break;

        // ── Set one package price ─────────────────────────────────────
        case 'recharge_set_price':
            $id    = (int)(isset($_POST['id'])  ? $_POST['id']  : 0);
            $price = (int)(isset($_POST['rmb']) ? $_POST['rmb'] : -1);
            if ($id <= 0 || $price < 0) {
                echo json_encode(array('ok' => false, 'msg' => 'Bad params')); break;
            }
            $pkgs  = load_recharge_packages();
            $found = false;
            foreach ($pkgs as &$pkg) {
                if ((int)$pkg['id'] === $id) {
                    $pkg['RMB'] = $price;
                    $found = true;
                    break;
                }
            }
            unset($pkg);
            if (!$found) { echo json_encode(array('ok' => false, 'msg' => 'Package not found')); break; }
            $ok = save_recharge_packages($pkgs);
            echo json_encode(array('ok' => (bool)$ok, 'msg' => $ok ? 'Saved (restart server to apply)' : 'Write failed'));
            break;

        // ── Set ALL recharge prices to 0 (free) ──────────────────────
        case 'recharge_free_all':
            $pkgs = load_recharge_packages();
            foreach ($pkgs as &$pkg) { $pkg['RMB'] = 0; }
            unset($pkg);
            $ok = save_recharge_packages($pkgs);
            echo json_encode(array('ok' => (bool)$ok, 'msg' => $ok ? 'All set to FREE (restart server to apply)' : 'Write failed'));
            break;

        // ── Restore recharge prices from backup ───────────────────────
        case 'recharge_restore':
            $data = isset($_POST['data']) ? $_POST['data'] : '';
            $pkgs = @json_decode($data, true);
            if (!$pkgs) { echo json_encode(array('ok' => false, 'msg' => 'Bad data')); break; }
            $ok = save_recharge_packages($pkgs);
            echo json_encode(array('ok' => (bool)$ok));
            break;

        // ── Component switches ────────────────────────────────────────
        case 'switch_list':
            $result = api_call('componentSwitch', array('name' => ''));
            if (!empty($result['error'])) {
                $result = array('switches' => load_component_switches());
            }
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        case 'switch_toggle':
            $name   = isset($_POST['name'])   ? $_POST['name']   : '';
            $enable = (int)(isset($_POST['enable']) ? $_POST['enable'] : 0);
            if (!$name) { echo json_encode(array('ok' => false, 'msg' => 'No name')); break; }
            $result = api_call('componentSwitch', array(
                'name'  => $name,
                'state' => $enable ? '1' : '0',
            ));
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Server notice / pop-up message ───────────────────────────
        case 'send_notice':
            $msg = trim(isset($_POST['message']) ? $_POST['message'] : '');
            if (!$msg) { echo json_encode(array('ok' => false, 'msg' => 'Empty message')); break; }
            $result = api_call('syspop', array('content' => $msg, 'key' => 'ddgg5bjjflasd12345531'));
            if (!empty($result['error'])) {
                $result = api_call('SystemPopMsgService', array('content' => $msg, 'key' => 'ddgg5bjjflasd12345531'));
            }
            echo json_encode(array('ok' => true, 'result' => $result));
            break;

        // ── Item catalog ──────────────────────────────────────────────
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
<title>GM Panel — MYH5</title>
<style>
:root {
  --bg: #0f1117; --card: #1a1d27; --border: #2a2d3e;
  --accent: #5865f2; --accent2: #eb459e; --success: #23d160;
  --warn: #ffdd57; --danger: #ff3860; --text: #e0e0f0; --muted: #7a7d9a;
  --gold: #ffd700;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font: 14px/1.5 'Segoe UI', sans-serif; }

/* ── Login ── */
.login-wrap { display:flex; align-items:center; justify-content:center; min-height:100vh; }
.login-box { background:var(--card); border:1px solid var(--border); border-radius:12px;
             padding:40px; width:360px; }
.login-box h1 { font-size:22px; margin-bottom:24px; color:var(--accent); }
.login-box select, .login-box input[type=password] {
  width:100%; padding:10px 12px; background:#12141e; border:1px solid var(--border);
  border-radius:6px; color:var(--text); margin-bottom:12px; font-size:14px; }
.login-box .err { color:var(--danger); margin-bottom:10px; font-size:13px; }

/* ── Layout ── */
.shell { display:flex; height:100vh; }
.sidebar { width:200px; min-width:200px; background:var(--card); border-right:1px solid var(--border);
           display:flex; flex-direction:column; padding:16px 0; }
.sidebar-logo { padding:0 16px 16px; font-size:18px; font-weight:700; color:var(--accent); border-bottom:1px solid var(--border); }
.sidebar-logo span { font-size:11px; color:var(--muted); display:block; font-weight:400; }
.sidebar nav a { display:flex; align-items:center; gap:10px; padding:10px 16px;
                 color:var(--muted); text-decoration:none; transition:.15s; border-left:3px solid transparent; }
.sidebar nav a:hover, .sidebar nav a.active { color:var(--text); background:rgba(88,101,242,.12); border-left-color:var(--accent); }
.sidebar-bottom { margin-top:auto; padding:12px 16px; font-size:12px; color:var(--muted); border-top:1px solid var(--border); }
.sidebar-bottom a { color:var(--muted); text-decoration:none; }
.main { flex:1; overflow:auto; padding:24px; }

/* ── Tab pages ── */
.page { display:none; }
.page.active { display:block; }
.page-title { font-size:20px; font-weight:700; margin-bottom:20px; }
.page-title small { font-size:13px; color:var(--muted); font-weight:400; margin-left:8px; }

/* ── Cards ── */
.card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:18px; margin-bottom:16px; }
.card-title { font-size:14px; font-weight:700; color:var(--muted); text-transform:uppercase;
              letter-spacing:.05em; margin-bottom:12px; }

/* ── Forms ── */
.row { display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end; margin-bottom:12px; }
.field { display:flex; flex-direction:column; gap:4px; }
.field label { font-size:12px; color:var(--muted); }
.field input, .field select, .field textarea {
  background:#12141e; border:1px solid var(--border); border-radius:6px;
  color:var(--text); padding:8px 10px; font-size:13px; min-width:140px; }
.field input:focus, .field select:focus { outline:none; border-color:var(--accent); }
.field textarea { resize:vertical; min-height:60px; }

/* ── Buttons ── */
.btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px;
       border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600;
       transition:.15s; text-decoration:none; }
.btn-primary { background:var(--accent); color:#fff; }
.btn-primary:hover { background:#4752c4; }
.btn-success { background:var(--success); color:#000; }
.btn-warn    { background:var(--warn); color:#000; }
.btn-danger  { background:var(--danger); color:#fff; }
.btn-ghost   { background:transparent; border:1px solid var(--border); color:var(--text); }
.btn-ghost:hover { background:var(--border); }
.btn-sm { padding:5px 10px; font-size:12px; }

/* ── Table ── */
.tbl-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th { background:#12141e; color:var(--muted); text-align:left; padding:8px 12px;
     font-size:11px; text-transform:uppercase; letter-spacing:.04em; position:sticky; top:0; }
td { padding:8px 12px; border-bottom:1px solid var(--border); }
tr:hover td { background:rgba(255,255,255,.025); }
.badge { display:inline-block; padding:2px 7px; border-radius:999px; font-size:11px; font-weight:700; }
.badge-online  { background:#1a3a2a; color:var(--success); }
.badge-offline { background:#2a1a1a; color:#888; }
.badge-vip     { background:#3a2a00; color:var(--gold); }
.quality-0 { color:#aaa; } .quality-1 { color:#6cf; } .quality-2 { color:#a6f; }
.quality-3 { color:#fa6; } .quality-4 { color:#f64; } .quality-5 { color:var(--gold); }

/* ── Toast ── */
#toast { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; }
.toast { padding:12px 18px; border-radius:8px; font-size:13px; font-weight:600;
         animation:slideIn .3s ease; max-width:360px; }
.toast-ok   { background:#1a3a2a; border:1px solid var(--success); color:var(--success); }
.toast-err  { background:#3a1a1a; border:1px solid var(--danger); color:var(--danger); }
.toast-info { background:#1a1e3a; border:1px solid var(--accent); color:#aaf; }
@keyframes slideIn { from{transform:translateX(60px);opacity:0} to{transform:none;opacity:1} }

/* ── Modal ── */
.modal-backdrop { display:none; position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:500;
                  align-items:center; justify-content:center; }
.modal-backdrop.open { display:flex; }
.modal { background:var(--card); border:1px solid var(--border); border-radius:12px;
         padding:24px; width:520px; max-width:95vw; }
.modal h2 { font-size:16px; margin-bottom:16px; }

/* ── Misc ── */
.stat-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:12px; margin-bottom:20px; }
.stat { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:14px 16px; }
.stat-val { font-size:22px; font-weight:700; margin-bottom:2px; }
.stat-lbl { font-size:11px; color:var(--muted); text-transform:uppercase; }
.search-bar { display:flex; gap:8px; margin-bottom:16px; }
.search-bar input { flex:1; background:#12141e; border:1px solid var(--border); border-radius:6px;
                    color:var(--text); padding:9px 12px; font-size:13px; }
.search-bar input:focus { outline:none; border-color:var(--accent); }
.spinner { display:inline-block; width:14px; height:14px; border:2px solid var(--border);
           border-top-color:var(--accent); border-radius:50%; animation:spin .6s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }
.free-tag { color:var(--success); font-weight:700; }
.price-tag { color:var(--warn); }
.items-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:6px; max-height:300px; overflow-y:auto; }
.item-card { background:#12141e; border:1px solid var(--border); border-radius:6px; padding:8px;
             cursor:pointer; transition:.15s; }
.item-card:hover, .item-card.selected { border-color:var(--accent); background:rgba(88,101,242,.1); }
.item-name { font-size:12px; font-weight:600; }
.item-id   { font-size:11px; color:var(--muted); }
</style>
</head>
<body>
<?php if (!$isAuth): ?>
<!-- ══ LOGIN ══════════════════════════════════════════════════════════════ -->
<div class="login-wrap">
  <div class="login-box">
    <h1>&#9876; GM Panel</h1>
    <?php if (!empty($loginError)): ?>
      <div class="err"><?php echo htmlspecialchars($loginError); ?></div>
    <?php endif; ?>
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
<!-- ══ MAIN SHELL ════════════════════════════════════════════════════════ -->
<div class="shell">
  <aside class="sidebar">
    <div class="sidebar-logo">
      &#9876; GM Panel
      <span><?php echo htmlspecialchars($srvName); ?></span>
    </div>
    <nav>
      <a href="#" class="active" data-page="dashboard">&#128202; Dashboard</a>
      <a href="#" data-page="accounts">&#128101; Accounts</a>
      <a href="#" data-page="gift">&#127873; Gift Items</a>
      <a href="#" data-page="payment">&#128179; Payment Control</a>
      <a href="#" data-page="notice">&#128226; Notice</a>
    </nav>
    <div class="sidebar-bottom">
      <a href="?logout">Logout</a>
    </div>
  </aside>

  <main class="main">

    <!-- ── DASHBOARD ──────────────────────────────────────────────────── -->
    <div class="page active" id="page-dashboard">
      <div class="page-title">Dashboard <small>Quick overview</small></div>
      <div id="dash-stats" class="stat-grid">
        <div class="stat"><div class="stat-val" id="s-total">&#8212;</div><div class="stat-lbl">Total Accounts</div></div>
        <div class="stat"><div class="stat-val" id="s-online" style="color:var(--success)">&#8212;</div><div class="stat-lbl">Online Now</div></div>
        <div class="stat"><div class="stat-val" id="s-today">&#8212;</div><div class="stat-lbl">Logged In Today</div></div>
        <div class="stat"><div class="stat-val" id="s-vip" style="color:var(--gold)">&#8212;</div><div class="stat-lbl">VIP Players</div></div>
      </div>
      <div class="card">
        <div class="card-title">Recent Active Players</div>
        <div id="dash-recent"><div class="spinner"></div></div>
      </div>
    </div>

    <!-- ── ACCOUNTS ───────────────────────────────────────────────────── -->
    <div class="page" id="page-accounts">
      <div class="page-title">Accounts <small>Search &amp; manage players</small></div>
      <div class="card">
        <div class="search-bar">
          <input id="acc-search" placeholder="Search name or player ID..." oninput="debounceSearch()">
          <button class="btn btn-primary btn-sm" onclick="loadAccounts()">Search</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('acc-search').value='';loadAccounts()">Reset</button>
        </div>
        <div class="tbl-wrap">
          <table id="acc-table">
            <thead><tr>
              <th>Player ID</th><th>Name</th><th>Lv</th><th>VIP</th>
              <th>Gold</th><th>Jade</th><th>Status</th><th>Last Login</th><th>Actions</th>
            </tr></thead>
            <tbody id="acc-tbody"><tr><td colspan="9" style="color:var(--muted);text-align:center">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── GIFT ITEMS ──────────────────────────────────────────────────── -->
    <div class="page" id="page-gift">
      <div class="page-title">Gift Items <small>Send items to players</small></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

        <!-- Single player gift -->
        <div class="card">
          <div class="card-title">Gift to Single Player</div>
          <div class="field" style="margin-bottom:10px">
            <label>Player ID or Name</label>
            <input id="g-pid" placeholder="Player ID or Name">
          </div>
          <div class="field" style="margin-bottom:10px">
            <label>Item <span id="g-item-name" style="color:var(--accent)"></span></label>
            <input id="g-item-search" placeholder="Search item name or ID..." oninput="searchItems('g')">
          </div>
          <div id="g-items-grid" class="items-grid" style="margin-bottom:10px"></div>
          <input type="hidden" id="g-item-id">
          <div class="row">
            <div class="field"><label>Quantity</label><input id="g-count" type="number" value="1" min="1" style="width:80px"></div>
            <div class="field"><label>Reason</label><input id="g-reason" value="GM Gift" style="min-width:200px"></div>
          </div>
          <button class="btn btn-success" onclick="giftSingle()">Send Gift</button>
        </div>

        <!-- Broadcast gift -->
        <div class="card">
          <div class="card-title">Gift to All Online Players</div>
          <div class="field" style="margin-bottom:10px">
            <label>Item <span id="ga-item-name" style="color:var(--accent)"></span></label>
            <input id="ga-item-search" placeholder="Search item name or ID..." oninput="searchItems('ga')">
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

    <!-- ── PAYMENT CONTROL ─────────────────────────────────────────────── -->
    <div class="page" id="page-payment">
      <div class="page-title">Payment Control <small>Manage recharge packages</small></div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-title">Quick Actions</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-success" onclick="setAllFree()">Set ALL Packages FREE (RMB=0)</button>
          <button class="btn btn-warn"    onclick="restoreBackup()">Restore Original Prices</button>
          <button class="btn btn-ghost"   onclick="loadPayment()">Reload</button>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--muted)">
          Changes are written to the config file. Restart the game server for them to take effect.
        </div>
      </div>

      <div class="card">
        <div class="card-title">Recharge Packages</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Name</th><th>Type</th><th>Price (RMB)</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody id="pay-tbody"><tr><td colspan="6" style="color:var(--muted);text-align:center">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── NOTICE ──────────────────────────────────────────────────────── -->
    <div class="page" id="page-notice">
      <div class="page-title">Server Notice <small>Broadcast messages</small></div>
      <div class="card" style="max-width:600px">
        <div class="card-title">Send Pop-up Notice</div>
        <div class="field" style="margin-bottom:12px">
          <label>Message</label>
          <textarea id="notice-msg" placeholder="Enter message to broadcast to all players..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="sendNotice()">Send Notice</button>
      </div>
    </div>

  </main>
</div>

<!-- ── Gift single player modal ────────────────────────────────────────── -->
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
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
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
    if (pg === 'gift')      searchItems('g');
    if (pg === 'payment')   loadPayment();
  });
});

// ── Toast ─────────────────────────────────────────────────────────────────
function toast(msg, type) {
  type = type || 'info';
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type==='ok'?'ok':type==='err'?'err':'info');
  el.textContent = msg;
  document.getElementById('toast').appendChild(el);
  setTimeout(function() { el.remove(); }, 4000);
}

// ── POST helper ──────────────────────────────────────────────────────────
function post(action, data) {
  var url = 'index.php?ajax=' + action;
  var body = new URLSearchParams(data);
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: body
  }).then(function(r) { return r.json(); });
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function loadDashboard() {
  fetch('index.php?ajax=accounts&limit=200').then(function(r) { return r.json(); }).then(function(data) {
    var rows = data.data || [];
    document.getElementById('s-total').textContent  = rows.length;
    document.getElementById('s-online').textContent = rows.filter(function(x) { return x.onlineState=='1'||x.onlineState===1; }).length;
    var today = new Date().toISOString().slice(0,10);
    document.getElementById('s-today').textContent  = rows.filter(function(x) { return (x.lastLoginTime||'').startsWith(today); }).length;
    document.getElementById('s-vip').textContent    = rows.filter(function(x) { return parseInt(x.vipLevel||0)>0; }).length;
    document.getElementById('dash-recent').innerHTML = buildPlayerTable(rows.slice(0,10));
  });
}

// ── Accounts ──────────────────────────────────────────────────────────────
var searchTimer;
function debounceSearch() { clearTimeout(searchTimer); searchTimer = setTimeout(loadAccounts, 400); }

function loadAccounts() {
  var q = document.getElementById('acc-search').value;
  document.getElementById('acc-tbody').innerHTML = '<tr><td colspan="9" style="text-align:center"><span class="spinner"></span></td></tr>';
  fetch('index.php?ajax=accounts&q=' + encodeURIComponent(q) + '&limit=100').then(function(r) { return r.json(); }).then(function(data) {
    document.getElementById('acc-tbody').innerHTML = buildPlayerRows(data.data || []);
  });
}

function buildPlayerRows(rows) {
  if (!rows.length) return '<tr><td colspan="9" style="color:var(--muted);text-align:center">No results</td></tr>';
  return rows.map(function(p) {
    var online = p.onlineState=='1'||p.onlineState===1;
    return '<tr>' +
      '<td style="font-family:monospace;font-size:12px">' + p.playerId + '</td>' +
      '<td><strong>' + esc(p.playerName) + '</strong></td>' +
      '<td>' + (p.level||'—') + '</td>' +
      '<td>' + (p.vipLevel>0 ? '<span class="badge badge-vip">VIP ' + p.vipLevel + '</span>' : '—') + '</td>' +
      '<td>' + fmt(p.gold) + '</td>' +
      '<td>' + fmt(p.jade) + '</td>' +
      '<td><span class="badge ' + (online?'badge-online':'badge-offline') + '">' + (online?'Online':'Offline') + '</span></td>' +
      '<td style="font-size:12px;color:var(--muted)">' + (p.lastLoginTime||'').replace('T',' ').slice(0,16) + '</td>' +
      '<td><button class="btn btn-success btn-sm" onclick="openGiftModal(\'' + p.playerId + '\',\'' + esc(p.playerName) + '\')">Gift</button></td>' +
      '</tr>';
  }).join('');
}

function buildPlayerTable(rows) {
  var html = '<div class="tbl-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Lv</th><th>VIP</th><th>Status</th></tr></thead><tbody>';
  rows.forEach(function(p) {
    var online = p.onlineState=='1'||p.onlineState===1;
    html += '<tr>' +
      '<td style="font-family:monospace;font-size:12px">' + p.playerId + '</td>' +
      '<td>' + esc(p.playerName) + '</td><td>' + (p.level||'—') + '</td>' +
      '<td>' + (p.vipLevel>0 ? '<span class="badge badge-vip">VIP ' + p.vipLevel + '</span>' : '—') + '</td>' +
      '<td><span class="badge ' + (online?'badge-online':'badge-offline') + '">' + (online?'Online':'Offline') + '</span></td>' +
      '</tr>';
  });
  return html + '</tbody></table></div>';
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

var selectedItems = { g:'', ga:'', mg:'' };

function searchItems(prefix) {
  var qEl = document.getElementById(prefix+'-item-search');
  var q = qEl ? qEl.value.toLowerCase() : '';
  getItems().then(function(all) {
    var filtered = q ? all.filter(function(i) {
      return i.name.toLowerCase().indexOf(q) !== -1 || String(i.id).indexOf(q) !== -1;
    }) : all.slice(0,48);
    var grid = document.getElementById(prefix+'-items-grid');
    if (!grid) return;
    grid.innerHTML = filtered.slice(0,48).map(function(i) {
      return '<div class="item-card quality-' + i.quality + (selectedItems[prefix]==i.id?' selected':'') + '" ' +
             'onclick="selectItem(\'' + prefix + '\',\'' + i.id + '\',\'' + esc(i.name) + '\')">' +
             '<div class="item-name quality-' + i.quality + '">' + esc(i.name) + '</div>' +
             '<div class="item-id">#' + i.id + '</div></div>';
    }).join('');
  });
}

function selectItem(prefix, id, name) {
  selectedItems[prefix] = id;
  document.getElementById(prefix+'-item-id').value = id;
  var nameEl = document.getElementById(prefix+'-item-name');
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
  post('gift_item', {playerId:pid, itemId:itemId, count:count, reason:reason}).then(function(r) {
    toast(r.ok ? 'Gift sent to ' + pid : 'Failed: ' + JSON.stringify(r.result), r.ok?'ok':'err');
  });
}

function giftAll() {
  var itemId = document.getElementById('ga-item-id').value;
  var count  = document.getElementById('ga-count').value;
  var reason = document.getElementById('ga-reason').value;
  if (!itemId) { toast('Select an item first', 'err'); return; }
  if (!confirm('Send this item to ALL online players?')) return;
  post('gift_all', {itemId:itemId, count:count, reason:reason}).then(function(r) {
    toast(r.ok ? 'Broadcast sent' : 'Failed', r.ok?'ok':'err');
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
  post('gift_item', {playerId:modalPid, itemId:itemId, count:count, reason:reason}).then(function(r) {
    toast(r.ok ? 'Gift sent' : 'Failed: ' + JSON.stringify(r.result), r.ok?'ok':'err');
    if (r.ok) closeModal();
  });
}

// ── Payment ───────────────────────────────────────────────────────────────
var payBackup = null;

function loadPayment() {
  document.getElementById('pay-tbody').innerHTML = '<tr><td colspan="6" style="text-align:center"><span class="spinner"></span></td></tr>';
  fetch('index.php?ajax=recharge_list').then(function(r) { return r.json(); }).then(function(d) {
    var pkgs = d.data || [];
    if (!payBackup) payBackup = JSON.parse(JSON.stringify(pkgs));
    var typeMap = {99:'First Recharge', 1:'Monthly Card', 2:'Daily', 3:'Weekly', 4:'Total Recharge', 5:'Event', 0:'Normal'};
    document.getElementById('pay-tbody').innerHTML = pkgs.map(function(p) {
      return '<tr>' +
        '<td>' + p.id + '</td>' +
        '<td>' + esc(p.name) + '</td>' +
        '<td><span class="badge" style="background:#1a1e3a;color:#aaf">' + (typeMap[p.type]||'Type '+p.type) + '</span></td>' +
        '<td><span class="' + (p.RMB==0?'free-tag':'price-tag') + '">' + (p.RMB==0?'FREE':'Y'+p.RMB) + '</span></td>' +
        '<td>' + (p.RMB==0?'<span class="badge" style="background:#1a3a2a;color:var(--success)">FREE</span>':'<span class="badge badge-offline">Paid</span>') + '</td>' +
        '<td>' +
          '<button class="btn btn-success btn-sm" onclick="setPkgFree(' + p.id + ')">Set FREE</button> ' +
          '<button class="btn btn-ghost btn-sm" onclick="setPkgPrice(' + p.id + ',' + p.RMB + ')">Set Price</button>' +
        '</td></tr>';
    }).join('');
  });
}

function setPkgFree(id) {
  post('recharge_set_price', {id:id, rmb:0}).then(function(r) {
    toast(r.msg || (r.ok?'Done':'Error'), r.ok?'ok':'err');
    if (r.ok) loadPayment();
  });
}

function setPkgPrice(id, cur) {
  var v = prompt('New price in RMB (0 = free):', cur);
  if (v === null) return;
  var rmb = parseInt(v);
  if (isNaN(rmb) || rmb < 0) { toast('Invalid price', 'err'); return; }
  post('recharge_set_price', {id:id, rmb:rmb}).then(function(r) {
    toast(r.msg || (r.ok?'Done':'Error'), r.ok?'ok':'err');
    if (r.ok) loadPayment();
  });
}

function setAllFree() {
  if (!confirm('Set ALL recharge packages to FREE (RMB=0)?\nThis writes to the config file.')) return;
  post('recharge_free_all', {}).then(function(r) {
    toast(r.msg || (r.ok?'Done':'Error'), r.ok?'ok':'err');
    if (r.ok) { payBackup = null; loadPayment(); }
  });
}

function restoreBackup() {
  if (!payBackup) { toast('No backup in memory (refresh page first)', 'err'); return; }
  if (!confirm('Restore original prices from session backup?')) return;
  post('recharge_restore', {data: JSON.stringify(payBackup)}).then(function(r) {
    toast(r.ok?'Restored':'Failed', r.ok?'ok':'err');
    if (r.ok) { payBackup = null; loadPayment(); }
  });
}

// ── Notice ────────────────────────────────────────────────────────────────
function sendNotice() {
  var msg = document.getElementById('notice-msg').value.trim();
  if (!msg) { toast('Enter a message', 'err'); return; }
  post('send_notice', {message: msg}).then(function(r) {
    toast(r.ok ? 'Notice sent' : ('Failed: ' + (r.msg || '')), r.ok ? 'ok' : 'err');
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmt(n) { return parseInt(n||0).toLocaleString(); }

// ── Init ──────────────────────────────────────────────────────────────────
loadDashboard();
</script>
<?php endif; ?>
</body>
</html>
