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
function api_mail_gift($roleName, $itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $apiBase = null, $serverId = null) {
    if (!$apiBase || $serverId === null) {
        $servers = unserialize(SERVERS);
        $sid = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
        if (!$apiBase) {
            $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8081';
        }
        if ($serverId === null) {
            $serverId = isset($_SESSION['server_id']) ? (int)$_SESSION['server_id'] : 1;
        }
    }

    $type    = 0;
    $itemStr = $itemId . '_' . $count;
    $time    = (int)(time());

    // Java's HttpSendMail.getDecodeString() runs URLDecoder on title/content after
    // Jetty's getParameter() already URL-decoded them. URLDecoder treats "+" as space,
    // so any literal "+" in the string becomes " " before the signature is computed.
    $signTitle   = str_replace('+', ' ', $title);
    $signContent = str_replace('+', ' ', $content);

    // Signature: MD5_upper(type + title + content + itemStr + time + GM_KEY)
    $signStr  = $type . $signTitle . $signContent . $itemStr . $time . JETTY_GM_KEY;
    $sign     = strtoupper(md5($signStr));

    $url  = rtrim($apiBase, '/') . '/myh5/sendmail';
    $post = http_build_query(array(
        'type'     => $type,
        'title'    => $signTitle,
        'content'  => $signContent,
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
 * Insert mail directly into the game DB — bypasses Jetty API.
 * Works for both online and offline players (player sees mail on next check or re-log).
 * Looks up player UUID by character name from the `player` table.
 * $itemStr format: "itemId_count" (single item per call).
 */
function api_mail_gift_db($roleName, $itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $sid = 1) {
    $servers = unserialize(SERVERS);
    $dbName  = isset($servers[$sid]['db']) ? $servers[$sid]['db'] : 'myh5_s1';

    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . $dbName . ';charset=utf8';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    } catch (PDOException $e) {
        return array('success' => false, 'error' => 'DB connect: ' . $e->getMessage());
    }

    // Accept UUID directly (from GM panel playerId field) or look up by character name
    if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $roleName)) {
        $playerId = $roleName;
    } else {
        $stmt = $pdo->prepare('SELECT id FROM player WHERE name = ? LIMIT 1');
        $stmt->execute(array($roleName));
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return array('success' => false, 'error' => 'Player not found in DB: ' . $roleName);
        }
        $playerId = $row['id'];
    }

    // Generate unique mailId (UUID v4 style)
    $mailId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));

    $itemStr  = $itemId . '_' . $count;
    // sprintf avoids 32-bit PHP integer overflow that would store a negative value
    $timeMs   = sprintf('%d000', time());

    $stmt = $pdo->prepare(
        'INSERT INTO mail (playerId, mailId, title, Content, gold, coin, bindGold, item, isRead, `time`, mailType)
         VALUES (?, ?, ?, ?, 0, 0, 0, ?, 0, ?, 2)'
    );
    try {
        $stmt->execute(array($playerId, $mailId, $title, $content, $itemStr, $timeMs));
        return array('success' => true, 'playerId' => $playerId, 'mailId' => $mailId);
    } catch (PDOException $e) {
        return array('success' => false, 'error' => 'DB insert: ' . $e->getMessage());
    }
}

/**
 * Insert a single mail with a pre-built item string (multiple items in one mail).
 * $itemStr format: "itemId_count;itemId_count;..."  (same as RewardItem.parse input)
 */
function api_mail_gift_db_items($roleName, $itemStr, $title = 'GM Gift', $content = 'GM Gift', $sid = 1) {
    $servers = unserialize(SERVERS);
    $dbName  = isset($servers[$sid]['db']) ? $servers[$sid]['db'] : 'myh5_s1';

    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . $dbName . ';charset=utf8';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    } catch (PDOException $e) {
        return array('success' => false, 'error' => 'DB connect: ' . $e->getMessage());
    }

    // Accept UUID directly (from GM panel playerId field) or look up by character name
    if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $roleName)) {
        $playerId = $roleName;
    } else {
        $stmt = $pdo->prepare('SELECT id FROM player WHERE name = ? LIMIT 1');
        $stmt->execute(array($roleName));
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return array('success' => false, 'error' => 'Player not found in DB: ' . $roleName);
        }
        $playerId = $row['id'];
    }

    $mailId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));

    $timeMs = sprintf('%d000', time());

    $stmt = $pdo->prepare(
        'INSERT INTO mail (playerId, mailId, title, Content, gold, coin, bindGold, item, isRead, `time`, mailType)
         VALUES (?, ?, ?, ?, 0, 0, 0, ?, 0, ?, 2)'
    );
    try {
        $stmt->execute(array($playerId, $mailId, $title, $content, $itemStr, $timeMs));
        return array('success' => true, 'playerId' => $playerId, 'mailId' => $mailId);
    } catch (PDOException $e) {
        return array('success' => false, 'error' => 'DB insert: ' . $e->getMessage());
    }
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
    $itemStr  = $itemId . '_' . $count;
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
