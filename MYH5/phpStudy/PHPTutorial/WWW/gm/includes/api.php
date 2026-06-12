<?php
/**
 * Game Server HTTP API
 *
 * Two HTTP servers run in server.jar:
 *  - Jetty  on httpPort (e.g. 8081): /myh5/sendmail  /myh5/pay
 *  - Tomcat on httpPort (same):      /game/services  — usually blocked by Jetty
 *
 * In practice Jetty wins the port race, so only the /myh5/* endpoints work.
 *
 * HttpSendMail signature: MD5_upper(type + title + content + itemStr + time + GM_KEY)
 * GM_KEY (hardcoded in class): ddgg5bjjflasd12345531
 */
define('JETTY_GM_KEY', 'ddgg5bjjflasd12345531');

/**
 * Send a mail gift to a player via Jetty /myh5/sendmail.
 * type=0  → individual player (targetId = role/character name)
 * type=1  → broadcast to all players online
 */
function api_mail_gift($roleName, $itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $apiBase = null) {
    if (!$apiBase) {
        $servers = unserialize(SERVERS);
        $sid = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
        $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8081';
    }

    $type     = 0;
    $itemStr  = $itemId . ':' . $count;
    $time     = (int)(time());
    $serverId = isset($_SESSION['server_id']) ? (int)$_SESSION['server_id'] : 1;

    // Signature: MD5_upper(type + title + content + itemStr + time + GM_KEY)
    $signStr  = $type . $title . $content . $itemStr . $time . JETTY_GM_KEY;
    $sign     = strtoupper(md5($signStr));

    $url  = rtrim($apiBase, '/') . '/myh5/sendmail';
    $post = http_build_query(array(
        'type'     => $type,
        'title'    => $title,
        'content'  => $content,
        'itemStr'  => $itemStr,
        'time'     => $time,
        'signstr'  => $sign,
        'serverId' => $serverId,
        'targetId' => $roleName,
    ));

    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $post,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ));
    $resp = curl_exec($ch);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err || $resp === false) {
        return array('success' => false, 'error' => $err ? $err : 'No response');
    }
    $json = @json_decode($resp, true);
    return $json !== null ? $json : array('success' => true, 'raw' => $resp);
}

/**
 * Call ServicesServlet on Tomcat (port 8090+, patched server_patched.jar).
 * Uses 'tcat' URL from config — separate port that no longer conflicts with Jetty.
 */
function api_call($action, $params = array(), $apiBase = null) {
    if (!$apiBase) {
        $servers = unserialize(SERVERS);
        $sid = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
        // Use tcat (Tomcat) URL if set, fall back to api URL
        if (isset($servers[$sid]['tcat'])) {
            $apiBase = $servers[$sid]['tcat'];
        } else {
            $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8090';
        }
    }
    $url = rtrim($apiBase, '/') . '/game/services';
    $params['action'] = $action;

    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($params),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ));
    $resp = curl_exec($ch);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err || $resp === false) {
        return array('success' => false, 'error' => $err ? $err : 'No response');
    }
    $json = @json_decode($resp, true);
    return $json !== null ? $json : array('success' => true, 'raw' => $resp);
}

/**
 * Broadcast mail to all online players via /myh5/sendmail (type=1).
 * Same signature scheme as api_mail_gift.
 */
function api_broadcast_mail($itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $apiBase = null) {
    if (!$apiBase) {
        $servers = unserialize(SERVERS);
        $sid = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
        $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8081';
    }

    $type     = 1;
    $itemStr  = $itemId . ':' . $count;
    $time     = (int)(time());
    $serverId = isset($_SESSION['server_id']) ? (int)$_SESSION['server_id'] : 1;

    $signStr  = $type . $title . $content . $itemStr . $time . JETTY_GM_KEY;
    $sign     = strtoupper(md5($signStr));

    $url  = rtrim($apiBase, '/') . '/myh5/sendmail';
    $post = http_build_query(array(
        'type'     => $type,
        'title'    => $title,
        'content'  => $content,
        'itemStr'  => $itemStr,
        'time'     => $time,
        'signstr'  => $sign,
        'serverId' => $serverId,
        'targetId' => '',
    ));

    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $post,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ));
    $resp = curl_exec($ch);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err || $resp === false) {
        return array('success' => false, 'error' => $err ? $err : 'No response');
    }
    $json = @json_decode($resp, true);
    return $json !== null ? $json : array('success' => true, 'raw' => $resp);
}

/** Load all items from propsItem.json + equipItem.json for item picker */
function load_item_catalog($confDir = CONF_DIR) {
    $files = array(
        $confDir . '/item/propsItem.json',
        $confDir . '/item/equipItem.json',
        $confDir . '/item/giftConfig.json',
    );
    $items = array();
    foreach ($files as $f) {
        if (!file_exists($f)) continue;
        $data = @json_decode(file_get_contents($f), true);
        if (!$data) continue;
        foreach ($data as $id => $info) {
            $prop    = isset($info['property']) ? $info['property'] : $info;
            $name    = isset($prop['name']) ? $prop['name'] : (isset($prop['itemName']) ? $prop['itemName'] : $id);
            $type    = isset($prop['itemType']) ? $prop['itemType'] : 0;
            $quality = isset($prop['quality'])  ? $prop['quality']  : 0;
            $items[$id] = array(
                'id'      => $id,
                'name'    => $name,
                'type'    => $type,
                'quality' => $quality,
            );
        }
    }
    uasort($items, function($a, $b) { return strcmp($a['name'], $b['name']); });
    return $items;
}

/** Load recharge packages */
function load_recharge_packages($confDir = CONF_DIR) {
    $f = $confDir . '/gameRecharge/gameRecharge.json';
    if (!file_exists($f)) return array();
    $data = @json_decode(file_get_contents($f), true);
    return is_array($data) ? $data : array();
}

/** Save recharge packages back to JSON */
function save_recharge_packages($packages, $confDir = CONF_DIR) {
    $f = $confDir . '/gameRecharge/gameRecharge.json';
    return file_put_contents($f, json_encode($packages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/** Load component switch state from config */
function load_component_switches($confDir = CONF_DIR) {
    $f = $confDir . '/functions/functions.json';
    if (!file_exists($f)) return array();
    $data = @json_decode(file_get_contents($f), true);
    return is_array($data) ? $data : array();
}
