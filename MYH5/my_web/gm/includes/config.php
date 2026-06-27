<?php
// ── Database ──────────────────────────────────────────────────────────────
define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3306);
define('DB_NAME', 'myh5_s1');
define('DB_USER', 'root');
define('DB_PASS', '123456');

// Player table name — common variants: t_player, roleinfo, player, t_role
// Run db_test from the Accounts page to auto-detect the correct one.
define('DB_TABLE_PLAYER', 't_player');

// ── Game servers ──────────────────────────────────────────────────────────
// 'api'  = Jetty port (httpPort in gameserver.properties) — /myh5/sendmail works here
// 'tcat' = Tomcat port (tcatPort in gameserver.properties, patched jar) — /game/services
define('SERVERS', serialize(array(
    1 => array('name' => 'Server 1', 'api' => 'http://127.0.0.1:8081', 'tcat' => 'http://127.0.0.1:8090', 'db' => 'myh5_s1'),
    2 => array('name' => 'Server 2', 'api' => 'http://127.0.0.1:8082', 'tcat' => 'http://127.0.0.1:8091', 'db' => 'myh5_s2'),
    3 => array('name' => 'Server 3', 'api' => 'http://127.0.0.1:8083', 'tcat' => 'http://127.0.0.1:8092', 'db' => 'myh5_s3'),
)));

// ── GM HTTP API ───────────────────────────────────────────────────────────
define('API_KEY', 'ABC123');

// ── Paths ─────────────────────────────────────────────────────────────────
// gm/includes/ -> gm/ -> my_web/ -> MYH5/  =>  MYH5/my_s1/conf
define('CONF_DIR', dirname(dirname(dirname(__DIR__))) . '/my_s1/conf');

// ── GM panel password ─────────────────────────────────────────────────────
define('GM_PASSWORD', 'gm123456');

// ── State files (stored in gm/) ───────────────────────────────────────────
define('PAYMENT_STATE_FILE', dirname(__DIR__) . '/payment_state.json');
define('PAYPAL_CONFIG_FILE',  dirname(__DIR__) . '/paypal_config.json');

// ── Game client path ──────────────────────────────────────────────────────
define('CLIENT_DIR', dirname(dirname(__DIR__)) . '/myh5_cilent');

// ── Session ───────────────────────────────────────────────────────────────
session_start();
