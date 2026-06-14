<?php
/**
 * PayPal Payment Page for Players
 * URL: /pay/?pkg=PACKAGE_ID&player=PLAYER_NAME&t=TIMESTAMP&s=SIGNATURE
 *
 * Signature: md5(pkg + player + timestamp + API_KEY)
 * The game server should link here when a player clicks "Buy".
 *
 * After successful PayPal payment, calls the game API to deliver the item.
 */
require_once dirname(__DIR__) . '/gm/includes/config.php';
require_once dirname(__DIR__) . '/gm/includes/api.php';

// ── Load PayPal config ────────────────────────────────────────────────────
function paypal_config() {
    $f = dirname(__DIR__) . '/gm/paypal_config.json';
    if (!file_exists($f)) return array('client_id' => '', 'secret' => '', 'mode' => 'sandbox');
    $d = @json_decode(file_get_contents($f), true);
    return is_array($d) ? $d : array('client_id' => '', 'secret' => '', 'mode' => 'sandbox');
}

// ── PayPal REST API helpers ───────────────────────────────────────────────
function paypal_api_url($path) {
    $cfg = paypal_config();
    $base = $cfg['mode'] === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    return $base . $path;
}

function paypal_get_token() {
    $cfg = paypal_config();
    $ch = curl_init(paypal_api_url('/v1/oauth2/token'));
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD        => $cfg['client_id'] . ':' . $cfg['secret'],
        CURLOPT_HTTPHEADER     => array('Accept: application/json'),
    ));
    $resp = curl_exec($ch);
    curl_close($ch);
    $data = @json_decode($resp, true);
    return isset($data['access_token']) ? $data['access_token'] : null;
}

function paypal_capture_order($orderId) {
    $token = paypal_get_token();
    if (!$token) return null;
    $ch = curl_init(paypal_api_url('/v2/checkout/orders/' . $orderId . '/capture'));
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => '{}',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        ),
    ));
    $resp = curl_exec($ch);
    curl_close($ch);
    return @json_decode($resp, true);
}

// ── AJAX: capture + deliver ───────────────────────────────────────────────
if (isset($_POST['ajax']) && $_POST['ajax'] === 'capture') {
    header('Content-Type: application/json');
    $orderId    = isset($_POST['orderID'])   ? $_POST['orderID']   : '';
    $playerName = isset($_POST['player'])    ? $_POST['player']    : '';
    $pkgId      = isset($_POST['pkg'])       ? $_POST['pkg']       : '';
    $sign       = isset($_POST['sign'])      ? $_POST['sign']      : '';

    // Verify signature
    $expectedSign = md5($pkgId . $playerName . API_KEY);
    if ($sign !== $expectedSign) {
        echo json_encode(array('ok' => false, 'msg' => 'Invalid signature'));
        exit;
    }

    // Load package
    $pkgs = load_recharge_packages();
    $pkg  = null;
    foreach ($pkgs as $p) {
        if ((string)$p['id'] === (string)$pkgId) { $pkg = $p; break; }
    }
    if (!$pkg) {
        echo json_encode(array('ok' => false, 'msg' => 'Package not found'));
        exit;
    }

    // Capture PayPal payment
    $capture = paypal_capture_order($orderId);
    if (!$capture || $capture['status'] !== 'COMPLETED') {
        echo json_encode(array('ok' => false, 'msg' => 'Payment not completed', 'capture' => $capture));
        exit;
    }

    // Deliver item via game API
    // Package typically contains itemId and itemCount — adjust field names to match your gameRecharge.json
    $itemId    = isset($pkg['itemId'])    ? $pkg['itemId']    :
                (isset($pkg['item'])      ? $pkg['item']      : '');
    $itemCount = isset($pkg['itemCount']) ? $pkg['itemCount'] :
                (isset($pkg['count'])     ? $pkg['count']     : 1);

    $result = null;
    if ($itemId) {
        $result = api_mail_gift($playerName, $itemId, $itemCount, 'Package: ' . $pkg['name'], 'Purchase via PayPal');
    }

    // Log to a simple file
    $log = date('Y-m-d H:i:s') . ' | player=' . $playerName . ' pkg=' . $pkgId . ' order=' . $orderId . ' delivered=' . ($itemId ? 'yes' : 'no_itemId') . "\n";
    file_put_contents(dirname(__FILE__) . '/payment_log.txt', $log, FILE_APPEND);

    echo json_encode(array('ok' => true, 'delivered' => !empty($result), 'pkg' => $pkg['name']));
    exit;
}

// ── Load request params ───────────────────────────────────────────────────
$pkgId      = isset($_GET['pkg'])    ? trim($_GET['pkg'])    : '';
$playerName = isset($_GET['player']) ? trim($_GET['player']) : '';
$sign       = isset($_GET['s'])      ? trim($_GET['s'])      : '';

// Verify signature
$expectedSign = md5($pkgId . $playerName . API_KEY);
$validSign = ($sign === $expectedSign);

// Load package details
$pkg   = null;
$error = null;
$ppCfg = paypal_config();

if (!$pkgId || !$playerName) {
    $error = 'Missing parameters.';
} elseif (!$validSign) {
    $error = 'Invalid payment link. Please retry from within the game.';
} elseif (empty($ppCfg['client_id'])) {
    $error = 'PayPal is not configured. Please contact the server admin.';
} else {
    $pkgs = load_recharge_packages();
    foreach ($pkgs as $p) {
        if ((string)$p['id'] === (string)$pkgId) { $pkg = $p; break; }
    }
    if (!$pkg) $error = 'Package not found.';
}

$signForCapture = md5($pkgId . $playerName . API_KEY);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Game Store — Purchase</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f1117;color:#e0e0f0;font:15px/1.6 'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
.box{background:#1a1d27;border:1px solid #2a2d3e;border-radius:16px;padding:36px;width:420px;max-width:95vw}
h1{font-size:20px;margin-bottom:6px;color:#fff}
.sub{font-size:13px;color:#7a7d9a;margin-bottom:24px}
.pkg-card{background:#12141e;border:1px solid #2a2d3e;border-radius:10px;padding:20px;margin-bottom:24px}
.pkg-name{font-size:18px;font-weight:700;margin-bottom:4px}
.pkg-price{font-size:28px;font-weight:700;color:#ffd700;margin:8px 0}
.pkg-note{font-size:12px;color:#7a7d9a}
.player-row{font-size:13px;color:#aaf;margin-bottom:16px;padding:8px 12px;background:#0f1117;border-radius:6px}
#paypal-button-container{min-height:45px}
.result{padding:16px;border-radius:8px;font-weight:600;margin-top:16px;display:none}
.result-ok{background:#1a3a2a;border:1px solid #23d160;color:#23d160}
.result-err{background:#3a1a1a;border:1px solid #ff3860;color:#ff3860}
.err-box{background:#3a1a1a;border:1px solid #ff3860;border-radius:10px;padding:24px;color:#ff3860;text-align:center}
</style>
</head>
<body>
<div class="box">
  <h1>Game Store</h1>
  <div class="sub">Complete your purchase below</div>

  <?php if ($error): ?>
    <div class="err-box"><?php echo htmlspecialchars($error); ?></div>
  <?php else: ?>
    <div class="pkg-card">
      <div class="pkg-name"><?php echo htmlspecialchars($pkg['name']); ?></div>
      <?php if (!empty($pkg['desc'])): ?>
        <div style="font-size:13px;color:#aaa;margin:4px 0"><?php echo htmlspecialchars($pkg['desc']); ?></div>
      <?php endif; ?>
      <div class="pkg-price">$<?php echo number_format($pkg['RMB'] / 6.5, 2); ?> USD</div>
      <div class="pkg-note">RMB <?php echo $pkg['RMB']; ?> &nbsp;|&nbsp; <?php echo htmlspecialchars($pkg['name']); ?></div>
    </div>

    <div class="player-row">Player: <strong><?php echo htmlspecialchars($playerName); ?></strong></div>

    <div id="paypal-button-container"></div>
    <div class="result" id="result-ok">
      ✅ Payment successful! Your items will be delivered shortly.
    </div>
    <div class="result" id="result-err"></div>

    <script src="https://www.paypal.com/sdk/js?client-id=<?php echo htmlspecialchars($ppCfg['client_id']); ?>&currency=USD"></script>
    <script>
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '<?php echo number_format($pkg['RMB'] / 6.5, 2); ?>',
              currency_code: 'USD'
            },
            description: '<?php echo addslashes(htmlspecialchars_decode($pkg['name'])); ?>'
          }]
        });
      },
      onApprove: function(data, actions) {
        return fetch('', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: new URLSearchParams({
            ajax:    'capture',
            orderID: data.orderID,
            player:  '<?php echo addslashes(htmlspecialchars_decode($playerName)); ?>',
            pkg:     '<?php echo addslashes($pkgId); ?>',
            sign:    '<?php echo $signForCapture; ?>'
          })
        }).then(function(r) { return r.json(); }).then(function(d) {
          document.getElementById('paypal-button-container').style.display = 'none';
          if (d.ok) {
            document.getElementById('result-ok').style.display = 'block';
          } else {
            var el = document.getElementById('result-err');
            el.textContent = 'Error: ' + (d.msg || 'Unknown error');
            el.style.display = 'block';
          }
        });
      },
      onError: function(err) {
        var el = document.getElementById('result-err');
        el.textContent = 'PayPal error: ' + err;
        el.style.display = 'block';
      }
    }).render('#paypal-button-container');
    </script>
  <?php endif; ?>
</div>
</body>
</html>
