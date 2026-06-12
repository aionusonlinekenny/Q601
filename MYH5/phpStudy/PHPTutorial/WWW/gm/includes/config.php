<?php
// ── Database ──────────────────────────────────────────────────────────────
define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3306);
define('DB_NAME', 'myh5_s1');
define('DB_USER', 'root');
define('DB_PASS', '123456');

// ── Game servers (add more for s2, s3) ──────────────────────────────────
define('SERVERS', serialize([
    1 => ['name' => 'Server 1', 'api' => 'http://127.0.0.1:8081', 'db' => 'myh5_s1'],
    2 => ['name' => 'Server 2', 'api' => 'http://127.0.0.1:8082', 'db' => 'myh5_s2'],
    3 => ['name' => 'Server 3', 'api' => 'http://127.0.0.1:8083', 'db' => 'myh5_s3'],
]));

// ── GM HTTP API ───────────────────────────────────────────────────────────
define('API_KEY',  'ABC123');

// ── Paths to config JSONs (server 1) ─────────────────────────────────────
define('CONF_DIR', dirname(__DIR__, 4) . '/my_s1/conf');

// ── GM panel password ─────────────────────────────────────────────────────
define('GM_PASSWORD', 'gm123456');

// ── Session ───────────────────────────────────────────────────────────────
session_start();
