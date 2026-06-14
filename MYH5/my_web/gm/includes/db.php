<?php
$GLOBALS['_db_last_error'] = '';

function db_connect($dbName = DB_NAME) {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . $dbName . ";charset=utf8mb4";
    try {
        return new PDO($dsn, DB_USER, DB_PASS, array(
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT            => 3,
        ));
    } catch (PDOException $e) {
        $GLOBALS['_db_last_error'] = $e->getMessage();
        return null;
    }
}

function db_last_error() { return $GLOBALS['_db_last_error']; }

function db_query($sql, $params = array(), $dbName = DB_NAME) {
    $pdo = db_connect($dbName);
    if (!$pdo) return array();
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        $GLOBALS['_db_last_error'] = $e->getMessage();
        return array();
    }
}

function db_exec($sql, $params = array(), $dbName = DB_NAME) {
    $pdo = db_connect($dbName);
    if (!$pdo) return false;
    try {
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    } catch (PDOException $e) {
        $GLOBALS['_db_last_error'] = $e->getMessage();
        return false;
    }
}

/** List all tables in a database */
function db_list_tables($dbName = DB_NAME) {
    $pdo = db_connect($dbName);
    if (!$pdo) return array();
    try {
        return $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        return array();
    }
}

/** List all databases visible to this user */
function db_list_databases() {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        return $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        return array();
    }
}

/** Describe columns of a table */
function db_describe($table, $dbName = DB_NAME) {
    $pdo = db_connect($dbName);
    if (!$pdo) return array();
    try {
        return $pdo->query("DESCRIBE `" . $table . "`")->fetchAll();
    } catch (PDOException $e) {
        return array();
    }
}

/** Auto-detect which table holds player/role data */
function db_find_player_table($dbName = DB_NAME) {
    $candidates = array('t_player', 'roleinfo', 'player', 't_role', 'role', 'player_info', 'role_info', 'roleInfo', 'PlayerInfo');
    $tables = db_list_tables($dbName);
    foreach ($candidates as $t) {
        if (in_array($t, $tables)) return $t;
    }
    return count($tables) > 0 ? $tables[0] : null;
}
