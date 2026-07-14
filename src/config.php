<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
// Tự động nhận diện BASE_URL phù hợp cho Laragon (Virtual Host) và PHP server
$docRoot = rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$dir = rtrim(str_replace('\\', '/', __DIR__), '/');

if ($docRoot !== '' && stripos($dir, $docRoot) === 0) {
    $baseUrl = substr($dir, strlen($docRoot));
} else {
    $baseUrl = '/NguyenNgocHaThao_501250482/src/';
}
$baseUrl = '/' . ltrim($baseUrl, '/');
$baseUrl = rtrim($baseUrl, '/') . '/';

define('BASE_URL', $baseUrl);
define('ADMIN_URL', BASE_URL . 'Admin/');

// Kết nối DB
define('DB_HOST', getenv('MYSQL_HOST') ?: getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('MYSQL_PORT') ?: getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('MYSQL_DATABASE') ?: getenv('MYSQLDATABASE') ?: getenv('DB_NAME') ?: 'starshopticket');
define('DB_USER', getenv('MYSQL_USER') ?: getenv('MYSQLUSER') ?: getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('MYSQL_PASSWORD') ?: getenv('MYSQLPASSWORD') ?: getenv('MYSQL_ROOT_PASSWORD') ?: getenv('DB_PASS') ?: '');

session_start();
?>
