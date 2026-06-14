<?php
header('Content-Type: application/json');
// Use the same IP/hostname the browser used to reach the web server.
// This ensures the game client can also reach the game server (same machine).
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '127.0.0.1';
$ip   = preg_replace('/:\d+$/', '', $host); // strip port if present

echo '[{
        "id": "1",
        "name": "MoYu Zone 1",
        "port": "8025",
        "http_port": "8081",
        "ip": "' . $ip . '",
        "openTime": "2020-03-15 12:00:00",
        "status": "1",
        "version": "v1.1.9.1"
},{
        "id": "2",
        "name": "MoYu Zone 2",
        "port": "8026",
        "http_port": "8082",
        "ip": "' . $ip . '",
        "openTime": "2020-03-15 12:00:00",
        "status": "1",
        "version": "v1.1.9.1"
},{
        "id": "3",
        "name": "MoYu Zone 3",
        "port": "8027",
        "http_port": "8083",
        "ip": "' . $ip . '",
        "openTime": "2020-03-15 12:00:00",
        "status": "1",
        "version": "v1.1.9.1"
}]';
