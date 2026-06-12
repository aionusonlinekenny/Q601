<?php
/**
 * Call the game server GM HTTP API.
 * URL: http://host:port/game/services
 * Routing: POST field  action={ServiceName}
 *
 * Auth notes (from server decompilation):
 *  - MailService            -> no auth (IP whitelist only)
 *  - ComponentSwitchService -> no auth (IP whitelist only)
 *  - NewMailService         -> key=ddgg5bjjflasd12345531
 */
function api_call($action, $params = array(), $apiBase = null) {
    if (!$apiBase) {
        $servers = unserialize(SERVERS);
        $sid = isset($_SESSION['server_id']) ? $_SESSION['server_id'] : 1;
        $apiBase = isset($servers[$sid]['api']) ? $servers[$sid]['api'] : 'http://127.0.0.1:8081';
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
 * Send items via MailService (no auth, works online and offline).
 * itemString format: "itemId:count"
 */
function api_mail_gift($roleName, $itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $apiBase = null) {
    return api_call('mail', array(
        'roleName'   => $roleName,
        'itemString' => $itemId . ':' . $count,
        'title'      => $title,
        'content'    => $content,
    ), $apiBase);
}

/**
 * Send via NewMailService (broadcast capable).
 * Empty roleName = broadcast to all.
 */
function api_new_mail($roleName, $itemId, $count, $title = 'GM Gift', $content = 'GM Gift', $apiBase = null) {
    return api_call('newmail', array(
        'roleName'   => $roleName,
        'itemString' => $itemId . ':' . $count,
        'title'      => $title,
        'content'    => $content,
        'key'        => 'ddgg5bjjflasd12345531',
    ), $apiBase);
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
