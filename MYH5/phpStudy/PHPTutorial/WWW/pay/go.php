<?php
/**
 * Payment trampoline — generates signed URL for the PayPal payment page.
 * Called by the game client JS instead of the Alipay SDK.
 * Usage: /pay/go.php?pkg=PACKAGE_ID&player=PLAYER_NAME
 */
require_once dirname(__DIR__) . '/gm/includes/config.php';

$pkg    = isset($_GET['pkg'])    ? trim($_GET['pkg'])    : '';
$player = isset($_GET['player']) ? trim($_GET['player']) : '';

if (!$pkg || !$player) {
    http_response_code(400);
    echo 'Missing pkg or player';
    exit;
}

$sign = md5($pkg . $player . API_KEY);
$url  = '/pay/?pkg=' . urlencode($pkg) . '&player=' . urlencode($player) . '&s=' . $sign;

header('Location: ' . $url);
exit;
