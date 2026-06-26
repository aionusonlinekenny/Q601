<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
/**
 * Payment trampoline.
 * - Payment OFF (free mode): deliver items directly via game mail API, show success page.
 * - Payment ON: generate signed URL and redirect to PayPal payment page.
 *
 * Usage: /pay/go.php?pkg=PACKAGE_ID&player=PLAYER_NAME[&sid=SERVER_ID]
 *
 * Purchase tracking (free mode):
 *   pay/purchase_history.json stores {"player:pkg:sid": count, ...}
 *   - oneRewards sent only on FIRST purchase of each package per player.
 *   - rewards sent every time (repeatable purchases like Magic Stones).
 *   - type=1 (First Recharge) and type=99 (Special First Recharge): blocked after first purchase.
 */
require_once dirname(__DIR__) . '/gm/includes/config.php';
require_once dirname(__DIR__) . '/gm/includes/api.php';

$pkg    = isset($_GET['pkg'])    ? trim($_GET['pkg'])    : '';
$player = isset($_GET['player']) ? trim($_GET['player']) : '';
$sid    = isset($_GET['sid'])    ? (int)$_GET['sid']     : 1;

if (!$pkg || !$player) {
    http_response_code(400);
    echo 'Missing pkg or player';
    exit;
}

// ── Read payment state ─────────────────────────────────────────────────────
$payState  = array();
if (file_exists(PAYMENT_STATE_FILE)) {
    $payState = @json_decode(file_get_contents(PAYMENT_STATE_FILE), true);
}
$paymentOn = isset($payState['payment_enabled']) ? (bool)$payState['payment_enabled'] : true;

// ── Purchase history helpers ───────────────────────────────────────────────
$historyFile = dirname(__FILE__) . '/purchase_history.json';

function load_history() {
    global $historyFile;
    if (!file_exists($historyFile)) return array();
    $data = @json_decode(file_get_contents($historyFile), true);
    return is_array($data) ? $data : array();
}

function save_history($history) {
    global $historyFile;
    file_put_contents($historyFile, json_encode($history, JSON_PRETTY_PRINT));
}

function get_purchase_count($history, $player, $pkg, $sid) {
    $key = $player . ':' . $pkg . ':' . $sid;
    return isset($history[$key]) ? (int)$history[$key] : 0;
}

function increment_purchase($history, $player, $pkg, $sid) {
    $key = $player . ':' . $pkg . ':' . $sid;
    $history[$key] = get_purchase_count($history, $player, $pkg, $sid) + 1;
    return $history;
}

// ── Payment OFF: deliver items for free ────────────────────────────────────
if (!$paymentOn) {
    $pkgs    = load_recharge_packages();
    $pkgData = null;
    foreach ($pkgs as $p) {
        if ((string)$p['id'] === (string)$pkg) { $pkgData = $p; break; }
    }

    $delivered = array();
    $failed    = false;
    $alreadyClaimed = false;

    if ($pkgData) {
        $history = load_history();
        $prevCount = get_purchase_count($history, $player, $pkg, $sid);
        $pkgType = isset($pkgData['type']) ? (int)$pkgData['type'] : 0;
        $isFirstRecharge = ($pkgType === 1 || $pkgType === 99);

        // First Recharge packages (type 1, 99): only claimable once
        if ($isFirstRecharge && $prevCount > 0) {
            $alreadyClaimed = true;
        }

        if (!$alreadyClaimed) {
            $isFirstTime = ($prevCount === 0);
            $pkgId = (int)$pkgData['id'];
            $rmb   = isset($pkgData['RMB']) ? (int)$pkgData['RMB'] : 0;
            $apiLog = array();

            $servers = unserialize(SERVERS);
            $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8081';

            // Try server pay API first — handles items + bonuses (monthly card, bag slots, etc.)
            $serverHandled = false;
            if ($rmb > 0) {
                $payResult = api_pay_notify($player, $pkgId, $rmb, $sid);
                $apiLog[] = 'pay_notify=' . json_encode($payResult);
                if (isset($payResult['success']) && $payResult['success']) {
                    $serverHandled = true;
                    $delivered[] = 'via_server_pay';
                }
            }

            // Fallback: if server pay failed (player offline, etc.), send items via direct DB mail
            if (!$serverHandled) {
                $parts = array();
                if ($isFirstTime && isset($pkgData['oneRewards']) && $pkgData['oneRewards']) {
                    $parts[] = $pkgData['oneRewards'];
                }
                if (isset($pkgData['rewards']) && $pkgData['rewards']) {
                    $parts[] = $pkgData['rewards'];
                }
                $rewardStr = implode(';', $parts);

                $itemParts = array();
                foreach (explode(';', $rewardStr) as $part) {
                    $part = trim($part);
                    if (!$part) continue;
                    $choice = explode('&', $part);
                    $pieces = explode('_', $choice[0]);
                    if (count($pieces) < 2) continue;
                    $itemId = $pieces[0];
                    $count  = (int)$pieces[1];
                    if (!$itemId || $count < 1) continue;
                    $itemParts[]  = $itemId . '_' . $count;
                    $delivered[]  = $itemId . 'x' . $count;
                }

                if (!empty($itemParts)) {
                    $combinedStr = implode(';', $itemParts);
                    $r = api_mail_gift_db_items($player, $combinedStr, $pkgData['name'], 'GM Gift', $sid);
                    $apiLog[] = $combinedStr . '=' . json_encode($r);
                    if (isset($r['success']) && $r['success'] === false) {
                        $failed = true;
                    }
                }
            }

            // Record purchase
            if (!$failed) {
                $history = increment_purchase($history, $player, $pkg, $sid);
                save_history($history);
            }

            $firstTag = $isFirstTime ? ' FIRST' : ' REPEAT';
            $log = date('Y-m-d H:i:s') . ' | FREE' . $firstTag . ' | player=' . $player
                 . ' pkg=' . $pkg . ' sid=' . $sid
                 . ' items=' . implode(',', $delivered)
                 . ' db=' . implode('|', $apiLog) . "\n";
            file_put_contents(dirname(__FILE__) . '/payment_log.txt', $log, FILE_APPEND);
        }
    }

    $pkgName = $pkgData ? htmlspecialchars($pkgData['name']) : 'Package #' . htmlspecialchars($pkg);
    ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Purchase Complete</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f1117;color:#e0e0f0;font:15px/1.6 'Segoe UI',sans-serif;
     display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
.box{background:#1a1d27;border:1px solid #2a2d3e;border-radius:16px;
     padding:40px 32px;width:360px;max-width:95vw}
.icon{font-size:60px;margin-bottom:16px}
h1{font-size:22px;font-weight:700;color:#fff;margin-bottom:8px}
.sub{font-size:14px;color:#7a7d9a;margin-bottom:20px}
.pkg{background:#12141e;border-radius:8px;padding:10px 16px;font-size:14px;
     color:#aaf;margin-bottom:20px;font-weight:600}
.note{font-size:12px;color:#7a7d9a;margin-bottom:20px}
.close-btn{background:#23d160;color:#000;border:none;border-radius:8px;
           padding:12px 28px;font-size:15px;font-weight:700;cursor:pointer;width:100%}
.err-box{background:#3a1a1a;border:1px solid #ff3860;border-radius:10px;
         padding:20px;color:#ff3860}
.warn-box{background:#3a3a1a;border:1px solid #ffdd57;border-radius:10px;
         padding:20px;color:#ffdd57;margin-bottom:20px}
</style>
</head>
<body>
<div class="box">
<?php if (!$pkgData): ?>
  <div class="err-box">Package not found.</div>
<?php elseif ($alreadyClaimed): ?>
  <div class="icon">⚠️</div>
  <h1>Already Claimed</h1>
  <div class="sub">You have already claimed this<br>First Recharge reward.</div>
  <div class="pkg"><?php echo $pkgName; ?></div>
  <button class="close-btn" onclick="window.close()">Close</button>
<?php elseif ($failed): ?>
  <div class="icon">⚠️</div>
  <h1>Delivery Issue</h1>
  <div class="sub">Could not reach the game server.<br>Please ask admin to resend items.</div>
  <div class="pkg"><?php echo $pkgName; ?></div>
  <button class="close-btn" onclick="window.close()">Close</button>
<?php else: ?>
  <div class="icon">✅</div>
  <h1>Purchase Complete!</h1>
  <div class="sub">Your items have been sent to your<br>in-game mailbox.</div>
  <div class="pkg"><?php echo $pkgName; ?></div>
  <div class="note">Open your in-game mailbox to collect your rewards.</div>
  <button class="close-btn" onclick="window.close()">Close</button>
<?php endif; ?>
</div>
</body>
</html>
    <?php
    exit;
}

// ── Payment ON: redirect to PayPal ─────────────────────────────────────────
$sign = md5($pkg . $player . API_KEY);
$url  = '/pay/?pkg='    . urlencode($pkg)
      . '&player='      . urlencode($player)
      . '&sid='         . $sid
      . '&s='           . $sign;
header('Location: ' . $url);
exit;
